import React, { useState, useRef, useEffect } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../store/userSlice";
import { clearAuthTokens } from "../../service/axios";

const AdminHeader: React.FC = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    clearAuthTokens();
    dispatch(logoutAdmin()); 
    localStorage.removeItem("role"); 
    navigate("/admin/login");
  };

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
        <div className="relative" ref={profileMenuRef}>
          <FaUserCircle
            className="text-gray-500 text-2xl cursor-pointer"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          />
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg">
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Dashboard
              </button>
              <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
