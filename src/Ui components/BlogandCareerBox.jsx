import React, { useState } from "react";
import CustomButton from "./CustomButton";

const BlogandCareerBox = ({ boxData, blogData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const Images=import.meta.env.VITE_IMAGE_BASE_URL;

  const handleSeeMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSeeLess = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const displayedBlogs = blogData?.data?.slice(
    0,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render blogs */}
        {displayedBlogs?.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={`${Images}/${blog.image}`}
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
                  <span>........</span>
                )}
              </div>
              <div className="mt-4">
                <CustomButton
                  text="Read More"
                  to={`/blogdetailpage/${blog._id}`}
                />
              </div>
            </div>
          </div>
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
