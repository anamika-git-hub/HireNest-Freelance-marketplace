import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../store/userSlice";
import axios from "axios";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("freelancer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const newUser = { email, password, role };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        newUser
      );

      if (response.status === 201) {
        dispatch(registerUser(response.data));
        alert("User registered successfully. Redirecting to OTP page...");
        navigate("/otp", { state: { email } }); // Navigate to OTP page and pass email
        localStorage.setItem('email',email)
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("There was an error during signup.");
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector */}
          <div className="mt-6">
            <div className="flex gap-x-4">
              <label
                className={`flex-1 py-2 text-center rounded-lg font-semibold cursor-pointer ${
                  role === "freelancer"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  value="freelancer"
                  checked={role === "freelancer"}
                  onChange={() => setRole("freelancer")}
                  className="hidden"
                />
                Freelancer
              </label>
              <label
                className={`flex-1 py-2 text-center rounded-lg font-semibold cursor-pointer ${
                  role === "client"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  value="client"
                  checked={role === "client"}
                  onChange={() => setRole("client")}
                  className="hidden"
                />
                Client
              </label>
            </div>
          </div>

          {/* Other Fields */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Repeat Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
