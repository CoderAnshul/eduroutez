import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { Sparkles, ArrowRight, BookOpen, Award, Users } from "lucide-react";

// Function to fetch trending streams
const fetchTrendingStreams = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/trending-streams?page=1&limit=3`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trending streams");
  }
};

const TrendingStreams = () => {
  const { data, isLoading, isError } = useQuery(
    ["trendingStreams"],
    fetchTrendingStreams,
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  // Get stream card design by level
  const getStreamCardDesign = (level) => {
    switch (level?.toLowerCase()) {
      case "diploma":
        return {
          icon: <BookOpen className="w-5 h-5" />,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
          hoverBg: "hover:bg-[#b82025]",
          accentColor: "bg-[#b82025]",
        };
      case "bachelor":
        return {
          icon: <BookOpen className="w-5 h-5" />,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          hoverBg: "hover:bg-blue-500",
          accentColor: "bg-blue-500",
        };
      case "masters":
        return {
          icon: <Award className="w-5 h-5" />,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-100",
          hoverBg: "hover:bg-purple-500",
          accentColor: "bg-purple-500",
        };
      case "phd":
        return {
          icon: <Users className="w-5 h-5" />,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
          hoverBg: "hover:bg-green-500",
          accentColor: "bg-green-500",
        };
      default:
        return {
          icon: <BookOpen className="w-5 h-5" />,
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-100",
          hoverBg: "hover:bg-gray-500",
          accentColor: "bg-gray-500",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-[#b82025] rounded-full"></div>
          <div className="w-3 h-3 bg-[#b82025] rounded-full"></div>
          <div className="w-3 h-3 bg-[#b82025] rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-12 mb-2"
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
        <p>Error loading trending streams</p>
      </div>
    );
  }

  const trendingStreams = data?.data?.result || [];

  return (
    <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2">
          <Sparkles className="text-red-500 w-6 h-6" />
          <h3 className="text-xl font-bold">Popular Courses</h3>
        </div>
        <Link to="/trending-stream">
          <button className="bg-[#b82025] hover:bg-[#b82025] text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-md">
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingStreams.length > 0 ? (
          trendingStreams.map((item) => {
            const streamDetails = item.streamDetails[0] || {};
            const level = item._id.level;
            const design = getStreamCardDesign(level);
            const hasImage = !!item.image;

            return (
              <Link
                key={`${streamDetails._id}-${level}`}
                to={`/popularcourses?stream=${streamDetails._id}&level=${level}`}
                className="block group"
              >
                <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
                  {/* Image or decorative background */}
                  <div
                    className={`h-36 relative overflow-hidden ${
                      !hasImage ? design.bgColor : ""
                    }`}
                  >
                    {hasImage ? (
                      <img
                        src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${
                          item.image
                        }`}
                        alt={streamDetails.name || "Stream image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full flex items-center justify-center ${design.bgColor}`}
                      >
                        <div className={`p-8 ${design.color}`}>
                          {design.icon}
                        </div>
                      </div>
                    )}

                    {/* Level badge floating at bottom-right */}
                    <div className="absolute bottom-0 right-0 transform translate-y-1/2 mr-4">
                      <div
                        className={`${design.bgColor} ${design.color} ${design.borderColor} border rounded-full p-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        {design.icon}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pt-8 pb-6">
                    {/* Level indicator */}
                    <div className="mb-3">
                      <span
                        className={`text-xs font-semibold tracking-wider uppercase ${design.color}`}
                      >
                        {level?.charAt(0).toUpperCase() + level?.slice(1) ||
                          "Unknown Level"}
                      </span>
                    </div>

                    {/* Stream title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-red-500">
                      {streamDetails.name || "Unnamed Stream"}
                    </h3>

                    {/* Short description - placeholder text based on stream name */}
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {`Explore ${
                        streamDetails.name || "this stream"
                      } and discover comprehensive courses and resources designed to enhance your knowledge and skills.`}
                    </p>

                    {/* Explore button */}
                    <div className="flex items-center">
                      <button
                        className={`flex items-center ${design.color} ${design.bgColor} ${design.borderColor} border rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${design.hoverBg} hover:text-white`}
                      >
                        Explore Stream
                        <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600">No trending streams available.</p>
            <button className="mt-4 bg-red-50 text-red-500 py-2 px-6 rounded-lg border border-red-100 hover:bg-[#b82025] hover:text-white transition-colors">
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingStreams;
