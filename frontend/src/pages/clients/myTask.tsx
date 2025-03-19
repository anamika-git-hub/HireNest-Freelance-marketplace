import React, { useState, useEffect } from "react";
import axiosConfig from "../../service/axios";
import { FaUsers, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";

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
  status: "pending" | "onhold" | "ongoing" | "completed";
}

const MyTaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | Task['status']>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosConfig.get("/client/my-tasks");
        const fetchedTasks = response.data.task;

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

  const statusColorMap = {
    pending: "bg-yellow-100 text-yellow-700",
    onhold: "bg-gray-100 text-gray-700",
    ongoing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
  };

  useEffect(() => {
    let result = [...tasks];
    
    if (activeFilter !== "all") {
      result = result.filter(task => task.status === activeFilter);
    }
    
    if (searchTerm) {
      result = result.filter(task => 
        task.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTasks(result);
    setCurrentPage(1); 
  }, [searchTerm, activeFilter, tasks]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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

  const handleDelete = (taskId:string) => {
    setConfirmDelete(taskId);
  }

  const confirmDeleteTask = async () => {
    if (confirmDelete) {
      try {
        await axiosConfig.delete(`/client/delete-task/${confirmDelete}`);
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== confirmDelete));
        toast.success("Task deleted successfully.");
      } catch (err) {
        console.error("Error deleting task:", err);
        toast.error("Failed to delete task. Please try again.");
      }
    }
  };

  const FilterButton: React.FC<{
    filter: "all" | Task['status'];
    label: string;
  }> = ({ filter, label }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-md transition-colors ${
        activeFilter === filter
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

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
    return <Loader visible={loading} />;
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
        
        {/* Filter and Search Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <FilterButton filter="all" label="All Tasks" />
            <FilterButton filter="pending" label="Pending" />
            <FilterButton filter="onhold" label="On Hold" />
            <FilterButton filter="ongoing" label="Ongoing" />
            <FilterButton filter="completed" label="Completed" />
          </div>
          <div className="relative w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? "No tasks match your search" : "No tasks found"}
          </div>
        ) : (
          <ul>
            {currentTasks.map((task, index) => {
              const isDeadlineReached = task.timeLeft === "Task deadline reached";
              return (
                <li
                  key={index}
                  className="flex justify-between items-center border-b last:border-b-0 py-4"
                >
                  <div className="w-3/4">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-medium">{task.projectName}</h2>
                      <span 
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          statusColorMap[task.status]
                        }`}
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <AiOutlineClockCircle className="mr-2" />
                      {task.timeLeft}
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <Link to={`/client/bidders-list/${task._id}`}>
                        <button
                          disabled={isDeadlineReached}
                          className={`flex items-center bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 ${isDeadlineReached ? 'cursor-not-allowed opacity-50' : ''}`}
                          onClick={() => isDeadlineReached && toast.error("You can't access it because the deadline of your task is reached")}
                        >
                          <FaUsers className="mr-1" /> Manage Bidders
                          <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                            {task.bids || 0}
                          </span>
                        </button>
                      </Link>
                      <Link to={`/client/my-task-detail/${task._id}`}>
                        <button className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(task._id)} 
                        className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-100 py-4 rounded-md flex justify-evenly w-1/4">
                    <div className="text-center">
                      <p className="text-lg font-medium">{task.bids || 0}</p>
                      <p className="text-sm text-gray-500">Bids</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">${task.minRate} - ${task.maxRate}</p>
                      <p className="text-sm text-gray-500">{task.rateType}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Pagination Section */}
        {filteredTasks.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNumber => {
                if (pageNumber === 1 || pageNumber === totalPages) return true;
                if (Math.abs(pageNumber - currentPage) <= 2) return true;
                return false;
              })
              .map((page, index, array) => {
                if (index > 0 && array[index] - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <span className="w-8 h-8 flex items-center justify-center text-gray-700">
                        ...
                      </span>
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          page === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {confirmDelete && 
        <ConfirmMessage
          message="Are you sure you want to delete this task?"
          onConfirm={confirmDeleteTask}
          onCancel={() => setConfirmDelete(null)}
        />
      }
    </div>
  );
};

export default MyTaskList;