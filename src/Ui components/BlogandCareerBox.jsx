import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import SocialShare from "../Components/SocialShare";

const BlogandCareerBox = ({ boxData, blogData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  const handleSeeMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSeeLess = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const handleShareClick = (e, blog) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation(); // Stop event from bubbling up
    // Any additional share handling logic can go here
  };
  const displayedBlogs = blogData?.slice(
    0,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render blogs */}
        {displayedBlogs?.map((blog) => (
          <Link
            key={blog._id}
            to={`/blogdetailpage/${blog._id}`}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={`${Images}/${blog?.thumbnail}`}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4 flex flex-col justify-between h-[215px]">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {blog.title}
                </h3>
                <p
                  className="text-sm h text-gray-600 mt-2 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: blog.description
                      ? blog.description.split(" ").slice(0, 30).join(" ")
                      : "",
                  }}
                ></p>
                {blog.description &&
                  blog.description.split(" ").length > 30 && (
                    <span>....</span>
                  )}
                <p className="text-sm text-gray-600 mt-2 bg-blue-100 p-1 rounded-lg inline-block">
                  <badge>
                    {blog.category}
                    </badge> 
                </p>
              </div>

              <div className='flex items-center gap-2 text-gray-600'>
                      {blog.views && (
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
                          <span className='text-gray-500'>{blog.views}</span>
                        </div>
                      )}
                      {blog.likes && blog.likes.length>0 && (
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
                            <path d="M14 9V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3z"></path>
                            <path d="M9 22V12"></path>
                          </svg>
                          <span className=''>{blog.likes.length>0 && blog.likes.length}</span>
                        </div>
                      )}
                       <div onClick={handleShareClick}>
      <SocialShare 
        title={blog?.title} 
        url={`${window.location.origin}/blogdetailpage/${blog._id}`}
        contentType="career"
      />
    </div>
                    </div>


              <div className="mt-4">
                <CustomButton
                  text="Read More"
                  to={`/blogdetailpage/${blog._id}`}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full flex justify-center gap-4 mt-24">
        {displayedBlogs.length < blogData?.data?.length && (
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

export default BlogandCareerBox;
