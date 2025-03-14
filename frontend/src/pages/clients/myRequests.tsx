import React, { useState, useEffect } from "react";
import { FaUser, FaTrash, FaTimes, FaSearch, FaChevronLeft, FaChevronRight, FaEdit } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { RequestSchema } from "../../components/Schemas/requestSchema";
import { useNavigate } from "react-router-dom";

interface FreelancerProfile {
    _id: string;
    name: string;
    profileImage: string | null;
    tagline: string;
}

interface Request {
    _id: string;
    freelancerId: string;
    fullName: string;
    email: string;
    description: string;
    createdAt: Date;
    hasContract?:boolean;
    status: "pending" | "accepted" | "rejected";
}

const MyRequestList: React.FC = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [freelancerProfiles, setFreelancerProfiles] = useState<FreelancerProfile[]>([]);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
    const ITEMS_PER_PAGE = 4;
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const navigate  = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosConfig.get(`/client/client-request`);
                const fetchedRequests = response.data.requests;
                const fetchedProfiles = await Promise.all(
                    fetchedRequests.map(async (request: Request) => {
                        try {
                            const profileResponse = await axiosConfig.get(`/client/freelancer/${request.freelancerId}`);
                            return profileResponse.data.freelancer;
                        } catch (error) {
                            return null;
                        }
                    })
                );
                setFreelancerProfiles(fetchedProfiles);
                setRequests(fetchedRequests);
                setFilteredRequests(fetchedRequests);
                setLoading(false);
            } catch (err) {
                setError("Failed to load requests. Please try again later.");
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    useEffect(() => {
        let result = [...requests];

        if (activeFilter !== "all") {
            result = result.filter(request => request.status === activeFilter);
          }
        
        if (searchTerm) {
            result = result.filter(request => 
                request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                freelancerProfiles.find(profile => profile._id === request.freelancerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredRequests(result);
        setCurrentPage(1);
    }, [searchTerm, requests, freelancerProfiles,activeFilter]);

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const currentRequests = filteredRequests.slice(
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

    const handleDeleteRequest = (id: string) => {
        setConfirmDelete(id);
    };

    const confirmDeleteRequest = async () => {
        if (confirmDelete) {
            try {
                const response = await axiosConfig.delete(`/client/delete-request/${confirmDelete}`);
                if (response.status === 200) {
                    setRequests(prev => prev.filter(req => req._id !== confirmDelete));
                    setFilteredRequests(prev => prev.filter(req => req._id !== confirmDelete));
                    toast.success("Request deleted successfully");
                }
            } catch (error) {
                toast.error('Failed to delete request');
            } finally {
                setConfirmDelete(null);
            }
        }
    };

    const handleEdit = (request: Request) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        if (selectedRequest) {
            try {
                const response = await axiosConfig.put(
                    `/client/update-request/${selectedRequest._id}`,
                    values
                );
                if (response.status === 200) {
                    toast.success("Request updated successfully!");
                    setRequests(prevRequests =>
                        prevRequests.map(request =>
                            request._id === selectedRequest._id ? { ...request, ...values } : request
                        )
                    );
                    setShowModal(false);
                    resetForm();
                }
            } catch {
                toast.error("Failed to update request. Please try again.");
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleMessage = async (requesterId: string) => {
        await axiosConfig.post('/users/set-contacts', {
            senderId: userId,
            receiverId: requesterId,
            role
        });
        navigate(`/messages`);
    };

    const handleSendContract = async(requestId,freelancerId) => {
        navigate('/client/send-contract', {
            state: {
              requestId: requestId,
              freelancerId: freelancerId,
            }
          });
    }

    if (loading) {
        return <Loader visible={loading} />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 pt-24 bg-gray-100 min-h-screen select-none">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center text-blue-600 font-semibold mb-4">
                <FaEdit className="mr-2"/> Requests List
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <FilterButton filter="all" label="All Requests" />
                  <FilterButton filter="pending" label="Pending" />
                  <FilterButton filter="accepted" label="Accepted" />
                  <FilterButton filter="rejected" label="Rejected" />
                </div>
                <div className="relative w-1/3 mb-2">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
    
              {currentRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No requests match your search" : "No requests found"}
                </div>
              ) : (
                <ul className="space-y-4">
                  {currentRequests.map((request, index) => {
                    const freelancerProfile = freelancerProfiles.find(
                      profile => profile._id === request.freelancerId
                    );
                    if (!freelancerProfile) return null;
    
                    return (
                      <li
                        key={index}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={freelancerProfile.profileImage || "/default-avatar.jpg"}
                                  alt={freelancerProfile.name}
                                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                                />
                                <div>
                                  <Link 
                                    to={`/client/freelancer-detail/${freelancerProfile._id}`}
                                    className="group"
                                  >
                                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                      {freelancerProfile.name}
                                    </h2>
                                  </Link>
                                  <p className="text-sm text-gray-500">{freelancerProfile.tagline}</p>
                                </div>
                                {request.status !== 'pending' && (
                              <div className="mt-3 flex items-center gap-3">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    request.status === 'accepted'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                                {request.status === 'accepted' && (
                                  <button
                                    onClick={() => request.hasContract ? navigate(`/client/contract/${request._id}`) : handleSendContract(request._id,freelancerProfile._id)}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    {request.hasContract ? 'View Contract' : 'Send Contract'}
                                  </button>
                                )}
                                <button 
                                    className="px-4 py-2 bg-gray-800 text-white hover:bg-blue-900 rounded-lg transition-colors"
                                    onClick={() => handleMessage(freelancerProfile._id)}
                                >
                                    Send Message
                                </button>
                               
                              </div>
                            )}
                              </div>
                              <div className="flex items-center gap-2">
                                {request.status === 'pending' && (
                                  <button
                                    onClick={() => handleEdit(request)}
                                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit request"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteRequest(request._id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                  title="Delete request"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>

                              
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

                {filteredRequests.length > ITEMS_PER_PAGE && (
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
            </div>
            </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-blue-50 p-5 text-center border-b border-gray-100 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Update Request</h2>
              <p className="text-xs text-gray-500 mt-1">Modify your existing request details</p>
            </div>

            {/* Formik Form */}
            <Formik
              initialValues={{
                fullName: selectedRequest?.fullName || '',
                email: selectedRequest?.email || '',
                description: selectedRequest?.description || ''
              }}
              validationSchema={RequestSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="p-6 space-y-4">
                  {/* Full Name Field */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="fullName"
                      id="fullName"
                      className={`w-full px-3 py-2 border ${
                        touched.fullName && errors.fullName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg focus:ring-1 focus:border-transparent text-sm`}
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage 
                      name="fullName" 
                      component="div" 
                      className="text-red-500 text-xs mt-1" 
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`w-full px-3 py-2 border ${
                        touched.email && errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg focus:ring-1 focus:border-transparent text-sm`}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage 
                      name="email" 
                      component="div" 
                      className="text-red-500 text-xs mt-1" 
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className={`w-full px-3 py-2 border ${
                        touched.description && errors.description 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg focus:ring-1 focus:border-transparent text-sm resize-none`}
                      placeholder="Describe your project..."
                    />
                    <ErrorMessage 
                      name="description" 
                      component="div" 
                      className="text-red-500 text-xs mt-1" 
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "Update Request"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      
      {
        confirmDelete && 
        <ConfirmMessage
          message="Are you sure you want to delete this request"
          onConfirm={confirmDeleteRequest}
          onCancel={() => setConfirmDelete(null)}
        />
      }
    </div>
  );
};

export default MyRequestList;
