// import * as React from 'react';
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';


// function randomID(len) {
//   let result = '';
//   if (result) return result;
//   var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
//     maxPos = chars.length,
//     i;
//   len = len || 5;
//   for (i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * maxPos));
//   }
//   return result;
// }

// export function getUrlParams(
//   url = window.location.href
// ) {
//   let urlStr = url.split('?')[1];
//   return new URLSearchParams(urlStr);
// }

// export default function App() {
//       const roomID = getUrlParams().get('roomID') || randomID(5);
//       let myMeeting = async (element) => {
//      // generate Kit Token
//       const appID = 144934725;
//       const serverSecret = "b6e3f7ba590dd679abea06c777796dc8";
//       const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  randomID(5),  randomID(5));

    
//      // Create instance object from Kit Token.
//       const zp = ZegoUIKitPrebuilt.create(kitToken);
//       // start the call
//       zp.joinRoom({
//         container: element,
//         sharedLinks: [
//           {
//             name: 'Personal link',
//             url:
//              window.location.protocol + '//' + 
//              window.location.host + window.location.pathname +
//               '?roomID=' +
//               roomID,
//           },
//         ],
//         scenario: {
//           mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
//         },
//       });

    
//   };

//   return (
//     <div
//       className="myCallContainer"
//       ref={myMeeting}
//       style={{ width: '100vw', height: '100vh' }}
//     ></div>
//   );
// }


import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Socket } from 'socket.io-client';

// Function to generate random ID (keep your existing function)
function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

// Parse URL parameters (keep your existing function)
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

interface VideoCallProps {
  socket?: Socket;
  userId?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ socket, userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get roomID from URL parameters
  const roomID = getUrlParams(location.search).get('roomID') || randomID(5);
  
  useEffect(() => {
    // If socket is provided, emit an event to notify the other user
    if (socket && userId) {
      socket.emit('call_initiated', {
        roomID,
        callerId: userId
      });
    }
    
    // Listen for call end event
    const handleBeforeUnload = () => {
      if (socket) {
        socket.emit('call_ended', {
          roomID,
          userId
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Emit call ended when component unmounts
      if (socket) {
        socket.emit('call_ended', {
          roomID,
          userId
        });
      }
    };
  }, [socket, userId, roomID]);
  
  const myMeeting = async (element) => {
    // generate Kit Token
    const appID = 144934725;
    const serverSecret = "b6e3f7ba590dd679abea06c777796dc8";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomID, 
      userId || randomID(5), 
      userId || randomID(5)
    );
    
    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url: `${window.location.protocol}//${window.location.host}/video-call?roomID=${roomID}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // Changed to one-on-one call
      },
      showPreJoinView: true,
      onLeaveRoom: () => {
        navigate(-1); // Go back when call ends
      }
    });
  };
  
  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default VideoCall;