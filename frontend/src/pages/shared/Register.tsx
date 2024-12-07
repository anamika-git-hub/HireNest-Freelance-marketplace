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
import { loginUser } from "../../store/userSlice";

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
   console.log('nnnnnnnn', user)
   try {
    const response = await axios.post(
      "http://localhost:5000/api/users/google-signup",
      user
    );

    if(response.data.token){
      const user = response.data.user;

      localStorage.setItem("accessToken", response.data.token);
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
        "http://localhost:5000/api/users/signup",
        newUser
      );

      if (response.status === 201) {
        dispatch(registerUser(response.data));
        toast.success("User registered successfully. Redirecting to OTP page...");
        navigate("/otp", { state: { email } });
        localStorage.setItem("email", email);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("There was an error during signup.");
    }
  };



  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/team-coworkers-comparing-source-codes-running-laptop-screen-computer-monitor-it-development-office-software-developers-collaborating-data-coding-group-project-while-sitting-desk_482257-41846.jpg?t=st=1732350387~exp=1732353987~hmac=010e9fb6cd61dded2e322b967e756c848e0e6655f446d7b02c6be14fa9f36790&w=1060')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Signup
        </h2>
        <p className="text-sm text-white text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
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

              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-900 text-xs mt-1"
                />
              </div>

              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat Password"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              <GoogleLogin
                  onSuccess={googleSubmit}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />;
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
