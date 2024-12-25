import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FaEdit } from "react-icons/fa";

const MyProfile: React.FC = () => {
  const currentUserDetail = useSelector(
    (state: RootState) => state.user.currentUserDetail
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleEditClick = () => {
    fileInputRef.current?.click(); // Triggers the file input
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    profileImage: "",
  });

  useEffect(() => {
    if (currentUserDetail) {
      setFormData({
        firstName: currentUserDetail.firstname || "",
        lastName: currentUserDetail.lastname || "",
        phone: currentUserDetail.phone || "",
        dob: currentUserDetail.dateOfBirth || "",
        profileImage: currentUserDetail.profileImage || "", 
      });
    }
  }, [currentUserDetail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Update profile image and handle file upload logic
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file), // Set the preview image
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="flex justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">Freelancer Profile</h2>
        
        {/* Profile Image Section */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={'default-image.jpg'} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Edit</button>
        </div>
        
        <form>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          {/* Bio */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="bio">Bio</label>
            <textarea 
              id="bio" 
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          
          {/* Skills */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="skills">Skills</label>
            <div className="flex flex-wrap gap-2 mt-2">
              <input 
                type="text" 
                className="w-1/3 px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Add skill"
              />
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add Skill
              </button>
            </div>
          </div>
          
          {/* Attachments */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="attachments">Attachments</label>
            <div className="mt-2 flex flex-wrap gap-2">
              <input 
                type="file" 
                className="w-full px-4 py-2 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Upload Attachment
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="text-center mt-6">
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
