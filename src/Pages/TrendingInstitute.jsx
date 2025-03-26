import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import rupee from "../assets/Images/rupee.png";
import CustomButton from "../Ui components/CustomButton";
import {
  alltrendingInstitute,
  allbestRatedInstitute,
  getInstituteById,
  trendingInstitute,
} from "../ApiFunctions/api";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import BlogComponent from "../Components/BlogComponent";
import HighRatedCareers from "../Components/HighRatedCareers";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const TrendingInstitute = () => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Initialize window.instituteIdMap from localStorage on component mount
  useEffect(() => {
    if (!window.instituteIdMap) {
      try {
        const storedInstituteIdMap = JSON.parse(
          localStorage.getItem("instituteIdMap") || "{}"
        );
        window.instituteIdMap = storedInstituteIdMap;
      } catch (error) {
        console.error("Error loading instituteIdMap from localStorage:", error);
        window.instituteIdMap = {};
      }
    }
  }, []);

  // Batch update the ID mapping when data arrives
  const updateIdMapping = (institutes) => {
    let hasChanges = false;

    institutes.forEach((institute) => {
      if (
        institute.slug &&
        institute._id &&
        !window.instituteIdMap[institute.slug]
      ) {
        window.instituteIdMap[institute.slug] = institute._id;
        hasChanges = true;
      }
    });

    // Only update localStorage if there are actual changes
    if (hasChanges) {
      localStorage.setItem(
        "instituteIdMap",
        JSON.stringify(window.instituteIdMap)
      );
    }
  };

  // Helper function to get URL for display - consistent with other components
  const getInstituteUrl = (institute) => {
    // Prefer slugs for SEO, fall back to IDs
    return institute?.slug
      ? `/institute/${institute.slug}`
      : `/institute/${institute?._id}`;
  };

  const { data, isLoading, isError } = useQuery(
    ["institutes"],
    () => alltrendingInstitute(),
    {
      enabled: true,
      onSuccess: (data) => {
        const institutes = data.data?.result || [];
        setContent(institutes);

        // Update ID mapping
        if (institutes.length > 0) {
          updateIdMapping(institutes);
        }
      },
    }
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = content.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(content.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Institutes</h2>
          <p>Unable to fetch trending institutes. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No trending institutes available
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Trending Institutes</h1>
          <p className="text-xl">
            Discover the most popular and in-demand educational institutions
            that are making waves in the academic world
          </p>
        </div>

        <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold">Trending Institutes</h3>
            <p className="text-gray-600">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, content.length)} of {content.length}{" "}
              institutes
            </p>
          </div>

          <div className="boxWrapper w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((institute, index) => (
              <Link
                to={getInstituteUrl(institute)}
                key={institute._id || index}
                className="box shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="imageContainer h-48 overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={
                      institute.thumbnailImage
                        ? `${Images}/${institute.thumbnailImage}`
                        : cardPhoto
                    }
                    alt="boxphoto"
                  />
                </div>
                <div className="textContainer p-4">
                  <h3 className="text-xl md:text-xl lg:text-2xl font-bold text-[#0B104A] mb-2">
                    {institute.instituteName}
                  </h3>
                  <div className="description text-gray-700 mb-3">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: institute.about
                          ? institute.about.slice(0, 100) + "..."
                          : "No description available",
                      }}
                    />
                  </div>
                  {/* {institute.maxFees && (
                                        <h3 className='flex items-center mt-2 text-2xl font-bold text-[#000000c4]'>
                                            <img className='h-5 mt-1 opacity-70' src={rupee} alt="rupee" />
                                            {institute.maxFees}
                                        </h3>
                                    )} */}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination flex justify-center mt-10">
              <ul className="flex space-x-2">
                <li>
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((number) => (
                  <li key={number + 1}>
                    <button
                      onClick={() => paginate(number + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === number + 1
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <BlogComponent />
        <HighRatedCareers />
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default TrendingInstitute;
