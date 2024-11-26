import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/userSlice';
import axios from 'axios';

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const newUser = { email, password, role: "client" };

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', newUser);

      if (response.status === 200) {
        dispatch(registerUser(response.data));
        alert("User registered successfully");
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('There was an error during signup.');
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
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Signup</h2>
        <p className="text-sm text-white text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Bind the email state to input field
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Bind the password state to input field
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-white text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}  // Bind the confirmPassword state to input field
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>
        <div className="text-center my-4 text-white">or</div>
        <div className="flex justify-between">
          <button className="w-1/2 bg-blue-50 text-blue-700 border border-blue-500 py-2 rounded-md mr-2">
            <i className="fab fa-facebook"></i> Register via Facebook
          </button>
          <button className="w-1/2 bg-red-50 text-red-700 border border-red-500 py-2 rounded-md ml-2">
            <i className="fab fa-google"></i> Register via Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
