import React, { useState, useEffect } from "react";
import { FaUser, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";

interface Request {
    _id: string;
    requesterId: string;
    fullName: string;
    email: string;
    description: string;
    createdAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
}

interface ConfirmAction {
    requestId: string;
    action: 'accept' | 'reject';
}

const RequestList: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<Request[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
    const ITEMS_PER_PAGE = 4;

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    const fetchRequests = async () => {
        try {
            const response = await axiosConfig.get(`/freelancers/freelancer-request`);
            const fetchedRequests = response.data.requests;
            setRequests(fetchedRequests);
            setFilteredRequests(fetchedRequests);
            setLoading(false);
        } catch (err) {
            setError("Failed to load requests. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
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
                request.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredRequests(result);
        setCurrentPage(1); 
    }, [searchTerm, activeFilter, requests]);

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

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        const { requestId, action } = confirmAction;
        try {
            setLoading(true);
            const response = await axiosConfig.patch(`/freelancers/request-status/${requestId}`, {
                status: action === 'accept' ? 'accepted' : 'rejected'
            });

            if (response.status === 200) {
                toast.success(`Request ${action}ed successfully`);
                await fetchRequests();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${action} request`);
        } finally {
            setLoading(false);
            setConfirmAction(null);
        }
    };

    const sendMessage = async (requesterId: string) => {
        await axiosConfig.post('/users/set-contacts', {
            senderId: userId,
            receiverId: requesterId,
            role
        });
        navigate(`/messages`);
    };

    if (loading) {
        return <Loader visible={loading} />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 pt-24 bg-gray-100 min-h-screen">
            {confirmAction && (
                <ConfirmMessage
                    message={`Are you sure you want to ${confirmAction.action} this request?`}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setConfirmAction(null)}
                />
            )}

            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center text-blue-600 font-semibold mb-4">
                    <FaUser className="mr-2" />{filteredRequests.length} Requests
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <FilterButton filter="all" label="All Requests" />
                        <FilterButton filter="pending" label="Pending" />
                        <FilterButton filter="accepted" label="Accepted" />
                        <FilterButton filter="rejected" label="Rejected" />
                    </div>
                    <div className="relative w-1/3">
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
                    <ul>
                        {currentRequests.map((request) => (
                            <li
                                key={request._id}
                                className="flex items-center justify-between p-4 border-b last:border-0"
                            >
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h2 className="font-semibold text-lg flex items-center space-x-2">
                                            <span>{request.fullName}</span>
                                        </h2>
                                        <p className="text-sm text-gray-500 flex items-center space-x-2">
                                            <span>{request.email}</span>
                                        </p>
                                        <div className="flex mt-3 space-x-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => setConfirmAction({
                                                            requestId: request._id,
                                                            action: 'accept'
                                                        })}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmAction({
                                                            requestId: request._id,
                                                            action: 'reject'
                                                        })}
                                                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {request.status !== 'pending' && (
                                                <span className={`px-4 py-2 rounded-md ${
                                                    request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            )}

                                            <button
                                                onClick={() => sendMessage(request.requesterId)}
                                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                                            >
                                                Send Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
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
    );
};

export default RequestList;