import React, { useEffect, useState, useRef } from 'react';
import { blogById } from '../ApiFunctions/api';
import { useParams } from 'react-router-dom';

const BlogDetailPage = () => {
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const { id } = useParams();
  const overviewRef = useRef(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await blogById(id);
        setData(response.data);
        const imageResponse = await fetch(`http://localhost:4001/api/uploads/${response.data.image}`);
        const imageBlob = await imageResponse.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectURL);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <img
            className="w-full h-80 object-cover"
            src={imageUrl}
            alt={data.title}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center">{data.title}</h1>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex space-x-4">
            <img
              className="h-10 w-10 rounded-full"
              src={`http://localhost:4001/api/uploads/${data.metaImage}`}
              alt="Meta"
            />
            <div className="">
              <h2 className="text-2xl font-semibold">{data.metaTitle}</h2>
              <p className="text-gray-600">{new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-gray-700">{data.metaDescription}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.metaKeywords.split(",").map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
          <div ref={overviewRef} className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Overview</h3>
            <p className="text-gray-700">{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;