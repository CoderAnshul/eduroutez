import React from "react";
import loginandSignupbg from "../assets/Images/loginandSignupbg.png";

const Forgotpassword = () => {
  return (
    <div className="flex  h-auto">
      {/* Left Section */}
      <div className="w-1/2 bg-red-700 hidden  text-white sm:flex flex-col justify-center items-center py-10 px-10">
        <h1 className="text-4xl lg:text-[45px] lg:font-semibold font-bold mb-4 w-11/12 text-start">Welcome Back</h1>
        <p className="text-lg mb-6 w-11/12">
          We're excited to have you here again—let's get you ready for your next
          shopping experience!
        </p>
        <img
          src={loginandSignupbg} // Replace with the correct path or use the image's URL
          alt="Shopping Illustration"
          className="w-4/5 max-w-[350px]"
        />
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/2 flex py-10 md:py-4 flex-col justify-start items-center px-10">
        <h1 className="text-[50px] font-bold text-start opacity-80 mb-2">Forgot password</h1>
        <p className="text-gray-500 mb-8">
          Welcome back! Please enter your details
        </p>
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email or Phone
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email or phone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800"
          >
            Log in
          </button>
        </form>
      </div> 
    </div>
  );
};

export default Forgotpassword;
