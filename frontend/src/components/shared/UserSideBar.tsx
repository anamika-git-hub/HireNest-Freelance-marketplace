import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaEnvelope,
  FaBookmark,
  FaBell,
  FaSuitcase,
  FaTasks,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaGavel,
  FaBars,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/userSlice";

const UserSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userRole = localStorage.getItem("role");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const handleLogout = () => {
    localStorage.removeItem("role");
    dispatch(logoutUser());
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Ensure the sidebar responds to screen size changes
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderOrganizeAndManageLinks = () => {
    if (userRole === "freelancer") {
      return (
        <>
          <NavLink
            to="/freelancer/bids"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaGavel className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Bids</span>
          </NavLink>
          <NavLink
            to="/freelancer/my-profile"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaUser className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>My Profile</span>
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
            <FaSuitcase className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Requests</span>
          </NavLink>
          <NavLink
            to="/client/tasks"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaTasks className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Tasks</span>
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
        <FaBookmark className="mr-3" />
        <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Bookmarks</span>
      </NavLink>
    ) : (
      <NavLink
        to="/freelancer-bookmarks"
        className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      >
        <FaBookmark className="mr-3" />
        <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Bookmarks</span>
      </NavLink>
    );
  };

  return (
    <section>
      <div className="flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white pt-10 shadow-md transition-all duration-300 flex flex-col`}
      >
        <button
          className="p-4 text-gray-600 hover:text-blue-600 lg:hidden"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>
        <nav className="mt-4 flex-1">
          <NavLink
            to="/dashboard"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <MdDashboard className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Dashboard</span>
          </NavLink>
          <NavLink
            to="/messages"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaEnvelope className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Messages</span>
          </NavLink>
          {renderBookmarksLink()}
          <NavLink
            to="/notification"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaBell className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Notifications</span>
          </NavLink>
          <div className={`px-4 py-2 mt-4 text-gray-500 uppercase text-sm ${!sidebarOpen && "hidden lg:block"}`}>
            Organize and Manage
          </div>
          {renderOrganizeAndManageLinks()}
          <div className={`px-4 py-2 mt-4 text-gray-500 uppercase text-sm ${!sidebarOpen && "hidden lg:block"}`}>
            Account
          </div>
          <NavLink
            to="/settings"
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
          >
            <FaCog className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-red-600"
          >
            <FaSignOutAlt className="mr-3" />
            <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1`} >
        <Header />
        {children}
        </div>
        </div>
        <Footer />
      
    </section>
  );
};

export default UserSidebar;
