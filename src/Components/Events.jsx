import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import event2 from '../assets/Images/EventWebinar_02.jpg';
import event1 from '../assets/Images/EventWebinar_01.jpg';
import "../assets/swipers/eventsStyle.css";

const Events = ({ className = "" }) => {
  const slides = [
    { id: 1, img: event1, title: '' },
    { id: 2, img: event2, title: '' },
    { id: 3, img: event1, title: '' },
  ];

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
              <img className="w-full h-full object-cover" src={slide.img} alt={`slide-${slide.id}`} />
              <div className="h-full w-full text-white flex justify-end pb-16 pl-[4vw] md:pl-[100px] flex-col absolute left-0 top-0 z-50 bg-[#00000075]">
                {/* <h6 className="text-md font-semibold">Join us</h6>
                <h2 className="text-4xl font-semibold mb-6">{slide.title}</h2> */}
                {/* <Link>
                  <button className="text-white text-sm flex transition-transform transform active:scale-95 hover:scale-105 items-center py-3 mt-3 px-4 bg-blue-600 gap-1">
                    Join now
                    <img className="h-5" src={uparrow} alt="arrow" />
                  </button>
                </Link> */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Events;
