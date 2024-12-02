import React from "react";
import PageBanner from "../Ui components/PageBanner";
import BlogandCareerBox from "../Ui components/BlogandCareerBox";
import img1 from '../assets/Images/img1.png'; 
import img2 from '../assets/Images/img2.png'; 
import img3 from '../assets/Images/img3.png'; 
import img4 from '../assets/Images/img4.png'; 
import ConsellingBanner from "../Components/ConsellingBanner";
import PopularCourses from "../Components/PopularCourses";
import BlogComponent from "../Components/BlogComponent";



const boxData = [
  { 
    title: "Agriculture", 
    imgSrc: img1, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Agriculture
  },
  { 
    title: "Technology", 
    imgSrc: img2, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Technology
  },
  { 
    title: "Business", 
    imgSrc: img3, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Business
  },
  { 
    title: "Healthcare", 
    imgSrc: img4, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Healthcare
  },
  { 
    title: "Engineering", 
    imgSrc: img1, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Engineering
  },
  { 
    title: "Design", 
    imgSrc: img3, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Design
  },
  { 
    title: "Education", 
    imgSrc: img2, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Education
  },
  { 
    title: "Marketing", 
    imgSrc: img4, 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    link: "/detailpage" // Dynamic link for Marketing
  }
];

const Careerspage = () => {
  return (
    <>
      <PageBanner pageName="Careers" currectPage="careers" />
      <div className="px-[4vw] py-[2vw] flex flex-col items-center w-full">
        <BlogandCareerBox boxData={boxData} />
      </div>
      <PopularCourses/>
      <BlogComponent/>
      <ConsellingBanner/>
    </>
  );
};

export default Careerspage;
