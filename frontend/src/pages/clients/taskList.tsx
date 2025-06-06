import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";
import FilterSidebar from "../../components/shared/FilterSideBar";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Loader from "../../components/shared/Loader";

interface Filters {
  category: string;
  skills: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface Task {
  _id:string;
  projectName:string;
  category:string;
  rateType:string;
  minRate:number;
  maxRate:number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<{ itemId: string; type: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("Relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    skills: [],
    priceRange: { min: 10, max: 500 },
  });

  const userId = localStorage.getItem("userId");
  const ITEMS_PER_PAGE = 4;

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchTasks = async () => {
    try {
      const response = await axiosConfig.get("/freelancers/tasks-list", {
        params: {
          status:['pending','onhold'],
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortOption,
          searchTerm: debouncedSearchTerm,
          category: filters.category,
          skills: filters.skills,
          priceRange: filters.priceRange,
        },
      });
      setTasks(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      setError("Failed to load Tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortOption, currentPage, debouncedSearchTerm, filters]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [debouncedSearchTerm]);

  const handleBookmark = async (itemId: string) => {
    const type = "task";
    if (bookmarks.some((bookmark) => bookmark.itemId === itemId)) {
      try {
        await axiosConfig.delete(`/users/bookmarks/${itemId}`, {
          data: { userId, type },
        });
        setBookmarks(
          bookmarks.filter((bookmark) => bookmark.itemId !== itemId)
        );
      } catch (err) {
        console.error("Error removing bookmark:", err);
      }
    } else {
      try {
        await axiosConfig.post("/users/bookmarks", { userId, itemId, type });
        setBookmarks([...bookmarks, { itemId, type }]);
      } catch (err) {
        console.error("Error adding bookmark:", err);
      }
    }
  };

  useEffect(() => {
    const getBookmark = async () => {
      const response = await axiosConfig.get(`/users/task-bookmarks`);

      if (response.data.bookmark) {
        setBookmarks(response.data.bookmark.items);
      }
    };
    getBookmark();
  }, []);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredTasks = tasks.filter((task) => {
    return task.projectName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <Loader visible={loading} />;
  if (error) return <div>{error}</div>;

  return (
    <div className="hero section pt-14 px-4 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        <FilterSidebar onFilterChange={handleFilterChange} />
      

      {/* Main Content */}
      <div className="flex-grow pt-14 p-4">
        <h2 className="pb-5 text-2xl font-semibold select-none">Tasks</h2>
        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 select-none gap-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 bg-white rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center w-full sm:w-auto">
            <span className="mr-2 text-gray-600">Sort By:</span>
            <select
              className="p-2 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTasks.map((task, index) => (
            <div
              key={index}
              className="border border-gray-300 p-5 rounded-lg shadow-md bg-white"
            >
              {/* Task details */}      
              <div className="flex">
       
      {/* Top Section: Project Name */}
      <h3 className="text-lg font-semibold mb-2 select-auto">{task.projectName}</h3>
       {/* Bookmark Button */}
       <button
    onClick={() => handleBookmark(task._id)}
    className="flex items-center ml-auto gap-2 text-blue-600 hover:text-blue-700"
>
    {bookmarks.some((bookmark) => bookmark.itemId === task._id) ? (
        <FaBookmark className="text-lg" />
    ) : (
        <FaRegBookmark className="text-lg" />
    )}
</button>

    
</div>
      {/* Location and Time */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="flex items-center mr-4">
         
          {task.category}
        </span>
      </div>

      {/* Pricing and Type */}
      <div className="flex w-full items-center justify-between  border-t pt-3">
        <div>
          <p className="font-semibold text-gray-800">
            ${task.minRate} - ${task.maxRate}
          </p>
          <p className="text-sm text-gray-500">{task.rateType}</p>
        </div>
        <Link to={`/freelancer/task-detail/${task._id}`}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition select-none">
            Bid Now
          </button>
        </Link>
      </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
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

export default TaskList;
