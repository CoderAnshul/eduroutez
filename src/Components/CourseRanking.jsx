import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Trophy, Medal, TrendingUp, ThumbsUp, Eye, BookOpen, ArrowRight, Clock, Star, Flame } from "lucide-react";
import WishlistButton from "./WishlistButton";

const baseURL = import.meta.env.VITE_BASE_URL;
const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const rankColors = [
  "bg-yellow-400 text-yellow-900", "bg-gray-300 text-gray-700", "bg-amber-600 text-white",
  "bg-red-50 text-red-600", "bg-red-50 text-red-600", "bg-red-50 text-red-600",
  "bg-red-50 text-red-600", "bg-red-50 text-red-600", "bg-red-50 text-red-600", "bg-red-50 text-red-600",
];

const rankIcons = [Trophy, Medal, Medal];

const CourseRanking = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanked = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/courses?filters={"isCourseTrending":true}&limit=10`);
        const scored = (res.data?.data?.result || res.data?.result || [])
          .filter((c) => c.courseTitle)
          .map((c) => ({
            ...c,
            popularityScore: (c.views || 0) + (c.likes?.length || 0) * 5 + (c.isCourseTrending ? 50 : 0),
          }))
          .sort((a, b) => b.popularityScore - a.popularityScore);
        setCourses(scored);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRanked();
  }, []);

  const maxScore = useMemo(() => (courses.length ? courses[0].popularityScore : 1), [courses]);

  if (loading) {
    return (
      <div className="w-full max-w-[1420px] mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-lg" />
          <div className="h-7 bg-gray-200 animate-pulse rounded w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!courses.length) return null;

  return (
    <div className="w-full max-w-[1420px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Popular Courses Ranking</h2>
        </div>
        <Link to="/trendingcourses" className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {courses.map((course, index) => {
          const RankIcon = rankIcons[index] || null;
          const isTop3 = index < 3;
          return (
            <Link
              key={course._id}
              to={`/coursesinfopage/${course.slug || course._id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex items-stretch"
            >
              {/* Rank badge */}
              <div className={`w-12 flex flex-col items-center justify-center shrink-0 ${isTop3 ? "bg-gradient-to-b from-amber-400 to-orange-500" : "bg-gray-100"}`}>
                {RankIcon ? (
                  <RankIcon className={`w-5 h-5 ${isTop3 ? "text-white" : "text-gray-400"}`} />
                ) : (
                  <span className={`text-lg font-bold ${isTop3 ? "text-white" : "text-gray-400"}`}>{index + 1}</span>
                )}
              </div>

              {/* Thumbnail */}
              <div className="w-24 h-24 shrink-0 overflow-hidden">
                <img
                  src={course.coursePreviewThumbnail ? `${Images}/${course.coursePreviewThumbnail}` : "https://placehold.co/96x96?text=Course"}
                  alt={course.courseTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-1">{course.courseTitle}</h3>
                {course.shortDescription && (
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{course.shortDescription.replace(/<[^>]*>/g, "").slice(0, 60)}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Flame className="w-3 h-3" /> Trending
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <ThumbsUp className="w-3 h-3" /> {course.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" /> {course.courseDurationYears ? `${course.courseDurationYears}y` : ""}{course.courseDurationMonths ? ` ${course.courseDurationMonths}m` : ""}
                  </span>
                </div>
              </div>

              {/* Score bar & Wishlist */}
              <div className="w-24 shrink-0 flex flex-col items-center justify-center gap-1.5 pr-3">
                <WishlistButton type="course" id={course._id} size={3.5} className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full" />
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isTop3 ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-red-400"}`}
                    style={{ width: `${(course.popularityScore / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-[9px] text-gray-400 font-medium">{course.popularityScore} pts</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CourseRanking;
