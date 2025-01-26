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

const tabs = [
  "College Info",
  "Courses",
  "Admissions",
  "Placements",
  "Campus",
  "Scholarship",
  "Gallery",
  "Q & A",
  "Review",
  "Fees",
  "News",
  "Cut-offs",
  "Facilities",
  "Ranking",
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


  const { data: instituteData, isLoading, isError, error } = useQuery(
    ['institute', id], 
    () => getInstituteById(id),
    {
      enabled: !!id, 
    }
  );

  console.log(instituteData?.data?.email);

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
        <div className='px-[4vw] py-[2vw] flex flex-col items-start'>
             <ImageSlider instituteData = {instituteData}/>
             <InstitueName instituteData = {instituteData}/>
              <TabSlider tabs={tabs} sectionRefs={sectionRefs} />
             <div className='w-full flex gap-4'>

              {/* -------------main content of college and ads section ------------------- */}
                <div className='w-full lg:w-4/5'>
                  <div className='w-full min-h-24 '>
                      <div ref={sectionRefs[0]} className="min-h-24 pt-4 ">
                          <CollegeInfo instituteData = {instituteData} />
                      </div>
                      <div ref={sectionRefs[1]} className="min-h-24 py-4">
                          <InstituteCourses instituteData = {instituteData} />
                      </div>
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
                          <ScholarshipInfo instituteData={instituteData}/>
                      </div>
                      <div ref={sectionRefs[5]} className="min-h-24 pt-4">
                          <GalleryInfo instituteData={instituteData}/>
                      </div>
                      <div ref={sectionRefs[8]} className="min-h-24 pt-4">
                          <ReviewandRating ratings={ratings} reviews={reviews} instituteData={instituteData}/>
                      </div>
                      <div className="min-h-24 py-4">
                          <InstituteFacilites instituteData={instituteData}/>
                      </div>
                      <div  className="min-h-24 py-4">
                          <RecruitersSlider/>
                      </div>
                      <div ref={sectionRefs[7]} className="min-h-24 py-4">
                          <Faqs instituteData={instituteData}/>
                      </div>
                      {/* <div ref={sectionRefs[3]} className="min-h-screen p-4 bg-gray-50">
                          <Placements />
                      </div> */}
                      
                  </div>
                </div>
                <QueryForm/>

             </div>
             <BestRated/>
             <Events className="!w-full"/>
        </div>
    </>
  )
}

export default Instituepage