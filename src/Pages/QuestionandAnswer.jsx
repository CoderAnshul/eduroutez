import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import axiosInstance from "../ApiFunctions/axios";

const QuestionandAnswer = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { email } = useParams();

  const options = [
    "Computer Science",
    "Electrical Engineering",
    "Mathematics",
    "Business Management",
    "Architecture",
    "Psychology",
    "Physics",
    "Economics",
  ];

  const Level = ["School", "Undergrad", "Postgrad"];

  const {
    data: questionsAndAnswers = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    ["questions", email],
    async () => {
      if (!email) throw new Error("No email provided");

      const response = await axiosInstance.get(
        `${apiUrl}/question-answer/${email}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken") || "",
            "x-refresh-token": localStorage.getItem("refreshToken") || "",
          },
        }
      );

      // Handle API response structure
      if (!response.data || !response.data.data) return [];

      // Process questions, handle potential null/undefined cases
      return (response.data.data || []).map((question) => ({
        id: question._id || null,
        question: question.question || "No question available",
        grade: question.grade || "Not Specified",
        label: question.label || "Uncategorized",
        askedBy: question.askedBy || "Anonymous",
        instituteEmail: question.instituteEmail || "",
        createdAt: question.createdAt || new Date().toISOString(),
        answer: "", // No answer field in the current response
        answered: false,
      }));
    },
    {
      enabled: !!email,
      retry: 1,
      onError: (error) => {
        console.error("Question fetch error:", error);
      },
    }
  );

  const handleApplyFilter = () => {
    console.log("Selected Interests:", selectedInterests);
  };

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    setSelectedInterests((prev) =>
      checked ? [...prev, value] : prev.filter((interest) => interest !== value)
    );
  };

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question || !form.label || !form.grade) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const updatedForm = {
        ...form,
        instituteEmail: email || "",
        askedBy:
          localStorage.getItem("email")?.replace(/^"|"$/g, "") || "Anonymous",
      };

      mutate(updatedForm);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit question");
    }
  };

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const endpoint = `${apiUrl}/question-answer`;
      const response = await axiosInstance({
        url: endpoint,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken") || "",
          "x-refresh-token": localStorage.getItem("refreshToken") || "",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      alert("Question submitted successfully!");
      document.getElementById("questionForm").reset();
      setForm({});
      refetch();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      alert("Failed to submit question");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl text-red-500 mb-4">Error Loading Questions</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 relative">
      {/* Sidebar and form components remain the same as in previous implementation */}
      {/* Toggle Button for Sidebar (Small Screens) */}
      <div className="block lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          {isSidebarOpen ? "Close Interests" : "Choose Your Interest"}
        </button>
      </div>

      {/* Sidebar for larger screens */}
      {/* <aside className="hidden lg:block w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select your Interest</h2>
        </div>

        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {options.map((item) => (
            <li key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={item}
                value={item}
                onChange={handleInterestChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={item} className="text-sm text-gray-700">
                {item}
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <button
            onClick={handleApplyFilter}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Apply Filter
          </button>
        </div>
      </aside> */}

      {/* Dropdown for smaller screens with checkboxes */}
      {/* <div className={`lg:hidden w-full bg-white shadow-lg h-80 rounded-lg p-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Choose Your Interest</h2>
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {options.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={item}
                value={item}
                onChange={handleInterestChange}
                checked={selectedInterests.includes(item)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={item} className="text-sm text-gray-700">
                {item}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={handleApplyFilter}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Apply Filter
          </button>
        </div>
      </div> */}

      <main className="w-full  h-fit gap-8 pt-4 max-sm:flex-col  flex lg:w-full relative">
        {/* Question submission form */}
        <form
          id="questionForm"
          className="mb-6 w-1/2 max-sm:w-full h-fit pb-6 shadow-lg rounded-lg"
          onSubmit={handleSubmit}
        >
          {/* Form inputs remain the same */}
          <h2 className="p-5 bg-gray-50 border-b border-gray-200 rounded-t-xl">
            Need guidance on career and education? Ask our experts
          </h2>

          <div className="px-6 mt-8">
            <input
              type="text"
              name="question"
              placeholder="Type Your Question"
              required
              className="w-full  px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              onChange={handleChange}
            />

            <select
              name="label"
              required
              className="w-full mt-2 px-4 py-2 border border-gray-400 rounded-lg"
              onChange={handleChange}
            >
              <option value="">Select Interest</option>
              {options.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="grade"
              required
              className="w-full mt-2 px-4 py-2 border border-gray-400 rounded-lg"
              onChange={handleChange}
            >
              <option value="">Select Education Level</option>
              {Level.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </button>
          </div>
        </form>

        {/* Question list */}
        <div className="space-y-4 h-[500Px] px-4 pb-10 overflow-y-scroll w-1/2 max-sm:w-full">
          {questionsAndAnswers.length === 0 ? (
            <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg">
              No questions found for this email. Be the first to ask!
            </div>
          ) : (
            questionsAndAnswers.map((item) => (
              <div
                key={item.id}
                className="shadow-lg border border-gray-200 hover:shadow-xl transition-shadow rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-semibold">{item.askedBy}</span>
                </div>
                <h3 className="font-bold text-lg">Q: {item.question}</h3>

                <div className="text-sm text-gray-500">
                  <span>Label: {item.label}</span>
                  <span className="ml-2">Grade: {item.grade}</span>
                </div>

                <div className="flex justify-end text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Ads sidebar */}
      <aside className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-4 lg:order-none order-last">
        <div className="h-full flex items-center justify-center">
          <span className="text-gray-500 font-semibold text-xl">Ads</span>
        </div>
      </aside>
    </div>
  );
};

export default QuestionandAnswer;
