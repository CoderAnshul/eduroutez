import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import { useQuery } from 'react-query';
import { popularCourses } from '../ApiFunctions/api';
import SocialShare from './SocialShare';

// In-memory mapping to store course IDs by slug
const courseIdMap = {};

const PopularCourses = () => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});
  const [openShareId, setOpenShareId] = useState(null);

  const { data, isLoading, isError } = useQuery(
    ["popularCourses"],
    () => popularCourses(),
    {
      enabled: true,
      onSuccess: (data) => {
        const { result } = data?.data || {}; // safely access result
        if (result) {
          // Store the ID mapping for each course using the title as slug
          result.forEach(course => {
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
          
          // Make the mapping available globally
          window.courseIdMap = courseIdMap;
          
          // Store in localStorage for persistence
          localStorage.setItem('courseIdMap', JSON.stringify(courseIdMap));
          
          setContent(result);
        }
      }
    }
  );

  const handleShareClick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenShareId(openShareId === id ? null : id);
  };

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading popular courses</div>;
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold">Popular Courses</h3>
        <Link to="/popularcourses">
          <button className="bg-red-500 text-white py-2 px-4 rounded">View more</button>
        </Link>
      </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {content.length > 0 ? content.map((box) => {
          const courseSlug = getCourseSlug(box);
          
          return (
            <div key={box?._id} className="relative box lg:max-w-[500px] shadow-lg rounded-lg ">
              <Link to={`/coursesinfopage/${courseSlug}`} className="block">
                <div className="imageContainer h-48 relative">
                  <img
                    className="h-full w-full object-cover"
                    src={images[box?._id] || `${import.meta.env.VITE_IMAGE_BASE_URL}/${box?.coursePreviewCover}`}
                    alt={box?.courseTitle || "Course Image"}
                    onError={(e) => { e.target.src = cardPhoto; }}
                  />
                </div>
                <div className="textContainer p-4">
                  <h3 className="text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A] line-clamp-2">
                    {box?.courseTitle ? (box.courseTitle.length > 20 ? box.courseTitle.slice(0, 22) + "..." : box.courseTitle) : "Untitled Course"}
                  </h3>
                  <div className="text-sm mt-2 line-clamp-3 text-gray-600" dangerouslySetInnerHTML={{
                    __html: box?.longDescription?.slice(0, 80) + "..." || "No description available"
                  }} />
                  {box?.price && (
                    <h3 className="flex items-center mt-4 text-2xl font-bold text-[#000000c4]">
                      <img className="h-5 mt-1 opacity-70" src={rupee} alt="rupee" />
                      {box?.isCourseFree === "free" ? "0" : box?.price || "N/A"}
                    </h3>
                  )}
                </div>
              </Link>

              {/* Social stats row with views, likes, and share button - OUTSIDE the Link */}
              <div className="flex items-center justify-between px-4 ">
                <div className="flex items-center gap-4">
                  {box.views && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="text-gray-500">{box.views}</span>
                    </div>
                  )}
                  {box.likes && box.likes.length > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3z"></path>
                        <path d="M9 22V12"></path>
                      </svg>
                      <span>{box.likes.length}</span>
                    </div>
                  )}
                </div>
                
                {/* Share button */}
                <div onClick={(e) => handleShareClick(box._id, e)}>
                  {/* Social share component that appears only when clicked */}
                  <div className="right-0 z-10">
                    <SocialShare 
                      title={box.courseTitle} 
                      url={`${window.location.origin}/course/${courseSlug}`} 
                      contentType="course" 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="w-full text-center">No popular courses available.</div>
        )}
      </div>
    </div>
  );
};

// Export the ID mapping for use in other components
export { courseIdMap };
export default PopularCourses;