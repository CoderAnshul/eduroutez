import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import com1 from '../assets/Images/brand1.png';
import com2 from '../assets/Images/brand2.png';
import com3 from '../assets/Images/brand3.png';
import com4 from '../assets/Images/brand4.png';
import com5 from '../assets/Images/brand5.png';
import com6 from '../assets/Images/brand6.png';
import com7 from '../assets/Images/brand7.png';

import "../assets/swipers/RecruitersSlider.css";

import { Navigation, Mousewheel, Autoplay } from 'swiper/modules';

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const RecruitersSlider = ({instituteData}) => {
  const [recruiters, setRecruiters] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  
  // Fetch recruiters data
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/recruiters-by-institute/${instituteData?.data?._id}`);
        const json = await response.json();
        setRecruiters(json?.data || []);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
      }
    };
    
    if (instituteData?.data?._id) {
      fetchRecruiters();
    }
  }, [instituteData?.data?._id]);

  // Fetch images for all recruiters
  useEffect(() => {
    const loadImages = async () => {
      const newImageUrls = {};
      
      for (const recruiter of recruiters) {
        if (recruiter.image && !imageUrls[recruiter._id]) {
          try {
            const imageResponse = await fetch(`${Images}/${recruiter.image}`);
            const imageBlob = await imageResponse.blob();
            newImageUrls[recruiter._id] = URL.createObjectURL(imageBlob);
          } catch (error) {
            console.error(`Error loading image for recruiter ${recruiter._id}:`, error);
          }
        }
      }
      
      setImageUrls(prev => ({...prev, ...newImageUrls}));
    };

    loadImages();
    
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [recruiters]);

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl mb-5 sm:p-4">
      <h3 className="text-xl font-bold">{`Top Recruiters At ${instituteData?.data?.instituteName}`}</h3>
      <Swiper
        slidesPerView={'auto'}
        navigation={true}
        spaceBetween={30}
        loop={true}
        mousewheel={true}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        speed={3000}
        modules={[Navigation, Mousewheel, Autoplay]}
        className="myRecruitersSwiper"
      >
        {recruiters.map((recruiter, index) => (
          <SwiperSlide key={recruiter._id || index}>
            <img
              src={imageUrls[recruiter._id]}
              alt={`Recruiter ${index + 1} at ${instituteData?.data?.name}`}
              className="w-full h-auto object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecruitersSlider;