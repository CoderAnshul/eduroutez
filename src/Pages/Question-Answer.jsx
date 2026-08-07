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
  Briefcase,
  BookOpen,
  Award,
} from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";
import { likeQuestion, likeAnswer, updateQuestion, deleteQuestion, getMyQuestions } from "../ApiFunctions/api";
import { toast } from "react-toastify";
import AuthPopup from "../Components/AuthPopup";
import Promotions from "./CoursePromotions";
import RichEditor from "../Ui components/RichEditor";
import DOMPurify from "dompurify";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

const CategoryFilter = ({ activeFilters, onFilterChange }) => {
  const categories = [
    { name: "Courses", icon: BookOpen },
    { name: "Career", icon: Briefcase },
    { name: "Institute", icon: School },
    { name: "Placement", icon: Award },
    { name: "Admission", icon: Tag },
  ];

  const handleCategoryClick = (categoryName) => {
    const newFilters = activeFilters.includes(categoryName)
      ? activeFilters.filter((c) => c !== categoryName)
      : [...activeFilters, categoryName];
    onFilterChange(newFilters);
  };

  return (
    <div className="w-full">
      {/* Desktop/Tablet Sidebar version */}
      <div className="hidden md:block">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-3">
          Feeds
        </h3>
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilters.includes(cat.name);
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-all text-left ${
                  isActive
                    ? "bg-[#b82025]/5 text-[#b82025] font-bold"
                    : "text-gray-600 hover:bg-gray-100/70"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                    isActive ? "bg-[#b82025] text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 truncate">{cat.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b82025]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Horizontal scroll version */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-3 pt-1 hide-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeFilters.includes(cat.name);
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleCategoryClick(cat.name)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
                isActive
                  ? "bg-[#b82025] text-white border-[#b82025] shadow-sm shadow-[#b82025]/20"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const VoteButtons = ({ voteScore = 0, userVote, onVote, disabled }) => {
  const isUpvoted = userVote === "upvote";
  const isDownvoted = userVote === "downvote";

  return (
    <div className="flex items-center border border-[#dee0e1] rounded-full bg-gray-50/50 p-0.5 shadow-sm">
      {/* Upvote Pill */}
      <button
        type="button"
        onClick={() => onVote("upvote")}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
          isUpvoted
            ? "text-blue-600 bg-blue-50/80"
            : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Upvote"
      >
        <ThumbsUp className={`h-3.5 w-3.5 ${isUpvoted ? "fill-blue-600" : ""}`} />
        <span>Upvote</span>
        {voteScore !== 0 && (
          <span className={`pl-1.5 border-l ${isUpvoted ? "border-blue-200" : "border-gray-300"}`}>
            {voteScore}
          </span>
        )}
      </button>

      {/* Separator line */}
      {!isUpvoted && !isDownvoted && (
        <span className="w-px h-4 bg-gray-300 mx-0.5" />
      )}

      {/* Downvote Pill */}
      <button
        type="button"
        onClick={() => onVote("downvote")}
        disabled={disabled}
        className={`flex items-center justify-center p-2 rounded-full transition-all ${
          isDownvoted
            ? "text-red-500 bg-red-50"
            : "text-gray-400 hover:bg-gray-100 hover:text-red-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Downvote"
      >
        <ThumbsDown className={`h-3.5 w-3.5 ${isDownvoted ? "fill-red-500" : ""}`} />
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
    return <div className="italic text-gray-400 text-xs pl-2 py-1">No answers yet. Be the first to answer!</div>;
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
          <div key={answer._id || index} className="group/ans pb-3.5 border-b border-gray-100 last:border-0 last:pb-0">
            {/* Answerer Header */}
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <div className="w-5.5 h-5.5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold border border-gray-200 text-gray-600">
                {formatUserDisplay(answer?.answeredBy)?.charAt(0)}
              </div>
              <span className="font-bold text-gray-700">{formatUserDisplay(answer?.answeredBy)}</span>
              <span>•</span>
              <span>{formatDate(answer?.answeredAt)}</span>
            </div>

            {/* Answer Content */}
            <div
              dangerouslySetInnerHTML={{ __html: answer.answer }}
              className="text-sm text-gray-700 leading-relaxed mb-3 pl-7"
            />

            {/* Answer Actions */}
            <div className="flex items-center gap-3 pl-7">
              <VoteButtons
                voteScore={answer.voteScore ?? 0}
                userVote={userVote}
                onVote={(type) => onAnswerVote(questionId, answer._id, type, answer.answeredBy)}
              />

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
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#b82025] font-bold py-1.5 px-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Reply</span>
                {answer.replies && answer.replies.length > 0 && (
                  <span className="text-gray-400">({answer.replies.length})</span>
                )}
              </button>
            </div>

            {/* Replies List */}
            {answer.replies && answer.replies.length > 0 && (
              <div className="ml-7 mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                {answer.replies.map((reply) => (
                  <div key={reply._id} className="text-xs text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1.5">
                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                        {formatUserDisplay(reply.repliedBy)?.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-600">{formatUserDisplay(reply.repliedBy)}</span>
                      <span>•</span>
                      <span>{formatDate(reply.repliedAt)}</span>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: reply.answer }}
                      className="text-gray-600 pl-6 leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Form */}
            {replyingToAnswerId === answer._id && (
              <div className="ml-7 mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#b82025] focus-within:border-[#b82025]">
                  <RichEditor
                    key={`reply-${answer._id}`}
                    value={replyText}
                    onChange={setReplyText}
                    placeholder="Write a reply..."
                    height={85}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplySubmit(answer._id)}
                    className="px-3.5 py-1.5 bg-[#b82025] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => { setReplyingToAnswerId(null); setReplyText(""); }}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors border border-gray-200"
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
          className="flex items-center gap-1.5 text-[#b82025] hover:text-red-800 font-bold text-xs mt-2 pl-7 py-1"
        >
          <ChevronDown className="h-4 w-4" />
          <span>View {remainingCount} more {remainingCount === 1 ? "answer" : "answers"}</span>
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
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

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

    if (pendingQuestion && accessToken && accessToken !== "null" && accessToken !== "undefined" && accessToken !== "") {
      try {
        const questionData = JSON.parse(pendingQuestion);
        setFormData(questionData);

        sessionStorage.removeItem("pendingQuestion");

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
      let queryParams = {
        page: currentPage,
        search: searchQuery,
        sort: JSON.stringify({ createdAt: sortOrder }),
        searchFields: JSON.stringify({ question: searchQuery }),
      };
      const baseFilters = { visibility: "public" };
      if (activeFilters.length > 0) {
        baseFilters.label = [activeFilters.join("|")];
      }
      queryParams.filters = JSON.stringify(baseFilters);
      if (userId) {
        queryParams.userId = userId;
      }
      queryParams.user = true;

      const response = await axiosInstance.get(`${apiUrl}/question-answers`, {
        params: queryParams,
      });

      return response.data.data;
    },
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
      setIsAskModalOpen(false);
      setEditingQuestion(null);
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
      setIsAskModalOpen(false);
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
    setIsAskModalOpen(true);
  };

  const handleCloseAskModal = () => {
    setIsAskModalOpen(false);
    setEditingQuestion(null);
    setFormData({ question: "", grade: "", label: "", tags: [], isAnonymous: false, visibility: "public", status: "published" });
    setTagInput("");
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
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[#f1f2f2] min-h-screen text-gray-800 pb-12">
      {/* Central Content Container */}
      <div className="max-w-[1100px] mx-auto px-4 pt-6">
        
        {/* Top Minimal Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#dee0e1] pb-3 mb-6 bg-white px-4 py-3.5 rounded-xl shadow-sm">
          <h1 className="text-lg font-black text-gray-900 flex items-center gap-1.5">
            <span className="text-[#b82025] text-xl font-black tracking-tight">Eduroutez</span>
            <span className="text-gray-300 font-light text-base">|</span>
            <span className="text-gray-500 font-bold text-sm tracking-wide">Student Q&A Hub</span>
          </h1>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
          >
            &larr; Dashboard
          </button>
        </div>

        {/* responsive 3-column grid layout */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Column - Category Filter (Spaces) */}
          <div className="w-full md:w-[180px] lg:w-[200px] flex-shrink-0">
            <div className="md:sticky md:top-24">
              <CategoryFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Middle Column - Main Feed */}
          <div className="flex-1 min-w-0">
            {/* Quick Ask Box (Quora style) */}
            <div className="bg-white rounded-xl border border-[#dee0e1] p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b82025] to-[#e23744] flex items-center justify-center text-white font-bold text-sm shadow-inner flex-shrink-0">
                  {isLoggedIn ? (localStorage.getItem("fullName")?.charAt(0) || localStorage.getItem("email")?.charAt(0) || "U") : "U"}
                </div>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      requireLogin();
                      return;
                    }
                    setIsAskModalOpen(true);
                  }}
                  className="flex-1 bg-gray-50 hover:bg-gray-100/70 border border-[#dee0e1] text-gray-400 text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-colors cursor-pointer font-medium"
                >
                  What is your question?
                </button>
              </div>
              <div className="flex items-center justify-around border-t border-gray-100 mt-3 pt-2.5 text-gray-500 text-xs font-bold">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      requireLogin();
                      return;
                    }
                    setIsAskModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#b82025]" />
                  Ask Question
                </button>
                <button
                  onClick={toggleMyDrafts}
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  {showMyDrafts ? "Hide Drafts" : "My Drafts"}
                </button>
              </div>
            </div>

            {/* Inline Drafts Section when toggled */}
            {showMyDrafts && (
              <div className="bg-white rounded-xl border border-[#dee0e1] p-4 mb-4 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-blue-500" />
                    Your Drafts
                  </h4>
                  <button
                    onClick={() => setShowMyDrafts(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 font-bold"
                  >
                    Close
                  </button>
                </div>
                {loadingDrafts ? (
                  <p className="text-xs text-gray-400 py-2">Loading drafts...</p>
                ) : myDrafts.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 italic">No drafts saved</p>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto">
                    {myDrafts.map((draft) => (
                      <div key={draft._id} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                        <p
                          className="text-xs font-bold text-gray-700 hover:text-[#b82025] cursor-pointer line-clamp-2"
                          onClick={() => handleEditQuestion(draft)}
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draft.question) }}
                        />
                        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                          <span>{formatDate(draft.updatedAt || draft.createdAt)}</span>
                          <button
                            onClick={() => handleEditQuestion(draft)}
                            className="text-blue-600 hover:underline font-bold"
                          >
                            Edit Draft
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Bar and Sorting Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2 border border-[#dee0e1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b82025] focus:border-[#b82025] bg-white text-sm"
                />
              </div>
              <button
                onClick={toggleSortOrder}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#dee0e1] bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-all cursor-pointer flex-shrink-0"
              >
                {sortOrder === "desc" ? (
                  <>
                    <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
                    Newest First
                  </>
                ) : (
                  <>
                    <ArrowUp className="w-3.5 h-3.5 text-gray-400" />
                    Oldest First
                  </>
                )}
              </button>
            </div>

            {/* Main Feed Content */}
            <div className="relative z-10">
              {isLoading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-[#dee0e1] shadow-sm">
                  <Loader2 className="w-8 h-8 text-[#b82025] animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center text-red-600 p-6 bg-white rounded-xl border border-red-100 shadow-sm font-semibold">
                  Failed to load questions. Please try again later.
                </div>
              ) : (
                <div className="space-y-4">
                  {questionsData?.result?.map((question) => {
                    const isOwner = question.userId?.toString() === userId || question.askedBy?.email === userEmail;
                    const answerCount = question.answers?.length || 0;
                    return (
                      <div
                        key={question._id}
                        className="bg-white rounded-xl border border-[#dee0e1] shadow-sm hover:shadow-md transition-all p-5"
                      >
                        {/* Author Header */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200">
                            {question.isAnonymous ? "A" : (question.askedBy?.name?.charAt(0) || question.askedBy?.email?.charAt(0) || "U")}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-gray-800 text-sm">
                                {question.isAnonymous ? "Anonymous User" : (question.askedBy?.name || question.askedBy?.email || "Anonymous")}
                              </span>
                              <span className="text-gray-400 text-xs">•</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                Grade {question.grade}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                              <span>{formatDate(question.createdAt)}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {question.visibility === "private" ? (
                                  <><Lock className="h-3 w-3 text-orange-500" /> Private</>
                                ) : (
                                  <><Globe className="h-3 w-3 text-green-500" /> Public</>
                                )}
                              </span>
                              {question.isEdited && (
                                <>
                                  <span>•</span>
                                  <span className="italic text-[10px] text-gray-400">(edited)</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Question Title */}
                        <h2 
                          className="text-base font-bold text-gray-900 leading-snug hover:underline cursor-pointer mb-2.5"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.question) }}
                        />

                        {/* Category and Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold border border-red-100">
                            {question.label}
                          </span>
                          {question.tags && question.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Answers Section */}
                        <div className="border-t border-gray-100 pt-3.5">
                          <AnswersList
                            answers={question.answers}
                            questionId={question._id}
                            onAnswerVote={handleAnswerVote}
                          />
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3">
                          <div className="flex items-center gap-3">
                            <VoteButtons
                              voteScore={question.voteScore ?? 0}
                              userVote={getUserQuestionVote(question)}
                              onVote={(type) => handleQuestionVote(question._id, type)}
                            />

                            <button
                              onClick={() => {
                                if (!isLoggedIn) {
                                  sessionStorage.setItem("redirectAfterLogin", location.pathname);
                                  navigate("/login");
                                  return;
                                }
                                setAnsweringQuestionId(answeringQuestionId === question._id ? null : question._id);
                                setAnswerText("");
                              }}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                answeringQuestionId === question._id
                                  ? "bg-[#b82025]/10 text-[#b82025]"
                                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                              }`}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>{answeringQuestionId === question._id ? "Answering" : "Answer"}</span>
                              {answerCount > 0 && <span className="text-gray-400">({answerCount})</span>}
                            </button>
                          </div>

                          {/* Owner options */}
                          {isOwner && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditQuestion(question)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit question"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question._id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Answering Editor form */}
                        {answeringQuestionId === question._id && (
                          <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#b82025] focus-within:border-[#b82025]">
                              <RichEditor
                                key={`answer-${question._id}`}
                                value={answerText}
                                onChange={setAnswerText}
                                placeholder="Write your answer..."
                                height={120}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAnswerSubmit(question._id)}
                                disabled={submitAnswerMutation.isPending}
                                className="flex items-center gap-2 px-4 py-2 bg-[#b82025] hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-bold disabled:opacity-75 transition-colors shadow-sm cursor-pointer"
                              >
                                {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                              </button>
                              <button
                                onClick={() => { setAnsweringQuestionId(null); setAnswerText(""); }}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-bold border border-gray-200 transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {questionsData?.result?.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-[#dee0e1] shadow-sm">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-gray-700 mb-1">
                        No Questions Yet
                      </h3>
                      <p className="text-gray-500 text-sm max-w-[280px] mx-auto">
                        Be the first to ask a question and start a discussion!
                      </p>
                    </div>
                  )}

                  {/* Pagination Section */}
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-xs sm:text-sm font-bold border border-gray-300 rounded-lg transition-colors cursor-pointer ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-gray-500 text-xs sm:text-sm font-semibold">Page {currentPage}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={questionsData?.hasNextPage === false}
                      className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer border ${
                        questionsData?.hasNextPage === false
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-[#b82025] hover:bg-red-700 text-white border-[#b82025] shadow-sm shadow-[#b82025]/10"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Desktop Widgets (PC Only) */}
          <div className="hidden lg:block lg:w-[250px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              
              {/* Drafts Sidebar Widget */}
              <div className="bg-white rounded-xl border border-[#dee0e1] p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                  <h3 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Your Drafts
                  </h3>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                    {myDrafts.length}
                  </span>
                </div>
                
                {loadingDrafts ? (
                  <p className="text-xs text-gray-400 py-2">Loading drafts...</p>
                ) : myDrafts.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 italic">No drafts saved</p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto">
                    {myDrafts.slice(0, 5).map((draft) => (
                      <div key={draft._id} className="border-b border-gray-55 last:border-0 pb-2 last:pb-0">
                        <p 
                          className="text-xs text-gray-600 font-semibold line-clamp-2 hover:text-[#b82025] cursor-pointer" 
                          onClick={() => handleEditQuestion(draft)}
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draft.question) }}
                        />
                        <div className="flex items-center justify-between mt-1 text-[9px] text-gray-400">
                          <span>{formatDate(draft.updatedAt || draft.createdAt)}</span>
                          <button
                            onClick={() => handleEditQuestion(draft)}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                    {myDrafts.length > 5 && (
                      <button
                        onClick={() => {
                          setShowMyDrafts(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full text-center text-xs text-[#b82025] font-bold hover:underline pt-1"
                      >
                        View all drafts
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Promotions Widget */}
              <div className="w-full bg-white rounded-xl border border-[#dee0e1] p-2.5 shadow-sm">
                <Promotions location="QA_PAGE" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Ask Question Overlay Modal */}
      <Modal
        isOpen={isAskModalOpen}
        onClose={handleCloseAskModal}
        title={editingQuestion ? "Edit Question" : "Ask a Question"}
      >
        <form
          id="questionForm"
          onSubmit={(e) => handleSubmit(e, formData.status)}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Your Question
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-[#b82025] focus-within:border-[#b82025]">
              <RichEditor
                value={formData.question}
                onChange={handleQuestionChange}
                placeholder="Start your question with 'What', 'How', 'Why', etc."
                height={150}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b82025] focus:border-[#b82025] bg-white text-sm cursor-pointer font-semibold text-gray-700"
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
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Category
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b82025] focus:border-[#b82025] bg-white text-sm cursor-pointer font-semibold text-gray-700"
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
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Tags
            </label>
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {formData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-bold border border-blue-100">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900 cursor-pointer">
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b82025] focus:border-[#b82025] text-sm"
                placeholder="Add a tag (e.g. jee, exams) and press Enter"
              />
              <button type="button" onClick={handleAddTag} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors cursor-pointer">
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Anonymous + Visibility */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#b82025] focus:ring-[#b82025] border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600 flex items-center gap-1.5 font-bold">
                {formData.isAnonymous ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-500" />}
                Post anonymously
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="text-sm border border-gray-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#b82025] focus:border-[#b82025] bg-white font-bold text-gray-600 cursor-pointer"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={handleCloseAskModal}
              className="px-4 py-2 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {editingQuestion ? (
              <>
                <button
                  type="button"
                  onClick={(e) => handleSaveEdit(e, editingQuestion, "draft")}
                  disabled={updateQuestionMutation.isPending}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors disabled:opacity-75 text-sm font-bold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSaveEdit(e, editingQuestion, "published")}
                  disabled={updateQuestionMutation.isPending}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#b82025] hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-75 text-sm font-bold shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {formData.status === "draft" ? "Publish" : "Save & Publish"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors disabled:opacity-75 text-sm font-bold cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-[#b82025] hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-75 text-sm font-bold shadow-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publish Question
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </Modal>

      <AuthPopup isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </div>
  );
};

export default CombinedQuestionsPage;
