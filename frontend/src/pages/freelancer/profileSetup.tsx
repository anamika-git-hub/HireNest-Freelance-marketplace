import React, { useState } from "react";

const FreelancerProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    jobTitle: "",
    location: "",
    rate: "",
    experience: "",
    description: "",
    skills: "",
    portfolio: [
      { title: "", link: "", description: "" },
      { title: "", link: "", description: "" },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-xl p-8 relative">
       

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Complete Your Profile
        </h2>

        <form className="space-y-6">
        
          {/* Section 1: Personal Information */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            
            {/* Profile Image */}
            <div className=" flex justify-start items-start">
                <img
                src="https://via.placeholder.com/100"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
            </div>

            {/* Full Name */}
            <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
                </label>
                <input
                type="text"
                value={formData.name}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
                </label>
                <input
                type="text"
                value={formData.name}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            {/* Job Title */}
            <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Title
                </label>
                <input
                type="text"
                value={formData.jobTitle}
                placeholder="e.g., Web Developer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Phone Number */}
            <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
                </label>
                <input
                type="text"
                value={formData.phone}
                placeholder="Your Phone Number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Experience */}
            <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Experience
                </label>
                <input
                type="text"
                value={formData.experience}
                placeholder="e.g., 5 Years"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Hourly Rate */}
            <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                Hourly Rate
                </label>
                <input
                type="text"
                value={formData.rate}
                placeholder="e.g., $50/hr"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            </div>

          </div>

          {/* Section 2: Skills */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Skills</h3>
            <textarea
              value={formData.skills}
              placeholder="List your skills here..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              
            ></textarea>
          </div>

          {/* Section 3: Portfolio */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Portfolio</h3>
            {formData.portfolio.map((portfolioItem, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Portfolio #{index + 1}
                </h4>
                <input
                  type="text"
                  placeholder="Title"
                  value={portfolioItem.title}
                  className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="Link"
                  value={portfolioItem.link}
                  className="w-full mb-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={portfolioItem.description}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  
                ></textarea>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Set Up Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreelancerProfileSetup;
