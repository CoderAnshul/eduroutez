import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ImageSlider from "../Ui components/ImageSlider";
import InstitueName from "../Ui components/InstitueName";
import TabSlider from "../Ui components/TabSlider";
import CollegeInfo from "../Components/CollegeInfo";
import InstituteCourses from "../Components/InstituteCourses";
import QueryForm from "../Ui components/QueryForm";
import ReviewandRating from "../Components/ReviewandRating";
import InstituteFacilites from "../Components/InstituteFacilites";
import RecruitersSlider from "../Ui components/RecruitersSlider";
import Faqs from "../Components/Faqs";
import BestRated from "../Components/BestRated";
import Events from "../Components/Events";
import { useQuery } from "react-query";
import { getInstituteById } from "../ApiFunctions/api";
import Loader from "../Components/Loader";
import Addmissioninfo from "../Components/Addmissioninfo";
import Placementinfo from "../Components/Placementinfo";
import CampusInfo from "../Components/CampusInfo";
import ScholarshipInfo from "../Components/ScholarshipInfo";
import GalleryInfo from "../Components/GalleryInfo";
import FeeInfo from "../Components/FeeInfo";
import CutTOffInfo from "../Components/CutTOffInfo";
import Ranking from "../Components/Ranking";
import News from "../Components/News";
import Webinar from "../Components/Webinar";
import HighRatedCareers from "../Components/HighRatedCareers";
import BlogComponent from "../Components/BlogComponent";
import Promotions from "../Pages/CoursePromotions";
import axiosInstance from "../ApiFunctions/axios";
import ConsellingBanner from "../Components/ConsellingBanner";

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
  { key: "News", dataKey: null}, // Always show
  { key: "Webinar", dataKey: null }, // Always show
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

  // Filter tabs based on available data
  useEffect(() => {
    if (instituteData?.data) {
      const data = instituteData.data;
      
      // Filter tabs based on whether they have corresponding data
      const filteredTabs = allPossibleTabs.filter(tabInfo => {
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
      
      setTabs(filteredTabs);
      
      // Create refs for each tab
      setSectionRefs(filteredTabs.map(() => React.createRef()));
    }
  }, [instituteData]);

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
                className="h-[90px]"
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
                <div ref={sectionRefs[getTabIndex("Q & A")]} className="min-h-24 py-4">
                  <Faqs instituteData={instituteData} />
                </div>
              
              {/* News */}
              {tabs.includes("News") && (
                <div ref={sectionRefs[getTabIndex("News")]} className="min-h-24 py-4">
                  <News instituteData={instituteData} />
                </div>
              )}
              
              {/* Webinar */}
              {tabs.includes("Webinar") && (
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
          <div className="w-[300px] h-[250px]">
            <QueryForm instituteData={instituteData} />
            <Promotions location="INSTITUTE_PAGE " className="h-[250px]" />
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