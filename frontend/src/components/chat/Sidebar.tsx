import React from 'react';

interface Contacts {
  _id:string;
  name: string;
  firstname: string;
  lastname: string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface SidebarProps {
  contacts: Contacts[];
  onSelectcontact: (contacts: Contacts) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ contacts, onSelectcontact }) => {
  return (
    <div className="w-full lg:w-1/3 bg-white h-full border-r">
      <div className="p-4 border-b h-20">
        <input
          type="text"
          placeholder="Search"
          className="w-full h-10 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul>
        {contacts.map((contact, idx) => (
          <li
            key={idx}
            className="flex items-center p-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelectcontact(contact)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img className="w-full h-full" src={contact.profileImage} alt="" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium text-gray-800">{contact.firstname} {contact.lastname} {contact.name}  </h4>
              <p className="text-sm text-gray-500 truncate">{contact.tagline}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
