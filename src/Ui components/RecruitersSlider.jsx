import React from 'react';
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

const RecruitersSlider = () => {
  // Array of imported images
  const images = [com1, com2, com3, com4, com5, com6, com7];

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl mb-5 sm:p-4 ">
      <h3 className="text-xl font-bold">Top Recruiters At IISC Bangalore</h3>
      <Swiper
        slidesPerView={'auto'}
        navigation={true}
        spaceBetween={30}
        loop={true}
        mousewheel={true}
        autoplay={{
          delay: 1, // Slight delay to avoid conflicts (imperceptible to users)
          disableOnInteraction: false, // Continue autoplay after interaction
        }}
        speed={3000} // Reasonable speed for smooth transitions
        modules={[Navigation, Mousewheel, Autoplay]}
        className="myRecruitersSwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Recruiter ${index + 1}`}
              className="w-full h-auto  object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecruitersSlider;
