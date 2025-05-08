import React, { useState, useEffect } from "react";
import CourseCard from "../Ui components/CourseCard";
import { Link } from "react-router-dom";

// In-memory mapping to store course IDs by slug
const courseIdMap = {};

const TabNavigation = ({ tabs, activeTab, handleTabClick }) => (
  <div className="flex border-b border-gray-200 mb-6 max-w-fit">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => handleTabClick(tab)}
        className={`text-center w-full max-w-[130px] whitespace-nowrap flex-1 transform transition-all active:scale-90 py-2 px-[2vw] text-sm font-medium border-b-[3px] ${
          activeTab === tab
            ? "border-black text-black"
            : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const CourseList = ({ filteredCourses, visibleCourses, getCourseSlug }) => (
  <div
    className="flex flex-wrap w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    style={{
      transition: "height 0.5s ease-in-out",
      height: "auto",
    }}
  >
    {filteredCourses.slice(0, visibleCourses).map((course) => (
      <Link 
      to={`/coursesinfopage/${course.slug}`}  
             key={course._id} 
        className="flex-1 w-full max-w-sm !text-black"
      >
        <CourseCard course={course} />
      </Link>
    ))}
  </div>
);

const ToggleButton = ({ isExpanded, handleToggleVisibility }) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={handleToggleVisibility}
      className="flex items-center justify-center text-sm text-gray-500 hover:text-black"
    >
      {isExpanded ? (
        <>
          See Less <span className="ml-2">↑</span>
        </>
      ) : (
        <>
          See More <span className="ml-2">↓</span>
        </>
      )}
    </button>
  </div>
);

const InstituteCourses = ({ instituteData }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = ["All", "Part Time", "Full Time", "Online"];

  useEffect(() => {
    if (instituteData?.data?.courses?.length) {
      setFilteredCourses(instituteData.data.courses);
      
      // Initialize the courseIdMap with the courses from this institute
      instituteData.data.courses.forEach(course => {
        if (course.courseTitle) {
          // Create slug from course title
          const slug = course.courseTitle
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
          
          // Store mapping
          courseIdMap[slug] = course._id;
        }
      });
      
      // Make the mapping available globally and in localStorage
      window.courseIdMap = {
        ...window.courseIdMap,
        ...courseIdMap
      };
      
      // Get existing mappings from localStorage and merge
      const existingMap = JSON.parse(localStorage.getItem('courseIdMap') || '{}');
      localStorage.setItem('courseIdMap', JSON.stringify({
        ...existingMap,
        ...courseIdMap
      }));
    }
  }, [instituteData]);

  // Helper function to get the slug for a course
  const getCourseSlug = (course) => {
    if (!course?.courseTitle) return course?._id;
    
    return course.courseTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "All") {
      setFilteredCourses(instituteData?.data?.courses);
    } else {
      const filtered = instituteData.data.courses.filter(
        (course) => course.courseType.replace("-", " ") === tab
      );
      setFilteredCourses(filtered);
    }
    setVisibleCourses(6);
    setIsExpanded(false);
  };

  const handleToggleVisibility = () => {
    if (isExpanded) {
      setVisibleCourses(6);
    } else {
      setVisibleCourses(filteredCourses.length);
    }
    setIsExpanded(!isExpanded);
  };

  if (!instituteData?.data?.courses?.length) {
    return null;
  }

  return (
    <div className="min-h-28 w-full flex flex-col justify-between bg-white rounded-xl mb-5 sm:p-4">
      <h3 className="text-xl font-bold mb-4">Top Courses, Fees & Eligibility</h3>

      <div className="w-full">
        <TabNavigation tabs={tabs} activeTab={activeTab} handleTabClick={handleTabClick} />
        <div className="w-full border-2 p-3 rounded-xl max-h-fit transition-all">
          <CourseList 
            filteredCourses={filteredCourses} 
            visibleCourses={visibleCourses} 
            getCourseSlug={getCourseSlug}
          />
          <ToggleButton isExpanded={isExpanded} handleToggleVisibility={handleToggleVisibility} />
        </div>
      </div>
    </div>
  );
};

// Export the ID mapping for use in other components
export { courseIdMap };
export default InstituteCourses;