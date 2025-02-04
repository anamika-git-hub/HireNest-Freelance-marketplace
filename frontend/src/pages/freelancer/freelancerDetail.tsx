import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { FaTimes } from "react-icons/fa";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik,Form,Field, ErrorMessage } from "formik";
import { RequestSchema } from "../../components/Schemas/requestSchema";

interface FreelancerDetail {
  name: string; 
  location: string;
  tagline: string;
  experience: string;
  hourlyRate: number;
  skills: string[];
  description: string; 
  profileImage: string | null;
  attachments : string [];
}

interface RequestFormData {
  fullName: string;
  email: string;
  description: string;
}

const FreelancerDetail: React.FC = () => {
  const [freelancerDetail, setFreelancerDetail] = useState<FreelancerDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<RequestFormData>({
    fullName: "",
    email: "",
    description: "",
  });

  const { id } = useParams<{ id: string }>();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const getFreelancerDetail = async () => {
      try {
        const response = await axiosConfig.get(`client/freelancer/${id}`);
        setFreelancerDetail(response.data.freelancer);
      } catch (error) {
        setError("Failed to load freelancer details");
      } finally {
        setLoading(false);
      }
    };
    getFreelancerDetail();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (values: RequestFormData, { setSubmitting, resetForm }: any) => {
    
    try {
      const response = await axiosConfig.post(`client/create-request`, { ...values, freelancerId: id, requesterId: userId });
      toast.success("Request placed successfully!");
      setShowModal(false)
      resetForm();
    } catch (error) {
      console.error("Error placing request:", error);
      toast.error("Failed to place request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div> Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!freelancerDetail) return <div>No Freelancer found</div>;

  return (
    <div className="min-h-screen text-gray-800">
      <div
        className="w-full pt-20 h-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://img.freepik.com/premium-photo/top-view-minimal-workspace-with-laptop-glasses-coffee-cup-notebook-gray-table-copy-space-advertising-text_35674-6783.jpg?w=360)' }}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between p-6 px-4 sm:px-8 lg:px-32 mb-8">
          <div className="flex items-start mb-6 md:mb-0 md:w-2/3">
            <img
              src={freelancerDetail.profileImage || "https://via.placeholder.com/100"}
              alt="Project"
              className="w-24 h-24 rounded-lg object-cover mr-4"
            />
            <div>
              <span className="text-blue-600 text-sm font-medium mb-1">
                {freelancerDetail.tagline}
              </span>
              <h1 className="text-2xl font-bold mb-2">{freelancerDetail.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-1/2 bg-white">
        <div className="w-full mx-auto px-4 py-8">
          <div className="p-6 px-4 sm:px-8 lg:px-32 mb-8 flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-blue-600 mr-2">ℹ️</span> About Me
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{freelancerDetail.description}</p>

              <div className="flex flex-wrap gap-4">
                <div className="space-4 ">
                  <div className="bg-gray-100 px-3 py-2 mb-4 rounded-md text-sm flex items-center">
                    ✉ info@lilywoods.com
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center">
                    💰 ${freelancerDetail.hourlyRate}/hr
                  </div>
                </div>
                <div className="space-4 ">
                  <div className="bg-gray-100 px-3 mb-4 py-2 rounded-md text-sm flex items-center">
                    🕒 {freelancerDetail.experience} of experience
                  </div>
                  <div className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center">
                    📍 {freelancerDetail.location}
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-4 flex items-center mt-6">
                <span className="mr-2">✅</span> Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {freelancerDetail.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 max-h-80 w-full sm:w-96 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xl font-semibold text-gray-900">$35</p>
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900">53</p>
                  <p className="text-sm text-gray-500">Jobs Done</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900">22</p>
                  <p className="text-sm text-gray-500">Rehired</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white text-center w-full py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Make an Offer →
              </button>

              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-6">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-blue-50 p-5 text-center border-b border-gray-100">
                      <div className="relative">
                       <button
                                     onClick={() => setShowModal(false)}
                                     className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                   >
                                     <FaTimes className="w-5 h-5" />
                                   </button>
                        <img
                          src={freelancerDetail.profileImage || "https://via.placeholder.com/100"}
                          alt="Profile"
                          className="w-16 h-16 rounded-full mx-auto mb-3 border-3 border-white shadow-md object-cover"
                        />
                        <h2 className="text-xl font-bold text-gray-800">Connect with {freelancerDetail.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">Typically responds within a few days</p>
                      </div>
                    </div>

                    {/* Form Section */}
                    <Formik 
                     initialValues={{
                      fullName:"",
                      email: "",
                      description: "",
                     }}
                     validationSchema={RequestSchema}
                     onSubmit={handleSubmit}
                     >
                     {({isSubmitting,errors,touched}) => (

                    <Form className="p-5 space-y-4">
                      <p className="text-center text-gray-600 text-sm">
                        I am interested in working with {freelancerDetail.name}
                      </p>

                      <div className="flex space-x-4">
                        <div className="w-1/2">
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
                            placeholder="Enter your name"
                          />
                          <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                          />
                        </div>
                        <div className="w-1/2">
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
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                          Tell us about the project
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          id="description"
                          rows={3}
                          className={`w-full px-3 py-2 border ${
                            touched.description && errors.description 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-blue-500'
                          } rounded-lg focus:ring-1 focus:border-transparent text-sm resize-none`}
                          placeholder="Provide project details"
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
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all shadow-md hover:shadow-lg"
                      >
                         {isSubmitting ? "Submitting..." : "Submit Offer"}
                      </button>
                    </Form>
                     )}
                     </Formik>
                  </div>
                </div>
              )}

              {/* Stats Section */}
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
          {/* Job Success */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Job Success</p>
              <p className="text-sm text-gray-600">88%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: "88%" }}></div>
            </div>
          </div>
        
          {/* Recommendation */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Recommendation</p>
              <p className="text-sm text-gray-600">100%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        
          {/* On Time */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">On Time</p>
              <p className="text-sm text-gray-600">90%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: "90%" }}></div>
            </div>
          </div>
        
          {/* On Budget */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">On Budget</p>
              <p className="text-sm text-gray-600">80%</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
        {/* Attachments Section */}
        <div className="p-6 px-32 mb-8">
          <h2 className="text-lg font-semibold mb-4">📎 Attachments</h2>
          <div className="flex gap-6 overflow-x-auto">
            {freelancerDetail.attachments.map((attachment, index) => (
              <div key={index} className="border rounded-lg shadow-sm overflow-hidden w-1/2 sm:w-1/3 md:w-1/4">
                <img
                  src={attachment}
                  alt="Attachment"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{attachment}</h3>
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    View more &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetail;
