import React, { useState, useEffect, useMemo } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import cardPhoto from "../assets/Images/teacher.jpg";
import { useQuery } from "react-query";
import { career } from "../ApiFunctions/api";
import SocialShare from "./SocialShare";
import { Sparkles } from "lucide-react";

const HighRatedCareers = ({ title = "High Rated careers", streamId, categoryId }) => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

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
    ["career", streamId, categoryId],
    async () => {
      let url = `${baseURL}/careers?limit=3&sort={"createdAt":"desc"}`;

      const filters = {};
      if (streamId) filters.stream = streamId;
      if (categoryId) filters.category = categoryId;

      if (Object.keys(filters).length > 0) {
        url = `${baseURL}/careers?filters=${encodeURIComponent(JSON.stringify(filters))}&limit=3&sort={"createdAt":"desc"}`;
      }

      const response = await axios.get(url);
      return response.data;
    },
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
    return null; // Return nothing while loading to avoid layout shifts
  }

  if (isError) {
    return null; // Hide on error
  }

  if ((streamId || categoryId) && content.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="text-red-500 w-6 h-6" />
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 italic">No related careers found for this selection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="text-red-500 w-6 h-6" />
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
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
