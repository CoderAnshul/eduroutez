import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import Slidebtn from './Slidebtn';
import star from '../assets/Images/star.png';
import gallery from '../assets/Images/galleryBtn.png';

const ImageSlider = ({ instituteData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const galleryImages = useMemo(() => instituteData.data.gallery, [instituteData]);

  const nextSlide = (isFullScreen = false) => {
    if (isFullScreen) {
      setFullscreenIndex((prev) => (prev + 1) % galleryImages.length);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, galleryImages.length - 1));
    }
  };

  const prevSlide = (isFullScreen = false) => {
    if (isFullScreen) {
      setFullscreenIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevSlide(isFullscreen);
    if (e.key === 'ArrowRight') nextSlide(isFullscreen);
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : 'auto';
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
        <div className="relative w-full h-full">
          {galleryImages.map((src, index) => (
            <img
              key={index}
              src={`http://localhost:4001/uploads/${src}`}
              alt={`Slide ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                index === currentIndex
                  ? 'translate-x-0'
                  : index < currentIndex
                  ? '-translate-x-full'
                  : 'translate-x-full'
              }`}
              style={{ willChange: 'transform' }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 p-3 lg:w-[400px] h-full bg-gradient-to-l from-black to-transparent z-10 text-white text-end">
          <div className="bottom-4 left-4">
            <span className="text-3xl font-semibold mb-3">#12</span> <br />
            <div className="flex items-center justify-end gap-2">
              <img className="h-4" src={star} alt="star" />
              <span className="text-md mt-2">(4.3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Button */}
      <Slidebtn onClick={() => setIsFullscreen(true)} ariaLabel="View fullscreen">
        <img src={gallery} alt="gallery button" />
      </Slidebtn>

      {/* Navigation Buttons */}
      <div className="absolute bottom-3 w-full flex justify-end pr-4 z-20 gap-4">
        {!isFullscreen && (
          <>
            <button
              className="p-3 rounded-full bg-white/80 hover:bg-white/90"
              onClick={() => prevSlide()}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="p-3 rounded-full bg-white/80 hover:bg-white/90"
              onClick={() => nextSlide()}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Fullscreen View */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center">
          <img
            src={`http://localhost:4001/uploads/${galleryImages[fullscreenIndex]}`}
            alt={`Fullscreen view of slide ${fullscreenIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          <Slidebtn onClick={() => setIsFullscreen(false)} ariaLabel="Close fullscreen">
            <X className="h-4 w-4" />
          </Slidebtn>
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 p-3 rounded-md hover:bg-white/30"
            onClick={() => prevSlide(true)}
            aria-label="Previous fullscreen image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 p-3 rounded-md hover:bg-white/30"
            onClick={() => nextSlide(true)}
            aria-label="Next fullscreen image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
