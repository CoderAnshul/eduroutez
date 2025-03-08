import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Eye, Clock, AlertCircle, ThumbsUp } from 'lucide-react';
import axios from "axios";

const NewsDetailPage = () => {
  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // This can be either ID or slug
  const navigate = useNavigate();
  
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;
  
  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  // Initialize newsIdMap from localStorage
  useEffect(() => {
    if (!window.newsIdMap) {
      try {
        const storedNewsIdMap = JSON.parse(
          localStorage.getItem("newsIdMap") || "{}"
        );
        window.newsIdMap = storedNewsIdMap;
      } catch (error) {
        console.error("Error initializing newsIdMap:", error);
        window.newsIdMap = {};
      }
    }
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date unavailable';
    }
  };

  // Fetch news data
  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      try {
        // First, determine if we're dealing with an ID or a slug
        const isSlug = isNaN(parseInt(id)) || id.includes("-");

        // Try to get news data - with fallback mechanisms
        let response;
        let newsId = id;

        if (isSlug) {
          // Try to get the ID from newsIdMap
          const mappedId = window.newsIdMap?.[id];

          if (mappedId) {
            // We found the ID in the map, use it
            newsId = mappedId;
            response = await axios.get(`${baseURL}/news/data/${newsId}`);
          } else {
            // If newsIdMap doesn't exist or doesn't have the slug (like on refresh),
            // we need to get the news directly by its slug through a custom API call
            try {
              response = await axios.get(`${baseURL}/news/by-slug/${id}`);

              // If we got a response, grab the ID for future use
              if (response && response.data?.success && response.data?.data) {
                newsId = response.data.data._id;

                // Save this slug -> ID mapping to both window and localStorage
                window.newsIdMap = window.newsIdMap || {};
                window.newsIdMap[id] = newsId;
                localStorage.setItem(
                  "newsIdMap",
                  JSON.stringify(window.newsIdMap)
                );
                console.log(
                  `Saved mapping: ${id} -> ${newsId} in localStorage`
                );
              }
            } catch (slugError) {
              console.error("Error fetching news by slug:", slugError);

              // As a final fallback, try using the news ID API
              response = await axios.get(`${baseURL}/news/data/${id}`);
            }
          }
        } else {
          // It's an ID, use it directly
          response = await axios.get(`${baseURL}/news/data/${newsId}`);

          // If the news has a slug, we should save that mapping too
          if (response && response.data?.success && response.data?.data && response.data.data.slug) {
            const slug = response.data.data.slug;
            window.newsIdMap = window.newsIdMap || {};
            window.newsIdMap[slug] = newsId;
            localStorage.setItem("newsIdMap", JSON.stringify(window.newsIdMap));
            console.log(`Saved mapping: ${slug} -> ${newsId} in localStorage`);
          }
        }

        // Process the response
        if (!response || !response.data?.success || !response.data?.data) {
          throw new Error('News article not found or invalid response format');
        }

        setNewsDetail(response.data.data);

        // Check if user has already liked this news
       

        setError(null);
      } catch (error) {
        console.error("Error fetching news data:", error);
        setError(error.message || 'An error occurred while fetching the news');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id, baseURL, currentUserId]);

 

  if (loading) {
    return (
      <div className="container max-w-[1300px] mx-auto w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg w-full"/>
            <div className="h-8 bg-gray-200 rounded w-3/4"/>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"/>
              <div className="h-4 bg-gray-200 rounded w-5/6"/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-[1300px] mx-auto w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
          <div className="text-xl text-red-600 font-medium">Error</div>
          <div className="text-gray-600 mt-2">{error}</div>
        </div>
      </div>
    );
  }

  if (!newsDetail) {
    return (
      <div className="container max-w-[1300px] mx-auto w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4"/>
          <div className="text-xl text-gray-800 font-medium">No Content Available</div>
          <div className="text-gray-600 mt-2">The requested news article could not be found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-[1300px] mx-auto w-full min-h-screen bg-gray-50 py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* News Header */}
        <div className="flex max-sm:flex-col max-sm:gap-4 justify-between items-center p-6">
          <h1 className="text-3xl font-bold">{newsDetail.title || "News Article"}</h1>

        </div>

        {/* Image Display */}
        <div className="relative">
          {newsDetail.image ? (
            <img
              src={`${Images}/${newsDetail.image}`}
              alt={newsDetail.title || 'News image'}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
                e.target.alt = 'Image not available';
              }}
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
        </div>

        <div className="p-6">
          {/* Main Content Area */}
          <div className="mt-6">
            {/* Main Content */}
            <div className="w-full">
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                {newsDetail.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4"/>
                    <span>Published: {formatDate(newsDetail.date)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4"/>
                  <span>{newsDetail.viewCount || 0} views</span>
                </div>
                {newsDetail.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4"/>
                    <span>Updated: {formatDate(newsDetail.updatedAt)}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none news-content">
                {newsDetail.description ? (
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: newsDetail.description || 'No description available'
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic">No content available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-50 p-4 mt-6 text-sm text-gray-500">
          <div className="flex flex-wrap justify-between gap-2">
            <span>ID: {newsDetail._id}</span>
            <span>Created: {formatDate(newsDetail.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;