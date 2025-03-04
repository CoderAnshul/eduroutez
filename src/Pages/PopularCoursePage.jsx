import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import { useQuery } from 'react-query';
import { AllpopularCourses } from '../ApiFunctions/api';
import HighRatedCareers from '../Components/HighRatedCareers';
import BlogComponent from '../Components/BlogComponent';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import ConsellingBanner from '../Components/ConsellingBanner';
import Promotions from './CoursePromotions';
import SocialShare from '../Components/SocialShare';

// In-memory mapping to store course IDs by slug
const courseIdMap = {};

const PopularCourses = () => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});
  const [openShareId, setOpenShareId] = useState(null);

  const { data, isLoading, isError } = useQuery(
    ["popularCourses"],
    () => AllpopularCourses(),
    {
      enabled: true,
      onSuccess: (data) => {
        const courses = data.data.result;
        
        // Store the ID mapping for each course using the title as slug
        courses.forEach(course => {
          if (course.courseTitle) {
            // Create slug from course title
            const slug = getCourseSlug(course);
            
            // Store mapping
            courseIdMap[slug] = course._id;
          }
        });
        
        // Make the mapping available globally
        window.courseIdMap = courseIdMap;
        
        // Store in localStorage for persistence
        localStorage.setItem('courseIdMap', JSON.stringify(courseIdMap));
        
        setContent(courses);
      },
    }
  );

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

  const handleShareClick = (id, e) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation(); // Stop event from bubbling up
    setOpenShareId(openShareId === id ? null : id);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagePromises = content.map(async (box) => {
          if (!box.coursePreviewCover) {
            return { id: box._id, url: null };
          }

          try {
            // Construct the full image URL
            const imageUrl = `${import.meta.env.VITE_IMAGE_BASE_URL}/${box.coursePreviewCover}`;
            
            // Test if image exists with a HEAD request
            const response = await fetch(imageUrl, { method: 'HEAD' });
            
            if (!response.ok) {
              console.warn(`Image not found for course ${box._id}, using fallback`);
              return { id: box._id, url: null };
            }

            return { id: box._id, url: imageUrl };
          } catch (error) {
            console.error(`Error loading image for course ${box._id}:`, error);
            return { id: box._id, url: null };
          }
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, image) => {
          acc[image.id] = image.url;
          return acc;
        }, {});

        setImages(imageMap);
      } catch (error) {
        console.error('Error in fetchImages:', error);
      }
    };

    if (content.length > 0) {
      fetchImages();
    }
  }, [content]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading popular courses</div>;
  }

  return (
    <>
      <div>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-bold leading-tight">
              Unlock Your Potential with Top Courses
            </h1>
            <p className="mt-4 text-lg">
              Learn new skills, elevate your career, and achieve your dreams. Explore our popular courses today!
            </p>
          </div>
        </div>

        {/* Popular Courses Section */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className='w-full items-center max-w-4xl h-24 mx-auto'>
            <div className="w-full max-w-4xl h-fit mx-auto">
              <Promotions location="COURSES_PAGE" className="h-[90px]" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-10">
            <h3 className="text-3xl font-bold">Popular Courses</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((box) => {
              const courseSlug = getCourseSlug(box);
              
              return (
                <div key={box._id} className="flex flex-col">
                  <Link
                    to={`/coursesinfopage/${courseSlug}`}
                    className="bg-white rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl flex-grow z-1"
                  >
                    <div className="relative">
                      <img
                        className="h-48 w-full object-cover"
                        src={images[box._id] || cardPhoto}
                        alt={box.courseTitle}
                        onError={(e) => {
                          console.warn(`Image load failed for ${box.courseTitle}, using fallback`);
                          e.target.src = cardPhoto;
                          e.target.onerror = null;
                        }}
                      />
                      {box.isCourseFree === "free" && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Free
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {box.courseTitle}
                      </h3>
                      <div
                        className="text-sm text-gray-600 mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: box.longDescription }}
                      />

                      {/* Views, Likes, and Share - Now Inside the Card */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-gray-600">
                          {box.views && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              <span>{box.views}</span>
                            </div>
                          )}
                          {box.likes && box.likes.length > 0 && (
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-6 0v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-3z"></path>
                                <path d="M9 22V12"></path>
                              </svg>
                              <span>{box.likes.length}</span>
                            </div>
                          )}
                        </div>

                        {/* Share button inside card */}
                        <div 
                          className="relative"           
                          onClick={(e) => handleShareClick(box._id, e)}
                        >
                          {/* Social Share Component (shown when clicked) */}
                          {openShareId === box._id && (
                            <div className="absolute right-0 z-10">
                              <SocialShare 
                                title={box.courseTitle} 
                                url={`${window.location.origin}/coursesinfopage/${courseSlug}`} 
                                contentType="course" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className='w-full items-center max-w-4xl h-fit mx-auto'>
        <Promotions location="COURSES_PAGE" className="h-[90px]" />
      </div>

      <HighRatedCareers />
      <BlogComponent />      
      <BestRated />
      
      <div className="w-full flex items-start mt-10">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

// Export the ID mapping for use in other components
export { courseIdMap };
export default PopularCourses;