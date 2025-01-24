import React from "react";
import instituteLogo from "../assets/Images/instituteLogo.png";
import location from "../assets/Images/location.png";
import CustomButton from "./CustomButton";
import serachBoximg from "../assets/Images/serachBoximg.jpg";
const Images=import.meta.env.VITE_IMAGE_BASE_URL;


const InstitueName = ({instituteData}) => {
  return (
    <div className="min-h-20 w-full py-4 flex flex-col sm:flex-row gap-2 px-2 relative">
      <div className="instituteLogo absolute h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-48 xl:w-48 bg-white rounded-lg shadow-lg -top-[60px] sm:-top-[60px] md:-top-[80px] xl:-top-[100px] flex items-center justify-center ">
        <img className="h-full w-4/5 object-contain" src={instituteData.thumbnailImage? `${Images}/${instituteData.thumbnailImage}` : serachBoximg} alt="instituteLogo"/>
      </div>

      {/* -------------filler--------------- */}
      <div className="filler h-10 w-36 sm:h-14 sm:w-40 md:h-[70px] bg-transparent md:w-52 xl:h-[80px] xl:w-56 rounded-lg flex items-center justify-center "></div>

      <div className="name w-full min-h-20 ">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">{instituteData.data.instituteName}</h2>

        <div className="text-container flex justify-between items-center flex-wrap gap-2 mt-1">
          <div className="flex mt-2 gap-3 whitespace-nowrap">
            <p className="flex items-center text-sm font-semibold opacity-75"><img className="h-3" src={location} alt="location" />{instituteData?.data?.city}</p>
            <p className="text-sm font-semibold opacity-75">● {instituteData?.data?.organisationType}</p>
            <p className="text-sm font-semibold opacity-75">● {instituteData?.data?.establishedYear}</p>
          </div>

          {/* --------------button----------------- */}
            <div className="flex gap-3">
            <CustomButton text='Download Brochure' className="!bg-red-500 !text-xs !rounded-none !px-[2.5vw] !py-3 !w-auto !h-auto" to="/institute"/>
            <CustomButton text='Apply Now' className="!bg-red-500 !text-xs !rounded-none !px-[2.5vw] !py-3 !w-auto !h-auto" to="/institute"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstitueName;
