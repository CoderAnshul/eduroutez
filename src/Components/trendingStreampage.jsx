import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { Sparkles, ArrowRight, BookOpen, Award, Users } from "lucide-react";

import BlogComponent from "../Components/BlogComponent";
import HighRatedCareers from "../Components/HighRatedCareers";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";

// Function to fetch trending streams
const fetchTrendingStreams = async (page) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/trending-streams?page=${page}&limit=9`
    );
    console.log("Trending Streams:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trending streams");
  }
};

const TrendingStreams = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery(
    ["trendingStreams", page],
    () => fetchTrendingStreams(page),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  // Get stream card design by level - for fallback when no image is available
  const getStreamCardDesign = (level) => {
    switch (level?.toLowerCase()) {
      case "bachelor":
        return {
          icon: <BookOpen className="w-5 h-5" />,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          hoverBg: "hover:bg-blue-500",
          accentColor: "bg-blue-500",
        };
      case "master":
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
      case "diploma":
        return {
          icon: <Sparkles className="w-5 h-5" />,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-100",
          hoverBg: "hover:bg-orange-500",
          accentColor: "bg-orange-500",
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
    <>
      <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Trending Streams</h1>
          <p className="text-xl">
            Discover trending streams to opt for and enhance your knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingStreams.length > 0 ? (
            trendingStreams.map((item) => {
              const streamDetails = item.streamDetails[0] || {};
              const level = item._id.level;
              const design = getStreamCardDesign(level);
              const hasImage = !!item.image;
              const imageUrl = hasImage
                ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${item.image}`
                : null;

              return (
                <Link
                  key={`${streamDetails._id}-${level}`}
                  to={`/popularcourses?stream=${streamDetails._id}&level=${level}`}
                  className="block group"
                >
                  <div className="h-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1">
                    {/* Image or Pattern Header */}
                    <div
                      className={`h-36 relative overflow-hidden ${
                        hasImage ? "" : design.bgColor
                      }`}
                    >
                      {hasImage ? (
                        <img
                          src={imageUrl}
                          alt={streamDetails.name || "Stream image"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        // Fallback to pattern design if no image
                        <div className="absolute inset-0 opacity-10">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              className={design.color}
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="30"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              className={design.color}
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              className={design.color}
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              className={design.color}
                            />
                          </svg>
                        </div>
                      )}

                      {/* Level badge floating at right */}
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

                      {/* Course count */}
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page <= 1}
            className="bg-[#b82025] text-white py-2 px-4 rounded-l-lg hover:bg-red-700 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="bg-gray-100 text-gray-800 py-2 px-4 font-medium">
            Page {page} of {data?.data?.totalPages || 1}
          </span>

          <button
            onClick={() =>
              setPage((old) => (old < data?.data?.totalPages ? old + 1 : old))
            }
            disabled={!data || page >= data?.data?.totalPages}
            className="bg-[#b82025] text-white py-2 px-4 rounded-r-lg hover:bg-red-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <BlogComponent />
      <HighRatedCareers />

      <div className="flex gap-4 flex-col sm:flex-row">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default TrendingStreams;
