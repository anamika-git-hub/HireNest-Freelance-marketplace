import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaEdit, FaTrash, FaTimes, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";
import { BidValidationSchema } from "../../components/Schemas/bidValidationSchema";

interface Bid {
  _id: string;
  rate: number;
  deliveryTime: number;
  taskId: { _id: string; projectName: string; rateType: string; minRate: number; maxRate: number };
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
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const ITEMS_PER_PAGE = 4;

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      axiosConfig
        .get(`/users/bid/${userId}`)
        .then((response) => {
          setBids(response.data.bid);
          setFilteredBids(response.data.bid);
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

  useEffect(() => {
    let result = [...bids];
    
    if (activeFilter !== "all") {
      result = result.filter(bid => bid.status === activeFilter);
    }
    
    if (searchTerm) {
      result = result.filter(bid => 
        bid.taskId.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBids(result);
    setCurrentPage(1); 
  }, [searchTerm, activeFilter, bids]);

  const totalPages = Math.ceil(filteredBids.length / ITEMS_PER_PAGE);
  const currentBids = filteredBids.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const FilterButton: React.FC<{
    filter: "all" | "pending" | "accepted" | "rejected";
    label: string;
  }> = ({ filter, label }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-md transition-colors ${
        activeFilter === filter
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

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
    <div className="p-4 pt-24 bg-gray-100 min-h-screen select-none">
       <div className="max-w-6xl mx-auto space-y-6">

          {/* Bids List */}
      <div className="bg-white rounded-lg shadow-md p-4 max-w-6xl mx-auto">
        <div className="flex items-center text-blue-600 font-semibold mb-4">
          <FaEdit className="mr-2"/> Bids List
        </div>
         <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <FilterButton filter="all" label="All Bids" />
            <FilterButton filter="pending" label="Pending" />
            <FilterButton filter="accepted" label="Accepted" />
            <FilterButton filter="rejected" label="Rejected" />
          </div>
          <div className="relative w-1/3 mb-2">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search bids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </div>
        {currentBids.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No bids match your search" : "No bids found"}
            </div>
          ) : (
            <ul className="space-y-4">
            {currentBids.map((bid, index) => (
              <li
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <Link 
                        to={`/freelancer/task-detail/${bid.taskId._id}`}
                        className="group"
                      >
                        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {bid.taskId.projectName}
                        </h2>
                      </Link>
                      
                      <div className="flex items-center gap-2">
                        {bid.status === 'pending' && (
                          <button
                            onClick={() => handleEditClick(bid)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit bid"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteBid(bid._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete bid"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
      
                    {bid.status !== 'pending' && (
                      <div className="mt-3 flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            bid.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </span>
                        
                        {bid.status === 'accepted' && (
                          <button
                            onClick={() => navigate(`/freelancer/contract/${bid._id}`)}
                            className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                          >
                            View Contract
                          </button>
                        )}
                      </div>
                    )}
                  </div>
      
                  <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-lg">
                    <div className="text-center">
                      <p className="text-xl font-semibold text-gray-800">${bid.rate}</p>
                      <p className="text-sm text-gray-500">{bid.taskId.rateType} Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-gray-800">{bid.deliveryTime}</p>
                      <p className="text-sm text-gray-500">{bid.timeUnit}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
         )}
      </div>

      {filteredBids.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNumber => {
                if (pageNumber === 1 || pageNumber === totalPages) return true;
                if (Math.abs(pageNumber - currentPage) <= 2) return true;
                return false;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index] - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="w-8 h-8 flex items-center justify-center text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          page === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
           )}
  
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
    </div>
  );  
};

export default ActiveBids;