import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
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
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Save,
  FileText,
  Globe,
  Lock,
  Plus,
  X,
} from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";
import { likeQuestion, likeAnswer, updateQuestion, deleteQuestion, getMyQuestions } from "../ApiFunctions/api";
import { toast } from "react-toastify";
import AuthPopup from "../Components/AuthPopup";
import Promotions from "./CoursePromotions";
import RichEditor from "../Ui components/RichEditor";
import DOMPurify from "dompurify";

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

const VoteButtons = ({ voteScore = 0, userVote, onVote, disabled }) => {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onVote("upvote")}
        disabled={disabled}
        className={`p-1 rounded transition-colors ${
          userVote === "upvote"
            ? "text-green-600 bg-green-100"
            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Upvote"
      >
        <ThumbsUp className="h-4 w-4" />
      </button>
      <span
        className={`text-sm font-semibold min-w-[1.5rem] text-center ${
          voteScore > 0
            ? "text-green-600"
            : voteScore < 0
            ? "text-red-500"
            : "text-gray-500"
        }`}
      >
        {voteScore}
      </span>
      <button
        type="button"
        onClick={() => onVote("downvote")}
        disabled={disabled}
        className={`p-1 rounded transition-colors ${
          userVote === "downvote"
            ? "text-red-500 bg-red-100"
            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Downvote"
      >
        <ThumbsDown className="h-4 w-4" />
      </button>
    </div>
  );
};

const AnswersList = ({ answers, questionId, onAnswerVote }) => {
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingToAnswerId, setReplyingToAnswerId] = useState(null);
  const queryClient = useQueryClient();
  const apiUrl = import.meta.env.VITE_BASE_URL;

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

  const formatUserDisplay = (user) => {
    if (!user) return "Anonymous";
    if (typeof user === "object") return user.name || user.email || "Anonymous";
    if (typeof user === "string") {
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
      if (user.includes("@")) {
        const local = user.split("@")[0];
        const words = local.split(/[._\-]+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1));
        return words.join(" ") || user;
      }
      return user;
    }
    return String(user);
  };

  const getUserVote = (answer) => {
    const uid = localStorage.getItem("userId");
    if (!uid || !answer.likes) return null;
    const found = answer.likes.find((l) => l.userId?.toString() === uid.toString());
    return found ? found.type : null;
  };

  const handleReplySubmit = async (answerId) => {
    const stripped = replyText.replace(/<[^>]*>/g, "").trim();
    if (!stripped) return;
    try {
      const currentEmail = localStorage.getItem("email") || "";
      await axiosInstance.post(
        `${apiUrl}/question-answer/${questionId}/answer/${answerId}/reply`,
        { answer: replyText, repliedBy: currentEmail },
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        }
      );
      setReplyText("");
      setReplyingToAnswerId(null);
      queryClient.invalidateQueries(["questions"]);
    } catch (err) {
      toast.error("Failed to submit reply");
    }
  };

  const displayedAnswers = showAllAnswers ? answers : [answers[0]];
  const remainingCount = answers.length - 1;

  return (
    <div className="space-y-4">
      {displayedAnswers.map((answer, index) => {
        const userVote = getUserVote(answer);
        return (
          <div key={answer._id || index}>
            <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
              <div
                dangerouslySetInnerHTML={{ __html: answer.answer }}
                className="text-gray-700 mb-2"
              />
              <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{formatUserDisplay(answer?.answeredBy)}</span>
                  <span>•</span>
                  <span>{formatDate(answer?.answeredAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const token = localStorage.getItem("accessToken");
                      if (!token || token === "null") {
                        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
                        window.location.href = "/login";
                        return;
                      }
                      setReplyingToAnswerId(replyingToAnswerId === answer._id ? null : answer._id);
                      setReplyText("");
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <MessageCircle className="h-3 w-3" />
                    Reply
                  </button>
                  <VoteButtons
                    voteScore={answer.voteScore ?? 0}
                    userVote={userVote}
                    onVote={(type) => onAnswerVote(questionId, answer._id, type, answer.answeredBy)}
                  />
                </div>
              </div>
            </div>

            {/* Replies */}
            {answer.replies && answer.replies.length > 0 && (
              <div className="ml-8 mt-2 space-y-2">
                {answer.replies.map((reply) => (
                  <div key={reply._id} className="p-3 bg-gray-50 border-l-2 border-gray-300 rounded">
                    <div
                      dangerouslySetInnerHTML={{ __html: reply.answer }}
                      className="text-gray-600 text-sm mb-1"
                    />
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{formatUserDisplay(reply.repliedBy)}</span>
                      <span>•</span>
                      <span>{formatDate(reply.repliedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form */}
            {replyingToAnswerId === answer._id && (
              <div className="ml-8 mt-2 space-y-2">
                <RichEditor
                  key={`reply-${answer._id}`}
                  value={replyText}
                  onChange={setReplyText}
                  placeholder="Write a reply..."
                  height={80}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplySubmit(answer._id)}
                    className="px-3 py-1.5 bg-[#b82025] text-white text-xs rounded-lg hover:bg-red-700"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => { setReplyingToAnswerId(null); setReplyText(""); }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

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
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    question: "",
    grade: "",
    label: "",
    tags: [],
    isAnonymous: false,
    visibility: "public",
    status: "published",
  });
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showMyDrafts, setShowMyDrafts] = useState(false);
  const [myDrafts, setMyDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answeringQuestionId, setAnsweringQuestionId] = useState(null);

  const grades = ["8th", "9th", "10th", "11th", "12th"];
  const labels = ["Courses", "Career", "Institute", "Placement", "Admission"];
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const userEmail = localStorage.getItem("email") || "user@example.com";
  const userId = localStorage.getItem("userId");

  const isLoggedIn = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const accessToken = localStorage.getItem("accessToken");
    return !!(accessToken && accessToken !== "null" && accessToken !== "undefined" && accessToken !== "");
  }, []);

  const handleVoteError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    } else {
      toast.error("Failed to vote. Try again.");
    }
  };

  const likeQuestionMutation = useMutation({
    mutationFn: ({ questionId, type }) => likeQuestion(questionId, type),
    onSuccess: () => queryClient.invalidateQueries(["questions"]),
    onError: handleVoteError,
  });

  const likeAnswerMutation = useMutation({
    mutationFn: ({ questionId, answerId, type, answeredBy }) => likeAnswer(questionId, answerId, type, answeredBy),
    onSuccess: () => queryClient.invalidateQueries(["questions"]),
    onError: handleVoteError,
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }) => {
      const currentEmail = localStorage.getItem("email") || "";
      const response = await axiosInstance.post(
        `${apiUrl}/question-answer/${questionId}/answer`,
        { answer, answeredBy: currentEmail },
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
      toast.success("Answer submitted!");
      setAnswerText("");
      setAnsweringQuestionId(null);
      queryClient.invalidateQueries(["questions"]);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error?.message || "Failed to submit answer");
      }
    },
  });

  const requireLogin = () => {
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    navigate("/login");
  };

  const handleQuestionVote = (questionId, type) => {
    if (!isLoggedIn) {
      requireLogin();
      return;
    }
    likeQuestionMutation.mutate({ questionId, type });
  };

  const handleAnswerVote = (questionId, answerId, type, answeredBy) => {
    if (!isLoggedIn) {
      requireLogin();
      return;
    }
    const answeredByEmail = typeof answeredBy === 'object' ? answeredBy?.email : answeredBy;
    likeAnswerMutation.mutate({ questionId, answerId, type, answeredBy: answeredByEmail });
  };

  const handleAnswerSubmit = (questionId) => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
      return;
    }
    const stripped = answerText.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      toast.error("Please write an answer");
      return;
    }
    submitAnswerMutation.mutate({ questionId, answer: answerText });
  };

  const getUserQuestionVote = (question) => {
    const uid = localStorage.getItem("userId");
    if (!uid || !question.questionLikes) return null;
    const found = question.questionLikes.find((l) => l.userId?.toString() === uid.toString());
    return found ? found.type : null;
  };

  // Check for pending question after login redirect
  useEffect(() => {
    const pendingQuestion = sessionStorage.getItem("pendingQuestion");
    const accessToken = localStorage.getItem("accessToken");

    // Only auto-submit if we have both pending question AND valid access token
    if (pendingQuestion && accessToken && accessToken !== "null" && accessToken !== "undefined" && accessToken !== "") {
      try {
        const questionData = JSON.parse(pendingQuestion);
        // Pre-fill the form
        setFormData(questionData);

        // Clear session storage
        sessionStorage.removeItem("pendingQuestion");

        // Auto-submit after a short delay to ensure form is ready
        setTimeout(() => {
          if (questionData.question && questionData.label && questionData.grade) {
            const questionToSubmit = {
              ...questionData,
              askedBy: localStorage.getItem("email") || "user@example.com",
            };
            mutate(questionToSubmit);
          }
        }, 500);
      } catch (error) {
        console.error("Error parsing pending question:", error);
        sessionStorage.removeItem("pendingQuestion");
      }
    }
  }, []);

  const {
    data: questionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["questions", currentPage, searchQuery, activeFilters, sortOrder],
    queryFn: async () => {
      // Build query params
      let queryParams = {
        page: currentPage,
        search: searchQuery,
        sort: JSON.stringify({ createdAt: sortOrder }),
        searchFields: JSON.stringify({ question: searchQuery }),
      };
      // Add filters in the JSON format if there are active filters
      const baseFilters = { visibility: "public" };
      if (activeFilters.length > 0) {
        baseFilters.label = [activeFilters.join("|")];
      }
      queryParams.filters = JSON.stringify(baseFilters);
      // Pass userId so the backend includes the user's own private questions
      if (userId) {
        queryParams.userId = userId;
      }

      // Request user objects from backend when available
      queryParams.user = true;

      const response = await axiosInstance.get(`${apiUrl}/question-answers`, {
        params: queryParams,
      });

      return response.data.data;
    },
    // enabled: isLoggedIn, // Removed: Fetch even if not logged in
    retry: false,
  });

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        question: formData.question,
        grade: formData.grade,
        label: formData.label,
        tags: formData.tags,
        isAnonymous: formData.isAnonymous,
        visibility: formData.visibility,
        status: formData.status,
        askedBy: userEmail,
      };
      const response = await axiosInstance.post(
        `${apiUrl}/question-answer`,
        payload,
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
    onSuccess: (data, variables) => {
      if (variables.status === "draft") {
        toast.success("Draft saved!");
      } else {
        toast.success("Question submitted successfully!");
      }
      document.getElementById("questionForm")?.reset();
      setFormData({ question: "", grade: "", label: "", tags: [], isAnonymous: false, visibility: "public", status: "published" });
      setTagInput("");
      refetch();
    },
    onError: (error) => {
      if (error.response?.status === 401 || error.response?.data?.message?.includes("Unauthorized") || error.response?.data?.message?.includes("token")) {
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        sessionStorage.setItem("pendingQuestion", JSON.stringify(formData));
        navigate("/login", { replace: true });
      } else {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await updateQuestion(id, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Question updated!");
      setEditingQuestion(null);
      queryClient.invalidateQueries(["questions"]);
      if (showMyDrafts) fetchMyDrafts();
    },
    onError: (err) => {
      toast.error("Failed to update question");
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id) => {
      const response = await deleteQuestion(id);
      return response;
    },
    onSuccess: () => {
      toast.success("Question deleted");
      queryClient.invalidateQueries(["questions"]);
    },
    onError: (err) => {
      toast.error("Failed to delete question");
    },
  });

  const fetchMyDrafts = useCallback(async () => {
    setLoadingDrafts(true);
    try {
      const res = await getMyQuestions("draft");
      setMyDrafts(res?.data || []);
    } catch (err) {
      toast.error("Failed to load drafts");
    }
    setLoadingDrafts(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleQuestionChange = (value) => {
    setFormData((prev) => ({ ...prev, question: value }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e, status = "published") => {
    e.preventDefault();
    e.stopPropagation();

    const stripped = formData.question.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      toast.error("Please enter your question");
      return false;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || accessToken === "null" || accessToken === "undefined" || accessToken === "") {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      sessionStorage.setItem("pendingQuestion", JSON.stringify({ ...formData, status }));
      setShowLoginPopup(true);
      return false;
    }

    mutate({ ...formData, status });
    return false;
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question._id);
    setFormData({
      question: question.question,
      grade: question.grade || "",
      label: question.label || "",
      tags: question.tags || [],
      isAnonymous: question.isAnonymous || false,
      visibility: question.visibility || "public",
      status: question.status || "published",
    });
  };

  const handleSaveEdit = (e, questionId, status = formData.status) => {
    e.preventDefault();
    e.stopPropagation();

    const stripped = formData.question.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      toast.error("Question cannot be empty");
      return;
    }

    updateQuestionMutation.mutate({
      id: questionId,
      data: {
        question: formData.question,
        grade: formData.grade,
        label: formData.label,
        tags: formData.tags,
        isAnonymous: formData.isAnonymous,
        visibility: formData.visibility,
        status,
      },
    });
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate(questionId);
    }
  };

  const toggleMyDrafts = () => {
    if (!showMyDrafts) {
      fetchMyDrafts();
    }
    setShowMyDrafts(!showMyDrafts);
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
    <div className="universal-container min-h-screen h-fit">
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
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {editingQuestion ? "Edit Question" : "Ask a Question"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Get guidance from experts and peers!
                    </p>
                  </div>
                  <button
                    onClick={toggleMyDrafts}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <FileText className="h-3 w-3" />
                    {showMyDrafts ? "Hide Drafts" : "My Drafts"}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {showMyDrafts && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-h-40 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">Your Drafts</h4>
                    {loadingDrafts ? (
                      <p className="text-xs text-yellow-600">Loading...</p>
                    ) : myDrafts.length === 0 ? (
                      <p className="text-xs text-yellow-600">No drafts saved</p>
                    ) : (
                      myDrafts.map((draft) => (
                        <div key={draft._id} className="flex items-center justify-between py-1 border-b border-yellow-100 last:border-0">
                          <span className="text-xs truncate flex-1">{draft.question.replace(/<[^>]*>/g, "")}</span>
                          <button
                            onClick={() => handleEditQuestion(draft)}
                            className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                          >
                            Edit
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <form
                  id="questionForm"
                  onSubmit={(e) => handleSubmit(e, formData.status)}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Question
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <RichEditor
                        value={formData.question}
                        onChange={handleQuestionChange}
                        placeholder="Type your question..."
                        height={150}
                      />
                    </div>
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

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {formData.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900">
                                  <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                        placeholder="Add a tag and press Enter"
                      />
                      <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Anonymous + Visibility */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        {formData.isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        Post anonymously
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingQuestion ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleSaveEdit(e, editingQuestion, "draft")}
                          disabled={updateQuestionMutation.isPending}
                          className="flex items-center justify-center gap-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-75 text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Draft
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleSaveEdit(e, editingQuestion, "published")}
                          disabled={updateQuestionMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#b82025] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-75"
                        >
                          <Send className="w-5 h-5" />
                          {formData.status === "draft" ? "Publish" : "Save & Publish"}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#b82025] text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-75"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Submit
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleSubmit(e, "draft")}
                          disabled={isSubmitting}
                          className="flex items-center justify-center gap-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-75 text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Draft
                        </button>
                      </>
                    )}
                  </div>
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
                  {questionsData?.result?.map((question) => {
                  const isOwner = question.userId?.toString() === userId || question.askedBy?.email === userEmail;
                  return (
                  <Card
                    key={question._id}
                    className="hover:shadow-xl transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div
                          className="text-lg font-bold text-gray-800 flex-1"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.question) }}
                        />
                        <VoteButtons
                          voteScore={question.voteScore ?? 0}
                          userVote={getUserQuestionVote(question)}
                          onVote={(type) => handleQuestionVote(question._id, type)}
                        />
                      </div>
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
                          {question.isAnonymous ? (
                            <>
                              <EyeOff className="h-4 w-4 text-gray-400" />
                              <span className="italic text-gray-400">Anonymous</span>
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4" />
                              <span>
                                {question.askedBy?.name || question.askedBy?.email || "Anonymous"}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{question.answers?.length || 0} answers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(question.createdAt)}</span>
                        </div>
                        {/* Visibility badge */}
                        <div className="flex items-center gap-1">
                          {question.visibility === "private" ? (
                            <><Lock className="h-3 w-3 text-orange-500" /><span className="text-orange-500 text-xs">Private</span></>
                          ) : (
                            <><Globe className="h-3 w-3 text-green-500" /><span className="text-green-500 text-xs">Public</span></>
                          )}
                        </div>
                        {/* Tags */}
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap w-full">
                            {question.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium border border-indigo-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {question.isEdited && (
                          <span className="text-xs text-gray-400 italic">(edited)</span>
                        )}
                      </div>
                      {/* Edit/Delete buttons for owner */}
                      {isOwner && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                          >
                            <Edit3 className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question._id)}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <AnswersList
                        answers={question.answers}
                        questionId={question._id}
                        onAnswerVote={handleAnswerVote}
                      />
                      {answeringQuestionId === question._id ? (
                        <div className="mt-4 space-y-2">
                          <RichEditor
                            key={`answer-${question._id}`}
                            value={answerText}
                            onChange={setAnswerText}
                            placeholder="Write your answer..."
                            height={120}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAnswerSubmit(question._id)}
                              disabled={submitAnswerMutation.isPending}
                              className="flex items-center gap-2 px-4 py-2 bg-[#b82025] text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-75"
                            >
                              {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                            </button>
                            <button
                              onClick={() => { setAnsweringQuestionId(null); setAnswerText(""); }}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (!isLoggedIn) {
                              sessionStorage.setItem("redirectAfterLogin", location.pathname);
                              navigate("/login");
                              return;
                            }
                            setAnsweringQuestionId(question._id);
                            setAnswerText("");
                          }}
                          className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Write an answer
                        </button>
                      )}
                    </CardContent>
                  </Card>
                  );
                })}

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
                    className={`px-4 py-2 ${currentPage === 1
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
                    className={`px-4 py-2 ${questionsData?.hasNextPage === false
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
        <AuthPopup isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </div>
  );
};

export default CombinedQuestionsPage;
