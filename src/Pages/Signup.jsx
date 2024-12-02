import React from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import fb from "../assets/Images/fb.png";
import google from "../assets/Images/google.png";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-red-700 hidden text-white sm:flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl lg:text-[45px] lg:font-semibold font-bold mb-4  w-11/12 text-start">
          Join Us
        </h1>
        <p className="text-lg mb-6 w-11/12">
          We're excited to have you here—start your journey with us today!
        </p>
        <img
          src={loginandSignupbg}
          alt="Signup Illustration"
          className="w-4/5 max-w-[350px]"
        />
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 flex py-10 md:py-4 scrollbar-thumb-transparent flex-col justify-start overflow-y-scroll items-center px-10">
        <h1 className="text-[50px] font-bold text-start opacity-80 leading-[50px]">Register Now</h1>
        <p className="text-gray-500 mb-8">
          Please fill in the form to create an account
        </p>
        <form className="w-full max-w-sm">
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="Enter your city"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="state">
              State
            </label>
            <select
              id="state"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select your state</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="delhi">Delhi</option>
              <option value="karnataka">Karnataka</option>
              {/* Add more states as needed */}
            </select>
          </div>
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
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
          >
            Sign Up
          </button>
        </form>
        <div className="my-6 flex items-center">
          <span className="w-1/2 h-px bg-gray-300"></span>
          <span className="mx-2 text-gray-500 whitespace-nowrap text-sm">
            Or Sign Up with
          </span>
          <span className="w-1/2 h-px bg-gray-300"></span>
        </div>
        <div className="flex justify-center gap-4">
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center bg-white rounded-full hover:bg-gray-200">
            <img src={fb} className="h-7" alt="Facebook icon" />
          </button>
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center rounded-full bg-white hover:bg-gray-200">
            <img src={google} className="h-6" alt="Google icon" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to='/login' className="text-red-500 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
