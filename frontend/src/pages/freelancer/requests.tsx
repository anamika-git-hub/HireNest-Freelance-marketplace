import React,{useState,useEffect} from "react";
import { FaUser,FaTrash } from "react-icons/fa";
import { useParams,useNavigate } from "react-router-dom";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";

interface Request {
    _id:string;
    requesterId:string;
      fullName: string;
      email: string;
      description: string;
      createdAt: Date;
  }

const RequestList: React.FC = () => {

    const navigate = useNavigate();
    const [request, setRequest] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userId = localStorage.getItem('userId')
    const role = localStorage.getItem('role')

    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const response = await axiosConfig.get(`/freelancers/freelancer-request`);
            console.log('response',response)
            const fetchedRequests = response.data.requests; 
              setRequest(fetchedRequests);
            setLoading(false);
          } catch (err) {
            setError("Failed to load requests. Please try again later.");
            setLoading(false);
          } finally {
            setLoading(false)
          }
        };
          fetchRequests();
        
      }, []);



      const sendMessage = async(requesterId: string) => {
       await axiosConfig.post('/users/set-contacts',{senderId:userId,receiverId:requesterId,role})
      navigate(`/messages`);
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
            <FaUser className="mr-2"/>{request.length} Requests
      </div>

      <ul>
          {request.map((request, index) => {

            if (!request) return (
                <>
                <p>There is no requests yet</p>
                </>
            ); 

            return (
              <li
                key={index}
                className="flex items-center justify-between p-4 border-b last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="font-semibold text-lg flex items-center space-x-2">
                      <span>{request.fullName}</span>
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>{request.email}</span>
                    </p>
                    <div className="flex mt-3 space-x-2">
                      <button className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Accept Offer
                      </button>
                      <button
                       onClick={() => sendMessage(request.requesterId)} 
                       className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                        Send Message
                      </button>
                      <button className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
                        <FaTrash className="mr-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RequestList;
