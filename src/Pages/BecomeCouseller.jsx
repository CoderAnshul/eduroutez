import React from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import { Link } from "react-router-dom";

const BecomeCouseller = () => {
  return (
    <div className="flex flex-col md:flex-row h-auto">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-red-700 text-white flex flex-col justify-center items-center px-10 py-8 md:py-0">
        <h1 className="text-4xl lg:text-[45px] font-semibold mb-4 w-11/12 text-center md:text-start">
          Become someone's guiding light
        </h1>
        <p className="text-lg mb-6 w-11/12 text-center md:text-start">
          Join us a create an positive imapact in someone's life.
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
        <form className="w-full max-w-md">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
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
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
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

export default BecomeCouseller;
