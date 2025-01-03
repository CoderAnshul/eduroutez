import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { postQuestion } from '../ApiFunctions/api';
import { useMutation } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';
import Cookies from 'js-cookie';
const QuestionandAnswer = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null); // Track which question is expanded
  const apiUrl = import.meta.env.VITE_BASE_URL;
  // Static array of options for Select Your Interest
  const options = [
    'Computer Science',
    'Electrical Engineering',
    'Mathematics',
    'Business Management',
    'Architecture',
    'Psychology',
    'Physics',
    'Economics',
  ];
  const Level = [
    'School',
    'Undergrad',
    'Postgrad',
  ];

  // Static array of questions and answers, with some unanswered questions
  const questionsAndAnswers = [
    {
      id: 1,
      question: "What is your favorite subject?",
      answer: "My favorite subject is Computer Science, as it involves problem-solving and innovation.",
      answered: true, // This question has an answer
    },
    {
      id: 2,
      question: "What do you prefer to do in your free time?",
      answer: "In my free time, I enjoy reading books, traveling, and learning new skills.",
      answered: true, // This question has an answer
    },
    {
      id: 3,
      question: "Where do you see yourself in 5 years?",
      answer: "", // No answer yet
      answered: false, // This question doesn't have an answer
    },
    {
      id: 4,
      question: "What are your thoughts on the latest technology trends?",
      answer: "", // No answer yet
      answered: false, // This question doesn't have an answer
    },
  ];

  const handleApplyFilter = () => {
    console.log("Filter Applied!");
    // Logic to handle filter application
  };

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedInterests((prev) => [...prev, value]);
    } else {
      setSelectedInterests((prev) => prev.filter((interest) => interest !== value));
    }
  };

  const handleExpandAnswer = (questionId) => {
    setExpandedQuestion((prev) => (prev === questionId ? null : questionId)); // Toggle answer visibility
  };

  const handleAnswerQuestion = (questionId) => {
    // Add logic here for answering the question (e.g., open a modal or show a text area)
    console.log(`Answering question ${questionId}`);
  };

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  };
  const { email } = useParams();
  console.log('hiii', email);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = { ...form, instituteEmail: email, askedBy: Cookies.get('email')?.replace(/^"|"$/g, '') };
      console.log(updatedForm);
      mutate(updatedForm);
    } catch (error) {
      alert('some error occured!!');
    }
  }

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const endpoint =`${apiUrl}/question-answer`;
      const response = await axiosInstance({
        url: `${endpoint}`,
        method:'post',
        data: formData,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    },

    onSuccess: () => {
      alert('Question submitted successfully!');
      document.getElementById('questionForm').reset();
      // setPreviewUrl(null);
      // router.push('/dashboard/counselor');
    },
    onError: () => {
      alert('Something went wrong');
    }
  });
  

  return (

    <div className="flex flex-col lg:flex-row gap-4 p-4 relative">
      {/* Toggle Button for Sidebar (Small Screens) */}
      <div className="block lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          {isSidebarOpen ? 'Close Interests' : 'Choose Your Interest'}
        </button>
      </div>

      {/* Sidebar for larger screens */}
      <aside className="hidden lg:block w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-4">
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

        {/* Apply Filter Button */}
        <div className="mt-4">
          <button
            onClick={handleApplyFilter}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Apply Filter
          </button>
        </div>
      </aside>

      {/* Dropdown for smaller screens with checkboxes */}
      <div className={`lg:hidden w-full bg-white shadow-lg h-80 rounded-lg p-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
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

        {/* Apply Filter Button */}
        <div className="mt-4">
          <button
            onClick={handleApplyFilter}
            className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-green-600"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full lg:w-1/2 relative">
        {/* Search Section */}
        <form id="questionForm" className="mb-6 bg-white shadow-lg rounded-lg p-4" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold mb-2">
            Need guidance on career and education? Ask our experts
          </h2>
          <div className=" items-center space-x-2">
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                name='question'
                placeholder="Type Your Question"
                className="flex-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                onChange={handleChange}
              />

              {/* ------ changes should be done here --------- */}
              <div className="flex flex-col gap-2 mb-4">
                <select name="label"
                  className="flex-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  {options.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select name="grade"
                  className="flex-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                  onChange={handleChange}
                >
                  <option value="" disabled selected>
                    Select Education Level
                  </option>
                  {Level.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              {/* ------ changes should be done here --------- */}
            </div>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600">
              Submit
            </button>
          </div>
        </form>

        {/* Question and Answer Section */}
        <div className="space-y-4 max-h-[470px] overflow-y-scroll scrollbar-thumb-red">
          {questionsAndAnswers.map((item) => (
            <div key={item.id} className="bg-red-100 shadow-lg rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-semibold">Ayush Sharma</span>
              </div>
              <h3 className="font-bold text-lg">
                Q: {item.question}
              </h3>
              {item.answered ? (
                <p className="text-sm text-gray-500">
                  Answered by: <span className="font-semibold">Ravi Jain</span>
                </p>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleAnswerQuestion(item.id)}
                    className="px-3 py-1 bg-blue-500 text-xs text-white font-medium rounded-sm hover:bg-blue-600"
                  >
                    Answer
                  </button>
                </div>
              )}
              {item.answered && (
                <p className={`text-sm text-gray-700 ${expandedQuestion === item.id ? 'block' : 'hidden'}`}>
                  {item.answer}
                </p>
              )}
              {item.answered && (
                <button
                  onClick={() => handleExpandAnswer(item.id)}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  {expandedQuestion === item.id ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Ads Box */}
      <aside className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-4 lg:order-none order-last">
        <div className="h-full flex items-center justify-center">
          <span className="text-gray-500 font-semibold text-xl">Ads</span>
        </div>
      </aside>
    </div>
  );
};

export default QuestionandAnswer;
