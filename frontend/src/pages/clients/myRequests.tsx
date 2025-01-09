import React,{useState,useEffect} from "react";
import { FaUser,FaTrash } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";

interface FreelancerProfile {
    _id:string;
    name: string;
    profileImage: string | null;
    tagline:string;
}
interface Request {
  _id:string;
  freelancerId:string;
    fullName: string;
    email: string;
    description: string;
    createdAt: Date;
}

const RequestList: React.FC = () => {
    const [request, setRequest] = useState<Request[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [freelancerProfiles, setFreelancerProfiles] = useState<FreelancerProfile[]>([]);
    const [formData, setFormData] = useState({
      fullName:'',
      email:'',
      description:''
    })

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

      const handleDeleteRequest = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this request');
        if (confirmed) {
          try {
            const response = await axiosConfig.delete(`/client/delete-request/${id}`);
            if (response.status === 200) {
              window.location.reload();
            }
          } catch (error) {
            console.log('Error deleting request', error);
          }
        }
      };

      const handleEdit = async (request:Request) => {
        setSelectedRequest(request);
        setFormData({
          fullName: request.fullName,
          email: request.email,
          description: request.description
        });
        setShowModal(true)
      }
       const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormData((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
      
          if (selectedRequest) {
            try {
              const updatedRequest = {
                fullName: formData.fullName,
                email: formData.email,
                description: formData.description,
              };
      
              const response = await axiosConfig.put(
                `/client/update-request/${selectedRequest._id}`,
                updatedRequest
              );
      
              if (response.status === 200) {
                alert("Request updated successfully!");
      
                setRequest((prevRequests) =>
                  prevRequests.map((request) =>
                    request._id === selectedRequest._id ? { ...request, ...updatedRequest } : request
                  )
                );
                setShowModal(false);
              }
            } catch {
              alert("Failed to update bid. Please try again.");
            }
          }
        };
    
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
            if (!freelancerProfile) return null; 

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
                  <Link to={`/client/freelancer-detail/${freelancerProfile._id}`}>
                    <h2 className="font-semibold text-lg flex items-center space-x-2">
                      <span>{freelancerProfile.name}</span>
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                      <span>{freelancerProfile.tagline}</span>
                    </p>
                    </Link>
                    <div className="flex mt-3 space-x-2">
                      <button 
                      onClick={()=> handleEdit(request)}
                      className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Edit Request
                      </button>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                        Send Message
                      </button>
                      <button
                      onClick={()=>handleDeleteRequest(request._id)}
                       className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <button
        onClick={() => setShowModal(false)}
        className=" top-3 right-3 text-gray-900 hover:text-gray-600 focus:outline-none"
        aria-label="Close"
      >
        ✖
      </button>
          
            <form
              onSubmit={handleSubmit}
             className="space-y-4">
             
              <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="Description"
                  name="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RequestList;
