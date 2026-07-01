import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import uparrow from "../assets/Images/uparrow.png";

import "../assets/swipers/conseling.css";

const ConsellingBanner = React.memo(({ className = "" }) => {
  const slides = useMemo(
    () => [
      {
        id: 1,
        img: "/1.png",
        title: "Struggling with Career Choices? Get Expert Guidance Today.",
        subtitle: "",
      },
      { id: 2, img: "/2.png", title: "Your Future, Your Choice – Let’s Plan It Together.", subtitle: "" },
      { id: 3, img: "/3.png", title: "Confused About Your Career Path? We Can Help.", subtitle: "" },
      { id: 4, img: "/4.png", title: "Unlock Your True Potential with Career Counseling.", subtitle: "" },
      { id: 5, img: "/5.png", title: "Make Smart Career Decisions with Expert Advice.", subtitle: "" },
    ],
    []
  );

  return (
    <div
      className={`custom-banner-wrapper relative w-full lg:w-1/2 sm:grow min-w-0 bg-gray-300 ${className}`}
    >
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="counselling-swiper"
        slidesPerView={1}
        spaceBetween={0}
        observer={true}
        observeParents={true}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content-wrapper relative bg-gray-300">
              <img
                className="object-cover object-left sm:object-center"
                src={slide.img}
                alt={`slide-${slide.id}`}
                loading="lazy"
              />
              <div className="h-full w-full text-white flex flex-col justify-between 2xl:justify-start pt-12 pb-14 px-[5vw] md:px-[60px] items-end text-right absolute left-0 top-0 z-50 bg-[#00000075]">
                <div className="max-w-[65%] sm:max-w-[65%] md:max-w-[380px] flex flex-col items-end">
                  <h2 className="text-[20px] sm:text-[32px] md:text-[36px] font-semibold text-white leading-tight">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <h3 className="text-xl md:text-2xl text-white mt-2 font-medium">
                      {slide.subtitle}
                    </h3>
                  )}
                </div>
                <Link to="/counselor">
                  <button className="text-white mt-10 text-sm flex transition-transform transform active:scale-95 hover:scale-105 items-center py-3 px-5 bg-blue-600 gap-1 font-medium">
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
});

export default ConsellingBanner;
