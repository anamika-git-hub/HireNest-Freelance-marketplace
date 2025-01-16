import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaEnvelope,
  FaBookmark,
  FaStar,
  FaSuitcase,
  FaTasks,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaGavel,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch, UseDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/userSlice";

const UserSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userRole = localStorage.getItem("role");
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('role');
      dispatch(logoutUser())
      navigate('/login');
    };

  const renderOrganizeAndManageLinks = () => {
    if (userRole === "freelancer") {
      return (
        <>
          <NavLink
            to="/freelancer/bids"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaGavel className="mr-3" /> Bids
          </NavLink>
          <NavLink
            to="/freelancer/my-profile"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaUser className="mr-3" /> My Profile
          </NavLink>
        </>
      );
    } else if (userRole === "client") {
      return (
        <>
          <NavLink
            to="/client/my-request-list"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaSuitcase className="mr-3" /> Requests
          </NavLink>
          <NavLink
            to="/client/tasks"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaTasks className="mr-3" /> Tasks
          </NavLink>
        </>
      );
    }
  };

  const renderBookmarksLink = () => {
    return userRole === "freelancer" ? (
      <NavLink
        to="/task-bookmarks"
        className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      >
        <FaBookmark className="mr-3" /> Bookmarks
      </NavLink>
    ) : (
      <NavLink
        to="/freelancer-bookmarks"
        className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      >
        <FaBookmark className="mr-3" /> Bookmarks
      </NavLink>
    );
  };

  return (
    <section>
      <div className="flex">
        <aside className="w-64 pt-20 bg-white text-gray-800 shadow-md">
          <nav className="mt-4">
            <NavLink
              to="/freelancer/dashboard"
              className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              <MdDashboard className="mr-3" /> Dashboard
            </NavLink>
            <NavLink
              to="/messages"
              className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              <FaEnvelope className="mr-3" /> Messages
              <span className="ml-auto text-blue-600 text-sm font-bold">2</span>
            </NavLink>

          {renderBookmarksLink()}
            
            <NavLink
              to="/notification"
              className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              <FaStar className="mr-3" /> Notifications
            </NavLink>
            <div className="px-4 py-2 mt-4 text-gray-500 uppercase text-sm">
              Organize and Manage
            </div>
            {renderOrganizeAndManageLinks()}
            <div className="px-4 py-2 mt-4 text-gray-500 uppercase text-sm">
              Account
            </div>
            <NavLink
              to="/settings"
              className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            >
              <FaCog className="mr-3" /> Settings
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-red-600"
            >
              <FaSignOutAlt className="mr-3" /> Logout
            </button>
          </nav>
        </aside>
        <div className="flex-1">
          <Header />
          {children}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default UserSidebar;
