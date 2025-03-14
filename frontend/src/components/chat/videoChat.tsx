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

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Socket } from 'socket.io-client';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const zegoRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const roomID = getUrlParams(location.search).get('roomID');
  
  useEffect(() => {
    audioRef.current = new Audio('/sounds/call-connected.mp3');
    
    if (!roomID) {
      setError('No roomID provided');
      console.error('No roomID provided');
      setTimeout(() => navigate('/messages'), 2000);
      return;
    }
    
    if (!socket || !userId) {
      setError('Connection issue. Please try again.');
      console.error('Socket or userId missing');
      setTimeout(() => navigate('/messages'), 2000);
      return;
    }
    
    try {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.error('Error playing sound:', err);
            document.addEventListener('click', function tryPlayAgain() {
              audioRef.current?.play();
              document.removeEventListener('click', tryPlayAgain);
            }, { once: true });
          });
        }
      }
    } catch (err) {
      console.error('Error playing sound:', err);
    }
    
    socket.emit('call_started', {
      roomID,
      userId
    });
    
    const handleCallEnded = () => {
      console.log('Call ended by other user');
      
      if (zegoRef.current) {
        try {
          zegoRef.current.destroy();
        } catch (e) {
          console.error('Error destroying Zego instance:', e);
        }
      }
      
      navigate('/messages');
    };
    
    socket.on('call_ended', handleCallEnded);
    
    return () => {
      socket.off('call_ended', handleCallEnded);
      
      socket.emit('call_ended', {
        roomID,
        userId
      });
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (zegoRef.current) {
        try {
          zegoRef.current.destroy();
        } catch (e) {
          console.error('Error destroying Zego instance:', e);
        }
      }
    };
  }, [socket, userId, roomID, navigate]);
  
  const myMeeting = async (element: HTMLDivElement) => {
    if (!roomID || !userId) return;
    
    try {
      setIsLoading(true);
      
      const appID = 144934725;
      const serverSecret = "b6e3f7ba590dd679abea06c777796dc8";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID, 
        serverSecret, 
        roomID, 
        userId, 
        userId  
      );
      
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zegoRef.current = zp; 
      
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url: `${window.location.protocol}//${window.location.host}/video-call?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: true,
        turnOnCameraWhenJoining: true,
        turnOnMicrophoneWhenJoining: true,
        useFrontFacingCamera: true,
        onJoinRoom: () => {
          setIsLoading(false);
          console.log('Joined room successfully');
        },
        onLeaveRoom: () => {
          socket?.emit('call_ended', {
            roomID,
            userId
          });
          navigate('/messages');
        },
        // onError: (error: any) => {
        //   console.error('Zego error:', error);
        //   setError('Failed to connect to call. Please try again.');
        //   setTimeout(() => navigate('/messages'), 2000);
        // }
      });
    } catch (error) {
      console.error('Error joining video call:', error);
      setError('Failed to connect to call. Please try again.');
      setTimeout(() => navigate('/messages'), 2000);
    }
  };
  
  const handleRef = (element: HTMLDivElement | null) => {
    if (element) {
      myMeeting(element);
    }
  };
  
  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="text-xl mb-4">{error}</div>
        <div className="text-sm">Redirecting to messages...</div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="text-xl mb-4">Connecting to call...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  return (
    <div
      className="video-call-container"
      ref={handleRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default VideoCall;