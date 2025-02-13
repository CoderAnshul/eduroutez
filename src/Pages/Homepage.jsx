import React from 'react'
import Banner from '../Components/Banner'
import Counselling from '../Components/Counselling'
import TrendingInstitute from '../Components/TrendingInstitute'
import BestRated from '../Components/BestRated'
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
      <Banner/>
      <div className='p-[4vw] flex flex-col items-center' >
          <Counselling/>
          <PopularCourses/>
         
      </div>
      <PopularCategories/>
      <div className='p-[4vw] flex flex-col items-center' >
         <BestRated/>
         <TrendingInstitute/>
         <Promotions location='HOME_PAGE'/>
         <HighRatedCareers/>
      </div>
      <Instructor/>
      <div className='p-[4vw] flex flex-col items-center' >
         <BlogComponent/>
      </div>
         <Reviews/>
         {/* <Events className = "!w-full"/> */}
         <div className="flex gap-2 flex-col sm:flex-row items-center">
          <Events />
          <ConsellingBanner />
          </div>
    </>
  )
}

export default Homepage