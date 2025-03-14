import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ArrowLeft, MoreVertical, Video, Search, X } from 'lucide-react';
import axiosConfig from '../../service/axios';
import OutgoingCall from '../shared/outgoingCall'; 

interface Message {
  receiverId?: string;
  senderId?: string;
  type: 'sent' | 'received';
  text: string;
  time: Date;
  createdAt?:Date;
  isRead?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  fileName?: string;
}

interface Contacts {
  _id: string;
  name: string;
  profileImage: string;
  tagline: string;
  userId: string;
  lastMessage?: Message;
  unreadCount: number;
}

interface ChatAreaProps {
  contacts: Contacts;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userId: string;
  socket: Socket;
  role: string;
  onBack: () => void;
  isMobileView: boolean;
  setContacts: React.Dispatch<React.SetStateAction<Contacts[]>>;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  contacts,
  messages,
  userId,
  socket,
  role,
  onBack,
  isMobileView,
  setContacts
}) => {
  const [newMessage, setNewMessage] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOutgoingCall, setShowOutgoingCall] = useState(false);
  const [callDetails, setCallDetails] = useState<{
    roomID: string;
    receiverId: string;
    receiverName: string;
  } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClearChat = () => {
    socket.emit('clear_chat', {
      senderId: userId,
      receiverId: contacts._id,
      role
    });
  };

  useEffect(() => {
    socket.on('chat_cleared', (receiverId) => {
      if (receiverId === contacts._id) {
        setNewMessage('');
      }
    });
    return () => {
      socket.off('chat_cleared');
    };
  }, [contacts._id, socket]);
  
  const handleVideoCall = async () => {
    console.log('Starting video call with:', contacts.name);
    
    try {
      let adjustedUserId = userId;
      let userName = '';
      if (role === 'freelancer') {
        const response = await axiosConfig(`/users/freelancer-profile/${userId}`);
        const data = await response.data;
        if (data && data._id) {
          adjustedUserId = data._id
          userName = data.name
        }
      } else if (role === 'client') {
        const response = await axiosConfig(`/users/account-detail`);
        const data = await response.data.userDetails;
        if (data && data._id) {
          adjustedUserId = data._id;
          userName = data.firstname+' '+ data.lastname
        }
      }
      
      const sortedIds = [adjustedUserId, contacts._id].sort().join('-');
      const roomID = `room-${sortedIds}`;
      
      setCallDetails({
        roomID,
        receiverId: contacts._id,
        receiverName: contacts.name || 'User'
      });
      setShowOutgoingCall(true);
      socket.emit('call_initiated', {
        roomID,
        callerId: userId, 
        callerName: userName || 'You', 
        receiverId: contacts._id,
        role 
      });
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  const filteredMessages = searchQuery
  ? messages.filter(msg => 
      msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : messages;

  const formatMessageDate = (dateString: Date) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDateDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (messageDateDay.getTime() === todayDay.getTime()) {
      return 'Today';
    } else if (messageDateDay.getTime() === yesterdayDay.getTime()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const groupedMessages = filteredMessages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = formatMessageDate(message.time);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => msg.type === 'received' && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      socket.emit('mark_messages_read', {
        senderId: userId,
        receiverId: contacts._id,
        role: role
      });
    }
  }, [messages, contacts._id, userId, role, socket]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      sendMessage('', {
        mediaUrl: data.url,
        mediaType: getMediaType(file.type),
        fileName: file.name
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const getMediaType = (mimeType: string): Message['mediaType'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'file';
  };

  const sendMessage = (text: string = newMessage, mediaData?: {
    mediaUrl?: string;
    mediaType?: Message['mediaType'];
    fileName?: string
  }) => {
    if (text.trim() !== '' || mediaData?.mediaUrl) {
      const messageData: Message = {
        type: 'sent',
        text: text.trim(),
        time: new Date(),
        createdAt: new Date(),
        isRead: false,
        senderId: userId,   
        receiverId: contacts._id,
        ...mediaData
      };
      socket.emit('send_message', { ...messageData, senderId: userId, receiverId: contacts._id, role });
      setContacts(prevContacts => {
        const updatedContacts = prevContacts.map(contact => {
          if (contact._id === contacts._id) {
            return {
              ...contact,
              lastMessage: {
                ...messageData,
                isRead: false
              }
            };
          }
          return contact;
        });
        return updatedContacts.sort((a, b) => {
          const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      });
      setNewMessage('');
      setSelectedFile(null);
    }
  };

  return (
    <div className="border-r w-full lg:w-2/3 h-full bg-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b h-20">
        <div className="flex items-center gap-2">
          {isMobileView && (
            <button onClick={onBack} className="mr-2">
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <h2 className="text-lg font-medium">{contacts.name}</h2>
        </div>
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
              <input
                type="text"
                placeholder="Search messages..."
                className="bg-transparent border-none focus:outline-none text-sm w-40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={toggleSearch} className="ml-2">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
          <button onClick={handleVideoCall} className="text-gray-600 hover:text-gray-800">
            <Video className="h-5 w-5" />
          </button>
         <DropdownMenu.Root>
          <DropdownMenu.Trigger className="focus:outline-none">
            <MoreVertical className="h-5 w-5 text-gray-600 hover:text-gray-800" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white shadow-md rounded-md p-2 text-sm"
              align="end"
            >
              <DropdownMenu.Item
                onClick={toggleSearch}
                className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={handleClearChat}
                className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
              >
                Clear chat
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full">
                {date}
              </span>
            </div>
            {dateMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'received' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg  mb-2 ${
                    msg.type === 'received' ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'
                  }`}
                >
                  {msg.mediaUrl && (
                    <div className="mb-2">
                      {msg.mediaType === 'image' && (
                        <img src={msg.mediaUrl} alt="Shared image" className="rounded-lg max-w-full" />
                      )}
                      {msg.mediaType === 'video' && (
                        <video controls className="rounded-lg max-w-full">
                          <source src={msg.mediaUrl} type="video/mp4" />
                        </video>
                      )}
                      {msg.mediaType === 'audio' && (
                        <audio controls className="max-w-full">
                          <source src={msg.mediaUrl} type="audio/mpeg" />
                        </audio>
                      )}
                      {msg.mediaType === 'file' && (
                        <a
                          href={msg.mediaUrl}
                          download={msg.fileName}
                          className="flex items-center gap-2 text-blue-100 hover:text-blue-200"
                        >
                          📎 {msg.fileName}
                        </a>
                      )}
                    </div>
                  )}
                  
                  <div className="relative pr-16">
                    <span className="text-sm mr-2">{msg.text}</span>
                    <div className="absolute bottom-0 gap-1 right-0 flex items-end">
                      <span className="text-[10px] opacity-75">
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>

                      {msg.type === 'sent' && (
                        <span className={`text-[10px] ${msg.isRead ? 'text-white' : 'opacity-75'}`}>
                          {msg.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
            <span className="text-sm text-gray-600">
              📎 {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            📎
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => sendMessage()}
          >
            Send
          </button>
        </div>
      </div>
      {showOutgoingCall && callDetails && (
        <OutgoingCall
          socket={socket}
          roomID={callDetails.roomID}
          receiverId={callDetails.receiverId}
          receiverName={callDetails.receiverName}
          onCallEnded={() => setShowOutgoingCall(false)}
        />
      )}
    </div>
  );
};

export default ChatArea;