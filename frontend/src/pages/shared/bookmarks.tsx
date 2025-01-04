import React ,{useState,useEffect}from "react";
import { useSelector,useDispatch } from "react-redux";
import axiosConfig from "../../service/axios";
import { FaUsers, FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { RootState } from "../../store/store";
import { removeBookmark } from "../../store/bookmarkSlice";


interface Task {
    _id: string;
    projectName: string;
    category: string;
    timeline: string;
    timeLeft?: string;
    bids?: number;
}

const Bookmarks: React.FC = () => {
  const bookmarks = useSelector((state: RootState) => state.bookmarks.bookmarks);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all tasks
    axiosConfig.get("/freelancers/tasks-list").then((response) => {
      setTasks(response.data.data);
    });
  }, []);

  const handleRemove = (id: string) => {
    dispatch(removeBookmark(id));
  };


  const bookmarkedTasks = tasks.filter((task) => bookmarks.includes(task._id));

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
    }, 60000); 

    return () => clearInterval(timer); 
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
          <FaUsers className="mr-2" /> Bookmarked Tasks
        </div>
        <ul>
          {bookmarkedTasks.map((task, index) => (
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
               
              </div>
             
              <div className="flex items-center space-x-2 mt-4">
                  <button
                  onClick={() => handleRemove(task._id)}
                   className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                    
                    <FaTrash className="mr-1" /> Remove
                  </button>
                </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Bookmarks;
