import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import searchImg from "../assets/Images/searchLogo.png";
import CustomButton from "../Ui components/CustomButton";
import { homeBanner } from "../ApiFunctions/api";


const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banner data using useQuery
  const { data, isLoading, isError, error } = useQuery("homeBanner", homeBanner);

  // Extract banners from API response
  const banners = data?.data?.result || [];
  const baseURL = "http://localhost:4001/uploads/";

  useEffect(() => {
    if (!banners.length) return;

    // Automatically cycle through images every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [banners]);

  // if (isLoading) {
  //   return <div className="h-[480px] w-full flex justify-center items-center">Loading...</div>;
  // }

  // if (isError) {
  //   return (
  //     <div className="h-[480px] w-full flex justify-center items-center text-red-500">
  //       Error fetching banners: {error.message}
  //     </div>
  //   );
  // }

  return (
    <div className="h-[480px] w-full relative">
      {/* Slider Container */}
      <div className="h-full w-full absolute top-0 left-0 z-0">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`h-full w-full absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${baseURL}${banner.images[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="h-full w-full bg-[#00000049] p-2 absolute top-0 overflow-hidden z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-white text-center font-semibold mb-5">
          Find Over 5000+ Colleges in India
        </h1>
        <div className="search ml-5 mr-5 h-12 bg-white border-[1.5px] relative border-gray-500 rounded-lg items-center gap-2 max-w-[800px] w-full overflow-hidden flex">
          <div className="flex items-center w-4/5 pl-4 py-2 gap-3">
            <button className="hover:scale-105 transition-all">
              <img src={searchImg} alt="search" />
            </button>
            <input
              className="text-sm w-1/2"
              type="text"
              name="search"
              id="search"
              placeholder="Search for Colleges, institute and more..."
            />
          </div>
          <CustomButton
            text="Search"
            to="/searchpage"
            className="!h-full right-0 !rounded-sm w-1/5 absolute top-0 bg-red-500 min-w-24 hover:bg-red-400 hover:scale-105 transition-all text-white"
          >
            Search
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Banner;
