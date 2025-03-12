import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/userSlice";
import axios from "axios";
import { signupValidationSchema } from "../../components/Schemas/signUpValidationSchema"; 
import { Formik, Field, Form, ErrorMessage } from "formik";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../store/userSlice";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const handlePasswordVisibilityToggle = (field: "password" | "confirmPassword") => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer", 
  };
 const googleSubmit  = async(googleData:any)=>{
  const decodeResponse:any= jwtDecode(googleData.credential)
   const {email} = decodeResponse
   const user = {email}
   try {
    const response = await axios.post(
      "http://localhost:5001/api/users/google-signup",
      user
    );

    if(response.data.token){
      const user = response.data.user;

      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("refreshToken",response.data.refreshToken);
      localStorage.setItem("userId",response.data.user._id)
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("email", response.data.user.email);

      dispatch(loginUser(user));
      toast.success("User logged in successfully");
      navigate("/");
    }
   } catch (error) {
    toast.error('There was an error during signUp')
   }
 }
  const handleSubmit = async (values: any) => {
    const { email, password, role } = values;

    const newUser = { email, password, role };
   

    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/signup",
        newUser
      );

      if (response.status === 201) {
        dispatch(registerUser({...response.data.user, id: response.data.user._id,role:response.data.user.role}));
        toast.success("User registered successfully. Redirecting to OTP page...");
        navigate("/otp", { state: { email ,role} });
        localStorage.setItem("email", email);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("There was an error during signup.");
    }
  };
  return (
    <div className="bg-cover bg-gradient-to-r from-blue-100 to-white bg-center min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-stretch max-w-4xl w-full bg-white rounded-lg shadow-lg mt-28 mb-4">
        {/* Form Div */}
        <div className="w-full md:w-1/2 p-8 flex flex-col" style={{ flexGrow: 1 }}>
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Signup</h2>
          <p className="text-sm text-blue-600 text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
  
          <Formik
            initialValues={initialValues}
            validationSchema={signupValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form className="space-y-5">
                <div className="mt-6">
                  <div className="flex gap-x-4">
                    <label
                      className={`flex-1 py-2 text-center rounded-lg font-semibold cursor-pointer ${
                        values.role === "freelancer"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Field
                        type="radio"
                        name="role"
                        value="freelancer"
                        className="hidden"
                      />
                      Freelancer
                    </label>
                    <label
                      className={`flex-1 py-2 text-center rounded-lg font-semibold cursor-pointer ${
                        values.role === "client"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Field
                        type="radio"
                        name="role"
                        value="client"
                        className="hidden"
                      />
                      Client
                    </label>
                  </div>
                </div>
  
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-900 text-xs mt-1"
                  />
                </div>
  
                <div className="relative">
                  <Field
                    type={passwordVisible.password ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                   <div
                    className="absolute right-3 top-4 cursor-pointer"
                    onClick={() => handlePasswordVisibilityToggle("password")}
                  >
                    {passwordVisible.password ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-900 text-xs mt-1"
                  />
                </div>
  
                <div className="relative">
                  <Field
                    type={passwordVisible.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Repeat Password"
                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    className="absolute right-3 top-4 cursor-pointer"
                    onClick={() => handlePasswordVisibilityToggle("confirmPassword")}
                  >
                    {passwordVisible.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-800 text-xs mt-1"
                  />
                </div>
  
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Register
                </button>
                <div className="text-center my-4 text-blue-600">or</div>
  
                {/* Google Login Button */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={googleSubmit}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
  
        {/* Image Div */}
        <div className="w-full md:w-1/2 flex items-center justify-center" style={{ flexGrow: 1 }}>
          <img
            src="/assets/login.png" 
            alt="Your Image"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
