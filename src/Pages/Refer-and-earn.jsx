import React, { useState } from 'react';
import { Share2, Gift, Users, Trophy, Star, ChevronRight, Sparkles } from 'lucide-react';

// Simple Card components using Tailwind
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



    const handleRefer = () => {
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'];
        const newReferral = {
            id: referrals.length + 1,
            name: names[Math.floor(Math.random() * names.length)],
            date: new Date().toLocaleDateString(),
            status: Math.random() > 0.3 ? 'Completed' : 'Pending'
        };
        setReferrals([...referrals, newReferral]);
        setRewards(rewards + 10);
    };

    const milestones = [
        { points: 50, reward: 'Silver Badge', icon: '🥈' },
        { points: 100, reward: 'Gold Badge', icon: '🥇' },
        { points: 200, reward: 'Premium Status', icon: '👑' }
    ];

    const getNextMilestone = () => {
        return milestones.find(m => m.points > rewards) || milestones[milestones.length - 1];
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-red-500">
                        Referral Rewards
                    </h1>
                    <p className="text-gray-600 mt-2">Turn your connections into rewards</p>
                </div>
                <button
                    onClick={handleRefer}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all transform hover:-translate-y-1"
                >
                    <Share2 className="h-5 w-5" />
                    <span>Invite Friends</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
                <Card>
                    <CardHeader>
                        <CardTitle>Next Milestone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-center p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                                <div className="text-4xl mb-2">{getNextMilestone().icon}</div>
                                <div className="text-xl font-semibold text-gray-800">{getNextMilestone().reward}</div>
                                <div className="text-sm text-gray-600">
                                    {getNextMilestone().points - rewards} points to go
                                </div>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-red-500 transition-all duration-500"
                                    style={{ width: `${(rewards / getNextMilestone().points) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="relative overflow-hidden group">
                    <CardContent>
                        <Users className="h-8 w-8 text-indigo-500 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800">{referrals.length}</h3>
                        <p className="text-gray-600">Total Referrals</p>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-tl-full opacity-20 group-hover:opacity-30 transition-opacity" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden group">
                    <CardContent>
                        <Gift className="h-8 w-8 text-red-500 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800">{rewards}</h3>
                        <p className="text-gray-600">Reward Points</p>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-tl-full opacity-20 group-hover:opacity-30 transition-opacity" />
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden group">
                    <CardContent>
                        <Trophy className="h-8 w-8 text-pink-500 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800">{Math.floor(rewards / 50)}</h3>
                        <p className="text-gray-600">Achievements</p>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-tl-full opacity-20 group-hover:opacity-30 transition-opacity" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                    {referrals.length === 0 ? (
                        <div className="text-center py-8">
                            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Start inviting friends to earn rewards!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {referrals.slice().reverse().slice(0, 5).map(referral => (
                                <div 
                                    key={referral.id} 
                                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                                            {referral.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">{referral.name}</div>
                                            <div className="text-sm text-gray-500">{referral.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            referral.status === 'Completed' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {referral.status}
                                        </span>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReferAndEarn;