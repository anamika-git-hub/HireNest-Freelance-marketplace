import React from 'react';
import { Socket } from 'socket.io-client';

interface Message {
  type: 'sent' | 'received';
  text: string;
  time: string;
}

interface Freelancer {
  name: string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface ChatAreaProps {
  freelancer: Freelancer;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userId: string;
  socket: Socket;
}

const ChatArea: React.FC<ChatAreaProps> = ({ freelancer, messages, userId, socket }) => {
  const [newMessage, setNewMessage] = React.useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData: Message = {
        type: 'sent',
        text: newMessage,
        time: new Date().toLocaleString(),
      };
      socket.emit('send_message', { ...messageData, senderId: userId, receiverId: freelancer.userId });
      setNewMessage('');
    }
  };

  return (
    <div className="w-2/3 h-full bg-white flex flex-col">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-lg font-medium">{freelancer.name}</h2>
        <button className="text-sm text-gray-500 hover:text-red-500">Delete Conversation</button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.type === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 w-5/6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
