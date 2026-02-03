import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";

import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { bestRatedInstitute } from "../ApiFunctions/api";

const BestRated = React.memo(() => {
  const [content, setContent] = useState([]);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const navigate = useNavigate();

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
      content.slice(0, 3).map((institute, index) => (
        <Link
          to={getInstituteUrl(institute)}
          key={institute._id || index}
          className="box w-full text-black max-w-sm lg:max-w-[500px] max-lg:max-w-[340px] max-md:max-w-full shadow-lg"
        >
          <div className="imageContainer">
            <img
              className="h-full w-full object-cover"
              src={
                institute.thumbnailImage
                  ? `${Images}/${institute.thumbnailImage}`
                  : cardPhoto
              }
              alt="Institute"
              loading="lazy"
            />
          </div>
          <div className="textContainer p-4">
            <h3 className="text-xl md:text-xl lg:text-xl font-bold text-[#0B104A]">
              {institute.instituteName || "Institute Name Not Available"}
            </h3>
            <p className="text-sm mt-2">
              {institute.about ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: institute.about.slice(0, 100) + "...",
                  }}
                />
              ) : (
                "No information available"
              )}
            </p>
          </div>
        </Link>
      )),
    [content, getInstituteUrl, Images]
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-bold">Best Rated Institutes</h3>
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
    return (
      <div className="flex justify-center items-center h-screen">
        No best-rated institutes available.
      </div>
    );
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold">Best Rated Institutes</h3>
        <button
          onClick={handleViewMore}
          className="bg-[#b82025] text-white py-2 px-4 rounded"
        >
          View more
        </button>
      </div>

      <div className="boxWrapper w-full flex flex-col md:flex-row flex-wrap items-center gap-6">
        {renderedContent}
      </div>
    </div>
  );
});

export default BestRated;
