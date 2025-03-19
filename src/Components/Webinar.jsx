import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Webinars = ({ instituteData }) => {
    const [webinarData, setWebinarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [selectedWebinarLink, setSelectedWebinarLink] = useState(null);
    const itemsPerPage = 4;
    const navigate = useNavigate();
    
    const Images = import.meta.env.VITE_IMAGE_BASE_URL || '';
    const baseURL = import.meta.env.VITE_BASE_URL || '';
    const PLACEHOLDER_IMAGE = '/placeholder-image.jpg';
    
    const isLoggedIn = () => {
        return !!localStorage.getItem('accessToken');
    };

    useEffect(() => {
        const fetchWebinars = async () => {
            setError(null);
            setLoading(true);

            try {
                const instituteId = instituteData?.data?._id;
                if (!instituteId) {
                    throw new Error("Institute ID is missing");
                }

                if (!baseURL) {
                    throw new Error("Base URL is not configured");
                }

                const response = await axios.get(`${baseURL}/webinars-by-institute/${instituteId}`);
               
                setWebinarData(response.data.data);
            } catch (error) {
                console.error("Error fetching webinar data:", error);
                setError(error.message || "Failed to fetch webinars");
                setWebinarData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWebinars();
    }, [instituteData, baseURL]);

    // If loading, error, or no webinars, return early
    if (loading) {
        return (
            <div className="w-full p-6 bg-gray-50 flex justify-center items-center min-h-[200px]">
                <p className="text-gray-600">Loading webinars...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-6 bg-gray-50 flex justify-center items-center min-h-[200px]">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    // Conditional rendering based on availability of webinars
    if (!webinarData || webinarData.length === 0) {
        return null; // Return nothing if no webinars are available
    }

    const handleSeeMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handleSeeLess = () => {
        setCurrentPage(1);
    };

    const handleJoinWebinar = (webinarLink) => {
        if (!webinarLink) return;
        
        if (isLoggedIn()) {
            window.open(webinarLink, '_blank');
        } else {
            setSelectedWebinarLink(webinarLink);
            setShowLoginDialog(true);
        }
    };

    const handleLogin = () => {
        if (selectedWebinarLink) {
            sessionStorage.setItem('pendingWebinarLink', selectedWebinarLink);
        }
        setShowLoginDialog(false);
        navigate('/login');
    };

    const LoginDialog = () => (
        showLoginDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                    <button
                        onClick={() => setShowLoginDialog(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                    
                    <h2 className="text-xl font-semibold mb-4">Login Required</h2>
                    
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Please log in to join this webinar.
                        </p>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                        <button
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowLoginDialog(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    const displayedWebinars = webinarData?.result?.slice(0, currentPage * itemsPerPage) || [];

    const WebinarCard = ({ webinar }) => {
        const [imgSrc, setImgSrc] = useState(
            webinar?.image ? `${Images}/${webinar.image}` : PLACEHOLDER_IMAGE
        );
        const [imgError, setImgError] = useState(false);

        const handleImageError = () => {
            if (!imgError) {
                setImgSrc(PLACEHOLDER_IMAGE);
                setImgError(true);
            }
        };

        const formattedDate = webinar?.date ? 
            format(new Date(webinar.date), 'MMM dd, yyyy') : 'Date TBA';

        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                    <img
                        src={imgSrc}
                        alt={webinar?.title || 'Webinar thumbnail'}
                        className="w-full h-48 object-cover"
                        onError={handleImageError}
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                        {webinar?.duration || 'Duration TBA'}
                    </div>
                </div>
                <div className="p-4 flex flex-col justify-between h-[240px]">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {webinar?.title || 'Untitled Webinar'}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <span>📅 {formattedDate}</span>
                            <span>⏰ {webinar?.time || 'Time TBA'}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2 line-clamp-3">
                            {webinar?.description ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: webinar.description.split(" ").slice(0, 30).join(" ") +
                                            (webinar.description.split(" ").length > 30 ? "..." : "")
                                    }}
                                />
                            ) : (
                                <p>No description available</p>
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                            onClick={() => handleJoinWebinar(webinar?.webinarLink)}
                            disabled={!webinar?.webinarLink}
                        >
                            Join Webinar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full p-6 border border-gray-200 rounded-lg">
            <LoginDialog />
            <h3 className="text-xl font-bold mb-8">Upcoming Webinars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {displayedWebinars.map((webinar) => (
                    <WebinarCard key={webinar?._id || Math.random()} webinar={webinar} />
                ))}
            </div>

            <div className="w-full flex justify-center gap-4 mt-24">
                {displayedWebinars.length < (webinarData?.length || 0) && (
                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                        onClick={handleSeeMore}
                    >
                        See More
                    </button>
                )}
                {currentPage > 1 && (
                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                        onClick={handleSeeLess}
                    >
                        See Less
                    </button>
                )}
            </div>
        </div>
    );
};

export default Webinars;