import React from "react";

const MyAccount: React.FC = () => {
  return (
    <section className="p-6 bg-white rounded-lg shadow-lg">
  <h3 className="text-lg font-semibold text-gray-800 mb-6">My Account</h3>

  <div className="flex items-start space-x-6">
    {/* Profile Picture */}
    <div className="w-24 h-24 bg-gray-200 rounded-md flex justify-center items-center text-gray-500">
      <span>Photo</span>
    </div>

    {/* Form Section */}
    <div className="flex-1">
      {/* First Name and Last Name */}
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

      {/* Account Type */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
        <label className="block text-sm font-medium text-gray-700">Account Type</label>
        <div className="mt-2 flex items-center gap-4">
          <button className="px-4 py-2 bg-green-500 text-white text-sm rounded-md focus:outline-none">
            Freelancer
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md focus:outline-none">
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
            />
      </div>

      </div>
     
    </div>
  </div>
</section>

  );
};

export default MyAccount;
