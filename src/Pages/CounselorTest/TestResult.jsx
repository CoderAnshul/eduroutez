import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, FileText, ChevronRight, Award, Trophy, ShieldCheck, BarChart3 } from "lucide-react";
import axios from "axios";

const CounselorTestResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(location.state?.result || null);
    const [isLoadingResult, setIsLoadingResult] = useState(false);
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const loadLatestResult = async () => {
            if (result) return;

            const storedResult = sessionStorage.getItem("latestCounselorTestResult");
            if (storedResult) {
                try {
                    setResult(JSON.parse(storedResult));
                    return;
                } catch (err) {
                    console.error("Failed to parse latestCounselorTestResult", err);
                }
            }

            const token = localStorage.getItem("accessToken");
            if (!token) return;

            setIsLoadingResult(true);
            try {
                const candidateEndpoints = [
                    `${VITE_BASE_URL}/counselor-test/result`,
                    `${VITE_BASE_URL}/counselor-test/latest-result`,
                    `${VITE_BASE_URL}/counselor-test/my-result`,
                ];

                for (const endpoint of candidateEndpoints) {
                    try {
                        const response = await axios.get(endpoint, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        const payload = response?.data?.data || response?.data?.result || response?.data;
                        if (payload && typeof payload === "object") {
                            setResult(payload);
                            sessionStorage.setItem("latestCounselorTestResult", JSON.stringify(payload));
                            break;
                        }
                    } catch (innerError) {
                        // Try next candidate endpoint.
                        continue;
                    }
                }
            } finally {
                setIsLoadingResult(false);
            }
        };

        loadLatestResult();
    }, [VITE_BASE_URL, result]);

    const score = Number(result?.score || 0);
    const totalQuestions = Number(result?.totalQuestions || 0);
    const timeTaken = Number(result?.timeTaken || 0);
    const status = String(result?.status || "pending").toLowerCase();
    const adminVerified = Boolean(result?.adminVerified);
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const isPass = status === "pass";
    const statusLabel = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
    const verificationText = adminVerified ? "Verified by Admin" : "Verification in Progress";
    const verificationBadge = adminVerified ? "VERIFIED" : "PENDING APPROVAL";
    const answers = Array.isArray(result?.answers) ? result.answers : [];
    const correctAnswers = answers.filter((item) => item?.isCorrect).length;

    const formatDateTime = (value) => {
        if (!value) return "N/A";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "N/A";
        return date.toLocaleString();
    };

    const formatDuration = (seconds) => {
        const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? seconds : 0;
        const mins = Math.floor(safeSeconds / 60);
        const secs = safeSeconds % 60;
        return `${mins}m ${secs}s`;
    };

    const role = String(localStorage.getItem("role") || "").toLowerCase();
    const isCounselorRole = role === "counselor" || role === "counsellor";

    if (isLoadingResult && !result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fff8f8] via-[#fffdf6] to-[#f8fafc] flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 text-center max-w-md w-full">
                    <div className="w-14 h-14 mx-auto mb-4 border-4 border-slate-100 border-t-[#b82025] rounded-full animate-spin"></div>
                    <p className="text-slate-800 font-bold text-lg">Loading latest test result...</p>
                    <p className="text-slate-500 text-sm mt-1">Please wait while we fetch your most recent submission.</p>
                </div>
            </div>
        );
    }

    const metrics = [
        { label: "Score", value: score, tone: "text-slate-900" },
        { label: "Questions", value: totalQuestions, tone: "text-slate-900" },
        { label: "Status", value: statusLabel, tone: isPass ? "text-emerald-600" : "text-rose-600" },
        { label: "Percentage", value: `${percentage}%`, tone: "text-slate-900" },
    ];

    const details = [
        { label: "Admin Verified", value: adminVerified ? "Yes" : "No" },
        { label: "Correct Answers", value: String(correctAnswers) },
        { label: "Submitted At", value: formatDateTime(result?.createdAt) },
        { label: "Updated At", value: formatDateTime(result?.updatedAt) },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff7f8] via-[#fffdf8] to-[#f8fafc] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-[0_16px_70px_rgba(15,23,42,0.08)]">
                    <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-[#b82025]/10 blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl"></div>

                    <div className="relative z-10 p-6 md:p-10">
                        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between mb-8">
                            <div className="flex items-start gap-4">
                                <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-inner ${isPass ? "bg-emerald-100" : "bg-rose-100"}`}>
                                    <CheckCircle className={`${isPass ? "text-emerald-600" : "text-rose-600"} h-8 w-8 md:h-10 md:w-10`} />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                                        <Trophy className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-slate-500">Counselor Certification</p>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Test Submitted</h1>
                                    <p className="text-slate-600 mt-2 max-w-xl">Your latest attempt has been evaluated. Review your score, verification state, and submission details below.</p>
                                </div>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black border ${isPass ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                                <BarChart3 className="h-4 w-4" />
                                {statusLabel}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                            {metrics.map((item) => (
                                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
                                    <p className={`text-2xl md:text-3xl font-black mt-1 ${item.tone}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mb-8 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                            <div className="h-2 bg-slate-100">
                                <div className={`h-full transition-all duration-700 ${isPass ? "bg-emerald-500" : "bg-[#b82025]"}`} style={{ width: `${Math.max(8, percentage)}%` }}></div>
                            </div>
                            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                <div className={`p-3 rounded-xl w-fit ${adminVerified ? "bg-emerald-100" : "bg-amber-100"}`}>
                                    <ShieldCheck className={`${adminVerified ? "text-emerald-700" : "text-amber-700"} h-6 w-6`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900">{verificationText}</h3>
                                    <p className="text-slate-600 text-sm md:text-base mt-1">
                                        {adminVerified
                                            ? "Your profile and test result are approved by the admin team."
                                            : "Your profile is under verification and will be verified shortly by our admin team."}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-xs md:text-sm font-black whitespace-nowrap ${adminVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                    {verificationBadge}
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-5 mb-8">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                                <Award className="h-7 w-7 text-[#b82025] mb-3" />
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Time Taken</p>
                                <p className="text-2xl font-black text-slate-900 mt-1">{formatDuration(timeTaken)}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 lg:col-span-2">
                                <FileText className="h-7 w-7 text-[#b82025] mb-3" />
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Correct Answers</p>
                                <p className="text-xl font-black text-slate-900 mt-1">{correctAnswers}</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white mb-8 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
                                <h4 className="font-extrabold text-slate-900">Result Details</h4>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {details.map((item) => (
                                    <div key={item.label} className="flex flex-col md:flex-row md:items-center justify-between gap-1 px-5 py-3">
                                        <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                                        <p className="text-sm md:text-base font-bold text-slate-900 break-all md:text-right">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            {isCounselorRole ? (
                                <button
                                    onClick={() => window.location.href = "https://admin.eduroutez.com/"}
                                    className="group flex items-center gap-2 bg-[#b82025] text-white px-8 py-4 rounded-2xl font-black text-base md:text-lg hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-red-200"
                                >
                                    Go to Counselor Portal
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-base md:text-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-slate-200"
                                >
                                    Go to Student Dashboard
                                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold">
                    Empowering Education via Expert Guidance
                </p>
            </div>
        </div>
    );
};

export default CounselorTestResult;
