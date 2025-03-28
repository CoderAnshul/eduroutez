import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import uparrow from "../assets/Images/uparrow.png";
import banner from "../assets/Images/Counsellor Image_01.jpg";
import banner2 from "../assets/Images/Counsellor Image_02.jpg";
import banner3 from "../assets/Images/Counsellor Image_03.jpg";

import banner4 from "../assets/Images/Counsellor Image_04.jpg";
import banner5 from "../assets/Images/Counsellor Image_05.jpg";
import banner6 from "../assets/Images/Counsellor Image_06.jpg";
import banner7 from "../assets/Images/Counsellor Image_07.jpg";

import banner8 from "../assets/Images/Counsellor Image_08.jpg";

import "../assets/swipers/conseling.css";

const ConsellingBanner = ({ className = "" }) => {
  const slides = [
    {
      id: 1,
      img: banner,
      title: "",
      subtitle: "",
    },
    { id: 2, img: banner2, title: "", subtitle: "" },
    { id: 3, img: banner3, title: "", subtitle: "" },
    { id: 4, img: banner4, title: "", subtitle: "" },
    { id: 5, img: banner5, title: "", subtitle: "" },
    { id: 6, img: banner6, title: "", subtitle: "" },
    { id: 7, img: banner7, title: "", subtitle: "" },
    { id: 8, img: banner8, title: "", subtitle: "" },
  ];

  return (
    <div
      className={`relative h-[420px] w-full overflow-hidden sm:w-1/2 bg-gray-300 ${className}`}
    >
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="counselling-swiper"
        slidesPerView={1}
        spaceBetween={0}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[420px]  bg-gray-300">
              <img
                className="w-full h-full object-cover"
                src={slide.img}
                alt={`slide-${slide.id}`}
              />
              <div className="h-full w-full text-white flex justify-end pb-16 pl-[4vw] md:pl-[100px] flex-col absolute left-0 top-0 z-50 bg-[#00000075]">
                <h2 className="text-[40px] font-semibold mb-6 text-red-500">
                  {slide.title}
                  <h3 className="text-3xl text-white">{slide.subtitle}</h3>
                </h2>
                <Link to="/counselor">
                  <button className="text-white text-sm flex transition-transform transform active:scale-95 hover:scale-105 items-center py-3 mt-3 px-4 bg-blue-600 gap-1">
                    Book Counseling
                    <img className="h-5" src={uparrow} alt="arrow" />
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ConsellingBanner;
