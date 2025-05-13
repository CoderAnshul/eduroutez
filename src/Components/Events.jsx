import React, { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import event2 from '../assets/Images/EventWebinar_02.jpg';
import event1 from '../assets/Images/EventWebinar_01.jpg';
import "../assets/swipers/eventsStyle.css";

const slides = [
  { id: 1, img: event1, title: '' },
  { id: 2, img: event2, title: '' },
  { id: 3, img: event1, title: '' },
];

const Events = memo(({ className = "" }) => {
  return (
    <div className={`relative h-[420px] w-full sm:w-1/2 bg-gray-300 ${className}`}>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="events-swiper"
        slidesPerView={1}
        spaceBetween={0}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[420px] w-full bg-gray-300">
              <img
                className="w-full h-full object-cover"
                src={slide.img}
                alt={`slide-${slide.id}`}
                loading="lazy"
              />
              <div className="h-full w-full text-white flex justify-end pb-16 pl-[4vw] md:pl-[100px] flex-col absolute left-0 top-0 z-50 bg-[#00000075]">
                {/* Content can be added here */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

export default Events;
