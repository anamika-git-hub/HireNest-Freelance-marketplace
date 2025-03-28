import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Socket } from 'socket.io-client';
import axiosConfig from '../../service/axios';

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
  role?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ socket, userId, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  useEffect(() => {
    const getDisplayName = async () => {
      try {
        if (role === 'freelancer') {
          const response = await axiosConfig.get(`/users/freelancer-profile/${userId}`);
          setDisplayName(response.data.freelancer.name);
          console.log('Display name set (freelancer):', response.data.freelancer.name);
        } else if (role === 'client') {
          const response = await axiosConfig.get('/users/account-detail');
          const name = `${response.data.result.userDetails.firstname} ${response.data.result.userDetails.lastname}`;
          setDisplayName(name);
          console.log('Display name set (client):', name);
        } else {
          setDisplayName(`User-${userId?.substring(0, 5) || randomID(3)}`);
        }
      } catch (error) {
        console.error('Error fetching display name:', error);
        setDisplayName(`User-${userId?.substring(0, 5) || randomID(3)}`);
      } finally {
        setIsLoading(false);
      }
    };

    getDisplayName();
  }, [userId, role]);

  useEffect(() => {
    if (!isLoading && displayName && containerRef.current) {
      initializeMeeting();
    }
  }, [isLoading, displayName]);
  
  const initializeMeeting = async () => {
    if (!containerRef.current) return;
    
    const appID = 2047547384;
    const serverSecret = "6d2996a15c0f9143c020297ab07e274c";
    
    console.log('Using display name for video call:', displayName);
    
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appID, 
      serverSecret, 
      roomID, 
      userId || randomID(5), 
      displayName
    );
    
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    
    zp.joinRoom({
      container: containerRef.current,
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-xl mb-4">Preparing video call...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default VideoCall;