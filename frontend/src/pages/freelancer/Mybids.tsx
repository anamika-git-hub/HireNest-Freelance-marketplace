import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosConfig from "../../service/axios";

interface Bid { 
  rate: number;
  deliveryTime: number;
  taskId:{projectName:string, rateType: string},
  timeUnit: string;
  createdAt: Date;
  status: "pending" | "accepted" | "rejected";
}

const ActiveBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    if (userId) {
      axiosConfig
        .get(`/freelancers/bid/${userId}`)
        .then((response) => {
          setBids(response.data.bid); 
          console.log(response.data)
          setLoading(false); 
        })
        .catch((err) => {
          setError("Failed to fetch bids");
          setLoading(false); 
        });
    } else {
      setError("User not logged in"); 
      setLoading(false);
    }
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center text-blue-600 font-semibold mb-4">
          <FaEdit className="mr-2" /> Bids List
        </div>
        <ul>
          {bids.map((bid, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 py-4"
            >
              <div>
                <h2 className="text-lg font-medium">{bid.taskId.projectName}</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <button className="flex items-center bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 p-3 rounded-md text-center">
                <p className="text-lg font-medium">${bid.rate}</p>
                <p className="text-sm text-gray-500">{bid.taskId.rateType} Rate</p>
                <p className="text-sm text-gray-500">{bid.deliveryTime} {bid.timeUnit}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActiveBids;
