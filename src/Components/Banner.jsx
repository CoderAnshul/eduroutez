import React from "react";
import searchImg from "../assets/Images/searchLogo.png";
import CustomButton from "../Ui components/CustomButton";

const Banner = () => {
  return (
    <div className="h-[480px] w-full bg-gray-100 banner-img">
      <div className="h-full w-full bg-[#00000049] p-2 absolute top-0 overflow-hidden z-60 flex flex-col items-center justify-center ">
        <h1 className="text-4xl text-white text-center font-semibold mb-5">
          Find Over 5000+ Colleges in India
        </h1>
        <div className="search ml-5 mr-5 h-12 bg-white border-[1.5px] relative border-gray-500  rounded-lg items-center gap-2 max-w-[800px] w-full overflow-hidden flex">
         <div className="flex items-center w-4/5 pl-4 py-2 gap-3">
         <button className="hover:scale-105 transition-all">
            <img src={searchImg} alt="search"  />
          </button>
          <input
            className="text-sm w-1/2"
            type="text"
            name="search"
            id="search"
            placeholder="Search for Colleges , institute and more..."
          />
         </div>
          {/* <button className="h-full w-1/5 bg-red-500 min-w-24 hover:bg-red-400 hover:scale-105 transition-all text-white">
            Search
          </button> */}
          <CustomButton text='Search' to='/searchpage' className="!h-full right-0 !rounded-sm w-1/5 absolute top-0 bg-red-500 min-w-24 hover:bg-red-400 hover:scale-105 transition-all text-white">
            Search
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Banner;
