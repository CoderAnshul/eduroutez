import React, { useState } from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP & New Password
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !phone) {
      toast.error("Please enter both email and phone number");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { 
        email: email, 
        contact_number: phone, 
        type: "forgot-password" 
      };

      const response = await axios.post(`${baseURL}/send-otp`, payload);
      
      if (response.data.success) {
        toast.success("OTP sent to your phone number!");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Invalid email or phone number.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: email,
        phone: phone,
        otp: otp,
        password: newPassword
      };

      const response = await axios.post(`${baseURL}/reset-password-otp`, payload);

      if (response.data.status === "success") {
        toast.success("Password reset successfully! Please login.");
        // Redirect to home and open login popup
        navigate("/login", { 
          state: { backgroundLocation: { pathname: "/" } },
          replace: true 
        });
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Invalid OTP or request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen universal-max-width">
      {/* Left Section */}
      <div className="w-1/2 bg-red-700 hidden text-white sm:flex flex-col justify-center items-center py-10 px-10">
        <h1 className="text-4xl lg:text-[45px] lg:font-semibold font-bold mb-4 w-11/12 text-start">Secure Your Account</h1>
        <p className="text-lg mb-6 w-11/12">
          Don't worry! It happens. Please enter your details to recover your account and get back to your journey.
        </p>
        <img
          src={loginandSignupbg}
          alt="Illustration"
          className="w-4/5 max-w-[350px]"
        />
      </div>

      {/* Right Section */}
      <div className='universal-container flex flex-col items-center justify-center'>
        <div className="w-full max-w-sm">
          <h1 className="text-[40px] font-bold text-start opacity-80 mb-2 leading-tight">Forgot password</h1>
          <p className="text-gray-500 mb-8">
            {step === 1 
              ? "Enter your registered email and phone number. We'll send an OTP to your phone." 
              : "Enter the 6-digit OTP sent to your phone and choose a new password."}
          </p>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400 transition-all shadow-md active:scale-[0.98] mt-4"
              >
                {isLoading ? "Sending..." : "Send OTP to Phone"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800 disabled:bg-gray-400 transition-all shadow-md mt-4"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full text-sm text-gray-500 hover:text-red-700 mt-2"
              >
                Back to edit details
              </button>
            </form>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <button onClick={() => navigate("/login")} className="text-red-700 font-bold hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Forgotpassword;
