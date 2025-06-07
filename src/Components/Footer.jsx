import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, Code } from "lucide-react";
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
import logo from "../assets/Images/footer-logo.png";
import facebook from "../assets/Images/facebook.png";
import instagram from "../assets/Images/instagram.png";
import twitter from "../assets/Images/linkedin-sign.png";
import youtube from "../assets/Images/youtube.png";

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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">MBA</h3>
            <div className="flex flex-col gap-1">
              {/* First Column */}
              <ul className="space-y-1 text-sm !ml-0 ">
                {trendingCareersFirstHalf.map((career, index) => (
                  <li key={index}>
                    <Link to={career.link} className="footerText">
                      {career.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Second Column */}
              <ul className="space-y-1 text-sm !ml-0 ">
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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">Engineering</h3>
            <div className="flex flex-col gap-1">
              {/* First Column */}
              <ul className="space-y-1 text-sm !ml-0 ">
                {popularCoursesFirstHalf.map((course, index) => (
                  <li key={index}>
                    <Link to={course.link} className="footerText">
                      {course.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Second Column */}
              <ul className="space-y-1 text-sm !ml-0 ">
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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">Medicine</h3>
            <ul className="space-y-1 text-sm !ml-0 ">
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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">Explore Courses</h3>
            <ul className="space-y-1 text-sm !ml-0 ">
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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">Career Guidance</h3>
            <div className="flex flex-col gap-1">
              <ul className="space-y-1 text-sm !ml-0 ">
                {otherLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.link} className="footerText">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 text-sm !ml-0  mt-1">
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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">Eduroutez Hub</h3>
            <ul className="space-y-1 text-sm !ml-0  ">
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
            <h3 className="font-semibold text-red-500 mb-3 !text-[16px]">Study Abroad</h3>
            <ul className="space-y-1 text-sm !ml-0 ">
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
              <img className="h-8 md:h-10" src={logo} alt="mainLogo" />
            </Link>
            <div className="mt-3">
              <div className="flex items-start">
                <div className="transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="w-5 h-5 mt-0.5 mr-2 transition-opacity duration-300 hover:opacity-80"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-wrap">
                  Office No. 603, 6th floor, Paradise Tower, Gokhale Rd, next to
                  McDonaldʼs, Naupada, Thane West, Thane, Maharashtra 400602
                </span>
              </div>
            </div>

            <div className="text-sm mt-1 text-wrap flex items-center">
              <Phone size={16} className="mr-2 text-red-500" />
              <a
                href="tel:9867877121"
                className="hover:text-red-400 text-white transition-colors"
              >
                (+91) 9594669999 <br />
                (+91) 9594941234.
              </a>
            </div>
            <div className="text-sm mt-1 text-wrap flex items-center">
              <Mail size={16} className="mr-2 text-red-500" />
              <a
                href="mailto:contact@eduroutez.com"
                className="hover:text-red-400 text-white transition-colors"
              >
                contact@eduroutez.com
              </a>
            </div>

            <div className="flex gap-4 mt-6">
              <Link to="https://www.facebook.com/eduroutez" target="_blank">
                <div className="aspect-w-1 aspect-h-1 transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
                  <img
                    className="h-6 -mt-[2px] object-cover transition-opacity duration-300 hover:opacity-80"
                    src={facebook}
                    alt="Facebook"
                  />
                </div>
              </Link>
              <Link to="https://www.instagram.com/eduroutez/" target="_blank">
                <div className="aspect-w-1 aspect-h-1 transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
                  <img
                    className="h-5 object-cover transition-opacity duration-300 hover:opacity-80"
                    src={instagram}
                    alt="Instagram"
                  />
                </div>
              </Link>
              <Link
                to="https://www.linkedin.com/company/eduroutez-official "
                target="_blank"
              >
                <div className="aspect-w-1 aspect-h-1 transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
                  <img
                    className="h-5 object-cover transition-opacity duration-300 hover:opacity-80"
                    src={twitter}
                    alt="LinkedIn"
                  />
                </div>
              </Link>
              <Link
                to="https://www.youtube.com/channel/UCijwjFtGJ92YK6dUWXcepIg"
                target="_blank"
              >
                <div className="aspect-w-1 aspect-h-1 transition-transform duration-300 hover:scale-110 hover:-translate-y-1">
                  <img
                    className="h-[34px] object-cover transition-opacity duration-300 hover:opacity-80"
                    src={youtube}
                    alt="YouTube"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright and Policy Links */}
        <div className="pt-6 mt-4 border-t border-gray-700">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center justify-center text-center gap-x-4 gap-y-2 text-xs text-gray-400">
              <span>
                &copy; {new Date().getFullYear()} Eduroutez. All rights reserved.
              </span>
              <span className="hidden sm:inline">|</span>
              <Link
                to="/terms-&-conditions"
                className="hover:text-white text-gray-400 transition-colors"
              >
                Terms & Conditions
              </Link>
              <span className="hidden sm:inline">|</span>
              <Link
                to="/policy"
                className="hover:text-white text-gray-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
            
            {/* Developed by Nexprism */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center sm:justify-end text-xs text-gray-400">
              <Link
                to="https://nexprism.com"
                target="_blank" 
                className="hover:text-white text-gray-400 transition-colors text-xs"
              >
                Developed by Nexprism
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;