import React ,{useState,useEffect}from "react";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";
import FilterSidebar from "../../components/shared/FilterSideBar";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axiosConfig
      .get("/freelancers/tasks-list") 
      .then((response) => {
        setTasks(response.data.data);
        console.log(response.data.data)
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load tasks.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div className="flex pt-20 pb-16 bg-gradient-to-r from-blue-100 to-white w-full overflow-hidden">
      {/* Sidebar */}
      <FilterSidebar/>

      {/* Main Content */}
      <div className="w-3/4 p-5 pt-16">
        {/* Search Alerts */}
        <div className="flex items-center justify-between mb-5 ">
          {/* Search bar on the left */}
          <input
            type="text"
            placeholder="Search"
            className="p-2 border border-gray-300 bg-gray-100 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sort By text and select dropdown on the right */}
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Sort By:</span>
            <select className="p-2  rounded">
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>


        {/* Job Listings */}
        <div className="grid grid-cols-2 gap-5">
  {tasks.map((task, index) => (
    <div
      key={index}
      className="border border-gray-300 p-5 rounded-lg shadow-md bg-white"
    >
      {/* Top Section: Project Name */}
      <h3 className="text-lg font-semibold mb-2">{task.projectName}</h3>

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Bid Now
          </button>
        </Link>
      </div>
    </div>
  ))}
</div>


    {/* Pagination  */}
    <div className="flex justify-center items-center mt-6 space-x-2">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  page === 1
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
  );
};

export default TaskList;
