import React from "react";
import { FaUsers, FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";

interface Task {
  title: string;
  timeLeft: string;
  isExpiring: boolean;
  bidders: number;
  avgBid: string;
  priceRange: string;
  type: "Hourly Rate" | "Fixed Price";
}

const tasks: Task[] = [
  {
    title: "Design a Landing Page",
    timeLeft: "23 hours left",
    isExpiring: true,
    bidders: 3,
    avgBid: "$22",
    priceRange: "$15 - $30",
    type: "Hourly Rate",
  },
  {
    title: "Food Delivery Mobile Application",
    timeLeft: "6 days, 23 hours left",
    isExpiring: false,
    bidders: 3,
    avgBid: "$3,200",
    priceRange: "$2,500 - $4,500",
    type: "Fixed Price",
  },
];

const MyTaskList: React.FC = () => {
  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center text-blue-600 font-semibold mb-4">
          <FaUsers className="mr-2" /> My Tasks
        </div>
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 py-4"
            >
              <div className="w-3/4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-medium">{task.title}</h2>
                  {task.isExpiring && (
                    <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded">
                      Expiring
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <AiOutlineClockCircle className="mr-2" />
                  {task.timeLeft}
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    <FaUsers className="mr-1" /> Manage Bidders
                    <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                      {task.bidders}
                    </span>
                  </button>
                  <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex justify-between w-1/4">
                {/* Bids */}
                <div className="text-center">
                  <p className="text-lg font-medium">{task.bidders}</p>
                  <p className="text-sm text-gray-500">Bids</p>
                </div>
                
                {/*Avg. Bid */}
                <div className="text-center">
                  <p className="text-lg font-medium">{task.avgBid}</p>
                  <p className="text-sm text-gray-500">Avg. Bid</p>
                </div>
                
                {/* Price Range */}
                <div className="text-center">
                  <p className="text-lg font-medium">{task.priceRange}</p>
                  <p className="text-sm text-gray-500">{task.type}</p>
                </div>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyTaskList;
