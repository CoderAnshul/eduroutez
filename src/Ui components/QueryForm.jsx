import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { createQuery } from "../ApiFunctions/api";

const QueryForm = ({ instituteData }) => {
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};
    const requiredFields = ["name", "email", "number", "query"];
    
    requiredFields.forEach(field => {
      if (!formData.get(field)) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Email validation
    const email = formData.get("email");
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone number validation (simple check for numbers only)
    const phoneNo = formData.get("number");
    if (phoneNo && !/^\d+$/.test(phoneNo)) {
      newErrors.number = "Phone number should contain only digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission initiated");

    const formData = new FormData(e.target);
    
    // Validate the form
    if (!validateForm(formData)) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    formData.append("instituteId", instituteData?.data?._id);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phoneNo: formData.get("number"),
      query: formData.get("query"),
      instituteId: formData.get("instituteId")
    };

    createQuery(data)
      .then((response) => {
        console.log("Query submitted successfully:", response);
        toast.success("Query Submitted Successfully");
        e.target.reset(); // Reset the form fields after submission
      })
      .catch((error) => {
        console.error("Error submitting query:", error);
        toast.error("An error occurred while submitting your query");
      });
  };

  return (
    <div className="hidden lg:block items-center pt-4 min-w-[400px] justify-center min-h-44 w-1/5">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <form
        className="w-full max-w-sm p-2 bg-[#F0FDF4] rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Ask Query
        </h2>
        <div className="space-y-2">
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className={`w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className={`w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Number
            </label>
            <input
              type="text"
              name="number"
              placeholder="Enter your number"
              className={`w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.number ? "border-red-500" : ""
              }`}
            />
            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Query
            </label>
            <textarea
              name="query"
              placeholder="Enter your query"
              rows="4"
              className={`w-full px-3 py-2 text-sm border-[1.5px] bg-transparent resize-none border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.query ? "border-red-500" : ""
              }`}
            ></textarea>
            {errors.query && <p className="text-red-500 text-xs mt-1">{errors.query}</p>}
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#17A643] rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryForm;