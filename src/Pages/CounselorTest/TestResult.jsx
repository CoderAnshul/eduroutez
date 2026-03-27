import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Clock, FileText, ChevronRight, Award, Trophy } from "lucide-react";

const CounselorTestResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState(location.state?.result || null);

    useEffect(() => {
        // If no result in state, maybe fetch from API or redirect
        if (!result) {
            // In a real app, we might fetch the latest test result for the counselor
            // For now, if no state, we can't show specific score, but we can show the "In Progress" message
        }
    }, [result]);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <div className="max-w-3xl w-full">
                {/* Success Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                    <div className="p-10 md:p-16 flex flex-col items-center text-center relative z-10">
                        <div className="mb-8 relative">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                                <Trophy className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            Congratulations!
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                            You've successfully completed the Counselor Certification Test. Your expertise is now one step closer to being officially recognized.
                        </p>

                        {/* Status Indicator */}
                        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 mb-12 w-full flex flex-col md:flex-row items-center gap-6">
                            <div className="bg-orange-100 p-4 rounded-2xl">
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-xl font-bold text-orange-900">Verification in Progress</h3>
                                <p className="text-orange-700/80">
                                    Your profile is under verification and will be verified shortly by our admin team.
                                </p>
                            </div>
                            <div className="px-4 py-2 bg-orange-200/50 rounded-full text-orange-900 text-sm font-black whitespace-nowrap">
                                PENDING APPROVAL
                            </div>
                        </div>

                        {/* Next Steps Grid */}
                        <div className="grid md:grid-cols-2 gap-6 w-full mb-12">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left hover:border-red-200 transition-colors group">
                                <Award className="h-8 w-8 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-slate-800 mb-2">Verified Badge</h4>
                                <p className="text-slate-500 text-sm">Once approved, an "Eduroutez Verified" badge will appear on your profile.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left hover:border-red-200 transition-colors group">
                                <FileText className="h-8 w-8 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-slate-800 mb-2">Certification</h4>
                                <p className="text-slate-500 text-sm">Download your official certification directly from your dashboard.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-slate-200"
                        >
                            Go to Dashboard
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <p className="text-center mt-10 text-slate-400 text-sm uppercase tracking-widest font-bold">
                    Empowering Education via Expert Guidance
                </p>
            </div>
        </div>
    );
};

export default CounselorTestResult;
