import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff } from 'lucide-react';
import { Socket } from 'socket.io-client';

interface OutgoingCallProps {
  socket: Socket;
  roomID: string;
  receiverId: string;
  receiverName: string;
  onCallEnded: () => void;
}

const OutgoingCall: React.FC<OutgoingCallProps> = ({ 
  socket, 
  roomID, 
  receiverId, 
  receiverName, 
  onCallEnded 
}) => {
  const [callStatus, setCallStatus] = useState<'calling' | 'accepted' | 'rejected' | 'failed'>('calling');
  const [statusMessage, setStatusMessage] = useState('Calling...');
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCallStatus('failed');
      setStatusMessage('No answer');
      
      socket.emit('call_ended', {
        roomID,
        userId: 'caller'
      });
    }, 30000);

    const handleCallAccepted = (data: any) => {
      if (data.roomID === roomID) {
        console.log('Call accepted:', data);
        setCallStatus('accepted');
        setStatusMessage('Call accepted');
        
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        navigate(`/video-call?roomID=${roomID}`);
      }
    };
    
    const handleCallRejected = () => {
      console.log('Call rejected');
      setCallStatus('rejected');
      setStatusMessage('Call rejected');
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      setTimeout(() => {
        onCallEnded();
      }, 2000);
    };
    
    const handleCallFailed = (data: any) => {
      console.log('Call failed:', data);
      setCallStatus('failed');
      setStatusMessage(data.reason || 'Call failed');
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      setTimeout(() => {
        onCallEnded();
      }, 2000);
    };

    socket.on('global_call_accepted',handleCallAccepted)
    // socket.on('call_accepted', handleCallAccepted);
    socket.on('global_call_rejected', handleCallRejected);
    socket.on('call_failed', handleCallFailed);
    
    return () => {
      socket.off('global_call_accepted',handleCallAccepted)
      socket.off('call_accepted', handleCallAccepted);
      socket.off('global_call_rejected', handleCallRejected);
      socket.off('call_failed', handleCallFailed);
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [socket, roomID, navigate, onCallEnded]);

  const endCall = () => {
    console.log('Ending call');
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    socket.emit('call_ended', {
      roomID,
      userId: 'caller'
    });
    
    onCallEnded();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 text-white">
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-gray-700">
          {receiverName.charAt(0).toUpperCase()}
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">{receiverName}</h2>
        <p className="text-lg mb-8">{statusMessage}</p>
        
        <div className="mt-8">
          <button 
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center"
          >
            <PhoneOff className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCall;