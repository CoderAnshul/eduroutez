import React, { useEffect, useState, useRef } from 'react';
import { blogById, getRecentBlogs } from '../ApiFunctions/api';
import { useParams, Link } from 'react-router-dom';

const BlogDetailPage = () => {
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
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

    const fetchRecentBlogs = async () => {
      try {
        const response = await getRecentBlogs();
        if (response && response.data?.result) {
          const filteredBlogs = response.data?.result
            .filter(blog => blog.id !== parseInt(id))
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);
          setRecentBlogs(filteredBlogs);
        }
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
      }
    };

    fetchBlog();
    fetchRecentBlogs();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto mt-10 p-4 text-center text-red-600">
        An error occurred while loading the blog. Please try again later.
      </div>
    );
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-[1300px] mx-auto mt-10 p-4">
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

          {data?.description && (
            <div ref={overviewRef} className="space-y-4">
              <div className="flex flex-col lg:flex-row lg:space-x-6 mt-6 ">
                <div className="lg:w-4/5 ">
                  <h3 className="text-lg font-semibold border-b pb-2">Overview</h3>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </div>

                <div className="lg:w-1/5 md:w-[30%] h-full min-w-[200px] mt-8  lg:mt-0">
                  <div className='sticky top-20'>
                    <h3 className="text-lg font-semibold mb-4">Recently Uploaded Blogs</h3>
                    <div className="space-y-4">
                      {recentBlogs?.map((blog) => (
                        <Link key={blog.id} to={`/blogdetailpage/${blog?._id}`}>
                          <div className="flex items-center p-3 bg-white rounded-lg shadow-md">
                            <div className="w-1/3">
                              <img
                                src={`${Images}/${blog?.thumbnail  }`}
                                alt={blog.title}
                                className="w-full h-20 object-cover rounded-md"
                              />
                            </div>
                            <div className="w-2/3 ml-3">
                              <h4 className="text-md font-medium text-gray-800 truncate">{blog.title}</h4>
                              <p className="text-sm text-gray-600 truncate" dangerouslySetInnerHTML={{ __html: blog.description.split(' ').slice(0, 30).join(' ') + '...' }}></p>
                              <span className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </Link>
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
