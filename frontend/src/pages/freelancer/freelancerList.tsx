import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import FilterSidebar from "../../components/shared/FilterSideBar";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Loader from "../../components/shared/Loader";

const FreelancerList: React.FC = () => {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [bookmarks, setBookmarks] =  useState<{ itemId: string; type: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState({
      category: "",
      skills: [],
      priceRange: { min: 10, max: 1000 },
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
    
    try {
      const response = await axiosConfig.get("/client/freelancer-list", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortOption,
          searchTerm:debouncedSearchTerm,
          category:filters.category,
          skills:filters.skills,
          priceRange:filters.priceRange
        },
      });
      setFreelancers(response.data.data);
      setTotalPages(response.data.totalPages); 
      setLoading(false);
    } catch (err) {
      setError("Failed to load freelancers.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [sortOption, currentPage, debouncedSearchTerm,filters]);


  
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
      const response = await axiosConfig.get(`/users/bookmarks`);
      
      if(response.data.bookmark){
        setBookmarks(response.data.bookmark.items)
      }
    }
    getBookmark()
  },[])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // const filteredTasks = freelancers.filter((freelancer) =>
  //     freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  

  if (loading)  return <Loader visible={loading} />;
  if (error) return <div>{error}</div>;

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
            onChange={(e)=> setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 bg-gray-100 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Sort By text and select dropdown on the right */}
          <div className="flex items-center select-none">
            <span className="mr-2 text-gray-600 select-none">Sort By:</span>
            <select 
            className="p-2  rounded "
            value={sortOption}
            onChange={(e)=> setSortOption(e.target.value)}
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer, index) => (
              <div
                key={index}
                className="relative bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                {/* Bookmark Icon */}
                <button
                  onClick={() => handleBookmark(freelancer._id)}
                  className={`absolute top-2 right-4 p-2 rounded-full ${bookmarks.some((bookmark) => bookmark.itemId === freelancer._id) ?"bg-blue-600":("bg-gray-200")}
                `}
                >
                  {bookmarks.some((bookmark) => bookmark.itemId === freelancer._id) ? (
                    <FaStar className="text-white w-6 h-6 rounded-full  " />
                  ) : (
                    <FaRegStar className="text-gray-500 w-6 h-6 rounded-full " />
                  )}
                </button>
                <img
                  src={freelancer.profileImage}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full mb-4"

                />
                
                <h3 className="text-lg font-semibold">{freelancer.name}</h3>
                <p
                  className='px-3 py-1 rounded-full text-sm mt-2'
                >
                  {freelancer.tagline}
                </p>
                <p className="text-blue-500 font-bold mt-2">{freelancer.rate}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < Math.round(freelancer.rating) ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5 text-yellow-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.5l1.76 3.57 3.92.56-2.84 2.77.67 3.91L12 14.56l-3.51 1.85.67-3.91-2.84-2.77 3.92-.56L12 4.5z"
                      />
                    </svg>
                  ))}
                </div>
                <Link to={`/client/freelancer-detail/${freelancer._id}`}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition mt-2">View Detail</button>
                </Link>
              </div>
              
            ))}
          </div>
          {/* Pagination  */}
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
        </div>
      </div>
    </div>
  );
};

export default FreelancerList;
