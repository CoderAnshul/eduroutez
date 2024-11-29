import React from 'react';
import contactpagepng from "../assets/Images/contactpagepng.png";

export const ContactusForm = () => {
  return (
    <div className="flex justify-center items-center min-h-96 w-full bg-gray-50">
      <div className="container flex flex-wrap justify-between items-center md:p-8 bg-white rounded-md">
        {/* Left Section - Illustration */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={contactpagepng} // Replace with actual image URL
            alt="24/7 Support Illustration"
            className="w-full max-w-md"
          />
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 px-4">
          <form className="space-y-4">
            {/* Name and Email Row */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-sm"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-sm"
                />
              </div>
            </div>

            {/* You Are */}
            <div>
              <label htmlFor="you-are" className="block text-sm font-medium text-gray-700">
                You are
              </label>
              <select
                id="you-are"
                className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-sm"
              >
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Your Number */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Your Number
              </label>
              <input
                id="number"
                type="text"
                placeholder="Your Number"
                className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-sm"
              />
            </div>

            {/* Your Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                id="message"
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-sm"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
