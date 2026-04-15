import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Timer, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Globe 
} from "lucide-react";

const CounselorTestExam = () => {
    const [testData, setTestData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTimedOut, setIsTimedOut] = useState(false);
    const [showGuidance, setShowGuidance] = useState(true);
    const autoAdvanceTimer = useRef(null);

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
            navigate("/counselor-test/payment");
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
                const submittedResult = response?.data?.data || null;
                if (submittedResult) {
                    sessionStorage.setItem("latestCounselorTestResult", JSON.stringify(submittedResult));
                }

                if (autoSubmit) {
                    setIsTimedOut(true);
                } else {
                    toast.success("Test submitted successfully!");
                    navigate("/dashboard/test-result", { state: { result: submittedResult } });
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
        if (!showGuidance && !testData && !isExamStarted) {
            fetchQuestions();
        }
    }, [showGuidance]);

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

        // Auto-advance logic
        if (currentQuestionIndex < testData.questions.length - 1) {
            if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
            autoAdvanceTimer.current = setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 600); // 600ms delay for visual feedback
        }
    };

    if (showGuidance) {
        const guidelines = [
            { icon: <BookOpen className="text-red-500" size={20} />, title: "Read Each Question Carefully", description: "Take your time to understand what is being asked before answering." },
            { icon: <Timer className="text-red-500" size={20} />, title: "Manage Your Time", description: "You have 25 minutes for all 50 questions. Don't spend too long on any one question." },
            { icon: <Zap className="text-red-500" size={20} />, title: "Stay Calm and Focused", description: "If you don't know an answer, move on and return to it later if time allows." },
            { icon: <CheckCircle2 className="text-red-500" size={20} />, title: "Review Your Answers", description: "If you finish early, use the remaining time to check your answers." },
            { icon: <Globe className="text-red-500" size={20} />, title: "Stable Connection", description: "A reliable connection is required to avoid interruptions and submit successfully." },
            { icon: <Smartphone className="text-red-500" size={20} />, title: "Device Readiness", description: "Make sure your device is charged and notifications are silenced." },
            { icon: <AlertCircle className="text-red-500" size={20} />, title: "Technical Support", description: "If you face any technical issues, please contact our support team immediately." },
        ];

        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] p-4 font-sans overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>
                <div className="relative max-w-4xl w-full backdrop-blur-xl bg-white/70 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white p-6 md:p-8">
                    <div className="flex justify-center mb-4 text-[#b82025]">
                        <ShieldCheck size={40} className="animate-pulse" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 text-center tracking-tight">
                        Counselor <span className="text-[#b82025]">Test</span>
                    </h1>
                    <p className="text-base text-slate-600 mb-6 text-center max-w-lg mx-auto leading-relaxed">
                        Please read these important instructions before starting your test. Following these will help you perform your best!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                        {guidelines.map((item, idx) => (
                            <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/50 border border-white hover:border-red-100 transition-all duration-300">
                                <div className="p-2 bg-white rounded-lg shadow-sm h-fit shrink-0">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-xs leading-tight mb-1">{item.title}</h3>
                                    <p className="text-[10px] text-slate-500 leading-snug">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <button
                            className="bg-[#b82025] hover:bg-black text-white px-10 py-3 rounded-xl font-black text-base shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                            onClick={() => setShowGuidance(false)}
                        >
                            Start Certification Test
                        </button>
                        <p className="text-[10px] text-slate-400 font-medium italic">By starting, you agree to our test integrity terms.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!testData || !testData.questions || testData.questions.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-4 border-slate-100 rounded-full border-t-[#b82025] animate-spin"></div>
                <p className="text-xl font-black text-slate-800">Preparing Test...</p>
            </div>
        </div>
    );

    if (isTimedOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50/50 to-white p-4">
                <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-8 text-center border border-white">
                    <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <AlertCircle className="h-16 w-16 text-red-600 animate-bounce" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Time's Up!</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                        Your progress has been automatically saved and submitted.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard/test-result")}
                        className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-[#b82025] transition-all shadow-xl shadow-slate-200"
                    >
                        See My Score
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = testData.questions[currentQuestionIndex] || testData.questions[0];
    const totalQ = testData.questions.length;
    const progress = ((currentQuestionIndex + 1) / totalQ) * 100;
    const isRedZone = timeLeft < 300;

    return (
        <div className="h-[calc(100vh-70px)] bg-[#fafbfc] overflow-hidden flex flex-col">
            <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 md:py-6 flex flex-col">
                {/* Modern Compact Header */}
                <header className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 mb-4 flex justify-between items-center gap-4 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl text-white ${isRedZone ? 'bg-red-600 animate-pulse' : 'bg-slate-900'}`}>
                            <Timer size={20} />
                        </div>
                        <p className={`text-xl font-black tabular-nums ${isRedZone ? 'text-red-600' : 'text-slate-800'}`}>
                            {formatTime(timeLeft)}
                        </p>
                    </div>

                    <div className="flex-1 hidden md:block max-w-xs">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-700 ${isRedZone ? 'bg-red-600' : 'bg-slate-800'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-sm font-black text-slate-800">
                            {currentQuestionIndex + 1} <span className="text-slate-300 font-medium">/</span> {totalQ}
                        </p>
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-red-600"
                        >
                            Exit
                        </button>
                    </div>
                </header>

                {/* Main Exam Area */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                    {/* Navigation Sidebar */}
                    <aside className="hidden lg:grid grid-cols-5 gap-1 content-start border-r border-slate-200 pr-4 overflow-y-auto max-h-full scrollbar-hide">
                        {testData.questions.map((q, idx) => {
                             const isCurrent = idx === currentQuestionIndex;
                             const isAnswered = !!answers[q._id];
                             return (
                                <button
                                    key={q._id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all duration-200 ${
                                        isCurrent ? 'bg-red-600 text-white shadow-md scale-110' :
                                        isAnswered ? 'bg-red-50 text-red-600' : 'bg-white text-slate-400 border border-slate-100'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                             )
                        })}
                    </aside>

                    {/* Question Content */}
                    <main className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-white flex flex-col overflow-hidden">
                        <div className="p-6 md:p-10 flex-1 overflow-y-auto scrollbar-hide">
                            <span className="inline-block bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                               Question #{currentQuestionIndex + 1}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-8">
                                {currentQuestion.questionText}
                            </h2>

                            <div className="grid gap-3">
                                {currentQuestion.options.map((option, idx) => {
                                    const isSelected = answers[currentQuestion._id] === option._id;
                                    const label = String.fromCharCode(65 + idx);
                                    return (
                                        <button
                                            key={option._id}
                                            onClick={() => handleOptionSelect(currentQuestion._id, option._id)}
                                            className={`flex items-center p-3 rounded-2xl border-2 transition-all duration-300 text-left ${isSelected
                                                ? "border-[#b82025] bg-red-50/20 shadow-sm"
                                                : "border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 bg-white"
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${isSelected ? "bg-[#b82025] text-white" : "bg-slate-50 text-slate-400"}`}>
                                                {label}
                                            </div>
                                            <span className={`flex-1 pl-4 font-bold text-base ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                                                {option.optionText}
                                            </span>
                                            {isSelected && (
                                                <div className="w-6 h-6 bg-[#b82025] rounded-full flex items-center justify-center">
                                                    <CheckCircle2 size={16} className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation Footer Inside Card */}
                        <footer className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                className="flex items-center gap-1 text-slate-400 hover:text-slate-900 font-black text-sm disabled:opacity-0"
                            >
                                <ChevronLeft size={20} /> Prev
                            </button>

                            {currentQuestionIndex === totalQ - 1 ? (
                                <button
                                    onClick={() => submitTest()}
                                    disabled={isSubmitting}
                                    className="bg-[#b82025] text-white px-8 py-2 rounded-xl font-black shadow-lg hover:bg-black transition-all"
                                >
                                    Finish Test
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                    className="bg-slate-900 text-white px-8 py-2 rounded-xl font-black shadow-lg hover:bg-red-600 transition-all"
                                >
                                    Next
                                </button>
                            )}
                        </footer>
                    </main>
                </div>
            </div>
            
            {/* Minimal Progress Bar Wrapper */}
            <div className="h-1 w-full bg-slate-100 flex">
                {[...Array(totalQ)].map((_, i) => (
                    <div
                        key={i}
                        className={`flex-1 transition-all duration-500 ${
                            i === currentQuestionIndex ? 'bg-amber-400' :
                            answers[testData.questions[i]?._id] ? 'bg-red-600' : 'bg-transparent'
                        }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default CounselorTestExam;
