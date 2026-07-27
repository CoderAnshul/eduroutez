import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import axios from "axios";
import { useQuery } from "react-query";
import { ArrowRight, ThumbsUp, Users, MapPin, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const CACHE_PREFIX = "eduroutez_institutes_";
const CACHE_TTL = 30 * 60 * 1000;

const getCacheKey = (streams) => CACHE_PREFIX + streams.map(s => s.toLowerCase().trim()).join("_");

const loadInstituteCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed._ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch { return null; }
};

const saveInstituteCache = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ _ts: Date.now(), data }));
  } catch {}
};

const RecommendedInstitutes = ({ streams = [], currentId }) => {
  const scrollRef = React.useRef(null);
  const streamSet = useMemo(() => streams.map(s => s.toLowerCase().trim()), [streams]);

  const stripHtml = (html) => {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  const getInstituteLocation = (institute) => {
    const getVal = (val) => (val && typeof val === 'object' ? (val.name || val.cityName || "") : val);
    const city = getVal(institute.city);
    const state = getVal(institute.state);
    if (city && state) return `${city}, ${state}`;
    return city || state || "Premium Institute";
  };

  const getInstituteUrl = useCallback(
    (institute) =>
      institute?.slug
        ? `/institute/${institute.slug}`
        : `/institute/${institute?._id}`,
    []
  );

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
          if (diff < minDiff) { minDiff = diff; currentIdx = idx; }
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
      if (diff < minDiff) { minDiff = diff; currentIdx = idx; }
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
      if (diff < minDiff) { minDiff = diff; currentIdx = idx; }
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

  const cacheKey = useMemo(() => getCacheKey(streams), [streams]);
  const cachedData = useMemo(() => (streams.length ? loadInstituteCache(cacheKey) : null), [cacheKey]);

  const { data, isLoading, isError, error } = useQuery(
    ["recommendedInstitutes", ...streams],
    async () => {
      const filters = { isRecommended: true };
      if (streams.length) filters.streams = streams;
      const res = await axios.get(`${baseURL}/institutes`, {
        params: {
          filters: JSON.stringify(filters),
          limit: 20,
        },
      });
      return res.data;
    },
    {
      enabled: streams.length > 0,
      initialData: cachedData,
      onSuccess: (fetchedData) => {
        if (fetchedData) {
          saveInstituteCache(cacheKey, fetchedData);
        }
      },
      refetchOnWindowFocus: false,
    }
  );

  const institutes = data?.data?.result || data?.result || [];

  const displayList = useMemo(() => {
    return institutes.filter(inst => {
      if (currentId && inst._id === currentId) return false;
      return true;
    });
  }, [institutes, currentId]);

  const renderedContent = useMemo(
    () =>
      displayList.slice(0, 3).map((institute, index) => (
        <Link
          to={getInstituteUrl(institute)}
          key={institute._id || index}
          className="group box w-[85vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center text-black shadow-md rounded-xl overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
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
                <div className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <BadgeCheck size={12} />
                  <span>Recommended</span>
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

          <div className="p-6 flex-1 flex flex-col">
            <div className="space-y-4 px-2 pt-3">
              <div className="text-black line-clamp-3 h-18 text-sm">
                {institute.about && institute.about !== "0" && institute.about !== 0
                  ? stripHtml(institute.about)
                  : "No information available"}
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
            <div className="mt-auto pt-6">
              <div className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-center font-medium flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <span>View Institute</span>
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      )),
    [displayList, getInstituteUrl]
  );

  if (!streamSet.length) return null;

  if (isLoading) {
    return (
      <div className="w-full max-w-[1420px] mx-auto p-6">
        <div className="flex items-center mb-8">
          <div className="w-6 h-6 bg-gray-200 animate-pulse rounded mr-2"></div>
          <h2 className="text-2xl font-bold bg-gray-200 animate-pulse rounded w-64 h-8">&nbsp;</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="box w-full shadow-lg animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded"></div>
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
      <div className="w-full text-center py-4 text-sm text-red-400">
        API Error: {error?.message}
      </div>
    );
  }

  if (!displayList.length) {
    return null;
  }

  return (
    <div className="universal-container py-12 w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-4">
        <div className="flex items-center gap-2">
          <BadgeCheck className="text-emerald-600 w-6 h-6" />
          <h3 className="text-2xl font-bold text-center sm:text-left">Recommended Institutes</h3>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      <div className="relative w-full">
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
};

export default RecommendedInstitutes;