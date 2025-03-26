import React, { useState, useEffect } from "react";
import PageBanner from "../Ui components/PageBanner";
import CustomButton from "../Ui components/CustomButton";
import { useQuery } from "react-query";
import { careers, careerCategories } from "../ApiFunctions/api";
import PopularCourses from "../Components/PopularCourses";
import BlogComponent from "../Components/BlogComponent";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import axios from "axios";
import { Link } from "react-router-dom";
import Promotions from "./CoursePromotions";
import SocialShare from "../Components/SocialShare";

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const fetchImage = async (imagePath) => {
  try {
    const response = await axios.get(`${Images}/${imagePath}`, {
      responseType: "blob",
    });
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

const Careerspage = () => {
  const [imageUrls, setImageUrls] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allCareerData, setAllCareerData] = useState([]);
  const [careerIdMap, setCareerIdMap] = useState({});
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(6); // Number of items to show initially
  const itemsPerPage = 6; // Number of items to load each time "Load More" is clicked

  // Initialize careerIdMap from localStorage
  useEffect(() => {
    try {
      const storedCareerIdMap = JSON.parse(
        localStorage.getItem("careerIdMap") || "{}"
      );
      setCareerIdMap(storedCareerIdMap);
    } catch (error) {
      console.error("Error loading careerIdMap from localStorage:", error);
      setCareerIdMap({});
    }
  }, []);

  // Fetch all career data for the first page
  const {
    data: initialCareerData,
    isLoading: isLoadingInitial,
    isError,
    error,
  } = useQuery(["careers", 1], () => careers(1), { enabled: true });

  // Effect to load all pages of data once we know how many pages there are
  useEffect(() => {
    if (initialCareerData && initialCareerData.data.totalPages > 0) {
      setTotalPages(initialCareerData.data.totalPages);

      // Add first page data to allCareerData
      const firstPageData = initialCareerData.data.result || [];
      setAllCareerData(firstPageData);

      // Update careerIdMap with first page data
      const updatedCareerIdMap = { ...careerIdMap };
      firstPageData.forEach((career) => {
        if (career.slug) {
          updatedCareerIdMap[career.slug] = career._id;
        }
      });
      setCareerIdMap(updatedCareerIdMap);
      localStorage.setItem("careerIdMap", JSON.stringify(updatedCareerIdMap));

      // If there are more pages, fetch them all
      if (initialCareerData.data.totalPages > 1) {
        fetchAllPages(initialCareerData.data.totalPages);
      }
    }
  }, [initialCareerData]);

  // Function to fetch all pages of career data
  const fetchAllPages = async (totalPageCount) => {
    setIsLoadingAllData(true);

    try {
      // Start from page 2 since we already have page 1
      const pagePromises = [];
      for (let pageNum = 2; pageNum <= totalPageCount; pageNum++) {
        pagePromises.push(careers(pageNum));
      }

      const responses = await Promise.all(pagePromises);

      // Extract data and update state
      const newData = responses.flatMap(
        (response) => response.data.result || []
      );

      // Update careerIdMap with all new data
      const updatedCareerIdMap = { ...careerIdMap };
      newData.forEach((career) => {
        if (career.slug) {
          updatedCareerIdMap[career.slug] = career._id;
        }
      });

      // Save updated map to state and localStorage
      setCareerIdMap(updatedCareerIdMap);
      localStorage.setItem("careerIdMap", JSON.stringify(updatedCareerIdMap));

      // Update career data (append new data to existing first page data)
      setAllCareerData((prevData) => [...prevData, ...newData]);
    } catch (error) {
      console.error("Error fetching all career data:", error);
    } finally {
      setIsLoadingAllData(false);
    }
  };

  const handleShareClick = (e, blog) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation(); // Stop event from bubbling up
    // Any additional share handling logic can go here
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await careerCategories();
        const extractedCategories = response.data.result.map((category) =>
          typeof category === "object"
            ? category.name || category.category
            : category
        );
        setCategories(extractedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Combined filtering function
  const getFilteredData = () => {
    return allCareerData.filter((career) => {
      const matchesSearch =
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(career.category);
      return matchesSearch && matchesCategory;
    });
  };

  useEffect(() => {
    const loadImages = async () => {
      const filteredData = getFilteredData();
      if (filteredData) {
        // Only load images for currently displayed items to improve performance
        const visibleItems = filteredData.slice(0, displayedItems);

        const imagePromises = visibleItems.map(async (career) => {
          if (!imageUrls[career.thumbnail]) {
            const url = await fetchImage(career.thumbnail);
            return { [career.thumbnail]: url };
          }
          return null;
        });

        const results = await Promise.all(imagePromises);
        const newUrls = results.reduce((acc, result) => {
          return result ? { ...acc, ...result } : acc;
        }, {});

        setImageUrls((prev) => ({ ...prev, ...newUrls }));
      }
    };

    loadImages();

    return () => {
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [allCareerData, searchTerm, selectedCategories, displayedItems]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
    // Reset displayed items when filtering changes
    setDisplayedItems(itemsPerPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Reset displayed items when search changes
    setDisplayedItems(itemsPerPage);
  };

  const loadMore = () => {
    setDisplayedItems((prev) => prev + itemsPerPage);
  };

  if (
    (isLoadingInitial && !allCareerData.length) ||
    (isLoadingAllData && !allCareerData.length)
  ) {
    return <p className="text-center py-16">Loading careers...</p>;
  }

  if (isError)
    return <p className="text-center py-16">Error: {error.message}</p>;

  const filteredData = getFilteredData();
  const visibleData = filteredData.slice(0, displayedItems);

  return (
    <>
      <PageBanner
        pageName="Career Opportunity"
        currectPage="career opportunity"
      />

      <button
        className="mx-[20px] mt-[30px] z-[500] bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg md:hidden"
        onClick={() => setIsFilterOpen(true)}
      >
        Filters
      </button>

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
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="space-y-4">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer transition-all duration-200"
              >
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="text-base font-medium">{category}</span>
              </label>
            ))}
          </div>
        </div>
        <div
          className="flex-grow cursor-pointer"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      </div>

      <div
        className={`flex px-[4vw] pt-5 mb-14 ${
          isFilterOpen ? "pointer-events-none" : ""
        }`}
      >
        <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md sticky top-20 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
          {isLoadingAllData && (
            <p className="mt-4 text-blue-600">Loading all career data...</p>
          )}
          <p className="mt-4 text-gray-600">
            Found {filteredData.length} careers
          </p>
        </div>

        <div className="w-full md:w-3/4 px-6">
          {isLoadingAllData && !visibleData.length ? (
            <p className="text-center py-8">Loading all career data...</p>
          ) : visibleData.length === 0 ? (
            <p className="text-center py-8">
              No careers found matching your criteria.
            </p>
          ) : (
            <div className="flex flex-wrap justify-start gap-6">
              {visibleData.map((career) => (
                <Link
                  key={career._id}
                  to={`/detailpage/${career.slug || career._id}`}
                  className="group bg-white min-h-[440px] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer
                                relative  max-w-sm flex-1 flex flex-col justify-between min-w-[300px] bg-white/50 rounded-lg shadow-lg overflow-hidden"
                >
                  <div>
                    <div className="relative group h-48">
                      {career.views !== "0" && (
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
                          <span className="text-black">{career.views}</span>
                        </div>
                      )}
                      {!imageUrls[career.thumbnail] ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <p>Loading image...</p>
                        </div>
                      ) : (
                        <img
                          src={imageUrls[career.thumbnail]}
                          alt={career.title}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      )}
                    </div>

                    <div className="px-4 mt-4 ">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {career.title}
                      </h3>
                      <p
                        className="text-sm text-gray-600 mt-2"
                        dangerouslySetInnerHTML={{
                          __html:
                            career.description
                              .split(" ")
                              .slice(0, 25)
                              .join(" ") +
                            (career.description.split(" ").length > 25
                              ? "..."
                              : ""),
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between p-4">
                    <div className="inline-block">
                      <CustomButton
                        text="View More"
                        to={`/detailpage/${career.slug || career._id}`}
                      />
                    </div>
                    <div onClick={(e) => handleShareClick(e, career)}>
                      <SocialShare
                        title={career.title}
                        url={`${window.location.origin}/detailpage/${
                          career.slug || career._id
                        }`}
                        contentType="career"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="flex mt-10 justify-center">
            {page < totalPages && filteredData.length > 0 && (
              <button
                className="bg-[#b82025] text-white rounded-lg px-4 py-2 shadow-lg"
                onClick={loadMore}
              >
                Load More
              </button>
            )}
          </div>
        </div>
      </div>

      <PopularCourses />
      <div className="w-full items-center max-w-4xl h-fit mx-auto">
        <Promotions location="CAREER_PAGE" className="h-[90px]" />
      </div>
      <BlogComponent />
      <div className="flex gap-2 flex-col sm:flex-row items-center">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default Careerspage;
