import React, { useEffect, useState, useRef } from 'react';
import { blogById } from '../ApiFunctions/api';
import { useParams } from 'react-router-dom';


const blogs = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/100x80", // Replace with actual image URLs
    title: "How to Build Modern Web Apps",
    description: "Learn the basics of building modern web applications using React and TailwindCSS.",
    date: "January 20, 2025",
  },
  {
    id: 2,
    imageUrl: "https://via.placeholder.com/100x80",
    title: "Top Design Trends of 2025",
    description: "Explore the latest design trends that will shape the creative industry this year.",
    date: "January 22, 2025",
  },
  {
    id: 3,
    imageUrl: "https://via.placeholder.com/100x80",
    title: "Understanding JavaScript Closures",
    description: "A deep dive into closures, one of the most important concepts in JavaScript.",
    date: "January 24, 2025",
  },
  {
    id: 4,
    imageUrl: "https://via.placeholder.com/100x80",
    title: "Mastering CSS Grid Layout",
    description: "Learn how to effectively use CSS Grid to create complex web layouts with ease.",
    date: "January 25, 2025",
  },
];


const BlogDetailPage = () => {
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const { id } = useParams();
  const overviewRef = useRef(null);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
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

    fetchBlog();

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  // Error handling
  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 text-center text-red-600">
        An error occurred while loading the blog. Please try again later.
      </div>
    );
  }

  // Loading state
  if (!data) {
    return <div>Loading...</div>;
  }

  // Safely render blog details
  return (
    <div className="mx-auto mt-10 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
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

          {data.description && (
            <div ref={overviewRef} className="space-y-4">
             <div className="md:flex lg:space-x-6 mt-6">
                {/* Main Content Section */}
                <div className="lg:w-4/5">
                  <h3 className="text-lg font-semibold border-b pb-2">Overview</h3>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </div>

                {/* Recently Uploaded Blogs Section */}
                <div className="lg:w-1/5 md:w-[30%] h-full mt-8 lg:mt-0">
                  <div className='sticky top-20'>
                  <h3 className="text-lg font-semibold mb-4">Recently Uploaded Blogs</h3>
                  <div className="space-y-4">
                    {/* Blog Box */}
                    {blogs.map((blog) => (
                      <div key={blog.id} className="flex items-center p-3 bg-white rounded-lg shadow-md">
                        {/* Blog Image */}
                        <div className="w-1/3">
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-20 object-cover rounded-md"
                          />
                        </div>
                        {/* Blog Details */}
                        <div className="w-2/3 ml-3">
                          <h4 className="text-md font-medium text-gray-800 truncate">{blog.title}</h4>
                          <p className="text-sm text-gray-600 truncate">{blog.description}</p>
                          <span className="text-xs text-gray-500">{blog.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;