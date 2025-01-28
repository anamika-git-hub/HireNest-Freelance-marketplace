import React from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  type: 'sent' | 'received';
  text: string;
  time: string;
}

interface Contacts {
  _id:string;
  firstname: string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface ChatAreaProps {
  contacts: Contacts;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userId: string;
  socket: Socket;
  role: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ contacts, messages, userId, socket, role }) => {
  const [newMessage, setNewMessage] = React.useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData: Message = {
        type: 'sent',
        text: newMessage,
        time: new Date().toLocaleString(),
      };
      socket.emit('send_message', { ...messageData, senderId: userId, receiverId: contacts._id,role });
      setNewMessage('');
    }
  };

  return (
    <div className="w-full lg:w-2/3 h-full bg-white flex flex-col">
      <div className="flex justify-between items-center p-4 border-b h-20">
        <h2 className="text-lg font-medium">{contacts.firstname}</h2>
        <button className="text-sm text-gray-500 hover:text-red-500">Delete Conversation</button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'received' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.type === 'received' ?'bg-gray-100 text-gray-800' :'bg-blue-500 text-white' 
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
