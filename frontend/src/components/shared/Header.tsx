import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/userSlice';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null); 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = localStorage.getItem('role') || 'guest';

  const getNavLinks = () => {
    if (userRole === "freelancer") {
      return (
        <>
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          <a href="#findjob" className="text-gray-700 hover:text-blue-600">Find Work</a>
        </>
      );
    } else if (userRole === "client") {
      return (
        <>
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          <a href="#posttask" className="text-gray-700 hover:text-blue-600">Post Task</a>
          <a href="#findtalent" className="text-gray-700 hover:text-blue-600">Find Talent</a>
        </>
      );
    } else {
      return (
        <>
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          <a href="#findtalent" className="text-gray-700 hover:text-blue-600">Find Talent</a>
          <a href="#findjob" className="text-gray-700 hover:text-blue-600">Find Work</a>
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

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        <div className="text-2xl font-bold text-blue-600 flex items-center">
          <span className="mr-2">🔷</span> HireNest
        </div>

        <nav className="hidden md:flex space-x-6 items-center">
          {getNavLinks()}
        </nav>

        {userRole === "guest" ? (
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-blue-600"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 border border-blue-600 px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative text-gray-700 hover:text-blue-600">🔔</button>
            <button className="relative text-gray-700 hover:text-blue-600">✉️</button>
            <div className="relative" ref={profileMenuRef}>
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              />
              <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3"></span>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          {getNavLinks()}
          {userRole === "guest" && (
            <>
              <a href="/login" className="block py-2 text-blue-600">Sign In</a>
              <a href="/register" className="block py-2 text-blue-600">Sign Up</a>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
