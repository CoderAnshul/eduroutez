import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import cardPhoto from '../assets/Images/teacher.jpg';
import BlogComponent from '../Components/BlogComponent';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import ConsellingBanner from '../Components/ConsellingBanner';
import Promotions from './CoursePromotions';

const StreamLevelPage = () => {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        // Parse the URL parameters
        const params = new URLSearchParams(location.search);
        const stream = params.get('stream');
        const level = params.get('level');

        if (!stream || !level) {
          throw new Error('Stream and level parameters are required');
        }

        // Fetch page data from the API
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/page/${stream}/${level}`);
        
        if (response.data) {
          setPageData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch page data');
        }
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError(err.message || 'An error occurred while fetching the page content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [location.search]);

  if (isLoading) {
    return 

      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading...</h2>
        <p className="text-gray-600 text-center">Please wait while we fetch the page content.</p>
      </div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 text-center">{error}</p>
        <button 
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No Content Found</h2>
        <p className="text-gray-600 text-center">
          The requested page content could not be found. Please check the URL and try again.
        </p>
        <button 
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
        <title>{pageData.title || "Stream Level Page"} | Your Site Name</title>
        <meta name="description" content={pageData.description?.substring(0, 160) || "Learn more about our programs"} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight">
            {pageData.title}
          </h1>
          {pageData.level && (
            <div className="mt-4 inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="font-semibold capitalize">{pageData.level} Level</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
         {/* {console.log('dfghjkl;',pageData?.image) }
          <div className="h-64 w-full overflow-hidden">
            <img
              src={ `${import.meta.env.VITE_IMAGE_BASE_URL}/${pageData.image}`  || cardPhoto}
              alt={pageData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = cardPhoto;
                e.target.onerror = null;
              }}
            />
          </div> */}

          {/* Page Content */}
          <div className="p-8">
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: pageData.description }}
            />
            
            {/* Metadata */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Last Updated:</span> {new Date(pageData.updatedAt).toLocaleDateString()}
              </div>
              <div>
                <span className="capitalize">{pageData.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Components - Similar to PopularCourses */}
      <div className='w-full items-center max-w-4xl h-fit mx-auto'>
        <Promotions location="STREAM_LEVEL_PAGE" className="h-[90px]" />
      </div>

      <BlogComponent />
      <BestRated />
      
      <div className="w-full flex items-start mt-10">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default StreamLevelPage;