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
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  ThumbsUp,
} from "lucide-react";
import HighRatedCareers from "../Components/HighRatedCareers";
import BlogComponent from "../Components/BlogComponent";
import BestRated from "../Components/BestRated";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";

// Function to fetch trending courses
const baseURL = import.meta.env.VITE_BASE_URL;

// Updated to accept filter parameters
const fetchTrendingCourses = async (categoryIds = []) => {
  try {
    // If we have selected categories, use them in the filter
    if (categoryIds.length > 0) {
      const response = await axios.get(
        `${baseURL}/courses?filters={"category":${JSON.stringify(categoryIds)}}`
      );
      return response.data;
    } else {
      // Otherwise fetch trending courses
      const response = await axios.get(
        `${baseURL}/courses?filters={"isCourseTrending":true}`
      );
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to fetch courses");
  }
};

// Function to fetch course categories
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${baseURL}/course-categories`, {
      params: {
        page: 0,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch course categories");
  }
};

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const TrendingCourses = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter states
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({}); // Map to store title-to-id mapping
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // Store IDs of selected categories
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch trending courses with React Query and selected category filter
  const { data, isLoading, isError, refetch } = useQuery(
    ["courses", selectedCategoryIds],
    () => fetchTrendingCourses(selectedCategoryIds),
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        const categoriesData = response.data.result;

        // Create a mapping of category titles to IDs
        const titleToIdMap = {};
        const extractedCategories = categoriesData.map((category) => {
          if (typeof category === "object") {
            const title = category.title || category.name;
            titleToIdMap[title] = category._id;
            return title;
          }
          return category;
        });

        setCategories(extractedCategories);
        setCategoryMap(titleToIdMap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Update category IDs when selected categories change
  useEffect(() => {
    const categoryIds = selectedCategories
      .map((title) => categoryMap[title])
      .filter((id) => id);
    setSelectedCategoryIds(categoryIds);
    setCurrentPage(1); // Reset to first page when changing filters
  }, [selectedCategories, categoryMap]);

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

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
            We couldn't retrieve the courses. Please try again later.
          </p>
          <button
            className="px-4 py-2 bg-[#b82025] text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const allCourses = data?.data?.result || [];

  // Filter courses based on search term only (category filtering is handled by API)
  const filteredCourses = allCourses.filter((course) => {
    return (
      course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.shortDescription &&
        course.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
    );
  });

  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedCategoryIds([]);
  };

  return (
    <>
      <div className="w-full max-w-[1420px] mx-auto p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Trending Courses</h1>
          <p className="text-xl">
            Discover trending Courses that can transform your academic journey
          </p>
        </div>

        {/* Mobile Filter Button */}
        <button
          className="mb-6 bg-[#b82025] text-white rounded-lg px-4 py-2 shadow-lg md:hidden flex items-center"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={16} className="mr-2" />
          Filters
        </button>

        {/* Mobile Filter Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-[1000] flex transition-opacity duration-300 ${
            isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`w-3/4 bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              className="text-gray-800 font-bold text-xl mb-4"
              onClick={() => setIsFilterOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-6">Filter by Category</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-2 border-2 border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="space-y-4">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="form-checkbox h-5 w-5 text-red-500"
                  />
                  <span className="text-base font-medium">{category}</span>
                </label>
              ))}
            </div>
          </div>
          <div
            className="flex-grow cursor-pointer"
            onClick={() => setIsFilterOpen(false)}
          ></div>
        </div>

        {/* Desktop Layout with Filters */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Desktop Sidebar Filter */}
          <div className="hidden md:block w-1/4 bg-white p-4 rounded-xl shadow-md sticky top-20 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Filter Courses</h3>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="mb-2 font-medium text-gray-700">Categories</div>
            <div className="flex flex-col gap-2 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="form-checkbox h-4 w-4 text-red-500 rounded"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No categories available</p>
              )}
            </div>
            {(selectedCategories.length > 0 || searchTerm) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-red-600 hover:text-red-800"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Course Grid */}
          <div className="w-full md:w-3/4">
            {currentCourses.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCourses.map((course) => {
                    const levelBadge = getLevelBadge(course.courseLevel);

                    return (
                      <Link
                        key={course._id}
                        to={`/coursesinfopage/${course?.slug}`}
                        className="group"
                      >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`${Images}/${course.coursePreviewThumbnail}`}
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

                                {/* {course.isCourseFree === "free" ? (
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
                                    ? `${course.courseDurationYears} Years `
                                    : ""}
                                  {course.courseDurationMonths > 0
                                    ? `${course.courseDurationMonths} months`
                                    : ""}{" "}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Course content */}
                          <div className="p-6">
                            <div className="space-y-4">
                              {/* Short description */}
                              <div className="text-gray-600 line-clamp-3 h-18">
                                {stripHtml(course.shortDescription || "")}
                              </div>

                              {/* Course info */}
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
                                  <Users
                                    size={16}
                                    className="mr-2 text-gray-500"
                                  />
                                  <span>{course.views || 0} views</span>
                                </div>
                              </div>

                              {/* Application dates if available */}
                              {/* {course.applicationStartDate ? (
                              <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="text-xs text-gray-500 mb-1">Application period:</div>
                                <div className="text-sm">
                                  <span className="font-medium">{formatDate(course.applicationStartDate)}</span>
                                  <span className="mx-2">-</span>
                                  <span className="font-medium">{formatDate(course.applicationEndDate)}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="border-t border-gray-100 pt-4 mt-4">
                                {/* Empty space - no text */}
                              {/* <div className="h-6"></div>
                              </div>
                            )} */}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Page numbers */}
                      <div className="flex space-x-1">
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`w-8 h-8 rounded-md text-sm ${
                              currentPage === index + 1
                                ? "bg-[#b82025] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Pagination info */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  {totalPages > 0
                    ? `Page ${currentPage} of ${totalPages} (${totalCourses} courses)`
                    : `${totalCourses} courses`}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any courses matching your filters.
                </p>
                <button
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        <HighRatedCareers />
        <BlogComponent />
        <BestRated />
      </div>
      <div className="flex gap-2 flex-col sm:flex-row items-center">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default TrendingCourses;
