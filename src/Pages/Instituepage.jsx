import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ImageSlider from '../Ui components/ImageSlider'
import InstitueName from '../Ui components/InstitueName'
import TabSlider from '../Ui components/TabSlider'
import CollegeInfo from '../Components/CollegeInfo';
import InstituteCourses from '../Components/InstituteCourses';
import QueryForm from '../Ui components/QueryForm';
import ReviewandRating from '../Components/ReviewandRating';
import InstituteFacilites from '../Components/InstituteFacilites';
import RecruitersSlider from '../Ui components/RecruitersSlider';
import Faqs from '../Components/Faqs';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import { useQuery } from 'react-query';
import { getInstituteById } from '../ApiFunctions/api';
import Loader from '../Components/Loader';
import Addmissioninfo from '../Components/Addmissioninfo'
import Placementinfo from '../Components/Placementinfo'
import CampusInfo from '../Components/CampusInfo'
import ScholarshipInfo from '../Components/ScholarshipInfo'
import GalleryInfo from '../Components/GalleryInfo'
import FeeInfo from '../Components/FeeInfo'
import CutTOffInfo from '../Components/CutTOffInfo'
import Ranking from '../Components/Ranking'
import News from '../Components/News'
import Webinar from '../Components/Webinar'
import HighRatedCareers from '../Components/HighRatedCareers'
import BlogComponent from '../Components/BlogComponent'
import Promotions from '../Pages/CoursePromotions'
import axiosInstance from '../ApiFunctions/axios';

const tabs = [
  "College Info",
  "Courses",
  "Admissions",
  "Placements",
  "Campus",
  "Fees",
  "Scholarship",
  "Cut-offs",
  "Ranking",
  "Gallery",
  "Review",
  "Facilities",
  "Q & A",
  "News",
  "Webinar"
];

const reviews = [
  // Reviews data remains unchanged
];

  const Instituepage = () => {
    const { id } = useParams(); // This can be either ID or slug
    const [ratings, setRatings] = useState([]);
    const sectionRefs = tabs.map(() => useRef(null));
    const navigate = useNavigate();
    const [instituteIdMap, setInstituteIdMap] = useState({});
  
    useEffect(() => {
      if (!window.instituteIdMap) {
        try {
          const storedInstituteIdMap = JSON.parse(localStorage.getItem('instituteIdMap') || '{}');
          window.instituteIdMap = storedInstituteIdMap;
        } catch (error) {
          console.error('Error initializing instituteIdMap:', error);
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
              response = await axiosInstance.get(`/api/v1/institute/by-slug/${id}`);
              
              // If we got a response, grab the ID for future use
              if (response && response.data) {
                instituteId = response.data._id;
                
                // Save this slug -> ID mapping to both window and localStorage
                window.instituteIdMap = window.instituteIdMap || {};
                window.instituteIdMap[id] = instituteId;
                localStorage.setItem('instituteIdMap', JSON.stringify(window.instituteIdMap));
                console.log(`Saved mapping: ${id} -> ${instituteId} in localStorage`);
              }
            } catch (slugError) {
              console.error('Error fetching institute by slug:', slugError);
              
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
            localStorage.setItem('instituteIdMap', JSON.stringify(window.instituteIdMap));
            console.log(`Saved mapping: ${slug} -> ${instituteId} in localStorage`);
          }
        }
        
        if (!response || !response.data) {
          throw new Error('No institute data found');
        }
        
        return response;
      } catch (error) {
        console.error("Failed to fetch institute data:", error);
        throw new Error(`Failed to fetch institute data: ${error.message}`);
      }
    }, [id]);
  
    // Use react-query with our custom fetch function
    const { data: instituteData, isError, error, isLoading } = useQuery(
      ['institute', id], 
      fetchInstituteData,
      {
        enabled: !!id,
        staleTime: 300000, // 5 minutes
        cacheTime: 3600000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnMount: true,
      }
    );

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

  // Helper function to get URL for display
  const getInstituteUrl = (institute) => {
    // If we have a slug, use it for SEO purposes
    return  `/institute/${institute?._id}`;
  };

  if (isLoading) {
    return <div><Loader/></div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!instituteData) {
    return <div><Loader/></div>;
  }

  return (
    <>
      <div className=' px-[4vw] py-[2vw] flex flex-col items-start'>
        <ImageSlider instituteData = {instituteData}/>
        <InstitueName instituteData = {instituteData}/>
        <TabSlider tabs={tabs} sectionRefs={sectionRefs} />
        <div className='w-full flex gap-4'>
          <div className='w-full lg:w-4/5'>
            <div className='w-full min-h-24'>
              <div ref={sectionRefs[0]} className="min-h-24 pt-4 ">
                <CollegeInfo instituteData = {instituteData} />
              </div>
              {/* Rest of component sections remain unchanged */}
              <div ref={sectionRefs[1]} className="min-h-24 py-4">
                <InstituteCourses instituteData = {instituteData} />
              </div>
              {instituteData?.data?.examAccepted && (
                <div className="px-4 py-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Accepted Exams
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {instituteData?.data?.examAccepted.split(',').map((exam, index) => (
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
              <div ref={sectionRefs[2]} className="min-h-24 py-4">
                <Addmissioninfo instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[3]} className="min-h-24 pt-4">
                <Placementinfo instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[4]} className="min-h-24 pt-4">
                <CampusInfo instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[5]} className="min-h-24 pt-4">
                <FeeInfo ref={sectionRefs[5]} instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[6]} className="min-h-24 pt-4">
                <ScholarshipInfo instituteData={instituteData}/>
              </div>
              <Promotions location="INSTITUTE_PAGE_RECTANGLE" className="h-[90px]"></Promotions>
              <div ref={sectionRefs[7]} className="min-h-24 pt-4">
                <CutTOffInfo instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[8]} className="min-h-24 pt-4">
                <Ranking instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[9]} className="min-h-24 pt-4">
                <GalleryInfo instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[10]} className="min-h-24 pt-4">
                <ReviewandRating ratings={ratings} reviews={reviews} instituteId={instituteData._id} instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[11]} className="min-h-24 py-4">
                <InstituteFacilites instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[12]} className="min-h-24 py-4">
                <RecruitersSlider instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[13]} className="min-h-24 py-4">
  <Faqs instituteData={instituteData}/>
</div>
              <div ref={sectionRefs[14]} className="min-h-24 py-4">
                <News instituteData={instituteData}/>
              </div>
              <div ref={sectionRefs[15]} className="min-h-24 py-4">
                <Webinar instituteData={instituteData}/>
              </div>
            </div>
          </div>
          <div className='w-[300px] h-[250px]'>
            <QueryForm instituteData={instituteData}/>
            <Promotions location="INSTITUTE_PAGE " className="h-[250px]"/>
          </div>
        </div>
        <HighRatedCareers></HighRatedCareers>
        <BlogComponent></BlogComponent>
        <BestRated/>
        <Events className="!w-full"/>
      </div>
    </>
  )
}

export default Instituepage;