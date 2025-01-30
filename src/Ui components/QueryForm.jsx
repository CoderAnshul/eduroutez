import React from "react";
import { createQuery } from "../ApiFunctions/api";

const QueryForm = ({instituteData}) => {
  console.log('data',instituteData.data)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form default submission behavior
    console.log("Form submission initiated");



    const formData = new FormData(e.target);
    formData.append("instituteId", instituteData?.data?._id);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phoneNo: formData.get("number"),
      city: formData.get("city"),
      queryRelatedTo: formData.get("relatedTopic"),
      query: formData.get("query"),
      instituteId: formData.get("instituteId")    };

    e.target.reset(); // Reset the form fields after submission

    createQuery(data)
      .then((response) => {
        console.log("Query submitted successfully:", response);
        alert('Query Created Sucessfully')
        // Handle success (e.g., show a success message)
      })
      .catch((error) => {
        alert('some error occur')
        console.error("Error submitting query:", error);
        // Handle error (e.g., show an error message)
      });
  };

  return (
    <div className="hidden lg:block items-center pt-4 min-w-[240px] justify-center min-h-44 w-1/5">
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
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Number
            </label>
            <input
              type="text"
              name="number"
              placeholder="Enter your number"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Query Related to
            </label>
            <input
              type="text"
              name="relatedTopic"
              placeholder="Enter related topic"
              className="w-full px-3 py-2 text-sm border-[1.5px] bg-transparent border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">
              Query
            </label>
            <textarea
              name="query"
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
