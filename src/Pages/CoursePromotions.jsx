import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from 'react-query';
import axiosInstance from '../ApiFunctions/axios';

const baseURL = import.meta.env.VITE_BASE_URL;
const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const fetchPromotions = async () => {
  const response = await axiosInstance.get(`${baseURL}/promotions?limit=10000`, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken'),
      'x-refresh-token': localStorage.getItem('refreshToken')
    }
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch promotions');
  }
  return response.data;
};

const Promotions = ({ location }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { data: promotionsData, isLoading, isError } = useQuery(
    'promotions',
    fetchPromotions,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2
    }
  );

  const filteredPromotions = promotionsData?.data?.result?.filter(promo => 
    promo.location === location
  );

  const needsSlider = filteredPromotions?.length > 1;

  useEffect(() => {
    if (needsSlider && !isHovered) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => 
          prev === filteredPromotions.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [needsSlider, filteredPromotions?.length, isHovered]);

  const handleSlideChange = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prev) => 
        prev === filteredPromotions.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentSlide((prev) => 
        prev === 0 ? filteredPromotions.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-lg" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !filteredPromotions?.length) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div 
          className="relative overflow-hidden rounded-lg group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows */}
          {needsSlider && (
            <>
              <button 
                onClick={() => handleSlideChange('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleSlideChange('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Slides Container */}
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${filteredPromotions.length * 100}%`,
            }}
          >
            {filteredPromotions.map((promo) => (
              <div
                key={promo._id}
                className="relative min-w-full group cursor-pointer"
                onClick={() => {
                  if (promo.link) {
                    window.location.href = promo.link;
                  }
                }}
              >
                {/* Image with Overlay */}
                <div className="relative aspect-video overflow-hidden">
                  {promo.image && (
                    <img
                      src={`${imageUrl}/${promo.image}`}
                      alt={promo.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {promo.title}
                  </h3>
                  {promo.description && (
                    <p className="text-sm text-white/90 mb-2">
                      {promo.description}
                    </p>
                  )}
                  {promo.link && (
                    <p className="text-sm text-white/90 underline hover:text-white">
                      Learn more
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          {needsSlider && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {filteredPromotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'w-6 bg-white' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions;