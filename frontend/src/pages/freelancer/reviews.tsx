import React, { useEffect, useRef, useState } from "react";
import axiosConfig from "../../service/axios";
import { FaChevronLeft, FaChevronRight, FaRegStar, FaStar } from "react-icons/fa";

interface Review {
    _id: string;
    clientId: string;
    clientName: string;
    rating: number;
    review: string;
    projectName: string;
    createdAt: string;
  }

interface ApiResponse {
  data: Review[];
  totalPages: string;
}  

const ReviewsList:React.FC = () => {
    const [reviews,setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const ITEMS_PER_PAGE = 4;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      },600);
      return () => {
        clearTimeout(handler);
      };
    },[searchTerm]);
    useEffect(() => {
      if(inputRef.current) {
        inputRef.current.focus();
      }
    },[debouncedSearchTerm]);

    useEffect(() => {
        const getReviews = async () => {
            try {
                const response = await axiosConfig.get(`/freelancers/reviews/${userId}`,
                  {
                    params: {
                      page: currentPage,
                      limit: ITEMS_PER_PAGE,
                      searchTerm: debouncedSearchTerm
                    }
                  }
                )
                setReviews(response.data.reviews);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                setError('Failed to load freelancer reviews')
            } finally {
                setLoading(false);
            }
        }
        getReviews()
    },[currentPage,debouncedSearchTerm]);

     const renderStars = (rating: number) => {
        return Array(5)
          .fill(0)
          .map((_, index) => (
            <span key={index}>
              {index < rating ? (
                <FaStar className="text-yellow-400 inline" />
              ) : (
                <FaRegStar className="text-gray-300 inline" />
              )}
            </span>
          ));
      };

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      };
    
      const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0,0);
      }
      if (loading) return <div> Loading...</div>;
      if (error) return <div>{error}</div>;

    return(
        <>
         <div className="p-6 pt-24 bg-gray-100 min-h-screen">
         <div className="mb-6">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 bg-white rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center text-blue-600 font-semibold mb-4">
          <span className="mr-2">⭐</span> Client Reviews
        </div>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{review.projectName}</h3>
                  <div className="flex items-center mt-1">
                    <div className="mr-2">{renderStars(review.rating)}</div>
                    <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Client:</p>
                  <p className="text-sm text-gray-600">{review.clientName}</p>
                </div>
              </div>
              <p className="mt-3 text-gray-700">{review.review}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
        
      </div>
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
      
          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1)
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
      </div>
      </div>
      </>
    )}



export default ReviewsList;
