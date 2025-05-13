import React, { useMemo } from "react";
import instituteLogo from "../assets/Images/instituteLogo.png";
import location from "../assets/Images/location.png";
import CustomButton from "./CustomButton";
import { useLocation } from "react-router-dom";

const CoursesName = ({ content }) => {
  const pathname = useLocation().pathname;

  // Memoize the segment to avoid recalculating on every render
  const segment = useMemo(() => decodeURIComponent(pathname.split("/")[2]), [pathname]);

  return (
    <div className="min-h-20 w-full py-4 flex flex-col sm:flex-row gap-2 px-2 relative">
      <div className="instituteLogo max-h-24 max-w-24 border-2 rounded-full overflow-hidden flex items-center justify-center">
        <img
          className="h-4/5 w-4/5 object-contain rounded-full"
          src={instituteLogo}
          alt="instituteLogo"
          loading="lazy" // Lazy load the image
        />
      </div>

      <div className="name w-full min-h-20">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">{content}</h2>
        <div className="text-container flex justify-end items-center flex-wrap gap-2 mt-1">
          {/* Add buttons or other elements here */}
        </div>
      </div>
    </div>
  );
};

export default CoursesName;
