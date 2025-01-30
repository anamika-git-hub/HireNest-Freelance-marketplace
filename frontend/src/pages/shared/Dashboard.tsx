import React,{useState,useEffect} from 'react';
import { FaBell, FaEllipsisH, FaUsers, FaUserCircle,  FaEdit, FaTrash  } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import {IoMdTime } from "react-icons/io";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../components/shared/Loader';

interface Notification {
  text: string
}

interface Bid {
  _id: string;
  rate: number;
  deliveryTime: number;
  taskId: { _id: string, projectName: string, rateType: string };
  timeUnit: string;
  createdAt: Date;
  status: "pending" | "accepted" | "rejected";
}

interface Task {
  _id: string;
  projectName: string;
  category: string;
  timeline: string;
  skills: string[];
  rateType: "hourly" | "fixed";
  minRate: number | string;
  maxRate: number | string;
  timeLeft?: string;
  bids?: number;
}

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [bids, setBids] = useState<Bid[]>([]);
    const [notifications,setNotifications] = useState<Notification[]>([])
     const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    let type = ''
    if(role === 'client'){
        type = 'bid'
    }else {
        type = 'request'
    }
    const fetchNotifications = async() => {
        if(userId){
            const response = await axiosConfig.get(`/users/notifications`)
           
            setNotifications(response.data);
            setLoading(false)
        }else{
          setError('User not logged in');
          setLoading(false);
        }
    }
    useEffect(()=> {
        fetchNotifications()
    },[])

    useEffect(() => {
      const userId = localStorage.getItem("userId");
  
      if (userId) {
        axiosConfig
          .get(`/users/bid/${userId}`)
          .then((response) => {
            setBids(response.data.bid);
            setLoading(false);
          })
          .catch((err) => {
            setError("Failed to fetch bids");
            setLoading(false);
          });
      } else {
        setError("User not logged in");
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axiosConfig.get("/client/my-tasks");
          const fetchedTasks = response.data;
  
          const tasksWithTimeLeft = fetchedTasks.map((task: Task) => ({
            ...task,
            timeLeft: calculateTimeLeft(task.timeline),
          }));
          setTasks(tasksWithTimeLeft);
          setLoading(false);
          tasksWithTimeLeft.forEach((task: Task) => {
            fetchBidCount(task._id);
          });
        } catch (err) {
          setError("Failed to load tasks. Please try again later.");
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, []);

    const fetchBidCount = async (taskId: string) => {
      try {
        const response = await axiosConfig.get(`/client/task-bids/${taskId}`);
        const bidCount = response.data.bids.length;
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, bids: bidCount } : task
          )
        );
      } catch (err) {
        console.error(`Failed to fetch bids for task ${taskId}:`, err);
      }
    };
  
    const calculateTimeLeft = (timeline: string): string => {
      const deadline = new Date(timeline);
      const now = new Date();
      const timeDiff = deadline.getTime() - now.getTime();
  
      if (timeDiff <= 0) {
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

      if (loading)  return <Loader visible={loading} />;
  if (error) return <div>{error}</div>;

    const getTasks = () => {
      if(role === 'freelancer'){
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">My Bids</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <FaEllipsisH className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-6">
             {bids.slice(0,2).map((bid, index) => (
              <li 
              key={index}
              className="border-b pb-4">
                <div className="flex justify-between items-center">
                  
                  <Link to={`/freelancer/task-detail/${bid.taskId._id}`}>
                  <p className="text-gray-800 font-semibold">{bid.taskId.projectName}</p>
                  </Link>
                  {/* <span className="text-yellow-600 bg-yellow-100 text-xs px-2 py-1 rounded">Expiring</span> */}
                </div>
                
                <div className="mt-3 flex items-center">
                <p className="text-gray-500 text-sm flex items-center mt-2 me-2">
                  <IoMdTime className="mr-1" />
                  {bid.deliveryTime} {bid.timeUnit}
                </p>
                    <button className="flex items-center bg-gray-200 text-gray-600 px-3 mx-2 py-1 rounded-md hover:bg-gray-300">
                        <FaEdit className="mr-1" /> 
                    </button>
                    <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                        <FaTrash className="mr-1" /> 
                    </button>
                </div>
              </li>
               ))}
            </ul>
          </>
        )
      }else if (role === 'client'){
        return (
          <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 text-lg font-semibold">My Tasks</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <FaEllipsisH className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-6">
            
          {tasks.map((task, index) => {
          const isDeadlineReached = task.timeLeft === "Task deadline reached";
          return (
            <li
              key={index}
            className="border-b pb-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-800 font-semibold">{task.projectName}</p>
                {/* <span className="text-yellow-600 bg-yellow-100 text-xs px-2 py-1 rounded">Expiring</span> */}
              </div>
              <p className="text-gray-500 text-sm flex items-center mt-2">
                <IoMdTime className="mr-1" />
                {task.timeLeft}
              </p>
              <div className="mt-3 flex items-center">
                 <Link to={`/client/bidders-list/${task._id}`}>
                  <button
                    disabled={isDeadlineReached}
                    className={`flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 ${isDeadlineReached ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => isDeadlineReached && toast(
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span role="img" aria-label="warning" style={{ marginRight: '10px' }}>
                          ⚠️
                        </span>
                        You can't access it because the deadline of your task is reached
                      </div>,
                      {
                        style: {
                          background: '#FFEB3B', 
                          color: '#000',
                          display: 'flex', 
                          alignItems: 'center', 
                        },
                      }
                    )}
                  >
                  <FaUsers className="mr-1" /> Manage Bidders
                    <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                      {task.bids || 0}
                    </span>
                  </button>
                </Link>
              </div>
            </li>
            );
            })}
          </ul>
          </>
        )
      }
    }

  return (
    <section className="bg-gray-100 w-full">
      <div className="p-6 pt-36 space-y-6 mx-">
        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">Task Bids Won</h3>
            <p className="text-2xl font-bold">22</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">Tasks Done</h3>
            <p className="text-2xl font-bold text-pink-500">28</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">Reviews</h3>
            <p className="text-2xl font-bold text-yellow-500">28</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-gray-500 text-sm">This Month Views</h3>
            <p className="text-2xl font-bold text-blue-500">987</p>
          </div>
        </div>

        {/* Graph and Notifications */}
        <div className="grid grid-cols-3 gap-6">
          {/* Graph Section */}
          <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-gray-600 text-sm font-semibold">Your Profile Views</h3>
            <p className="text-gray-400 text-xs">Last 6 Months</p>
            <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Graph Placeholder</p>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-800 text-lg font-bold">Notifications</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <FaBell className="w-5 h-5" />
              </button>
            </div>
             <ul className="mt-4 divide-y divide-gray-200">
                      {notifications.slice(0,4).map((notification,index)=>(
                        <li
                                key={index}
                                 className="flex items-start py-2">
                                <FaUserCircle className="w-6 h-6 text-gray-300" />
                                
                                <p className="ml-3 text-sm text-gray-700">
                                  {notification.text}
                                </p>
                                </li>
                              ))}
                            </ul>
          </div>
        </div>

        {/* Bidders and My Tasks */}
        <div className="grid grid-cols-3 gap-6">
          {/* Bidders Section */}
          <div className="col-span-2 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-gray-600 text-sm font-semibold">Ongoing Projects</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img className="w-12 h-12 rounded-full" src="https://via.placeholder.com/150" alt="Profile" />
                  <div>
                    <h4 className="font-bold">E-commerce Web Application</h4>
                    <p className="text-gray-400 text-sm">Web development</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">$3,200</p>
              </li>
            </ul>
          </div>

          {/* My Tasks Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
          {getTasks()}
            </div>
          
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
