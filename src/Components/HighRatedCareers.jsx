import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import CustomButton from '../Ui components/CustomButton';
import { useQuery } from 'react-query';
import { career } from '../ApiFunctions/api';
import SocialShare from './SocialShare';

const HighRatedCareers = () => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  // Initialize careerIdMap from localStorage
  useEffect(() => {
    try {
      const storedCareerIdMap = JSON.parse(localStorage.getItem('careerIdMap') || '{}');
      window.careerIdMap = storedCareerIdMap;
    } catch (error) {
      console.error('Error loading careerIdMap from localStorage:', error);
      window.careerIdMap = {};
    }
  }, []);

  const handleShareClick = (e, blog) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation(); // Stop event from bubbling up
    // Any additional share handling logic can go here
  };

  const { data, isLoading, isError } = useQuery(
    ["career"],
    () => career(),
    {
      enabled: true,
      onSuccess: async (data) => {
        const { result } = data?.data || {}; // safely access result
        if (result) {
          // Update careerIdMap
          const careerIdMap = { ...window.careerIdMap };
          
          result.forEach(blog => {
            if (blog.slug) {
              careerIdMap[blog.slug] = blog._id;
            }
          });
          
          // Save to window and localStorage
          window.careerIdMap = careerIdMap;
          localStorage.setItem('careerIdMap', JSON.stringify(careerIdMap));
          
          setContent(result); // update content if result is not null or undefined

          // Fetch images for each career
          const imagePromises = result.map(async (career) => {
            if (career.thumbnail) {
              try {
                const imageResponse = await fetch(`${Images}/${career.thumbnail}`);
                const imageBlob = await imageResponse.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                return { id: career._id, url: imageObjectURL };
              } catch (error) {
                console.error(`Error fetching image for career ${career._id}:`, error);
                return { id: career._id, url: cardPhoto };
              }
            }
            return { id: career._id, url: cardPhoto };
          });

          const imageResults = await Promise.all(imagePromises);
          const imageMap = imageResults.reduce((acc, image) => {
            acc[image.id] = image.url;
            return acc;
          }, {});
          setImages(imageMap);
        }
      },
    }
  );

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(images).forEach((url) => {
        if (url !== cardPhoto) {  // Don't revoke static images
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading career</div>;
  }

  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <h3 className='text-xl font-bold'>High Rated careers</h3>
        <Link to="/careerspage">
          <button className='bg-red-500 text-white py-2 px-4 rounded'>
            View more
          </button>
        </Link>
      </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {(content && content.length > 0) ? content.map((box, index) => (
          <Link to={`/detailpage/${box.slug}`} key={index} className="box lg:max-w-[450px] shadow-lg">
            <div className="imageContainer">
              <img className='h-full w-full object-cover' src={images[box._id] || cardPhoto} alt="boxphoto" />
            </div>
            <div className="textContainer">
              <h3 className='text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]'>
                {box?.title || 'Untitled'}
              </h3>

              <p className='text-sm mt-2' dangerouslySetInnerHTML={{ __html: box?.description?.slice(0, 80) + "..." || "No description available" }}></p>
              <div className='flex items-center justify-between px-4 w-full mt-2'>
                {box.views && (
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
                    <span className='text-gray-500'>{box.views}</span>
                  </div>
                )}
                <div className='flex items-center gap-2 text-gray-600' onClick={(e) => handleShareClick(e, box)}>
                  <SocialShare 
                    title={box.title} 
                    url={`${window.location.origin}/detailpage/${box.slug}`}
                    contentType="career"
                  />
                </div>
              </div>
            </div>
          </Link>
        )) : <div className="w-full text-center">No careers available at the moment.</div>}
      </div>
    </div>
  );
};

export default HighRatedCareers;