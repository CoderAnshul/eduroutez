import React from "react";
import { Link } from "react-router-dom";
import {
  trendingCareers,
  popularCourses,
  topInstitutes,
  bestRatedColleges,
  aboutLinks,
  otherLinks,
  topUniversities,
  freeCourses,
  examResults,
  rrbGroupDLinks,
} from "../DataFiles/footerData.js";
import logo from '../assets/Images/logo.png';
import facebook from '../assets/Images/facebook.png';
import instagram from '../assets/Images/instagram.png';
import twitter from '../assets/Images/twitter.png';
import youtube from '../assets/Images/youtube.png';

const Footer = () => {
  // Split trendingCareers into two halves
  const halfIndexTrending = Math.ceil(trendingCareers.length / 2);
  const trendingCareersFirstHalf = trendingCareers.slice(0, halfIndexTrending);
  const trendingCareersSecondHalf = trendingCareers.slice(halfIndexTrending);

  // Split popularCourses into two halves
  const halfIndexCourses = Math.ceil(popularCourses.length / 2);
  const popularCoursesFirstHalf = popularCourses.slice(0, halfIndexCourses);
  const popularCoursesSecondHalf = popularCourses.slice(halfIndexCourses);

  return (
    <footer className="bg-black lg:whitespace-nowrap text-white py-8 px-4 ">
      <div className="flex justify-between flex-wrap gap-4 px-[4vw] mx-auto w-full mb-4  max-w-[1300px]">
        {/* Trending Careers */}
        <div>
          <h3 className="font-semibold text-red-500 mb-3">MBA</h3>
          <div className="flex gap-4">
            {/* First Column */}
            <ul className="space-y-1 text-sm">
              {trendingCareersFirstHalf.map((career, index) => (
                <li key={index}>
                  <Link to={career.link} className="footerText">
                    {career.name}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Second Column */}
            <ul className="space-y-1 text-sm">
              {trendingCareersSecondHalf.map((career, index) => (
                <li key={index}>
                  <Link to={career.link} className="footerText">
                    {career.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular Courses */}
        <div>
          <h3 className="font-semibold text-red-500 mb-3">Engineering</h3>
          <div className="flex gap-6 justify-between">
            {/* First Column */}
            <ul className="space-y-1 text-sm">
              {popularCoursesFirstHalf.map((course, index) => (
                <li key={index}>
                  <Link to={course.link} className="footerText">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Second Column */}
            <ul className="space-y-1 text-sm">
              {popularCoursesSecondHalf.map((course, index) => (
                <li key={index}>
                  <Link to={course.link} className="footerText">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>


        <div>
          <h3 className="font-semibold text-red-500 mb-3">Medicine</h3>
          <ul className="space-y-1 text-sm">
            {topInstitutes.map((institute, index) => (
              <li key={index}>
                <Link to={institute.link} className="footerText">
                  {institute.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>


         {/* Best Rated Colleges */}
         <div>
          <h3 className="font-semibold text-red-500 mb-3">Other Courses</h3>
          <ul className="space-y-1 text-sm">
            {bestRatedColleges.map((college, index) => (
              <li key={index}>
                <Link to={college.link} className="footerText">
                  {college.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      
      </div>

      <div className="flex justify-between gap-4 flex-wrap px-[4vw] mx-auto w-full  max-w-[1300px]">
        {/* Top Institutes */}
    

  {/* Other Links */}
  <div>
          <h3 className="font-semibold text-red-500 mb-3">Resources</h3>
          <div className="flex gap-4">
            {/* First Column */}
            <ul className="space-y-1 text-sm">
              {otherLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.link} className="footerText">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Free Courses */}
        <div>
          <h3 className="font-semibold text-red-500 mb-3">Shiksha Online</h3>
          <ul className="space-y-1 text-sm">
            {freeCourses.map((course, index) => (
              <li key={index}>
                <Link to={course.link} className="footerText">
                  {course.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-red-500 mb-3">Important Updates</h3>
          <ul className="space-y-1 text-sm">
            {examResults.map((result, index) => (
              <li key={index}>
                <Link to={result.link} className="footerText">
                  {result.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-red-500 mb-3">Sarkari Exams</h3>
          <ul className="space-y-1 text-sm">
            {rrbGroupDLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.link} className="footerText">

                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
       

        {/* About Eduroutez */}
        <div>
          <h3 className="font-semibold text-red-500 mb-3">Study Abroad</h3>
          <ul className="space-y-1 text-sm">
            {aboutLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.link} className="footerText">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link to="/">
                <img className='h-6 md:h-8' src={logo} alt="mainLogo" />
            </Link>
            <div className="flex mt-3 justify-between w-full gap-4">
                <Link to="/">
                    <div className="aspect-w-1 aspect-h-1">
                        <img className='h-7 -mt-[2px] object-cover' src={facebook} alt="Facebook" />
                    </div>
                </Link>
                <Link to="/">
                    <div className="aspect-w-1 aspect-h-1">
                        <img className='h-6 object-cover' src={instagram} alt="Instagram" />
                    </div>
                </Link>
                <Link to="/">
                    <div className="aspect-w-1 aspect-h-1">
                        <img className='h-6 object-cover' src={twitter} alt="Twitter" />
                    </div>
                </Link>
                <Link to="/">
                    <div className="aspect-w-1 aspect-h-1">
                        <img className='h-[38px] object-cover' src={youtube} alt="YouTube" />
                    </div>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;