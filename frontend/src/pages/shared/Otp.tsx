import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(Array(6).fill("")); 
  const [timer, setTimer] = useState(60); 
  const [isExpired, setIsExpired] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId);
          setIsExpired(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId); 
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/resend-otp",{
        email:localStorage.getItem('email'),
      });
      if (response.status === 200) {
        setTimer(60); 
        setIsExpired(false);
        setOtp(Array(6).fill(""));
        alert("OTP has been resent successfully.");
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      alert("There was an error sending the OTP.");
    }
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter all 6 digits of the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/verify-otp", {
        otp: enteredOtp,
        email:localStorage.getItem('email')
      });
      if (response.status === 200) {
        alert("OTP verified successfully.");
        dispatch({ type: "VERIFY_OTP", payload: response.data });
        navigate("/login"); 
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("Invalid OTP. Please try again.");
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
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">OTP Verification</h2>
        <p className="text-sm text-white text-center">
          Enter OTP code sent to <span className="font-semibold">***@gmail.com</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          {/* Resend Code and Timer */}
          <div className="flex justify-between items-center text-white">
            <span>Time remaining: {timer}s</span>
            {isExpired ? (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:underline"
              >
                Resend Code
              </button>
            ) : null}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Verify & Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
