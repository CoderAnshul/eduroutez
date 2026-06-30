import { useState, useEffect } from "react";
import axios from "axios";
import Promotions from "../Pages/CoursePromotions";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const imageUrl = import.meta.env.VITE_IMAGE_BASE_URL;

  // Fetch homepage banners from /banners API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsBannerLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`${baseURL}/banners`, {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {}),
          },
        });

        // According to the latest sample response, banners are in response.data.data.result
        const rawData = response?.data?.data?.result;

        if (Array.isArray(rawData) && rawData.length > 0) {
          const validBanners = rawData.filter(
            (item) => item && Array.isArray(item.images) && item.images.length > 0
          );

          setBanners(validBanners);
          setCurrentBannerIndex(0);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
        setBanners([]);
      } finally {
        setIsBannerLoading(false);
      }
    };

    fetchBanners();
  }, [baseURL]);

  // Auto-slide banners if more than one is available
  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(intervalId);
  }, [banners]);

  const currentBanner =
    banners && banners.length > 0 ? banners[currentBannerIndex] : null;

  return (
    // <div className="h-[480px] w-full relative">
    <div className="h-fit min-h-56 max-h-96 w-full relative mb-8">
    {/* <div className="h-fit min-h-56 max-h-96 w-full relative mb-8"> */}
      {/* Background banner slider from /banners API, fallback to Promotions */}
      {banners.length > 0 && !isBannerLoading ? (
        <div className="relative w-full h-full group">
          {banners[currentBannerIndex]?.destinationLink ? (
            <a
              href={banners[currentBannerIndex].destinationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
              tabIndex={0}
              aria-label={banners[currentBannerIndex]?.title || 'Banner'}
            >
              <img
                src={`${imageUrl}/${banners[currentBannerIndex].images[0]}`}
                alt={banners[currentBannerIndex].title || "Banner"}
                className="w-full min-h-56 max-h-96 h-full object-cover transition-opacity duration-700 select-none cursor-pointer"
                draggable="false"
              />
            </a>
          ) : (
            <img
              src={`${imageUrl}/${banners[currentBannerIndex].images[0]}`}
              alt={banners[currentBannerIndex].title || "Banner"}
              className="w-full min-h-56 max-h-96 h-full object-cover transition-opacity duration-700 select-none"
              draggable="false"
            />
          )}
          {/* Left Chevron */}
          {banners.length > 1 && (
            <button
              className="banner-chevron absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-2 z-20 pointer-events-auto"
              onClick={e => {
                e.stopPropagation();
                setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
              }}
              aria-label="Previous banner"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {/* Right Chevron */}
          {banners.length > 1 && (
            <button
              className="banner-chevron absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full p-2 z-20 pointer-events-auto"
              onClick={e => {
                e.stopPropagation();
                setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
              }}
              aria-label="Next banner"
              tabIndex={0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <Promotions location="HOME_MAIN_PAGE" className="!h-full min-h-56 !mt-0" />
      )}

      <div className="h-full w-full bg-[#00000049] p-2 absolute top-0  z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white text-center font-semibold mb-5">
          {currentBanner?.title || "Find Over 5000+ Colleges in India"}
        </h1>
      </div>
    </div>
  );
};

export default Banner;
