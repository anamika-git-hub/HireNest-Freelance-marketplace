import React ,{useState,useEffect}from "react";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";

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
      <div className="w-1/4 bg-gray-100 p-5 mt-14">
        <h2 className="text-xl font-semibold mb-5">Filters</h2>
        <div className="mb-5">
          <label className="block mb-2 font-medium">Location</label>
          <input
            type="text"
            placeholder="Location"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Category</label>
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>All Categories</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Keywords</label>
          <div className="flex">
            <input
              type="text"
              placeholder="e.g. task title"
              className="w-full p-2 border border-gray-300 rounded-l"
            />
            <button className="bg-blue-500 text-white px-4 rounded-r">+</button>
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Fixed Price</label>
          <input type="range" className="w-full" />
          <p className="text-gray-600">$50 - $2,500</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Hourly Rate</label>
          <input type="range" className="w-full" />
          <p className="text-gray-600">$10 - $150</p>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
              Front-end Dev
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
              React
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
              Design
            </span>
          </div>
          <input
            type="text"
            placeholder="Add more skills"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Search
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-5">
        {/* Search Alerts */}
        <div className="flex items-center justify-between mb-5">
         
          <select className=" border border-gray-300 rounded">
            <option>Relevance</option>
          </select>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-2 gap-5 ">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="border border-gray-300 p-5 rounded shadow-sm bg-gray-100"
            >
              <h3 className="text-lg font-semibold">{task.projectName}</h3>
              <p className="text-gray-600 text-sm">{task.category}</p>
              <p className="font-semibold mt-3">{task.minRate}$ - {task.maxRate}$</p>
              <span
                  className={`px-3 py-1 rounded-full text-sm mt-2 ${
                    task.type === "Fixed Price"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {task.rateType}
                </span>
                <Link to={`/freelancer/task-detail/${task._id}`}>
              <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">
                Bid Now
              </button>
              </Link>
            </div>
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
  );
};

export default TaskList;
