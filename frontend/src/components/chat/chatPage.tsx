import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './chatArea';
import { io } from 'socket.io-client';
import axiosConfig from '../../service/axios';


const userId = localStorage.getItem('userId') || '';

const socket = io('http://localhost:5000', {
  query: { userId }
});

interface Freelancer {
  name:string;
  firstname: string;
  lastname:string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface Message {
  senderId?: string;
  type: 'sent' | 'received';
  text: string;
  time: string;
}

const Chat: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const role = localStorage.getItem('role') || '';

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosConfig.get(`/users/get-receivers`,{
          params:{
            role:role,
            userId:userId
          }
        });

        const freelancerList: Freelancer[] = response.data.map((receiver: any) => ({
          firstname: receiver.firstname,
          name:receiver.name,
          profileImage: receiver.profileImage,
          userId: receiver.userId, 
        }));
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
  }, [role,userId]);

  const initializeChat = (freelancerId: string) => {
    socket.emit('get_messages', { senderId: userId, receiverId: freelancerId });

    socket.on('message_history', (history: any[]) => {

      const updatedHistory = history.map((msg) => ({
        type: msg.senderId === userId ? 'sent' : 'received', 
        text: msg.text,
        time:  msg.time ? new Date(msg.time).toLocaleString() : 'Unknown Time',
      })) as Message[];
      
      setMessages(updatedHistory);
    });

    socket.on('receive_message', (data: any) => {
      const formattedMessage: Message = {
        type: data.senderId === userId ? 'sent' : 'received',
        text: data.text,
        time:  data.time ? new Date(data.time).toLocaleString() : 'Unknown Time',
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
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
