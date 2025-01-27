import React from 'react';
import img1 from '../assets/Images/mbbs.jpg';
import img2 from '../assets/Images/btech2.jpg';
import img3 from '../assets/Images/msc.png';
import img4 from '../assets/Images/masters.png';
import img5 from '../assets/Images/mch.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import '../assets/swipers/counselling.css';

const imagesArray = [
  { img: img1, title: "MBBS", title2: "India", category: "MBBS" },
  { img: img2, title: "B.Tech", title2: "India", category: "B.Tech" },
  { img: img3, title: "MSC", title2: "India", category: "MSC" },
  { img: img4, title: "Masters", title2: "India", category: "Masters" },
  { img: img5, title: "MCH", title2: "India", category: "MCH" }
];

const Counselling = () => {
  const navigate = useNavigate();

  const handleCardClick = (selectedCategory) => {
    navigate(`/counselor?category=${selectedCategory}`);
  };

  return (
    <div className="w-full max-w-[1420px] min-h-44 pl-[10px] pb-10">
      <h3 className="text-lg md:text-xl font-bold mb-10">
        Admission Counselling
      </h3>
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        navigation={true}
        freeMode={true}
        modules={[Navigation]}
        className="myCounsellingSwiper"
      >
        {imagesArray.map((item, index) => (
          <SwiperSlide key={index}>
            <div onClick={() => handleCardClick(item.category)}>
              <div className="w-full h-full rounde-lg overflow-hidden bg-white rounded shadow-md flex flex-col items-center">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full h-32 object-cover rounded-xl"
                />
                <div className="absolute left-3 z-50">
                  <h4 className="text-xl mt-3 text-white font-semibold">
                    {item.title}
                  </h4>
                  <h4 className="text-xl -mt-1 text-white font-semibold">
                    {item.title2}
                  </h4>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Counselling;