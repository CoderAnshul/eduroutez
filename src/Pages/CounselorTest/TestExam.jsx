import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Timer, Send, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

const CounselorTestExam = () => {
    const [testData, setTestData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTimedOut, setIsTimedOut] = useState(false);

    const navigate = useNavigate();
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${VITE_BASE_URL}/counselor-test/questions`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (response.data.success && response.data.data?.questions?.length > 0) {
                setTestData(response.data.data);
                setIsExamStarted(true);
            } else {
                toast.error(response.data.message || "No questions found for the test. Please contact support.");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast.error("Failed to fetch test questions. Please try again.");
            navigate("/counselor-test/payment"); // Redirect if not authorized or error
        }
    };

    const submitTest = useCallback(async (autoSubmit = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formattedAnswers = Object.entries(answers).map(([qId, sOptId]) => ({
            questionId: qId,
            selectedOptionId: sOptId,
        }));

        const payload = {
            questionSetId: testData?._id,
            timeTaken: (25 * 60) - timeLeft,
            isTimedOut: autoSubmit,
            answers: formattedAnswers,
        };

        try {
            const response = await axios.post(`${VITE_BASE_URL}/counselor-test/submit`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (response.data.success || response.status === 200) {
                if (autoSubmit) {
                    setIsTimedOut(true);
                } else {
                    toast.success("Test submitted successfully!");
                    navigate("/counselor-test/result", { state: { result: response.data.data } });
                }
            }
        } catch (error) {
            console.error("Error submitting test:", error);
            toast.error("Error submitting test. Please contact support.");
        } finally {
            setIsSubmitting(false);
        }
    }, [answers, timeLeft, testData, VITE_BASE_URL, navigate, isSubmitting]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (!isExamStarted || isTimedOut) return;

        if (timeLeft <= 0) {
            submitTest(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isExamStarted, timeLeft, submitTest, isTimedOut]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    if (!testData || !testData.questions || testData.questions.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent animate-spin rounded-full"></div>
                <p className="text-slate-600 font-medium">Preparing your certification test...</p>
            </div>
        </div>
    );

    if (isTimedOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-red-100">
                    <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Time is over!</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Time is over. You could not complete all questions. Your test has been automatically submitted.
                    </p>
                    <button
                        onClick={() => navigate("/counselor-test/result")}
                        className="w-full bg-[#b82025] text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                    >
                        Review Result
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = testData.questions[currentQuestionIndex] || testData.questions[0];
    const totalQ = testData.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQ) * 100;

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                            <Timer className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time Remaining</p>
                            <p className={`text-2xl font-black ${timeLeft < 300 ? 'text-red-600' : 'text-slate-800'}`}>
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-sm font-bold text-slate-800">Progress</p>
                            <p className="text-sm font-medium text-slate-500">
                                Question {currentQuestionIndex + 1} of {totalQ}
                            </p>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                    <div className="p-8 md:p-12">
                        <div className="mb-10">
                            <span className="inline-block bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                                Question #{currentQuestionIndex + 1}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                                {currentQuestion.questionText}
                            </h2>
                        </div>

                        <div className="grid gap-4 mb-12">
                            {currentQuestion.options.map((option) => {
                                const isSelected = answers[currentQuestion._id] === option._id;
                                return (
                                    <button
                                        key={option._id}
                                        onClick={() => handleOptionSelect(currentQuestion._id, option._id)}
                                        className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 text-left ${isSelected
                                            ? "border-red-600 bg-red-50"
                                            : "border-slate-100 hover:border-slate-200 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? "border-red-600 bg-red-600 text-white" : "border-slate-200 text-slate-400 group-hover:border-slate-300"
                                                }`}>
                                                <span className="text-sm font-bold">
                                                    {String.fromCharCode(65 + currentQuestion.options.indexOf(option))}
                                                </span>
                                            </div>
                                            <span className={`font-semibold ${isSelected ? "text-red-700" : "text-slate-600"}`}>
                                                {option.optionText}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                Previous
                            </button>

                            {currentQuestionIndex === totalQ - 1 ? (
                                <button
                                    onClick={() => submitTest()}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-10 py-4 bg-[#b82025] text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                >
                                    <Send className="h-5 w-5" />
                                    Submit Exam
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                >
                                    Next Question
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 px-8 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400 font-medium">Exam Progress: {Math.round(progress)}%</p>
                        <div className="flex gap-1">
                            {[...Array(totalQ)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-3 rounded-full ${i === currentQuestionIndex ? 'bg-red-500 w-4' :
                                        answers[testData.questions[i]?._id] ? 'bg-slate-300' : 'bg-slate-200'
                                        }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounselorTestExam;
