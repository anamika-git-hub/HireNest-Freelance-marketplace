import React,{useState,useEffect} from "react";
import { FaUser,FaTrash ,FaTimes} from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";
import ConfirmMessage from "../../components/shared/ConfirmMessage";
import { Formik,Form,Field, ErrorMessage } from "formik";
import { RequestSchema } from "../../components/Schemas/requestSchema";

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

const MyRequestList: React.FC = () => {
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
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const response = await axiosConfig.get(`/client/client-request`);
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

    const handleDeleteRequest = (id:string) => {
      setConfirmDelete(id);
    }

    const confirmDeleteRequest = async () => {
      if (confirmDelete) {
        try {
          const response = await axiosConfig.delete(`/client/delete-request/${confirmDelete}`);
            if (response.status === 200) {
              window.location.reload();
            }
        } catch (error) {
          toast.error('Failed to delete request')
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

    const handleSubmit = async (values: typeof formData, { setSubmitting, resetForm }: any) => {
      if (selectedRequest) {
        try {
          const response = await axiosConfig.put(
            `/client/update-request/${selectedRequest._id}`,
            values
          );
          if (response.status === 200) {
            toast.success("Request updated successfully!");
      
                setRequest((prevRequests) =>
                  prevRequests.map((request) =>
                    request._id === selectedRequest._id ? { ...request, ...values} : request
                  )
                );
                setShowModal(false);
                resetForm();
              }
            } catch {
              toast.error("Failed to update bid. Please try again.");
            } finally {
              setSubmitting(false);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-blue-50 p-5 text-center border-b border-gray-100 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">Update Request</h2>
              <p className="text-xs text-gray-500 mt-1">Modify your existing request details</p>
            </div>

            {/* Formik Form */}
            <Formik
              initialValues={{
                fullName: selectedRequest?.fullName || '',
                email: selectedRequest?.email || '',
                description: selectedRequest?.description || ''
              }}
              validationSchema={RequestSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="p-6 space-y-4">
                  {/* Full Name Field */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="fullName"
                      id="fullName"
                      className={`w-full px-3 py-2 border ${
                        touched.fullName && errors.fullName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg focus:ring-1 focus:border-transparent text-sm`}
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage 
                      name="fullName" 
                      component="div" 
                      className="text-red-500 text-xs mt-1" 
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`w-full px-3 py-2 border ${
                        touched.email && errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg focus:ring-1 focus:border-transparent text-sm`}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage 
                      name="email" 
                      component="div" 
                      className="text-red-500 text-xs mt-1" 
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className={`w-full px-3 py-2 border ${
                        touched.description && errors.description 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-lg focus:ring-1 focus:border-transparent text-sm resize-none`}
                      placeholder="Describe your project..."
                    />
                    <ErrorMessage 
                      name="description" 
                      component="div" 
                      className="text-red-500 text-xs mt-1" 
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "Update Request"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      
      {
        confirmDelete && 
        <ConfirmMessage
          message="Are you sure you want to delete this request"
          onConfirm={confirmDeleteRequest}
          onCancel={() => setConfirmDelete(null)}
        />
      }
    </div>
  );
};

export default MyRequestList;
