import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff } from 'lucide-react';
import { Socket } from 'socket.io-client';

interface IncomingCallData {
  roomID: string;
  callerId: string;
  callerName: string;
}

interface CallNotificationProps {
  socket: Socket;
  userId: string;
}

const CallNotification: React.FC<CallNotificationProps> = ({ socket, userId }) => {
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);
  const navigate = useNavigate();

  // Debug log to ensure component is mounted with correct props
  useEffect(() => {
    console.log('CallNotification mounted with userId:', userId);
    console.log('Socket connected:', socket?.connected);
  }, [userId, socket]);

  useEffect(() => {
    // Only set up listeners if socket exists and is connected
    if (!socket) {
      console.error('Socket is not available');
      return;
    }

    // Explicit handler for incoming call
    const handleIncomingCall = (data: IncomingCallData) => {
      console.log('Incoming call event received:', data);
      
      // If already in video call, auto-reject
      if (window.location.pathname.includes('/video-call')) {
        console.log('Auto-rejecting call as user is already in a call');
        socket.emit('call_rejected', {
          callerId: data.callerId
        });
        return;
      }
      
      setIncomingCall(data);
    };

    const handleCallEnded = (data: any) => {
      console.log('Call ended event received', data);
      setIncomingCall(null);
    };

    // Remove any existing listeners to prevent duplicates
    socket.off('incoming_call');
    socket.off('call_ended');
    socket.off('call_rejected');
    
    // Add listeners
    socket.on('incoming_call', handleIncomingCall);
    socket.on('call_accepted',()=>{
    })
    socket.on('call_ended', handleCallEnded);
    socket.on('call_rejected', handleCallEnded);
    
    console.log('Call notification listeners registered');
    
    // Force check socket connection
    if (!socket.connected) {
      console.warn('Socket not connected, attempting to reconnect');
      socket.connect();
    }

    return () => {
      // Clean up listeners
      socket.off('incoming_call', handleIncomingCall);

      socket.off('call_ended', handleCallEnded);
      socket.off('call_rejected', handleCallEnded);
      
      console.log('Call notification listeners removed');
    };
  }, [socket, navigate]);

  const acceptCall = () => {
    if (!incomingCall) return;
    
    console.log('Accepting call:', incomingCall);
    
    // Notify caller that call was accepted
    socket.emit('call_accepted', {
      roomID: incomingCall.roomID,
      callerId: incomingCall.callerId,
      accepterId: userId,
      role: localStorage.getItem('role') || 'guest'
    });
    
    // Navigate to video call room
    navigate(`/video-call?roomID=${incomingCall.roomID}`);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (!incomingCall) return;
    
    console.log('Rejecting call:', incomingCall);
    
    // Notify caller that call was rejected
    socket.emit('call_rejected', {
      callerId: incomingCall.callerId
    });
    
    setIncomingCall(null);
  };

  // If no incoming call, return null
  if (!incomingCall) {
    return null;
  }

  // Render the incoming call notification in the corner instead of full screen
  return (
    <div className="fixed top-20 right-4 max-w-xs w-full shadow-lg z-50 animate-bounce-once">
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-md">
        <h3 className="text-lg text-blue-700 font-semibold mb-2">Incoming Call</h3>
        <p className="mb-3 text-sm text-black">{incomingCall.callerName} is calling you</p>
        
        <div className="flex justify-between space-x-2">
          <button 
            onClick={rejectCall}
            className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
          >
            <PhoneOff className="mr-1 h-4 w-4" />
            Decline
          </button>
          
          <button 
            onClick={acceptCall}
            className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
          >
            <Phone className="mr-1 h-4 w-4" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;