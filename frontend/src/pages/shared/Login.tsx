import React, { useState } from 'react';
import axiosConfig from '../../service/axios';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/userSlice';

const Login: React.FC = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const dispatch = useDispatch();

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {email, password}
    try {
      const response = await axiosConfig.post('users/login', payload)
      if(response.status === 200) {
        const user = response.data.user;

        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('email', response.data.user.email);

        dispatch(loginUser(user));
        alert("User logged in successfully");
        window.location.href = "/";
      }else{
        console.log(response)
      }
    } catch (error) {
      console.log('Login failed:',error);
      
    }
   };
  return (
    <>
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/team-coworkers-comparing-source-codes-running-laptop-screen-computer-monitor-it-development-office-software-developers-collaborating-data-coding-group-project-while-sitting-desk_482257-41846.jpg?t=st=1732350387~exp=1732353987~hmac=010e9fb6cd61dded2e322b967e756c848e0e6655f446d7b02c6be14fa9f36790&w=1060')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Login</h2>
        <p className="text-sm text-white text-center mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
                Register
            </a>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <div className="text-center my-4 text-white">or</div>
        <div className="flex justify-between">
          <button className="w-1/2 bg-blue-50 text-blue-700 border border-blue-500 py-2 rounded-md mr-2">
            <i className="fab fa-facebook"></i> Log In via Facebook
          </button>
          <button className="w-1/2 bg-red-50 text-red-700 border border-red-500 py-2 rounded-md ml-2">
            <i className="fab fa-google"></i> Log In via Google
          </button>
        </div>
       
      </div>
    </div>
    </>
  );
};

export default Login;
