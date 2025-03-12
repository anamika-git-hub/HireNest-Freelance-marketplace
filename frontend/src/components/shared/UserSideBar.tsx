import React, { useState, useEffect, useRef } from "react";
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
  FaChevronDown,
  FaClipboardList,
  FaCommentDots,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/userSlice";
import ConfirmMessage from "./ConfirmMessage";


const UserSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "client");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role") || "client");
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("roleChange", handleStorageChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("roleChange", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initiateLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem("role");
    dispatch(logoutUser());
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderProfileDropdown = () => {
    if (userRole !== "freelancer") return null;

    return (
      <div className="relative">
        <button
          className={`flex items-center w-auto px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600 ${
            dropdownOpen ? 'bg-gray-100 text-blue-600' : ''
          }`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUser className="mr-3" />
          <span className={`${!sidebarOpen && "hidden"} lg:inline flex-1 mr-2`}>Profile & Leads</span>
          <FaChevronDown className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 mt-1 py-2 bg-white border border-gray-200 shadow-lg rounded-md z-20">
            <NavLink
              to="/freelancer/my-profile"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUser className="mr-3 w-4 h-4" />
              My Profile
            </NavLink>
            <NavLink
              to="/freelancer/requests"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <FaSuitcase className="mr-3 w-4 h-4" />
              Requests
            </NavLink>
            <NavLink
              to="/freelancer/reviews"
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <FaCommentDots className="mr-3 w-4 h-4" />
              Reviews
            </NavLink>
          </div>
        )}
      </div>
    );
  };

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
          {renderProfileDropdown()}
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

  const renderContract = () => {
    return userRole === "freelancer" ? (
      <NavLink
        to="/freelancer/freelancer-contract-list"
        className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      >
        <FaClipboardList className="mr-3" />
        <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Live Contracts</span>
      </NavLink>
    ) : (
      <NavLink
        to="/client/client-contract-list"
        className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      >
        <FaClipboardList className="mr-3" />
        <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Live Contracts</span>
      </NavLink>
    );
  };


  const renderBookmarksLink = () => {
    return userRole === "freelancer" ? (
      <NavLink
        to="/freelancer/task-bookmarks"
        className="flex items-center px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      >
        <FaBookmark className="mr-3" />
        <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Bookmarks</span>
      </NavLink>
    ) : (
      <NavLink
        to="/client/freelancer-bookmarks"
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
            {renderContract()}
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
              onClick={initiateLogout}
              className="flex items-center w-full px-4 py-4 text-gray-600 hover:bg-gray-100 hover:text-red-600"
            >
              <FaSignOutAlt className="mr-3" />
              <span className={`${!sidebarOpen && "hidden"} lg:inline`}>Logout</span>
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          <Header onLogout={initiateLogout} />
          {children}
        </div>
      </div>
      <Footer />
      {showLogoutConfirm && (
        <ConfirmMessage
          message="Are you sure you want to logout?"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </section>
  );
};

export default UserSidebar;