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

  useEffect(() => {
    // Listen for incoming calls
    if (socket) {
      socket.on('incoming_call', (data: IncomingCallData) => {
        console.log('Incoming call received:', data);
        setIncomingCall(data);
        
        // Play sound for incoming call
        try {
          const audio = new Audio('/sounds/call-ringtone.mp3'); // Add a ringtone to your public folder
          audio.loop = true;
          audio.play().catch(err => console.error('Error playing sound:', err));
          
          // Store audio instance to stop it when needed
          (window as any).callAudio = audio;
        } catch (err) {
          console.error('Error with audio playback:', err);
        }
      });
      
      socket.on('call_ended', () => {
        setIncomingCall(null);
        // Stop ringtone if playing
        if ((window as any).callAudio) {
          (window as any).callAudio.pause();
          (window as any).callAudio = null;
        }
      });
    }
    
    return () => {
      // Clean up listeners
      if (socket) {
        socket.off('incoming_call');
        socket.off('call_ended');
      }
      
      // Stop audio if component unmounts
      if ((window as any).callAudio) {
        (window as any).callAudio.pause();
        (window as any).callAudio = null;
      }
    };
  }, [socket]);

  const acceptCall = () => {
    if (incomingCall) {
      // Stop ringtone
      if ((window as any).callAudio) {
        (window as any).callAudio.pause();
        (window as any).callAudio = null;
      }
      
      // Notify caller that call was accepted
      socket.emit('call_accepted', {
        roomID: incomingCall.roomID,
        callerId: incomingCall.callerId,
        accepterId: userId
      });
      
      // Navigate to video call room
      navigate(`/video-call?roomID=${incomingCall.roomID}`);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      // Stop ringtone
      if ((window as any).callAudio) {
        (window as any).callAudio.pause();
        (window as any).callAudio = null;
      }
      
      // Notify caller that call was rejected
      socket.emit('call_rejected', {
        callerId: incomingCall.callerId
      });
      
      setIncomingCall(null);
    }
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Incoming Call</h3>
        <p className="mb-6">{incomingCall.callerName} is calling you</p>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={rejectCall}
            className="bg-red-500 text-white px-6 py-2 rounded-full flex items-center"
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            Decline
          </button>
          
          <button 
            onClick={acceptCall}
            className="bg-green-500 text-white px-6 py-2 rounded-full flex items-center"
          >
            <Phone className="mr-2 h-5 w-5" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;