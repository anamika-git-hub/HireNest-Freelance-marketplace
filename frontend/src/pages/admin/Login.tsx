import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
import axiosConfig from "../../service/axios";


const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {email, password}
    try {
      const response = await axiosConfig.post("admin/login",payload);
      if(response.status === 200){
        dispatch(loginUser(response.data));
        window.location.href = '/admin/dashboard'
        alert('Admin logged in successfully');
        localStorage.setItem(response.data.token,'accessToken');
        localStorage.setItem(response.data.user.role,'role');
        localStorage.setItem(response.data.user.email,'email');
        
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg flex flex-col md:flex-row w-full max-w-4xl">
        <div className="flex-1 bg-gray-800 text-white flex flex-col justify-center items-center p-6 rounded-l-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">HireNest</h1>
            <p className="text-lg">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex-1 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Welcome
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            Please login to admin dashboard.
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Forgot Password?{" "}
              <a href="#" className="text-gray-800 hover:underline">
                Reset here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
