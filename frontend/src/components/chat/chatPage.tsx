
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './chatArea';
import { io } from 'socket.io-client';
import axiosConfig from '../../service/axios';

const userId = localStorage.getItem('userId') || '';
const role = localStorage.getItem('role') || '';

const socket = io('http://localhost:5001', {
  query: { userId, role },
});

interface Contacts {
  _id: string;
  name: string;
  profileImage: string;
  tagline: string;
  userId: string;
  lastMessage?: Message;
  unreadCount: number;
}

interface Message {
  receiverId?: string;
  senderId?: string;
  type: 'sent' | 'received';
  text: string;
  time: Date;
  createdAt?: Date;
  isRead?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  fileName?: string;
}

const Chat: React.FC = () => {
  const [contacts, setContacts] = useState<Contacts[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contacts | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const role = localStorage.getItem('role') || '';
  const userId = localStorage.getItem('userId') || '';

  const sortContacts = (contactsList: Contacts[]): Contacts[] => {
    return [...contactsList].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
      const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosConfig.get('/users/get-receivers', {
          params: {
            role: role,
            userId: userId
          }
        });

        const contactList: Contacts[] = response.data.map((receiver: Contacts) => ({
          _id: receiver._id,
          name: receiver.name,
          profileImage: receiver.profileImage,
          userId: receiver.userId,
          lastMessage: receiver.lastMessage,
          unreadCount: receiver.unreadCount,
        }));
        setContacts(sortContacts(contactList));

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
  }, [role, userId]);

  useEffect(() => {
    socket.on('messages_marked_read', ({ chatId, readBy }) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => {
          if (msg.receiverId === readBy) {
            return { ...msg, isRead: true };
          }
          return msg;
        })
      );

      setContacts(prevContacts =>
        prevContacts.map(contact => {
          if (contact._id === readBy && contact.lastMessage) {
            return {
              ...contact,
              lastMessage: { ...contact.lastMessage, isRead: true },
              unreadCount: 0
            };
          }
          return contact;
        })
      );
    });

    socket.on('receive_message', (data: Message) => {
      const messageWithTimestamp = {
        ...data,
        createdAt: data.createdAt || new Date(),
        isRead: false,
      };

      setContacts(prevContacts => {
        const updatedContacts = prevContacts.map(contact => {
          if (contact._id === (data.senderId === userId ? data.receiverId : data.senderId)) {
            return {
              ...contact,
              lastMessage: messageWithTimestamp,
              unreadCount: data.senderId === userId ? contact.unreadCount : contact.unreadCount + 1
            };
          }
          return contact;
        });
        return sortContacts(updatedContacts);
      });
    });

    return () => {
      socket.off('messages_marked_read');
      socket.off('receive_message');
    };
  }, [userId]);

  const initializeChat = (contactId: string) => {
    socket.off('message_history');
    socket.off('receive_message');
    socket.emit('get_messages', { senderId: userId, receiverId: contactId, contactId, role });

    socket.on('message_history', (history: Message[]) => {
      const updatedHistory = history.map((msg) => ({
        type: msg.receiverId === contactId ? 'sent' : 'received',
        text: msg.text,
        time: msg.time,
        isRead: msg.isRead,
      })) as Message[];

      setMessages(updatedHistory);
    });

    socket.on('receive_message', (data: Message) => {
      const formattedMessage: Message = {
        type: data.receiverId === contactId ? 'sent' : 'received',
        text: data.text,
        time: new Date(),
        isRead: data.isRead,
      };
      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    if (contactId) {
      socket.emit('mark_messages_read', { senderId: userId, receiverId: contactId });
    }

    return () => {
      socket.off('message_history');
      socket.off('receive_message');
    };
  };

  const handleContactSelect = (contact: Contacts) => {
    setSelectedContact(contact);
    setSelectedContactId(contact._id);
    initializeChat(contact._id);
    if (isMobileView) {
      setShowChat(true);
    }
  };

  const handleBackToContacts = () => {
    setShowChat(false);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col lg:flex-row p-4 pt-24">
      {(!isMobileView || (isMobileView && !showChat)) && (
        <Sidebar 
          contacts={contacts} 
          onSelectContact={handleContactSelect} 
          selectedContactId={selectedContactId}
        />
      )}
      {(!isMobileView || (isMobileView && showChat)) && selectedContact && (
        <ChatArea
          contacts={selectedContact}
          messages={messages}
          setMessages={setMessages}
          userId={userId}
          socket={socket}
          role={role}
          onBack={handleBackToContacts}
          isMobileView={isMobileView}
          setContacts={setContacts}
        />
      )}
    </div>
  );
};

export default Chat;