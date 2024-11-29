import React, { useState, useRef } from "react";
import detail from "../assets/Images/detail.png";

const Detailpage = () => {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("Overview");

  // Create refs for each section
  const overviewRef = useRef(null);
  const eligibilityRef = useRef(null);
  const jobsRolesRef = useRef(null);
  const careerOpportunityRef = useRef(null);
  const topCollegesRef = useRef(null);

  // Function to handle scroll and set active tab
  const scrollToSection = (sectionRef, tabName) => {
    setActiveTab(tabName); // Update active tab
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tabs = [
    { name: "Overview", ref: overviewRef },
    { name: "Eligibility", ref: eligibilityRef },
    { name: "Jobs Roles", ref: jobsRolesRef },
    { name: "Career Opportunity", ref: careerOpportunityRef },
    { name: "Top Colleges", ref: topCollegesRef },
  ];

  return (
    <div className="px-[4vw] py-[2vw] flex flex-col items-start">
      {/* Banner Image */}
      <div className="h-80 w-full rounded-md">
        <img
          className="h-full w-full object-cover"
          src={detail}
          alt="bannerdetailimg"
        />
      </div>

      {/* Tabs */}
      <div className="w-full md:px-4 py-6">
  <h1 className="text-2xl font-bold mb-4">Digital Marketing Course</h1>
  <div className="w-full overflow-x-scroll">
  <div className="border-2 rounded-lg border-gray-300 overflow-x-auto w-fit">
    <ul className="flex whitespace-nowrap">
      {tabs.map((tab) => (
        <li
          key={tab.name}
          className={`cursor-pointer px-4 border-r-2 border-black border-opacity-55 py-2 text-sm font-medium 
            ${
              activeTab === tab.name
                ? "bg-red-600 text-white border-red-600"
                : "text-gray-700 border-transparent"
            }`}
          onClick={() => scrollToSection(tab.ref, tab.name)}
        >
          {tab.name}
        </li>
      ))}
    </ul>
  </div>
  </div>
</div>


      {/* Sections */}
      <div className="mt-10 space-y-10">
        <div ref={overviewRef}>
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p className="text-gray-700">
            Digital Marketing refers to the use of digital channels, such as
            search engines, social media platforms, email, websites, and mobile
            apps, to promote products, services, or brands. It encompasses a
            wide range of strategies and techniques, including search engine
            optimization (SEO), content marketing, social media marketing,
            pay-per-click (PPC) advertising, and email campaigns. Unlike
            traditional marketing, digital marketing allows businesses to target
            specific audiences with precision, track performance metrics in real
            time, and adjust campaigns for better results. It has become an
            essential tool for businesses in the modern era, enabling them to
            engage with a global audience, build strong brand awareness, and
            drive measurable growth in an increasingly digital-first world.
          </p>
        </div>

        <div ref={eligibilityRef}>
          <h3 className="text-lg font-semibold mb-2">
            Eligibility to Become a Doctor
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              <span className="font-medium">Educational Qualifications:</span> A
              bachelor’s degree in any field is typically enough to enter digital
              marketing, though degrees in Marketing, Business Administration,
              Mass Communication, or IT are beneficial.
            </li>
            <li>
              <span className="font-medium">
                Specialized Digital Marketing Courses:
              </span>{" "}
              Many institutes offer digital marketing certifications and diploma
              courses that cover various aspects of the field. Common
              certifications include Google Analytics, Google Ads, HubSpot
              Content Marketing, and Facebook Blueprint.
            </li>
            <li>
              <span className="font-medium">Skills Needed:</span>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">
                    Analytical and Technical Skills:
                  </span>{" "}
                  Proficiency in using tools like Google Analytics, SEMrush, Moz,
                  and social media analytics.
                </li>
                <li>
                  <span className="font-medium">SEO and SEM Knowledge:</span>{" "}
                  Understanding of on-page and off-page SEO, keyword research,
                  and search engine marketing.
                </li>
                <li>
                  <span className="font-medium">Content Creation Skills:</span>{" "}
                  Ability to create engaging content that resonates with target
                  audiences.
                </li>
                <li>
                  <span className="font-medium">Social Media Marketing:</span>{" "}
                  Familiarity with platforms like Instagram, Facebook, LinkedIn,
                  and YouTube for brand promotion.
                </li>
                <li>
                  <span className="font-medium">Basic Coding and Design Skills:</span>{" "}
                  Knowledge of HTML/CSS and tools like Canva or Adobe Creative
                  Suite is advantageous.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div ref={jobsRolesRef}>
          <h3 className="text-lg font-semibold mb-2">Types of job</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              <span className="font-medium">Educational Qualifications:</span> A
              bachelor’s degree in any field is typically enough to enter digital
              marketing, though degrees in Marketing, Business Administration,
              Mass Communication, or IT are beneficial.
            </li>
            <li>
              <span className="font-medium">
                Specialized Digital Marketing Courses:
              </span>{" "}
              Many institutes offer digital marketing certifications and diploma
              courses that cover various aspects of the field. Common
              certifications include Google Analytics, Google Ads, HubSpot
              Content Marketing, and Facebook Blueprint.
            </li>
            <li>
              <span className="font-medium">Skills Needed:</span>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">
                    Analytical and Technical Skills:
                  </span>{" "}
                  Proficiency in using tools like Google Analytics, SEMrush, Moz,
                  and social media analytics.
                </li>
                <li>
                  <span className="font-medium">SEO and SEM Knowledge:</span>{" "}
                  Understanding of on-page and off-page SEO, keyword research,
                  and search engine marketing.
                </li>
                <li>
                  <span className="font-medium">Content Creation Skills:</span>{" "}
                  Ability to create engaging content that resonates with target
                  audiences.
                </li>
                <li>
                  <span className="font-medium">Social Media Marketing:</span>{" "}
                  Familiarity with platforms like Instagram, Facebook, LinkedIn,
                  and YouTube for brand promotion.
                </li>
                <li>
                  <span className="font-medium">Basic Coding and Design Skills:</span>{" "}
                  Knowledge of HTML/CSS and tools like Canva or Adobe Creative
                  Suite is advantageous.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div ref={careerOpportunityRef}>
          <h3 className="text-lg font-semibold mb-2">Career Opportunity</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              <span className="font-medium">Educational Qualifications:</span> A
              bachelor’s degree in any field is typically enough to enter digital
              marketing, though degrees in Marketing, Business Administration,
              Mass Communication, or IT are beneficial.
            </li>
            <li>
              <span className="font-medium">
                Specialized Digital Marketing Courses:
              </span>{" "}
              Many institutes offer digital marketing certifications and diploma
              courses that cover various aspects of the field. Common
              certifications include Google Analytics, Google Ads, HubSpot
              Content Marketing, and Facebook Blueprint.
            </li>
            <li>
              <span className="font-medium">Skills Needed:</span>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">
                    Analytical and Technical Skills:
                  </span>{" "}
                  Proficiency in using tools like Google Analytics, SEMrush, Moz,
                  and social media analytics.
                </li>
                <li>
                  <span className="font-medium">SEO and SEM Knowledge:</span>{" "}
                  Understanding of on-page and off-page SEO, keyword research,
                  and search engine marketing.
                </li>
                <li>
                  <span className="font-medium">Content Creation Skills:</span>{" "}
                  Ability to create engaging content that resonates with target
                  audiences.
                </li>
                <li>
                  <span className="font-medium">Social Media Marketing:</span>{" "}
                  Familiarity with platforms like Instagram, Facebook, LinkedIn,
                  and YouTube for brand promotion.
                </li>
                <li>
                  <span className="font-medium">Basic Coding and Design Skills:</span>{" "}
                  Knowledge of HTML/CSS and tools like Canva or Adobe Creative
                  Suite is advantageous.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div ref={topCollegesRef}>
          <h3 className="text-lg font-semibold mb-2">Top Colleges</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>
              <span className="font-medium">Educational Qualifications:</span> A
              bachelor’s degree in any field is typically enough to enter digital
              marketing, though degrees in Marketing, Business Administration,
              Mass Communication, or IT are beneficial.
            </li>
            <li>
              <span className="font-medium">
                Specialized Digital Marketing Courses:
              </span>{" "}
              Many institutes offer digital marketing certifications and diploma
              courses that cover various aspects of the field. Common
              certifications include Google Analytics, Google Ads, HubSpot
              Content Marketing, and Facebook Blueprint.
            </li>
            <li>
              <span className="font-medium">Skills Needed:</span>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">
                    Analytical and Technical Skills:
                  </span>{" "}
                  Proficiency in using tools like Google Analytics, SEMrush, Moz,
                  and social media analytics.
                </li>
                <li>
                  <span className="font-medium">SEO and SEM Knowledge:</span>{" "}
                  Understanding of on-page and off-page SEO, keyword research,
                  and search engine marketing.
                </li>
                <li>
                  <span className="font-medium">Content Creation Skills:</span>{" "}
                  Ability to create engaging content that resonates with target
                  audiences.
                </li>
                <li>
                  <span className="font-medium">Social Media Marketing:</span>{" "}
                  Familiarity with platforms like Instagram, Facebook, LinkedIn,
                  and YouTube for brand promotion.
                </li>
                <li>
                  <span className="font-medium">Basic Coding and Design Skills:</span>{" "}
                  Knowledge of HTML/CSS and tools like Canva or Adobe Creative
                  Suite is advantageous.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Detailpage;
