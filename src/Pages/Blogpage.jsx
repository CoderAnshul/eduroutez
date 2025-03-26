import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import PageBanner from "../Ui components/PageBanner";
import BlogandCareerBox from "../Ui components/BlogandCareerBox";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import PopularCourses from "../Components/PopularCourses";
import HighRatedCareers from "../Components/HighRatedCareers";
import SocialShare from "../Components/SocialShare";

// Create a module-level object to store the blog ID mapping
const blogIdMapStore = {};

const Blogpage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 8;

  // Get the URL location and query parameters
  const location = useLocation();

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch all blogs at once
  const {
    data: blogData,
    isLoading: blogLoading,
    isError: blogError,
    error: blogFetchError,
  } = useQuery(
    ["all-blogs"],
    async () => {
      const response = await axios.get(
        `${baseURL}/blogs?sort={"createdAt":"desc"}`,
        {
          params: {
            limit: 1000, // Fetch a large number of blogs
          },
        }
      );
      return response.data;
    },
    {
      enabled: true,
      onSuccess: (data) => {
        // Create ID mapping for each blog using the slug from backend
        const blogs = data?.data?.result || [];

        blogs.forEach((blog) => {
          if (blog.slug) {
            blogIdMapStore[blog.slug] = blog._id;
          }
        });

        // Make the mapping available globally
        window.blogIdMap = blogIdMapStore;
      },
    }
  );

  // Fetch categories
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery(
    ["blog-categories"],
    async () => {
      const response = await axios.get(`${baseURL}/blog-category`);
      return response.data;
    },
    {
      enabled: true,
      onSuccess: (data) => {
        // Check for category in URL params after categories have loaded
        const queryParams = new URLSearchParams(location.search);
        const categoryParam = queryParams.get("category");

        if (categoryParam && data?.data?.result) {
          const categories = data.data.result;
          const matchingCategory = categories.find(
            (cat) =>
              cat &&
              cat.name &&
              cat.name.toLowerCase() === categoryParam.toLowerCase()
          );

          if (matchingCategory) {
            setSelectedCategories([matchingCategory.name]);
          }
        }
      },
    }
  );

  // Check for URL query parameters when component mounts or URL changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");

    if (categoryParam && categoryData?.data?.result) {
      const categories = categoryData.data.result;
      const matchingCategory = categories.find(
        (cat) =>
          cat &&
          cat.name &&
          cat.name.toLowerCase() === categoryParam.toLowerCase()
      );

      if (matchingCategory) {
        setSelectedCategories([matchingCategory.name]);
      }
    }
  }, [location.search, categoryData]);

  // Filter and paginate data
  useEffect(() => {
    if (!blogData?.data?.result) return;

    let filtered = blogData.data.result;

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (blog) =>
          blog && blog.category && selectedCategories.includes(blog.category)
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (blog) =>
          blog?.title?.toLowerCase()?.includes(term) ||
          blog?.category?.toLowerCase()?.includes(term)
      );
    }

    setFilteredData(filtered);
    setPage(1); // Reset to first page when filters change
  }, [blogData, selectedCategories, searchTerm]);

  const handleCategoryChange = (category) => {
    if (!category) return;
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );

    // Update URL when category filter changes
    const queryParams = new URLSearchParams(location.search);
    if (!prev.includes(category)) {
      queryParams.set("category", category);
    } else {
      queryParams.delete("category");
    }

    // Update the URL without refreshing the page
    window.history.replaceState(
      {},
      "",
      `${location.pathname}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  if (blogLoading || categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (blogError || categoryError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {blogFetchError?.message || "Something went wrong"}
      </div>
    );
  }

  const categories = categoryData?.data?.result || [];
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const currentItems = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const handleShareClick = (e, blog) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Modify the BlogandCareerBox component to use slugs
  const BlogandCareerBoxWithSlugs = ({ blogData }) => {
    const Images = import.meta.env.VITE_IMAGE_BASE_URL;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogData.length > 0 ? (
          blogData.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg relative transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Use Link with slug for navigation */}
              <Link
                to={`/blogdetailpage/${blog.slug}`}
                className=" flex flex-col h-fit justify-between "
              >
                <div className="relative group h-fit overflow-hidden">
                  {blog.views !== "0" && (
                    <div className="absolute h-fit p-1 w-fit px-2 rounded-full bg-white hidden top-2 right-2 group-hover:flex items-center justify-center gap-2 text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span className="text-black">{blog.views}</span>
                    </div>
                  )}
                  <img
                    className="w-full h-40 mx-auto object-cover rounded-t-xl"
                    src={`${Images}/${blog?.thumbnail}`}
                    alt={blog.title}
                  />
                </div>

                <div className="">
                  <div className="p-4">
                    <h3 className="text-lg  h-[4rem] font-semibold text-gray-800 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p
                      className="text-sm h-[4rem] text-gray-600 mt-2  overflow-hidden  line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    ></p>
                  </div>
                  <div className="px-4 pb-4 mt-2 flex flex-col  gap-4 justify-between items-start h-full ">
                    {blog.category && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {blog.category}
                      </span>
                    )}
                    <div className="flex items-center w-full justify-between gap-4">
                      <button className="bg-[#b82025] text-white py-2 px-4 rounded-lg text-sm hover:bg-red-700 transition-all">
                        Read More
                      </button>
                      <div
                        className="z-50 "
                        onClick={(e) => handleShareClick(e, blog)}
                      >
                        <SocialShare
                          title={blog.title}
                          url={`${window.location.origin}/blogdetailpage/${blog.slug}`}
                          contentType="blog"
                          className="z-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-10">
            No blogs found matching your criteria.
          </div>
        )}
      </div>
    );
  };

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`px-3 py-1 rounded-md ${
            page === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#b82025] text-white hover:bg-red-700"
          }`}
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 rounded-md hover:bg-gray-200"
            >
              1
            </button>
            {startPage > 2 && <span>...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded-md ${
              page === number ? "bg-[#b82025] text-white" : "hover:bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 rounded-md hover:bg-gray-200"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`px-3 py-1 rounded-md ${
            page === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#b82025] text-white hover:bg-red-700"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <PageBanner pageName="Blog" currectPage="blog" />

      {/* Filter button for mobile */}
      <button
        className="mx-[20px] mt-[30px] z-[500] bg-[#b82025] text-white rounded-lg px-4 py-2 shadow-lg md:hidden"
        onClick={() => setIsFilterOpen(true)}
      >
        Filters
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[10001] flex transition-opacity duration-300 ${
          isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-3/4 bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="text-gray-800 font-bold text-xl mb-4"
            onClick={() => setIsFilterOpen(false)}
          >
            X
          </button>
          <h3 className="text-lg font-semibold mb-6">Filter by Category</h3>
          <div className="space-y-4">
            {categories.map(
              (category) =>
                category && (
                  <label
                    key={category._id}
                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer transition-all duration-200"
                  >
                    <input
                      type="checkbox"
                      value={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                      className="form-checkbox h-5 w-5 text-red-500"
                    />
                    <span className="text-base font-medium">
                      {category.name}
                    </span>
                  </label>
                )
            )}
          </div>
        </div>
        <div
          className="flex-grow cursor-pointer"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      </div>

      {/* Main Content */}
      <div
        className={`flex px-[4vw] pb-[2vw] mt-10 ${
          isFilterOpen ? "pointer-events-none" : ""
        }`}
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md sticky top-20 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchTerm}
            />
          </div>
          <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3">
            {categories.map(
              (category) =>
                category && (
                  <label
                    key={category._id}
                    className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onChange={() => handleCategoryChange(category.name)}
                    />
                    {category.name}
                  </label>
                )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-3/4 pl-6">
          {/* Display selected categories as red badges */}
          <div className="mb-4">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="inline-block bg-[#b82025] text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
              >
                {category}
              </span>
            ))}
          </div>
          <BlogandCareerBoxWithSlugs blogData={currentItems || []} />
          <Pagination />
        </div>
      </div>

      <PopularCourses />
      <HighRatedCareers />
      <div className="flex max-sm:flex-col gap-2 items-center">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

// Export the ID mapping for use in other components
export const blogIdMap = blogIdMapStore;
export default Blogpage;
