import React from 'react';
import img1 from '../assets/Images/Information Technology.jpg';
import img2 from '../assets/Images/Medical.jpg';
import img3 from '../assets/Images/Engineering.jpg';
import img4 from '../assets/Images/Hospitality & Tourism.jpg';
import img5 from '../assets/Images/Management.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import '../assets/swipers/counselling.css';

const imagesArray = [
  { img: img1, title: "Information Technology", title2: "", category: "Information Technology" },
  { img: img2, title: "Medical", title2: "", category: "Medical" },
  { img: img3, title: "Engineering", title2: "", category: "Engineering" },
  { img: img4, title: "Hospitality & Tourism", title2: "", category: "Hospitality & Tourism" },
  { img: img5, title: "Management", title2: "", category: "Management" }
];

const Counselling = () => {
  const navigate = useNavigate();

  const handleCardClick = (selectedCategory) => {
    navigate(`/counselor?category=${selectedCategory}`);
  };

  return (
    <div className="w-full max-w-[1420px] min-h-44 pl-[10px] pb-10">
      

        <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold">Admission Counselling</h3>
        <Link to="/counselor">
                <button className="bg-red-500 text-white py-2 px-4 rounded">
                  View more
                </button>
              </Link>
            </div>

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