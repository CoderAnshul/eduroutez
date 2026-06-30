import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Heart, Plus, Building2, BookOpen, Briefcase, Clock, Trash2, IndianRupee, ExternalLink, Search } from "lucide-react";
import searchBoximg from "../assets/Images/serachBoximg.jpg";
import { getUserActivity, addToWishlist } from "../ApiFunctions/api";
import axiosInstance from "../ApiFunctions/axios";

const TABS = [
  { key: "institutes", label: "Institutes", icon: Building2 },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "blogs", label: "Liked Blogs", icon: Heart },
  { key: "careers", label: "Liked Careers", icon: Briefcase },
];

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState("institutes");
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [blogItems, setBlogItems] = useState([]);
  const [careerItems, setCareerItems] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const Image_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [wishlistRes, activityRes] = await Promise.all([
          axios.get(`${VITE_BASE_URL}/wishlists`, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": localStorage.getItem("accessToken"),
              "x-refresh-token": localStorage.getItem("refreshToken"),
            },
          }),
          getUserActivity(1, 50),
        ]);
        if (wishlistRes.data.success) {
          setColleges(wishlistRes.data.data.college_wishlist || []);
          setCourses(wishlistRes.data.data.course_wishlist || []);
        }
        const actData = activityRes.activities || activityRes;
        setActivities(Array.isArray(actData) ? actData : []);
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const likedBlogs = activities.filter((a) => a.type === "like_blog");
  const likedCareers = activities.filter((a) => a.type === "like_career");

  const getTabCount = (key) => {
    switch (key) {
      case "institutes": return colleges.length;
      case "courses": return courses.length;
      case "blogs": return likedBlogs.length;
      case "careers": return likedCareers.length;
      default: return 0;
    }
  };

  const currentList = activeTab === "institutes" ? colleges : activeTab === "courses" ? courses : [];
  const displayedItems = showAll ? currentList : currentList.slice(0, currentPage * itemsPerPage);

  const handleSeeMore = () => {
    if (!showAll) {
      if (currentPage * itemsPerPage < currentList.length) {
        setCurrentPage(currentPage + 1);
      } else {
        setShowAll(true);
      }
    }
  };

  const handleSeeLess = () => {
    setShowAll(false);
    setCurrentPage(1);
  };

  const handleRemove = useCallback(async (instituteId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await addToWishlist({ instituteId });
      setColleges((prev) => prev.filter((c) => c._id !== instituteId));
    } catch {}
  }, []);

  const handleRemoveCourse = useCallback(async (courseId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await addToWishlist({ courseId });
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    } catch {}
  }, []);

  const handleExplore = (path) => {
    window.location.href = path;
  };

  // Fetch actual blog data when blogs tab is active
  useEffect(() => {
    if (activeTab !== "blogs" || !likedBlogs.length) {
      setBlogItems([]);
      return;
    }
    const fetchBlogs = async () => {
      setContentLoading(true);
      const items = [];
      for (const act of likedBlogs) {
        if (!act.targetId) continue;
        try {
          const res = await axiosInstance.get(`/blog/${act.targetId}`);
          const d = res?.data?.data || res?.data;
          if (d) {
            items.push({ ...d, _id: act.targetId, _activity: act });
          } else {
            items.push({ _id: act.targetId, title: act.targetName || "Blog", _activity: act });
          }
        } catch {
          items.push({ _id: act.targetId, title: act.targetName || "Blog", _activity: act });
        }
      }
      setBlogItems(items);
      setContentLoading(false);
    };
    fetchBlogs();
  }, [activeTab, likedBlogs.length]);

  // Fetch actual career data when careers tab is active
  useEffect(() => {
    if (activeTab !== "careers" || !likedCareers.length) {
      setCareerItems([]);
      return;
    }
    const fetchCareers = async () => {
      setContentLoading(true);
      const items = [];
      for (const act of likedCareers) {
        if (!act.targetId) continue;
        try {
          const isObjectId = /^[a-fA-F0-9]{24}$/.test(String(act.targetId));
          const res = await axiosInstance.get("/careers", {
            params: { filters: JSON.stringify(isObjectId ? { _id: act.targetId } : { slug: act.targetId }), limit: 1 },
          });
          const d = res?.data?.data?.result?.[0] || res?.data?.result?.[0];
          if (d) {
            items.push({ ...d, _id: act.targetId, _activity: act });
          } else {
            items.push({ _id: act.targetId, title: act.targetName || "Career", _activity: act });
          }
        } catch {
          items.push({ _id: act.targetId, title: act.targetName || "Career", _activity: act });
        }
      }
      setCareerItems(items);
      setContentLoading(false);
    };
    fetchCareers();
  }, [activeTab, likedCareers.length]);

  const EmptyState = ({ icon: Icon, title, message, explorePath, exploreLabel }) => (
    <div className="flex flex-col items-center justify-center space-y-6 py-16">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
        <Icon className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600 text-center max-w-md">{message}</p>
      <button
        onClick={() => handleExplore(explorePath)}
        className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#b82025] text-white rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Search className="w-5 h-5" />
        {exploreLabel}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="universal-container py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 relative">
        My Wishlist & Activity
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#b82025] rounded-full"></div>
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setShowAll(false); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[#b82025] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {getTabCount(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "institutes" && (
        colleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-16">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Your wishlist is empty</h2>
            <p className="text-gray-600 text-center max-w-md">
              Start exploring colleges and add them to your wishlist to keep track of your favorite institutions.
            </p>
            <button
              onClick={handleExploreColleges}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#b82025] text-white rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Explore Colleges
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedItems.map((college) => (
                <div key={college._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
                  <button
                    onClick={(e) => handleRemove(college._id, e)}
                    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-red-50 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label="Remove from wishlist"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <div className="relative">
                    <img
                      src={college.thumbnailImage ? `${Image_URL}/${college.thumbnailImage}` : searchBoximg}
                      alt={college.instituteName}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b border-red-200 pb-2">{college.instituteName}</h2>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600"><span className="font-medium text-red-600">Established:</span> {college.establishedYear}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{college.collegeInfo}</p>
                      <p className="text-sm text-gray-800"><span className="font-medium text-red-600">Highest Package:</span> {college.highestPackage}</p>
                    </div>
                    <button
                      onClick={(e) => handleRemove(college._id, e)}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center gap-4">
              {!showAll && currentPage * itemsPerPage < colleges.length && (
                <button onClick={handleSeeMore} className="px-8 py-3 bg-[#b82025] text-white text-sm font-medium rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg">
                  See More
                </button>
              )}
              {currentPage > 1 && (
                <button onClick={handleSeeLess} className="px-8 py-3 bg-[#b82025] text-white text-sm font-medium rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg">
                  See Less
                </button>
              )}
            </div>
          </>
        )
      )}

      {activeTab === "courses" && (
        courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No saved courses" message="Browse courses and save your favorites to track them here." explorePath="/trendingcourses" exploreLabel="Explore Courses" />
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {displayedItems.map((course) => (
                <Link key={course._id} to={`/coursesinfopage/${course.slug || course._id}`} className="group">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveCourse(course._id, e); }}
                      className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-red-50 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={course.coursePreviewThumbnail ? `${Image_URL}/${course.coursePreviewThumbnail}` : searchBoximg}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800 text-base group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                        {course.courseTitle || "Untitled Course"}
                      </h3>
                      {course.shortDescription && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.shortDescription}</p>
                      )}
                      <div className="flex items-center justify-between">
                        {course.coursePrice ? (
                          <span className="flex items-center gap-1 text-sm font-semibold text-green-700">
                            <IndianRupee className="w-3.5 h-3.5" />{Number(course.coursePrice).toLocaleString()}
                          </span>
                        ) : <span />}
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 group-hover:gap-2 transition-all">
                          View Course <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemoveCourse(course._id, e); }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {((!showAll && currentPage * itemsPerPage < courses.length) || currentPage > 1) && (
              <div className="mt-12 flex justify-center gap-4">
                {!showAll && currentPage * itemsPerPage < courses.length && (
                  <button onClick={handleSeeMore} className="px-8 py-3 bg-[#b82025] text-white text-sm font-medium rounded-full hover:bg-red-700 transition-all shadow-md">
                    See More
                  </button>
                )}
                {currentPage > 1 && (
                  <button onClick={handleSeeLess} className="px-8 py-3 bg-[#b82025] text-white text-sm font-medium rounded-full hover:bg-red-700 transition-all shadow-md">
                    See Less
                  </button>
                )}
              </div>
            )}
          </>
        )
      )}
      {activeTab === "blogs" && (
        likedBlogs.length === 0 ? (
          <EmptyState icon={Heart} title="No liked blogs" message="Start reading blogs and like your favorites to see them here." explorePath="/blogpage" exploreLabel="Explore Blogs" />
        ) : contentLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent" /></div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogItems.map((item) => (
              <Link key={item._id} to={`/blog/${item.slug || item._id}`} className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.thumbnailImage ? `${Image_URL}/${item.thumbnailImage}` : searchBoximg}
                      alt={item.title || item.heading || "Blog"}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title || item.heading || item.name || item._activity?.targetName || "Blog"}
                    </h3>
                    {item.shortDescription && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2">{item.shortDescription}</p>
                    )}
                    <div className="mt-3 flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    </div>
                    <div className="mt-4 w-full bg-gray-50 text-center py-2 rounded-lg text-sm font-medium text-red-600 group-hover:bg-red-50 transition-colors">
                      Read Blog
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
      {activeTab === "careers" && (
        likedCareers.length === 0 ? (
          <EmptyState icon={Briefcase} title="No liked careers" message="Explore careers and like your favorites to track them here." explorePath="/careerspage" exploreLabel="Explore Careers" />
        ) : contentLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent" /></div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {careerItems.map((item) => (
              <Link key={item._id} to={`/detailpage/${item.slug || item._id}`} className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.thumbnailImage ? `${Image_URL}/${item.thumbnailImage}` : searchBoximg}
                      alt={item.title || item.careerName || "Career"}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2">
                      {item.title || item.careerName || item.name || item._activity?.targetName || "Career"}
                    </h3>
                    {item.shortDescription && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-2">{item.shortDescription}</p>
                    )}
                    <div className="mt-4 w-full bg-gray-50 text-center py-2 rounded-lg text-sm font-medium text-red-600 group-hover:bg-red-50 transition-colors">
                      View Career
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Wishlist;
