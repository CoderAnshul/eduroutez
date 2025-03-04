import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { CarrerDetail } from "../ApiFunctions/api";
import BestRated from "../Components/BestRated";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import BlogComponent from "../Components/BlogComponent";
import axiosInstance from "../ApiFunctions/axios";

const DetailPage = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const { id } = useParams();  // This can be either ID or slug
  const navigate = useNavigate();

  const tabConfig = [
    { id: "overview", name: "Overview", titleRef: useRef(null) },
    { id: "eligibility", name: "Eligibility", titleRef: useRef(null) },
    { id: "jobRoles", name: "Jobs Roles", titleRef: useRef(null) },
    { id: "opportunity", name: "Career Opportunity", titleRef: useRef(null) },
    { id: "topColleges", name: "Top Colleges", titleRef: useRef(null) }
  ];

  // Initialize careerIdMap from localStorage
  useEffect(() => {
    if (!window.careerIdMap) {
      try {
        const storedCareerIdMap = JSON.parse(localStorage.getItem('careerIdMap') || '{}');
        window.careerIdMap = storedCareerIdMap;
      } catch (error) {
        console.error('Error initializing careerIdMap:', error);
        window.careerIdMap = {};
      }
    }
  }, []);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        // Determine if we're dealing with an ID or a slug
        const isSlug = isNaN(parseInt(id)) || id.includes('-');
        
        // Initialize variables for API response and career ID
        let response;
        let careerId = id;
        
        if (isSlug) {
          // Try to get the ID from careerIdMap
          const mappedId = window.careerIdMap?.[id];
          
          if (mappedId) {
            // We found the ID in the map, use it
            careerId = mappedId;
            response = await CarrerDetail(careerId);
          } else {
            // If careerIdMap doesn't have the slug, get the career by slug through a custom API call
            try {
              response = await axiosInstance.get(`/api/v1/career/by-slug/${id}`);
              
              // If we got a response, grab the ID for future use
              if (response && response.data) {
                careerId = response.data._id;
                
                // Save this slug -> ID mapping to both window and localStorage
                window.careerIdMap = window.careerIdMap || {};
                window.careerIdMap[id] = careerId;
                localStorage.setItem('careerIdMap', JSON.stringify(window.careerIdMap));
                console.log(`Saved mapping: ${id} -> ${careerId} in localStorage`);
              }
            } catch (slugError) {
              console.error('Error fetching career by slug:', slugError);
              
              // As a final fallback, try using the career ID API
              response = await CarrerDetail(id);
            }
          }
        } else {
          // It's an ID, use it directly
          response = await CarrerDetail(careerId);
          
          // If the career has a slug, we should save that mapping too
          if (response && response.data && response.data.slug) {
            const slug = response.data.slug;
            window.careerIdMap = window.careerIdMap || {};
            window.careerIdMap[slug] = careerId;
            localStorage.setItem('careerIdMap', JSON.stringify(window.careerIdMap));
            console.log(`Saved mapping: ${slug} -> ${careerId} in localStorage`);
          }
        }

        if (!response || !response.data) {
          console.error('No career data found');
          return;
        }
        
        setData(response.data);
      } catch (error) {
        console.error("Error fetching career:", error);
      }
    };

    fetchCareer();
  }, [id]);

  const scrollToSection = (tabItem) => {
    setActiveTab(tabItem.name);
    const yOffset = -170;
    const element = tabItem.titleRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const getContent = (tabId) => {
    const content = {
      overview: data.description,
      eligibility: data.eligibility || [],
      jobRoles: data.jobRoles || [],
      opportunity: data.opportunity || [],
      topColleges: data.topColleges || []
    };
    return DOMPurify.sanitize(content[tabId]);
  };

  const contentStyles = `
    html-content
    [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:my-4
    [&>h2]:text-xl [&>h2]:font-bold [&>h2]:my-3
    [&>h3]:text-lg [&>h3]:font-bold [&>h3]:my-2
    [&>p]:text-gray-700 [&>p]:my-3 [&>p]:leading-relaxed
    
    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:my-4
    [&>ul>li]:text-gray-700 [&>ul>li]:my-2
    
    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:my-4
    [&>ol>li]:text-gray-700 [&>ol>li]:my-2
    
    [&>table]:w-full [&>table]:border-collapse [&>table]:my-4
    [&>table>thead>tr>th]:bg-gray-50 [&>table>thead>tr>th]:text-left 
    [&>table>thead>tr>th]:p-3 [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-200
    [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-200
    
    [&>a]:text-blue-600 [&>a]:underline [&>a:hover]:text-blue-800
    
    [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4
    
    [&>blockquote]:pl-4 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 
    [&>blockquote]:italic [&>blockquote]:my-4 [&>blockquote]:text-gray-600
  `;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="container max-w-[1300px] mx-auto px-6 py-8">
          <div className="h-80 w-full rounded-xl overflow-hidden shadow-lg mb-8">
            <img
              className="h-full w-full object-cover"
              src={`${Images}/${data.image}`}
            alt={data.title || "Career banner"}
          />
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl p-4 sticky top-0 z-50">
            <h1 className="text-2xl font-bold mb-6 px-4">{data.title || "Career Details"}</h1>
            <div className="w-full overflow-x-auto">
              <div className="border rounded-xl border-gray-200">
                <ul className="flex justify-evenly items-center whitespace-nowrap">
                  {tabConfig.map((tab) => (
                    <li
                      key={tab.id}
                      className={`cursor-pointer px-8 py-3 text-sm font-medium transition-all duration-200 
                      ${activeTab === tab.name
                          ? "bg-red-600 rounded-full mx-2 text-white"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 rounded-full mx-2"
                        }`}
                      onClick={() => scrollToSection(tab)}
                    >
                      {tab.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-10 space-y-8">
            {tabConfig.map((tab) => {
              const content = getContent(tab.id);
              const isArray = Array.isArray(content);

              return (
                <div
                  key={tab.id}
                  className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl p-8 scroll-mt-24"
                >
                  <h3
                    ref={tab.titleRef}
                    className="text-lg font-bold mb-6"
                  >
                    {tab.name}
                  </h3>
                  {isArray ? (
                    <ul className="space-y-4">
                      {content.map((item, idx) => (
                        <li
                          key={idx}
                          className={contentStyles}
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div
                      className={`${contentStyles} text-base prose prose-gray max-w-full`}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Components */}
        <BlogComponent />
      </div>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default DetailPage;