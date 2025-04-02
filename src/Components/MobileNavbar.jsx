import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import downArrow from "../assets/Images/downArrow.png";
import axiosInstance from "../ApiFunctions/axios";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const MobileNavbar = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeContent, setActiveContent] = useState({});
  const [popularCourses, setPopularCourses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [topColleges, setTopColleges] = useState([]);
  const [activeStream, setActiveStream] = useState(null);
  const [popularInstitutes, setPopularInstitutes] = useState({});
  const [recentInstitutes, setRecentInstitutes] = useState({});
  const [examBlogs, setExamBlogs] = useState({});
  
  const navigate = useNavigate();

  const staticTopCities = [
    { name: "Mumbai", count: 158 },
    { name: "Delhi", count: 126 },
    { name: "Chandigarh", count: 87 },
    { name: "Jaipur", count: 62 },
    { name: "Bangalore", count: 53 },
    { name: "Chennai", count: 45 },
    { name: "Amravati", count: 38 },
    { name: "Solapur", count: 32 },
  ];

  // Static data for states
  const staticTopStates = [
    { name: "Maharashtra", count: 763 },
    { name: "Delhi", count: 592 },
    { name: "Rajasthan", count: 524 },
    { name: "Haryana", count: 487 },
    { name: "Uttar Pradesh", count: 465 },
    { name: "Gujarat", count: 412 },
    { name: "West Bengal", count: 345 },
    { name: "Telangana", count: 322 },
  ];

  useEffect(() => {
    if (!activeCategory) return;
    
    const fetchData = async () => {
      switch (activeCategory) {
        case "Courses":
          fetchPopularCourses();
          break;
        case "Careers":
          fetchCareers();
          break;
        case "Latest Updates":
          fetchLatestNews();
          break;
        case "Top Colleges":
          fetchTopColleges();
          break;
        default:
          break;
      }
    };
    
    fetchData();
  }, [activeCategory]);

  const fetchPopularCourses = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/courses?filters={"isCoursePopular":true}`
      );
      setPopularCourses(response.data?.data);
    } catch (error) {
      console.error("Error fetching popular courses:", error);
    }
  };

  const fetchCareers = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/careers?sort={"createdAt":"desc"}&page=1&limit=8`
      );
      setCareers(response.data?.data);
    } catch (error) {
      console.error("Error fetching careers:", error);
    }
  };

  const fetchLatestNews = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/news/superadmin?sort=${encodeURIComponent(
          JSON.stringify({ createdAt: "desc" })
        )}`
      );
      setLatestNews(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching latest news:", error);
    }
  };

  const fetchTopColleges = async () => {
    try {
      const popularResponse = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/institutes?select=["_id","slug","instituteName","views"]&sort={"views":"desc"}&page=1&limit=10`
      );
      setTopColleges(popularResponse.data?.data?.result || []);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchInstitutesByStream = async (streamName) => {
    try {
      // Fetch popular institutes
      const popularResponse = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/institutes?select=["_id","slug","instituteName","views"]&sort={"views":"desc"}&page=1&limit=5&filters={"streams":["${streamName}"]}`
      );

      // Fetch recent institutes
      const recentResponse = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/institutes?select=["_id","slug","instituteName","views"]&sort={"createdAt":"desc"}&page=1&limit=5&filters={"streams":["${streamName}"]}`
      );

      setPopularInstitutes(prev => ({
        ...prev,
        [streamName]: popularResponse.data?.data
      }));
      
      setRecentInstitutes(prev => ({
        ...prev,
        [streamName]: recentResponse.data?.data
      }));
      
    } catch (error) {
      console.error(`Error fetching institutes for ${streamName}:`, error);
    }
  };

  const fetchExamBlogsByStream = async (streamId) => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/blogs?filters={"category":["Exam"],"stream":["${streamId}"]}&sort={"createdAt":"desc"}`
      );

      setExamBlogs(prev => ({
        ...prev,
        [streamId]: response.data?.data?.result || []
      }));
    } catch (error) {
      console.error(`Error fetching exam blogs for stream ${streamId}:`, error);
    }
  };

  const toggleCategory = (categoryLabel) => {
    setActiveCategory(prevCategory => 
      prevCategory === categoryLabel ? null : categoryLabel
    );
    setActiveSubcategory(null);
  };

  const toggleSubcategory = (itemId, itemName, streamId) => {
    setActiveSubcategory(prevItem => 
      prevItem === itemId ? null : itemId
    );
    
    if (activeCategory === "Colleges" || activeCategory === "Exams") {
      setActiveStream(itemName);
      fetchInstitutesByStream(itemName);
      
      if (activeCategory === "Exams" && streamId && !examBlogs[streamId]) {
        fetchExamBlogsByStream(streamId);
      }
    }
  };

  const getCourseSlug = (course) => {
    if (!course?.courseTitle) return course?._id;
    return course.courseTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const getCareerSlug = (career) => {
    if (!career?.title) return career?._id;
    return career.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const getNewsSlug = (news) => {
    if (!news?.title) return news?._id;
    return news.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleCourseClick = (course) => {
    const courseSlug = getCourseSlug(course);
    navigate(`/coursesinfopage/${courseSlug}`);
    closeMenu();
  };

  const handleCareerClick = (career) => {
    const careerSlug = getCareerSlug(career);
    navigate(`/detailpage/${careerSlug}`);
    closeMenu();
  };

  const handleNewsClick = (news) => {
    const newsSlug = getNewsSlug(news);
    navigate(`/news/${newsSlug}`);
    closeMenu();
  };

  const handleInstituteClick = (institute) => {
    navigate(`/institute/${institute.slug || institute._id}`);
    closeMenu();
  };

  const handleLocationClick = (locationType, locationName, stream) => {
    navigate(
      `/searchpage?${locationType}=${encodeURIComponent(locationName)}${
        stream ? `&stream=${encodeURIComponent(stream)}` : ""
      }`
    );
    closeMenu();
  };

  const handleLinkClick = (url) => {
    navigate(url);
    closeMenu();
  };

  const closeMenu = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const renderCoursesContent = () => (
    <div className="bg-white p-4 overflow-y-auto max-h-72">
      <h3 className="font-semibold text-red-500 mb-3">Popular Courses</h3>
      <div className="space-y-2">
        {popularCourses?.result?.map((course) => (
          <div 
            key={course._id}
            className="p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => handleCourseClick(course)}
          >
            <span className="text-sm">{course.courseTitle}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <span 
          className="text-xs text-red-500 cursor-pointer"
          onClick={() => handleLinkClick("/popularcourses")}
        >
          View All Courses →
        </span>
      </div>
    </div>
  );

  const renderCareersContent = () => (
    <div className="bg-white p-4 overflow-y-auto max-h-72">
      <h3 className="font-semibold text-red-500 mb-3">Latest Careers</h3>
      <div className="space-y-2">
        {careers?.result?.map((career) => (
          <div 
            key={career._id}
            className="p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => handleCareerClick(career)}
          >
            <span className="text-sm">{career.title}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <span 
          className="text-xs text-red-500 cursor-pointer"
          onClick={() => handleLinkClick("/careerspage")}
        >
          View All Careers →
        </span>
      </div>
    </div>
  );

  const renderNewsContent = () => (
    <div className="bg-white p-4 overflow-y-auto max-h-72">
      <h3 className="font-semibold text-red-500 mb-3">Latest Updates</h3>
      <div className="space-y-3">
        {latestNews
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map((news) => (
            <div 
              key={news._id}
              className="p-2 border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNewsClick(news)}
            >
              <p className="text-sm font-medium line-clamp-2">{news.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(news.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>
      <div className="mt-4 text-right">
        <span 
          className="text-xs text-red-500 cursor-pointer"
          onClick={() => handleLinkClick("/news")}
        >
          View All Updates →
        </span>
      </div>
    </div>
  );

  const renderTopCollegesContent = () => (
    <div className="bg-white p-4 overflow-y-auto max-h-72">
      <h3 className="font-semibold text-red-500 mb-3">Popular Colleges</h3>
      <div className="space-y-2">
        {topColleges?.map((college) => (
          <div 
            key={college._id}
            className="p-2 hover:bg-gray-50 rounded cursor-pointer flex justify-between"
            onClick={() => handleInstituteClick(college)}
          >
            <span className="text-sm">{college.instituteName}</span>
            <span className="text-xs text-gray-500">{college.views || 0} views</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <span 
          className="text-xs text-red-500 cursor-pointer"
          onClick={() => handleLinkClick("/topcolleges")}
        >
          View All Colleges →
        </span>
      </div>
    </div>
  );

  const renderMoreContent = () => (
    <div className="bg-white p-4 overflow-y-auto max-h-72">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-red-500 mb-2">Resources</h3>
          <div className="space-y-2">
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/blogpage?category=Exam")}>
              <span className="text-sm">Entrance Exams</span>
            </div>
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/searchpage")}>
              <span className="text-sm">Top Colleges</span>
            </div>
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/blogdetailpage/67cab414dd3a58f74a0c6295")}>
              <span className="text-sm">Scholarships</span>
            </div>
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/blogpage")}>
              <span className="text-sm">Blogs</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-red-500 mb-2">Tools</h3>
          <div className="space-y-2">
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/blogdetailpage/67cab87fdd3a58f74a0c6b99")}>
              <span className="text-sm">Career Assessment</span>
            </div>
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/counselor")}>
              <span className="text-sm">Book Your Counselling</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-red-500 mb-2">Quick Links</h3>
          <div className="space-y-2">
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/aboutus")}>
              <span className="text-sm">About Us</span>
            </div>
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/Contactuspage")}>
              <span className="text-sm">Contact Us</span>
            </div>
            <div className="p-1.5 hover:bg-gray-50 cursor-pointer" onClick={() => handleLinkClick("/login")}>
              <span className="text-sm">Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExamBlogs = (streamId) => {
    const blogs = examBlogs[streamId] || [];
    
    return (
      <div className="p-4">
        <h3 className="font-semibold text-red-500 mb-3">Latest Exam Updates</h3>
        {blogs.length === 0 ? (
          <p className="text-sm text-gray-500">Loading exam updates...</p>
        ) : (
          <div className="space-y-2">
            {blogs.slice(0, 5).map((blog) => (
              <div 
                key={blog._id}
                className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => {
                  navigate(`/blog/${blog.slug || blog._id}`);
                  closeMenu();
                }}
              >
                <p className="text-sm">{blog.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            <div className="text-right mt-2">
              <span 
                className="text-xs text-red-500 cursor-pointer"
                onClick={() => {
                  navigate(`/blogs?category=Exam&stream=${streamId}`);
                  closeMenu();
                }}
              >
                View All Exam Updates →
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStreamContent = (stream) => {
    const popular = popularInstitutes[stream]?.result || [];
    const recent = recentInstitutes[stream]?.result || [];
    
    return (
      <div className="bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-red-500 mb-3">Popular {stream} Colleges</h3>
          {popular.length === 0 ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              {popular.slice(0, 5).map((institute) => (
                <div 
                  key={institute._id}
                  className="p-1.5 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleInstituteClick(institute)}
                >
                  <span className="text-sm">{institute.instituteName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-b">
          <h3 className="font-semibold text-red-500 mb-3">Recent {stream} Colleges</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-2">
              {recent.slice(0, 5).map((institute) => (
                <div 
                  key={institute._id}
                  className="p-1.5 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleInstituteClick(institute)}
                >
                  <span className="text-sm">{institute.instituteName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-b">
          <h3 className="font-semibold text-red-500 mb-3">{stream} Colleges by City</h3>
          <div className="space-y-2">
            {staticTopCities.slice(0, 5).map((city, index) => (
              <div 
                key={index}
                className="p-1.5 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handleLocationClick("city", city.name, stream)}
              >
                <span className="text-sm">{stream} in {city.name}</span>
              </div>
            ))}
            <div className="text-right mt-2">
              <span 
                className="text-xs text-red-500 cursor-pointer"
                onClick={() => handleLinkClick(`/searchpage?stream=${encodeURIComponent(stream)}`)}
              >
                View All Cities →
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-red-500 mb-3">{stream} Colleges by State</h3>
          <div className="space-y-2">
            {staticTopStates.slice(0, 5).map((state, index) => (
              <div 
                key={index}
                className="p-1.5 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handleLocationClick("state", state.name, stream)}
              >
                <span className="text-sm">{stream} in {state.name}</span>
              </div>
            ))}
            <div className="text-right mt-2">
              <span 
                className="text-xs text-red-500 cursor-pointer"
                onClick={() => handleLinkClick(`/searchpage?stream=${encodeURIComponent(stream)}`)}
              >
                View All States →
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSubcategoryContent = (category, subcategoryId) => {
    const currentCategory = categories.find(cat => cat.label === category);
    if (!currentCategory) return null;
    
    const currentSubcategory = currentCategory.sidebarItems.find(item => item.id === subcategoryId);
    if (!currentSubcategory) return null;
    
    if (category === "Colleges") {
      return renderStreamContent(currentSubcategory.name);
    } else if (category === "Exams") {
      return (
        <div className="bg-white overflow-y-auto">
          {renderExamBlogs(currentSubcategory.id)}
          {renderStreamContent(currentSubcategory.name)}
        </div>
      );
    }
    
    return null;
  };

  const renderContent = () => {
    if (!activeCategory) return null;
    
    switch (activeCategory) {
      case "Courses":
        return renderCoursesContent();
      case "Careers":
        return renderCareersContent();
      case "Latest Updates":
        return renderNewsContent();
      case "Top Colleges":
        return renderTopCollegesContent();
      case "More":
        return renderMoreContent();
      default:
        if (activeSubcategory) {
          return renderSubcategoryContent(activeCategory, activeSubcategory);
        }
        return null;
    }
  };

  return (
    <div className="w-full bg-gray-100 h-[450px] overflow-y-auto">
      <ul className="space-y-1 ml-0">
        {categories?.map((category, index) => (
          <li key={index} className="border-b border-gray-200">
            <div
              className={`flex justify-between items-center p-3 transition-all cursor-pointer ${
                activeCategory === category.label
                  ? "bg-[#b82025] text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => toggleCategory(category.label)}
            >
              <span className="font-medium">{category.label}</span>
              <span
                className={`transform transition-transform ${
                  activeCategory === category.label ? "rotate-180" : "rotate-0"
                }`}
              >
                <IoIosArrowDown className="text-lg" />
              </span>
            </div>
            
            {activeCategory === category.label && (
              <>
                {/* For categories with subcategories (like streams) */}
                {category.sidebarItems && category.sidebarItems.length > 0 && 
                  category.label !== "Courses" && 
                  category.label !== "Careers" && 
                  category.label !== "Latest Updates" && 
                  category.label !== "Top Colleges" && 
                  category.label !== "More" && (
                  <ul className="bg-gray-50">
                    {category.sidebarItems.map((item) => (
                      <li key={item.id}>
                        <div
                          className={`flex justify-between items-center p-3 border-t border-gray-100 cursor-pointer ${
                            activeSubcategory === item.id
                              ? "bg-gray-200"
                              : "bg-gray-50"
                          }`}
                          onClick={() => toggleSubcategory(item.id, item.name, item.id)}
                        >
                          <span className="text-sm">{item.name}</span>
                          <IoIosArrowForward 
                            className={`text-lg transition-transform ${
                              activeSubcategory === item.id ? "rotate-90" : "rotate-0"
                            }`} 
                          />
                        </div>
                        
                        {/* Content for this subcategory */}
                        {activeSubcategory === item.id && renderSubcategoryContent(category.label, item.id)}
                      </li>
                    ))}
                  </ul>
                )}
                
                {/* Direct content for categories without subcategories */}
                {(category.label === "Courses" || 
                  category.label === "Careers" || 
                  category.label === "Latest Updates" || 
                  category.label === "Top Colleges" || 
                  category.label === "More") && renderContent()}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNavbar;