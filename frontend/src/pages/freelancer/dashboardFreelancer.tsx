import React from 'react';
import { FaBell, FaEllipsisH, FaClock, FaUsers, FaUserCircle,  FaEdit, FaTrash  } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoIosArrowForward,IoMdTime } from "react-icons/io";

const Dashboard: React.FC = () => {
  return (
    <section className="bg-blue-100 w-full">
      <div className="p-6 pt-36 space-y-6 mx-">
        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">Task Bids Won</h3>
            <p className="text-2xl font-bold">22</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">Tasks Done</h3>
            <p className="text-2xl font-bold text-pink-500">28</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">Reviews</h3>
            <p className="text-2xl font-bold text-yellow-500">28</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">This Month Views</h3>
            <p className="text-2xl font-bold text-blue-500">987</p>
          </div>
        </div>

        {/* Graph and Notifications */}
        <div className="grid grid-cols-3 gap-6">
          {/* Graph Section */}
          <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-gray-600 text-sm font-semibold">Your Profile Views</h3>
            <p className="text-gray-400 text-xs">Last 6 Months</p>
            <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Graph Placeholder</p>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 text-lg font-bold">Notifications</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <FaBell className="w-5 h-5" />
              </button>
            </div>
            <ul className="mt-4 divide-y divide-gray-200">
              <li className="flex items-start py-2">
                <FaUserCircle className="w-6 h-6 text-gray-300" />
                <p className="ml-3 text-sm text-gray-700">
                  Michael Shannah applied for a job <strong>Full Stack Software Engineer</strong>
                </p>
              </li>
              <li className="flex items-start py-2">
                <FaUsers className="w-6 h-6 text-gray-300" />
                <p className="ml-3 text-sm text-gray-700">
                  Gilber Allanis placed a bid on your <strong>iOS App Development</strong> project
                </p>
              </li>
              <li className="flex items-start py-2">
                <FaClock className="w-6 h-6 text-gray-300" />
                <p className="ml-3 text-sm text-gray-700">
                  Your job listing <strong>Full Stack Software Engineer</strong> is expiring
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bidders and My Tasks */}
        <div className="grid grid-cols-3 gap-6">
          {/* Bidders Section */}
          <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-gray-600 text-sm font-semibold">Bidders</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img className="w-12 h-12 rounded-full" src="https://via.placeholder.com/150" alt="Profile" />
                  <div>
                    <h4 className="font-bold">David Peterson</h4>
                    <p className="text-gray-400 text-sm">david@example.com</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">$3,200</p>
              </li>
            </ul>
          </div>

          {/* My Tasks Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">My Bids</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <FaEllipsisH className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-6">
              <li className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-semibold">Design a Landing Page</p>
                  <span className="text-yellow-600 bg-yellow-100 text-xs px-2 py-1 rounded">Expiring</span>
                </div>
                <p className="text-gray-500 text-sm flex items-center mt-2">
                  <IoMdTime className="mr-1" />
                  23 hours left
                </p>
                <div className="mt-3 flex items-center">
                    <button className="flex items-center bg-gray-200 text-gray-600 px-3 mx-2 py-1 rounded-md hover:bg-gray-300">
                        <FaEdit className="mr-1" /> 
                    </button>
                    <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                        <FaTrash className="mr-1" /> 
                    </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
