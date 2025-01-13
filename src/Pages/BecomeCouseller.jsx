import React, { useState } from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const BecomeCounselor = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    contactno: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Make POST request to /counselor API
      const response = await axios.post("http://localhost:4001/api/v1/counselor", formData);
      console.log("Response", response);

        toast.success("Your application has been submitted successfully!");
        setSuccess("Your application has been submitted successfully!");
        setError("");
      
    } catch (err) {
      setError("There was an error with your submission. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto">
      <ToastContainer />
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
              Full Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Email */}
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

          {/* Phone */}
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

          {/* Password */}
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
          >
            Submit Application
          </button>
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
