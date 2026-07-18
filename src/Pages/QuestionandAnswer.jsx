import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";
import { likeQuestion, likeAnswer } from "../ApiFunctions/api";
import useModal from "../Components/Modal/useModal";
<<<<<<< HEAD
import DOMPurify from "dompurify";
=======
import { Helmet } from "react-helmet-async";
>>>>>>> 75ffd60 (improve SEO meta tags and canonical URLs)

const QuestionandAnswer = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useModal();

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
  const queryClient = useQueryClient();
  const userEmail = localStorage.getItem("email")?.replace(/^"|"$/g, "") || "";

  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    return !!(token && token !== "null" && token !== "undefined" && token !== "");
  }, []);

  const handleVoteClick = () => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleVoteError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    }
  };

  const { mutate: voteQuestion } = useMutation({
    mutationFn: ({ questionId, type }) => likeQuestion(questionId, type),
    onSuccess: () => queryClient.invalidateQueries(["questions", email]),
    onError: handleVoteError,
  });

  const { mutate: voteAnswer } = useMutation({
    mutationFn: ({ questionId, answerId, type, answeredBy }) => likeAnswer(questionId, answerId, type, answeredBy),
    onSuccess: () => queryClient.invalidateQueries(["questions", email]),
    onError: handleVoteError,
  });

  const getUserQuestionVote = (question) => {
    if (!userEmail || !question.questionLikes) return null;
    const found = question.questionLikes.find((l) => {
      const lid = typeof l.userId === "object" ? l.userId.email || l.userId.toString() : l.userId;
      return lid === userEmail;
    });
    return found ? found.type : null;
  };

  const getUserAnswerVote = (answer) => {
    if (!userEmail || !answer.likes) return null;
    const found = answer.likes.find((l) => {
      const lid = typeof l.userId === "object" ? l.userId.email || l.userId.toString() : l.userId;
      return lid === userEmail;
    });
    return found ? found.type : null;
  };

  const VoteButtons = ({ voteScore = 0, userVote, onVote }) => (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onVote ? () => onVote("upvote") : undefined}
        className={`p-1 rounded transition-colors ${
          userVote === "upvote"
            ? "text-green-600 bg-green-100"
            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
        }`}
        title="Upvote"
      >
        <ThumbsUp className="h-3 w-3" />
      </button>
      <span className={`text-xs font-semibold min-w-[1.2rem] text-center ${
        voteScore > 0 ? "text-green-600" : voteScore < 0 ? "text-red-500" : "text-gray-500"
      }`}>{voteScore}</span>
      <button
        type="button"
        onClick={onVote ? () => onVote("downvote") : undefined}
        className={`p-1 rounded transition-colors ${
          userVote === "downvote"
            ? "text-red-500 bg-red-100"
            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
        }`}
        title="Downvote"
      >
        <ThumbsDown className="h-3 w-3" />
      </button>
    </div>
  );

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

      // Process questions and answers
      return (response.data.data || []).map((question) => ({
        id: question._id || null,
        question: question.question || "No question available",
        grade: question.grade || "Not Specified",
        label: question.label || "Uncategorized",
        // Prefer to show the user's name if backend returns an object { email, name }
        askedBy:
          question.askedBy && typeof question.askedBy === "object"
            ? question.askedBy.name || question.askedBy.email || "Anonymous"
            : question.askedBy || "Anonymous",
        instituteEmail: question.instituteEmail || "",
        createdAt: question.createdAt || new Date().toISOString(),
        answers: question.answers || [],
        hasAnswers: (question.answers && question.answers.length > 0) || false,
        updatedAt: question.updatedAt || new Date().toISOString(),
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

  // Filter questions based on selected interests and search term
  const filteredQuestions = useMemo(() => {
    if (!questionsAndAnswers) return [];

    return questionsAndAnswers.filter((item) => {
      // Interest filter
      const interestMatch =
        selectedInterests.length === 0 ||
        selectedInterests.includes(item.label);

      // Search term filter (case insensitive regex)
      let searchMatch = true;
      if (searchTerm.trim()) {
        const regex = new RegExp(searchTerm.trim(), "i");
        searchMatch =
          regex.test(item.question) ||
          regex.test(item.askedBy) ||
          regex.test(item.label) ||
          // Search in answers as well
          item.answers.some(
            (answer) =>
              regex.test(answer.answer) || regex.test(answer.answeredBy)
          );
      }

      return interestMatch && searchMatch;
    });
  }, [questionsAndAnswers, selectedInterests, searchTerm]);

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    setSelectedInterests((prev) =>
      checked ? [...prev, value] : prev.filter((interest) => interest !== value)
    );
  };

  const clearFilters = () => {
    setSelectedInterests([]);
    setSearchTerm("");
  };

  const toggleExpandQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  // Helper to display a user's name when possible.
  const formatUserDisplay = (user) => {
    if (!user) return "Anonymous";
    if (typeof user === "object") return user.name || user.email || "Anonymous";
    if (typeof user === "string") {
      // Some backends may serialize objects into a string like "@{email=foo; name=Bar}"
      const atObj = user.match(/^@\{(.+)\}$/);
      if (atObj) {
        const inner = atObj[1];
        const pairs = inner.split(";").map(s => s.trim()).filter(Boolean);
        const obj = {};
        pairs.forEach(p => {
          const [k, v] = p.split("=");
          if (k && v) obj[k.trim()] = v.trim();
        });
        return obj.name || obj.email || user;
      }
      // If it's a normal email, try to prettify the local part
      if (user.includes("@")) {
        const local = user.split("@")[0];
        const words = local.split(/[._\-]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1));
        return words.join(" ") || user;
      }
      return user;
    }
    return String(user);
  };

  const [form, setForm] = useState({});

  // Check for pending question after login redirect
  useEffect(() => {
    const pendingQuestion = sessionStorage.getItem("pendingQuestion");
    const accessToken = localStorage.getItem("accessToken");

    // Only auto-submit if we have both pending question AND valid access token
    if (pendingQuestion && accessToken && accessToken !== "null" && accessToken !== "undefined" && accessToken !== "") {
      try {
        const questionData = JSON.parse(pendingQuestion);
        // Pre-fill the form
        setForm(questionData);

        // Clear session storage
        sessionStorage.removeItem("pendingQuestion");

        // Auto-submit after a short delay to ensure form is ready
        setTimeout(() => {
          if (questionData.question && questionData.label && questionData.grade) {
            const updatedForm = {
              ...questionData,
              instituteEmail: email || "",
              askedBy: localStorage.getItem("email")?.replace(/^"|"$/g, "") || "Anonymous",
            };
            mutate(updatedForm);
          }
        }, 500);
      } catch (error) {
        console.error("Error parsing pending question:", error);
        sessionStorage.removeItem("pendingQuestion");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check for access token before submission (check for token existence and validity)
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || accessToken === "null" || accessToken === "undefined" || accessToken === "") {
      // Store current page URL and form data for redirect after login
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      sessionStorage.setItem("pendingQuestion", JSON.stringify(form));
      // Redirect to login immediately without any delay or alerts
      navigate("/login", { replace: true });
      return false;
    }

    if (!form.question || !form.label || !form.grade) {
      showAlert("Please fill all required fields");
      return false;
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
      showAlert("Failed to submit question");
    }
    return false;
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
      showAlert("Question submitted successfully!");
      document.getElementById("questionForm").reset();
      setForm({});
      refetch();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      // Check if it's an authentication error (401 Unauthorized)
      if (error.response?.status === 401 || error.response?.data?.message?.includes("Unauthorized") || error.response?.data?.message?.includes("token")) {
        // Store form data and redirect to login immediately without alert or delay
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        sessionStorage.setItem("pendingQuestion", JSON.stringify(form));
        // Redirect immediately without alert or delay to prevent page blink
        navigate("/login", { replace: true });
      } else {
        showAlert("Failed to submit question. Please try again.");
      }
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
    <>
    {/* SEO */}

      <div className="universal-container flex flex-col lg:flex-row gap-4 relative">
        {/* Toggle Button for Sidebar (Small Screens) */}
        <div className="block lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            {isSidebarOpen ? "Close Filters" : "Open Filters"}
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
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
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

<<<<<<< HEAD
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
            className="mt-2 w-full px-4 py-2 bg-[#b82025] text-white rounded-lg hover:bg-[#b82025] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </button>
        </form>

        {/* Results count and filtering info */}
        <div className="mb-4 px-2">
          <p className="text-sm text-gray-600">
            Showing {filteredQuestions.length} of {questionsAndAnswers.length}{" "}
            questions
            {(selectedInterests.length > 0 || searchTerm) && " (filtered)"}
          </p>
        </div>

        {/* Question list */}
        <div className="space-y-4 max-h-[470px] overflow-y-scroll">
          {filteredQuestions.length === 0 ? (
            <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg">
              {questionsAndAnswers.length === 0
                ? "No questions found for this email. Be the first to ask!"
                : "No questions match your current filters."}
            </div>
          ) : (
            filteredQuestions.map((item) => (
              <div
                key={item.id}
                className="bg-red-100 shadow-lg rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-semibold">{formatUserDisplay(item.askedBy)}</span>
                  </div>
                  <VoteButtons
                    voteScore={
                      (item.questionLikes
                        ? item.questionLikes.filter((l) => l.type === "upvote").length -
                          item.questionLikes.filter((l) => l.type === "downvote").length
                        : 0)
                    }
                    userVote={getUserQuestionVote(item)}
                    onVote={(type) => {
                      if (handleVoteClick()) voteQuestion({ questionId: item.id, type });
                    }}
                  />
                </div>
                <div
                  className="font-bold text-lg"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.question) }}
                />

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
                      {item.answers
                        .slice(
                          0,
                          expandedQuestion === item.id ? item.answers.length : 3
                        )
                        .map((answer, index) => {
                          const answerVoteScore = answer.likes
                            ? answer.likes.filter((l) => l.type === "upvote").length -
                              answer.likes.filter((l) => l.type === "downvote").length
                            : 0;
                          return (
                          <div key={answer._id || index} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                                <span className="text-sm font-medium">
                                  {formatUserDisplay(answer.answeredBy)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(answer.answeredAt).toLocaleString()}
                                </span>
                              </div>
                              <VoteButtons
                                voteScore={answerVoteScore}
                                userVote={getUserAnswerVote(answer)}
                                onVote={(type) => {
                                  if (handleVoteClick()) voteAnswer({ questionId: item.id, answerId: answer._id, type, answeredBy: answer.answeredBy });
                                }}
                              />
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: answer.answer,
                              }}
                            />
                          </div>
                          );
                        })}
                    </div>

                    {/* View More/Less button */}
                    {item.answers.length > 3 && (
                      <button
                        onClick={() => toggleExpandQuestion(item.id)}
                        className="mt-2 text-blue-500 text-sm hover:underline"
                      >
                        {expandedQuestion === item.id
                          ? "View Less"
                          : "View More Answers"}
                      </button>
                    )}
                  </div>
=======
          {/* Active filters display */}
          {(selectedInterests.length > 0 || searchTerm) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Search: {searchTerm}
                  </span>
>>>>>>> 75ffd60 (improve SEO meta tags and canonical URLs)
                )}
                {selectedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    {interest}
                    <button
                      onClick={() =>
                        setSelectedInterests((prev) =>
                          prev.filter((i) => i !== interest)
                        )
                      }
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
        <div
          className={`lg:hidden w-full bg-white shadow-lg rounded-lg p-4 ${isSidebarOpen ? "block" : "hidden"
            }`}
        >
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
            <label
              htmlFor="mobile-search"
              className="block text-sm font-medium mb-1"
            >
              Search
            </label>
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
                <label
                  htmlFor={`mobile-${item}`}
                  className="text-sm text-gray-700"
                >
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
              className="mt-2 w-full px-4 py-2 bg-[#b82025] text-white rounded-lg hover:bg-[#b82025] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </button>
          </form>

          {/* Results count and filtering info */}
          <div className="mb-4 px-2">
            <p className="text-sm text-gray-600">
              Showing {filteredQuestions.length} of {questionsAndAnswers.length}{" "}
              questions
              {(selectedInterests.length > 0 || searchTerm) && " (filtered)"}
            </p>
          </div>

          {/* Question list */}
          <div className="space-y-4 max-h-[470px] overflow-y-scroll">
            {filteredQuestions.length === 0 ? (
              <div className="text-center text-gray-500 p-6 bg-gray-100 rounded-lg">
                {questionsAndAnswers.length === 0
                  ? "No questions found for this email. Be the first to ask!"
                  : "No questions match your current filters."}
              </div>
            ) : (
              filteredQuestions.map((item) => (
                <div
                  key={item.id}
                  className="bg-red-100 shadow-lg rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="text-sm font-semibold">{formatUserDisplay(item.askedBy)}</span>
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
                        {item.answers
                          .slice(
                            0,
                            expandedQuestion === item.id ? item.answers.length : 3
                          )
                          .map((answer, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                                <span className="text-sm font-medium">
                                  {formatUserDisplay(answer.answeredBy)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(answer.answeredAt).toLocaleString()}
                                </span>
                              </div>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: answer.answer,
                                }}
                              />
                            </div>
                          ))}
                      </div>

                      {/* View More/Less button */}
                      {item.answers.length > 3 && (
                        <button
                          onClick={() => toggleExpandQuestion(item.id)}
                          className="mt-2 text-blue-500 text-sm hover:underline"
                        >
                          {expandedQuestion === item.id
                            ? "View Less"
                            : "View More Answers"}
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
    </>
  );
};

export default QuestionandAnswer;
