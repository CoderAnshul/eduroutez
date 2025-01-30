import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CarrerDetail } from "../ApiFunctions/api";
import BestRated from "../Components/BestRated";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
const DetailPage = () => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const { id } = useParams();

  // Combined configuration for tabs and sections
  const tabConfig = [
    { id: "overview", name: "Overview", ref: useRef(null) },
    { id: "eligibility", name: "Eligibility", ref: useRef(null) },
    { id: "jobRoles", name: "Jobs Roles", ref: useRef(null) },
    { id: "opportunity", name: "Career Opportunity", ref: useRef(null) },
    { id: "topColleges", name: "Top Colleges", ref: useRef(null) }
  ];

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await CarrerDetail(id);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching career:", error);
      }
    };

    fetchCareer();
  }, [id]);

  const scrollToSection = (tabItem) => {
    setActiveTab(tabItem.name);
    const yOffset = -100; // Adjust this value based on your header height
    const element = tabItem.ref.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const getContent = (tabId) => {
    switch (tabId) {
      case 'overview':
        return data.description;
      case 'eligibility':
        return data.eligibility || [];
      case 'jobRoles':
        return data.jobRoles || [];
      case 'opportunity':
        return data.opportunity || [];
      case 'topColleges':
        return data.topColleges || [];
      default:
        return null;
    }
  };

  return (
    <div className="px-[4vw] py-[2vw] flex flex-col items-start">
      {/* Banner Image */}
      {/* Banner Image */}
      <div className="h-80 w-full rounded-md">
        <img
          className="h-full w-full object-cover"
          src={`${Images}/${data.image}`}
          alt="bannerdetailimg"
        />
      </div>

      {/* Tabs */}
      <div className="w-full md:px-4 py-6 sticky top-0 bg-white z-50">
        <h1 className="text-2xl font-bold mb-4">{data.title || "Career Details"}</h1>
        <div className="w-full overflow-x-auto">
          <div className="border-2 rounded-lg border-gray-300">
            <ul className="flex justify-evenly items-center whitespace-nowrap">
              {tabConfig.map((tab) => (
                <li
                  key={tab.id}
                  className={`cursor-pointer px-8 py-2 text-sm font-medium 
                    ${activeTab === tab.name
                      ? "bg-red-600 py-2 rounded-full m-1 px-4 text-white border-red-600"
                      : "text-gray-700 hover:text-black"
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
      <div className="mt-10 space-y-10">
        {tabConfig.map((tab) => {
          const content = getContent(tab.id);
          const isArray = Array.isArray(content);
          
          return (
            <div
              key={tab.id}
              ref={tab.ref}
              className="scroll-mt-24" // Adds margin to scroll position
            >
              <h3 className="text-lg font-semibold mb-2">{tab.name}</h3>
              {isArray ? (
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {content.map((item, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              ) : (
                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
          );
        })}
      </div>

         {/* Additional Sections */}
        <div className="w-full flex flex-row items-start gap-8">
      <Events />
      <ConsellingBanner />
      </div>

    </div>
  );
};

export default DetailPage;