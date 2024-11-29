import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import Slidebtn from './Slidebtn';
import img1 from '../assets/Images/college1.jpg';
import img2 from '../assets/Images/college2.jpg';
import img3 from '../assets/Images/college3.jpg';
import star from '../assets/Images/star.png';
import gallery from '../assets/Images/galleryBtn.png';

const images = [
  img1,
  img2,
  img3,
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = () => {
    if (!isFullscreen) {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < images.length - 1) {
          return prevIndex + 1; 
        }
        return prevIndex; 
      });
    } else {
      setFullscreenIndex((prevIndex) => (prevIndex + 1) % images.length); 
    }
  };

  const prevSlide = () => {
    if (!isFullscreen) {
      setCurrentIndex((prevIndex) => {
        if (prevIndex > 0) {
          return prevIndex - 1; 
        }
        return prevIndex; 
      });
    } else {
      setFullscreenIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'Escape') setIsFullscreen(false); 
  };

  useEffect(() => {
    // Prevent background scroll when fullscreen is active
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  return (
    <div
      className="relative rounded-xl overflow-hidden max-h-[400px] w-full"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        {/* Normal Image Slider */}
        <div className="relative w-full h-full">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                index === currentIndex
                  ? 'translate-x-0'
                  : index === (currentIndex - 1 + images.length) % images.length
                  ? '-translate-x-full'
                  : index === (currentIndex + 1) % images.length
                  ? 'translate-x-full'
                  : ''
              }`}
            />
          ))}
        </div>

        {/* Gradient overlay on the right */}
        <div className="absolute top-0 right-0 text-end p-3 lg:w-[400px] h-full bg-gradient-to-l from-black to-transparent z-10">
          {/* You can add your rating component here */}
          <div className=" bottom-4 left-4 text-white">
            <span className="text-3xl font-semibold mb-3">#12</span> <br />
            <div className='flex items-center justify-end gap-2'>
            <img className='h-4' src={star} alt="" /> 
            <span className="text-md mt-2">(4.3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen button */}
      <Slidebtn onClick={() => setIsFullscreen(true)} ariaLabel="View fullscreen">
        {/* <Maximize2 className="h-4 w-4" /> */}
        <img src={gallery} alt="gallerybtn" />
      </Slidebtn>

      {/* Previous button for normal view */}
      <div className='absolute z-20 bottom-0 w-full gap-4 flex justify-end pr-8'>
      {!isFullscreen && (
        <button
          className="  p-3 rounded-full -translate-y-1/2 bg-white/80 hover:bg-white/90"
          onClick={prevSlide}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Next button for normal view */}
      {!isFullscreen && (
        <button
          className="   p-3 rounded-full z-20 -translate-y-1/2 bg-white/80 hover:bg-white/90"
          onClick={nextSlide}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      </div>
      {/* Fullscreen View */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center">
          <img
            src={images[fullscreenIndex]}
            alt={`Fullscreen view of slide ${fullscreenIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          {/* Close Fullscreen button */}
          <Slidebtn onClick={() => setIsFullscreen(false)} ariaLabel="Close fullscreen view">
            <X className="h-4 w-4" />
          </Slidebtn>
          {/* Fullscreen Previous button */}
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 p-3 rounded-md hover:bg-white/30"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {/* Fullscreen Next button */}
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 p-3 rounded-md hover:bg-white/30"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
