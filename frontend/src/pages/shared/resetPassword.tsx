import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosConfig from "../../service/axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosConfig.post("/users/reset-password", { password, id });
      toast.success("Password has been reset successfully");
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-cover bg-gradient-to-r from-blue-100 to-white bg-center min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col max-w-xl w-full bg-white rounded-lg shadow-lg">
        {/* Form Div */}
        <div className="w-full p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Recover Password</h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Enter a new password below to change your password.
          </p>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-blue-800 text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <label className="block text-blue-800 text-sm font-semibold mb-2 mt-4">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                name="password"
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

export default ResetPassword;
