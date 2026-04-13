/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";

// Simple slider for cover images (copied from BlogDetailPage)
const CoverImageSlider = ({ images = [], baseUrl = "" }) => {
  const [current, setCurrent] = useState(0);
  const sliderInterval = useRef(null);
  const numImages = images.length;

  useEffect(() => {
    sliderInterval.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % numImages);
    }, 3000);
    return () => clearInterval(sliderInterval.current);
  }, [numImages]);

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev - 1 + numImages) % numImages);
  const next = () => setCurrent((prev) => (prev + 1) % numImages);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-80 flex items-center justify-center bg-gray-100">
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        onClick={prev}
        aria-label="Previous image"
        type="button"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <img
        src={`${baseUrl}/${images[current]}`}
        alt={`Cover ${current + 1}`}
        className="w-full h-80 object-cover rounded"
        style={{ transition: 'opacity 0.5s' }}
      />
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        onClick={next}
        aria-label="Next image"
        type="button"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-2.5 h-2.5 rounded-full ${idx === current ? 'bg-[#b82025]' : 'bg-gray-300'} border border-white`}
            aria-label={`Go to image ${idx + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

const getCareerSlug = (career) => {
  if (career?.title) {
    return career.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  return career?.slug || career?._id;
};

import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { CarrerDetail } from "../ApiFunctions/api";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import BlogComponent from "../Components/BlogComponent";
import axiosInstance from "../ApiFunctions/axios";
import SocialShare from "../Components/SocialShare";
import { Eye, ThumbsUp } from "lucide-react";

const DetailPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLiked, setIsLiked] = useState(false);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams(); // This can be either ID or slug
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = localStorage.getItem("userId");

  const tabConfig = [
    { id: "overview", name: "Overview", titleRef: useRef(null) },
    { id: "eligibility", name: "Eligibility", titleRef: useRef(null) },
    { id: "jobRoles", name: "Jobs Roles", titleRef: useRef(null) },
    { id: "opportunity", name: "Career Opportunity", titleRef: useRef(null) },
    { id: "topColleges", name: "Top Colleges", titleRef: useRef(null) },
  ];

  // Initialize careerIdMap from localStorage
  useEffect(() => {
    if (!window.careerIdMap) {
      try {
        const storedCareerIdMap = JSON.parse(
          localStorage.getItem("careerIdMap") || "{}"
        );
        window.careerIdMap = storedCareerIdMap;
      } catch (error) {
        console.error("Error initializing careerIdMap:", error);
        window.careerIdMap = {};
      }
    }
  }, []);

  useEffect(() => {
    const fetchCareer = async () => {
      setIsLoading(true);
      setData(null);
      try {
        console.log("[DetailPage] fetchCareer start", { id, currentUserId });

        // Determine if we're dealing with an ID or a slug
        const isSlug = isNaN(parseInt(id)) || id.includes("-");
        console.log("[DetailPage] route type", { id, isSlug });

        // Initialize variables for API response and career ID
        let response;
        let careerId = id;

        if (isSlug) {
          // Try to get the ID from careerIdMap
          const mappedId = window.careerIdMap?.[id];
          console.log("[DetailPage] slug lookup", {
            slug: id,
            mappedId,
            cachedKeys: window.careerIdMap ? Object.keys(window.careerIdMap) : [],
          });

          if (mappedId) {
            // We found the ID in the map, use it
            careerId = mappedId;
            console.log("[DetailPage] using mapped career ID", { careerId });
            response = await CarrerDetail(careerId);
          } else {
            // First visit or stale local cache: fetch directly by slug,
            // then cache the resolved ID for future visits.
            console.log("[DetailPage] no mapped ID, fetching by slug directly", { slug: id });
            response = await CarrerDetail(id);
            const payload = response?.data ?? response;
            console.log("[DetailPage] slug fetch payload", payload);

            if (payload && payload._id) {
              careerId = payload._id;
              window.careerIdMap = window.careerIdMap || {};
              window.careerIdMap[id] = careerId;
                const generatedSlug = getCareerSlug(payload);
                if (generatedSlug) {
                  window.careerIdMap[generatedSlug] = careerId;
                }
              localStorage.setItem(
                "careerIdMap",
                JSON.stringify(window.careerIdMap)
              );
              console.log(`Saved mapping: ${id} -> ${careerId} in localStorage`);
            } else {
              console.warn("[DetailPage] slug fetch returned no _id", { slug: id, payload });
            }
          }
        } else {
          // It's an ID, use it directly
          console.log("[DetailPage] fetching by direct ID", { careerId });
          response = await CarrerDetail(careerId);

          // If the career has a slug, we should save that mapping too
          const payload = response?.data ?? response;
          console.log("[DetailPage] direct ID payload", payload);
          if (payload && payload.slug) {
            const slug = payload.slug;
            window.careerIdMap = window.careerIdMap || {};
            window.careerIdMap[slug] = careerId;
            const generatedSlug = getCareerSlug(payload);
            if (generatedSlug) {
              window.careerIdMap[generatedSlug] = careerId;
            }
            localStorage.setItem(
              "careerIdMap",
              JSON.stringify(window.careerIdMap)
            );
            console.log(
              `Saved mapping: ${slug} -> ${careerId} in localStorage`
            );
          }
        }

        const payload = response?.data ?? response;
        console.log("[DetailPage] normalized payload", payload);

        if (!payload) {
          console.error("No career data found");
          return;
        }

        setData(payload);

        // Check if user has already liked this career
        if (payload.likes && currentUserId) {
          const userHasLiked = payload.likes.includes(currentUserId);
          setIsLiked(userHasLiked);
        }
      } catch (error) {
        console.error("Error fetching career:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareer();
  }, [id, currentUserId]);

  // Handle like/dislike functionality
  const handleLike = async () => {
    if (!currentUserId) {
      navigate("/login", { state: { backgroundLocation: location } });
      return;
    }

    try {
      const likeValue = isLiked ? "0" : "1";
      const careerId = data._id;

      await axiosInstance.post(
        `${baseURL}/like-dislike`,
        {
          id: careerId,
          type: "career",
          like: likeValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        }
      );

      setIsLiked(!isLiked);
      setData((prevData) => {
        const updatedLikes = isLiked
          ? prevData.likes.filter((userId) => userId !== currentUserId)
          : [...prevData.likes, currentUserId];

        return {
          ...prevData,
          likes: updatedLikes,
        };
      });
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const scrollToSection = (tabItem) => {
    setActiveTab(tabItem.name);
    const yOffset = -170;
    const element = tabItem.titleRef.current;
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Career details not found.
      </div>
    );
  }

  const getContent = (tabId) => {
    const content = {
      overview: data.description,
      eligibility: data.eligibility || [],
      jobRoles: data.jobRoles || [],
      opportunity: data.opportunity || [],
      topColleges: data.topColleges || [],
    };
    return DOMPurify.sanitize(content[tabId]);
    // [&>p]:text-gray-700 [&>p]:my-3 [&>p]:leading-relaxed
  };

  // const contentStyles = `
  //   html-content
  //   [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:my-4
  //   [&>h2]:text-xl [&>h2]:font-bold [&>h2]:my-3
  //   [&>h3]:text-lg [&>h3]:font-bold [&>h3]:my-2
  //   [&>p]:text-black  [&>p]:leading-relaxed
    
  //   [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:my-4
  //   [&>ul>li]:text-black [&>ul>li]:my-2
    
  //   [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:my-4
  //   [&>ol>li]:text-black [&>ol>li]:my-2
    
  //   [&>table]:w-full [&>table]:border-collapse [&>table]:my-4
  //   [&>table>thead>tr>th]:bg-gray-50 [&>table>thead>tr>th]:text-left 
  //   [&>table>thead>tr>th]:p-3 [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-200
  //   [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-200
    
  //   [&>a]:text-blue-600 [&>a]:underline [&>a:hover]:text-blue-800
    
  //   [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4
    
  //   [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 
  //   [&>blockquote]:italic [&>blockquote]:my-4 [&>blockquote]:text-gray-600
  // `;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="universal-container py-8">
          <div className="h-80 w-full rounded-xl overflow-hidden shadow-lg mb-8">
            {/* Cover image slider if available, else fallback to single image */}
            {Array.isArray(data.coverImages) && data.coverImages.length > 0 ? (
              <CoverImageSlider images={data.coverImages} baseUrl={Images} />
            ) : (
              <img
                className="h-full w-full object-cover"
                src={`${Images}/${data.image}`}
                alt={data.title || "Career banner"}
              />
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl p-4 sticky top-0 z-50">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-4 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {data.title || "Career Details"}
              </h1>
              
              <div className="flex items-center gap-4">
                {/* Views Counter */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
                  <Eye className="h-5 w-5" />
                  <span className="font-bold text-sm tracking-tight">{data.views || 0}</span>
                </div>

                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 border ${
                    isLiked 
                      ? "bg-red-50 text-red-600 border-red-200" 
                      : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                  }`}
                >
                  <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  {data.likes?.length || 0}
                </button>

                {/* Share Button */}
                <div onClick={handleShareClick}>
                  <SocialShare
                    title={data.title}
                    url={window.location.href}
                    contentType="career"
                  />
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="border rounded-xl border-gray-200">
                <ul className="flex justify-evenly items-center whitespace-nowrap">
                  {tabConfig.map((tab) => (
                    <li
                      key={tab.id}
                      className={`cursor-pointer px-8 py-3 text-sm font-medium transition-all duration-200 
                      ${
                        activeTab === tab.name
                          ? "bg-[#b82025] rounded-full mx-2 text-white"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 rounded-full mx-2"
                      }`}
                      onClick={() => scrollToSection(tab)}
                    >
                      {tab.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-10 space-y-8">
            {tabConfig.map((tab) => {
              const content = getContent(tab.id);
              const isArray = Array.isArray(content);

              return (
                <div
                  key={tab.id}
                  className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl p-8 scroll-mt-24"
                >
                  <h3 ref={tab.titleRef} className="font-bold mb-6">
                  {/* <h3 ref={tab.titleRef} className="text-lg font-bold mb-6"> */}
                    {tab.name}
                  </h3>
                  {isArray ? (
                    <ul className="space-y-4">
                      {content.map((item, idx) => (
                        <li
                          key={idx}
                          // className={contentStyles}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div
                      className={`text-base prose prose-gray max-w-full`}
                      // className={`${contentStyles} text-base prose prose-gray max-w-full`}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Components */}
        <BlogComponent />
      </div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default DetailPage;
