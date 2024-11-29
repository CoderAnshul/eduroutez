import React from 'react'
import infoimg from "../../assets/Images/verificationimg.png"

const VerifyDetails = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full overflow-x-hidden ">
      <div className="w-full flex flex-col max-w-4xl items-center md:block p-6 bg-white rounded-lg h-[480px] overflow-y-scroll  scrollbar-thumb-red">
        {/* Title Section */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verify Your Details</h1>
          <p className="text-sm text-gray-500">
            make sure all the details that you filled are correct
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between max-w-2xl mx-auto gap-8">
          {/* Left Section for Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            {/* Image placeholder */}
            <div className="w-full h-auto">
              <img
                src={infoimg} // Replace this with your image path
                alt="Verification Illustration"
                className="w-auto h-auto max-h-80 "
              />
            </div>
          </div>

          {/* Right Section for OTP Inputs */}
          <div className="w-full md:w-1/2">
            {/* OTP Verification Section */}
            <div className="flex flex-col gap-8">
              {/* Mobile OTP */}
              <div>
                <label
                  htmlFor="mobileOtp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verify your mobile OTP
                </label>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 border border-gray-300 text-center text-xl rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                    />
                  ))}
                </div>
              </div>

              {/* Email OTP */}
              <div>
                <label
                  htmlFor="emailOtp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verify your email OTP
                </label>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 border border-gray-300 text-center text-xl rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyDetails