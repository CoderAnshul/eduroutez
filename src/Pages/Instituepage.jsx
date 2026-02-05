import React, { useEffect, useRef, useState, useCallback, useMemo, Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getInstituteById } from "../ApiFunctions/api";
import Loader from "../Components/Loader";
import axios from "axios";
import { Video, ArrowRight } from "lucide-react";

// Lazy load components
const ImageSlider = React.lazy(() => import("../Ui components/ImageSlider"));
const InstitueName = React.lazy(() => import("../Ui components/InstitueName"));
const TabSlider = React.lazy(() => import("../Ui components/TabSlider"));
const CollegeInfo = React.lazy(() => import("../Components/CollegeInfo"));
const InstituteCourses = React.lazy(() => import("../Components/InstituteCourses"));
const QueryForm = React.lazy(() => import("../Ui components/QueryForm"));
const ReviewandRating = React.lazy(() => import("../Components/ReviewandRating"));
const InstituteFacilites = React.lazy(() => import("../Components/InstituteFacilites"));
const RecruitersSlider = React.lazy(() => import("../Ui components/RecruitersSlider"));
const Faqs = React.lazy(() => import("../Components/Faqs"));
const BestRated = React.lazy(() => import("../Components/BestRated"));
const Events = React.lazy(() => import("../Components/Events"));
const Addmissioninfo = React.lazy(() => import("../Components/Addmissioninfo"));
const Placementinfo = React.lazy(() => import("../Components/Placementinfo"));
const CampusInfo = React.lazy(() => import("../Components/CampusInfo"));
const ScholarshipInfo = React.lazy(() => import("../Components/ScholarshipInfo"));
const GalleryInfo = React.lazy(() => import("../Components/GalleryInfo"));
const FeeInfo = React.lazy(() => import("../Components/FeeInfo"));
const CutTOffInfo = React.lazy(() => import("../Components/CutTOffInfo"));
const Ranking = React.lazy(() => import("../Components/Ranking"));
const News = React.lazy(() => import("../Components/News"));
const Webinar = React.lazy(() => import("../Components/Webinar"));
const HighRatedCareers = React.lazy(() => import("../Components/HighRatedCareers"));
const BlogComponent = React.lazy(() => import("../Components/BlogComponent"));
const Promotions = React.lazy(() => import("../Pages/CoursePromotions"));
const ConsellingBanner = React.lazy(() => import("../Components/ConsellingBanner"));

// Base tabs array - we'll filter this based on available data
const allPossibleTabs = [
  { key: "College Info", dataKey: "about" },
  { key: "Courses", dataKey: "courses" },
  { key: "Admissions", dataKey: "admissionInfo" },
  { key: "Placements", dataKey: "placementInfo" },
  { key: "Campus", dataKey: "campusInfo" },
  { key: "Fees", dataKey: "fee" },
  { key: "Scholarship", dataKey: "scholarshipInfo" },
  { key: "Cut-offs", dataKey: "cutoff" },
  { key: "Ranking", dataKey: "ranking" },
  { key: "Gallery", dataKey: "gallery" },
  { key: "Review", dataKey: null },
  { key: "Facilities", dataKey: "facilities" },
  { key: "Q & A", dataKey: null }, // Always show
  { key: "News", dataKey: null, checkData: true },
  { key: "Webinar", dataKey: null, checkData: true }, // This is correct
];

const reviews = [
  // Reviews data remains unchanged
];

const Instituepage = () => {
  const { id } = useParams(); // This can be either ID or slug
  const [ratings, setRatings] = useState([]);
  const [tabs, setTabs] = useState([]);
  const navigate = useNavigate();
  const [instituteIdMap, setInstituteIdMap] = useState({});
  const [sectionRefs, setSectionRefs] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [webinarData, setWebinarData] = useState([]);
  const [isWebinarLoading, setIsWebinarLoading] = useState(true);

  useEffect(() => {
    if (!window.instituteIdMap) {
      try {
        const storedInstituteIdMap = JSON.parse(
          localStorage.getItem("instituteIdMap") || "{}"
        );
        window.instituteIdMap = storedInstituteIdMap;
      } catch (error) {
        console.error("Error initializing instituteIdMap:", error);
        window.instituteIdMap = {};
      }
    }
  }, []);

  // Use useCallback to prevent recreation of this function on every render
  const fetchInstituteData = useCallback(async () => {
    console.log("Fetching institute data for id/slug:", id);

    try {
      // First, determine if we're dealing with an ID or a slug
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      console.log("Is ObjectId:", isObjectId);

      // Try to get institute data - with fallback mechanisms
      let response;
      let instituteId = id;

      if (!isObjectId) {
        // Try to get the ID from instituteIdMap
        const mappedId = window.instituteIdMap?.[id];

        if (mappedId) {
          // We found the ID in the map, use it
          instituteId = mappedId;
          response = await getInstituteById(instituteId);
        } else {
          // If instituteIdMap doesn't exist or doesn't have the slug,
          // we need to get the institute directly by its slug through a custom API call
          try {
            response = await getInstituteById(instituteId);

            // If we got a response, grab the ID for future use
            if (response && response.data) {
              instituteId = response.data._id;

              // Save this slug -> ID mapping to both window and localStorage
              window.instituteIdMap = window.instituteIdMap || {};
              window.instituteIdMap[id] = instituteId;
              localStorage.setItem(
                "instituteIdMap",
                JSON.stringify(window.instituteIdMap)
              );
              console.log(
                `Saved mapping: ${id} -> ${instituteId} in localStorage`
              );
            }
          } catch (slugError) {
            console.error("Error fetching institute by slug:", slugError);

            // As a final fallback, try using the institute ID API
            response = await getInstituteById(id);
          }
        }
      } else {
        // It's an ID, use it directly
        response = await getInstituteById(instituteId);

        // If the institute has a slug, we should save that mapping too
        if (response && response.data && response.data.slug) {
          const slug = response.data.slug;
          window.instituteIdMap = window.instituteIdMap || {};
          window.instituteIdMap[slug] = instituteId;
          localStorage.setItem(
            "instituteIdMap",
            JSON.stringify(window.instituteIdMap)
          );
          console.log(
            `Saved mapping: ${slug} -> ${instituteId} in localStorage`
          );
        }
      }

      if (!response || !response.data) {
        throw new Error("No institute data found");
      }

      return response;
    } catch (error) {
      console.error("Failed to fetch institute data:", error);
      throw new Error(`Failed to fetch institute data: ${error.message}`);
    }
  }, [id]);

  // Use react-query with our custom fetch function
  const {
    data: instituteData,
    isError,
    error,
    isLoading,
  } = useQuery(["institute", id], fetchInstituteData, {
    enabled: !!id,
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Fetch news data separately to check if it's empty
  useEffect(() => {
    const fetchNewsData = async () => {
      if (instituteData?.data?._id) {
        setIsNewsLoading(true);
        try {
          const baseURL = import.meta.env.VITE_BASE_URL || '';
          const response = await axios.get(`${baseURL}/news/${instituteData.data._id}`);
          
          if (response?.data?.data) {
            setNewsData(response.data.data);
          } else {
            setNewsData([]);
          }
        } catch (error) {
          console.error("Error fetching news data:", error);
          setNewsData([]);
        } finally {
          setIsNewsLoading(false);
        }
      }
    };

    fetchNewsData();
  }, [instituteData]);

  // Fetch webinar data separately to check if it's empty
  useEffect(() => {
    const fetchWebinarData = async () => {
      if (instituteData?.data?._id) {
        setIsWebinarLoading(true);
        try {
          const baseURL = import.meta.env.VITE_BASE_URL || '';
          const response = await axios.get(`${baseURL}/webinars-by-institute/${instituteData.data._id}`);
          console.log("Webinar data response:", response);

          
          if (response?.data?.data) {
            console.log("Webinar data:", response.data.data);
            setWebinarData(response.data.data);
          } else {
            setWebinarData([]);
          }
        } catch (error) {
          console.error("Error fetching webinar data:", error);
          setWebinarData([]);
        } finally {
          setIsWebinarLoading(false);
        }
      }
    };

    fetchWebinarData();
  }, [instituteData]);

  // Filter tabs based on available data
  useEffect(() => {
    if (instituteData?.data) {
      const data = instituteData.data;
      
      // Filter tabs based on whether they have corresponding data
      const filteredTabs = allPossibleTabs.filter(tabInfo => {
        // Special case for News tab - only include if we have news data and it's not empty
        if (tabInfo.key === "News") {
          return !isNewsLoading && newsData.length > 0;
        }
        
        // Special case for Webinar tab - only include if we have webinar data and it's not empty
        if (tabInfo.key === "Webinar") {
          console.log("Checking Webinar tab:", !isWebinarLoading && webinarData?.length > 0);
          return !isWebinarLoading && webinarData?.result?.length > 0;
        }
        
        // If no dataKey specified, always include the tab
        if (tabInfo.dataKey === null) return true;
        
        // Check if the corresponding data exists and is not empty
        const hasData = (() => {
          const value = data[tabInfo.dataKey];
          
          // Handle arrays
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          
          // Handle strings
          if (typeof value === 'string') {
            return value && value.trim() !== '';
          }
          
          // Handle objects and other types
          return value !== null && value !== undefined;
        })();
        
        return hasData;
      }).map(tabInfo => tabInfo.key); // Extract just the key names
      
      console.log("Filtered tabs:", filteredTabs);
      setTabs(filteredTabs);
      
      // Create refs for each tab
      setSectionRefs(filteredTabs.map(() => React.createRef()));
    }
  }, [instituteData, newsData, isNewsLoading, webinarData, isWebinarLoading]);

  useEffect(() => {
    const fetchRatings = async () => {
      const data = [
        { category: "Course Content", rating: 4.2 },
        { category: "Faculty", rating: 4.0 },
        { category: "Placement", rating: 4.5 },
        { category: "Campus / Hostels", rating: 3.8 },
        { category: "Fees & Scholarships", rating: 4.1 },
      ];
      setRatings(data);
    };

    fetchRatings();
  }, []);

  // Helper function to get index of a tab
  const getTabIndex = (tabName) => {
    return tabs.indexOf(tabName);
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!instituteData) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // Determine if we should show the News section based on newsData
  const shouldShowNews = tabs.includes("News");
  // Determine if we should show the Webinar section based on webinarData
  const shouldShowWebinar = tabs.includes("Webinar");

  return (
    <>
      <div className="px-[4vw] py-[2vw] flex flex-col items-start">
        <ImageSlider instituteData={instituteData} />
        <InstitueName instituteData={instituteData} />
        <TabSlider tabs={tabs} sectionRefs={sectionRefs} />
        <div className="w-full flex gap-4">
          <div className="w-full lg:w-[calc(100%-400px)]">
            <div className="w-full min-h-24">
              {/* College Info */}
              {tabs.includes("College Info") && (
                <div ref={sectionRefs[getTabIndex("College Info")]} className="min-h-24 pt-4">
                  <CollegeInfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Courses */}
              {tabs.includes("Courses") && (
                <div ref={sectionRefs[getTabIndex("Courses")]} className="min-h-24 py-4">
                  <InstituteCourses instituteData={instituteData} />
                </div>
              )}
              
              {/* Exams Accepted */}
              {instituteData?.data?.examAccepted && (
                <div className="px-4 py-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Accepted Exams
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {instituteData?.data?.examAccepted
                      .split(",")
                      .map((exam, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors duration-200"
                        >
                          {exam.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Admissions */}
              {tabs.includes("Admissions") && (
                <div ref={sectionRefs[getTabIndex("Admissions")]} className="min-h-24 py-4">
                  <Addmissioninfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Placements */}
              {tabs.includes("Placements") && (
                <div ref={sectionRefs[getTabIndex("Placements")]} className="min-h-24 pt-4">
                  <Placementinfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Campus */}
              {tabs.includes("Campus") && (
                <div ref={sectionRefs[getTabIndex("Campus")]} className="min-h-24 pt-4">
                  <CampusInfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Fees */}
              {tabs.includes("Fees") && (
                <div ref={sectionRefs[getTabIndex("Fees")]} className="min-h-24 pt-4">
                  <FeeInfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Scholarship */}
              {tabs.includes("Scholarship") && (
                <div ref={sectionRefs[getTabIndex("Scholarship")]} className="min-h-24 pt-4">
                  <ScholarshipInfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Promotions */}
              <Promotions
                location="INSTITUTE_PAGE_RECTANGLE"
                // className="h-[90px]"
              />
              
              {/* Cut-offs */}
              {tabs.includes("Cut-offs") && (
                <div ref={sectionRefs[getTabIndex("Cut-offs")]} className="min-h-24 pt-4">
                  <CutTOffInfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Ranking */}
              {tabs.includes("Ranking") && (
                <div ref={sectionRefs[getTabIndex("Ranking")]} className="min-h-24 pt-4">
                  <Ranking instituteData={instituteData} />
                </div>
              )}
              
              {/* Gallery */}
              {tabs.includes("Gallery") && (
                <div ref={sectionRefs[getTabIndex("Gallery")]} className="min-h-24 pt-4">
                  <GalleryInfo instituteData={instituteData} />
                </div>
              )}
              
              {/* Review */}
              {tabs.includes("Review") && (
                <div ref={sectionRefs[getTabIndex("Review")]} className="min-h-24 pt-4">
                  <ReviewandRating
                    ratings={ratings}
                    reviews={reviews}
                    instituteId={instituteData.data._id}
                    instituteData={instituteData}
                  />
                </div>
              )}
              
             {/* Facilities */}
             {tabs.includes("Facilities") && (
                <div ref={sectionRefs[getTabIndex("Facilities")]} className="min-h-24 py-4">
                  <InstituteFacilites instituteData={instituteData} />
                </div>
              )}
              
              {/* Q & A */}
              {tabs.includes("Q & A") && (
                <div ref={sectionRefs[getTabIndex("Q & A")]} className="min-h-24 py-4">
                  <Faqs instituteData={instituteData} />
                </div>
              )}
              
              {/* News - only shown if there's data */}
              {shouldShowNews && (
                <div ref={sectionRefs[getTabIndex("News")]} className="min-h-24 py-4">
                  <News instituteData={instituteData} />
                </div>
              )}
              
              {/* Webinar - only shown if there's data */}
              {shouldShowWebinar && (
                <div ref={sectionRefs[getTabIndex("Webinar")]} className="min-h-24 py-4">
                  <Webinar instituteData={instituteData} />
                </div>
              )}
              
              {/* Recruiters */}
              {tabs.includes("Q & A") && (
                <div className="min-h-24 py-4">
                  <RecruitersSlider instituteData={instituteData} />
                </div>
              )}
            </div>
          </div>
          <div className="w-[300px] flex-shrink-0 h-fit pt-4">
            <div className="sticky top-20 z-10 space-y-4">
              {/* Career Guidance Webinar Button */}
              <Link to="/counselor" className="block group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#800e13] to-[#b82025] transition-transform duration-500 group-hover:scale-105" />
                
                {/* Decorative Elements */}
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:translate-x-[-10px] group-hover:translate-y-[10px]" />
                <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

                {/* Content Container */}
                <div className="relative p-7 flex flex-col h-full justify-between z-10">
                  <div className="flex justify-between items-start mb-8">
                    {/* Glass Icon Container */}
                    <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:bg-white/20 transition-colors duration-300">
                      <Video className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                    {/* Arrow Icon */}
                    <div className="bg-white/5 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-white/90 group-hover:text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="h-0.5 w-6 bg-red-300/50 rounded-full"></span>
                       <p className="text-xs font-bold tracking-widest text-red-100/90 uppercase">Webinar</p>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight tracking-wide font-sans">Career Guidance</h3>
                    <p className="text-sm text-red-50/80 leading-relaxed font-light">
                      Get expert career guidance directly from our top counselors.
                    </p>
                  </div>
                </div>
              </Link>
              
              <QueryForm instituteData={instituteData} />
            </div>
            <Promotions location="INSTITUTE_PAGE " className="h-[250px] mt-4" />
          </div>
        </div>
        <HighRatedCareers />
        <BlogComponent />
        <BestRated />
        {/* <Events className="!w-full" /> */}
      </div>
      <div className="flex gap-2 flex-col sm:flex-row items-center">
          <Events />
          <ConsellingBanner />
      </div>
    </>
  );
};

export default Instituepage;