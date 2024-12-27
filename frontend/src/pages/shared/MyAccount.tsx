import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { FaEdit } from "react-icons/fa";

interface UserDetail {
  profileImage: string;
  firstname: string;
  lastname: string;
  phone: string;
  dateOfBirth: Date;
}

const MyAccount: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    profileImage: "",
  });
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'client');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId"); 
        if (userId) {
          const response = await axiosConfig.get(`/users/account-detail/${userId}`);
          setUserDetail(response.data.userDetails);

          console.log('User details response:', response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Update formData when userDetail changes
  useEffect(() => {
    if (userDetail) {
      setFormData({
        firstName: userDetail.firstname || "",
        lastName: userDetail.lastname || "",
        phone: userDetail.phone || "",
        dob: userDetail.dateOfBirth ? userDetail.dateOfBirth.toString().split("T")[0] : "", // Formatting date as YYYY-MM-DD
        profileImage: userDetail.profileImage || "",
      });
    }
  }, [userDetail]);

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
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file), // Set the preview image
      }));
    }
  };

  // useEffect(() => {
  //   const storedRole = localStorage.getItem('role');
  //   if (storedRole) {
  //     setUserRole(storedRole);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('role', userRole);
  // }, [role]);

// Function to update account type in the backend
const updateAccountType = async (newRole: string) => {
  const userId = localStorage.getItem('userId')
  try {
    const response = await axiosConfig.post('/users/update-role', { role: newRole,userId:userId });
    if (response.status === 200) {
      localStorage.setItem('role', newRole);
      setUserRole(newRole)
      console.log('Account type updated successfully');
    } else {
      console.error('Failed to update account type');
    }
  } catch (error) {
    console.error('Error updating account type:', error);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const updatedData = new FormData();

    updatedData.append("firstname", formData.firstName);
    updatedData.append("lastname", formData.lastName);
    updatedData.append("phone", formData.phone);
    updatedData.append("dob", formData.dob);
    
   if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
    updatedData.append("profileImage", fileInputRef.current.files[0]);
}
    try {
        const response = await axiosConfig.put(`/users/update-account`, updatedData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("User details updated:", response.data);
        if(response.status === 200){
          alert("user details updated")
        }
        
      
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="p-10 pt-20 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6">My Account</h3>
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="w-32 h-32 mt-16 bg-gray-200 rounded-md flex justify-center items-center text-gray-500 relative">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span>Photo</span>
              )}
              <div
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
                onClick={handleEditClick}
              >
                <FaEdit className="fas fa-edit" />
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            {/* Form Section */}
            <div className="flex-1">
              {/* First Name, Last Name, Phone, and DOB */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
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
                      type="button"
                      onClick={async () => {
                        const newRole = "freelancer";
                        setUserRole(newRole);
                        setFormData((prev) => ({
                          ...prev,
                          role: newRole,
                        }));
                        // Send a request to the backend to update the user's role
                        await updateAccountType(newRole);
                      }}
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${
                        role === "freelancer" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Freelancer
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const newRole = "client";
                        setUserRole(newRole);
                        setFormData((prev) => ({
                          ...prev,
                          role: newRole,
                        }));
                        // Send a request to the backend to update the user's role
                        await updateAccountType(newRole);
                      }}
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${
                        role === "client" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Client
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email || ""}
                    disabled
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                placeholder="Enter current Password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new Password"
              />
            </div>

            {/* Repeat New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Repeat New Password
              </label>
              <input
                type="password"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm the password"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};

export default MyAccount;
