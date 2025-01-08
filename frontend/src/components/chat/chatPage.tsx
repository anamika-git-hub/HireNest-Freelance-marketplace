import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './chatArea';
import { io } from 'socket.io-client';
import axiosConfig from '../../service/axios';

const socket = io('http://localhost:5000');

interface Freelancer {
  name: string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface Message {
  type: 'sent' | 'received';
  text: string;
  time: string;
}

const Chat: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosConfig.get(`/client/client-request`);
        console.log('Fetched Requests:', response.data);

        const freelancerList = response.data.requests.map((req: any) => req.freelancerId);
        setFreelancers(freelancerList);

        if (freelancerList.length > 0) {
          const firstFreelancer = freelancerList[0];
          setSelectedFreelancer(firstFreelancer);
          initializeChat(firstFreelancer.userId);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchData();
  }, []);

  const initializeChat = (freelancerId: string) => {
    socket.emit('get_messages', { senderId: userId, receiverId: freelancerId });

    socket.on('message_history', (history: Message[]) => {
      console.log(history);
      
      setMessages([
        {
          type: 'sent',
          text: 'Hello, I’m reaching out about your request.',
          time: new Date().toLocaleString(),
        },
        ...history,
      ]);
    });

    socket.on('receive_message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message_history');
      socket.off('receive_message');
    };
  };

  const handleFreelancerSelect = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    initializeChat(freelancer.userId);
  };

  return (
    <div className="h-screen bg-gray-100 p-6 pt-24">
      <div className="bg-white h-full rounded-lg shadow-md p-4 flex">
        <Sidebar freelancers={freelancers} onSelectFreelancer={handleFreelancerSelect} />
        {selectedFreelancer && (
          <ChatArea
            freelancer={selectedFreelancer}
            messages={messages}
            setMessages={setMessages}
            userId={userId}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
