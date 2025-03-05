import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import { useQuery } from 'react-query';
import axios from 'axios';
import { AllpopularCourses, courseCategoriesList } from '../ApiFunctions/api';
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
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await courseCategoriesList();
        const extractedCategories = response.data?.data?.result.map(category => ({
          _id: category._id,
          name: category.title
        }));
        setCategories(extractedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses with pagination and filtering
  const { data, isLoading, isError, refetch } = useQuery(
    ["popularCourses", page, selectedCategories, searchTerm],
    () => {
      // Construct filters
      const filters = {};
      if (selectedCategories.length > 0) {
        filters.category = selectedCategories;
      }
      
      return AllpopularCourses({
        page,
        filters: JSON.stringify(filters),
        search: searchTerm
      });
    },
    {
      enabled: true,
      onSuccess: (data) => {
        console.log('try data', data);
        const courses = data.data?.data?.result;
        
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
        
        // Update total pages
        setTotalPages(data.data.totalPages);
        
        // Update content based on whether it's first page or subsequent pages
        setContent(prevContent => 
          page === 1 ? courses : [...prevContent, ...courses]
        );
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

  // Category change handler
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(cat => cat !== categoryId)
        : [...prev, categoryId]
    );
    // Reset to first page when filter changes
    setPage(1);
  };

  // Load more handler
  const loadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Image fetching logic (similar to previous implementation)
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

  // Share click handler
  const handleShareClick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenShareId(openShareId === id ? null : id);
  };

  // Render loading state
  if (isLoading && page === 1) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Render error state
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

        {/* Mobile Filter Button */}
        <button
          className="mx-[20px] mt-[30px] z-[500] bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg md:hidden"
          onClick={() => setIsFilterOpen(true)}
        >
          Filters
        </button>

        {/* Mobile Filter Modal */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-[10001] flex transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <div
            className={`w-3/4 bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <button
              className="text-gray-800 font-bold text-xl mb-4"
              onClick={() => setIsFilterOpen(false)}
            >
              X
            </button>
            <h3 className="text-lg font-semibold mb-6">Filter by Category</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-2 border-2 border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    value={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span className="text-base font-medium">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div
            className="flex-grow cursor-pointer"
            onClick={() => setIsFilterOpen(false)}
          ></div>
        </div>

        {/* Main Content with Sidebar */}
        <div className={`flex px-[4vw] pt-5 mb-14 ${isFilterOpen ? "pointer-events-none" : ""}`}>
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md sticky top-20 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full p-2 border-2 border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="w-full md:w-3/4 px-6">
            <div className="flex flex-wrap justify-start gap-8">
              {content.map((box) => {
                const courseSlug = getCourseSlug(box);
                
                return (
                  <Link
                    key={box._id}
                    to={`/coursesinfopage/${courseSlug}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer
                    max-w-sm flex-1 min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden"
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

                      {/* Views, Likes, and Share Section */}
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
                          )}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
    
                {/* Load More Button */}
                <div className="flex justify-center mt-6">
                  {page < totalPages && content.length > 0 && (
                    <button
                      className="bg-red-600 text-white rounded-lg px-4 py-2 shadow-lg"
                      onClick={loadMore}
                    >
                      Load More
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Components */}
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