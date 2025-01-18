import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import CustomButton from '../Ui components/CustomButton';
import { useQuery } from 'react-query';
import { popularCourses } from '../ApiFunctions/api';

const PopularCourses = () => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});
  const imageBaseURL = import.meta.env.VITE_BASE_URL;
  const { data, isLoading, isError } = useQuery(
    ["popularCourses"],
    () => popularCourses(),
    {
      enabled: true,
      onSuccess: (data) => {
        const { result } = data.data;
        setContent(result);
      }
    }
  );

  useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = content.map(async (box) => {
        const response = await fetch(`${import.meta.env.VITE_IMAGE_BASE_URL}/${box.coursePreviewThumbnail}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return { id: box.id, url };
      });

      const imageResults = await Promise.all(imagePromises);
      const imageMap = imageResults.reduce((acc, image) => {
        acc[image.id] = image.url;
        return acc;
      }, {});

      setImages(imageMap);
    };

    if (content.length > 0) {
      fetchImages();
    }
  }, [content]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading popular courses</div>;
  }

  return (
    <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <h3 className='text-xl font-bold'>Popular Courses</h3>
        <Link to="/popularcourses">
          <button className='bg-red-500 text-white py-2 px-4 rounded'>
            View more
          </button>
        </Link>
      </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {content.map((box, index) => (
          <Link to={`/coursesinfopage/${box._id}`} key={index} className="box lg:max-w-[500px] shadow-lg">
            <div className="imageContainer">
              <img className='h-full w-full object-cover' src={images[box.id] || cardPhoto} alt="boxphoto" />
            </div>
            <div className="textContainer">
              <h3 className='text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]'>
                {box.courseTitle}
              </h3>
              <p className='text-sm mt-2' dangerouslySetInnerHTML={{ __html: box.longDescription }} ></p>
              <h3 className='flex items-center mt-2 text-2xl font-bold text-[#000000c4]'>
                <img className='h-5 mt-1 opacity-70' src={rupee} alt="rupee" />
                {box.isCourseFree ? "0" : box.price}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PopularCourses;
