import React from "react";
import { Link } from "react-router-dom";
import {
  trendingCareers,
  popularCourses,
  topInstitutes,
  bestRatedColleges,
  aboutLinks,
  otherLinks,
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
    <footer className="bg-black lg:whitespace-nowrap text-white py-8 px-4">
      <div className="px-[4vw] mx-auto w-full max-w-[1300px]">
        {/* Using grid for consistent column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Trending Careers */}
          <div>
            <h3 className="font-semibold text-red-500 mb-3">MBA</h3>
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
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

          {/* Medicine */}
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

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-red-500 mb-3">Resources</h3>
            <div className="flex flex-col gap-1">
              <ul className="space-y-1 text-sm">
                {otherLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.link} className="footerText">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 text-sm mt-1">
                {examResults.map((result, index) => (
                  <li key={index}>
                    <Link to={result.link} className="footerText">
                      {result.name}
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
          </div>

          {/* Logo and Social Media */}
          <div>
            <Link to="/">
              <img className="h-6 md:h-8" src={logo} alt="mainLogo" />
            </Link>
            <div className="flex mt-3 gap-4">
              <Link to="/">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="h-7 -mt-[2px] object-cover" src={facebook} alt="Facebook" />
                </div>
              </Link>
              <Link to="/">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="h-6 object-cover" src={instagram} alt="Instagram" />
                </div>
              </Link>
              <Link to="/">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="h-6 object-cover" src={twitter} alt="Twitter" />
                </div>
              </Link>
              <Link to="/">
                <div className="aspect-w-1 aspect-h-1">
                  <img className="h-[38px] object-cover" src={youtube} alt="YouTube" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Copyright and Policy Links */}
        <div className="pt-6 mt-4 border-t border-gray-700">
          <div className="flex flex-wrap items-center justify-center text-center gap-x-4 gap-y-2 text-xs text-gray-400">
            <span>&copy; {new Date().getFullYear()} Eduroutez. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden sm:inline">|</span>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;