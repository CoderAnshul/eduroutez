import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import { useQuery } from "react-query";
import { bestRatedUniversityInstitutes } from "../ApiFunctions/api";
import { ArrowRight, MapPin, Users, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import WishlistButton from "./WishlistButton";

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
  return city || state || "Premium University";
};

const BestRatedUniversity = React.memo(() => {
  const scrollRef = React.useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let intervalId;
    const startInterval = () => {
      intervalId = setInterval(() => {
        if (window.innerWidth >= 768) return;
        const children = Array.from(container.children).filter(
          (child) => !child.classList.contains("nav-btn")
        );
        if (children.length <= 1) return;

        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;

        let currentIdx = 0;
        let minDiff = Infinity;
        children.forEach((child, idx) => {
          const childCenter = child.offsetLeft + child.clientWidth / 2;
          const containerCenter = scrollLeft + containerWidth / 2;
          const diff = Math.abs(childCenter - containerCenter);
          if (diff < minDiff) {
            minDiff = diff;
            currentIdx = idx;
          }
        });

        let nextIdx = (currentIdx + 1) % children.length;
        const nextChild = children[nextIdx];
        if (nextChild) {
          container.scrollTo({
            left: nextChild.offsetLeft - (containerWidth - nextChild.clientWidth) / 2,
            behavior: "smooth",
          });
        }
      }, 4000);
    };

    startInterval();
    return () => clearInterval(intervalId);
  }, []);

  const handlePrev = () => {
    const container = scrollRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const children = Array.from(container.children).filter(
      (child) => !child.classList.contains("nav-btn")
    );
    if (children.length <= 1) return;

    const scrollLeft = container.scrollLeft;
    let currentIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const diff = Math.abs(childCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        currentIdx = idx;
      }
    });

    let prevIdx = (currentIdx - 1 + children.length) % children.length;
    const prevChild = children[prevIdx];
    if (prevChild) {
      container.scrollTo({
        left: prevChild.offsetLeft - (containerWidth - prevChild.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    const container = scrollRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const children = Array.from(container.children).filter(
      (child) => !child.classList.contains("nav-btn")
    );
    if (children.length <= 1) return;

    const scrollLeft = container.scrollLeft;
    let currentIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const containerCenter = scrollLeft + containerWidth / 2;
      const diff = Math.abs(childCenter - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        currentIdx = idx;
      }
    });

    let nextIdx = (currentIdx + 1) % children.length;
    const nextChild = children[nextIdx];
    if (nextChild) {
      container.scrollTo({
        left: nextChild.offsetLeft - (containerWidth - nextChild.clientWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  const [content, setContent] = useState([]);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const navigate = useNavigate();

  const handleViewMore = useCallback(() => {
    navigate("/university");
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
    ["best-rated-university-institutes"],
    bestRatedUniversityInstitutes,
    {
      enabled: true,
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
      onSuccess: (data) => {
        const institutes = data?.data || [];
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
          className="group box w-[85vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center text-black shadow-md rounded-xl overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
              alt="University"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-600/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      Best Rated
                    </div>
                    {institute.admissionOpen && (
                      <div className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                        Admission Open
                      </div>
                    )}
                  </div>
                  <WishlistButton
                  type="institute"
                  id={institute._id}
                  className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110"
                  size={4}
                />
              </div>

              <div>
                <h3 className="text-white text-xl font-bold line-clamp-2 drop-shadow-md antialiased leading-tight">
                  {institute.instituteName || "University Name Not Available"}
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
              <div className="w-full bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-center font-medium text-sm flex items-center justify-center group-hover:bg-[#b82025] group-hover:text-white transition-all duration-300">
                <span>View University</span>
                <ArrowRight
                  size={16}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </Link>
      )),
    [content, getInstituteUrl, Images]
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-bold">Best Rated Universities</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="box w-full shadow-lg animate-pulse"
            >
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
        Error loading best-rated universities.
      </div>
    );
  }

  if (content.length === 0) {
    return null;
  }

  return (
    <div className="universal-container py-12 w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-4">
        <h3 className="text-2xl font-bold text-center sm:text-left">Best Rated Universities</h3>
        <button
          onClick={handleViewMore}
          className="bg-[#b82025] hover:bg-red-700 text-white py-2 px-5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group"
        >
          <span className="font-medium">View more</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      <div className="relative w-full">
        {/* Left Navigation Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md md:hidden flex items-center justify-center border border-gray-200 nav-btn"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scroll-smooth pb-4 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {renderedContent}
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={handleNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-md md:hidden flex items-center justify-center border border-gray-200 nav-btn"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
});

export default BestRatedUniversity;
