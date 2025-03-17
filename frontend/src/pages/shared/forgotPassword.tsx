import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosConfig from "../../service/axios";
import toast from "react-hot-toast";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosConfig.post("/users/forgot-password", { email });
      toast("If this email is registered, a password reset link has been sent.", {
        style: {
          background: '#2196F3',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-cover bg-gradient-to-r from-blue-100 to-white bg-center min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col max-w-xl w-full bg-white rounded-lg shadow-lg">
        {/* Form Div */}
        <div className="w-full p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Password Reset</h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Provide the email address associated with your account and we'll send you password reset instructions.
          </p>
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-blue-800 text-sm font-semibold mb-2">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Reset Password
            </button>
            <Link to={'/login'} className="block text-start text-blue-700 mt-4">
              Return to Sign In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
