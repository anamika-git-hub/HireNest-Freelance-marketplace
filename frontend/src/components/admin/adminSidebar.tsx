import React from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaEnvelope, FaCalendar } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white">
      <div className="p-4 text-center font-bold text-xl">HireNest</div>
      <nav className="mt-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 ${
              isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <MdDashboard className="mr-3" /> Dashboard
        </NavLink>
        <NavLink
          to="/admin/client"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 ${
              isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <FaUsers className="mr-3" /> Clients
        </NavLink>
        <NavLink
          to="/admin/freelancer"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 ${
              isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <FaEnvelope className="mr-3" /> Freelancers
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `flex items-center px-4 py-2 ${
              isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <FaCalendar className="mr-3" /> Categories
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
