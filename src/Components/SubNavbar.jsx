import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import downArrow from "../assets/Images/downArrow.png";
import axiosInstance from "../ApiFunctions/axios";
import { IoIosArrowForward } from "react-icons/io";
const courseIdMap = {};
const newsIdMap = {};
const SubNavbar = ({ categories }) => {
  const [activeContent, setActiveContent] = useState({});
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownAlignment, setDropdownAlignment] = useState("left-0");
  const [popularCourses, setPopularCourses] = useState([]);
  const [careers, setCareers] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [popularInstitutes, setPopularInstitutes] = useState({});
  const [recentInstitutes, setRecentInstitutes] = useState({});
  const [topColleges, setTopColleges] = useState([]);
  const [collegesByCity, setCollegesByCity] = useState({});
  const [collegesByState, setCollegesByState] = useState({});
  const [activeStream, setActiveStream] = useState(null);
  const [examBlogs, setExamBlogs] = useState({});
  const navigate = useNavigate();
  const staticTopCities = [
    { name: "Mumbai", count: 158 },{ name: "Delhi", count: 126 },{ name: "Chandigarh", count: 87 },{ name: "Jaipur", count: 62 },{ name: "Bangalore", count: 53 },
    { name: "Chennai", count: 45 },
    { name: "Amravati", count: 38 },
    { name: "Solapur", count: 32 },
  ];
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
    const fetchPopularCourses = async () => {
      try {
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/courses?filters={"isCoursePopular":true}`
        );
        setPopularCourses(response.data?.data);

        // Create slug mappings for courses
        if (response.data?.data?.result) {
          response.data.data.result.forEach((course) => {
            if (course.courseTitle) {
              // Create slug from course title
              const slug = getCourseSlug(course);

              // Store mapping
              courseIdMap[slug] = course._id;
            }
          });

          // Update global map and localStorage
          updateGlobalMap();
        }
      } catch (error) {
        console.error("Error fetching popular courses:", error);
      }
    };

    const fetchExamBlogsByStream = async (streamId) => {
      try {
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/blogs?filters={"category":["Exam"],"stream":["${streamId}"]}&sort={"createdAt":"desc"}`
        );

        return response.data?.data?.result || [];
      } catch (error) {
        console.error(
          `Error fetching exam blogs for stream ${streamId}:`,
          error
        );
        return [];
      }
    };

    const fetchCareers = async () => {
      try {
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/careers?sort={"createdAt":"desc"}&page=1&limit=8`
        );
        setCareers(response.data?.data);
      } catch (error) {
        console.error("Error fetching careers:", error);
      }
    };

    const fetchLatestNews = async () => {
      try {
        const response = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/news/superadmin?sort=${encodeURIComponent(
            JSON.stringify({ createdAt: "desc" })
          )}`
        );
        console.log("news", response.data);
        setLatestNews(response.data?.data || []);

        // Create slug mappings for news items
        if (response.data?.data) {
          response.data.data.forEach((news) => {
            if (news.title) {
              // Create slug from news title
              const slug = getNewsSlug(news);

              // Store mapping
              newsIdMap[slug] = news._id;
            }
          });

          // Update global map and localStorage
          updateNewsIdMap();
        }
      } catch (error) {
        console.error("Error fetching latest news:", error);
      }
    };

    const updateNewsIdMap = () => {
      // Make the mapping available globally
      window.newsIdMap = {
        ...window.newsIdMap,
        ...newsIdMap,
      };

      // Get existing mappings from localStorage and merge
      const existingMap = JSON.parse(localStorage.getItem("newsIdMap") || "{}");
      localStorage.setItem(
        "newsIdMap",
        JSON.stringify({
          ...existingMap,
          ...newsIdMap,
        })
      );
    };

    const fetchTopColleges = async () => {
      try {
        // Fetch popular colleges (sorted by views)
        const popularResponse = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/institutes?select=["_id","slug","instituteName","views"]&sort={"views":"desc"}&page=1&limit=10`
        );
        setTopColleges(popularResponse.data?.data?.result || []);

        // Fetch recent colleges (sorted by createdAt)
        const recentResponse = await axiosInstance.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/institutes?select=["_id","slug","instituteName","views"]&sort={"createdAt":"desc"}&page=1&limit=10`
        );
        setRecentColleges(recentResponse.data?.data?.result || []);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchPopularCourses();
    fetchCareers();
    fetchLatestNews();
    fetchTopColleges();
    // Removed fetchTopLocations() as we're using static data now
  }, []);

  // Helper function to update global map and localStorage
  const updateGlobalMap = () => {
    // Make the mapping available globally
    window.courseIdMap = {
      ...window.courseIdMap,
      ...courseIdMap,
    };

    // Get existing mappings from localStorage and merge
    const existingMap = JSON.parse(localStorage.getItem("courseIdMap") || "{}");
    localStorage.setItem(
      "courseIdMap",
      JSON.stringify({
        ...existingMap,
        ...courseIdMap,
      })
    );
  };

  // Helper function to get the slug for a course
  const getCourseSlug = (course) => {
    if (!course?.courseTitle) return course?._id;

    return course.courseTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Helper function to get the slug for a career
  const getCareerSlug = (career) => {
    if (!career?.title) return career?._id;

    return career.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Helper function to get the slug for a news item
  const getNewsSlug = (news) => {
    if (!news?.title) return news?._id;

    return news.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Function to fetch institutes by stream with different sorting
  const fetchInstitutesByStream = async (streamName) => {
    try {
      // Fetch popular institutes (sorted by views)
      const popularResponse = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/institutes?select=["_id","slug","instituteName","views"]&sort={"views":"desc"}&page=1&limit=10&filters={"streams":["${streamName}"]}`
      );

      // Fetch recent institutes (sorted by createdAt)
      const recentResponse = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/institutes?select=["_id","slug","instituteName","views"]&sort={"createdAt":"desc"}&page=1&limit=10&filters={"streams":["${streamName}"]}`
      );

      return {
        popular: popularResponse.data?.data,
        recent: recentResponse.data?.data,
      };
    } catch (error) {
      console.error(`Error fetching institutes for ${streamName}:`, error);
      return null;
    }
  };

  // Function to fetch colleges by location (city or state)
  const fetchCollegesByLocation = async (locationType, locationName) => {
    try {
      const response = await axiosInstance.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/institutes?select=["_id","slug","instituteName","views"]&sort={"views":"desc"}&page=1&limit=10&filters={"${locationType}":"${locationName}"}`
      );

      return response.data?.data?.result || [];
    } catch (error) {
      console.error(
        `Error fetching colleges for ${locationType} ${locationName}:`,
        error
      );
      return [];
    }
  };

  // Function to handle location click
  const handleLocationClick = async (locationType, locationName, stream) => {
    const stateKey = `${locationType}_${locationName}`;
    console.log("locationType", locationType);
    console.log("locationName", locationName);

    // Check if we already have data for this location
    if (!collegesByCity[stateKey] && !collegesByState[stateKey]) {
      const colleges = await fetchCollegesByLocation(
        locationType,
        locationName
      );

      if (locationType === "city") {
        setCollegesByCity((prev) => ({
          ...prev,
          [stateKey]: colleges,
        }));
      } else if (locationType === "state") {
        setCollegesByState((prev) => ({
          ...prev,
          [stateKey]: colleges,
        }));
      }
    }

    // Close the dropdown menu
    setHoveredCategory(null);

    // Ensure state is set before navigating
    setTimeout(() => {
      navigate(
        `/searchpage?${locationType}=${encodeURIComponent(locationName)}${
          stream ? `&stream=${encodeURIComponent(stream)}` : ""
        }`
      );
    }, 100); // Adjust the delay as needed
  };

  // Function to handle stream click or hover
  const handleStreamInteraction = async (streamName, streamId) => {
    // Check if we already have data for this stream
    if (!popularInstitutes[streamName] || !recentInstitutes[streamName]) {
      const result = await fetchInstitutesByStream(streamName);

      if (result) {
        if (result.popular) {
          setPopularInstitutes((prev) => ({
            ...prev,
            [streamName]: result.popular,
          }));
        }

        if (result.recent) {
          setRecentInstitutes((prev) => ({
            ...prev,
            [streamName]: result.recent,
          }));
        }
      }
    }

    // Fetch exam blogs if this is for the Exams category and we don't have data yet
    if (hoveredCategory === "Exams" && !examBlogs[streamId]) {
      const blogs = await fetchExamBlogsByStream(streamId);
      setExamBlogs((prev) => ({
        ...prev,
        [streamId]: blogs,
      }));
    }
  };

  const handleMouseEnter = async (category, event) => {
    const boundingBox = event.target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const categoryWidth = boundingBox.width;

    if (category.label === "MEDIA") {
      setDropdownAlignment("transform translate-x-[-50%]");
    } else if (boundingBox.left <= categoryWidth) {
      setDropdownAlignment("left-0");
    } else if (viewportWidth - boundingBox.right <= categoryWidth) {
      setDropdownAlignment("right-0");
    } else {
      setDropdownAlignment("left-0");
    }

    setHoveredCategory(category.label);

    if (
      category.label !== "Courses" &&
      category.label !== "Careers" &&
      category.label !== "Latest Updates" &&
      category.label !== "Top Colleges" &&
      category.sidebarItems?.length > 0
    ) {
      const firstItemId = category.sidebarItems[0].id;
      setActiveContent((prev) => ({
        ...prev,
        [category.label]: firstItemId,
      }));

      // If this is a stream category, fetch institutes
      if (category.label === "Colleges" || category.label === "Exams") {
        const streamName = category.sidebarItems[0].name;
        handleStreamInteraction(streamName);
      }
    }
  };

  const handleSidebarItemClick = async (
    category,
    itemId,
    itemName,
    streamId
  ) => {
    setActiveContent((prev) => ({
      ...prev,
      [category.label]: itemId,
    }));

    // If this is a stream, fetch popular institutes
    if (category.label === "Colleges" || category.label === "Exams") {
      handleStreamInteraction(itemName, streamId);
    }
  };

  const renderExamBlogs = (streamId) => {
    const blogs = examBlogs[streamId] || [];

    return (
      <div className="p-4 max-w-[1400px]">
        <h3 className="font-semibold text-red-500 mb-3">Latest Exam Updates</h3>
        {blogs.length === 0 ? (
          <p className="text-sm text-gray-500">Loading exam updates...</p>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {blogs.slice(0, 5).map((blog) => (
              <div
                key={blog._id}
                onClick={() => {
                  navigate(`/blog/${blog.slug || blog._id}`);
                  setHoveredCategory(null); // Close dropdown on click
                }}
                className="cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <div className="text-sm font-medium text-gray-800 hover:text-red-500">
                  {blog.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            <div className="text-right mt-2">
              <a
                onClick={() => {
                  navigate(`/blogs?category=Exam&stream=${streamId}`);
                  setHoveredCategory(null); // Close dropdown on click
                }}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                View All Exam Updates →
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No exam updates available</p>
        )}
      </div>
    );
  };

  const handleViewAllCourses = () => {
    navigate("/popularcourses");
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleViewAllCareers = () => {
    navigate("/careerspage");
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleViewAllColleges = () => {
    navigate("/topcolleges");
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleAllCollegesByCity = () => {
    navigate("/searchpage");
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleAllCollegesByState = () => {
    navigate("/searchpage");
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    setDropdownAlignment("");
  };

  const handleViewAllNews = () => {
    navigate("/news"); // Adjust the route as needed
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleCourseClick = (course) => {
    const courseSlug = getCourseSlug(course);
    navigate(`/coursesinfopage/${courseSlug}`);
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleCareerClick = (career) => {
    const careerSlug = getCareerSlug(career);
    navigate(`/detailpage/${careerSlug}`);
    setHoveredCategory(null); // Close dropdown on click
  };

  const handleNewsClick = (news) => {
    const newsSlug = getNewsSlug(news);
    navigate(`/news/${newsSlug}`);
    setHoveredCategory(null); // Close dropdown on click

    // You might want to add this debugging log
    console.log(
      `News slug: ${newsSlug}, ID: ${newsIdMap[newsSlug] || news._id}`
    );
  };

  const handleInstituteClick = (institute) => {
    navigate(`/institute/${institute.slug || institute._id}`);
    setHoveredCategory(null); // Close dropdown on click
  };

  // Add a general click handler for links
  const handleLinkClick = (url) => {
    navigate(url);
    setHoveredCategory(null); // Close dropdown on click
  };

  const renderCoursesContent = () => (
    <div className="p-8 bg-white min-w-[1500px] max-h-[500px] overflow-y-auto rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-gray-800 flex items-center">
          <span className="w-1.5 h-6 bg-[#b82025] rounded-full mr-3"></span>
          Popular Courses
        </h3>
        <span className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-full font-medium">
          {popularCourses?.result?.length || 0} Courses Available
        </span>
      </div>

      <div className="grid grid-cols-3 gap-x-8 ">
        {popularCourses?.result?.map((course) => (
          <div key={course._id} className="group">
            <a
              onClick={() => handleCourseClick(course)}
              className="flex items-center space-x-2 px-2 py-1 rounded-lg cursor-pointer transition-all duration-200 hover:text-red-500"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <span className="text-sm text-inherit text-black hover:text-red-500  truncate  transition-colors ">
                {course.courseTitle}
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCareersContent = () => (
    <div className="p-6 bg-white min-w-[1500px]">
      <div className="space-y-8">
        <h3 className="font-semibold text-red-500">Latest Careers</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {careers?.result?.map((career) => (
              <a
                key={career._id}
                onClick={() => handleCareerClick(career)}
                className="text-sm hover:text-red-500 cursor-pointer truncate text-black"
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

  const renderTopCollegesContent = () => (
    <div className="p-6 bg-white min-w-[1500px]">
      <div className="grid grid-cols-3 gap-6">
        {/* Popular Colleges (sorted by views) */}
        <div className="space-y-6">
          <h3 className="font-semibold text-red-500">Popular Colleges</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {topColleges?.map((college) => (
                <a
                  key={college._id}
                  onClick={() => handleInstituteClick(college)}
                  className="text-sm hover:text-red-500 cursor-pointer truncate flex justify-between"
                >
                  <span>{college.instituteName}</span>
                  <span className="text-gray-500 text-xs">
                    {college.views || 0} views
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Top Cities - Now using static data */}
        <div className="space-y-6">
          <h3 className="font-semibold text-red-500">Colleges by City</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {staticTopCities.map((city, index) => (
                <a
                  key={index}
                  onClick={() => handleLocationClick("city", city.name)}
                  className="text-sm hover:text-red-500 cursor-pointer truncate flex justify-between"
                >
                  <span>{city.name}</span>
                  <span className="text-gray-500 text-xs">
                    {city.count} colleges
                  </span>
                </a>
              ))}
            </div>
            <div className="text-right">
              <a
                onClick={handleAllCollegesByCity}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                View All Cities →
              </a>
            </div>
          </div>
        </div>

        {/* Top States - Now using static data */}
        <div className="space-y-6">
          <h3 className="font-semibold text-red-500">Colleges by State</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {staticTopStates.map((state, index) => (
                <a
                  key={index}
                  onClick={() => handleLocationClick("state", state.name)}
                  className="text-sm hover:text-red-500 cursor-pointer truncate flex justify-between"
                >
                  <span>{state.name}</span>
                  <span className="text-gray-500 text-xs">
                    {state.count} colleges
                  </span>
                </a>
              ))}
            </div>
            <div className="text-right">
              <a
                onClick={handleAllCollegesByState}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                View All States →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right mt-6">
        <a
          onClick={() => handleViewAllColleges()}
          className="text-sm text-red-500 hover:text-red-600 cursor-pointer font-medium"
        >
          View All Colleges →
        </a>
      </div>
    </div>
  );

  const renderNewsContent = () => (
    <div className="bg-white rounded-xl min-w-[1500px] shadow-lg">
      <div className="p-4 border-b ">
        <h3 className="text-lg font-bold text-black">Latest Updates</h3>
      </div>

      <div className="p-4">
        <ul className="grid grid-cols-4 gap-8 ml-0  list-none">
          {latestNews
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4)
            .map((news) => (
              <li
                key={news._id}
                onClick={() => handleNewsClick(news)}
                className="group text-black hover:bg-orange-50 rounded-lg p-3 transition-colors duration-200 cursor-pointer shadow-md"
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
                      src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${
                        news.image
                      }`}
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
          className="flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
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
    <div className="bg-pink rounded-lg shadow-lg p-6 min-w-[1500px]">
      <div className="grid grid-cols-3 gap-8">
        <div className="space-y-4 ">
          <h3 className="font-semibold text-red-500 border-b pb-2 ">
            Resources
          </h3>
          <ul className="space-y-2 list-none ml-0">
            <li className="!text-black">
              <a
                onClick={() => handleLinkClick("/blogpage?category=Exam")}
                className="text-sm hover:text-red-500 text-black"
              >
                Entrance Exams
              </a>
            </li>
            <li className="!text-black list-none">
              <a
                onClick={() => handleLinkClick("/searchpage")}
                className="text-sm hover:text-red-500 text-black"
              >
                Top Colleges
              </a>
            </li>
            <li className="!text-black list-none">
              <a
                onClick={() =>
                  handleLinkClick("/blogdetailpage/67cab414dd3a58f74a0c6295")
                }
                className="text-sm hover:text-red-500 text-black"
              >
                Scholarships
              </a>
            </li>
            <li className="!text-black list-none">
              <a
                onClick={() =>
                  handleLinkClick("/blogdetailpage/67cab637dd3a58f74a0c665f")
                }
                className="text-sm hover:text-red-500 text-black"
              >
                Study Material
              </a>
            </li>
            <li className="!text-black list-none">
              <a
                onClick={() => handleLinkClick("/blogpage")}
                className="text-sm hover:text-red-500 text-black"
              >
                Blogs
              </a>
            </li>
          </ul>
        </div>

        {/* Tools Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-red-500 border-b pb-2">Tools</h3>
          <ul className="space-y-2 ml-0">
            <li className="list-none">
              <a
                onClick={() =>
                  handleLinkClick("/blogdetailpage/67cab87fdd3a58f74a0c6b99")
                }
                className="text-sm hover:text-red-500 text-black"
              >
                Career Assessment
              </a>
            </li>
            <li className="list-none">
              <a
                onClick={() => handleLinkClick("/counselor")}
                className="text-sm hover:text-red-500 text-black"
              >
                Book Your Counselling
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-4 w-fit">
          <h3 className="font-semibold text-red-500 border-b pb-2">
            Quick Links
          </h3>
          <ul className="space-y-2 ml-0">
            <li className="list-none">
              <a
                onClick={() => handleLinkClick("/aboutus")}
                className="text-sm hover:text-red-500 text-black"
              >
                About Us
              </a>
            </li>
            <li className="list-none">
              <a
                onClick={() => handleLinkClick("/Contactuspage")}
                className="text-sm hover:text-red-500 text-black"
              >
                Contact Us
              </a>
            </li>
            <li className="list-none">
              <a
                onClick={() => handleLinkClick("/question-&-answers")}
                className="text-sm hover:text-red-500 text-black"
              >
                Q/A
              </a>
            </li>
            <li className="list-none">
              <a
                onClick={() => handleLinkClick("login")}
                className="text-sm hover:text-red-500 text-black"
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderStreamInstitutes = (streamName) => {
    const popular = popularInstitutes[streamName]?.result || [];
    const recent = recentInstitutes[streamName]?.result || [];

    return (
      <div className="p-4 flex gap-6">
        {/* Popular Institutes (sorted by views) */}
        <div className="min-w-48">
          <h3 className="font-semibold text-red-500 mb-3">Popular Colleges</h3>
          {popular.length === 0 ? (
            <p className="text-sm text-gray-500">
              Loading popular institutes...
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {popular.slice(0, 5).map((institute) => (
                <div
                  key={institute._id}
                  onClick={() => handleInstituteClick(institute)}
                  className="cursor-pointer transition-colors hover:text-red-500 text-sm flex justify-between"
                >
                  <span>{institute.instituteName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Institutes (sorted by createdAt) */}
        <div className="min-w-48">
          <h3 className="font-semibold text-red-500 mb-3">Top Colleges</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">
              Loading recent institutes...
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {recent.slice(0, 5).map((institute) => (
                <div
                  key={institute._id}
                  onClick={() => handleInstituteClick(institute)}
                  className="cursor-pointer transition-colors hover:text-red-500 text-sm"
                >
                  {institute.instituteName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRegularContent = (category) => (
    <div className="flex min-w-[1500px]">
      <div className="w-[440px]  overflow-y-auto">
        <ul className="min-w-40 whitespace-nowrap md:w-fit ml-0 mb-0 pb-0 space-y-0">
          {category?.sidebarItems?.map((item) => (
            <li
              key={item.id}
              className={`px-2 py-2 group mb-0  text-sm flex justify-between gap-3 items-center cursor-pointer transition-all hover:bg-black ${
                activeContent[category.label] === item.id
                  ? "bg-black border-l-2 border-black text-white"
                  : "bg-[#b82025] text-white"
              }`}
              onMouseEnter={() => {
                setActiveContent((prev) => ({
                  ...prev,
                  [category.label]: item.id,
                }));

                // If this is a stream category, fetch institutes on hover
                if (
                  category.label === "Colleges" ||
                  category.label === "Exams"
                ) {
                  handleStreamInteraction(item.name);
                  // Store the active stream name in state
                  setActiveStream(item.name);
                }
              }}
              onClick={() =>
                handleSidebarItemClick(category, item.id, item.name)
              }
            >
              {item.name}
              <span className="text-xs">
                <IoIosArrowForward
                  className={`text-lg ${
                    activeContent[category.label] === item.id
                      ? "text-white font-semibold rotate-[90deg]"
                      : "text-black"
                  } `}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col ">
        {/* Show stream institutes for the active stream if this is Colleges or Exams */}
        {(category.label === "Colleges" || category.label === "Exams") &&
          activeContent[category.label] &&
          category.sidebarItems &&
          renderStreamInstitutes(
            category.sidebarItems.find(
              (item) => item.id === activeContent[category.label]
            )?.name
          )}
      </div>

      {/* City and State sections with stream-based display */}
      <div className="ml-4 mt-4 flex gap-10 mr-10 w-full">
        {/* Top Cities - Now showing stream-specific data */}
        <div className="space-y-6">
          <h3 className="font-semibold text-red-500">
            {activeStream
              ? `${activeStream} Colleges by City`
              : "Colleges by City"}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 w-[280px] ">
              {staticTopCities.map((city, index) => (
                <a
                  key={index}
                  onClick={() =>
                    handleLocationClick("city", city.name, activeStream)
                  }
                  className="text-sm hover:text-red-500 cursor-pointer truncate flex justify-between text-black"
                  onMouseEnter={() => {
                    // Show stream-specific college count if available
                    if (activeStream) {
                      setHoveredCity(city.name);
                    }
                  }}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <span className="line-clamp-1 ">
                    {" "}
                    {activeStream} in {city.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="text-left mr-4">
              <a
                onClick={() => handleAllCollegesByCity(activeStream)}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium text-black"
              >
                {activeStream
                  ? `View All ${activeStream} Cities →`
                  : "View All Cities →"}
              </a>
            </div>
          </div>
        </div>

        {/* Top States - Now showing stream-specific data */}
        <div className="space-y-6">
          <h3 className="font-semibold text-red-500">
            {activeStream
              ? `${activeStream} Colleges by State`
              : "Colleges by State"}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              {staticTopStates.map((state, index) => (
                <a
                  key={index}
                  onClick={() =>
                    handleLocationClick("state", state.name, activeStream)
                  }
                  className="text-sm hover:text-red-500 cursor-pointer truncate flex justify-between text-black"
                  onMouseEnter={() => {
                    // Show stream-specific college count if available
                    if (activeStream) {
                      setHoveredState(state.name);
                    }
                  }}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <span>
                    {" "}
                    {activeStream} in {state.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="text-left mr-4">
              <a
                onClick={() => handleAllCollegesByState(activeStream)}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer font-medium"
              >
                {activeStream
                  ? `View All ${activeStream} States →`
                  : "View All States →"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="w-full h-auto bg-white ">
        <div className="w-full px-5 pt-2 h-full mx-auto flex justify-between">
          <div className=" h-full flex flex-col justify-between">
            <div className="h-1/2 w-fit px-1 flex relative items-center justify-start gap-7">
              {categories?.map((category, index) => (
                <div
                  key={index}
                  className="group"
                  onMouseEnter={(e) => handleMouseEnter(category, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <h5 className="text-xs gap-2 font-[500] pb-2 mt-0 group-hover:text-red-500 group-hover:scale-95 transform transition-all text-[#00000096] flex items-center cursor-pointer whitespace-nowrap">
                    {category.label}
                    <img
                      className="h-3 group-hover:rotate-180 transition-all"
                      src={downArrow}
                      alt=""
                    />
                  </h5>
                  {hoveredCategory === category.label && (
                    <div
                      className={`absolute top-6 z-[1000] bg-white   shadow-lg ${dropdownAlignment}`}
                    >
                      {category.label === "Courses"
                        ? renderCoursesContent()
                        : category.label === "Careers"
                        ? renderCareersContent()
                        : category.label === "Latest Updates"
                        ? renderNewsContent()
                        : category.label === "Colleges"
                        ? renderRegularContent(category)
                        : category.label === "More"
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

// Export the courseIdMap for potential use in other components
export { courseIdMap };
export default SubNavbar;
