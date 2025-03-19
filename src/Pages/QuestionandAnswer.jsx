import { useParams } from 'react-router-dom';
import React, { useState, useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';

const QuestionandAnswer = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { email } = useParams();

  const options = [
    'Computer Science', 'Electrical Engineering', 'Mathematics', 
    'Business Management', 'Architecture', 'Psychology', 
    'Physics', 'Economics'
  ];

  const Level = ['School', 'Undergrad', 'Postgrad'];

  const { 
    data: questionsAndAnswers = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery(
    ['questions', email],
    async () => {
      if (!email) throw new Error('No email provided');

      const response = await axiosInstance.get(`${apiUrl}/question-answer/${email}`, {
        headers: {
          'x-access-token': localStorage.getItem('accessToken') || '',
          'x-refresh-token': localStorage.getItem('refreshToken') || ''
        }
      });

      // Handle API response structure
      if (!response.data || !response.data.data) return [];

      // Process questions and answers
      return (response.data.data || []).map(question => ({
        id: question._id || null,
        question: question.question || 'No question available',
        grade: question.grade || 'Not Specified',
        label: question.label || 'Uncategorized',
        askedBy: question.askedBy || 'Anonymous',
        instituteEmail: question.instituteEmail || '',
        createdAt: question.createdAt || new Date().toISOString(),
        answers: question.answers || [],
        hasAnswers: (question.answers && question.answers.length > 0) || false,
        updatedAt: question.updatedAt || new Date().toISOString()
      }));
    },
    {
      enabled: !!email,
      retry: 1,
      onError: (error) => {
        console.error('Question fetch error:', error);
      }
    }
  );

  // Filter questions based on selected interests and search term
  const filteredQuestions = useMemo(() => {
    if (!questionsAndAnswers) return [];
    
    return questionsAndAnswers.filter(item => {
      // Interest filter
      const interestMatch = selectedInterests.length === 0 || selectedInterests.includes(item.label);
      
      // Search term filter (case insensitive regex)
      let searchMatch = true;
      if (searchTerm.trim()) {
        const regex = new RegExp(searchTerm.trim(), 'i');
        searchMatch = regex.test(item.question) || 
                     regex.test(item.askedBy) || 
                     regex.test(item.label) ||
                     // Search in answers as well
                     item.answers.some(answer => 
                       regex.test(answer.answer) || regex.test(answer.answeredBy)
                     );
      }
      
      return interestMatch && searchMatch;
    });
  }, [questionsAndAnswers, selectedInterests, searchTerm]);

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    setSelectedInterests(prev => 
      checked 
        ? [...prev, value]
        : prev.filter(interest => interest !== value)
    );
  };

  const clearFilters = () => {
    setSelectedInterests([]);
    setSearchTerm('');
  };

  const toggleExpandQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.question || !form.label || !form.grade) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const updatedForm = { 
        ...form, 
        instituteEmail: email || '', 
        askedBy: localStorage.getItem('email')?.replace(/^"|"$/g, '') || 'Anonymous'
      };
      
      mutate(updatedForm);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit question');
    }
  };

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const endpoint = `${apiUrl}/question-answer`;
      const response = await axiosInstance({
        url: endpoint,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken') || '',
          'x-refresh-token': localStorage.getItem('refreshToken') || ''
        }
      });
      return response.data;
    },
    onSuccess: () => {
      alert('Question submitted successfully!');
      document.getElementById('questionForm').reset();
      setForm({});
      refetch();
    },
    onError: (error) => {
      console.error('Submission error:', error);
      alert('Failed to submit question');
    }
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
      {/* Toggle Button for Sidebar (Small Screens) */}
      <div className="block lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          {isSidebarOpen ? 'Close Filters' : 'Open Filters'}
        </button>
      </div>

      {/* Sidebar for larger screens */}
      <aside className="hidden lg:block w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-500 hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Search input */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <h3 className="text-md font-medium mb-2">Interests</h3>
        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
          {options.map((item) => (
            <li key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={item}
                value={item}
                checked={selectedInterests.includes(item)}
                onChange={handleInterestChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={item} className="text-sm text-gray-700">
                {item}
              </label>
            </li>
          ))}
        </ul>

        {/* Active filters display */}
        {(selectedInterests.length > 0 || searchTerm) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Search: {searchTerm}
                </span>
              )}
              {selectedInterests.map(interest => (
                <span 
                  key={interest} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                >
                  {interest}
                  <button 
                    onClick={() => setSelectedInterests(prev => prev.filter(i => i !== interest))}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Dropdown for smaller screens with filters */}
      <div className={`lg:hidden w-full bg-white shadow-lg rounded-lg p-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-500 hover:underline"
          >
            Clear All
          </button>
        </div>
        
        {/* Search input for mobile */}
        <div className="mb-4">
          <label htmlFor="mobile-search" className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            id="mobile-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <h3 className="text-md font-medium mb-2">Interests</h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {options.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`mobile-${item}`}
                value={item}
                onChange={handleInterestChange}
                checked={selectedInterests.includes(item)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`mobile-${item}`} className="text-sm text-gray-700">
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>

      <main className="w-full lg:w-1/2 relative">
        {/* Question submission form */}
        <form 
          id="questionForm" 
          className="mb-6 bg-white shadow-lg rounded-lg p-4" 
          onSubmit={handleSubmit}
        >
          <h2 className="text-lg font-semibold mb-2">
            Need guidance on career and education? Ask our experts
          </h2>
        
          <input
            type="text"
            name="question"
            placeholder="Type Your Question"
            required
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            onChange={handleChange}
          />
          
          <select 
            name="label" 
            required
            className="w-full mt-2 px-4 py-2 border border-gray-400 rounded-lg"
            onChange={handleChange}
          >
            <option value="">Select Interest</option>
            {options.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          
          <select 
            name="grade" 
            required
            className="w-full mt-2 px-4 py-2 border border-gray-400 rounded-lg"
            onChange={handleChange}
          >
            <option value="">Select Education Level</option>
            {Level.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-2 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>

        {/* Results count and filtering info */}
        <div className="mb-4 px-2">
          <p className="text-sm text-gray-600">
            Showing {filteredQuestions.length} of {questionsAndAnswers.length} questions
            {(selectedInterests.length > 0 || searchTerm) && " (filtered)"}
          </p>
        </div>

        {/* Question list */}
        <div className="space-y-4 max-h-[470px] overflow-y-scroll">
          {filteredQuestions.length === 0 ? (
            <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg">
              {questionsAndAnswers.length === 0 ? 
                "No questions found for this email. Be the first to ask!" : 
                "No questions match your current filters."
              }
            </div>
          ) : (
            filteredQuestions.map((item) => (
              <div 
                key={item.id} 
                className="bg-red-100 shadow-lg rounded-lg p-4 space-y-2"
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
                
                {/* Answers Section */}
                {item.hasAnswers && (
                  <div className="mt-2">
                    <h4 className="mb-4 p-4 text-md">Answers:</h4>
                    <div className="ml-2 space-y-2">
                      {/* Show top 3 answers by default */}
                      {item.answers.slice(0, expandedQuestion === item.id ? item.answers.length : 3).map((answer, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                            <span className="text-sm font-medium">{answer.answeredBy}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(answer.answeredAt).toLocaleString()}
                            </span>
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: answer.answer }} />
                        </div>
                      ))}
                    </div>
                    
                    {/* View More/Less button */}
                    {item.answers.length > 3 && (
                      <button 
                        onClick={() => toggleExpandQuestion(item.id)}
                        className="mt-2 text-blue-500 text-sm hover:underline"
                      >
                        {expandedQuestion === item.id ? 'View Less' : 'View More Answers'}
                      </button>
                    )}
                  </div>
                )}
                
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