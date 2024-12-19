import React, { useState, useEffect } from "react";
import CourseCard from "../Ui components/CourseCard";
import { Link } from "react-router-dom";

const InstituteCourses = ({ instituteData }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = ["All", "Part Time", "Full Time", "Online"];

  useEffect(() => {
    if (instituteData?.data?.courses) {
      setFilteredCourses(instituteData.data.courses);
    }
  }, [instituteData]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "All") {
      setFilteredCourses(instituteData?.data?.courses);
    } else {
      const filtered = instituteData.data.courses.filter(
        (course) => course.courseType === tab
      );
      setFilteredCourses(filtered);
    }
    setVisibleCourses(6); // Reset visible courses on tab change
    setIsExpanded(false); // Reset to "See More"
  };

  const handleToggleVisibility = () => {
    if (isExpanded) {
      setVisibleCourses(6); // Show only initial 6 courses
    } else {
      setVisibleCourses(filteredCourses.length); // Show all courses
    }
    setIsExpanded(!isExpanded); // Toggle "See More" / "See Less"
  };

  return (
    <div className="min-h-28 w-full flex flex-col justify-between bg-white rounded-xl mb-5 sm:p-4">
      <h3 className="text-xl font-bold mb-4">Top Courses, Fees & Eligibility</h3>

      <div className="w-full">
        {/* Tab Navigation */}
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

        {/* Tab Content */}
        <div className="w-full border-2 p-3 rounded-xl max-h-fit transition-all">
          <div
            className="flex flex-wrap w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            style={{
              transition: "height 0.5s ease-in-out", // Apply smooth height transition
              height: isExpanded ? "auto" : "auto", // Allow auto height when expanded
            }}
          >
            {filteredCourses.slice(0, visibleCourses).map((course) => (
              <Link to={`/coursesinfopage/${course._id}`} key={course._id} className="flex-1 w-full max-w-sm">
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default InstituteCourses;
