import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ScheduleCallPopup from "../Components/DashboardComponent/ScheduleCallPopup";
import ReviewFeedbackPopup from "../Components/DashboardComponent/ReviewFeedbackPopup";
import { Link } from "react-router-dom";
import Promotions from "./CoursePromotions";
import DynamicSchedule from "../Components/DynamicSchedule";
const CounselorListPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [counselors, setCounselors] = useState([]);
  const [displayedCounselors, setDisplayedCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
  const [slotsPopupOpen, setSlotsPopupOpen] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [streams, setStreams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const inspirationalQuotes = [
    {
      quote:
        "Guidance is the compass that helps you navigate life's challenges.",
      author: "Unknown",
    },
    {
      quote: "Every great journey begins with a single conversation.",
      author: "Anonymous",
    },
    {
      quote: "Wisdom is found in the art of listening and understanding.",
      author: "Counseling Insight",
    },
  ];

  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0]);

  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam) {
      setSearchTerm(nameParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      const currentIndex = inspirationalQuotes.findIndex(
        (q) => q.quote === currentQuote.quote
      );
      const nextIndex = (currentIndex + 1) % inspirationalQuotes.length;
      setCurrentQuote(inspirationalQuotes[nextIndex]);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, [currentQuote]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleReviewFeedback = (counselor) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    setSelectedCounselor(counselor);
    setIsReviewPopupOpen(true);
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  useEffect(() => {
    fetchAllCounselors();
  }, [category]);

  const fetchAllCounselors = async () => {
    try {
      setLoading(true);
      let endpoint = `${VITE_BASE_URL}/counselors`;

      if (category) {
        endpoint = `${VITE_BASE_URL}/counselors-by-category`;
        const response = await axios.post(endpoint, { category });
        setCounselors(response.data.data || []);
      } else {
        const response = await axios.get(endpoint);
        setCounselors(response.data.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching counselors:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axios.get(`${VITE_BASE_URL}/streams`);
        setStreams(response.data.data.result || []);
      } catch (error) {
        console.error("Error fetching streams:", error.message);
      }
    };

    fetchStreams();
  }, []);

  useEffect(() => {
    let filtered = [...counselors];

    if (selectedStreams.length > 0) {
      filtered = filtered.filter(
        (counselor) =>
          counselor &&
          counselor.category &&
          selectedStreams.includes(counselor.category)
      );
    }

    if (searchTerm) {
      try {
        const regex = new RegExp(searchTerm, "i");
        filtered = filtered.filter(
          (counselor) =>
            regex.test(counselor.firstname + " " + counselor.lastname) ||
            regex.test(counselor.firstname) ||
            regex.test(counselor.lastname) ||
            regex.test(counselor.category) ||
            regex.test(counselor.language) ||
            regex.test(counselor.level)
        );
      } catch (e) {
        filtered = filtered.filter(
          (counselor) =>
            counselor.firstname
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            counselor.lastname
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            counselor.category
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            counselor.language
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            counselor.level?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedCounselors(filtered.slice(startIndex, endIndex));
  }, [counselors, selectedStreams, searchTerm, page]);

  const handleStreamChange = (stream) => {
    if (!stream) return;
    setSelectedStreams((prev) =>
      prev.includes(stream)
        ? prev.filter((str) => str !== stream)
        : [...prev, stream]
    );
    setPage(1);
  };

  const handleScheduleCall = (counselor) => {
    setSelectedCounselor(counselor || null);
    setIsCallPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="mb-12 text-center">
          <div className="animate-fade-in-out">
            <blockquote className="text-2xl md:text-3xl font-light text-gray-700 italic mb-4">
              "{currentQuote.quote}"
            </blockquote>
            <p className="text-lg text-gray-500">— {currentQuote.author}</p>
          </div>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              placeholder="Search counselors by name, category, language, or level..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <i className="fa fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div className="flex">
          <div className="hidden md:block w-1/4">
            <div className=" bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Filter by Stream</h3>
              <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3">
                {streams.map((stream) => (
                  <label
                    key={stream._id}
                    className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={stream.name}
                      checked={selectedStreams.includes(stream.name)}
                      onChange={() => handleStreamChange(stream.name)}
                    />
                    {stream.name}
                  </label>
                ))}
              </div>
          </div>
              <Promotions
                location="COUNSELING_PAGE_SIDEBAR"
                className="h-[250px] w-fit "
              />
          </div>

          <div className="w-full md:w-3/4 md:pl-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent  animate-spin"></div>
              </div>
            ) : (
              <>
                {displayedCounselors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedCounselors.map((counselor, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-2 md:p-6">
                          <div className="flex gap-6">
                            {counselor.profilePhoto ? (
                              <img
                                src={`${Images}/${counselor.profilePhoto.replace(
                                  "uploads/",
                                  ""
                                )}`}
                                alt={`${counselor.firstname} ${counselor.lastname}`}
                                className="h-32 w-32 object-cover shadow-sm"
                              />
                            ) : (
                              <div className="h-32 w-32 bg-gray-50 flex items-center justify-center">
                                <svg
                                  className="h-12 w-12 text-gray-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  />
                                </svg>
                              </div>
                            )}

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-gray-900">
                                  {counselor.firstname} {counselor.lastname}
                                </h2>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <svg
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <=
                                          Math.floor(
                                            calculateAverageRating(
                                              counselor.reviews
                                            )
                                          )
                                            ? "text-yellow-400"
                                            : "text-gray-200"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    ({counselor.reviews?.length || 0})
                                  </span>
                                </div>
                              </div>

                              <span className="text-gray-600 mb-4">{counselor?.about}</span>

                              <div className="space-y-2.5 mt-4">
                                {counselor?.language && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 text-red-500 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                      />
                                    </svg>
                                    <span>{counselor.language}</span>
                                  </div>
                                )}

                                {[
                                  counselor?.country,
                                  counselor?.state?.name,
                                  counselor?.city?.name,
                                ].some(Boolean) && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 text-red-500 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <span>
                                      {[
                                        counselor?.country?.name,
                                        counselor?.state?.name,
                                        counselor?.city?.name,
                                      ]
                                        .filter(Boolean)
                                        .join(" | ")}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center text-sm text-gray-600">
                                  <svg
                                    className="w-4 h-4 text-green-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span>Level: {counselor.level}</span>

                                  <button className="border-red-600 border-2 rounded-lg px-2 py-1 ml-2">
                                    <span className="">Counsellor</span>
                                  </button>
                                </div>

                           


                                {counselor.ExperienceYear && (
                                  <div className="flex items-center gap-4 font-bold text-sm text-gray-600">
                                    <div className="flex items-center">
                                      <svg
                                        className="w-4 h-4 text-purple-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <span>
                                        {" "}
                                        Experience:{
                                          counselor.ExperienceYear
                                        }{" "}
                                        years
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <svg
                                        className="w-4 h-4 text-indigo-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                      </svg>
                                      <span>
                                        Counselling:{counselor.schedules}{" "}
                                        Sessions
                                      </span>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center text-sm text-gray-600">
                                  <svg
                                    className="w-4 h-4 text-blue-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                  <span>
                                    Available on{" "}
                                    {new Date().toLocaleDateString("en-US", {
                                      weekday: "long",
                                    })}{" "}
                                    {
                                      <DynamicSchedule
                                        slots={counselor?.slots}
                                      />
                                    }
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-3 mt-6">
                                <button
                                  onClick={() => handleScheduleCall(counselor)}
                                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                  </svg>
                                  Schedule Call
                                </button>
                                <button
                                  onClick={() =>
                                    handleReviewFeedback(counselor)
                                  }
                                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                  </svg>
                                  Review Feedback
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className=" w-full flex flex-col   justify-center gap-2 items-center h-80">
                    <h2 className="text-xl font-semibold text-red-600">No Counselor Found</h2>
                    <h2 className="w-[50%] max-sm:w-full text-center">
                      The requested counselor could not be found. Please check
                      counselor name and try again.
                    </h2>
                  </div>
                )}

                {displayedCounselors.length > 0 && (
                  <div className="mt-8 mb-8 flex justify-center">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="mx-2 px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="mx-4 py-2">Page {page}</span>
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={displayedCounselors.length < itemsPerPage}
                      className="mx-2 px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Promotions location="COUNSELING_PAGE_MAIN" className="h-[90px]" />
      </div>

      {showLoginPopup && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="popup bg-white p-12 m-20s rounded-lg shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 w-1/3">
            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
              Hey there! We'd love to hear your thoughts. Please log in to share
              your review with us and help others make informed decisions.
            </h3>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleLoginPopupClose}
                className="bg-gray-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none"
              >
                Close
              </button>
              <Link
                to="/login"
                onClick={handleLoginPopupClose}
                className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-red-700 focus:outline-none"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}

      <ScheduleCallPopup
        isOpen={isCallPopupOpen}
        onClose={() => {
          setIsCallPopupOpen(false);
          setSelectedCounselor(null);
        }}
        counselor={selectedCounselor}
      />
      <ReviewFeedbackPopup
        isOpen={isReviewPopupOpen}
        onClose={() => {
          setIsReviewPopupOpen(false);
          setSelectedCounselor(null);
        }}
        counselor={selectedCounselor}
      />
    </div>
  );
};

export default CounselorListPage;
