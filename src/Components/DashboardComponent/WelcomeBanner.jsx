import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Award, Medal, Star, MessageCircle, Share2, UserPlus, MessageSquare, HelpCircle } from "lucide-react";
import axios from "axios";

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/user", {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching user profile", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getLevelDetails = (points) => {
    const levels = [
      {
        threshold: 5001,
        name: "Platinum Certificate",
        icon: Crown,
        color: "from-slate-300 to-zinc-300",
        textColor: "text-slate-900",
        progress: 100,
        currentRange: "5001+",
        description: "Elite Level Achievement"
      },
      {
        threshold: 1001,
        name: "Gold Certificate",
        icon: Award,
        color: "from-yellow-400 to-yellow-300",
        textColor: "text-yellow-900",
        progress: 80,
        currentRange: "1001-5000",
        description: "Advanced Expert Status"
      },
      {
        threshold: 501,
        name: "Silver Certificate",
        icon: Medal,
        color: "from-gray-300 to-gray-200",
        textColor: "text-gray-900",
        progress: 60,
        currentRange: "501-1000",
        description: "Intermediate Level"
      },
      {
        threshold: 11,
        name: "Bronze Certificate",
        icon: Medal,
        color: "from-orange-700 to-orange-600",
        textColor: "text-orange-100",
        progress: 40,
        currentRange: "11-500",
        description: "Getting Started"
      },
      {
        threshold: 0,
        name: "Well Wisher",
        icon: Star,
        color: "from-blue-400 to-blue-300",
        textColor: "text-blue-900",
        progress: 20,
        currentRange: "0-10",
        description: "New Member"
      }
    ];

    return levels.find(level => points >= level.threshold) || levels[levels.length - 1];
  };

  const ActionCard = ({ icon: Icon, title, onClick, color }) => (
    <div className="bg-white rounded-lg shadow-md group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1" onClick={onClick}>
      <div className="p-6 flex flex-col items-center text-center space-y-2">
        <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-lg animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading user data. Please try again later.</p>
      </div>
    );
  }

  const levelDetails = getLevelDetails(user.points);
  const LevelIcon = levelDetails.icon;

  const actions = [
    { icon: MessageCircle, title: "Ask a Question", color: "bg-blue-500", route: "/question-&-answers" },
    { icon: Share2, title: "Refer Friends", color: "bg-purple-500", route: "/dashboard/refer&earn" },
    { icon: UserPlus, title: "Become Counselor", color: "bg-red-500", route: "/become-couseller" },
    { icon: MessageSquare, title: "Feedback", color: "bg-indigo-500", route: "/dashboard/reviews" },
    { icon: HelpCircle, title: "Talk to Expert", color: "bg-pink-500", route: "/dashboard/counselor" },
  ];

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-red-100">
                You've earned {user.points || 0} points on your journey
              </p>
            </div>
            <LevelIcon className="h-16 w-16 text-white opacity-90" />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className={`bg-gradient-to-r ${levelDetails.color} rounded-lg shadow-md`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className={`text-xl font-bold ${levelDetails.textColor}`}>
                    {levelDetails.name}
                  </h2>
                  <p className={`${levelDetails.textColor} opacity-80`}>
                    {levelDetails.description}
                  </p>
                </div>
                <LevelIcon className={`h-8 w-8 ${levelDetails.textColor}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`${levelDetails.textColor}`}>Current Range: {levelDetails.currentRange} points</span>
                  <span className={`${levelDetails.textColor} font-medium`}>{levelDetails.progress}%</span>
                </div>
                <div className="w-full bg-black bg-opacity-10 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${levelDetails.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <ActionCard
                key={index}
                icon={action.icon}
                title={action.title}
                color={action.color}
                onClick={() => handleActionClick(action.route)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;