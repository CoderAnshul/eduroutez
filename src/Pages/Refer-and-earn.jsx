import React, { useState, useEffect } from 'react';
import { Share2, Gift, Users, Trophy, ChevronRight, Copy, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Card Components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = "" }) => (
    <div className={`p-4 border-b ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-lg font-semibold ${className}`}>
        {children}
    </h3>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

const ReferAndEarn = () => {
    const [referrals, setReferrals] = useState([]);
    const [rewards, setRewards] = useState(0);
    const [referralCode, setReferralCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [couponSummary, setCouponSummary] = useState({ referralCount: 0, coupons: [] });
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    const TARGET_REFERRALS = 9;

    const completedReferrals = referrals.filter(
        (referral) => referral.status === 'Completed' || !referral.status
    );
    const completedCount = completedReferrals.length;
    const progressPercent = Math.min(
        100,
        Math.round((completedCount / TARGET_REFERRALS) * 100) || 0
    );

    // Fetch Referral History, Code, and Coupons
    useEffect(() => {
        const fetchReferralHistory = async () => {
            try {
                const response = await axios.get(`${VITE_BASE_URL}/my-refferal`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')                    }
                });
                console.log("Referral History:", response.data.data);
                setReferrals(response.data.data || []);
            } catch (error) {
                console.error("Error fetching referral history:", error);
            }
        };

        // Fetch Referral Code
        const fetchReferralCode = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error("User ID not found in localStorage");
                }
                const response = await axios.get(`${VITE_BASE_URL}/user/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')                    }
                });
                setReferralCode(response.data.data.referalCode || "No Code Available");
            } catch (error) {
                console.error("Error fetching referral code:", error);
            }
        };

        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`${VITE_BASE_URL}/my-coupons`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')
                    }
                });

                const { referralCount = 0, coupons = [] } = response.data?.data || response.data || {};
                setCouponSummary({ referralCount, coupons: Array.isArray(coupons) ? coupons : [] });
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        };

        fetchReferralCode();
        fetchReferralHistory();
        fetchCoupons();
    }, []);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    };

    return (
        <>
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Referral Rewards
                    </h1>
                    <p className="text-gray-600 mt-2">Invite friends and unlock your webinar coupon</p>
                </div>
            </div>

            {/* Progress towards webinar reward */}
            <Card className="border border-indigo-100">
                <CardHeader>
                    <CardTitle>Webinar Reward Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                            <p className="text-gray-700 font-medium">
                                {completedCount} / {TARGET_REFERRALS} friends joined with your code
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Refer {TARGET_REFERRALS} friends to unlock a special webinar reward coupon.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                Webinar Campaign
                            </span>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                            className="bg-indigo-600 h-3 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Keep sharing your code to reach the goal and receive your coupon automatically.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Referral Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <span className="text-xl font-semibold text-gray-800">{referralCode}</span>
                        <button
                            onClick={handleCopyCode}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-5 w-5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* My Coupons Section */}
            <Card>
                <CardHeader>
                    <CardTitle>My Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-gray-700 font-medium">
                            Successful webinar referrals: <span className="font-semibold">{couponSummary.referralCount}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Coupons are unlocked automatically when you reach 9+ referrals.
                        </p>
                    </div>

                    {couponSummary.coupons.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                            You don't have any coupons yet. Keep referring friends to earn rewards.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {couponSummary.coupons.map((coupon, index) => (
                                <div
                                    key={coupon.code || index}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-dashed border-indigo-200 rounded-lg px-4 py-3 bg-white/70"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Code: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{coupon.code}</span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {coupon.description || "Referral reward coupon"}
                                        </p>
                                    </div>
                                    {coupon.referralCount && (
                                        <p className="text-xs text-gray-500">
                                            Earned at {coupon.referralCount} referrals
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Referral History</h2>
                <div className="space-y-4">
                    {referrals.length > 0 ? (
                        referrals.map((referral) => (
                            <Card key={referral.id}>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{referral.name}</h3>
                                            <p className="text-gray-600">{new Date(referral.createdAt).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-lg text-white font-semibold ${
                                                referral.status === 'Completed'
                                                    ? 'bg-green-500'
                                                    : 'bg-green-500'
                                            }`}
                                        >
                                            50 Points
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-600">No referrals yet. Start inviting friends!</p>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default ReferAndEarn;
