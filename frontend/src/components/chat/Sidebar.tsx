import React from 'react';

interface Freelancer {
  name:string;
  firstname: string;
  lastname:string;
  profileImage: string;
  tagline: string;
  userId: string;
}

interface SidebarProps {
  freelancers: Freelancer[];
  onSelectFreelancer: (freelancer: Freelancer) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ freelancers, onSelectFreelancer }) => {
  return (
    <div className="w-1/3 bg-white h-full border-r">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul>
        {freelancers.map((freelancer, idx) => (
          <li
            key={idx}
            className="flex items-center p-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelectFreelancer(freelancer)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-300">
                <img className="w-10 h-10 rounded-full bg-gray-300" src={freelancer.profileImage} alt="" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h4 className="font-medium text-gray-800">{freelancer.firstname} {freelancer.lastname} {freelancer.name}</h4>
              <p className="text-sm text-gray-500 truncate">{freelancer.tagline}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
