import React from "react";

const WelcomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-red-500 p-6 rounded-lg text-white">
      <h1 className="text-4xl font-bold">
        Hey <span className="font-semibold">Anshul Sharma</span>, Welcome again!
      </h1>
      <p className="mt-2 text-lg">
        You've finished{" "}
        <span className="text-orange-400 underline decoration-dashed">0 Courses</span>. Need to discover more?
      </p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <button className="px-4 py-2 bg-white text-red-500 font-semibold rounded shadow-md hover:bg-red-50 transition">
          Discover Courses
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded shadow-md hover:bg-gray-200 transition">
          My Activities
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
