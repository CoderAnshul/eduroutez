import React from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate();

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
      {/* <CourseRanking /> */}
      <PopularCategories />

      {/* AI Features Highlight */}
      <section className="universal-container py-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#b82025]/5 via-[#e23744]/5 to-orange-50/40 border border-[#b82025]/10 p-8 md:p-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#b82025]/5 to-transparent rounded-full -mr-12 -mt-12" />
          <div className="relative text-center mb-8">
            <span className="inline-block text-xs font-semibold text-[#b82025] bg-white px-3 py-1 rounded-full mb-2 shadow-sm border border-[#b82025]/10">AI-POWERED TOOLS</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Smarter Guidance with AI</h2>
            <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">Get instant answers, compare careers, and discover your perfect path</p>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                ),
                title: 'AI Counselor',
                desc: 'Chat 24×7 with EduBot — get instant answers on courses, colleges & admissions',
                color: 'from-rose-500 to-rose-700',
                shadow: 'shadow-rose-500/25',
                isButton: true,
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                ),
                title: 'Personality Assessment',
                desc: 'Find your ideal career match with our AI-powered psychometric test',
                color: 'from-violet-500 to-violet-700',
                shadow: 'shadow-violet-500/25',
                path: '/personality-assessment',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a9 9 0 018.66 6.57M12 2a9 9 0 00-8.66 6.57M12 22a9 9 0 008.66-6.57M12 22a9 9 0 01-8.66-6.57M3.34 8.57a9 9 0 000 6.86M20.66 8.57a9 9 0 010 6.86" />
                  </svg>
                ),
                title: 'Market Trends',
                desc: 'AI-powered insights on course demand, salary trends & emerging fields',
                color: 'from-amber-500 to-amber-700',
                shadow: 'shadow-amber-500/25',
                path: '/market-trends',
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <path d="M12 19v3" />
                  </svg>
                ),
                title: 'Voice Counselor',
                desc: 'Speak in Hindi, English & more — get answers with your voice',
                color: 'from-emerald-500 to-emerald-700',
                shadow: 'shadow-emerald-500/25',
                path: '/voice-counselor',
              },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  if (item.isButton) {
                    document.getElementById('chatbot-toggle-btn')?.click();
                  } else {
                    navigate(item.path);
                  }
                }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-xl hover:border-[#b82025]/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg ${item.shadow} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1.5 group-hover:text-[#b82025] transition-colors">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#b82025] opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0">
                  {item.isButton ? 'Open Chat' : 'Explore'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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