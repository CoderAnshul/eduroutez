import React from 'react'
import PageBanner from '../Ui components/PageBanner'
import BlogandCareerBox from '../Ui components/BlogandCareerBox'
import img from '../assets/Images/img.avif'
import Events from '../Components/Events'
import ConsellingBanner from '../Components/ConsellingBanner'
import PopularCourses from '../Components/PopularCourses'
import { useQuery } from 'react-query'
import { blogs } from '../ApiFunctions/api'

const Blogpage = () => {

    const { data: blogData, isLoading, isError, error } = useQuery(
      ['blogs'], 
      blogs,
      { enabled: true }
    );
  
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error: {error.message}</p>;
  

    const boxData = [
        { title: "Agriculture", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", link:'/detailpage' },
        { title: "Technology", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." , link:'/detailpage'},
        { title: "Business", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", link:'/detailpage' },
        { title: "Healthcare", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", link:'/detailpage' },
        { title: "Engineering", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", link:'/detailpage' },
        { title: "Design", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." , link:'/detailpage'},
        { title: "Education", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." , link:'/detailpage'},
        { title: "Marketing", imgSrc: img, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", link:'/detailpage' },
      ];
  return (
    <>
    <PageBanner pageName="Blog" currectPage="blog" />
      <div className="px-[4vw] pb-[2vw] flex flex-col items-start mt-10">
        <BlogandCareerBox boxData={boxData} blogData={blogData}/>
        
      </div>
      <PopularCourses/>
      <div className="flex gap-2 items-center">
      <Events/>
      <ConsellingBanner/>
      </div>
    </>
  )
}

export default Blogpage