import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import cardPhoto from "../assets/Images/teacher.jpg";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import Promotions from "./CoursePromotions";
import SocialShare from "../Components/SocialShare";
import { Sparkles } from "lucide-react";

const StreamLevelPage = () => {
  const [pageData, setPageData] = useState(null);
  const [streamDetails, setStreamDetails] = useState(null);
  const [streamBlogs, setStreamBlogs] = useState([]);
  const [streamInstitutes, setStreamInstitutes] = useState([]);
  const [streamCareers, setStreamCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [institutesLoading, setInstitutesLoading] = useState(true);
  const [careersLoading, setCareersLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        // Parse the URL parameters
        const params = new URLSearchParams(location.search);
        const streamId = params.get("stream");
        const level = params.get("level");

        if (!streamId || !level) {
          throw new Error("Stream and level parameters are required");
        }

        // Fetch page data from the API
        const pageResponse = await axios.get(
          `${baseURL}/page/${streamId}/${level}`
        );

        if (pageResponse.data) {
          setPageData(pageResponse.data.data);
        } else {
          throw new Error(pageResponse.data.message || "Failed to fetch page data");
        }

        // Fetch stream details to get stream name - use public streams endpoint
        try {
          // Fetch all streams and find the matching one (public endpoint)
          const streamsResponse = await axios.get(
            `${baseURL}/streams?page=0&limit=1000`
          );
          const allStreams = streamsResponse.data?.data?.result || [];
          const stream = allStreams.find((s) => s._id === streamId);

          if (stream) {
            setStreamDetails(stream);
            const streamName = stream.name;

            // Fetch stream-related blogs using stream ID
            try {
              const blogFilters = JSON.stringify({ stream: [streamId] });
              const blogSort = JSON.stringify({ createdAt: "desc" });
              const blogsResponse = await axios.get(
                `${baseURL}/blogs?filters=${encodeURIComponent(blogFilters)}&sort=${encodeURIComponent(blogSort)}&limit=6`
              );
              setStreamBlogs(blogsResponse.data?.data?.result || []);
            } catch (blogErr) {
              console.error("Error fetching blogs:", blogErr);
            } finally {
              setBlogsLoading(false);
            }

            // Fetch stream-related institutes using stream name
            try {
              // Use the /institutes endpoint with filters to get stream-related institutes
              const filters = JSON.stringify({ streams: [streamName] });
              const apiUrl = `${baseURL}/institutes?filters=${encodeURIComponent(filters)}&limit=6&sort=${encodeURIComponent(JSON.stringify({ overallRating: "desc" }))}`;
              console.log("Fetching institutes for stream:", streamName);
              console.log("API URL:", apiUrl);
              const institutesResponse = await axios.get(apiUrl);
              const institutes = institutesResponse.data?.data?.result || [];
              console.log(`Found ${institutes.length} institutes for stream "${streamName}"`);
              setStreamInstitutes(institutes);
            } catch (instituteErr) {
              console.error("Error fetching institutes:", instituteErr);
            } finally {
              setInstitutesLoading(false);
            }

            // Fetch stream-related careers using stream ID
            try {
              const careerFilters = JSON.stringify({ stream: [streamId] });
              const careerSort = JSON.stringify({ createdAt: "desc" });
              const careersResponse = await axios.get(
                `${baseURL}/careers?filters=${encodeURIComponent(careerFilters)}&sort=${encodeURIComponent(careerSort)}&limit=6`
              );
              setStreamCareers(careersResponse.data?.data?.result || []);
            } catch (careerErr) {
              console.error("Error fetching careers:", careerErr);
            } finally {
              setCareersLoading(false);
            }
          } else {
            // Stream not found, still try to fetch blogs and institutes
            console.warn("Stream not found in list, trying to fetch content anyway");

            // Try fetching blogs with stream ID
            try {
              const blogFilters = JSON.stringify({ stream: [streamId] });
              const blogSort = JSON.stringify({ createdAt: "desc" });
              const blogsResponse = await axios.get(
                `${baseURL}/blogs?filters=${encodeURIComponent(blogFilters)}&sort=${encodeURIComponent(blogSort)}&limit=6`
              );
              setStreamBlogs(blogsResponse.data?.data?.result || []);
            } catch (blogErr) {
              console.error("Error fetching blogs:", blogErr);
            } finally {
              setBlogsLoading(false);
            }

            // Try fetching institutes without stream name filter
            try {
              // Use the /institutes endpoint sorted by rating
              const institutesResponse = await axios.get(
                `${baseURL}/institutes?limit=6&sort=${encodeURIComponent(JSON.stringify({ overallRating: "desc" }))}`
              );
              setStreamInstitutes(institutesResponse.data?.data?.result || []);
            } catch (instituteErr) {
              console.error("Error fetching institutes:", instituteErr);
            } finally {
              setInstitutesLoading(false);
            }

            // Try fetching careers without stream filter (fallback to latest careers)
            try {
              const careerSort = JSON.stringify({ createdAt: "desc" });
              const careersResponse = await axios.get(
                `${baseURL}/careers?limit=6&sort=${encodeURIComponent(careerSort)}`
              );
              setStreamCareers(careersResponse.data?.data?.result || []);
            } catch (careerErr) {
              console.error("Error fetching careers:", careerErr);
            } finally {
              setCareersLoading(false);
            }
          }
        } catch (streamErr) {
          console.error("Error fetching stream details:", streamErr);
          // Still try to fetch blogs and institutes even if stream fetch fails
          try {
            const blogFilters = JSON.stringify({ stream: [streamId] });
            const blogSort = JSON.stringify({ createdAt: "desc" });
            const blogsResponse = await axios.get(
              `${baseURL}/blogs?filters=${encodeURIComponent(blogFilters)}&sort=${encodeURIComponent(blogSort)}&limit=6`
            );
            setStreamBlogs(blogsResponse.data?.data?.result || []);
          } catch (blogErr) {
            console.error("Error fetching blogs:", blogErr);
          } finally {
            setBlogsLoading(false);
          }

          try {
            // Use the /institutes endpoint sorted by rating
            const institutesResponse = await axios.get(
              `${baseURL}/institutes?limit=6&sort=${encodeURIComponent(JSON.stringify({ overallRating: "desc" }))}`
            );
            setStreamInstitutes(institutesResponse.data?.data?.result || []);
          } catch (instituteErr) {
            console.error("Error fetching institutes:", instituteErr);
          } finally {
            setInstitutesLoading(false);
          }

          try {
            const careerSort = JSON.stringify({ createdAt: "desc" });
            const careersResponse = await axios.get(
              `${baseURL}/careers?limit=6&sort=${encodeURIComponent(careerSort)}`
            );
            setStreamCareers(careersResponse.data?.data?.result || []);
          } catch (careerErr) {
            console.error("Error fetching careers:", careerErr);
          } finally {
            setCareersLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching page data:", err);
        setError(
          err.message || "An error occurred while fetching the page content"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Loading...</h2>
        <p className="text-gray-600 text-center">
          Please wait while we fetch the page content.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 text-center">{error}</p>
        <button
          className="mt-6 bg-[#b82025] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No Content Found
        </h2>
        <p className="text-gray-600 text-center">
          The requested page content could not be found. Please check the URL
          and try again.
        </p>
        <button
          className="mt-6 bg-[#b82025] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
      <meta
        name="description"
        content={
          pageData.description?.substring(0, 160) ||
          "Learn more about our programs"
        }
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold leading-tight">{pageData.title}</h1>
          {pageData.level && (
            <div className="mt-4 inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <span className="font-semibold capitalize">
                {pageData.level} Level
              </span>
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
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(pageData.updatedAt).toLocaleDateString()}
              </div>
              <div>
                <span className="capitalize">{pageData.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Components - Similar to PopularCourses */}
      <div className="w-full items-center max-w-4xl h-fit mx-auto">
        <Promotions location="STREAM_LEVEL_PAGE" className="h-[90px]" />
      </div>

      {/* Stream Related Blogs */}
      {streamBlogs.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="text-red-500 w-6 h-6" />
              <h2 className="text-3xl font-bold text-gray-900">Stream Related Blogs</h2>
            </div>
            <Link to="/blogpage">
              <button className="bg-[#b82025] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                View more
              </button>
            </Link>
          </div>
          {blogsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {streamBlogs.map((blog, index) => {
                const handleShareClick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                };

                return (
                  <div
                    key={blog._id || index}
                    className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
                  >
                    {/* Image and main content wrapped in Link */}
                    <Link
                      to={`/blogdetailpage/${blog.slug || blog._id}`}
                      className="block group text-black"
                    >
                      {/* Image */}
                      <div className="h-56 relative min-h-56 max-h-56 w-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover object-top rounded-t-xl"
                          src={
                            blog?.thumbnail
                              ? `${Images}/${blog.thumbnail}`
                              : cardPhoto
                          }
                          alt={blog.title || "Blog"}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = cardPhoto;
                            e.target.onerror = null;
                          }}
                        />
                        <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-2 bg-white px-3 py-1 rounded-full text-black">
                          {blog.views && (
                            <div className="flex items-center gap-2 text-black">
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
                              <span className="text-black">{blog.views}</span>
                            </div>
                          )}
                          {blog.likes && blog.likes.length > 0 && (
                            <div className="flex items-center gap-2 text-black">
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
                                <path d="M14 9V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3z"></path>
                                <path d="M9 22V12"></path>
                              </svg>
                              <span className="text-black">
                                {blog.likes.length}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-2 md:p-6">
                        <h3 className="text-xl min-h-[3em] md:text-xl lg:text-xl font-bold text-gray-800">
                          {blog.title
                            ? blog.title.length > 50
                              ? `${blog.title.slice(0, 50)}...`
                              : blog.title
                            : "Untitled Blog"}
                        </h3>
                        {blog.description && (
                          <p
                            className="text-sm min-h-[3em] text-gray-600 mt-3 line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: blog.description.slice(0, 100) + "...",
                            }}
                          ></p>
                        )}
                        {blog.author && (
                          <p className="text-xs text-gray-500 mt-2">
                            By {blog.author}
                          </p>
                        )}
                        {blog.createdAt && (
                          <p className="text-xs text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        )}
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-gray-600">
                            <button className="bg-[#b82025] whitespace-nowrap text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-all">
                              Read More
                            </button>

                            <div className="flex gap-4">
                              {/* Social Share component */}
                              <div onClick={(e) => handleShareClick(e)}>
                                <SocialShare
                                  title={blog.title || "Blog"}
                                  url={`${window.location.origin}/blogdetailpage/${blog.slug || blog._id}`}
                                  contentType="blog"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Related Careers */}
      {streamCareers.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="text-red-500 w-6 h-6" />
              <h2 className="text-3xl font-bold text-gray-900">Stream Related Careers</h2>
            </div>
            <Link to="/careerspage">
              <button className="bg-[#b82025] text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                View more
              </button>
            </Link>
          </div>
          {careersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {streamCareers.map((box, index) => (
                <Link
                  to={`/detailpage/${box.slug}`}
                  key={box._id || index}
                  className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <div className="h-56 relative overflow-hidden rounded-t-xl">
                    <img
                      className="w-full h-full object-cover"
                      src={box.thumbnail ? `${Images}/${box.thumbnail}` : cardPhoto}
                      alt={box.title || "Career"}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = cardPhoto;
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-300">
                      {box.title || "Untitled"}
                    </h3>
                    <p
                      className="text-sm text-gray-600 mt-2 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: box.description?.slice(0, 100) + "..." || "No description available",
                      }}
                    ></p>
                    <div className="mt-4 flex items-center justify-between">
                      <button className="text-red-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More
                        <span>&rarr;</span>
                      </button>
                      {box.views > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
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
                          <span>{box.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Institutes */}
      {streamInstitutes.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="text-red-500 w-6 h-6" />
            <h2 className="text-3xl font-bold text-gray-900">Stream Related Institutes</h2>
          </div>
          {institutesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamInstitutes.map((institute) => (
                <Link
                  to={institute.slug ? `/institute/${institute.slug}` : `/institute/${institute._id}`}
                  key={institute._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={
                        institute.thumbnailImage
                          ? `${Images}/${institute.thumbnailImage}`
                          : cardPhoto
                      }
                      alt={institute.instituteName || "Institute"}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {institute.instituteName || "Institute Name Not Available"}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {institute.about ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: institute.about.slice(0, 150) + "...",
                          }}
                        />
                      ) : (
                        "No information available"
                      )}
                    </p>
                    {institute.overallRating && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-yellow-500 font-semibold">
                          ⭐ {institute.overallRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({institute.reviews?.length || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full flex items-start mt-10">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default StreamLevelPage;
