import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './chatArea';
import { io } from 'socket.io-client';
import axiosConfig from '../../service/axios';

const userId = localStorage.getItem('userId') || '';
const role = localStorage.getItem('role') || '';

const socket = io('http://localhost:5000', {
  query: { userId,role },
});

interface Contacts {
  _id:string;
  name:string;
  firstname: string;
  lastname:string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface Message {
  receiverId?:string;
  senderId?: string;
  type: 'sent' | 'received';
  text: string;
  time: string;
}

const Chat: React.FC = () => {
  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contacts | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const role = localStorage.getItem('role') || '';
  const userId = localStorage.getItem('userId') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosConfig.get(`/users/get-receivers`,{
          params:{
            role:role,
            userId:userId
          }
        });

        const contactList: Contacts[] = response.data.map((receiver: Contacts) => ({
          _id:receiver._id,
          firstname: receiver.firstname,
          name:receiver.name,
          profileImage: receiver.profileImage,
          userId: receiver.userId, 
        }));
        setContacts(contactList);

        if (contactList.length > 0) {
          const firstContact = contactList[0];
          setSelectedContact(firstContact);
          initializeChat(firstContact._id);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchData();
  }, [role,userId]);

  const initializeChat = (contactId: string) => {
    socket.off('message_history');
    socket.off('receive_message');
    socket.emit('get_messages', { senderId: userId, receiverId:contactId, contactId,role});

    socket.on('message_history', (history: Message[]) => {
      const updatedHistory = history.map((msg) => ({
        type: msg.receiverId === contactId ? 'sent' : 'received', 
        text: msg.text,
        time:  msg.time ? new Date(msg.time).toLocaleString() : 'Unknown Time',
      })) as Message[];
      
      setMessages(updatedHistory);
    });

    socket.on('receive_message', (data: Message) => {
      const formattedMessage: Message = {
        type: data.receiverId === contactId ? 'sent' : 'received',
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

  const handleContactSelect = (contacts: Contacts) => {
    setSelectedContact(contacts);
    initializeChat(contacts._id);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col lg:flex-row p-4 pt-24">
      <Sidebar contacts={contacts} onSelectcontact={handleContactSelect} />
      {selectedContact && (
        <ChatArea
          contacts={selectedContact}
          messages={messages}
          setMessages={setMessages}
          userId={userId}
          socket={socket}
          role={role}
        />
      )}
    </div>
  );
};

export default Chat;
