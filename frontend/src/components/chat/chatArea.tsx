import React , {useEffect} from 'react';
import { Socket } from 'socket.io-client';
import { ArrowLeft } from 'lucide-react';

interface Message {
  receiverId?: string;
  senderId?: string;
  type: 'sent' | 'received';
  text: string;
  time: string;
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
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  contacts, 
  messages, 
  userId, 
  socket, 
  role,
  onBack,
  isMobileView 
}) => {
  const [newMessage, setNewMessage] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  console.log('mmmm',messages)
  useEffect(() => {
    // Mark messages as read when chat is opened or new messages arrive
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
      // You would typically upload this file to your server here
      // and get back a URL to use in the message
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    // This is a placeholder for your actual file upload logic
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Replace with your actual upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      // Send message with media
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
        time: new Date().toLocaleString(),
        isRead: false,
        ...mediaData
      };
      socket.emit('send_message', { ...messageData, senderId: userId, receiverId: contacts._id, role });
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
        <button className="text-sm text-gray-500 hover:text-red-500">
          Delete Conversation
        </button>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'received' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
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
              
              <div className="relative pr-16"> {/* Add padding for time/status */}
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
    </div>
  );
};

export default ChatArea;