import React from "react";

const QueryForm = () => {
  return (
    <div className=" hidden lg:block items-center pt-4 min-w-[240px] justify-center min-h-44 w-1/5 ">
      <form className="w-full max-w-sm p-2 bg-[#F0FDF4] rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Ask Query
        </h2>
        <div className="space-y-2">
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium  mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium  mb-1">Number</label>
            <input
              type="text"
              placeholder="Enter your number"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium  mb-1">City</label>
            <input
              type="text"
              placeholder="Enter your city"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium  mb-1">
              Query Related to
            </label>
            <input
              type="text"
              placeholder="Enter related topic"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium  mb-1">Query</label>
            <textarea
              placeholder="Enter your query"
              rows="4"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent resize-none border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
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
