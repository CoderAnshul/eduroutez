import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GalleryInfo = ({ instituteData }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (!instituteData?.data?.gallery) {
          console.warn('No gallery images available');
          return;
        }

        const imageUrls = await Promise.all(
          instituteData.data.gallery.map(async (imageFilename) => {
            const imageResponse = await axios.get(
              `http://localhost:4001/api/uploads/${imageFilename}`,
              { responseType: 'blob' }
            );
            return URL.createObjectURL(imageResponse.data);
          })
        );

        setPreviewUrls(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [instituteData]);

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
      {/* Initial 6 images grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewUrls.slice(0, 6).map((url, index) => (
          <div
            key={index}
            className="relative group cursor-pointer aspect-video"
            onClick={() => openGallery(index)}
          >
            <img
              src={url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <span className="text-white text-lg font-medium">View Image</span>
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
        <div className="fixed inset-0 z-40 mt-20 flex items-center justify-center overflow-hidden bg-black/60">
          <div className="relative bg-white rounded-xl w-[95%] h-[90%] max-w-6xl m-4 overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeGallery}
              className="absolute  -right-1 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors z-50"
              aria-label="Close gallery"
            >
              <span className="text-gray-800 text-xl">&times;</span>
            </button>-

            {/* Header */}
            <div className="sticky top-0 z-40 bg-white shadow-sm px-6 py-3">
              <h2 className="text-lg font-semibold">Gallery</h2>
            </div>

            {/* Scrollable content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-60px)]">
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 mb-4"
                    onClick={() => openImagePopup(index)}
                  >
                    <img
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="text-white text-sm font-medium">Click to enlarge</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Image Popup Modal */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative bg-white rounded-xl w-[90%] max-w-3xl">
            {/* Close button */}
            <button
              onClick={closeImagePopup}
              className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Close image popup"
            >
              <span className="text-gray-800 text-xl">&times;</span>
            </button>

            {/* Image container */}
            <div className="relative p-4">
              <div className="relative flex items-center justify-center">
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                  aria-label="Previous image"
                >
                  <span className="text-gray-800 text-lg">←</span>
                </button>

                <img
                  src={previewUrls[currentImage]}
                  alt={`Full view image ${currentImage + 1}`}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />

                <button
                  onClick={goToNextImage}
                  className="absolute right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                  aria-label="Next image"
                >
                  <span className="text-gray-800 text-lg">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryInfo;