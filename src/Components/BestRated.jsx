import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";

import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ThumbsUp, Users, MapPin } from "lucide-react";
import { bestRatedInstitute } from "../ApiFunctions/api";

const BestRated = React.memo(() => {
  const [content, setContent] = useState([]);
  const navigate = useNavigate();
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  // Clean HTML content
  const stripHtml = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  // Helper to handle potential object location fields
  const getInstituteLocation = (institute) => {
    const getVal = (val) => (val && typeof val === 'object' ? (val.name || val.cityName || "") : val);
    const city = getVal(institute.city);
    const state = getVal(institute.state);
    
    if (city && state) return `${city}, ${state}`;
    return city || state || "Premium Institute";
  };

  const handleViewMore = useCallback(() => {
    navigate("/institute");
  }, [navigate]);

  useEffect(() => {
    if (!window.instituteIdMap) {
      try {
        const storedInstituteIdMap = JSON.parse(
          localStorage.getItem("instituteIdMap") || "{}"
        );
        window.instituteIdMap = storedInstituteIdMap;
      } catch (error) {
        console.error("Error loading instituteIdMap from localStorage:", error);
        window.instituteIdMap = {};
      }
    }
  }, []);

  const updateIdMapping = useCallback((institutes) => {
    let hasChanges = false;

    institutes.forEach((institute) => {
      if (
        institute.slug &&
        institute._id &&
        !window.instituteIdMap[institute.slug]
      ) {
        window.instituteIdMap[institute.slug] = institute._id;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      localStorage.setItem(
        "instituteIdMap",
        JSON.stringify(window.instituteIdMap)
      );
    }
  }, []);

  const getInstituteUrl = useCallback(
    (institute) =>
      institute?.slug
        ? `/institute/${institute.slug}`
        : `/institute/${institute?._id}`,
    []
  );

  const { data, isLoading, isError } = useQuery(
    ["best-rated-institutes"],
    bestRatedInstitute,
    {
      enabled: true,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
      retry: 2, // Retry failed requests 2 times
      retryDelay: 1000, // Wait 1 second between retries
      onSuccess: (data) => {
        const institutes = data.data || [];
        setContent((prevContent) =>
          JSON.stringify(prevContent) !== JSON.stringify(institutes)
            ? institutes
            : prevContent
        );

        if (institutes.length > 0) {
          updateIdMapping(institutes);
        }
      },
    }
  );

  const renderedContent = useMemo(
    () =>
      content.slice(0, 3).map((institute, index) => {
        const slug = institute.slug || institute._id;

        return (
          <Link
            to={getInstituteUrl(institute)}
            key={institute._id || index}
            className="group box w-full text-black shadow-md rounded-xl overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Institute Image with Overlay */}
            <div className="relative h-48 overflow-hidden flex-shrink-0">
              <img
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={
                  institute.thumbnailImage
                    ? `${Images}/${institute.thumbnailImage}`
                    : cardPhoto
                }
                alt="Institute"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Best Rated
                  </div>
                </div>

                <div>
                  <h3 className="text-white text-xl font-bold line-clamp-2 drop-shadow-md antialiased leading-tight">
                    {institute.instituteName || "Institute Name Not Available"}
                  </h3>
                  <div className="flex items-center mt-2 text-white text-opacity-90 text-sm drop-shadow-md">
                    <MapPin size={14} className="mr-1" />
                    <span>{getInstituteLocation(institute)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Institute Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="space-y-4 px-2 pt-3">
                {/* Short description */}
                <div className="text-black line-clamp-3 h-18 text-sm">
                  {stripHtml(institute.about || "No information available")}
                </div>

                <div className="flex w-full justify-between gap-3 pt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1 text-gray-400" />
                      <span>Top choice</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <ThumbsUp size={16} className="mr-1 text-gray-400" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="mt-auto pt-6">
                <div className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center group-hover:bg-[#b82025] group-hover:text-white transition-all duration-300">
                  <span>View Institute</span>
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </div>
          </Link>
        );
      }),
    [content, getInstituteUrl, Images]
  );

  if (isLoading) {
    return (
      <div className=" w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-bold">Best Rated Institutes</h3>
        </div>
        <div className="boxWrapper w-full flex flex-col md:flex-row flex-wrap items-center gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="box w-full max-w-sm lg:max-w-[500px] max-lg:max-w-[340px] max-md:max-w-full shadow-lg animate-pulse">
              <div className="imageContainer h-48 bg-gray-200"></div>
              <div className="textContainer p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
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

  if (content.length === 0) {
    return null;
  }

  return (
    <div className="universal-container py-12 w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-2xl font-bold">Best Rated Institutes</h3>
        <button
          onClick={handleViewMore}
          className="bg-[#b82025] text-white py-2 px-6 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-all shadow-md font-semibold transform hover:scale-105 active:scale-95 text-sm"
        >
          <span>View more</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {renderedContent}
      </div>
    </div>
  );
});

export default BestRated;
