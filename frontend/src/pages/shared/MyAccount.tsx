import React, { useState, useEffect, useRef } from "react";
import axiosConfig from "../../service/axios";
import { FaEdit, FaEye, FaEyeSlash} from "react-icons/fa";
import Loader from "../../components/shared/Loader";
import toast from "react-hot-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    profileImage: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword:"",
    newPassword:"", 
    confirmPassword:""
  });
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'client');
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });


  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordVisibilityToggle = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  
  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId"); 
        if (userId) {
          const response = await axiosConfig.get(`/users/account-detail`);
          setUserDetail(response.data.userDetails);
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
        dob: userDetail.dateOfBirth ? userDetail.dateOfBirth.toString().split("T")[0] : "", 
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
        profileImage: URL.createObjectURL(file), 
      }));
    }
  };

  const validateCurrentPassword = async () => {
    const userId = localStorage.getItem("userId");
    const response = await axiosConfig.post(`/users/validate-password/${userId}`, {
      currentPassword: passwordData.currentPassword
    });
   
    if (response.status === 200) {
      return true; 
    } else {
      toast.error("Incorrect current password.");
      return false;
    }
  };
  

// Function to update account type in the backend
const updateAccountType = async (newRole: string) => {
  const userId = localStorage.getItem('userId')
  
  try {
    const response = await axiosConfig.post('/users/update-role', { role: newRole,userId:userId });
    if (response.status === 200) {
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem('role', newRole);
      setUserRole(newRole)
      console.log('Account type updated successfully');
      window.location.reload();

    } else {
      console.error('Failed to update account type');
    }
  } catch (error) {
    console.error('Error updating account type:', error);
  } finally {
    setIsLoading(false);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPasswordValid = await validateCurrentPassword();
    if (!isPasswordValid) {
      toast.error("Incorrect current password.");
      return;
    }
  
    const updatedData = new FormData();

    updatedData.append("firstname", formData.firstName);
    updatedData.append("lastname", formData.lastName);
    updatedData.append("phone", formData.phone);
    updatedData.append("dob", formData.dob);
    
   if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
    updatedData.append("profileImage", fileInputRef.current.files[0]);
}
   if(passwordData.newPassword) {
    updatedData.append("newPassword", passwordData.newPassword);
    
   }
    try {
        const response = await axiosConfig.put(`/users/update-account`, updatedData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("User details updated:", response.data);
        if(response.status === 200){
          toast.success("user details updated")
        }
        
      
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };
  
  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-10 sm:pt-20 bg-white rounded-lg shadow-lg select-none"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6 ">My Account</h3>
          <div className="flex flex-col md:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                        await updateAccountType(newRole);
                      }}
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${
                        role === "freelancer"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
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
                        await updateAccountType(newRole);
                      }}
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${
                        role === "client"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={passwordVisible.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current Password"
                />
                <div
                  className="absolute right-3 top-5 cursor-pointer"
                  onClick={() => handlePasswordVisibilityToggle("currentPassword")}
                >
                  {passwordVisible.currentPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
  
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={passwordVisible.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
                <div
                  className="absolute right-3 top-5 cursor-pointer"
                  onClick={() => handlePasswordVisibilityToggle("newPassword")}
                >
                  {passwordVisible.newPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
  
            {/* Repeat New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Repeat New Password</label>
              <div className="relative">
                <input
                  type={passwordVisible.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
                <div
                  className="absolute right-3 top-5 cursor-pointer"
                  onClick={() => handlePasswordVisibilityToggle("confirmPassword")}
                >
                  {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
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
