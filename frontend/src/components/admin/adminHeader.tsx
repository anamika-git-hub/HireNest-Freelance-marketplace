import React from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const AdminHeader: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 text-xl">
          <i className="fas fa-bars"></i> 
        </button>
        <h1 className="text-lg font-semibold text-gray-700">HireNest</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-full pl-4 pr-8 py-2 text-sm"
          />
          <FaSearch className="absolute top-2 right-2 text-gray-500" />
        </div>
        <FaBell className="text-gray-500 text-xl cursor-pointer" />
        <FaUserCircle className="text-gray-500 text-2xl cursor-pointer" />
      </div>
    </header>
  );
};

export default AdminHeader;
