import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const GalleryInfo = ({ instituteData }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    const gallery = instituteData?.data?.gallery;
    if (!Array.isArray(gallery) || gallery.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const normalizedBase = (Images || '').replace(/\/$/, '');
    const imageUrls = gallery
      .map((imagePath) => {
        if (!imagePath || typeof imagePath !== 'string') return null;
        if (/^https?:\/\//i.test(imagePath)) return imagePath;
        const cleanPath = imagePath.replace(/^\/+/, '');
        return normalizedBase ? `${normalizedBase}/${cleanPath}` : null;
      })
      .filter(Boolean);

    setPreviewUrls(imageUrls);
  }, [instituteData, Images]);

  // If no gallery data or no images were successfully loaded, don't render the component
  if (!instituteData?.data?.gallery || instituteData.data.gallery.length === 0 || previewUrls.length === 0) {
    return null;
  }

  const openGallery = (index) => {
    setCurrentImage(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openImagePopup = (index) => {
    setCurrentImage(index);
    setIsImagePopupOpen(true);
  };

  const closeImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  const goToPreviousImage = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : previewUrls.length - 1));
  };

  const goToNextImage = () => {
    setCurrentImage((prev) => (prev < previewUrls.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Gallery</h3>
      </div>
      
      {/* Initial 6 images grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {previewUrls.slice(0, 6).map((url, index) => (
          <div
            key={index}
            className="relative group cursor-pointer aspect-[4/3] overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => openGallery(index)}
          >
            <img
              src={url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <ImageIcon className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewUrls.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={() => openGallery(6)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
          >
            View All Images
          </button>
        </div>
      )}

      {isGalleryOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-black/60">
          <div className="relative bg-white rounded-xl w-[95%] h-[90%] max-w-6xl m-4 overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white text-gray-800 transition-all z-50 transform hover:rotate-90"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="sticky top-0 z-40 bg-white shadow-sm px-6 py-3">
              <h2 className="text-lg font-semibold">Gallery</h2>
            </div>

            {/* Content Grid - Structured for better sizing */}
            <div className="p-6 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer aspect-[4/3] overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                    onClick={() => openImagePopup(index)}
                  >
                    <img
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                       <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Expand</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Lightbox popup */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 px-4">
          {/* Close Backdrop Click */}
          <div className="absolute inset-0" onClick={closeImagePopup}></div>

          {/* Close Button - Top Right of Screen */}
          <button
            onClick={closeImagePopup}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all z-[2001]"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full max-w-5xl z-10 flex flex-col items-center">
            {/* Navigation & Image */}
            <div className="relative w-full flex items-center justify-center">
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 md:-left-12 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all group z-[2010]"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="relative animate-in zoom-in-95 duration-300 z-10">
                 <img
                  src={previewUrls[currentImage]}
                  alt={`Full view image ${currentImage + 1}`}
                  className="max-h-[85vh] max-w-full object-contain rounded-sm"
                />
              </div>

              <button
                onClick={goToNextImage}
                className="absolute right-4 md:-right-12 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all group z-[2010]"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryInfo;