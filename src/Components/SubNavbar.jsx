import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import downArrow from '../assets/Images/downArrow.png';
import axiosInstance from '../ApiFunctions/axios'

const SubNavbar = ({ categories }) => {
  const [activeContent, setActiveContent] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownAlignment, setDropdownAlignment] = useState('left-0');
  const [popularCourses, setPopularCourses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/courses?filters={"isCoursePopular":true}`
        );
        setPopularCourses(response.data?.data);
      } catch (error) {
        console.error('Error fetching popular courses:', error);
      }
    };

    const fetchCareers = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/careers?sort={"createdAt":"desc"}&page=1&limit=8`
        );
        setCareers(response.data?.data);
      } catch (error) {
        console.error('Error fetching careers:', error);
      }
    };
    const fetchLatestNews = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL}/news/superadmin`
        );
        console.log('news',response.data);
        setLatestNews(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching latest news:', error);
      }
    };

    fetchPopularCourses();
    fetchCareers();
    fetchLatestNews();
  }, []);

  const handleMouseEnter = (category, event) => {
    const boundingBox = event.target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const categoryWidth = boundingBox.width;

    if (category.label === 'MEDIA') {
      setDropdownAlignment('transform translate-x-[-50%]');
    } else if (boundingBox.left <= categoryWidth) {
      setDropdownAlignment('left-0');
    } else if (viewportWidth - boundingBox.right <= categoryWidth) {
      setDropdownAlignment('right-0');
    } else {
      setDropdownAlignment('left-0');
    }

    setHoveredCategory(category.label);

    if (category.label !== 'Courses' && category.label !== 'Careers' && category.label !== 'Latest Updates' &&  category.sidebarItems?.length > 0) {
      const firstItemId = category.sidebarItems[0].id;
      setActiveContent((prev) => ({
        ...prev,
        [category.label]: firstItemId,
      }));
    }
  };

  const handleViewAllCourses = () => {
    navigate('/popularcourses');
  };

  const handleViewAllCareers = () => {
    navigate('/careerspage');
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setDropdownAlignment('');
  };
  const handleViewAllNews = () => {
    navigate('/news');  // Adjust the route as needed
  };

  const handleCourseClick = (courseId) => {
    navigate(`/coursesinfopage/${courseId}`);
  };

  const handleCareerClick = (careerId) => {
    navigate(`/detailpage/${careerId}`);
  };

  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  const renderCoursesContent = () => (
    <div className="p-6 bg-white min-w-[400px]">
      <div className="space-y-8">
        <h3 className="font-semibold text-red-500">Popular Courses</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {popularCourses?.result?.map((course) => (
              <a
                key={course._id}
                onClick={() => handleCourseClick(course._id)}
                className="text-sm hover:text-red-500 cursor-pointer truncate"
              >
                {course.courseTitle}
              </a>
            ))}
          </div>
          <div className="text-right">
            <a 
              onClick={() => handleViewAllCourses()} 
              className="text-sm text-red-500 hover:text-red-600 cursor-pointer font-medium"
            >
              View All Courses →
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCareersContent = () => (
    <div className="p-6 bg-white min-w-[400px]">
      <div className="space-y-8">
        <h3 className="font-semibold text-red-500">Latest Careers</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {careers?.result?.map((career) => (
              <a
                key={career._id}
                onClick={() => handleCareerClick(career._id)}
                className="text-sm hover:text-red-500 cursor-pointer truncate"
              >
                {career.title}
              </a>
            ))}
          </div>
          <div className="text-right">
            <a 
              onClick={() => handleViewAllCareers()} 
              className="text-sm text-red-500 hover:text-red-600 cursor-pointer font-medium"
            >
              View All Careers →
            </a>
          </div>
        </div>
      </div>
    </div>
  );


  const renderNewsContent = () => (
    <div className="bg-white rounded-xl shadow-lg ">
      <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-red-600">
        <h3 className="text-lg font-bold text-white">Latest Updates</h3>
      </div>
  
      <div className="p-4">
        <ul className="grid grid-cols-3 gap-8">
        {latestNews
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 3)
  .map((news) => (
    <li
      key={news._id}
      onClick={() => handleNewsClick(news._id)}
      className="group hover:bg-orange-50 rounded-lg p-3 transition-colors duration-200 cursor-pointer shadow-md"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 line-clamp-2">
            {news.title}
          </p>
          <p className="text-xs text-orange-600">
            {new Date(news.createdAt).toDateString()}
          </p>
        </div>

        <div>
          <img
            src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${news.image}`}
            alt={news.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {news.description}
        </p>
      </div>
    </li>
))}

        </ul>
      </div>
  
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={handleViewAllNews}
          className=" flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          View All Updates
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );


  const renderMoreContent = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[600px]">
      <div className="grid grid-cols-3 gap-8">
        {/* Resources Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-red-500 border-b pb-2">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="/exams" className="text-sm hover:text-red-500">Entrance Exams</a>
            </li>
            <li>
              <a href="/colleges" className="text-sm hover:text-red-500">Top Colleges</a>
            </li>
            <li>
              <a href="/scholarships" className="text-sm hover:text-red-500">Scholarships</a>
            </li>
            <li>
              <a href="/study-material" className="text-sm hover:text-red-500">Study Material</a>
            </li>
          </ul>
        </div>

        {/* Tools Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-red-500 border-b pb-2">Tools</h3>
          <ul className="space-y-2">
            <li>
              <a href="/college-predictor" className="text-sm hover:text-red-500">College Predictor</a>
            </li>
            <li>
              <a href="/rank-predictor" className="text-sm hover:text-red-500">Rank Predictor</a>
            </li>
            <li>
              <a href="/compare-colleges" className="text-sm hover:text-red-500">Compare Colleges</a>
            </li>
            <li>
              <a href="/career-tests" className="text-sm hover:text-red-500">Career Assessment</a>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-red-500 border-b pb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/about-us" className="text-sm hover:text-red-500">About Us</a>
            </li>
            <li>
              <a href="/contact" className="text-sm hover:text-red-500">Contact Us</a>
            </li>
            <li>
              <a href="/faqs" className="text-sm hover:text-red-500">FAQs</a>
            </li>
            <li>
              <a href="/feedback" className="text-sm hover:text-red-500">Feedback</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  

  const renderRegularContent = (category) => (
    <div className="flex">
      <div className="w-64 bg-white overflow-y-auto">
        <ul>
          {category?.sidebarItems?.map((item) => (
            <li
              key={item.id}
              className={`px-2 py-2 group text-sm flex justify-between items-center cursor-pointer transition-all hover:bg-red-200 ${
                activeContent[category.label] === item.id
                  ? 'bg-red-400 border-l-2 border-red-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
              onMouseEnter={() =>
                setActiveContent((prev) => ({
                  ...prev,
                  [category.label]: item.id,
                }))
              }
            >
              {item.name}
              <span className="text-xs">
                <img
                  className={`h-3 transform transition-transform duration-300 ${
                    activeContent[category.label] === item.id
                      ? '-rotate-0'
                      : '-rotate-90'
                  }`}
                  src={downArrow}
                  alt=""
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
      {activeContent[category.label] && (
        <div
          className="w-fit p-3 flex flex-wrap gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
          }}
        >
          {category.contents?.[activeContent[category.label]]?.map(
            (subArray, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-1">
                {subArray.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.link}
                    className="block text-xs text-black hover:underline"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="w-full h-auto bg-white">
        <div className="w-full px-5 py-2 h-full mx-auto flex justify-between">
          <div className="w-3/5 h-full flex flex-col justify-between">
            <div className="h-1/2 w-fit px-1 flex relative items-center justify-start gap-7">
              {categories?.map((category, index) => (
                <div
                  key={index}
                  className="group"
                  onMouseEnter={(e) => handleMouseEnter(category, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <h5 className="text-xs gap-2 font-[500] group-hover:text-red-500 group-hover:scale-95 transform transition-all text-[#00000096] flex items-center cursor-pointer whitespace-nowrap">
                    {category.label}
                    <img
                      className="h-3 group-hover:rotate-180 transition-all"
                      src={downArrow}
                      alt="downArrow"
                    />
                  </h5>
                  {hoveredCategory === category.label && (
                    <div
                      className={`absolute top-full z-50 bg-white shadow-lg ${dropdownAlignment}`}
                    >
                      {category.label === 'Courses' 
                        ? renderCoursesContent()
                        : category.label === 'Careers'
                        ? renderCareersContent()
                        : category.label === 'Latest Updates'
                        ? renderNewsContent()
                        : category.label === 'More'
                        ? renderMoreContent()
                        : renderRegularContent(category)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;