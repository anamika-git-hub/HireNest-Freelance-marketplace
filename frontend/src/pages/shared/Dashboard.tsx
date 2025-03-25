import React, { useState, useEffect } from 'react';
import {FaUsers, FaUserCircle, FaEdit, FaTrash } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Link,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../components/shared/Loader';
import axiosConfig from "../../service/axios";
import DashboardChart from '../../components/shared/dashboardChart';

interface Notification {
  _id: string;
  text: string;
  createdAt: Date;
  read: boolean;
}

interface Bid {
  _id: string;
  rate: number;
  deliveryTime: number;
  taskId: { _id: string, projectName: string, rateType: string, category: string };
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
  status?: "active" | "ongoing" | "completed" | "pending";
  description?: string;
}

interface RawContract {
  _id: string;
  taskId: string;
  title: string;
  freelancerId: string;
  budget: string;
  status: 'ongoing' | 'completed' | 'accepted';
  milestones: Array<{
    title: string;
    cost: string;
    status: 'unpaid' | 'active' | 'completed';
    dueDate: string;
    _id: string;
  }>;
  startDate: string;
}

interface Milestone {
  id: string;
  title: string;
  status: 'unpaid' | 'active' | 'completed';
  cost: string;
  dueDate: string;
}

interface ProcessedContract {
  _id: string;
  taskId: string;
  title: string;
  freelancerId: string;
  budget: string;
  status: 'ongoing' | 'completed';
  nextMilestone?: Milestone;
  completedMilestones: number;
  totalMilestones: number;
  startDate: string;
}



const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [latestBids, setLatestBids] = useState<Bid[]>([]);
  const [bidsWon, setBidsWon] = useState<number>(0);
  const [completedProjects, setCompletedProjects] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [requests,setRequests] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<ProcessedContract[]>([]);
  const [taskBidCounts, setTaskBidCounts] = useState<{[key: string]: number}>({});
  const [totalBidsReceived, setTotalBidsReceived] = useState<number>(0);

  const navigate = useNavigate()
  
  const userId = localStorage.getItem('userId');
  const role = localStorage.getItem('role') || 'freelancer'; 
  
  const processContract = (contract: RawContract): ProcessedContract => {
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter(
      m => m.status === 'completed'
    ).length;

    const nextMilestone = contract.milestones.find(
      m => m.status !== 'completed'
    );

    return {
      _id: contract._id,
      taskId: contract.taskId,
      title: contract.title,
      freelancerId: contract.freelancerId,
      budget: contract.budget,
      status: contract.status === 'accepted' ? 'ongoing' : contract.status,
      nextMilestone: nextMilestone ? {
        id: nextMilestone._id,
        title: nextMilestone.title,
        status: nextMilestone.status,
        cost: nextMilestone.cost,
        dueDate: nextMilestone.dueDate,
      } : undefined,
      completedMilestones,
      totalMilestones,
      startDate: contract.startDate
    };
  };
  
  useEffect(() => {
    if (role === 'freelancer' && userId) {
      setLoading(true);
      axiosConfig
        .get(`/users/bid/${userId}`)
        .then((response) => {
          const allBids = response.data.bid;
          setBids(allBids);
          
          const acceptedBidsCount = allBids.filter(bid => bid.status === "accepted").length;
          setBidsWon(acceptedBidsCount);
          
          const latest = [...allBids]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          setLatestBids(latest);
          
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch bids");
          setLoading(false);
        });
    }
  }, [userId, role]);
  
  useEffect(() => {
    if (role === 'freelancer' && userId) {
      axiosConfig
        .get("/users/contracts", {
          params: {
            freelancerId: userId,
            status: 'completed'
          }
        })
        .then((response) => {
          setCompletedProjects(response.data.contracts.length);
        })
        .catch((err) => {
          console.error("Failed to fetch completed projects count", err);
          setCompletedProjects(0);
        });
    }
    
  }, [userId, role]);

  useEffect(() => {
    if (role === 'client' && userId) {
      axiosConfig
        .get("/users/contracts", {
          params: {
            clientId: userId,
            status: 'completed'
          }
        })
        .then((response) => {
          setCompletedProjects(response.data.contracts.length);
        })
        .catch((err) => {
          console.error("Failed to fetch completed projects count", err);
          setCompletedProjects(0);
        });
    }
  }, [userId, role]);

  useEffect(() => {
    if(role === 'freelancer' && userId){
    const getReviews = async () => {
        try {
            const response = await axiosConfig.get(`/freelancers/reviews/${userId}`)
            setReviews(response.data.reviews.length);
        } catch (error) {
            setError('Failed to load freelancer reviews')
        } finally {
            setLoading(false);
        }
    }
    getReviews()
  }
},[]);


useEffect(() => {
  if(role === 'freelancer' && userId){
  const fetchRequests = async () => {
         try {
             const response = await axiosConfig.get(`/freelancers/freelancer-request`);
             const fetchedRequests = response.data.requests;
             setRequests(fetchedRequests.length);
             setLoading(false);
         } catch (err) {
             setError("Failed to load requests. Please try again later.");
             setLoading(false);
         }
     };
     fetchRequests()
    }
},[])


  useEffect(() => {
    if (role === 'freelancer' && userId) {
      const fetchContractsData = async () => {
        try {
          const bidResponse = await axiosConfig.get(`/users/bid/${userId}`);
          const bidIds = bidResponse.data.bid.map((bid: Bid) => bid._id);
          
          const response = await axiosConfig.get("/users/contracts", {
            params: {
              bidIds: bidIds,
              status: 'ongoing'
            }
          });
          const processedContracts = response.data.contracts.map(processContract);

          setContracts(processedContracts);
        } catch (err) {
          console.error('Error fetching contracts:', err);
          setContracts([]);
        }
      };

      fetchContractsData();
    }
  }, [userId, role]);
  
  useEffect(() => {
    if(role === 'client' && userId){
    
    const fetchContractsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const tasksResponse = await axiosConfig.get("/client/my-tasks");
        const ongoingTasks = tasksResponse.data.task.filter((task: Task) => 
          task.status === 'ongoing'
        );
        
        if (ongoingTasks.length === 0) {
          setContracts([]);
          setLoading(false);
          return;
        }

        const taskIds = ongoingTasks.map((task: Task) => task._id);
        const contractsResponse = await axiosConfig.get("/users/contracts", {
          params: {
            taskIds: taskIds,
            status: 'ongoing'
          }
        });
        const processedContracts = contractsResponse.data.contracts.map(processContract);
        setContracts(processedContracts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch contracts. Please try again later.');
        setLoading(false);
        console.error('Error fetching contracts:', err);
      }
    };

    fetchContractsData();
      
  }
  }, [userId,role]);

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage < 33) return 'bg-blue-500';
    if (percentage < 66) return 'bg-blue-600';
    return 'bg-blue-700';
  };

  const handleContractClick = (contractId: string) => {
    navigate(`/client/client-contract/${contractId}`);
  };

  const stats = role === 'freelancer' 
    ? [
        { title: "Bids Won", value: bidsWon, color: "text-green-500" },
        { title: "Completed Projects", value: completedProjects, color: "text-pink-500" },
        { title: "Reviews", value: reviews, color: "text-yellow-500" },
        { title: "Requests Received", value: requests, color: "text-blue-500" }
      ]
    : [
        { title: "Active Tasks", value: tasks.filter(t => t.status === 'pending').length, color: "text-green-500" },
        { title: "Total Tasks", value: tasks.length, color: "text-pink-500" },
        { title: "Completed Projects", value: completedProjects, color: "text-yellow-500" },
        { title: "Bids Received", value: totalBidsReceived, color: "text-blue-500" }
      ];
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) {
          throw new Error('User not logged in');
        }

        const { data } = await axiosConfig.get('/users/notifications', {
          params: {
            page: 1,
            limit: 4,
            role: role
          }
        });
        
        setNotifications(data.result);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [userId, role]);

  useEffect(() => {
    if (role === 'client') {
      const fetchTasks = async () => {
        try {
          const response = await axiosConfig.get("/client/my-tasks");
          const fetchedTasks = response.data;
          
          const tasksWithTimeLeft = fetchedTasks.task.map((task: Task) => ({
            ...task,
            timeLeft: calculateTimeLeft(task.timeline),
          }));
          
          setTasks(tasksWithTimeLeft);
          
          tasksWithTimeLeft.forEach((task: Task) => {
            fetchBidCount(task._id);
          });
        } catch (err) {
          setError("Failed to load tasks");
          console.error("Failed to fetch tasks:", err);
        }
      };

      fetchTasks();
    }
  }, [role]);

  useEffect(() => {
    const fetchAllBidsCount = async () => {
      try {
        if (role === 'client' && tasks.length > 0) {
          const taskIds = tasks.map(task => task._id);
          const response = await axiosConfig.get("/client/all-task-bids", {
            params: { taskIds }
          });
          setTotalBidsReceived(response.data.bids.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch total bids count:", error);
        setTotalBidsReceived(0);
      }
    };
    
    if (role === 'client' && tasks.length > 0) {
      fetchAllBidsCount();
    }
  }, [tasks, role]);


  const fetchBidCount = async (taskId: string) => {
    try {
      if(role === 'client'){
        const response = await axiosConfig.get(`/client/task-bids/${taskId}`);
        setTaskBidCounts(prev => ({
          ...prev,
          [taskId]: response.data.length
        }));
      }
    } catch (err) {
      console.error("Failed to fetch bid count for task:", taskId, err);
    }
  };


  useEffect(() => {
    if (role === 'client' && tasks.length > 0) {
      const timer = setInterval(() => {
        setTasks(prevTasks =>
          prevTasks.map(task => ({
            ...task,
            timeLeft: calculateTimeLeft(task.timeline),
          }))
        );
      }, 60000);
      
      return () => clearInterval(timer);
    }
  }, [tasks, role]);

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

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const handleDeleteBid = (bidId: string) => {
    axiosConfig
      .delete(`/users/bid/${bidId}`)
      .then(() => {
        toast.success("Bid deleted successfully");
        setBids(bids.filter(bid => bid._id !== bidId));
        setLatestBids(latestBids.filter(bid => bid._id !== bidId));
      })
      .catch((err) => {
        toast.error("Failed to delete bid");
      });
  };

  const handleEditBid = (bidId: string) => {
    toast.success("Navigate to edit bid page");
  };

  if (loading) return <Loader visible={loading} />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  return (
    <section className="bg-gray-100 w-full min-h-screen">
      <div className="p-6 pt-24 lg:pt-24 space-y-6 max-w-7xl mx-auto h-screen overflow-y-auto">
        {/* Page title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {role === 'freelancer' ? 'Freelancer Dashboard' : 'Client Dashboard'}
          </h2>
          <div className="flex space-x-4">
            <Link to={role === 'freelancer' ? '/freelancer/task-list':'/client/freelancer-list'}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
                {role === 'freelancer' ? 'Find Tasks' : 'Find Freelancer'}
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-gray-500 text-sm">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Graph and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Section */}
          <div className="lg:col-span-2">
            <DashboardChart role={role} />
          </div>

          {/* Notifications Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">Notifications</h3>
              <Link to={`/notification`}>
              <button className="text-blue-600 text-sm font-medium">View All</button>
              </Link>
            </div>
            <ul className="space-y-4 max-h-60 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li 
                    key={index}
                    className={`flex items-start py-2 ${!notification.read ? 'bg-blue-50 -mx-2 px-2 rounded' : ''}`}
                  >
                    <div className={`flex-shrink-0 mt-1 ${!notification.read ? 'text-blue-500' : 'text-gray-300'}`}>
                      <FaUserCircle className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${!notification.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                        {notification.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center py-4 text-gray-500">
                  <p>No notifications yet</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Projects and Task/Bid Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-800 text-lg font-semibold">Ongoing Projects</h3>
              <Link to={`/${role}/${role}-contract-list`}>
              <button className="text-blue-600 text-sm font-medium">View All</button>
              </Link>
            </div>
            {contracts.length > 0 ? (
              <ul className="space-y-6">
                {contracts.map((contract, index) => (
                  <li key={index} 
                      className="border-b pb-4 last:border-0"
                      onClick={()=> handleContractClick(contract._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-bold text-gray-800">{contract.title}</h4>
                          {/* <p className="text-gray-500 text-sm">{contract.category}</p> */}
                          <div className="flex items-center mt-1">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={` h-2 rounded-full ${getProgressColor(contract.completedMilestones, contract.totalMilestones)}`}
                                style={{ width: `${Math.round((contract.completedMilestones / contract.totalMilestones) * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round((contract.completedMilestones / contract.totalMilestones) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800 font-semibold">${contract.budget.toLocaleString()}</p>
                        {/* <p className="text-gray-500 text-sm">Deadline: {new Date(contract.deadline).toLocaleDateString()}</p> */}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      {/* <p className="text-sm text-gray-500">
                        {role === 'freelancer' 
                          ? `Client: ${contract.clientName}` 
                          : `Freelancer: ${contract.freelancerName}`}
                      </p> */}
                      <button className="text-blue-600 text-sm font-medium">View Details</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No ongoing projects at the moment.</p>
                <button className="mt-2 text-blue-600 font-medium">
                  {role === 'freelancer' ? 'Find Projects' : 'Post a Project'}
                </button>
              </div>
            )}
          </div>

          {/* Role-specific section (My Bids for Freelancer / My Tasks for Client) */}
          <div className="bg-white shadow-md rounded-lg p-6">
            {role === 'freelancer' ? (
              // Freelancer - My Bids Section
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 text-lg font-semibold">My Recent Bids</h3>
                  <Link to="/freelancer/bids" className="text-blue-600 text-sm font-medium">
                    View All
                  </Link>
                </div>
                {latestBids.length > 0 ? (
                  <ul className="space-y-6">
                    {latestBids.map((bid, index) => (
                      <li key={index} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start">
                          <Link to={`/freelancer/task-detail/${bid.taskId._id}`}>
                            <p className="text-gray-800 font-semibold">{bid.taskId.projectName}</p>
                          </Link>
                          <span className={`text-xs px-2 py-1 rounded ${
                            bid.status === 'accepted' ? 'bg-green-100 text-green-700' :
                            bid.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{bid.taskId.category}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <p className="text-gray-600 text-sm flex items-center">
                              <IoMdTime className="mr-1" />
                              {bid.deliveryTime} {bid.timeUnit}
                            </p>
                            <p className="text-gray-600 text-sm">
                              ${bid.rate}{bid.taskId.rateType === 'hourly' ? '/hr' : ''}
                            </p>
                          </div>
                          {bid.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button 
                                className="flex items-center bg-gray-200 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-300"
                                onClick={() => handleEditBid(bid._id)}
                              >
                                <FaEdit className="text-xs" /> 
                              </button>
                              <button 
                                className="flex items-center bg-gray-200 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-300"
                                onClick={() => handleDeleteBid(bid._id)}
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't placed any bids yet.</p>
                    <Link to="/freelancer/find-tasks" className="mt-2 text-blue-600 font-medium block">
                      Browse Available Tasks
                    </Link>
                  </div>
                )}
              </>
            ) : (
              // Client - My Tasks Section
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-800 text-lg font-semibold">My Active Tasks</h3>
                  <Link to="/client/my-tasks" className="text-blue-600 text-sm font-medium">
                    View All
                  </Link>
                </div>
                {tasks.length > 0 ? (
                  (() => {
                    const pendingTasks = tasks.filter(task => task.status === 'pending');
                    
                    if (pendingTasks.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <p>You have no active tasks at the moment.</p>
                          <Link to="/client/post-task" className="mt-2 text-blue-600 font-medium block">
                            Post a New Task
                          </Link>
                        </div>
                      );
                    }
                    
                    return (
                      <ul className="space-y-6">
                        {pendingTasks
                          .slice(0, 3)
                          .map((task, index) => {
                            const isDeadlineReached = task.timeLeft === "Task deadline reached";
                            return (
                              <li key={index} className="border-b pb-4 last:border-0">
                                <div className="flex justify-between items-start">
                                  <Link to={`/client/my-task-detail/${task._id}`}>
                                    <p className="text-gray-800 font-semibold">{task.projectName}</p>
                                  </Link>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    isDeadlineReached ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {isDeadlineReached ? 'Expired' : 'Active'}
                                  </span>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">{task.category}</p>
                                <p className="text-gray-600 text-sm flex items-center mt-2">
                                  <IoMdTime className="mr-1" />
                                  {task.timeLeft}
                                </p>
                                <div className="mt-3">
                                  <Link to={`/client/bidders-list/${task._id}`}>
                                    <button
                                      disabled={isDeadlineReached}
                                      className={`flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 ${
                                        isDeadlineReached ? 'cursor-not-allowed opacity-50' : ''
                                      }`}
                                      onClick={() => isDeadlineReached && toast(
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <span role="img" aria-label="warning" style={{ marginRight: '10px' }}>
                                            ⚠️
                                          </span>
                                          Task deadline has passed
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
                                      <FaUsers className="mr-1" /> View Bids
                                      <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                                        {taskBidCounts[task._id] || 0}
                                      </span>
                                    </button>
                                  </Link>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't posted any tasks yet.</p>
                    <Link to="/client/post-task" className="mt-2 text-blue-600 font-medium block">
                      Post Your First Task
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;