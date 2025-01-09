import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";

interface Bid {
  _id: string;
  rate: number;
  deliveryTime: number;
  taskId: { _id: string, projectName: string, rateType: string };
  timeUnit: string;
  createdAt: Date;
  status: "pending" | "accepted" | "rejected";
}

const ActiveBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null); 
  const [formData, setFormData] = useState({
    rate: 0,
    deliveryTime: 0,
    timeUnit: "Days",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axiosConfig
        .get(`/freelancers/bid/${userId}`)
        .then((response) => {
          setBids(response.data.bid);
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

  const deleteBid = async (bidId: string) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      try {
        const response = await axiosConfig.delete(`/freelancers/delete-bid/${bidId}`);
        if (response.status === 200) {
          setBids((prevBids) => prevBids.filter((bid) => bid._id !== bidId));
          alert("Bid deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting bid:", err);
        alert("Failed to delete bid. Please try again.");
      }
    }
  };

  const handleEditClick = (bid: Bid) => {
    setSelectedBid(bid); 
    setFormData({
      rate: bid.rate,
      deliveryTime: bid.deliveryTime,
      timeUnit: bid.timeUnit,
    });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedBid) {
      try {
        const updatedBid = {
          rate: formData.rate,
          deliveryTime: formData.deliveryTime,
          timeUnit: formData.timeUnit,
        };

        const response = await axiosConfig.put(
          `/freelancers/update-bid/${selectedBid._id}`,
          updatedBid
        );

        if (response.status === 200) {
          alert("Bid updated successfully!");

          setBids((prevBids) =>
            prevBids.map((bid) =>
              bid._id === selectedBid._id ? { ...bid, ...updatedBid } : bid
            )
          );
          setShowModal(false);
        }
      } catch {
        alert("Failed to update bid. Please try again.");
      }
    }
  };

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
              <Link to={`/freelancer/task-detail/${bid.taskId._id}`}>
            <li
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 py-4"
            >
              <div>
                <h2 className="text-lg font-medium">{bid.taskId.projectName}</h2>
                
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => handleEditClick(bid)}
                    className="flex items-center bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => deleteBid(bid._id)}
                    className="flex items-center bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 py-4  rounded-md flex justify-evenly w-1/4">
              <div className="text-center">
                <p className="text-lg font-medium">${bid.rate}</p>
                
                <p className="text-sm text-gray-500">{bid.taskId.rateType} Rate</p>
                </div>
                <div className="text-center">
                <p className="text-lg font-medium">{bid.deliveryTime}</p>
                <p className="text-sm text-gray-500"> {bid.timeUnit}</p>
                </div>
                
                
              </div>
            </li>
            </Link>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Your Bid</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-600 text-sm">Set your minimum rate</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Set your delivery time</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="w-16 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3"
                    required
                  />
                  <select
                    name="timeUnit"
                    value={formData.timeUnit}
                    onChange={handleChange}
                    className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBids;
