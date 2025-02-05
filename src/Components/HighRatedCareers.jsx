import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import CustomButton from '../Ui components/CustomButton';
import { useQuery } from 'react-query';
import { career } from '../ApiFunctions/api';

const HighRatedCareers = () => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});

  const Images=import.meta.env.VITE_IMAGE_BASE_URL;


  const { data, isLoading, isError } = useQuery(
    ["career"],
    () => career(),
    {
      enabled: true,
      onSuccess: async (data) => {
        const { result } = data?.data || {}; // safely access result
        if (result) {
          setContent(result); // update content if result is not null or undefined

          // Fetch images for each career
          const imagePromises = result.map(async (career) => {
            if (career.thumbnail) {
              const imageResponse = await fetch(`${Images}/${career.thumbnail}`);
              const imageBlob = await imageResponse.blob();
              const imageObjectURL = URL.createObjectURL(imageBlob);
              return { id: career._id, url: imageObjectURL };
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
        URL.revokeObjectURL(url);
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
          <Link to={`/detailpage/${box._id}`} key={index} className="box lg:max-w-[450px] shadow-lg">
            <div className="imageContainer">
              <img className='h-full w-full object-cover' src={images[box._id] || cardPhoto} alt="boxphoto" />
            </div>
            <div className="textContainer">
              <h3 className='text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]'>
                {box?.title || 'Untitled'}
              </h3>

              <p className='text-sm mt-2' dangerouslySetInnerHTML={{ __html: box?.description?.slice(0, 80) + "..." || "No description available" }}></p>
            </div>
          </Link>
        )) : <div className="w-full text-center">No careers available at the moment.</div>}
      </div>
    </div>
  );
};

export default HighRatedCareers;