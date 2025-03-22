import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import FilterSidebar from "../../components/shared/FilterSideBar";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Loader from "../../components/shared/Loader";

interface Filters {
  category: string;
  skills: string[];
  priceRange: {
    min: number;
    max: number;
  };
  experience: string;
}

interface Freelancer {
  _id: string;
  name:string;
  profileImage:string;
  rate: number;
  tagline: string;
  rating: number;
  averageRating?:number;
  totalReviews?:number;
}

const FreelancerList: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [bookmarks, setBookmarks] =  useState<{ itemId: string; type: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
      category: "",
      skills: [],
      priceRange: { min: 10, max: 500 },
      experience: "",
    });
  const userId = localStorage.getItem('userId');
  const ITEMS_PER_PAGE = 6;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); 
    }, 600); 

    return () => {
      clearTimeout(handler); 
    };
  }, [searchTerm]);

  const fetchFreelancers = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axiosConfig.get("/client/freelancer-list", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortOption,
          searchTerm:debouncedSearchTerm,
          category:filters.category,
          skills:filters.skills,
          priceRange:filters.priceRange,
          experience: filters.experience
        },
      });
      
      if (response.data && response.data.data) {
        const freelancerData = response.data.data;
        setFreelancers(freelancerData);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setFreelancers([]);
        setError("No data received from server");
      }
    } catch (err) {
      console.error("Error fetching freelancers:", err);
      setFreelancers([]);
      setError("Failed to load freelancers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [sortOption, currentPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [debouncedSearchTerm]);
  
  const handleBookmark = async (itemId: string) => {
    const type = 'freelancer'
    if (bookmarks.some((bookmark) => bookmark.itemId === itemId)) {
      try {
        await axiosConfig.delete(`/users/bookmarks/${itemId}`,{
          data: {userId, type}
        });
        setBookmarks(bookmarks.filter((bookmark) => bookmark.itemId !== itemId));
      } catch (error) {
        console.error('Error removing bookmark:',error);
      }
    }else {
      try {
        await axiosConfig.post('/users/bookmarks', {userId,itemId, type});
        setBookmarks([...bookmarks,{itemId,type}]);
      } catch (error) {
        console.error('Error adding bookmark:',error);
      }
    }
  };
  
  useEffect(()=>{
    const getBookmark = async() => {
      try {
        const response = await axiosConfig.get(`/users/bookmarks`);
        
        if(response.data.bookmark){
          setBookmarks(response.data.bookmark.items || []);
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setBookmarks([]);
      }
    }
    getBookmark()
  },[])

  const handleFilterChange = (newFilters:Filters) => {
    setFilters(newFilters);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <Loader visible={loading} />;
  
  if (error) {
    return (
      <div className="hero section pt-14 px-4 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar onFilterChange={handleFilterChange} />
          
          <div className="pt-14 flex-grow">
            <h2 className="pb-5 text-2xl font-semibold">Freelancers</h2>
            <div className="flex justify-between items-center mb-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 bg-gray-100 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center select-none">
                <span className="mr-2 text-gray-600 select-none">Sort By:</span>
                <select 
                  className="p-2 rounded"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Error</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button 
                  onClick={() => {
                    fetchFreelancers();
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero section pt-14 px-4 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search Filter Section */}
        <FilterSidebar onFilterChange={handleFilterChange} />

        {/* Freelancer List Section */}
        <div className="pt-14 flex-grow">
          <h2 className="pb-5 text-2xl font-semibold">Freelancers</h2>
          <div className="flex justify-between items-center mb-4">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 bg-gray-100 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Sort By text and select dropdown on the right */}
            <div className="flex items-center select-none">
              <span className="mr-2 text-gray-600 select-none">Sort By:</span>
              <select 
                className="p-2 rounded"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          
          {freelancers && freelancers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {freelancers.map((freelancer, index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center"
                >
                  {/* Bookmark Icon */}
                  <button
                    onClick={() => handleBookmark(freelancer._id)}
                    className={`absolute top-2 right-4 p-2 rounded-full ${bookmarks.some((bookmark) => bookmark.itemId === freelancer._id) ? "bg-blue-600" : "bg-gray-200"}`}
                  >
                    {bookmarks.some((bookmark) => bookmark.itemId === freelancer._id) ? (
                      <FaStar className="text-white w-6 h-6 rounded-full" />
                    ) : (
                      <FaRegStar className="text-gray-500 w-6 h-6 rounded-full" />
                    )}
                  </button>
                  <img
                    src={freelancer.profileImage}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full mb-4"
                  />
                  
                  <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                  <p className="px-3 py-1 rounded-full text-sm mt-2">
                    {freelancer.tagline}
                  </p>
                  <p className="text-blue-500 font-bold mt-2">{freelancer.rate}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex px-2 py-1 bg-yellow-500 rounded-md mr-2">
                      <span className="text-sm text-white">
                        {freelancer.averageRating ? freelancer.averageRating.toFixed(1) : "0.0"} 
                      </span>
                    </div>
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.round(freelancer.averageRating || 0) 
                            ? "text-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <Link to={`/client/freelancer-detail/${freelancer._id}`}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mt-2">View Detail</button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Freelancers Found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any freelancers matching your search criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      category: "",
                      skills: [],
                      priceRange: { min: 10, max: 500 },
                      experience: "",
                    });
                    setSortOption("Relevance");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Pagination  */}
          {freelancers && freelancers.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerList;