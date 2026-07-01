import React, { useCallback, useEffect, useRef } from "react";
import SafeImage from "../Ui components/SafeImage";
import agricultureImg from "../assets/Images/agriculture.jpg";
import BlogCard from "../Ui components/BlogCard";
import CustomButton from "../Ui components/CustomButton";
import { getBlogs } from "../ApiFunctions/api";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import SocialShare from "./SocialShare";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

// In-memory mapping to store blog IDs by slug
const blogIdMap = {};

const BlogComponent = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let intervalId;
    const startInterval = () => {
      intervalId = setInterval(() => {
        if (window.innerWidth >= 768) return;
        const children = Array.from(container.children).filter(
          (child) => !child.classList.contains("nav-btn")
        );
        if (children.length <= 1) return;

        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;

        let currentIdx = 0;
        let minDiff = Infinity;
        children.forEach((child, idx) => {
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const containerCenter = scrollLeft + containerWidth / 2;
          const diff = Math.abs(childCenter - containerCenter);
          if (diff < minDiff) {
            minDiff = diff;
            currentIdx = idx;
          }
        });

        let nextIdx = (currentIdx + 1) % children.length;
        const nextChild = children[nextIdx];
        if (nextChild) {
          container.scrollTo({
            left: nextChild.offsetLeft - (containerWidth - nextChild.clientWidth) / 2,
            behavior: "smooth",
          });
        }
      }, 4000);
    };

    startInterval();
    return () => clearInterval(intervalId);
  }, []);

  const handlePrev = () => {
    const container = scrollRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const children = Array.from(container.children).filter(
      (child) => !child.classList.contains("nav-btn")
    );
    if (children.length <= 1) return;

    const scrollLeft = container.scrollLeft;
    let currentIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const diff = Math.abs(childCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        currentIdx = idx;
      }
    });

    let prevIdx = (currentIdx - 1 + children.length) % children.length;
    const prevChild = children[prevIdx];
    if (prevChild) {
      container.scrollTo({
        left: prevChild.offsetLeft - (containerWidth - prevChild.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const container = scrollRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const children = Array.from(container.children).filter(
      (child) => !child.classList.contains("nav-btn")
    );
    if (children.length <= 1) return;

    const scrollLeft = container.scrollLeft;
    let currentIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const diff = Math.abs(childCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        currentIdx = idx;
      }
    });

    let nextIdx = (currentIdx + 1) % children.length;
    const nextChild = children[nextIdx];
    if (nextChild) {
      container.scrollTo({
        left: nextChild.offsetLeft - (containerWidth - nextChild.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const { data, isLoading, isFetching, isError } = useQuery(
    ["blog"],
    () => getBlogs(),
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const blogs = data?.data?.result || [];

        // Store the ID mapping for each blog using the slug from backend
        blogs.forEach((blog) => {
          if (blog.slug) {
            blogIdMap[blog.slug] = blog._id;
          }
        });

        // Make the mapping available globally
        window.blogIdMap = blogIdMap;
      },
    }
  );

  const content = Array.isArray(data?.data?.result) ? data.data.result : [];

  const handleShareClick = useCallback((e, blog) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading blogs
      </div>
    );
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Blogs</h1>
        {/* <h3 className="text-2xl font-bold">Latest Blogs</h3> */}
        <Link to="/blogpage">
          <button className="bg-[#b82025] text-white py-2 px-4 rounded">
            View more
          </button>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      <div className="relative w-full">
        {/* Left Navigation Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md md:hidden flex items-center justify-center border border-gray-200 nav-btn"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div 
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.length > 0 ? (
            content.slice(0, 3).map((blog, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative w-[85vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center"
              >
                {/* Image and main content wrapped in Link */}
                <Link
                  to={`/blogdetailpage/${blog.slug}`}
                  className="block group text-black"
                >
                  {/* Image */}
                  <div className="h-56 relative min-h-56 max-h-56 w-full overflow-hidden">
                    <SafeImage
                      className="w-full h-full object-cover object-top rounded-t-xl"
                      src={`${Images}/${blog?.thumbnail}`}
                      alt={blog.title}
                      title={blog.title}
                      loading="lazy"
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
                            {blog.likes.length > 0 && blog.likes.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-2 md:p-6">
                    <h3 className="text-xl md:text-xl min-h-[1.5em] lg:text-xl font-bold text-gray-800">
                      {blog.title.length > 30
                        ? `${blog.title.slice(0, 35)}...`
                        : blog.title}
                    </h3>
                    <p className="text-sm min-h-[3em] text-gray-600 mt-1 line-clamp-3">
                      {blog.description && blog.description.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ")}
                    </p>
                    <div className="mt-4"></div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-gray-600">
                        <button className="bg-[#b82025] whitespace-nowrap text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-all">
                          Read More
                        </button>

                        <div className="flex gap-4">
                          {/* Social Share component */}
                          <div onClick={(e) => handleShareClick(e, blog)}>
                            <SocialShare
                              title={blog.title}
                              url={`${window.location.origin}/blogdetailpage/${blog.slug}`}
                              contentType="blog"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center w-full">No blogs available.</div>
          )}
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={handleNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md md:hidden flex items-center justify-center border border-gray-200 nav-btn"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

// Export the ID mapping for use in other components
export { blogIdMap };
export default BlogComponent;
