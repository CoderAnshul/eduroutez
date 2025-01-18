import React, { useState } from 'react';
import agricultureImg from '../assets/Images/agriculture.jpg';
import BlogCard from '../Ui components/BlogCard';
import CustomButton from '../Ui components/CustomButton';
import { getBlogs } from '../ApiFunctions/api';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const BlogComponent = () => {
  const [content, setContent] = useState([]);
  const { data, isLoading, isError } = useQuery(
    ["blog"],
    () => getBlogs(),
    {
      enabled: true,
      onSuccess: (data) => {
        console.log("Received data:", data); // Check the response structure
        const blogs = data?.data || []; // Directly access the data array
        setContent(blogs); // Set the blogs directly
      }
    }
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading blogs</div>;
  }

  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
      {/* Section Header */}
      <div className='flex items-center justify-between mb-10'>
        <h3 className='text-3xl font-semibold text-gray-900'>Latest Blogs</h3>
 <Link to="/blogpage">
          <button className='bg-red-500 text-white py-2 px-4 rounded'>
            View more
          </button>
        </Link>        </div>

      {/* Blog Cards Container */}
      <div className="blogCont grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(content) && content.length > 0 ? (
          content.slice(0, 3).map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
            >
              {/* Image */}
              <div className="h-56 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center rounded-t-xl"
                  src={blog.image || agricultureImg} // Fallback image
                  alt={blog.title}
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-800">{blog.title}</h4>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{blog.description}</p>
                <div className="mt-4">
                  <Link to={`/blogdetailpage/${blog._id}`}>
                    <button className="bg-red-600 text-white mt-4 py-2 px-6 rounded-lg hover:bg-red-700 transition-all">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full">No blogs available.</div>
        )}
      </div>
    </div>
  );
};

export default BlogComponent;
