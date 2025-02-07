import React,{useState,useEffect} from "react";
import { FaUser,FaTrash } from "react-icons/fa";
import { useParams,useNavigate } from "react-router-dom";
import axiosConfig from "../../service/axios";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";

interface Request {
    _id:string;
    requesterId:string;
      fullName: string;
      email: string;
      description: string;
      createdAt: Date;
      status: 'pending' | 'accepted' | 'rejected'; 
  }

const RequestList: React.FC = () => {

    const navigate = useNavigate();
    const [request, setRequest] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const userId = localStorage.getItem('userId')
    const role = localStorage.getItem('role')

    const fetchRequests = async () => {
      try {
        const response = await axiosConfig.get(`/freelancers/freelancer-request`);
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

    useEffect(()=>{
      fetchRequests();
    },[]);
    
    const handleRequestStatusUpdate = async (requestId:string, status: 'accepted' | 'rejected' ) => {
      try {
        setLoading(true);
        const response = await axiosConfig.patch(`/freelancers/request-status/${requestId}`,{
          status
        });
        if(response.status === 200){
          toast.success(`Request ${status} successfully`);
          await  fetchRequests();
        }
      } catch (error:any) {
        toast.error(error.response?.data?.message || `Failed to ${status} request`);
      } finally {
        setLoading(false);
      }
    };


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

                    {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleRequestStatusUpdate(request._id, 'accepted')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestStatusUpdate(request._id, 'rejected')}
                            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status !== 'pending' && (
                        <span className={`px-4 py-2 rounded-md ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      )}

                      <button
                       onClick={() => sendMessage(request.requesterId)} 
                       className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                        Send Message
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
