import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import loadRazorpayScript from "../../loadRazorpayScript";
import { ShieldCheck, Zap, Award, CheckCircle2 } from "lucide-react";

const CounselorTestPayment = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    const handlePayment = async () => {
        setLoading(true);
        const res = await loadRazorpayScript();

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setLoading(false);
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SPTvNCnEWS87X0", // Fallback for dev
            amount: 99 * 100, // Amount in paise
            currency: "INR",
            name: "Eduroutez",
            description: "Counselor Certification Test Fee",
            image: "/logo.png",
            handler: async function (response) {
                try {
                    const paymentData = {
                        amount: 99,
                        transactionId: response.razorpay_payment_id,
                        status: "success",
                    };

                    const apiResponse = await axios.post(
                        `${VITE_BASE_URL}/counselor-test/record-payment`,
                        paymentData,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            },
                        }
                    );

                    if (apiResponse.data.success || apiResponse.status === 200) {
                        toast.success("Payment successful! You can now start the test.");
                        navigate("/counselor-test/exam");
                    }
                } catch (error) {
                    console.error("Error recording payment:", error);
                    toast.error("Failed to record payment. Please contact support.");
                }
            },
            prefill: {
                name: localStorage.getItem("userName") || "",
                email: localStorage.getItem("email")?.replace(/^"|"$/g, "") || "",
            },
            theme: {
                color: "#b82025",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                {/* Left Side - Visual & Info */}
                <div className="bg-gradient-to-br from-red-700 via-red-600 to-orange-500 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                            <circle cx="10" cy="10" r="30" fill="white" />
                            <circle cx="90" cy="90" r="40" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="bg-white/20 w-fit p-3 rounded-2xl backdrop-blur-md mb-8">
                            <Award className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4 tracking-tight">Become a Verified Counselor</h1>
                        <p className="text-red-50 text-lg mb-8 leading-relaxed">
                            Unlock your professional potential and earn the Eduroutez Verified Badge to stand out in the community.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5 text-orange-200" />
                                <span>Gain Credibility & Trust</span>
                            </li>
                            <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5 text-orange-200" />
                                <span>Professional Verified Badge</span>
                            </li>
                            <li className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <CheckCircle2 className="h-5 w-5 text-orange-200" />
                                <span>Digital Certification</span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative z-10 mt-12 pt-8 border-t border-white/20">
                        <div className="flex items-center gap-4 text-sm text-red-100">
                            <ShieldCheck className="h-8 w-8" />
                            <p>Secure payment processed via Razorpay. Encrypted & Protected.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Action */}
                <div className="p-12 flex flex-col justify-center items-center">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Certification Test Fee</h2>
                        <p className="text-slate-500">One-time payment to unlock your exam</p>
                    </div>

                    <div className="bg-slate-50 w-full rounded-2xl p-8 mb-8 border border-slate-100 text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500 opacity-5 rounded-full"></div>
                        <span className="text-slate-400 text-sm block mb-1 uppercase tracking-widest font-semibold">Total Amount</span>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-5xl font-black text-slate-900">₹99</span>
                            <span className="text-slate-400 font-medium">INR</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-[#b82025] hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <>
                                <Zap className="h-5 w-5 fill-current" />
                                Pay & Unlock Test
                            </>
                        )}
                    </button>

                    <p className="mt-8 text-slate-400 text-xs text-center leading-relaxed">
                        By proceeding, you agree to our Terms of Service. The test consists of 50 questions to be completed in 25 minutes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CounselorTestPayment;
