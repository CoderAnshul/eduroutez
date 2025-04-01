import React, { useEffect, useState, useRef } from "react";
import { blogById, getRecentBlogs } from "../ApiFunctions/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import HighRatedCareers from "../Components/HighRatedCareers";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import Promotions from "../Pages/CoursePromotions";
import BlogReviewForm from "../Components/BlogReviewForm";
import axiosInstance from "../ApiFunctions/axios";
import SocialShare from "../Components/SocialShare";

const BlogDetailPage = () => {
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [view, setView] = useState("overview");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { id } = useParams(); // This can be either ID or slug
  const navigate = useNavigate();
  const overviewRef = useRef(null);
  const reviewsRef = useRef(null);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!window.blogIdMap) {
      try {
        const storedBlogIdMap = JSON.parse(
          localStorage.getItem("blogIdMap") || "{}"
        );
        window.blogIdMap = storedBlogIdMap;
      } catch (error) {
        console.error("Error initializing blogIdMap:", error);
        window.blogIdMap = {};
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to get blog data with our updated blogById function that handles both IDs and slugs
        let response;
        let blogId = id;

        // Try to get the ID from blogIdMap if it's a slug
        const isSlug = isNaN(parseInt(id)) || id.includes("-");
        if (isSlug) {
          const mappedId = window.blogIdMap?.[id];
          if (mappedId) {
            // We found the ID in the map, use it directly
            blogId = mappedId;
            response = await blogById(blogId);
          } else {
            // We don't have the ID, so use the slug (our updated blogById will handle it)
            response = await blogById(id);

            // If we got a response, grab the ID for future use
            if (response && response.data) {
              blogId = response.data._id;

              // Save this slug -> ID mapping to both window and localStorage
              window.blogIdMap = window.blogIdMap || {};
              window.blogIdMap[id] = blogId;
              localStorage.setItem(
                "blogIdMap",
                JSON.stringify(window.blogIdMap)
              );
              console.log(`Saved mapping: ${id} -> ${blogId} in localStorage`);
            }
          }
        } else {
          // It's an ID, use it directly
          response = await blogById(blogId);

          // If the blog has a slug, we should save that mapping too
          if (response && response.data && response.data.slug) {
            const slug = response.data.slug;
            window.blogIdMap = window.blogIdMap || {};
            window.blogIdMap[slug] = blogId;
            localStorage.setItem("blogIdMap", JSON.stringify(window.blogIdMap));
            console.log(`Saved mapping: ${slug} -> ${blogId} in localStorage`);
          }
        }

        if (!response || !response.data) {
          setError(new Error("No blog data found"));
          return;
        }

        setData(response.data);

        // Check if user has already liked this blog
        if (response.data.likes && currentUserId) {
          const userHasLiked = response.data.likes.includes(currentUserId);
          setIsLiked(userHasLiked);
        }

        // Get blog image
        if (
          response.data.thumbnail ||
          response.data.image ||
          response.data.coverImage
        ) {
          try {
            const imageResponse = await fetch(
              `${Images}/${response.data?.image}`
            );
            const imageBlob = await imageResponse.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            setImageUrl(imageObjectURL);
          } catch (imgError) {
            console.error("Error loading image:", imgError);
          }
        }

        // Fetch recent blogs
        const recentBlogsResponse = await getRecentBlogs();
        if (recentBlogsResponse && recentBlogsResponse.data?.result) {
          const filteredBlogs = recentBlogsResponse.data?.result
            .filter((blog) => blog._id !== response.data._id)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);
          setRecentBlogs(filteredBlogs);

          // Save ID mappings for recent blogs too
          filteredBlogs.forEach((blog) => {
            if (blog._id && blog.slug) {
              window.blogIdMap = window.blogIdMap || {};
              window.blogIdMap[blog.slug] = blog._id;
            }
          });

          // Update localStorage with all mappings
          localStorage.setItem("blogIdMap", JSON.stringify(window.blogIdMap));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [id, currentUserId]);

  // Handle like/dislike functionality
  const handleLike = async () => {
    if (!currentUserId) {
      // Show login popup instead of alert
      setShowLoginPopup(true);
      return;
    }

    try {
      const likeValue = isLiked ? "0" : "1"; // Toggle like value

      // Use the blog's actual ID for the API call
      const blogId = data._id;

      // Call the like-dislike API
      await axiosInstance.post(
        `${baseURL}/like-dislike`,
        {
          id: blogId,
          type: "blog",
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

      // Update local state
      setIsLiked(!isLiked);
      setData((prevData) => {
        const updatedLikes = isLiked
          ? prevData.likes.filter((userId) => userId !== currentUserId) // Remove user ID
          : [...prevData.likes, currentUserId]; // Add user ID

        return {
          ...prevData,
          likes: updatedLikes,
        };
      });
      console.log(`Blog ${blogId} like status updated to ${!isLiked}`);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  // Handle redirect to login page
  const handleRedirectToLogin = () => {
    setShowLoginPopup(false);
    // Navigate to login page
    navigate("/login", { state: { returnUrl: window.location.pathname } });
  };

  // Close the login popup
  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  // Calculate number of likes
  const likesCount = data?.likes?.length || 0;

  // Handle share click to prevent navigation
  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Helper function to get URL for display - keep exactly what was used to access the page
  const getBlogUrl = (blog) => {
    // Using IDs is more reliable internally
    return `/blogdetailpage/${blog?._id}`;
  };

  // Helper function to get actual blog ID for internal use
  const getBlogId = (blog) => {
    return blog?._id;
  };

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 text-center text-red-600">
        An error occurred while loading the blog. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-[1300px] mx-auto mt-10 p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          {/* Blog Header - Only one instance */}
          <div className="flex max-sm:flex-col max-sm:gap-4 justify-between items-center p-6">
            <h1 className="text-3xl font-bold">{data.title || "Blog Post"}</h1>

            <div className="flex items-center gap-4 ">
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

              {/* Social Share Component - Use the current URL to maintain consistency */}
              <div onClick={handleShareClick}>
                <SocialShare
                  title={data.title}
                  url={window.location.href}
                  contentType="blog"
                  className="top-10"
                />
              </div>

              {/* Like Button - Not disabled for non-logged in users */}
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
          </div>

          {/* Image display with title overlay */}
          {imageUrl && (
            <div className="relative">
              <img
                className="w-full h-80 object-cover"
                src={imageUrl}
                alt={data.title || "Blog Image"}
              />
              {data.title && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-white text-center">
                    {data.title}
                  </h1>
                </div>
              )}
            </div>
          )}

          <div className="p-6 space-y-6 ">
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

            <div className="space-y-4 ">
              {data.metaDescription && (
                <p className="text-gray-700">{data.metaDescription}</p>
              )}

              {data.metaKeywords && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.metaKeywords.split(",").map(
                    (keyword, index) =>
                      keyword.trim() && (
                        <span
                          key={index}
                          className="inline-block bg-[#b82025] text-white text-sm px-3 py-1 rounded-full"
                        >
                          {keyword.trim()}
                        </span>
                      )
                  )}
                </div>
              )}
            </div>

            {data?.description && (
              <div ref={overviewRef} className=" space-y-4">
                <div className="flex flex-col lg:flex-row lg:space-x-6 mt-6 ">
                  <div className="lg:w-4/5 ">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Overview
                    </h3>
                    <div
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  </div>

                  <div className="lg:w-1/5 md:w-full h-full min-w-[200px] mt-8 lg:mt-0">
                    <div className="sticky top-20">
                      <h3 className="text-lg font-semibold mb-4">
                        Recently Uploaded Blogs
                      </h3>
                      <div className="space-y-4">
                        {recentBlogs?.map((blog) => (
                          <Link key={blog._id} to={getBlogUrl(blog)}>
                            <div className="flex items-center mb-4 p-3 bg-white rounded-lg shadow-md">
                              <div className="w-1/3">
                                <img
                                  src={`${Images}/${blog?.thumbnail}`}
                                  alt={blog.title}
                                  className="w-full h-20 object-cover rounded-md"
                                />
                              </div>
                              <div className="w-2/3 ml-3">
                                <h4 className="text-md font-medium text-gray-800 truncate">
                                  {blog.title.length > 30
                                    ? `${blog.title.slice(0, 30)}...`
                                    : blog.title}
                                </h4>
                                <p
                                  className="text-sm text-gray-600 line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html: blog.description,
                                  }}
                                ></p>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    blog.createdAt
                                  ).toLocaleDateString()}
                                </span>
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

            {/* Reviews Section */}
            <div ref={reviewsRef} id="reviews" className="mt-10 border-t pt-6">
              <h3 className="text-2xl font-semibold text-red-500 mb-4">
                Reviews
              </h3>
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
                You need to be logged in to like this blog. Would you like to
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

export default BlogDetailPage;
