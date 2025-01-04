import React, { useState, useEffect } from "react";
import axiosConfig from "../../service/axios";
import FilterSidebar from "../../components/shared/FilterSideBar";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const FreelancerList: React.FC = () => {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [bookmarkedFreelancers, setBookmarkedFreelancers] = useState<Set<string>>(new Set());

  useEffect(() => {
    axiosConfig
      .get("/client/freelancer-list")
      .then((response) => {
        setFreelancers(response.data.data); 
        console.log(response.data.data)
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load freelancers.");
        setLoading(false);
      });
  }, []);

  const toggleBookmark = (id: string) => {
    const updatedBookmarks = new Set(bookmarkedFreelancers);
    if (updatedBookmarks.has(id)) {
      updatedBookmarks.delete(id); // Remove if already bookmarked
    } else {
      updatedBookmarks.add(id); // Add if not bookmarked
    }
    setBookmarkedFreelancers(updatedBookmarks);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const categories = ["All Categories", "Web Development", "Graphic Design"];

  return (
    <div className="hero section pt-14 px-4 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Search Filter Section */}
        <FilterSidebar/>

        {/* Freelancer List Section */}
        <div className="pt-14 flex-grow">
        <h2 className="pb-5 text-2xl font-semibold">Freelancers</h2>
          <div className="flex justify-between items-center mb-4">
           
            <input
            type="text"
            placeholder="Search"
            className="p-2 border border-gray-300 bg-gray-100 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            <select className="p-2 border rounded-md text-sm">
              <option>Sort by: Relevance</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer, index) => (
              <Link to={`/client/freelancer-detail/${freelancer._id}`}>
              <div
                key={index}
                className="relative bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                {/* Bookmark Icon */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    toggleBookmark(freelancer._id);
                  }}
                  className={`absolute top-2 right-4 p-2 rounded-full ${
                    bookmarkedFreelancers.has(freelancer._id) ? "bg-orange-400" : "bg-gray-200"
                  }`}
                >
                  {bookmarkedFreelancers.has(freelancer._id) ? (
                    <FaStar className="text-white w-6 h-6" />
                  ) : (
                    <FaRegStar className="text-gray-500 w-6 h-6" />
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
                
              </div>
              </Link>
            ))}
          </div>
          {/* Pagination  */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  page === 2
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
