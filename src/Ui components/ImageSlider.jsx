import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Slidebtn from "./Slidebtn";
import star from "../assets/Images/star.png";
import gallery from "../assets/Images/galleryBtn.png";

const ImageSlider = ({ instituteData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({});
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  // Helper function to validate image URL
  const isValidImage = (img) => {
    return (
      img &&
      typeof img === "string" &&
      img.trim() !== "" &&
      !imageLoadError[img]
    );
  };

  // Create array of valid images with strict filtering
  const allImages = useMemo(() => {
    const coverImage = instituteData?.data?.coverImage;
    const galleryImages = instituteData?.data?.gallery || [];

    // Only include cover image if it exists and is valid
    const validImages = [];
    if (isValidImage(coverImage)) {
      validImages.push(coverImage);
    }

    // Add valid gallery images
    galleryImages.forEach((img) => {
      if (isValidImage(img) && img !== coverImage) {
        validImages.push(img);
      }
    });

    return validImages;
  }, [instituteData, imageLoadError]);

  const handleImageError = (imgSrc) => {
    setImageLoadError((prev) => ({
      ...prev,
      [imgSrc]: true,
    }));
  };

  const nextSlide = (isFullScreen = false) => {
    if (isFullScreen) {
      setFullscreenIndex((prev) => (prev + 1) % allImages.length);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, allImages.length - 1));
    }
  };

  const prevSlide = (isFullScreen = false) => {
    if (isFullScreen) {
      setFullscreenIndex(
        (prev) => (prev - 1 + allImages.length) % allImages.length
      );
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prevSlide(isFullscreen);
    if (e.key === "ArrowRight") nextSlide(isFullscreen);
    if (e.key === "Escape") setIsFullscreen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullscreen]);

  // If no valid images are available, show a message
  if (!allImages.length) {
    return (
      <div className="relative rounded-xl overflow-hidden max-h-[400px] w-full aspect-[3/2] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden max-h-[400px] w-full"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <div className="relative w-full h-full">
          {allImages.map((src, index) => (
            <img
              key={`slide-${index}-${src}`}
              src={`${Images}/${src}`}
              alt={`Institute Image ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                index === currentIndex
                  ? "translate-x-0"
                  : index < currentIndex
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
              style={{ willChange: "transform" }}
              onError={() => handleImageError(src)}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 p-3 lg:w-[400px] ] h-full bg-gradient-to-l from-black to-transparent z-10 text-white text-end">
          <div className="bottom-4 left-4">
            <span className="text-3xl font-semibold mb-3">#12</span> <br />
            <div className="flex items-center justify-end gap-2">
              <img className="h-4" src={star} alt="star" />
              <span className="text-md mt-2">(4.3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Button */}
      {allImages.length > 1 && (
        <Slidebtn
          onClick={() => setIsFullscreen(true)}
          ariaLabel="View gallery"
        >
          <img src={gallery} alt="gallery button" />
        </Slidebtn>
      )}

      {/* Navigation Buttons */}
      <div className="absolute bottom-3 w-full flex justify-end  pr-4 z-20 gap-4">
        {!isFullscreen && allImages.length > 1 && (
          <>
            <button
              className={`p-3 rounded-full bg-white/80 hover:bg-white/90 ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => prevSlide()}
              aria-label="Previous image"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 " />
            </button>
            <button
              className={`p-3 rounded-full bg-white/80 hover:bg-white/90 ${
                currentIndex === allImages.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => nextSlide()}
              aria-label="Next image"
              disabled={currentIndex === allImages.length - 1}
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
            src={`${Images}/${allImages[fullscreenIndex]}`}
            alt={`Institute Image ${fullscreenIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onError={() => handleImageError(allImages[fullscreenIndex])}
          />
          <Slidebtn
            onClick={() => setIsFullscreen(false)}
            ariaLabel="Close gallery"
          >
            <X className="h-4 w-4" />
          </Slidebtn>
          {allImages.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 p-3 rounded-md hover:bg-white/30"
                onClick={() => prevSlide(true)}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 p-3 rounded-md hover:bg-white/30"
                onClick={() => nextSlide(true)}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
