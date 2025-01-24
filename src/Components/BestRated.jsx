import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import rupee from "../assets/Images/rupee.png";
import CustomButton from "../Ui components/CustomButton";
import { useQuery } from "react-query";
import { bestRatedInstitute } from "../ApiFunctions/api";

const BestRated = () => {
  const [content, setContent] = useState([]);

  const { data, isLoading, isError } = useQuery(
    ["institutes"],
    () => bestRatedInstitute(),
    {
      enabled: true,
      onSuccess: (data) => {
        setContent(data.data || []);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading best-rated institutes.
      </div>
    );
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold">Best Rated Institutes</h3>
        <Link to="/institute">
          <button className="bg-red-500 text-white py-2 px-4 rounded">
            View more
          </button>
        </Link>
      </div>

      <div className="boxWrapper w-full flex flex-col md:flex-row flex-wrap items-center gap-6">
        {content.length > 0 ? (
          content.map((box, index) => {
            if (index < 3 && box) {
              return (
                <Link
                  to="/institute"
                  key={index}
                  className="box w-full max-w-sm lg:max-w-[500px] shadow-lg"
                >
                  <div className="imageContainer">
                    <img
                      className="h-full w-full object-cover"
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${
                        box.brochure || ""
                      }`}
                      alt="boxphoto"
                    />
                  </div>
                  <div className="textContainer p-4">
                    <h3 className="text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]">
                      {box.instituteName || "Institute Name Not Available"}
                    </h3>
                    <p className="text-sm mt-2">
                      {box.collegeInfo
                        ? `${box.collegeInfo.slice(0, 80)}...`
                        : "No information available"}
                    </p>
                    <h3 className="flex items-center mt-2 text-2xl font-bold text-[#000000c4]">
                      <img
                        className="h-5 mt-1 opacity-70"
                        src={rupee}
                        alt="rupee"
                      />
                      {box.maxFees || "N/A"}
                    </h3>
                  </div>
                </Link>
              );
            }
            return null;
          })
        ) : (
          <p>No best-rated institutes available</p>
        )}
      </div>
    </div>
  );
};

export default BestRated;
