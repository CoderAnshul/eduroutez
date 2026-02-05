import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import {
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  ThumbsUp,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const Images = import.meta.env.VITE_IMAGE_BASE_URL;

// Function to fetch trending courses
const fetchTrendingCourses = async () => {
  try {
    const response = await axios.get(
      `${baseURL}/courses?filters={"isCourseTrending":true}&limit=3`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trending courses");
  }
};

const TrendingCourses = () => {
  const [courseIdMap, setCourseIdMap] = useState({});

  // Initialize courseIdMap from localStorage
  useEffect(() => {
    try {
      const storedCourseIdMap = JSON.parse(
        localStorage.getItem("courseIdMap") || "{}"
      );
      window.courseIdMap = storedCourseIdMap;
      setCourseIdMap(storedCourseIdMap);
    } catch (error) {
      console.error("Error loading courseIdMap from localStorage:", error);
      window.courseIdMap = {};
    }
  }, []);

  const { data, isLoading, isError } = useQuery(
    ["trendingCourses"],
    fetchTrendingCourses,
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const { result } = data?.data || {};
        if (result && result.length > 0) {
          // Update courseIdMap
          const updatedCourseIdMap = { ...window.courseIdMap };

          result.forEach((course) => {
            if (course.slug) {
              updatedCourseIdMap[course.slug] = course._id;
            } else if (course.courseTitle) {
              // Create a slug from the course title if one doesn't exist
              const slug = course.courseTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

              updatedCourseIdMap[slug] = course._id;

              // Add slug to the course object for use in the component
              course.slug = slug;
            }
          });

          // Save to window and localStorage
          window.courseIdMap = updatedCourseIdMap;
          localStorage.setItem(
            "courseIdMap",
            JSON.stringify(updatedCourseIdMap)
          );
          setCourseIdMap(updatedCourseIdMap);
        }
      },
    }
  );

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get course level badge design
  const getLevelBadge = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return {
          color: "bg-emerald-100 text-emerald-700",
          label: "Beginner",
        };
      case "intermediate":
        return {
          color: "bg-amber-100 text-amber-700",
          label: "Intermediate",
        };
      case "advanced":
        return {
          color: "bg-red-100 text-red-700",
          label: "Advanced",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          label: "All Levels",
        };
    }
  };

  // Clean HTML content
  const stripHtml = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Trending Courses</h2>
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 p-8 rounded-xl text-center">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Unable to Load Courses</h3>
          <p className="mb-4">
            We couldn't retrieve the trending courses. Please try again later.
          </p>
          <button className="px-4 py-2 bg-[#b82025] text-white rounded-lg hover:bg-red-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const trendingCourses = data?.data?.result || [];

  return (
    <div className="w-full max-w-[1420px] mx-auto p-2 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3 max-sm:space-x-0">
          <TrendingUp className="text-gray-700 w-6 h-6 block max-sm:hidden" />
          <h2 className="text-2xl font-bold text-red-600">Trending Courses</h2>
        </div>
        <Link to="/trendingCourses">
          <button className="bg-[#b82025] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-all shadow-md">
            <span className="whitespace-nowrap">View All</span>
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>

      {trendingCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingCourses.map((course) => {
            const levelBadge = getLevelBadge(course.courseLevel);
            const slug =
              course.slug ||
              course.courseTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");

            return (
              <Link
                key={course._id}
                to={`/coursesinfopage/${slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        course.coursePreviewThumbnail
                          ? `${Images}/${course.coursePreviewThumbnail}`
                          : "/api/placeholder/400/240"
                      }
                      alt={course.courseTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div
                          className={`${levelBadge.color} text-xs font-semibold px-3 py-1 rounded-full`}
                        >
                          {levelBadge.label}
                        </div>
                        {/*                         
                        {course.isCourseFree === "free" ? (
                          <div className="bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-full">
                            Free
                          </div>
                        ) : (
                          <div className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                            Paid
                          </div>
                        )} */}
                      </div>

                      <div>
                        <h3 className="text-white text-xl font-bold line-clamp-2 drop-shadow-md">
                          {course.courseTitle}
                        </h3>
                        <div className="flex items-center mt-2 text-white text-opacity-90 text-sm drop-shadow-md">
                          <Clock size={14} className="mr-1" />

                          {course.courseDurationYears > 0
                            ? `${course.courseDurationYears} Years`
                            : ""}

                          {course.courseDurationMonths > 0
                            ? `${course.courseDurationMonths} months`
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course content */}
                  <div className="p-6">
                    <div className="space-y-4 px-2 pt-3">
                      {/* Short description */}
                      <div className="text-gray-600 line-clamp-3 h-18">
                        {stripHtml(course.shortDescription || "")}
                      </div>

                      <div className="flex w-full justify-between gap-3 pt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          {course.likes?.length > 0 && (
                            <>
                              <ThumbsUp
                                size={16}
                                className="mr-2 text-gray-500"
                              />
                              <span>{course.likes?.length}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Users size={16} className="mr-2 text-gray-500" />
                          <span>{course.views || 0} views</span>
                        </div>
                      </div>

                      {/* Application dates if available */}
                      {/* {course.applicationStartDate ? ( */}
                      {/* //   <div className="border-t border-gray-100 pt-4 mt-4">
                      //     <div className="text-xs text-gray-500 mb-1">Application period:</div>
                      //     <div className="text-sm">
                      //       <span className="font-medium">{formatDate(course.applicationStartDate)}</span>
                      //       <span className="mx-2">-</span>
                      //       <span className="font-medium">{formatDate(course.applicationEndDate)}</span>
                      //     </div>
                      //   </div>
                      // ) : (
                      //   <div className="border-t border-gray-100 pt-4 mt-4">
                      //     {/* Empty space - no text */}
                      {/* //     <div className="h-6"></div>
                      //   </div> */}
                    </div>

                    {/* Action button */}
                    <div className="mt-6">
                      <div className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center group-hover:bg-[#b82025] group-hover:text-white transition-colors">
                        <span>View Course</span>
                        <ArrowRight
                          size={16}
                          className="ml-2 transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default TrendingCourses;
