import React, { useState, useEffect, useMemo } from "react";

import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import { useQuery } from "react-query";
import { career } from "../ApiFunctions/api";
import SocialShare from "./SocialShare";

const HighRatedCareers = () => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    try {
      const storedCareerIdMap = JSON.parse(
        localStorage.getItem("careerIdMap") || "{}"
      );
      window.careerIdMap = storedCareerIdMap;
    } catch (error) {
      console.error("Error loading careerIdMap from localStorage:", error);
      window.careerIdMap = {};
    }
  }, []);

  const handleShareClick = (e, blog) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const { data, isLoading, isError } = useQuery(
    ["career"],
    () => career(),
    {
      enabled: true,
      onSuccess: async (data) => {
        const { result } = data?.data || {};
        if (result) {
          const careerIdMap = { ...window.careerIdMap };

          result.forEach((blog) => {
            if (blog.slug) {
              careerIdMap[blog.slug] = blog._id;
            }
          });

          window.careerIdMap = careerIdMap;
          localStorage.setItem("careerIdMap", JSON.stringify(careerIdMap));

          setContent(result);

          const imageMap = result.reduce((acc, career) => {
            acc[career._id] = career.thumbnail
              ? `${Images}/${career.thumbnail}`
              : cardPhoto;
            return acc;
          }, {});
          setImages(imageMap);
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      Object.values(images).forEach((url) => {
        if (url !== cardPhoto) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  const memoizedContent = useMemo(() => content, [content]);

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
        Error loading career
      </div>
    );
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-bold">High Rated careers</h3>
        <Link to="/careerspage">
          <button className="bg-[#b82025] text-white py-2 px-4 rounded">
            View more
          </button>
        </Link>
      </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {memoizedContent && memoizedContent.length > 0 ? (
          memoizedContent.map((box, index) => (
            <Link
              to={`/detailpage/${box.slug}`}
              key={index}
              className="box lg:max-w-[450px] max-lg:max-w-[340px] max-md:max-w-full shadow-lg relative"
            >
              <div className="imageContainer">
                <img
                  className="h-full w-full object-cover"
                  src={images[box._id] || cardPhoto}
                  alt="boxphoto"
                  loading="lazy"
                />
              </div>
              <div className="textContainer">
                <h3 className="text-xl md:text-xl lg:text-xl font-bold text-[#0B104A]">
                  {box?.title || "Untitled"}
                </h3>

                <p
                  className="text-sm text-black mt-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      box?.description?.slice(0, 80) + "..." ||
                      "No description available",
                  }}
                ></p>
                <div className="flex items-center justify-between px-4 w-full mt-2">
                  {box.views > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="text-gray-500">{box.views}</span>
                    </div>
                  )}
                  <div
                    className="flex justify-between items-center gap-2 text-gray-600"
                    onClick={(e) => handleShareClick(e, box)}
                  >
                    <SocialShare
                      title={box.title}
                      url={`${window.location.origin}/detailpage/${box.slug}`}
                      contentType="career"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full text-center">
            No careers available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRatedCareers;
