import React, { useState, useEffect, useRef } from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PasswordStrength from "../Components/PasswordStrength";

const BecomeCounselor = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    contactno: "",
    password: "",
    category: "",
    otp: ""
  });

  const [streams, setStreams] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef(new Array(6).fill(null));

  const navigate = useNavigate();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get(`${VITE_BASE_URL}/streams?page=0&sort={"createdAt":"asc"}`);
        setStreams(response.data?.data?.result);
      } catch (err) {
        console.error("Error fetching streams", err);
      }
    };

    fetchStreams();
  }, [VITE_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.email || !formData.contactno) {
      toast.error("Please enter both email and phone number");
      return;
    }

    try {
      const response = await axios.post(`${VITE_BASE_URL}/send-otp`, {
        email: formData.email,
        contact_number: formData.contactno
      });

      if (response.data) {
        setIsOtpSent(true);
        setShowOtpModal(true);
        toast.success("OTP sent successfully!");
        // Focus first OTP input
        setTimeout(() => {
          otpInputs.current[0]?.focus();
        }, 100);
      }
    } catch (err) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Set combined OTP in form data
    setFormData(prev => ({
      ...prev,
      otp: newOtpValues.join('')
    }));

    // Move to next input if typing a number - use requestAnimationFrame for better focus
    if (value && index < 5) {
      requestAnimationFrame(() => {
        const nextInput = otpInputs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      });
    }
  };

  const handleKeyDown = (index, event) => {
    // Handle backspace - move to previous input if current is empty
    if (event.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        event.preventDefault();
        const prevInput = otpInputs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      } else if (otpValues[index]) {
        // Clear current input on backspace
        const newOtpValues = [...otpValues];
        newOtpValues[index] = '';
        setOtpValues(newOtpValues);
        setFormData(prev => ({
          ...prev,
          otp: newOtpValues.join('')
        }));
      }
    }

    // Handle arrow keys
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      const prevInput = otpInputs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      const nextInput = otpInputs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.match(/\d/g);

    if (pastedNumbers) {
      const newOtpValues = [...otpValues];
      pastedNumbers.slice(0, 6).forEach((num, index) => {
        newOtpValues[index] = num;
      });
      setOtpValues(newOtpValues);
      setFormData(prev => ({
        ...prev,
        otp: newOtpValues.join('')
      }));
    }
  };

  const handleVerifyOTP = async () => {
    const combinedOtp = otpValues.join('');
    if (combinedOtp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const response = await axios.post(`${VITE_BASE_URL}/verify-otp`, {
        email: formData.email,
        contact_number: formData.contactno,
        otp: combinedOtp
      });

      if (response.data) {
        setIsOtpVerified(true);
        setShowOtpModal(false);
        toast.success("OTP verified successfully!");
      }
    } catch (err) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      toast.error("Please verify your email/phone first");
      return;
    }

    try {
      const response = await axios.post(`${VITE_BASE_URL}/counselor`, formData);
      toast.success("Your application has been submitted successfully!");
      setSuccess("Your application has been submitted successfully!");
      setError("");
      window.location.href = "https://admin.eduroutez.com/";
    } catch (err) {
      setError("There was an error with your submission. Please try again.");
      setSuccess("");
    }
  };

  // OTP Modal Component
  const OtpModal = () => {
    if (!showOtpModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
          {/* Close button */}
          <button
            onClick={() => setShowOtpModal(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h2>
            <p className="text-gray-600">
              We have sent OTP to {formData.email}
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-6">
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={el => otpInputs.current[index] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-red-500 focus:outline-none"
                autoComplete="off"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleSendOTP}
              className="text-red-600 font-semibold hover:text-red-800"
            >
              Resend OTP
            </button>
          </div>

          <button
            onClick={handleVerifyOTP}
            className="w-full bg-red-700 text-white py-3 rounded-lg font-semibold hover:bg-red-800"
          >
            Verify OTP
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-auto">
      <ToastContainer />
      <OtpModal />

      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-red-700 text-white flex flex-col justify-center items-center px-10 py-8 md:py-0">
        <h1 className="text-4xl lg:text-[45px] font-semibold mb-4 w-11/12 text-center md:text-start">
          Become someone's guiding light
        </h1>
        <p className="text-lg mb-6 w-11/12 text-center md:text-start">
          Join us and create a positive impact in someone's life.
        </p>
        <img
          src={loginandSignupbg}
          alt="Counseling Illustration"
          className="w-4/5 max-w-[350px]"
        />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex py-10 flex-col justify-center items-center px-10">
        <h1 className="text-[40px] font-bold text-start opacity-80 mb-2">
          Onboard as a Counselor
        </h1>
        <p className="text-gray-500 mb-8 text-center">
          Fill in your details to start helping others with their career planning.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="firstname">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="lastname">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="contactno">
              Phone Number
            </label>
            <input
              type="text"
              id="contactno"
              name="contactno"
              value={formData.contactno}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <PasswordStrength password={formData.password} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a category</option>
              {streams.map((stream) => (
                <option key={stream.id} value={stream.name}>
                  {stream.name}
                </option>
              ))}
            </select>
          </div>

          {!isOtpVerified && (
            <div className="mb-4">
              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800 mb-4"
              >
                Send OTP
              </button>
            </div>
          )}

          {isOtpVerified && (
            <button
              type="submit"
              className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
            >
              Submit Application
            </button>
          )}
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}

        <p className="text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BecomeCounselor;