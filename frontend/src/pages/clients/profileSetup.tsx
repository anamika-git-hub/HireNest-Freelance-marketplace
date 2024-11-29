import React from "react";

const ClientProfileSetup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-8">
        {/* Title */}
        <h1 className="text-center text-2xl font-semibold text-gray-700 mb-8">
          Complete your Profile
        </h1>

        {/* Form */}
        <form>
          <h2 className="text-lg font-medium text-gray-700 mb-6">
            1. Personal Information
          </h2>

          {/* Profile Picture and Form Section */}
          <div className="flex items-start space-x-8">
            {/* Profile Image */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 border-2 border-gray-300">
              <span>Photo</span>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ex. (123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="tom@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none"
            >
              Set Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientProfileSetup;
