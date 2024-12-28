import React from "react";
import instituteLogo from "../assets/Images/instituteLogo.png";
import location from "../assets/Images/location.png";
import CustomButton from "./CustomButton";
import { useLocation } from "react-router-dom";

const CoursesName = ({content}) => {
  const pathname = useLocation().pathname;
  const segment = decodeURIComponent(pathname.split("/")[2]);

  return (
    <div className="min-h-20 w-full py-4 flex flex-col sm:flex-row gap-2 px-2 relative">
      <div className="instituteLogo max-h-24 max-w-24 border-2 rounded-full overflow-hidden flex items-center justify-center ">
        <img className="h-4/5 w-4/5 object-contain rounded-full" src={instituteLogo} alt="instituteLogo"/>
      </div>

      {/* -------------filler--------------- */}
      {/* <div className="filler h-10 w-36 sm:h-14 sm:w-40 md:h-[70px] bg-transparent md:w-52 xl:h-[80px] xl:w-56 rounded-lg flex items-center justify-center "></div> */}

      <div className="name w-full min-h-20 ">
        {/* <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">Industrial Engineering Course: Admission 2024, Fees, Syllabus, Entrance Exam, Career Scope</h2> */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">{content}</h2>
        <div className="text-container flex justify-end items-center flex-wrap gap-2 mt-1">

          {/* --------------button----------------- */}
            <div className="flex gap-3 ">
            <CustomButton text='Download Brochure' className="!bg-red-500 !text-xs !rounded-none !px-[2.5vw] !py-3 !w-auto !h-auto" to="/coursesinfopage"/>
            <CustomButton text='Apply Now' className="!bg-red-500 !text-xs !rounded-none !px-[2.5vw] !py-3 !w-auto !h-auto" to="/coursesinfopage"/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesName;
