import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";
import { BidValidationSchema } from "../../components/Schemas/bidValidationSchema";

interface Bid {
  _id: string;
  rate: number;
  deliveryTime: number;
  taskId: { _id: string, projectName: string, rateType: string , minRate: number, maxRate: number };
  timeUnit: string;
  createdAt: Date;
  status: "pending" | "accepted" | "rejected";
}

interface FormValues {
  rate: number;
  deliveryTime: number;
  timeUnit: string;
}

const ActiveBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null); 
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axiosConfig
        .get(`/users/bid/${userId}`)
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

  const deleteBid = (bidId: string) => {
    setConfirmDelete(bidId);
  }

  const confirmDeleteBid = async () => {
    if (confirmDelete) {
      try {
        const response = await axiosConfig.delete(`/freelancers/delete-bid/${confirmDelete}`);
        if (response.status === 200) {
          setBids((prevBids) => prevBids.filter((bid) => bid._id !== confirmDelete));
          toast.success("Bid deleted successfully");
        }
      } catch (err) {
        console.error("Error deleting bid:", err);
        toast.error("Failed to delete bid. Please try again.");
      }
    }
    setConfirmDelete(null);
  };

  const handleEditClick = (bid: Bid) => {
    setSelectedBid(bid);
    setShowModal(true);
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    if (selectedBid) {
      try {
        const updatedBid = {
          rate: values.rate,
          deliveryTime: values.deliveryTime,
          timeUnit: values.timeUnit,
        };

        const response = await axiosConfig.put(
          `/freelancers/update-bid/${selectedBid._id}`,
          updatedBid
        );

        if (response.status === 200) {
          toast.success("Bid updated successfully!");

          setBids((prevBids) =>
            prevBids.map((bid) =>
              bid._id === selectedBid._id ? { ...bid, ...updatedBid } : bid
            )
          );
          setShowModal(false);
        }
      } catch {
        toast.error("Failed to update bid. Please try again.");
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader visible={loading} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen select-none">
      <div className="bg-white rounded-lg shadow-md p-4 max-w-6xl mx-auto">
        <div className="flex items-center text-blue-600 font-semibold mb-4">
          <FaEdit className="mr-2"/> Bids List
        </div>
        <ul>
          {bids.map((bid, index) => (
            <li
              key={index}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b last:border-b-0 py-4 space-y-4 md:space-y-0"
            >
              <div className="w-full md:w-auto">
                <Link to={`/freelancer/task-detail/${bid.taskId._id}`}>
                  <h2 className="text-lg font-medium">{bid.taskId.projectName}</h2>
                </Link>
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
              <div className="bg-gray-100 py-4 rounded-md flex justify-evenly w-full md:w-1/4">
                <div className="text-center">
                  <p className="text-lg font-medium">${bid.rate}</p>
                  <p className="text-sm text-gray-500">{bid.taskId.rateType} Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">{bid.deliveryTime}</p>
                  <p className="text-sm text-gray-500">{bid.timeUnit}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
  
      {showModal && selectedBid && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 sm:w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Your Bid</h2>
            <Formik
              initialValues={{
                rate: selectedBid.rate,
                deliveryTime: selectedBid.deliveryTime,
                timeUnit: selectedBid.timeUnit,
              }}
              validationSchema={BidValidationSchema({
                minRate: selectedBid.taskId.minRate,
                maxRate: selectedBid.taskId.maxRate,
              })}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="text-gray-600 text-sm">Set your minimum rate</label>
                    <Field
                      type="number"
                      name="rate"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="rate"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-gray-600 text-sm">Set your delivery time</label>
                    <div className="flex gap-2">
                      <Field
                        type="number"
                        name="deliveryTime"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Field
                        as="select"
                        name="timeUnit"
                        className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Days">Days</option>
                        <option value="Weeks">Weeks</option>
                      </Field>
                    </div>
                    <ErrorMessage
                      name="deliveryTime"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                    <ErrorMessage
                      name="timeUnit"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {isSubmitting ? "Updating..." : "Update Bid"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {confirmDelete && 
        <ConfirmMessage
          message="Are you sure you want to delete this bid?"
          onConfirm={confirmDeleteBid}
          onCancel={() => setConfirmDelete(null)}
        />
      }
    </div>
  );  
};

export default ActiveBids;