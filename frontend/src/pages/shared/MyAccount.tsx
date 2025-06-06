import React, { useState, useEffect, useRef } from "react";
import axiosConfig, { setAuthTokens } from "../../service/axios";
import { FaEdit, FaEye, FaEyeSlash} from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { MyAccountValidationSchema } from "../../components/Schemas/myAccountValidation";
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

  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'client');
  const [passwordVisible, setPasswordVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const email = localStorage.getItem('email');

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasswordVisibilityToggle = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId"); 
        if (userId) {
          const response = await axiosConfig.get(`/users/account-detail`);
          setUserDetail(response.data.result.userDetails);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const validateCurrentPassword = async (currentPassword: string) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axiosConfig.post(`/users/validate-password/${userId}`, {
        currentPassword
      });
      return response.data;
    } catch (error) {
      return false;
    }
  };

const updateAccountType = async (newRole: string) => {
  const userId = localStorage.getItem('userId')
  
  try {
    const response = await axiosConfig.post('/users/update-role', { role: newRole,userId:userId });
    if (response.status === 200) {
      setAuthTokens(response.data.token, response.data.refreshToken);
       localStorage.setItem("role", newRole);
      setUserRole(newRole); 

  window.dispatchEvent(new Event("roleChange")); 

  toast.success(`Role changed to ${newRole}`);
      console.log('Account type updated successfully');

    } else {
      console.error('Failed to update account type');
    }
  } catch (error) {
    console.error('Error updating account type:', error);
  } finally {
    setIsLoading(false);
  }
};

const initialValues = {
  firstName: userDetail?.firstname || "",
  lastName: userDetail?.lastname || "",
  phone: userDetail?.phone || "",
  dob: userDetail?.dateOfBirth ? userDetail.dateOfBirth.toString().split("T")[0] : "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  profileImage: userDetail?.profileImage || "",
};

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, setFieldError, resetForm, setValues }: any) => {
    
    if (values.currentPassword || values.newPassword || values.confirmPassword) {
      const isPasswordValid = await validateCurrentPassword(values.currentPassword);
      
      if (isPasswordValid === false) {
        setFieldError('currentPassword', 'This is not the current password');
        toast.error("Incorrect current password.");
        setSubmitting(false);
        return;
      }
    }
    
    const updatedData = new FormData();

    updatedData.append("firstname", values.firstName);
    updatedData.append("lastname", values.lastName);
    updatedData.append("phone", values.phone);
    updatedData.append("dob", values.dob);
    
   if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
    updatedData.append("profileImage", fileInputRef.current.files[0]);
}
if (values.newPassword) {
  updatedData.append("newPassword", values.newPassword);
}
    try {
        const response = await axiosConfig.put(`/users/update-account`, updatedData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("User details updated:", response.data);
        if(response.status === 200){
          toast.success("User details updated");
          
          setValues({
            ...values,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
          
          fetchUserDetails();
        }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Error updating user details")
    } finally {
      setSubmitting(false)
    }
  };
  
  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId"); 
      if (userId) {
        const response = await axiosConfig.get(`/users/account-detail`);
        setUserDetail(response.data.result.userDetails);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  
  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={MyAccountValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values }) => (
    <Form
      className="p-6 sm:p-10 sm:pt-20 bg-white rounded-lg shadow-lg select-none"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6 ">My Account</h3>
          <div className="flex flex-col md:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Profile Picture */}
            <div className="w-32 h-32 mt-16 bg-gray-200 rounded-md flex justify-center items-center text-gray-500 relative">
              {values.profileImage ? (
                <img
                  src={values.profileImage}
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
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFieldValue('profileImage', URL.createObjectURL(file));
                }
              }}
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
                  <Field
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
  
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Field
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
  
              {/* Phone and DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <Field
                    type="text"
                    name="phone"
                    value={values.phone}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>
  
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <Field
                    type="date"
                    name="dob"
                    value={values.dob}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="dob" component="div" className="text-red-500 text-sm mt-1" />
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
                        await updateAccountType(newRole);
                      }}

                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${
                        userRole === "freelancer"
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
                        await updateAccountType(newRole);
                      }}
                      className={`px-4 py-2 text-sm rounded-md focus:outline-none ${
                        userRole === "client"
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
                <Field
                  type={passwordVisible.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  
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
              <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>
  
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <Field
                  type={passwordVisible.newPassword ? "text" : "password"}
                  name="newPassword"
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
              <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>
  
            {/* Repeat New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Repeat New Password</label>
              <div className="relative">
                <Field
                  type={passwordVisible.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
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
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>
        </div>
  
        {/* Save Changes Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-1/4 px-6 py-3 bg-blue-500 text-white rounded-lg focus:outline-none"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Form>
      )}
</Formik>
  );
  
};

export default MyAccount;