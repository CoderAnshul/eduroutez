import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ScheduleCallPopup from '../Components/DashboardComponent/ScheduleCallPopup';
import ReviewFeedbackPopup from '../Components/DashboardComponent/ReviewFeedbackPopup';
import {Link} from "react-router-dom";
import Promotions from './CoursePromotions';

const CounselorListPage = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    const [counselors, setCounselors] = useState([]); // All counselors
    const [displayedCounselors, setDisplayedCounselors] = useState([]); // Filtered counselors
    const [loading, setLoading] = useState(true);
    const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [selectedStreams, setSelectedStreams] = useState([]);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [streams, setStreams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6);
 

    useEffect(() => {
        const nameParam = searchParams.get('name');
        if (nameParam) {
            setSearchTerm(nameParam);
        }
    }, [searchParams]);

    const Images=import.meta.env.VITE_IMAGE_BASE_URL;

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


    useEffect(() => {
        const token = localStorage.getItem('accessToken'); // Or however you store your auth token
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

    // Fetch all counselors initially
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

    // Filter and search logic
    useEffect(() => {
        let filtered = [...counselors];

        // Apply stream filter
        if (selectedStreams.length > 0) {
            filtered = filtered.filter(counselor => 
                counselor && counselor.category && 
                selectedStreams.includes(counselor.category)
            );
        }

        // Apply search filter
        if (searchTerm) {
            try {
                const regex = new RegExp(searchTerm, 'i');
                filtered = filtered.filter(counselor => 
                    regex.test(counselor.firstname + ' ' + counselor.lastname) || 
                    regex.test(counselor.firstname) ||
                    regex.test(counselor.lastname) || 
                    regex.test(counselor.category) ||
                    regex.test(counselor.language) ||
                    regex.test(counselor.level)
                );
            } catch (e) {
                // Handle invalid regex
                filtered = filtered.filter(counselor => 
                    counselor.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    counselor.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    counselor.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    counselor.language?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    counselor.level?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
        }

        // Paginate results
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayedCounselors(filtered.slice(startIndex, endIndex));
    }, [counselors, selectedStreams, searchTerm, page]);

    const handleStreamChange = (stream) => {
        if (!stream) return;
        setSelectedStreams(prev =>
            prev.includes(stream)
                ? prev.filter(str => str !== stream)
                : [...prev, stream]
        );
        setPage(1); // Reset to first page when filtering
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

                {/* Search Bar */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            placeholder="Search counselors by name, category, language, or level..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1); // Reset to first page when searching
                            }}
                        />
                        <i className="fa fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
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
                        <Promotions location="COUNSELING_PAGE_SIDEBAR" className="h-[250px]"/>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 pl-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {displayedCounselors.map((counselor, index) => (
                                        <div 
                                            key={index} 
                                            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                                        >
                                            {/* Counselor card content remains the same */}
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    {counselor.profilePhoto ? (
                                                        <img
                                                        src={`${Images}/${counselor.profilePhoto.replace('uploads/', '')}`}
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

                                {/* Pagination */}
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                        className="mx-2 px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="mx-4 py-2">Page {page}</span>
                                    <button
                                        onClick={() => setPage(prev => prev + 1)}
                                        disabled={displayedCounselors.length < itemsPerPage}
                                        className="mx-2 px-4 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <Promotions location="COUNSELING_PAGE_MAIN" className="h-[90px]"/>

            </div>

            {showLoginPopup && (
                <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                    <div className="popup bg-white p-12 m-20s rounded-lg shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 w-1/3">
                        <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
                            Hey there! We'd love to hear your thoughts. Please log in to share your review with us and help others make informed decisions.
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