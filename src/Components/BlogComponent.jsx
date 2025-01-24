import React, { useState, useEffect } from 'react';
import agricultureImg from '../assets/Images/agriculture.jpg';
import BlogCard from '../Ui components/BlogCard';
import CustomButton from '../Ui components/CustomButton';
import { getBlogs, blogById } from '../ApiFunctions/api'; // Import blogById
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const BlogComponent = () => {
  const [content, setContent] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchBlog = async (id) => {
      try {
        const response = await blogById(id);
        if (!response || !response.data) {
          setError(new Error('No blog data found'));
          return;
        }
        setData(response.data);

        // Safely handle image fetching
        if (response.data.image) {
          const imageResponse = await fetch(`${Images}/${response.data.image}`);
          const imageBlob = await imageResponse.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setImageUrl(imageObjectURL);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error);
      }
    };

    // Fetch blog data for each blog in content
    content.forEach(blog => fetchBlog(blog._id));

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [content]);

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
        </Link>
      </div>

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
                  src={imageUrl || agricultureImg} // Fallback image
                  alt={blog.title}
                />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-800">{blog.title}</h4>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.description }}></p>
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
