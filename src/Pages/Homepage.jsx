import React from 'react'
import Banner from '../Components/Banner'
import Counselling from '../Components/Counselling'
import TrendingInstitute from '../Components/TrendingInstitute'
import RecentlyViewed from '../Components/RecentlyViewed'
import BestRated from '../Components/BestRated'
import BestRatedUniversity from '../Components/BestRatedUniversity'
import PopularCourses from '../Components/PopularCourses'
import HighRatedCareers from '../Components/HighRatedCareers'
import PopularCategories from '../Components/PopularCategories'
import Instructor from '../Components/Instructor'
import BlogComponent from '../Components/BlogComponent'
import { Reviews } from '../Components/Reviews'
import Events from '../Components/Events'
import { useQuery } from 'react-query'
import { homeBanner } from '../ApiFunctions/api'
import { useParams } from 'react-router-dom'
import ConsellingBanner from '../Components/ConsellingBanner'
import Promotions from './CoursePromotions'
import TrendingCourses from '../Components/TrendingCourses'
import CourseRanking from '../Components/CourseRanking'
import BecomeCounselorBanner from '../Components/BecomeCounselorBanner'
import { Helmet } from 'react-helmet-async'

const Homepage = () => {

  // const { data: BannerData, isLoading, isError, error } = useQuery(
  //   ['Banner'], 
  //   homeBanner,
  //   { enabled: true }
  // );

  // if (isLoading) return <p>Loading...</p>;
  // if (isError) return <p>Error: {error.message}</p>;








  return (
    <>
      <Helmet>
        <title>Find Top Colleges, Universities & Courses in India | Eduroutez</title>
        <meta
          name="description"
          content="Search and compare colleges, universities, courses, entrance exams, and career counselors across India. Apply online with Eduroutez."
        />
        <meta
          name="keywords"
          content="top colleges in India, universities in India, courses after 12th, engineering colleges, MBA colleges, admission 2026, career counseling, college search, education portal, Eduroutez"
        />
        <link rel="iconion" href="https://eduroutez.com/" />
      </Helmet>

      <Banner />

      {/* <div className="universal-container flex flex-col items-center">

        <Counselling />
      </div> */}
      {/* Using standard Tailwind classes for width and height instead of arbitrary values */}
      <div className="universal-max-width h-fit py-4">
        <Promotions location="HOME_PAGE" />
        {/* // <Promotions location="HOME_PAGE" className="h-[90px]" /> */}
      </div>

      <RecentlyViewed />
      <div className="universal-container flex flex-col items-center">
        <PopularCourses />
      </div>
      <div className="universal-container flex flex-col items-center">
        <TrendingCourses />
      </div>
      <CourseRanking />
      <PopularCategories />
      <div className='universal-container flex flex-col items-center' >
        <BestRated />
        <BestRatedUniversity />
        <HighRatedCareers />
        <TrendingInstitute />
      </div>
      {/* <Instructor /> */}
      {/* <BecomeCounselorBanner /> */}
      <div className='universal-container flex flex-col items-center' >
        <BlogComponent />
      </div>
      <Reviews />
      {/* <Events className = "!w-full"/> */}
      <div className="flex gap-2 flex-col lg:flex-row items-center">
        {/* <Events /> */}

        {/*  {/* <ConsellingBanner /> */}
      </div>
    </>
  )
}

export default Homepage