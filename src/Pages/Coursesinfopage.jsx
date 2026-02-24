import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoursesName from "../Ui components/CoursesName";
import TabSlider from "../Ui components/TabSlider";
import { getCoursesById } from "../ApiFunctions/api";
import axiosInstance from "../ApiFunctions/axios";
import SocialShare from "../Components/SocialShare";

// Lazy loaded components
const QueryForm = lazy(() => import("../Ui components/QueryForm"));
const ProsandCons = lazy(() => import("../Ui components/ProsandCons"));
const BestRated = lazy(() => import("../Components/BestRated"));
const Events = lazy(() => import("../Components/Events"));
const ConsellingBanner = lazy(() => import("../Components/ConsellingBanner"));
const HighRatedCareers = lazy(() => import("../Components/HighRatedCareers"));
const BlogComponent = lazy(() => import("../Components/BlogComponent"));
const Promotions = lazy(() => import("../Pages/CoursePromotions"));
const CourseReviewForm = lazy(() => import("../Components/CourseReviewForm"));

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className="flex justify-center items-center py-6">
    <div className="animate-pulse w-full h-32 bg-gray-200 rounded-md"></div>
  </div>
);

const tabs = [
  "Overview",
  "Eligibility",
  "Curriculum",
  "Fees",
  "Opportunities",
  "Application",
  "Reviews",
];

const Coursesinfopage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = tabs.map(() => useRef(null));
  const [isLiked, setIsLiked] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isError, setIsError] = useState(false);

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem("userId");
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  // Initialize courseIdMap from localStorage
  useEffect(() => {
    if (!window.courseIdMap) {
      try {
        const storedCourseIdMap = JSON.parse(
          localStorage.getItem("courseIdMap") || "{}"
        );
        window.courseIdMap = storedCourseIdMap;
      } catch (error) {
        console.error("Error initializing courseIdMap:", error);
        window.courseIdMap = {};
      }
    }
  }, []);

  // Combined fetch function for course data
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);

    const fetchCourseData = async () => {
      try {
        // First, determine if we're dealing with an ID or a slug
        const isSlug = isNaN(parseInt(id)) || id.includes("-");

        // Try to get course data - with fallback mechanisms
        let response;
        let courseId = id;

        if (isSlug) {
          // Try to get the ID from courseIdMap
          const mappedId = window.courseIdMap?.[id];

          if (mappedId) {
            // We found the ID in the map, use it
            courseId = mappedId;
            const result = await getCoursesById(courseId);
            response = result;
          } else {
            // If courseIdMap doesn't exist or doesn't have the slug,
            // we need to get the course directly by its slug through a custom API call
            try {
              const result = await getCoursesById(courseId);
              response = result;

              // If we got a response, grab the ID for future use
              if (response && response.data) {
                courseId = response.data._id;

                // Save this slug -> ID mapping to both window and localStorage
                window.courseIdMap = window.courseIdMap || {};
                window.courseIdMap[id] = courseId;
                localStorage.setItem(
                  "courseIdMap",
                  JSON.stringify(window.courseIdMap)
                );
              }
            } catch (slugError) {
              console.error("Error fetching course by slug:", slugError);

              // As a final fallback, try using the course ID API
              const result = await getCoursesById(id);
              response = result;
            }
          }
        } else {
          // It's an ID, use it directly
          const result = await getCoursesById(courseId);
          response = result;

          // If the course has a slug, we should save that mapping too
          if (response && response.data && response.data.slug) {
            const slug = response.data.slug;
            window.courseIdMap = window.courseIdMap || {};
            window.courseIdMap[slug] = courseId;
            localStorage.setItem(
              "courseIdMap",
              JSON.stringify(window.courseIdMap)
            );
          }
        }

        if (!response || !response.data) {
          if (isMounted) {
            setIsError(true);
            setIsLoading(false);
          }
          return;
        }

        if (isMounted) {
          setCourseData(response);
          // Check if user has already liked this course
          if (response.data.likes && currentUserId) {
            const userHasLiked = response.data.likes.includes(currentUserId);
            setIsLiked(userHasLiked);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchCourseData();

    return () => {
      isMounted = false;
    };
  }, [id, currentUserId]);

  // Handle intersection observer for lazy loading sections
  useEffect(() => {
    if (!courseData) return;

    // Create an Intersection Observer to watch when sections come into view
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Find which tab this section belongs to
          const index = sectionRefs.findIndex(ref => 
            ref.current === entry.target
          );
          
          if (index !== -1) {
            setActiveTab(index);
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all section refs that exist
    sectionRefs.forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    
    return () => {
      // Clean up observer when component unmounts
      sectionRefs.forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [courseData, sectionRefs]);

  const handleLike = async () => {
    if (!currentUserId) {
      setShowLoginPopup(true);
      return;
    }

    try {
      const courseId = courseData.data._id;
      const likeValue = isLiked ? "0" : "1"; // Toggle like value

      // Optimistically update state
      setIsLiked(!isLiked);

      // Update the likes count locally
      setCourseData((prevData) => ({
        ...prevData,
        data: {
          ...prevData.data,
          likes: isLiked
            ? prevData.data.likes.filter((id) => id !== currentUserId) // Remove user ID
            : [...prevData.data.likes, currentUserId], // Add user ID
        },
      }));

      // Call the API to update like status
      await axiosInstance.post(
        `${baseURL}/like-dislike`,
        {
          id: courseId,
          type: "course",
          like: likeValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        }
      );
    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert the UI change in case of error
      setIsLiked((prev) => !prev);
    }
  };

  // Handle redirect to login page
  const handleRedirectToLogin = () => {
    setShowLoginPopup(false);
    navigate("/login", { state: { returnUrl: window.location.pathname } });
  };

  // Close the login popup
  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Memoized HTML renderer
  const renderHTML = React.useMemo(() => (htmlContent) => {
    if (!htmlContent)
      return <p className="text-gray-500">No content available</p>;
    return (
      <div className="text-base prose prose-gray max-w-full">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        <style jsx>{`
          ul {
            list-style-type: disc;
            margin-left: 1.5rem;
          }
          li {
            margin-bottom: 0.5rem;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1rem;
            color: #1a202c;
          }
          h1 {
            font-size: 2.25rem;
            font-weight: 700;
            line-height: 1.3;
          }
          h2 {
            font-size: 1.875rem;
            font-weight: 700;
            line-height: 1.3;
          }
          h3 {
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.3;
          }
          h4 {
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.3;
          }
          h5 {
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.3;
          }
          h6 {
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1.3;
          }
          a {
            color: blue;
          }
        `}</style>
      </div>
    );
  }, []);

  if (!id) {
    return (
      <div className="flex justify-center items-center h-screen">
        Invalid course ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-64 bg-gray-200 rounded w-full max-w-3xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !courseData?.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading course data.
      </div>
    );
  }

  const content = courseData.data;

  // Calculate number of likes
  const likesCount = content.likes?.length || 0;

  return (
    <>
      <div className="container max-w-[1300px] mx-auto px-8 py-6 flex flex-col items-start bg-gray-50">
        {/* Course Title */}
        <div className="flex justify-between items-center w-full">
          <CoursesName content={content.courseTitle || "Untitled Course"} />
          <div className="flex items-center gap-4">
            {/* Views Counter */}
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="font-medium">{content.views || 0}</span>
            </div>

            <SocialShare
              title={content.courseTitle}
              url={window.location.href}
              contentType="course"
              className=" !top-full -left-44"
            />
          </div>

          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 border
                ${
                  isLiked
                    ? "bg-yellow-100 text-yellow-600 border-yellow-300 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                } focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
          >
            {/* Thumb SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={`transition-transform duration-300 ${
                isLiked ? "scale-110" : ""
              }`}
              fill={isLiked ? "#F59E0B" : "none"}
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 10h4v10H2z"></path>
              <path d="M6 10v10h9.7c1.2 0 2.2-.9 2.4-2l1.3-7c.2-1.1-.6-2-1.7-2H12c-.5 0-1-.4-1-1V4.5c0-1.3-1-2.5-2.5-2.5S6 3.2 6 4.5V10z"></path>
            </svg>

            {/* Like Count */}
            <span className="font-medium text-sm">
              {likesCount > 0 ? likesCount : "Like"}
            </span>
          </button>
        </div>

        {/* Tab Slider */}
        <TabSlider tabs={tabs} sectionRefs={sectionRefs} activeTab={activeTab} />

        {/* Main Content Area with Sidebar */}
        <div className="w-full mt-5 flex gap-8 pb-4">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Overview Section */}
            {content.courseOverview && (
              <div
                ref={sectionRefs[0]}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h4 className="text-2xl font-semibold text-red-500 mb-4">
                  Overview
                </h4>
                {renderHTML(content.courseOverview)}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <p>
                    {(content.courseDurationYears ||
                      content.courseDurationMonths) && (
                      <>
                        <strong>Duration: </strong>
                        {[
                          content.courseDurationYears > 0 &&
                            `${content.courseDurationYears} years`,
                          content.courseDurationMonths > 0 &&
                            `${content.courseDurationMonths} months`,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </>
                    )}
                  </p>
                  <p>
                    <strong>Category:</strong>{" "}
                    {content.category?.title || "Not specified"}
                  </p>
                </div>
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">Short Description</h5>
                  {renderHTML(content.shortDescription)}
                  <h5 className="font-semibold mb-2 mt-4">Long Description</h5>
                  {renderHTML(content.longDescription)}
                </div>
              </div>
            )}

            {/* Eligibility Section */}
            {content.courseEligibility && (
              <div
                ref={sectionRefs[1]}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h4 className="text-2xl font-semibold text-red-500 mb-4">
                  Eligibility
                </h4>
                {renderHTML(content.courseEligibility)}
                <div className="mt-4">
                  <h5 className="font-semibold mb-2">General Eligibility</h5>
                  <p className="text-gray-700">
                    {content.eligibility || "Not specified"}
                  </p>
                  <h5 className="font-semibold mb-2 mt-4">Cut Off</h5>
                  <p className="text-gray-700">
                    {content.cutOff || "Not specified"}
                  </p>
                  <h5 className="font-semibold mb-2 mt-4">Exams Accepted</h5>
                  <p className="text-gray-700">
                    {content.examAccepted || "Not specified"}
                  </p>
                </div>
              </div>
            )}

            {/* Curriculum Section */}
            {content.courseCurriculum && (
              <div
                ref={sectionRefs[2]}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h4 className="text-2xl font-semibold text-red-500 mb-4">
                  Curriculum
                </h4>
                {renderHTML(content.courseCurriculum)}
              </div>
            )}

            {/* Fees Section */}
            {content.courseFee && (
              <div
                ref={sectionRefs[3]}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h4 className="text-2xl font-semibold text-red-500 mb-4">
                  Course Fees
                </h4>
                {renderHTML(content.courseFee)}
              </div>
            )}

            {/* Promotions Section */}
            <Suspense fallback={<LoadingComponent />}>
              <Promotions location="COURSES_PAGE" />
            </Suspense>

            {/* Opportunities Section */}
            {content.courseOpportunities && (
              <div
                ref={sectionRefs[4]}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h4 className="text-2xl font-semibold text-red-500 mb-4">
                  Career Opportunities
                </h4>
                {renderHTML(content.courseOpportunities)}
              </div>
            )}

            {/* Application Section */}
            {(content.applicationStartDate || content.applicationEndDate) && (
              <div
                ref={sectionRefs[5]}
                className="bg-white shadow-md rounded-lg p-6 mb-6"
              >
                <h4 className="text-2xl font-semibold text-red-500 mb-4">
                  Application Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>Application Start Date:</strong>
                  </p>
                  <p>{formatDate(content.applicationStartDate)}</p>
                  <p>
                    <strong>Application End Date:</strong>
                  </p>
                  <p>{formatDate(content.applicationEndDate)}</p>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div ref={sectionRefs[6]} id="reviews" className="mb-6">
              <Suspense fallback={<LoadingComponent />}>
                <CourseReviewForm course={content} />
              </Suspense>
            </div>

            {/* Pros and Cons */}
            <div className="mb-6">
              <Suspense fallback={<LoadingComponent />}>
                <ProsandCons course={content} />
              </Suspense>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:w-1/3 space-y-6">
            <Suspense fallback={<LoadingComponent />}>
              <QueryForm />
            </Suspense>
          </div>
        </div>

        {/* Additional Sections */}
        <Suspense fallback={<LoadingComponent />}>
          <HighRatedCareers />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <BlogComponent />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <BestRated />
        </Suspense>
      </div>

      <div className="w-full flex items-start mt-10">
        <Suspense fallback={<LoadingComponent />}>
          <Events />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <ConsellingBanner />
        </Suspense>
      </div>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Login Required
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="text-gray-600 mb-6">
              <p>
                You need to be logged in to like this Course. Would you like to
                log in now?
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRedirectToLogin}
                className="px-4 py-2 bg-[#b82025] text-white rounded-md hover:bg-[#b82025] transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Coursesinfopage;