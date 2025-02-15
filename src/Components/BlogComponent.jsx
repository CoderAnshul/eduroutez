import React, { useState, useEffect } from 'react';
import agricultureImg from '../assets/Images/agriculture.jpg';
import BlogCard from '../Ui components/BlogCard';
import CustomButton from '../Ui components/CustomButton';
import { getBlogs, blogById } from '../ApiFunctions/api'; // Import blogById
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

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
        console.log("Received data:", data); // Check the response structure
        const blogs = data?.data?.result || []; // Directly access the data array
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

  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
      {/* Section Header */}
      <div className='flex items-center justify-between mb-10'>
        {/* <h3 className='text-3xl font-semibold text-gray-900'>Latest Blogs</h3> */}
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
            <Link to={`/blogdetailpage/${blog._id}`} key={index} className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden">
              {/* Image */}
              <div className="h-56 min-h-56 max-h-56 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover object-top rounded-t-xl"
                  src={`${Images}/${blog?.thumbnail}`} // Use the correct image URL for each blog
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
                  <button className="bg-red-600 text-white mt-4 py-2 px-6 rounded-lg hover:bg-red-700 transition-all">
                    Read More
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center w-full">No blogs available.</div>
        )}
      </div>
    </div>
  );
};

export default BlogComponent;
