import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "react-query";
import axiosInstance from "../ApiFunctions/axios";
import { useNavigate } from 'react-router-dom';
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";
import fb from "../assets/Images/fb.png";
import google from "../assets/Images/google.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const mutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await axiosInstance.post(
          `${apiUrl}/signup`,
          credentials,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to sign up";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (data) => {
      alert("Signed Up Successfully! You can now log in.");
      localStorage.setItem(
        'accessToken',
        JSON.stringify(data.data.accessToken)
      );
      localStorage.setItem(
        'refreshToken',
        JSON.stringify(data.data.refreshToken)
      );
      navigate('/');
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const { confirmPassword, ...signupData } = formData;
    mutation.mutate(signupData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-red-700 hidden text-white sm:flex flex-col justify-center items-center px-10">
        <h1 className="text-4xl lg:text-[45px] lg:font-semibold font-bold mb-4 w-11/12 text-start">
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
      <div className="w-full sm:w-1/2 flex py-10 md:py-4 flex-col justify-start overflow-y-scroll items-center px-10">
        <h1 className="text-[50px] font-bold text-start opacity-80 leading-[50px]">Register Now</h1>
        <p className="text-gray-500 mb-8">
          Please fill in the form to create an account
        </p>
        <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
          {[
            { label: "Full Name", id: "name", type: "text", placeholder: "Enter your full name" },
            { label: "Email", id: "email", type: "email", placeholder: "Enter your email" },
            { label: "Phone Number", id: "contact_number", type: "tel", placeholder: "Enter your phone number" },
            { label: "City", id: "city", type: "text", placeholder: "Enter your city" },
            { label: "State", id: "state", type: "text", placeholder: "Enter your state" },
            { label: "Password", id: "password", type: "password", placeholder: "Create a password" },
            { label: "Confirm Password", id: "confirmPassword", type: "password", placeholder: "Confirm your password" },
          ].map((field) => (
            <div className="mb-4" key={field.id}>
              <label className="block text-sm font-medium mb-1" htmlFor={field.id}>
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData[field.id] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
          <button
            type="button"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </form>
        <div className="my-6 flex items-center">
          <span className="w-1/2 h-px bg-gray-300"></span>
          <span className="mx-2 text-gray-500 whitespace-nowrap text-sm">Or Sign Up with</span>
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
          Already have an account?{' '}
          <Link to="/login" className="text-red-500 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
