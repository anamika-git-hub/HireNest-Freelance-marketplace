import React, {useEffect, useState, ChangeEvent, FormEvent} from "react";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface FreelancerDetail {
  name: string; 
  location: string;
  tagline: string;
  experience: string;
  hourlyRate: number;
  skills: string[];
  description: string; 
  profileImage: string | null;
  attachments : string []
}

interface RequestFormData {
  fullName:string;
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
  

  const {id}  = useParams<{id: string}>();
  const userId = localStorage.getItem('userId')
  
 useEffect(() => {
  const getFreelancerDetail = async () => {
    try {
      const response = await axiosConfig.get(`client/freelancer/${id}`);
      
      setFreelancerDetail(response.data.freelancer);
    } catch (error) {
      setError("Failed to load freelancer details");
    }finally {
      setLoading(false);
    }
  };
  getFreelancerDetail();
 }, [id])


 const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement >
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    const response = await axiosConfig.post(`client/create-request`, {...formData,freelancerId:id,requesterId:userId});
    toast.success("Request placed successfully!");
    console.log(response.data);
  } catch (error) {
    console.error("Error placing request:", error);
    toast.error("Failed to place request. Please try again.");
  }
};

 if (loading) return <div> Loading...</div>;
 if(error ) return <div>{error}</div>

 if(!freelancerDetail) return <div>No Freelancer found</div>
  
 return (
  <div className="min-h-screen text-gray-800">
    <div 
      className="w-full pt-20 h-1/2 bg-cover bg-center" 
      style={{ backgroundImage: 'url(https://img.freepik.com/premium-photo/top-view-minimal-workspace-with-laptop-glasses-coffee-cup-notebook-gray-table-copy-space-advertising-text_35674-6783.jpg?w=360)' }}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between p-6 px-32 mb-8">
        <div className="flex items-start mb-6 md:mb-0 md:w-2/3">
          <img
            src={ freelancerDetail.profileImage|| "https://via.placeholder.com/100"}
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

    {/* Bottom Section */}
    <div className="w-full h-1/2 bg-white">
      <div className="w-full mx-auto px-4 py-8">
        {/* Work Description & Required Skills */}
        <div className="p-6 px-32 mb-8 flex flex-col md:flex-row gap-6">
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

            {/* Bid Card */}
            <div className="bg-white p-6 w-96   border border-gray-200">
      {/* Top Section */}
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

      {/* Button */}
      <button
      onClick={() => setShowModal(true)}
       className="bg-blue-600 text-white text-center w-full py-2 rounded-lg hover:bg-blue-700 transition duration-200">
        Make an Offer →
      </button>

       {/* Modal */}
       {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="relative top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Close"
      >
        ✖
      </button>

      <div className="text-center mb-6">
        <img
          src={freelancerDetail.profileImage || "https://via.placeholder.com/50"}
          alt="Profile"
          className="w-16 h-16 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-800">Connect with {freelancerDetail.name}</h2>
        <p className="text-sm text-gray-500 mt-2">Responds within a few days</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-center text-gray-600 mb-4">
          I am interested in working with {freelancerDetail.name}
        </p>

        {/* Full Name Field */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4"
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
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3 px-4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Send Message
        </button>
      </form>
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
