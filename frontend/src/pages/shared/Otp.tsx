import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(Array(6).fill("")); 
  const [timer, setTimer] = useState(60); 
  const [isExpired, setIsExpired] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { email, role } = location.state || {}; 

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
      const response = await axios.post("http://localhost:5001/api/users/resend-otp",{
        email:localStorage.getItem('email'),
      });
      if (response.status === 200) {
        setTimer(60); 
        setIsExpired(false);
        setOtp(Array(6).fill(""));
        toast.success("OTP has been resent successfully.");
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error("There was an error sending the OTP.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/users/verify-otp", {
        otp: enteredOtp,
        email:localStorage.getItem('email')
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully.");
        dispatch({ type: "VERIFY_OTP", payload: response.data });
        navigate("/account-setup",{state:{role}}); 
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="bg-cover bg-gradient-to-r from-blue-100 to-white bg-center h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-stretch max-w-4xl w-full bg-white rounded-lg shadow-lg">
        {/* Form Div */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">OTP Verification</h2>
          <p className="text-sm text-blue-600 text-center mb-6">
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
                  className="w-10 h-10 md:w-12 md:h-12 text-center text-lg border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>

            {/* Resend Code and Timer */}
            <div className="flex justify-between items-center text-blue-600 mt-6">
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
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
            >
              Verify & Proceed
            </button>
          </form>
        </div>

        {/* Image Div */}
        <div className="hidden md:flex w-full md:w-1/3 lg:w-1/2 items-center justify-center">
          <img
            src="/assets/otp.avif"
            alt="OTP Image"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
