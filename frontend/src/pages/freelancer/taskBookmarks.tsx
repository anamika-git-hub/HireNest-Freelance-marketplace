import React ,{useState,useEffect}from "react";
import axiosConfig from "../../service/axios";
import { FaUsers, FaTrash } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";

interface Task {
    _id: string;
    projectName: string;
    category: string;
    timeline: string;
    timeLeft?: string;
}

const TaskBookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBookmarksAndTasks = async () => {
      try {
        const bookmarkResponse = await axiosConfig.get("/users/bookmarks");
        const bookmarksData = bookmarkResponse.data.bookmark.items;
  
        const taskBookmarks = bookmarksData.filter((bookmark:{type:string}) => bookmark.type === "task");
  
        const taskResponse = await axiosConfig.get("/freelancers/tasks-list");
        const tasks = taskResponse.data.data; 
        if(taskResponse){
          const matchedTasks = tasks.filter((task:Task) =>
            taskBookmarks.some((bookmark:{itemId:string}) => bookmark.itemId === task._id)
          ) .map((task: Task) => ({
            ...task,
            timeLeft: calculateTimeLeft(task.timeline),
          }));
    
          setBookmarks(matchedTasks);
          setLoading(false);
        }
        
      } catch (err) {
        console.error("Error fetching bookmarks or tasks", err);
        setError("Failed to fetch bookmarks or tasks");
        setLoading(false);
      }
    };
  
    getBookmarksAndTasks();
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setBookmarks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          timeLeft: calculateTimeLeft(task.timeline),
        }))
      );
    }, 60000); 

    return () => clearInterval(timer); 
  }, [bookmarks]);


  const handleRemove = async (id: string) => {
    const userId = localStorage.getItem('userId')
    
    const confirmed = window.confirm("Are you sure you want to remove this bookmark?");
    if(confirmed){
      try {
        await axiosConfig.delete(`/users/bookmarks/${id}`, {
          data: {userId, type: "task" }, 
        });
    
        setBookmarks((prevBookmarks) => prevBookmarks.filter((bookmark) => bookmark._id !== id));
    
      } catch (err) {
        console.error("Error removing bookmark:", err);
      }
    }
  };

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

  if (loading) {
    return <Loader visible={loading} />;
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
          {bookmarks.map((task, index) => (
                <Link to={`/freelancer/task-detail/${task._id}`}>
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
            </Link>

          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskBookmarks;
