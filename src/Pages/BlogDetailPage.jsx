import React, { useEffect, useState, useRef } from 'react';
import { blogById, getRecentBlogs } from '../ApiFunctions/api';
import { useParams, Link } from 'react-router-dom';
import HighRatedCareers from '../Components/HighRatedCareers';
import Events from '../Components/Events';
import ConsellingBanner from '../Components/ConsellingBanner';
import Promotions from '../Pages/CoursePromotions';
import BlogReviewForm from '../Components/BlogReviewForm';
import axiosInstance from '../ApiFunctions/axios';
import SocialShare from '../Components/SocialShare';

const BlogDetailPage = () => {
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [view, setView] = useState('overview');
  const { id } = useParams();
  const overviewRef = useRef(null);
  const reviewsRef = useRef(null);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userId');
  
  // Combined fetch function that gets blog data and recent blogs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog details
        const response = await blogById(id);
        if (!response || !response.data) {
          setError(new Error('No blog data found'));
          return;
        }
        setData(response.data);

        // Check if user has already liked this blog
        if (response.data.likes && currentUserId) {
          const userHasLiked = response.data.likes.includes(currentUserId);
          setIsLiked(userHasLiked);
        }

        // Get blog image
        if (response.data.image) {
          const imageResponse = await fetch(`${Images}/${response.data.image}`);
          const imageBlob = await imageResponse.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setImageUrl(imageObjectURL);
        }
        
        // Fetch recent blogs
        const recentBlogsResponse = await getRecentBlogs();
        if (recentBlogsResponse && recentBlogsResponse.data?.result) {
          const filteredBlogs = recentBlogsResponse.data?.result
            .filter(blog => blog.id !== parseInt(id))
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);
          setRecentBlogs(filteredBlogs);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id, currentUserId, Images]);

  // Handle like/dislike functionality
  const handleLike = async () => {
    if (!currentUserId) {
      alert("Please login to like this blog");
      return;
    }
    
    try {
      const likeValue = isLiked ? "0" : "1"; // Toggle like value
      
      // Call the like-dislike API
      await axiosInstance.post('http://localhost:4001/api/v1/like-dislike', {
        id: id,
        type: "blog",
        like: likeValue
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')
        }
      });
    
      // Update local state
      setIsLiked(!isLiked);
      console.log(`Blog ${id} like status updated to ${!isLiked}`);
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  // Calculate number of likes
  const likesCount = data?.likes?.length || 0;

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 text-center text-red-600">
        An error occurred while loading the blog. Please try again later.
      </div>
    );
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container max-w-[1300px] mx-auto mt-10 p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          {/* Blog Header - Only one instance */}
          <div className="flex justify-between items-center p-6">
            <h1 className="text-3xl font-bold">{data.title || 'Blog Post'}</h1>
            
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
                <span className="font-medium">{data.views || 0}</span>
              </div>

              
              <SocialShare 
      title={data.title} 
      url={`${window.location.origin}/blogdetailpage/${id}`}
      contentType="blog"
    />
              
              {/* Like Button */}
              <button 
                onClick={handleLike}
                disabled={!currentUserId || isLiked}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  !currentUserId ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                  isLiked ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill={isLiked ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth={isLiked ? "1" : "2"} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className={`transition-transform ${isLiked ? 'scale-110' : ''}`}
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3L7 6v12h11.28a2 2 0 0 0 1.94-1.52l1.16-5A2 2 0 0 0 19.44 9z"></path>
                </svg>
                <span className="font-medium">{likesCount > 0 && likesCount}</span>
              </button>
            </div>
          </div>

          {/* Rest of the component remains the same */}
          {imageUrl && (
            <div className="relative">
              <img
                className="w-full h-80 object-cover"
                src={imageUrl}
                alt={data.title || 'Blog Image'}
              />
              {data.title && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-white text-center">{data.title}</h1>
                </div>
              )}
            </div>
          )}

          <div className="p-6 space-y-6">
            {data.metaImage && data.metaTitle && (
              <div className="flex space-x-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`${Images}/${data.metaImage}`}
                  alt="Meta"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{data.metaTitle}</h2>
                  {data.createdAt && (
                    <p className="text-gray-600">
                      {new Date(data.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {data.metaDescription && (
                <p className="text-gray-700">{data.metaDescription}</p>
              )}

              {data.metaKeywords && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.metaKeywords.split(",").map((keyword, index) => (
                    keyword.trim() && (
                      <span
                        key={index}
                        className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full"
                      >
                        {keyword.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>

            {data?.description && (
              <div ref={overviewRef} className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:space-x-6 mt-6 ">
                  <div className="lg:w-4/5 ">
                    <h3 className="text-lg font-semibold border-b pb-2">Overview</h3>
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  </div>

                  <div className="lg:w-1/5 md:w-[30%] h-full min-w-[200px] mt-8 lg:mt-0">
                    <div className='sticky top-20'>
                      <h3 className="text-lg font-semibold mb-4">Recently Uploaded Blogs</h3>
                      <div className="space-y-4">
                        {recentBlogs?.map((blog) => (
                          <Link key={blog.id} to={`/blogdetailpage/${blog?._id}`}>
                            <div className="flex items-center p-3 bg-white rounded-lg shadow-md">
                              <div className="w-1/3">
                                <img
                                  src={`${Images}/${blog?.thumbnail}`}
                                  alt={blog.title}
                                  className="w-full h-20 object-cover rounded-md"
                                />
                              </div>
                              <div className="w-2/3 ml-3">
                                <h4 className="text-md font-medium text-gray-800 truncate">{blog.title}</h4>
                                <p className="text-sm text-gray-600 truncate" dangerouslySetInnerHTML={{ __html: blog.description.split(' ').slice(0, 30).join(' ') + '...' }}></p>
                                <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="w-full mt-6">
                      <Promotions location="BLOG_PAGE" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section - New */}
            <div ref={reviewsRef} id="reviews" className="mt-10 border-t pt-6">
              <h3 className="text-2xl font-semibold text-red-500 mb-4">Reviews</h3>
              <BlogReviewForm blog={data} />
            </div>
          </div>
        </div>

        <HighRatedCareers />
      </div>
      <div className="flex gap-2 items-center">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default BlogDetailPage;