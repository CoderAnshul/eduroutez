import React, { useState } from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import fb from "../assets/Images/fb.png";
import google from "../assets/Images/google.png";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import axiosInstance from "../ApiFunctions/axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await axiosInstance.post(
          `${apiUrl}/login`,
          credentials,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Login failed. Please try again.";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      alert("Logged in successfully!");
      localStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(data.data.refreshToken)
      );
      localStorage.setItem(
        "email",
        JSON.stringify(formData?.email)
      )
      navigate("/");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex h-auto">
      {/* Left Section */}
      <div className="w-1/2 bg-red-700 hidden text-white sm:flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl lg:text-[45px] lg:font-semibold font-bold mb-4 w-11/12 text-start">
          Welcome Back
        </h1>
        <p className="text-lg mb-6 w-11/12">
          We're excited to have you here again—let's get you ready for your next
          shopping experience!
        </p>
        <img
          src={loginandSignupbg}
          alt="Shopping Illustration"
          className="w-4/5 max-w-[350px]"
        />
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 flex py-10 md:py-4 flex-col justify-center items-center px-10">
        <h1 className="text-[50px] font-bold text-start opacity-80 mb-2">
          Log in
        </h1>
        <p className="text-gray-500 mb-8">
          Welcome back! Please enter your details
        </p>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="emailOrPhone"
            >
              Email 
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email "
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.emailOrPhone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-red-500"
              />
              <span className="ml-2 text-sm">Remember for 30 days</span>
            </label>
            <Link
              to="/forgotpassword"
              className="text-sm text-yellow-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
          >
            Log in
          </button>
          <button
            type="button"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold mt-4 hover:bg-gray-800"
          >
            Guest
          </button>
        </form>
        <div className="my-6 flex items-center">
          <span className="w-1/2 h-px bg-gray-300"></span>
          <span className="mx-2 text-gray-500 whitespace-nowrap text-sm">
            Or Login with
          </span>
          <span className="w-1/2 h-px bg-gray-300"></span>
        </div>
        <div className="flex justify-center gap-4">
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center bg-white rounded-full hover:bg-gray-200">
            <img src={fb} className="h-7" alt="facebook icon" />
          </button>
          <button className="w-10 h-10 flex justify-center border-2 shadow-md items-center rounded-full bg-white hover:bg-gray-200">
            <img src={google} className="h-6" alt="google icon" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-red-500 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
