import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './chatArea';
import EmptyChatState from './emptyChat';
import { io } from 'socket.io-client';
import axiosConfig from '../../service/axios';

const userId = localStorage.getItem('userId') || '';
const role = localStorage.getItem('role') || '';

const socket = io('https://hirenest.space', {
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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      try {
        const response = await axiosConfig.get('/users/get-receivers', {
          params: {
            role: role,
            userId: userId
          }
        });
  
        const contactList: Contacts[] = response.data.result.map((receiver: Contacts) => ({
          _id: receiver._id,
          name: receiver.name,
          profileImage: receiver.profileImage,
          userId: receiver.userId,
          lastMessage: receiver.lastMessage,
          unreadCount: receiver.unreadCount,
        }));
        
        const sortedContacts = sortContacts(contactList);
        setContacts(sortedContacts);
  
        if (sortedContacts.length > 0 && !selectedContactId) {
          const firstContact = sortedContacts[0];
          setSelectedContact(firstContact);
          setSelectedContactId(firstContact._id);
          initializeChat(firstContact._id);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [role, userId, selectedContactId]); 

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
      
      if (selectedContactId === (data.senderId === userId ? data.receiverId : data.senderId)) {
        const formattedMessage: Message = {
          type: data.senderId === userId ? 'sent' : 'received',
          text: data.text,
          time: data.createdAt || new Date(),
          isRead: data.isRead,
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          fileName: data.fileName
        };
        setMessages(prevMessages => [...prevMessages, formattedMessage]);
      }
    });

    return () => {
      socket.off('messages_marked_read');
      socket.off('receive_message');
    };
  }, [userId, selectedContactId]);

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
        mediaUrl: msg.mediaUrl,
        mediaType: msg.mediaType,
        fileName: msg.fileName
      })) as Message[];

      setMessages(updatedHistory);
    });

    socket.on('receive_message', (data: Message) => {
      const formattedMessage: Message = {
        type: data.receiverId === contactId ? 'sent' : 'received',
        text: data.text,
        time: new Date(),
        isRead: data.isRead,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        fileName: data.fileName
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

  const renderEmptyState = () => {
    if (contacts.length === 0 && !isLoading) {
      return (
        <div className="w-full h-screen flex items-center justify-center">
          <EmptyChatState />
        </div>
      );
    }
    return null;
  };
  const renderChatOrEmpty = () => {
    if ((!isMobileView || (isMobileView && showChat)) && selectedContact) {
      return (
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
      );
    } else if (!isMobileView && !selectedContact && contacts.length > 0) {
      return <EmptyChatState />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col pt-24">
        {renderEmptyState()}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col lg:flex-row p-4 pt-24">
      {(!isMobileView || (isMobileView && !showChat)) && (
        <Sidebar 
          contacts={contacts} 
          onSelectContact={handleContactSelect} 
          selectedContactId={selectedContactId}
        />
      )}
      {renderChatOrEmpty()}
    </div>
  );
};

export default Chat;