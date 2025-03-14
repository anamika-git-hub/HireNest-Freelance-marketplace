import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaSearch} from "react-icons/fa";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import NotificationItem from "../../components/shared/notificationItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Notification {
  role: string;
  text: string;
  profileUrl: string;
  projectUrl: string;
  types: string;
  senderName: string;
  projectName: string;
  freelancerName: string;
  createdAt?: string;
}

const ITEMS_PER_PAGE = 5;

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) {
          throw new Error('User not logged in');
        }

        const { data } = await axiosConfig.get('/users/notifications', {
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            searchTerm: debouncedSearchTerm, 
            role: role
          }
        });
        
        setNotifications(data.result);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, role, currentPage, debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loader visible={loading} />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen select-none">
      <div className="bg-white shadow-md rounded-lg p-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-800 text-lg font-bold">Notifications</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FaBell className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={index} className="py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <NotificationItem 
                      notification={notification} 
                      role={role} 
                    />
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No notifications found</p>
          )}
        </ul>

        
      </div>
      {totalPages > 1 && (
  <div className="flex justify-center gap-2 mt-6">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
              <span className="px-4 py-2">...</span>
              <button
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
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
            className={`px-4 py-2 border rounded-lg ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        );
      })}

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      <FaChevronRight className="w-4 h-4" />
    </button>
  </div>
)}
    </div>
  );
};

export default Notifications;