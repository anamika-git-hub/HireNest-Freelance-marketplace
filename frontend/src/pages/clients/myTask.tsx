import React ,{useState,useEffect}from "react";
import axiosConfig from "../../service/axios";
import { FaUsers, FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";

interface Task {
  projectName: string;
    category: string;
    timeline: string;
    skills: string[];
    rateType: "hourly" | "fixed";
    minRate: number | string;
    maxRate: number | string;
    timeLeft?: string;
}

const MyTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosConfig.get("/client/my-tasks");
        const fetchedTasks = response.data;

        // Calculate time left for each task
        const tasksWithTimeLeft = fetchedTasks.map((task: Task) => ({
          ...task,
          timeLeft: calculateTimeLeft(task.timeline),
        }));
        setTasks(tasksWithTimeLeft); 
        setLoading(false);
      } catch (err) {
        setError("Failed to load tasks. Please try again later.");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const calculateTimeLeft = (timeline: string): string => {
    const deadline = new Date(timeline);
    const now  = new Date();
    const timeDiff = deadline.getTime() - now.getTime();

    if(timeDiff<=0) {
      return "Task deadline reached";
    }
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    return `${days} days, ${hours} hours left`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          timeLeft: calculateTimeLeft(task.timeline),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup on unmount
  }, [tasks]);


  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center text-blue-600 font-semibold mb-4">
          <FaUsers className="mr-2" /> My Tasks
        </div>
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 py-4"
            >
              <div className="w-3/4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-medium">{task.projectName}</h2>
                  {/* {task.isExpiring && (
                    <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded">
                      Expiring
                    </span>
                  )} */}
                </div>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <AiOutlineClockCircle className="mr-2" />
                  {task.timeLeft}
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                    <FaUsers className="mr-1" /> Manage Bidders
                    <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                      {}
                    </span>
                  </button>
                  <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-md flex justify-between w-1/4">
                {/* Bids */}
                <div className="text-center">
                  <p className="text-lg font-medium">{}</p>
                  <p className="text-sm text-gray-500">Bids</p>
                </div>
                
                {/*Avg. Bid */}
                <div className="text-center">
                  <p className="text-lg font-medium">{}</p>
                  <p className="text-sm text-gray-500">Avg. Bid</p>
                </div>
                
                {/* Price Range */}
                <div className="text-center">
                  <p className="text-lg font-medium">${task.minRate} - ${task.maxRate}</p>
                  <p className="text-sm text-gray-500">{task.rateType}</p>
                </div>
              </div>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyTaskList;
