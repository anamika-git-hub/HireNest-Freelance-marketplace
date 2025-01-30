import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/userSlice';
import axiosConfig from '../../service/axios';
import {FaSignOutAlt,FaCog,FaBell} from "react-icons/fa";
import { MdDashboard,MdWork,MdGavel,MdSync } from "react-icons/md";
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

interface UserDetail {
  profileImage: string;
  firstname: string;
  lastname: string;
}

interface Notification {
  types: string;
  isRead: boolean;
}
const userId = localStorage.getItem('userId') || '';
const userRole = localStorage.getItem('role') || 'guest';

const notificationSocket = io('http://localhost:5000/notifications', {
  query: { userId },
});


const Header: React.FC<{ userRole: string }> = ({ userRole }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
 
  const [userDetail,setUserDetail] = useState<UserDetail | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId"); 
        if (userId) {
          const response = await axiosConfig.get(`/users/account-detail`);
          setUserDetail(response.data.userDetails);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(()=>{
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const response = await axiosConfig.get(`/users/notifications`);

           if (userRole === 'client') {
          const filteredNotifications = response.data.filter((notif: Notification) => notif.types === 'bid' && !notif.isRead);
            setNotifications(filteredNotifications);
          } else if(userRole === 'freelancer') {
            const filteredNotifications = response.data.filter((notif: Notification) => notif.types === 'request' && !notif.isRead);
            setNotifications(filteredNotifications); 
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
    
    fetchNotifications();
  },[userId,userRole])

  useEffect(() => {
    notificationSocket.on('new_notification', (notification) => {
      console.log('nooo',notification)
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      notificationSocket.off('new_notification');
    };
  }, []);

  const getNavLinks = () => {
    if (userRole === "freelancer") {
      return (
        <>
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          <a href="/freelancer/task-list" className="text-gray-700 hover:text-blue-600">Find Work</a>
        </>
      );
    } else if (userRole === "client") {
      return (
        <>
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          <a href="/client/task-form" className="text-gray-700 hover:text-blue-600">Post Task</a>
          <a href="/client/freelancer-list" className="text-gray-700 hover:text-blue-600">Find Talent</a>
        </>
      );
    } else {
      return (
        <>
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          <a href="/client/freelancer-list" className="text-gray-700 hover:text-blue-600">Find Talent</a>
          <a href="/freelancer/task-list" className="text-gray-700 hover:text-blue-600">Find Work</a>
        </>
      );
    }
  };


  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      } else if (
        notificationMenuRef.current && 
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    dispatch(logoutUser())
    navigate('/login');
  };

  const handleNotificationClick = async(notificationId:string,index: number) => {
    await axiosConfig.put(`/users/mark-as-read/${notificationId}`);
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((_, i) => i !== index);
      navigate('/notification')
      return updatedNotifications;
    });
  };

  return (
    <header className="bg-white text-white w-10/12 shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-6 select-none">
      <div className="flex justify-between items-center h-16">
        <div className="text-2xl font-bold flex items-center text-blue-600">
          <span className="mr-2">🔷</span> HireNest
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex space-x-6 items-center">
          {getNavLinks()}
        </nav>

        {/* Auth Buttons for Guest */}
        {userRole === "guest" ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-blue-200 px-4 py-2 bg-blue-600 rounded-full"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            
            <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text-gray-700 hover:text-blue-600"
      >
        <FaBell className="text-xl text-blue-500" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
              {/* Notification Dropdown */}
              {showDropdown && (
  <div className="absolute right-0 mt-64 w-80 bg-white shadow-lg rounded-lg p-3 border border-gray-200 max-h-96 overflow-y-auto" ref={notificationMenuRef}>
    <h3 className="text-gray-700 font-semibold mb-2">Notifications</h3>

    <div className="">
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div key={index} onClick={() => handleNotificationClick(notif._id,index)} className="p-3  items-start gap-3 border-b last:border-none hover:bg-gray-100 rounded-md">
            {notif.types === "request" && (
              <div className="flex">
                <MdWork className="text-gray-500 text-xl" />
                <p className="ml-3 text-sm text-gray-700">
                  You have a new request from
                  <a href="/freelancer/requests" className="text-blue-500 hover:underline">
                    {' '} {notif.senderName}
                  </a>
                </p>
              </div>
            )}
            {notif.types === "bid" && (
              <div className="flex">
                <MdGavel className="text-gray-500 text-xl" />
                <p className="ml-3 text-sm text-gray-700">
                  <a href={notif.bidderProfileUrl} className="text-blue-500 hover:underline">
                    {notif.senderName}
                  </a>{' '} placed a bid on your{' '}
                  <a href={notif.projectUrl} className="text-blue-500 hover:underline">
                    {notif.projectName}
                  </a>{' '} project.
                </p>
              </div>
            )}
            {notif.types === "job_expiry" && <MdSync className="text-gray-500 text-2xl" />}
            <p className="text-xs pl-3 pt-1 text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-2">No notifications</p>
      )}
    </div>
  </div>
)}

            <button className="relative hover:text-blue-200">✉️</button>
            <div className="relative" ref={profileMenuRef}>
  <img
    src={
      userDetail?.profileImage ||
      "https://i.pinimg.com/474x/43/6c/ac/436cac73f5fff533999f31147c3538b7.jpg"
    }
    alt="User Avatar"
    className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer"
    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
  />
  <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3"></span>
  {isProfileMenuOpen && (
    <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 shadow-md rounded-lg">
      {/* User Info Section */}
      <div className="flex items-center px-4 py-3 border-b">
        <img
          src={
            userDetail?.profileImage ||
            "https://i.pinimg.com/474x/43/6c/ac/436cac73f5fff533999f31147c3538b7.jpg"
          }
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <p className="font-semibold text-sm">
            {`${userDetail?.firstname || "User"} ${
              userDetail?.lastname || ""
            }`}
          </p>
          <p className="text-xs text-gray-500">{localStorage.getItem("role")}</p>
        </div>
      </div>
      {/* Menu Items */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        <MdDashboard className="mr-3 text-gray-600" /> Dashboard
      </button>
      <button
        onClick={() => navigate("/settings")}
        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        <FaCog className="mr-3 text-gray-600" /> Settings
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
      >
        <FaSignOutAlt className="mr-3" /> Logout
      </button>
    </div>
  )}
</div>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden focus:outline-none text-blue-600"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white text-gray-700 shadow-md p-4 absolute rounded-lg mt-2 top-full left-1/2 transform -translate-x-1/2 w-full">
          <div className="flex flex-col space-y-2">
            {getNavLinks()}
            {userRole === "guest" && (
              <>
                <a href="/login" className="block py-2 text-blue-600">Sign In</a>
                <a href="/register" className="block py-2 text-blue-600">Sign Up</a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
