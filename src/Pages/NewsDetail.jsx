import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Calendar, Eye, Clock, AlertCircle } from 'lucide-react';
import axios from "axios";

const NewsDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

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

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error('News ID is missing');
        }

        const response = await axios.get(`${baseURL}/news/data/${id}`);
        if (!response.data?.success || !response.data?.data) {
          throw new Error('Invalid response format');
        }
        setNewsDetail(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching news detail:", error);
        setError(error.message || 'An error occurred while fetching the news');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id, baseURL]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
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
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
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
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4"/>
          <div className="text-xl text-gray-800 font-medium">No Content Available</div>
          <div className="text-gray-600 mt-2">The requested news article could not be found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4">
      <div className=" mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {newsDetail.title || 'Untitled'}
          </h1>

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

          <div className="prose max-w-none">
            {newsDetail.description ? (
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: newsDetail.description || 'No description available'
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </div>
        </div>

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

export default NewsDetail;