import React from 'react'

const PersonalInfo = () => {
  return (
    <div className="flex flex-col items-center h-full ">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg h-[480px] overflow-y-scroll">
        <h1 className="text-2xl font-semibold text-center">Personal Information</h1>
        <p className="text-sm text-center text-gray-500">make sure all the details are correct</p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500">
              Email ID
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your name"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-500">
              Gender
            </label>
            <select
              id="gender"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-500">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              placeholder="Enter your number"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-500">
              Select Country
            </label>
            <select
              id="country"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            >
              <option>Select Country</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-500">
              College You Are Reviewing
            </label>
            <select
              id="college"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            >
              <option>Select</option>
              <option>ABC College</option>
              <option>XYZ University</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-500">
              Location
            </label>
            <input
              type="text"
              id="location"
              placeholder="Enter location"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-500">
              Year of Pass-out
            </label>
            <select
              id="year"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            >
              <option>Select Year</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PersonalInfo