import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Socket } from 'socket.io-client';

function randomID(len: number): string {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url: string = window.location.href): URLSearchParams {
  let urlStr = url.split('?')[1] || '';
  return new URLSearchParams(urlStr);
}

interface VideoCallProps {
  socket?: Socket;
  userId?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ socket, userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const roomID = getUrlParams(location.search).get('roomID') || randomID(5);
  
  useEffect(() => {
    if (socket && userId) {
      socket.emit('call_started', {
        roomID,
        callerId: userId
      });
    }
    
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
      if (socket) {
        socket.emit('call_ended', {
          roomID,
          userId
        });
      }
    };
  }, [socket, userId, roomID]);
  
  const myMeeting = async (element: HTMLDivElement) => {
    const appID = 144934725;
    const serverSecret = "b6e3f7ba590dd679abea06c777796dc8";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomID, 
      userId || randomID(5), 
      userId || randomID(5)
    );
    
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
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
      onLeaveRoom: () => {
        navigate(-1); 
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