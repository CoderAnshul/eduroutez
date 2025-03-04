import React, { useState, useEffect } from 'react';
import agricultureImg from '../assets/Images/agriculture.jpg';
import BlogCard from '../Ui components/BlogCard';
import CustomButton from '../Ui components/CustomButton';
import { getBlogs, blogById } from '../ApiFunctions/api';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import SocialShare from './SocialShare';

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

// In-memory mapping to store blog IDs by slug
const blogIdMap = {};

const BlogComponent = () => {
  const [content, setContent] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [error, setError] = useState(null);
  const [datas, setData] = useState(null);

  const { data, isLoading, isError } = useQuery(
    ["blog"],
    () => getBlogs(),
    {
      enabled: true,
      onSuccess: (data) => {
        console.log("Received data:", data);
        const blogs = data?.data?.result || [];
        
        // Store the ID mapping for each blog using the slug from backend
        blogs.forEach(blog => {
          if (blog.slug) {
            blogIdMap[blog.slug] = blog._id;
          }
        });
        
        // Make the mapping available globally
        window.blogIdMap = blogIdMap;
        
        setContent(blogs);
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
          setImageUrls(prevState => ({ ...prevState, [id]: imageObjectURL }));
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error);
      }
    };

    // Fetch blog data for each blog in content
    Array.isArray(content) && content.forEach(blog => fetchBlog(blog._id));

    return () => {
      Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [content]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading blogs</div>;
  }

  // Handle share click to prevent navigation
  const handleShareClick = (e, blog) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
      <div className='flex items-center justify-between mb-10'></div>
      <div className='flex items-center justify-between mb-10'>
        <h3 className='text-xl font-bold'>Latest Blogs</h3>
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
            <div key={index} className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative">
              {/* Image and main content wrapped in Link */}
              <Link to={`/blogdetailpage/${blog.slug}`} className="block">
                {/* Image */}
                <div className="h-56 min-h-56 max-h-56 w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-top rounded-t-xl"
                    src={`${Images}/${blog?.thumbnail}`}
                    alt={blog.title}
                  />
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl md:text-xl lg:text-2xl font-semibold text-gray-800">
                    {blog.title.length > 30 ? `${blog.title.slice(0,35)}...` : blog.title}
                  </h3>
                  <p className="text-sm h-16 text-gray-600 mt-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.description }}></p>
                  <div className="mt-4">
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
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-gray-600">
                      <button className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-all">
                        Read More
                      </button>
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
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center w-full">No blogs available.</div>
        )}
      </div>
    </div>
  );
};

// Export the ID mapping for use in other components
export { blogIdMap };
export default BlogComponent;