import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
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
import ExpandedBox from '../Ui components/ExpandedBox'
import Addmissioninfo from '../Components/Addmissioninfo'
import Placementinfo from '../Components/Placementinfo'
import CampusInfo from '../Components/CampusInfo'
import ScholarshipInfo from '../Components/ScholarshipInfo'
import GalleryInfo from '../Components/GalleryInfo'
import FeeInfo from '../Components/FeeInfo'
import CutTOffInfo from '../Components/CutTOffInfo'
import Ranking from '../Components/Ranking'
import News from '../Components/News'
import { Feed } from '@mui/icons-material'
import Webinar from '../Components/Webinar'
import HighRatedCareers from '../Components/HighRatedCareers'
import BlogComponent from '../Components/BlogComponent'
import Promotions from '../Pages/CoursePromotions'

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
  {
    reviewerName: "Jay Sharma",
    designation: "Ph.D, Marketing",
    year: 2018,
    rating: 4.1,
    review:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente ducimus possimus porro expedita itaque, praesentium illum aspernatur?",
    courseRatings: {
      courseContent: 4.2,
      faculty: 4.0,
      placement: 4.5,
      campus: 3.8,
      fees: 4.1,
    },
  },
  {
    reviewerName: "Nisha Verma",
    designation: "M.Tech, Computer Science",
    year: 2019,
    rating: 4.5,
    review:
      "Excellent faculty and curriculum. Highly recommend this institute for a strong foundation.",
    courseRatings: {
      courseContent: 4.8,
      faculty: 4.5,
      placement: 4.7,
      campus: 4.2,
      fees: 4.0,
    },
  },
  {
    reviewerName: "Rahul Singh",
    designation: "MBA, Finance",
    year: 2020,
    rating: 4.2,
    review:
      "The placements were amazing! Most of my batchmates secured top-tier jobs.",
    courseRatings: {
      courseContent: 4.4,
      faculty: 4.3,
      placement: 4.7,
      campus: 4.0,
      fees: 4.2,
    },
  },
  {
    reviewerName: "Ankita Roy",
    designation: "B.Sc, Biology",
    year: 2021,
    rating: 3.8,
    review:
      "Campus is beautiful, but there's room for improvement in hostels and facilities.",
    courseRatings: {
      courseContent: 3.9,
      faculty: 3.8,
      placement: 3.7,
      campus: 3.6,
      fees: 3.9,
    },
  },
  {
    reviewerName: "Vikram Chauhan",
    designation: "B.Tech, Mechanical",
    year: 2022,
    rating: 4.7,
    review:
      "One of the best experiences of my life. Incredible learning environment.",
    courseRatings: {
      courseContent: 4.9,
      faculty: 4.8,
      placement: 4.6,
      campus: 4.7,
      fees: 4.5,
    },
  },
  {
    reviewerName: "Pooja Mehra",
    designation: "MCA, IT",
    year: 2019,
    rating: 4.3,
    review:
      "Good course content and experienced professors. Helped me grow technically.",
    courseRatings: {
      courseContent: 4.5,
      faculty: 4.2,
      placement: 4.4,
      campus: 4.1,
      fees: 4.3,
    },
  },
  {
    reviewerName: "Aman Gupta",
    designation: "BBA, Marketing",
    year: 2020,
    rating: 3.9,
    review:
      "Decent institute, but could do better in terms of infrastructure.",
    courseRatings: {
      courseContent: 4.0,
      faculty: 3.9,
      placement: 3.8,
      campus: 3.7,
      fees: 4.0,
    },
  },
];

const Instituepage = () => {
  const { id } = useParams(); 
  const [ratings, setRatings] = useState([]);
  const sectionRefs = tabs.map(() => useRef(null));


  const { data: instituteData, isError, error } = useQuery(
    ['institute', id], 
    () => getInstituteById(id),
    {
      enabled: !!id, 
    }
  );

  console.log(instituteData?.data);

  //fetching courses
  // const { data: coursesData, isLoadingCourses, isErrorCourses, errorCourses } = useQuery(
  //   ['courses', id],
  //   () => getCourses(id),
  //   {
  //     enabled: !!id,
  //   }
  // );

  // console.log("courses fetching ", coursesData);
  


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


  if (!instituteData) {
    return <div><Loader/></div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>; // Show error if request fails
  }

// console.log('hi',instituteData?.data?._id);
  return (
    <>
      <div className=' px-[4vw] py-[2vw] flex flex-col items-start'>
             <ImageSlider instituteData = {instituteData}/>
             <InstitueName instituteData = {instituteData}/>
              <TabSlider tabs={tabs} sectionRefs={sectionRefs} />
             <div className='w-full flex gap-4'>

                      <div className='w-full lg:w-4/5'>
                        <div className='w-full min-h-24 '>
                          <div ref={sectionRefs[0]} className="min-h-24 pt-4 ">
                            <CollegeInfo instituteData = {instituteData} />
                          </div>
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
                          <div  className="min-h-24 py-4">
                            <RecruitersSlider instituteData={instituteData}/>
                          </div>
                          <div ref={sectionRefs[12]} className="min-h-24 py-4">
                            <Faqs instituteData={instituteData}/>
                          </div>
                          <div ref={sectionRefs[13]} className="min-h-24 py-4">
                            <News instituteData={instituteData}/>
                          </div>
                          <div ref={sectionRefs[14]} className="min-h-24 py-4">
                            <Webinar instituteData={instituteData}/>
                          </div>
                          {/* <div ref={sectionRefs[3]} className="min-h-screen p-4 bg-gray-50">
                            <Placements />
                          </div> */}
                      
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

export default Instituepage