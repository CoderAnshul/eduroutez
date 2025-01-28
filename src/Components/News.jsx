import React, { useState, useEffect } from "react";
import axios from "axios";

const News = ({ instituteData }) => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    // Safely access environment variables with fallbacks
    const Images = import.meta.env.VITE_IMAGE_BASE_URL || '';
    const baseURL = import.meta.env.VITE_BASE_URL || '';

    useEffect(() => {
        const fetchNews = async () => {
            // Reset error state on new fetch attempt
            setError(null);
            setLoading(true);

            try {
                // Check if instituteData and its properties exist
                const instituteId = instituteData?.data?._id;
                if (!instituteId) {
                    throw new Error("Institute ID is missing");
                }

                if (!baseURL) {
                    throw new Error("Base URL is not configured");
                }

                const response = await axios.get(`${baseURL}/news/${instituteId}`);
                
                // Validate response data
                if (!response?.data?.data) {
                    throw new Error("Invalid response format");
                }

                setNewsData(response.data.data);
            } catch (error) {
                console.error("Error fetching news data:", error);
                setError(error.message || "Failed to fetch news");
                setNewsData([]); // Reset news data on error
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [instituteData, baseURL]);

    const handleSeeMore = () => {
        setCurrentPage(prev => prev + 1);
    };

    const handleSeeLess = () => {
        setCurrentPage(1);
    };

    const handleReadMore = (newsId) => {
        if (newsId) {
            window.location.href = `/news/${newsId}`;
        }
    };

    // Safely slice the news data
    const displayedNews = newsData?.slice(0, currentPage * itemsPerPage) || [];

    if (loading) {
        return (
            <div className="w-full p-6 bg-gray-50 flex justify-center items-center min-h-[200px]">
                <p className="text-gray-600">Loading news...</p>
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

    if (!displayedNews.length) {
        return (
            <div className="w-full p-6 bg-gray-50 flex justify-center items-center min-h-[200px]">
                <p className="text-gray-600">No news articles available.</p>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedNews.map((news) => (
                    <div
                        key={news?._id || Math.random()}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="relative">
                            <img
                                src={news?.image ? `${Images}/${news.image}` : '/placeholder-image.jpg'}
                                alt={news?.title || 'News article'}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                    e.target.alt = 'Image not available';
                                }}
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between h-[215px]">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {news?.title || 'Untitled Article'}
                                </h3>
                                <div className="text-sm text-gray-600 mt-2 line-clamp-3">
                                    {news?.description ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: news.description.split(" ").slice(0, 30).join(" ")
                                            }}
                                        />
                                    ) : (
                                        <p>No description available</p>
                                    )}
                                    {news?.description && 
                                     news.description.split(" ").length > 30 && 
                                     <span>...</span>
                                    }
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
                                    className="text-red-500 font-semibold hover:underline"
                                    onClick={() => handleReadMore(news?._id)}
                                    disabled={!news?._id}
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full flex justify-center gap-4 mt-24">
                {displayedNews.length < (newsData?.length || 0) && (
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

export default News;