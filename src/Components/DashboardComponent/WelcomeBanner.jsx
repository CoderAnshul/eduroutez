import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Award,
  Medal,
  Star,
  MessageCircle,
  Share2,
  UserPlus,
  MessageSquare,
  HelpCircle,
  FileDown,
  Clock,
  CheckCircle,
  Heart,
  Building2,
  BookOpen,
  TrendingUp,
  Zap,
  Trophy,
  Gift,
  Video,
  Edit3,
} from "lucide-react";
import axios from "axios";
import { getRecentActivity, getActivityStats } from "../../ApiFunctions/api";

const WelcomeBanner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityStats, setActivityStats] = useState({ total: 0, likes: 0, wishlists: 0, reviews: 0, points: 0, referrals: 0 });
  const navigate = useNavigate();

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${VITE_BASE_URL}/user`, {
          headers: {
            "Content-Type": "application/json",

            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
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

    const fetchActivity = async () => {
      try {
        const [recent, stats] = await Promise.all([
          getRecentActivity(5),
          getActivityStats(),
        ]);
        setRecentActivity(Array.isArray(recent) ? recent : []);
        setActivityStats(stats || { total: 0, likes: 0, wishlists: 0, reviews: 0 });
      } catch {}
    };

    fetchUserProfile();
    fetchActivity();
  }, []);

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

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
        description: "Elite Level Achievement",
      },
      {
        threshold: 1001,
        name: "Gold Certificate",
        icon: Award,
        color: "from-yellow-400 to-yellow-300",
        textColor: "text-yellow-900",
        progress: 80,
        currentRange: "1001-5000",
        description: "Advanced Expert Status",
      },
      {
        threshold: 501,
        name: "Silver Certificate",
        icon: Medal,
        color: "from-gray-300 to-gray-200",
        textColor: "text-gray-900",
        progress: 60,
        currentRange: "501-1000",
        description: "Intermediate Level",
      },
      {
        threshold: 11,
        name: "Bronze Certificate",
        icon: Medal,
        color: "from-orange-700 to-orange-600",
        textColor: "text-orange-100",
        progress: 40,
        currentRange: "11-500",
        description: "Getting Started",
      },
      {
        threshold: 0,
        name: "Well Wisher",
        icon: Star,
        color: "from-blue-400 to-blue-300",
        textColor: "text-blue-900",
        progress: 20,
        currentRange: "0-10",
        description: "New Member",
      },
    ];

    return (
      levels.find((level) => points >= level.threshold) ||
      levels[levels.length - 1]
    );
  };

  const ActionCard = ({ icon: Icon, title, onClick, color }) => (
    <div
      className="bg-white rounded-lg shadow-md group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="p-6 flex flex-col items-center text-center space-y-2">
        <div
          className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}
        >
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
        <p className="text-red-600">
          Error loading user data. Please try again later.
        </p>
      </div>
    );
  }

  const levelDetails = getLevelDetails(user.points);
  const LevelIcon = levelDetails.icon;

  const actions = [
    {
      icon: MessageCircle,
      title: "Ask a Question",
      color: "bg-blue-500",
      route: "/question-&-answers",
    },
    {
      icon: Share2,
      title: "Refer Friends",
      color: "bg-purple-500",
      route: "/dashboard/refer&earn",
    },
    {
      icon: UserPlus,
      title: "Become Counselor",
      color: "bg-[#b82025]",
      route: "/become-couseller",
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      color: "bg-indigo-500",
      route: "/dashboard/reviews",
    },
    {
      icon: HelpCircle,
      title: "Talk to Expert",
      color: "bg-pink-500",
      route: "/dashboard/counselor",
    },
  ];

  // For counselors, update the "Become Counselor" action
  if (user.role === "counselor") {
    const becomeIdx = actions.findIndex(a => a.title === "Become Counselor");
    if (becomeIdx !== -1) {
      if (user.isVerified) {
        actions[becomeIdx] = {
          icon: Award,
          title: "Verified Counselor",
          color: "bg-green-600",
          route: "#",
        };
      } else if (user.status === "test_pending") {
        actions[becomeIdx] = {
          icon: Zap,
          title: "Take Certification",
          color: "bg-orange-500",
          route: "/counselor-test/exam",
        };
      } else if (user.status === "verification_in_progress") {
        actions[becomeIdx] = {
          icon: Clock,
          title: "Verification Pending",
          color: "bg-yellow-500",
          route: "/dashboard",
        };
      } else {
        actions[becomeIdx] = {
          icon: Award,
          title: "Get Verified",
          color: "bg-[#b82025]",
          route: "/counselor-test/payment",
        };
      }
    }
  }

  const handleActionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Welcome back, {user.name}! 👋
                {user.isVerified && (
                  <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm border border-white/30" title="Verified Counselor">
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z" />
                    </svg>
                  </div>
                )}
              </h1>
              <p className="text-red-100">
                You've earned {user.points || 0} points on your journey
              </p>
            </div>
            <LevelIcon className="h-16 w-16 text-white opacity-90" />
          </div>
        </div>

        <div className="py-5 px-2 sm:py-6 sm:px-6 space-y-6">
          <div
            className={`bg-gradient-to-r ${levelDetails.color} rounded-lg shadow-md`}
          >
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
                  <span className={`${levelDetails.textColor}`}>
                    Current Range: {levelDetails.currentRange} points
                  </span>
                  <span className={`${levelDetails.textColor} font-medium`}>
                    {levelDetails.progress}%
                  </span>
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

          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{activityStats.total}</p>
                <p className="text-[10px] text-blue-600/70 font-medium uppercase tracking-wide">Total Activities</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{activityStats.likes}</p>
                <p className="text-[10px] text-red-600/70 font-medium uppercase tracking-wide">Likes</p>
              </div>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-teal-500 p-2 rounded-lg">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-700">{activityStats.wishlists}</p>
                <p className="text-[10px] text-teal-600/70 font-medium uppercase tracking-wide">Saved</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{activityStats.points}</p>
                <p className="text-[10px] text-amber-600/70 font-medium uppercase tracking-wide">Points</p>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-700">{activityStats.referrals}</p>
                <p className="text-[10px] text-indigo-600/70 font-medium uppercase tracking-wide">Referrals</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          {recentActivity.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => navigate("/dashboard/activity")}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {recentActivity.filter((a) => !["review_submitted","review_updated","unlike_blog","unlike_course","unlike_career","unwishlist_institute","unwishlist_course"].includes(a.type)).slice(0, 5).map((act) => {
                  const actType = act.type || "";
                  let icon = Star;
                  let label = actType;
                  let color = "bg-gray-100";
                  if (actType.startsWith("like_")) { icon = Heart; color = "bg-red-100"; label = "Liked"; }
                  else if (actType.startsWith("wishlist_")) { icon = Building2; color = "bg-teal-100"; label = "Saved"; }
                  else if (actType === "points_earned") { icon = Trophy; color = "bg-amber-100"; label = "Earned points"; }
                  else if (actType === "points_redeemed") { icon = Gift; color = "bg-rose-100"; label = "Redeemed points"; }
                  else if (actType === "referral_used") { icon = Share2; color = "bg-indigo-100"; label = "Referral"; }
                  else if (actType === "counselor_booked") { icon = UserPlus; color = "bg-green-100"; label = "Booked counselor"; }
                  else if (actType === "webinar_registered") { icon = Video; color = "bg-orange-100"; label = "Webinar"; }
                  else if (actType === "profile_updated") { icon = Edit3; color = "bg-violet-100"; label = "Updated profile"; }
                  else if (actType === "question_asked") { icon = HelpCircle; color = "bg-sky-100"; label = "Asked question"; }
                  const Icon = icon;
                  const when = getTimeAgo(act.createdAt);
                  return (
                    <div key={act._id} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">
                          {label}{act.targetName ? `: ${act.targetName}` : ""}
                        </p>
                        <p className="text-[10px] text-gray-400">{when}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase">{act.targetType || ""}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {user.role === "counselor" && user.isVerified && user.certificateUrl && (
          <div className="mx-6 mb-6">
            <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 rounded-[2rem] shadow-xl overflow-hidden relative group">
              {/* Decorative background blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-xl group-hover:translate-x-4 transition-transform duration-700"></div>

              <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                      <Award className="h-10 w-10 text-yellow-300" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 p-1 rounded-full border-2 border-indigo-900">
                      <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-white mb-2">Verified Professional!</h3>
                    <p className="text-blue-100/80 font-medium max-w-xs transition-colors group-hover:text-blue-50">
                      Your expertise is certified. Showcase your achievement with the official certificate.
                    </p>
                  </div>
                </div>

                <a
                  href={user.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-yellow-50 hover:scale-105 transition-all active:scale-95 group/btn"
                  download
                >
                  <FileDown className="h-6 w-6 text-indigo-800 group-hover/btn:animate-bounce" />
                  Download Certificate
                </a>
              </div>
            </div>
          </div>
        )}

        {user.role === "counselor" && user.status === "verification_in_progress" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900">Verification in Progress</h3>
                <p className="text-amber-800 opacity-80 text-sm">Our team is reviewing your test results and profile. You'll be notified soon.</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-amber-200 text-amber-900 rounded-full text-xs font-black">
              PENDING
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeBanner;
