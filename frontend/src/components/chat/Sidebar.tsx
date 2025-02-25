import React from 'react';

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

interface Contacts {
  _id: string;
  name: string;
  profileImage: string;
  tagline: string;
  userId: string;
  lastMessage?: Message;
  unreadCount: number;
}

interface SidebarProps {
  contacts: Contacts[];
  onSelectContact: (contacts: Contacts) => void;
  selectedContactId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ contacts, onSelectContact, selectedContactId }) => {
  return (
    <div className="w-full lg:w-1/3 bg-white h-full border-r flex flex-col">
      <div className="p-4 border-b h-20">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul className="flex-1 overflow-y-auto">
        {contacts.map((contact, idx) => (
          <li
            key={idx}
            className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
              selectedContactId === contact._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img className="w-full h-full object-cover" src={contact.profileImage} alt="" />
              </div>
              {contact.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {contact.unreadCount}
                </span>
              )}
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-800">{contact.name}</h4>
              {contact.lastMessage && (
                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                  {contact.lastMessage.receiverId === contact._id && (
                    <span className="text-[11px] text-blue-500">
                      {contact.lastMessage.isRead ? "✓✓" : "✓"}
                    </span>
                  )}
                  {contact.lastMessage.mediaType && (
                    <span className="text-blue-500">
                      {contact.lastMessage.mediaType === "image" && "📷 Photo"}
                      {contact.lastMessage.mediaType === "video" && "🎥 Video"}
                      {contact.lastMessage.mediaType === "audio" && "🎵 Audio"}
                      {contact.lastMessage.mediaType === "file" && "📎 File"}
                    </span>
                  )}
                  {contact.lastMessage.text}
                </p>
              )}
            </div>
            {contact.lastMessage && contact.lastMessage.createdAt && (
              <div className="ml-2 flex flex-col items-end">
                <span className="text-xs text-gray-500">
                  {new Date(contact.lastMessage.createdAt).toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;