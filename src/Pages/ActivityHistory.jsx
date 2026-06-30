import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart, BookOpen, Building2, Briefcase, Star, MessageSquare,
  Gift, Share2, Trophy, Clock, ArrowUp, Filter, ExternalLink,
  HelpCircle, UserPlus, Video, Edit3
} from "lucide-react";
import { getUserActivity } from "../ApiFunctions/api";
import axiosInstance from "../ApiFunctions/axios";

const HIDE_TYPES = ["review_submitted", "review_updated"];

const TYPE_CONFIG = {
  like_blog: { icon: Heart, label: "Liked a blog", color: "text-red-500", bg: "bg-red-50" },
  unlike_blog: { icon: Heart, label: "Unliked a blog", color: "text-gray-400", bg: "bg-gray-50" },
  like_course: { icon: BookOpen, label: "Liked a course", color: "text-blue-500", bg: "bg-blue-50" },
  unlike_course: { icon: BookOpen, label: "Unliked a course", color: "text-gray-400", bg: "bg-gray-50" },
  like_career: { icon: Briefcase, label: "Liked a career", color: "text-purple-500", bg: "bg-purple-50" },
  unlike_career: { icon: Briefcase, label: "Unliked a career", color: "text-gray-400", bg: "bg-gray-50" },
  wishlist_institute: { icon: Building2, label: "Saved institute", color: "text-teal-500", bg: "bg-teal-50" },
  unwishlist_institute: { icon: Building2, label: "Removed institute", color: "text-gray-400", bg: "bg-gray-50" },
  wishlist_course: { icon: BookOpen, label: "Saved course", color: "text-cyan-500", bg: "bg-cyan-50" },
  unwishlist_course: { icon: BookOpen, label: "Removed course", color: "text-gray-400", bg: "bg-gray-50" },
  points_earned: { icon: Trophy, label: "Earned points", color: "text-amber-500", bg: "bg-amber-50" },
  points_redeemed: { icon: Gift, label: "Redeemed points", color: "text-rose-500", bg: "bg-rose-50" },
  referral_used: { icon: Share2, label: "Referral used", color: "text-indigo-500", bg: "bg-indigo-50" },
  question_asked: { icon: HelpCircle, label: "Asked a question", color: "text-sky-500", bg: "bg-sky-50" },
  counselor_booked: { icon: UserPlus, label: "Booked a counselor", color: "text-green-500", bg: "bg-green-50" },
  webinar_registered: { icon: Video, label: "Registered for webinar", color: "text-orange-500", bg: "bg-orange-50" },
  profile_updated: { icon: Edit3, label: "Updated profile", color: "text-violet-500", bg: "bg-violet-50" },
};

const getTimeAgo = (dateStr) => {
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

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const enrichTargetNames = async (acts) => {
    if (!acts.length) return acts;
    const needName = acts.filter((a) => !a.targetName && a.targetId && a.targetType);
    if (!needName.length) return acts;
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
    for (const act of needName) {
      try {
        const endpoint = act.targetType === "Institute" ? "institute" : act.targetType === "Course" ? "course" : act.targetType === "Blog" ? "blog" : act.targetType === "Career" ? "career" : null;
        if (!endpoint) continue;
        const res = await axiosInstance.get(`/${endpoint}/${act.targetId}`);
        const d = res?.data?.data;
        if (d) {
          act.targetName = d.instituteName || d.courseTitle || d.title || d.name || "";
        }
      } catch {}
    }
    return acts;
  };

  useEffect(() => {
    fetchActivities();
  }, [page]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await getUserActivity(page, 20);
      let data = res.activities || res;
      data = Array.isArray(data) ? data : data?.activities || [];
      data = await enrichTargetNames(data);
      setActivities(data);
      setTotalPages(res.totalPages || 1);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activities.filter((a) => {
    if (HIDE_TYPES.includes(a.type)) return false;
    if (filter === "all") return true;
    return a.type === filter;
  });

  const filterOptions = [
    { value: "all", label: "All Activity", icon: Clock },
    { value: "wishlist_institute", label: "Saved Institutes", icon: Building2 },
    { value: "like_blog", label: "Liked Blogs", icon: Heart },
    { value: "like_course", label: "Liked Courses", icon: BookOpen },
    { value: "like_career", label: "Liked Careers", icon: Briefcase },
    { value: "points_earned", label: "Points Earned", icon: Trophy },
    { value: "points_redeemed", label: "Redeemed", icon: Gift },
    { value: "referral_used", label: "Referrals", icon: Share2 },
    { value: "counselor_booked", label: "Counselors", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Activity History</h1>
            <p className="text-sm text-gray-500 mt-1">Track everything you do on Eduroutez</p>
          </div>
          {activities.length > 0 && (
            <span className="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
              {activities.length} activities
            </span>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setFilter(opt.value); setPage(1); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === opt.value
                  ? "bg-[#b82025] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Activity list */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No activity yet</h3>
            <p className="text-sm text-gray-500">Your activities will appear here as you use Eduroutez</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((act) => {
              const cfg = TYPE_CONFIG[act.type] || { icon: Star, label: act.type, color: "text-gray-500", bg: "bg-gray-50" };
              const Icon = cfg.icon;
              const targetUrl = act.targetType === "Institute" && act.targetId ? `/institute/${act.targetId}` :
                act.targetType === "Course" && act.targetId ? `/coursesinfopage/${act.targetId}` :
                act.targetType === "Blog" && act.targetId ? `/blog/${act.targetId}` :
                act.targetType === "Career" && act.targetId ? `/detailpage/${act.targetId}` : null;
              return (
                <div key={act._id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {cfg.label}
                        {act.targetName ? (
                          <span className="text-gray-500 font-normal"> — </span>
                        ) : ""}
                        {act.targetName && targetUrl ? (
                          <Link to={targetUrl} className="text-red-600 hover:text-red-700 font-medium hover:underline inline-flex items-center gap-0.5">
                            {act.targetName} <ExternalLink className="w-3 h-3 inline" />
                          </Link>
                        ) : act.targetName ? (
                          <span className="text-gray-500 font-normal">{act.targetName}</span>
                        ) : ""}
                      </p>
                      {act.metadata?.fee && (
                        <p className="text-xs text-gray-500 mt-0.5">Fee: ₹{Number(act.metadata.fee).toLocaleString()}</p>
                      )}
                      {act.metadata?.points && (
                        <p className="text-xs text-amber-600 mt-0.5">+{act.metadata.points} points</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        <Clock className="w-3 h-3 inline mr-0.5" />
                        {getTimeAgo(act.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {act.targetType && (
                        <span className="text-[10px] font-medium text-gray-400 uppercase bg-gray-50 px-2 py-0.5 rounded-full">
                          {act.targetType}
                        </span>
                      )}
                      {act.metadata?.points && (
                        <span className="text-xs font-bold text-amber-500">+{act.metadata.points}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
