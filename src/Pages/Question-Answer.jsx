import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  Send,
  Loader2,
  MessageCircle,
  Clock,
  Tag,
  School,
  User,
  ArrowUp,
  ArrowDown,
  ChevronDown,
} from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";
import { toast, ToastContainer } from "react-toastify";
import Promotions from "./CoursePromotions";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-5 bg-gray-50 border-b border-gray-200 rounded-t-xl">
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-5">{children}</div>;

const CategoryFilter = ({ onFilterChange }) => {
  const categories = [
    "Courses",
    "Career",
    "Institute",
    "Placement",
    "Admission",
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    onFilterChange(newSelectedCategories);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-gray-800">
          Filter by Category
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-gray-700"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// New component for displaying answers with "View More" functionality
const AnswersList = ({ answers }) => {
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!answers || answers.length === 0) {
    return <div className="italic text-gray-500">No answers yet</div>;
  }

  // Show first answer or all answers based on state
  const displayedAnswers = showAllAnswers ? answers : [answers[0]];
  const remainingCount = answers.length - 1;

  return (
    <div className="space-y-4">
      {displayedAnswers.map((answer, index) => (
        <div
          key={index}
          className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg"
        >
          <div
            dangerouslySetInnerHTML={{ __html: answer.answer }}
            className="text-gray-700 mb-2"
          />
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <User className="h-4 w-4" />
            <span>{answer.answeredBy}</span>
            <span>•</span>
            <span>{formatDate(answer.answeredAt)}</span>
          </div>
        </div>
      ))}

      {!showAllAnswers && remainingCount > 0 && (
        <button
          onClick={() => setShowAllAnswers(true)}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
          View {remainingCount} more{" "}
          {remainingCount === 1 ? "answer" : "answers"}
        </button>
      )}
    </div>
  );
};

const CombinedQuestionsPage = () => {
  const [formData, setFormData] = useState({
    question: "",
    grade: "",
    label: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first

  const grades = ["8th", "9th", "10th", "11th", "12th"];
  const labels = ["Courses", "Career", "Institute", "Placement", "Admission"];
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const userEmail = localStorage.getItem("email") || "user@example.com";

  const {
    data: questionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["questions", currentPage, searchQuery, activeFilters, sortOrder],
    queryFn: async () => {
      // Create filters object in the requested format
      let queryParams = {
        page: currentPage,
        search: searchQuery,
        sort: JSON.stringify({ createdAt: sortOrder }), // Add sort parameter
        searchFields: JSON.stringify({ question: searchQuery }), // Add searchFields parameter
      };
      // Add filters in the JSON format if there are active filters
      if (activeFilters.length > 0) {
        // Create the filters object with label containing the pipe-separated categories
        queryParams.filters = JSON.stringify({
          label: [activeFilters.join("|")],
        });
      }

      const response = await axiosInstance.get(`${apiUrl}/question-answers`, {
        params: queryParams,
      });

      return response.data.data;
    },
  });

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        `${apiUrl}/question-answer`,
        {
          ...formData,
          askedBy: userEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Question Submitted successfully!");
      document.getElementById("questionForm").reset();
      setFormData({ question: "", grade: "", label: "" });
      refetch();
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (categories) => {
    setActiveFilters(categories);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1); // Reset to first page when sort order changes
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-8xl mx-auto p-4 md:p-6 min-h-screen h-fit">
      <ToastContainer />
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#b82025] text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Student Q&A Hub
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Question Form */}
        <div className="lg:w-1/4 flex flex-col">
          {/* Sticky Question Form */}
          <div className="sticky top-24">
            {/* Category Filter - Added above the Ask a Question card */}
            <CategoryFilter onFilterChange={handleFilterChange} />

            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Ask a Question
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Get guidance from experts and peers!
                </p>
              </CardHeader>
              <CardContent>
                <form
                  id="questionForm"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Question
                    </label>
                    <textarea
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      placeholder="Type your question..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select grade...</option>
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="label"
                        value={formData.label}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select category...</option>
                        {labels.map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#b82025] text-white rounded-lg hover:bg-red-700 transition-colors ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Question
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </Card>
            {/* Promotions moved outside the sticky container */}
            <div className="w-full mt-8">
              <Promotions location="QA_PAGE" />
            </div>
          </div>
        </div>

        {/* Right Column - Questions List */}
        <div className="lg:w-3/4">
          {/* Search Bar and Sort Controls (Sticky) */}
          <div className="sticky top-16 z-20 bg-white pb-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                {sortOrder === "desc" ? (
                  <>
                    <ArrowDown className="w-4 h-4" />
                    Newest First
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-4 h-4" />
                    Oldest First
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Questions List (Scrollable) */}
          <div className="mt-4 relative z-10">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600 p-4">
                Failed to load questions. Please try again later.
              </div>
            ) : (
              <div className="space-y-6">
                {questionsData?.result?.map((question) => (
                  <Card
                    key={question._id}
                    className="hover:shadow-xl transition-shadow"
                  >
                    <CardHeader>
                      <h3 className="text-lg font-bold text-gray-800">
                        {question.question}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <School className="h-4 w-4" />
                          <span>{question.grade}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span>{question.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(question.createdAt)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Replace the existing answers section with the new AnswersList component */}
                      <AnswersList answers={question.answers} />
                    </CardContent>
                  </Card>
                ))}

                {questionsData?.result?.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-800">
                      No Questions Yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to ask a question!
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6 pb-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 ${
                      currentPage === 1
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-300 hover:bg-gray-400"
                    } text-gray-700 rounded-lg transition-colors`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">Page {currentPage}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={questionsData?.hasNextPage === false}
                    className={`px-4 py-2 ${
                      questionsData?.hasNextPage === false
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-[#b82025] hover:bg-red-700"
                    } text-white rounded-lg transition-colors`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedQuestionsPage;
