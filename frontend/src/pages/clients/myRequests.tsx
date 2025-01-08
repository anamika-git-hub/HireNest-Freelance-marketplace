import React,{useState,useEffect} from "react";
import { FaUser,FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axiosConfig from "../../service/axios";

interface FreelancerProfile {
    name: string;
    profileImage: string | null;
    tagline:string;
}
interface Request {
  freelancerId:string;
    fullName: string;
    email: string;
    description: string;
    createdAt: Date;
}

const RequestList: React.FC = () => {
    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [freelancerProfiles, setFreelancerProfiles] = useState<FreelancerProfile[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const response = await axiosConfig.get(`/client/client-request`);
            console.log('response',response.data.requests)
            const fetchedFreelancers = response.data.requests; 
            const fetchedProfiles = await Promise.all(
              fetchedFreelancers.map(async (request:Request) => {
                   return request.freelancerId
                })
              );
      
             
              setFreelancerProfiles(fetchedProfiles);
              setRequest(fetchedFreelancers);
            setLoading(false);
          } catch (err) {
            setError("Failed to load bidders. Please try again later.");
            setLoading(false);
          }
        };
          fetchRequests();
        
      }, []);
    
      if (loading) {
        return <div>Loading bidders...</div>;
      }
    
      if (error) {
        return <div className="text-red-500">{error}</div>;
      }

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center text-blue-600 font-semibold mb-4">
            <FaUser className="mr-2"/>{freelancerProfiles.length} Requests
      </div>

      <ul>
          {request.map((request, index) => {
            const freelancerProfile = freelancerProfiles[index];
            if (!freelancerProfile) return null; // Skip if no profile is available for this bid

            return (
              <li
                key={index}
                className="flex items-center justify-between p-4 border-b last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={freelancerProfile.profileImage || "/default-avatar.jpg"}
                    alt={freelancerProfile.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div>
                    <h2 className="font-semibold text-lg flex items-center space-x-2">
                      <span>{freelancerProfile.name}</span>
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>{freelancerProfile.tagline}</span>
                    </p>
                    <div className="flex mt-3 space-x-2">
                      <button className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Edit Request
                      </button>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
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
