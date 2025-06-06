import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosConfig from '../../service/axios';
import {FaSignOutAlt,FaCog,FaBell} from "react-icons/fa";
import { MdDashboard} from "react-icons/md";
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { useUserRole } from '../../context/userRoleContext';
import NotificationItem from '../Notification/notificationItem';
import CallNotification from '../Notification/callNotification';
import { CheckSquare } from 'lucide-react';

interface UserDetail {
  profileImage: string;
  firstname: string;
  lastname: string;
}

interface Notification {
  types: string;
  isRead: boolean;
  role: string;
}
const userId = localStorage.getItem('userId') || '';
const role = localStorage.getItem('role') || 'guest';

const notificationSocket = io(`${process.env.REACT_APP_BASE_URL_NEW}/notifications`, {
  query: { userId ,role},
});
const socket = io(process.env.REACT_APP_BASE_URL_NEW, {
  query: { userId, role },
});
interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [role,setRole] = useState(localStorage.getItem('role') || 'guest')
  const {userRole} = useUserRole(); 
 
  const [userDetail,setUserDetail] = useState<UserDetail | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [unreadMessageList, setUnreadMessageList] = useState<any[]>([]);
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const messageMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId"); 
        if (userId) {
          const response = await axiosConfig.get(`/users/account-detail`);
          setUserDetail(response.data.result.userDetails);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    console.log("User Role Changed:", userRole); 
  }, [userRole]);

  useEffect(()=>{
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const { data } = await axiosConfig.get('/users/notifications');
        const filteredNotifications = data.result.filter(
          (notif: Notification) => notif.role === userRole && !notif.isRead
        );
        setNotifications(filteredNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
    
    fetchNotifications();
  },[userRole])
  

  useEffect(() => {
    notificationSocket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      notificationSocket.off('new_notification');
    };
  }, []);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      if (message.receiverId === userId && message.senderId !== userId) {
        setUnreadMessages(prev => prev + 1);
        setUnreadMessageList(prev => [message, ...prev]);
      }
    });
  
    socket.on('messages_marked_read', () => {
      setUnreadMessages(0);
      setUnreadMessageList([]);
    });
  
    return () => {
      socket.off('receive_message');
      socket.off('messages_marked_read');
    };
  }, [userId]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const { data } = await axiosConfig.get('/users/unread-messages', {
          params: {
            role: userRole
          }
        });
        setUnreadMessages(data.result.length);
        setUnreadMessageList(data.result);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };
    
    if (userId) {
      fetchUnreadMessages();
    }
  }, [userId, userRole]);



  const getNavLinks = () => {
    if (userRole === "freelancer") {
      return (
        <>
    <Link to="/" className="text-gray-700 hover:text-blue-800">Home</Link>
    <Link to="/about" className="text-gray-700 hover:text-blue-800">About</Link>
    <Link to="/contact" className="text-gray-700 hover:text-blue-800">Contact</Link>
    <Link to="/freelancer/task-list" className="text-gray-700 hover:text-blue-800">Find Work</Link>

        </>
      );
    } else if (userRole === "client") {
      return (
        <>
          <Link to="/" className="text-gray-700 hover:text-blue-800">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-800">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-800">Contact</Link>
          <Link to="/client/task-form" className="text-gray-700 hover:text-blue-800">Post Task</Link>
          <Link to="/client/freelancer-list" className="text-gray-700 hover:text-blue-800">Find Talent</Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/" className="text-gray-700 hover:text-blue-800">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-800">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-800">Contact</Link>
          <Link to="/client/freelancer-list" className="text-gray-700 hover:text-blue-800">Find Talent</Link>
          <Link to="/freelancer/task-list" className="text-gray-700 hover:text-blue-800">Find Work</Link>
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
      } 
       if (
        notificationMenuRef.current && 
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      
       if (
        messageMenuRef.current && 
        !messageMenuRef.current.contains(event.target as Node)
      ) {
        setShowMessageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleNotificationClick = async(notificationId?:string,index?: number) => {
    await axiosConfig.put(`/users/mark-as-read/${notificationId}`);
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((_, i) => i !== index);
      navigate('/notification')
      return updatedNotifications;
    });
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await axiosConfig.put('/users/mark-all-notifications-read',{role:userRole});
      setNotifications([]);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error marking all notifications as read");
    }
  }

  const handleMessageIconClick = () => {
    setShowMessageDropdown(!showMessageDropdown);
    if (!showMessageDropdown) {
      setUnreadMessages(0);
    }
  };

  return (
    <header className="bg-white text-white w-10/12 shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-6 select-none">
      <div className="flex justify-between items-center h-16">
          <img className='w-50 h-20 mt-1' src="/assets/HireNest.png" alt="logo" />
        
        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex space-x-6 items-center">
          {getNavLinks()}
        </nav>

        {/* Auth Buttons for Guest */}
        {role === "guest" ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="hover:text-blue-200 px-4 py-2 bg-blue-950 rounded-full"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-blue-950 border border-blue-950 px-4 py-2 rounded-full hover:bg-gray-100"
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
        <FaBell className="text-xl text-blue-600" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 left-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      <button
              onClick={handleMessageIconClick}
              className="relative text-gray-700 hover:text-blue-600"
            >
              <span className="text-xl text-blue-600">✉️</span>
              {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 left-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
            
            {showMessageDropdown && (
            <div 
              className="absolute right-0 top-full mt-4 w-80 bg-white shadow-lg rounded-lg p-3 border border-gray-200 max-h-96 overflow-y-auto" 
              ref={messageMenuRef}
              style={{
                maxHeight: 'calc(80vh - 100px)', 
                zIndex: 1000
              }}
            >
              <h3 className="text-gray-700 font-semibold mb-2">Messages</h3>
              <div className="space-y-2">
                {unreadMessageList.length > 0 ? (
                  <>
                    {unreadMessageList.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className="p-2 border-b border-gray-100 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => {
                          navigate('/messages'); 
                          setShowMessageDropdown(false);
                        }}
                      >
                        <div className="flex items-center">
                          <img 
                            src={msg.senderDetails?.profileImage || "https://i.pinimg.com/474x/43/6c/ac/436cac73f5fff533999f31147c3538b7.jpg"} 
                            alt="Sender" 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {msg.senderDetails?.firstname || 'Unknown'} {msg.senderDetails?.lastname || ''}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{msg.text}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        navigate('/messages');
                        setShowMessageDropdown(false);
                      }}
                      className="w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-2"
                    >
                      View All Messages
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-center text-gray-500 py-2">No unread messages</p>
                    <button 
                      onClick={() => {
                        navigate('/messages');
                        setShowMessageDropdown(false);
                      }}
                      className="w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Go to Messages
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

              {/* Notification Dropdown */}
              {showDropdown && (
                <div 
                  className="absolute right-0 top-full mt-4 w-80 bg-white shadow-lg rounded-lg p-3 border border-gray-200 max-h-96 overflow-y-auto" 
                  ref={notificationMenuRef}
                  style={{
                    maxHeight: 'calc(80vh - 100px)', 
                    zIndex: 1000
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                  <h3 className="text-gray-700 font-semibold mb-2">Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={handleMarkAllNotificationsAsRead}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckSquare />
                    </button>
                  )}
                  </div>
                  <div className="space-y-2">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div key={index} className="p-3 items-start gap-3 border-b last:border-none hover:bg-gray-100 rounded-md">
                          <NotificationItem 
                            notification={notification} 
                            role={role} 
                            handleNotificationClick={handleNotificationClick}
                            index={index}
                            className="dropdown-size"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-2">No notifications</p>
                    )}
                  </div>
                </div>
              )}

            
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
        onClick={onLogout}
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
          className="lg:hidden focus:outline-none text-blue-950"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white text-gray-700 shadow-md p-4 absolute rounded-lg mt-2 top-full left-1/2 transform -translate-x-1/2 w-full">
          <div className="flex flex-col space-y-2">
            {getNavLinks()}
            {role === "guest" && (
              <>
                <a href="/login" className="block py-2 text-blue-950">Sign In</a>
                <a href="/register" className="block py-2 text-blue-950">Sign Up</a>
              </>
            )}
          </div>
        </div>
        
      )}
    {userId && (
      <CallNotification socket={socket} userId={userId} />
    )}
    </header>
  );
};

export default Header;
