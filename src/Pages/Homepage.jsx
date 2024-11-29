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

const Homepage = () => {
  return (
    <>
      <Banner/>
      <div className='p-[4vw] flex flex-col items-center' >
          <Counselling/>
          <TrendingInstitute/>
      </div>
      <PopularCategories/>
      <div className='p-[4vw] flex flex-col items-center' >
         <BestRated/>
         <PopularCourses/>
         <HighRatedCareers/>
      </div>
      <Instructor/>
      <div className='p-[4vw] flex flex-col items-center' >
         <BlogComponent/>
      </div>
         <Reviews/>
         <Events/>
    </>
  )
}

export default Homepage