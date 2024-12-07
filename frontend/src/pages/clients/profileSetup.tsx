import React, { useState } from "react";

const ClientProfileSetup: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [selectedID, setSelectedID] = useState<string>("debit_card");

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
    }
  };

  // Handle ID type change
  const handleIDChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedID(e.target.value);
  };

  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-center text-2xl font-semibold text-gray-700 mb-8">Complete your Profile</h1>

        {/* Personal Information Section */}
        <form>
          <h2 className="text-lg font-medium text-gray-700 mb-6">1. Personal Information</h2>
          <div className="flex items-start space-x-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 border-2 border-gray-300">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>Photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ex. (123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ID Verification Section */}
          <h2 className="text-lg font-medium text-gray-700 mt-8 mb-6">2. ID Verification</h2>
          <div className=" space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700">Select ID Type</label>
              <div className="flex items-center space-x-2">
                <select
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onChange={handleIDChange}
                  value={selectedID}
                >
                  <option value="debit_card">
                  💳 Debit/Credit Card
                </option>
                <option value="passport">
                  🌍 Passport
                </option>
                <option value="driver_license">
                  🚗 Driver's License
                </option>
                <option value="national_id">
                  🆔 National ID
                </option>
                </select>
              </div>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <input
                type="text"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your ID number"
              />
            </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload ID Front</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload ID Back</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-8 py-2 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientProfileSetup;
