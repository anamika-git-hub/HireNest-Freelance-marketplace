import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if the current path is "register" or "login"
  const isAuthPage = location.pathname === "/register" || location.pathname === "/login";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 flex items-center">
          <span className="mr-2">🔷</span> HireNest
        </div>

        {/* Conditionally render navbar links only if not on auth pages */}
        {!isAuthPage && (
          <>
            {/* Navbar Links */}
            <nav className="hidden md:flex space-x-6 items-center">
              <a href="#home" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="#findwork" className="text-gray-700 hover:text-blue-600">
                About
              </a>
              <a href="#foremployers" className="text-gray-700 hover:text-blue-600">
                Contact
              </a>
              <a href="#dashboard" className="text-gray-700 hover:text-blue-600">
                Post task
              </a>
              <a href="#pages" className="text-gray-700 hover:text-blue-600">
                Find talent
              </a>
            </nav>

            {/* Buttons and Notifications */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="relative text-gray-700 hover:text-blue-600">
                🔔
                <span className="absolute top-0 right-0 text-xs bg-blue-500 text-white rounded-full px-1">
                  4
                </span>
              </button>
              <button className="relative text-gray-700 hover:text-blue-600">
                ✉️
                <span className="absolute top-0 right-0 text-xs bg-blue-500 text-white rounded-full px-1">
                  3
                </span>
              </button>
              <div className="relative">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-green-500"
                />
                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3"></span>
              </div>
            </div>
          </>
        )}

        {/* Mobile Menu Button */}
        {!isAuthPage && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {!isAuthPage && isMenuOpen && (
        <div className="md:hidden bg-white shadow-md p-4">
          <a href="#home" className="block py-2 text-gray-700 hover:text-blue-600">
            Home
          </a>
          <a href="#findwork" className="block py-2 text-gray-700 hover:text-blue-600">
            About
          </a>
          <a href="#foremployers" className="block py-2 text-gray-700 hover:text-blue-600">
            Contact
          </a>
          <a href="#dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
            Post task
          </a>
          <a href="#pages" className="block py-2 text-gray-700 hover:text-blue-600">
            Find talent
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
