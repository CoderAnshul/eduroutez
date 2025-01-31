import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ScheduleCallPopup from '../Components/DashboardComponent/ScheduleCallPopup';
import ReviewFeedbackPopup from '../Components/DashboardComponent/ReviewFeedbackPopup';

const CounselorListPage = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [limit] = useState(6);
    const [selectedStreams, setSelectedStreams] = useState([]);
    const [streams, setStreams] = useState([]);

    console.log('category', streams);

    const inspirationalQuotes = [
        {
            quote: "Guidance is the compass that helps you navigate life's challenges.",
            author: "Unknown"
        },
        {
            quote: "Every great journey begins with a single conversation.",
            author: "Anonymous"
        },
        {
            quote: "Wisdom is found in the art of listening and understanding.",
            author: "Counseling Insight"
        }
    ];

    const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0]);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            const currentIndex = inspirationalQuotes.findIndex(q => q.quote === currentQuote.quote);
            const nextIndex = (currentIndex + 1) % inspirationalQuotes.length;
            setCurrentQuote(inspirationalQuotes[nextIndex]);
        }, 5000);

        return () => clearInterval(quoteInterval);
    }, [currentQuote]);

    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    // Reset counselors and page when category changes
    useEffect(() => {
        setCounselors([]);
        setPage(1);
        setHasMore(true);
        fetchCounselors(1);
    }, [category]);

    const fetchCounselors = async (currentPage) => {
        try {
            setLoading(true);
            let endpoint = `${VITE_BASE_URL}/counselors`;
            let params = {
                page: currentPage,
                limit
            };

            // If category is present, use the category-specific endpoint
            if (category) {
                endpoint = `${VITE_BASE_URL}/counselors-by-category`;
                params = {};
                const body = {
                    category
                };
                const response = await axios.post(endpoint, body, { params });
                const newCounselors = response.data.data || [];
                
                if (newCounselors.length < limit) {
                    setHasMore(false);
                }

                setCounselors(prevCounselors => 
                    currentPage === 1 ? newCounselors : [...prevCounselors, ...newCounselors]
                );
                return;
            }

            const response = await axios.get(endpoint, { params });
            const newCounselors = response.data.data.result || [];
            
            if (newCounselors.length < limit) {
                setHasMore(false);
            }

            setCounselors(prevCounselors => 
                currentPage === 1 ? newCounselors : [...prevCounselors, ...newCounselors]
            );
        } catch (error) {
            console.error('Error fetching counselors:', error.message);
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
                console.error('Error fetching streams:', error.message);
            }
        };

        fetchStreams();
    }, []);

    const loadMoreCounselors = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCounselors(nextPage);
    };

    const handleScheduleCall = (counselor) => {
        setSelectedCounselor(counselor || null);
        setIsCallPopupOpen(true);
    };

    const handleReviewFeedback = (counselor) => {
        setSelectedCounselor(counselor);
        setIsReviewPopupOpen(true);
    };

    const handleStreamChange = (stream) => {
        if (!stream) return;
        setSelectedStreams((prev) =>
            prev.includes(stream)
                ? prev.filter((str) => str !== stream)
                : [...prev, stream]
        );
    };

    const filteredCounselors = selectedStreams.length > 0
        ? counselors.filter((counselor) =>
            counselor && counselor.category && selectedStreams.includes(counselor.category)
        )
        : counselors;

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

                <div className="flex">
                    {/* Left Sidebar */}
                    <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
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

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 pl-6">
                        {loading && counselors.length === 0 ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredCounselors.map((counselor, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center mb-4">
                                                {counselor.profilePhoto ? (
                                                    <img
                                                        src={counselor.profilePhoto}
                                                        alt={`${counselor.firstname} ${counselor.lastname}`}
                                                        className="h-20 w-20 rounded-full object-cover mr-4 border-2 border-red-100"
                                                    />
                                                ) : (
                                                    <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                                        <i className="fa fa-user text-red-600 text-3xl"></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">
                                                        {counselor.firstname} {counselor.lastname}
                                                    </h2>
                                                    <div className="flex items-center mt-1">
                                                        <i className="fa fa-star text-yellow-500 mr-1"></i>
                                                        <span className="text-gray-600">
                                                            {counselor.rating || 0} Rating
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mt-4">
                                                {counselor.level && (
                                                    <div className="flex items-center text-gray-600">
                                                        <i className="fa fa-briefcase mr-2 text-red-500"></i>
                                                        <span>Level: {counselor.level}</span>
                                                    </div>
                                                )}
                                                {counselor.language && (
                                                    <div className="flex items-center text-gray-600">
                                                        <i className="fa fa-language mr-2 text-green-500"></i>
                                                        <span>Languages: {counselor.language}</span>
                                                    </div>
                                                )}
                                                {counselor.ExperienceYear && (
                                                    <div className="flex items-center text-gray-600">
                                                        <i className="fa fa-clock mr-2 text-purple-500"></i>
                                                        <span>Experience: {counselor.ExperienceYear} years</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex space-x-4">
                                                <button 
                                                    onClick={() => handleScheduleCall(counselor)}
                                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <i className="fa fa-phone mr-2"></i>
                                                    Schedule Call
                                                </button>
                                                <button
                                                    onClick={() => handleReviewFeedback(counselor)}
                                                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <i className="fa fa-comment mr-2"></i>
                                                    Review Feedback
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {hasMore && !loading && (
                            <div className="mt-12 text-center">
                                <button 
                                    className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold shadow-md"
                                    onClick={loadMoreCounselors}
                                >
                                    Load More Counselors
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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