import React, { useState } from "react";

const MyAccount: React.FC = () => {
  const [accountType, setAccountType] = useState<string>("Freelancer");
  
  return (
    <section className="p-10 pt-20 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* My Account Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">My Account</h3>
          <div className="flex items-start  space-x-6 ">
            {/* Profile Picture */}
            <div className="w-32 h-32 mt-16 bg-gray-200 rounded-md flex justify-center items-center text-gray-500">
              <span>Photo</span>
            </div>

            {/* Form Section */}
            <div className="flex-1">
              {/* First Name, Last Name, Phone, and DOB */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tom"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>

              {/* Phone and DOB */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123-456-7890"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Account Type */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <div className="mt-2 flex items-center gap-4">
                    <button
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${accountType === "Freelancer" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                      onClick={() => setAccountType("Freelancer")}
                    >
                      Freelancer
                    </button>
                    <button
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${accountType === "Employer" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                      onClick={() => setAccountType("Employer")}
                    >
                      Employer
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="tom@example.com"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password & Security Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Password & Security</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {/* Repeat New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Repeat New Password</label>
              <input
                type="password"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mt-6">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg focus:outline-none">
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
