import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Award, ShieldCheck, TrendingUp, ChevronRight } from "lucide-react";

const BecomeCounselorBanner = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleStart = () => {
        // Check if logged in
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login", { state: { backgroundLocation: location } });
        } else {
            navigate("/counselor-test/payment");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 my-16">
            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none transform translate-x-20">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-white">
                        <path d="M44.7,-76.4C58.3,-69.2,70.1,-58.5,78.2,-45.3C86.3,-32.1,90.7,-16,89.5,-0.7C88.3,14.7,81.4,29.3,72.4,42.1C63.4,54.8,52.2,65.6,39.1,72.9C26,80.2,13,84,-0.6,85.1C-14.3,86.1,-28.5,84.4,-41.2,77.5C-53.8,70.6,-64.8,58.5,-72.6,44.9C-80.4,31.3,-84.9,16.2,-84.3,1.3C-83.7,-13.6,-77.9,-28.2,-68.8,-40.4C-59.8,-52.6,-47.5,-62.4,-34.4,-69.9C-21.3,-77.4,-10.6,-82.7,2.7,-87.3C16.1,-92,31.2,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Content */}
                    <div className="lg:w-3/5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-6">
                            <ShieldCheck className="h-4 w-4" />
                            PROFESSIONAL CERTIFICATION
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1]">
                            Elevate Your Career as a <span className="text-red-200">Verified Counselor</span>
                        </h1>

                        <p className="text-lg md:text-xl text-red-50 mb-10 max-w-2xl leading-relaxed opacity-90">
                            Join India's most trusted network of educational experts. Get certified, earn your professional badge, and impact thousands of student lives.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={handleStart}
                                className="group flex items-center gap-3 bg-white text-red-700 px-10 py-5 rounded-2xl font-black text-lg hover:bg-red-50 transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-red-900/20"
                            >
                                Become a Counselor
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex items-center gap-4 text-white/80">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-red-700 bg-red-400 flex items-center justify-center text-xs font-bold`}>
                                            C{i}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-medium">Join 500+ experts</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats/Badge Area */}
                    <div className="lg:w-2/5 grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-transform">
                            <Award className="h-10 w-10 text-red-600 mb-4" />
                            <h4 className="font-bold text-slate-800 text-lg">Official Badge</h4>
                            <p className="text-xs text-slate-500 mt-1">Get the "Verified" tick on your public profile</p>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-lg transform translate-y-8 rotate-[3deg] hover:rotate-0 transition-transform">
                            <TrendingUp className="h-10 w-10 text-orange-500 mb-4" />
                            <h4 className="font-bold text-slate-800 text-lg">Higher Visibility</h4>
                            <p className="text-xs text-slate-500 mt-1">Certified profiles get 3x more bookings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeCounselorBanner;
