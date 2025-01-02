import React, { useState, useRef, useEffect } from "react";
import detail from "../assets/Images/detail.png";
import { useParams } from "react-router-dom";
import { CarrerDetail } from "../ApiFunctions/api";

const Detailpage = () => {
  // State to manage data and active tab
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const { id } = useParams();

  // Refs for each section - initialized outside render
  const refs = {
    overview: useRef(null),
    eligibility: useRef(null),
    jobsRoles: useRef(null),
    careerOpportunity: useRef(null),
    topColleges: useRef(null),
  };

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await CarrerDetail(id);
        console.log("API Response:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching career:", error);
      }
    };

    fetchCareer();
  }, [id]);

  // Scroll to section and set active tab
  const scrollToSection = (sectionRef, tabName) => {
    setActiveTab(tabName);
    sectionRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  // Define the tabs with corresponding refs
  const tabs = [
    { name: "Overview", ref: refs.overview },
    { name: "Eligibility", ref: refs.eligibility },
    { name: "Jobs Roles", ref: refs.jobsRoles },
    { name: "Career Opportunity", ref: refs.careerOpportunity },
    { name: "Top Colleges", ref: refs.topColleges },
  ];

  // Define the sections with corresponding ids and content
  const sections = [
    { id: "overview", title: "Overview", content: data.description, type: "html" },
    { id: "eligibility", title: "Eligibility", content: data.eligibility || [], type: "list" },
    { id: "jobsRoles", title: "Jobs Roles", content: data.jobsRoles || [], type: "list" },
    { id: "careerOpportunity", title: "Career Opportunity", content: data.careerOpportunity || [], type: "list" },
    { id: "topColleges", title: "Top Colleges", content: data.topColleges || [], type: "list" },
  ];

  return (
    <div className="px-[4vw] py-[2vw] flex flex-col items-start">
      {/* Banner Image */}
      <div className="h-80 w-full rounded-md">
        <img
          className="h-full w-full object-cover"
          src={`http://localhost:4001/uploads/${data.image}`}
          alt="bannerdetailimg"
        />
      </div>

      {/* Tabs */}
      <div className="w-full md:px-4 py-6 sticky top-0 bg-white z-100">
        <h1 className="text-2xl font-bold mb-4">{data.title || "Career Details"}</h1>
        <div className="w-full overflow-x-auto">
          <div className="border-2 rounded-lg border-gray-300">
            <ul className="flex justify-evenly items-center whitespace-nowrap">
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  className={`cursor-pointer px-8 py-2 text-sm font-medium 
                    ${activeTab === tab.name
                      ? "bg-red-600 py-2 rounded-full m-1 px-4 text-white border-red-600"
                      : "text-gray-700 hover:text-black"
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
        {sections.map((section) => {
          return (
            <div ref={refs[section.id]} key={section.id}>
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              {section.type === "list" ? (
                // Check if content is an array before using .map()
                Array.isArray(section.content) ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-800">
                    {section.content.map((item, idx) => (
                      <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                ) : <p
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              ) : (
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Detailpage;
