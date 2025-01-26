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
import { data } from 'autoprefixer';

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const RecruitersSlider = ({instituteData}) => {
  const[image,setImage]=useState([]);
  const [imageUrls, setImageUrls] = useState({});
  // Array of imported images
  const images = [com1, com2, com3, com4, com5, com6, com7];
  // console.log(instituteData?.data?._id)
  useEffect(()=>{
      fetchData()
  },[])

  const fetchData= async ()=>{
    
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/recruiters-by-institute/${instituteData?.data?._id}`)
    const json = await response.json()
    setImage(json?.data)
  }
  // console.log(image)
  const fetchImages = async (image,id)=>{
    const imageResponse = await fetch(`${Images}/${image}`);
    const imageBlob = await imageResponse.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImageUrls(prevState => ({ ...prevState, [id]: imageObjectURL }));
  }

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
        {image.map((image, index) => {
          const imageSrc = fetchImages(image?.image, image?._id)
          // console.log(imageSrc)
          return <SwiperSlide key={index}>
            <img
              src={imageUrls[image._id]}
              alt={`Recruiter ${index + 1}`}
              className="w-full h-auto  object-contain"
            />
          </SwiperSlide>
})}
      </Swiper>
    </div>
  );
};

export default RecruitersSlider;
