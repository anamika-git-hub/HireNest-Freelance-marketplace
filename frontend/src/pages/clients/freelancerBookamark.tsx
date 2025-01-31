import React ,{useState,useEffect}from "react";
import axiosConfig from "../../service/axios";
import { FaUsers, FaTrash } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import ConfirmMessage from "../../components/shared/ConfirmMessage";

interface Task {
    _id: string;
    name: string;
    tagline: string;
    profileImage: string;
}

interface Freelancer {
  _id:string;
  profileImage: string;
  name: string;
  tagline:string;
}

const FreelancerBookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null> (null);

  useEffect(() => {
    const getBookmarksAndFreelancers = async () => {
      try {
        const bookmarkResponse = await axiosConfig.get("/users/bookmarks");
        const bookmarksData = bookmarkResponse.data.bookmark.items;
  
        const freelancerBookmarks = bookmarksData.filter((bookmark:{type:string}) => bookmark.type === "freelancer");
  
        const freelancerResponse = await axiosConfig.get("/client/freelancer-list");
        const freelancers = freelancerResponse.data.data; 
        
        const matchedFreelancers = freelancers.filter((freelancer:Freelancer) =>
          freelancerBookmarks.some((bookmark:{itemId:string}) => bookmark.itemId === freelancer._id)
        );
  
        setBookmarks(matchedFreelancers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookmarks or tasks", err);
        setError("Failed to fetch bookmarks or tasks");
        setLoading(false);
      }
    };
  
    getBookmarksAndFreelancers();
  }, []);

  const handleRemove = (id:string)=> {
    setConfirmRemove(id);
  }

  const confirmRemoveBookMark = async () => {
    const userId = localStorage.getItem('userId')

    if(confirmRemove){
      try {
        await axiosConfig.delete(`/users/bookmarks/${confirmRemove}`, {
          data: {userId, type: "freelancer" }, 
        });
    
        setBookmarks((prevBookmarks) => prevBookmarks.filter((bookmark) => bookmark._id !== confirmRemove));
    
      } catch (err) {
        console.error("Error removing bookmark:", err);
      }
    }
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
          <FaUsers className="mr-2" /> Bookmarked Freelancers
        </div>
        <ul>
          {bookmarks.map((freelancer, index) => (
                    
            <li
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 py-4"
            >
              
              <div className="w-3/4">
              <Link to={`/client/freelancer-detail/${freelancer._id}`}>
                <div className="flex items-center space-x-2">
                <img
                    src={freelancer.profileImage || "/default-avatar.jpg"}
                    alt={freelancer.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div>
                  <h2 className="text-lg font-medium">{freelancer.name}</h2>
                  <div className="flex items-center text-gray-500 text-sm ">
                  {freelancer.tagline}
                </div>
                </div>
                  {/* {task.isExpiring && (
                    <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded">
                      Expiring
                    </span>
                  )} */}
                </div>
              
                </Link>
               
              </div>
              <div className="flex items-center space-x-2 mt-4">
                  <button
                  onClick={() => handleRemove(freelancer._id)}
                   className="flex items-center bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
                    
                    <FaTrash className="mr-1" /> Remove
                  </button>
                </div>
            </li>
           
          ))}
        </ul>
      </div>
      {confirmRemove && (
        <ConfirmMessage
          message="Are you sure you want to remove this bookmark?"
          onConfirm={confirmRemoveBookMark}
          onCancel={()=> setConfirmRemove(null)}
          />
      )}
    </div>
  );
};

export default FreelancerBookmarks;
