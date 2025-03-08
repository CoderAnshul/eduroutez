import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Rating from "@mui/material/Rating";
import rupee from "../assets/Images/rupee.png";
import CustomButton from "../Ui components/CustomButton";
import { allbestRatedInstitute } from "../ApiFunctions/api";

const BestRatedInstitute = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Fetch institutes
  const { data, isLoading, isError } = useQuery(
    ["all-institutes"],
    () => allbestRatedInstitute(),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const institutes = data?.data || [];

        // Update ID mapping
        if (institutes.length > 0) {
          updateIdMapping(institutes);
        }
      },
    }
  );

  // Extract institutes from response
  const institutes = data?.data || [];

  // Paginate content client-side
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return institutes.slice(0, startIndex + itemsPerPage);
  }, [institutes, currentPage]);

  const totalPages = Math.ceil(institutes.length / itemsPerPage);

  // Load more handler
  const handleLoadMore = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Institutes</h2>
          <p>Unable to fetch institutes. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Best Rated Institutes</h1>
        <p className="text-xl">
          Discover top-rated educational institutions that can transform your
          academic journey
        </p>
      </div>

      {/* Institutes Grid */}
      {institutes.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No institutes found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedContent.map((institute, index) => (
              <Link
                key={institute._id || index}
                to={getInstituteUrl(institute)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Institute Image */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${
                      institute.thumbnailImage
                    }`}
                    alt={institute.instituteName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/fallback-institute.jpg"; // Fallback image
                    }}
                  />
                </div>

                {/* Institute Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {institute.instituteName}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {institute.about ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: institute.about }}
                      />
                    ) : (
                      "No description available"
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <div className="flex justify-center mt-10">
              <CustomButton
                text="Load More Institutes"
                onClick={handleLoadMore}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BestRatedInstitute;
