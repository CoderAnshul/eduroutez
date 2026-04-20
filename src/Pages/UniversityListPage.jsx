import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { bestRatedUniversityInstitutes } from "../ApiFunctions/api";


const ITEMS_PER_PAGE = 6;
const UniversityListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [universities, setUniversities] = useState([]);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const { data, isLoading, isError } = useQuery(
    ["best-rated-university-institutes"],
    bestRatedUniversityInstitutes,
    {
      refetchOnMount: "always",
      onSuccess: (data) => {
        setUniversities(data?.data || []);
      },
    }
  );

  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return universities.slice(0, startIndex + ITEMS_PER_PAGE);
  }, [universities, currentPage]);

  const totalPages = Math.ceil(universities.length / ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  if (isLoading) {
    return (
      <div className="universal-container py-8">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Best Rated Universities</h1>
          <p className="text-xl">Discover top-rated universities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Universities</h2>
          <p>Unable to fetch universities. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="universal-container py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Best Rated Universities</h1>
        <p className="text-xl">
          Discover top-rated universities that can transform your academic journey
        </p>
      </div>

      {/* Universities Grid */}
      {universities.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No universities found
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedContent.map((university, index) => (
              <Link
                key={university._id || index}
                to={university?.slug ? `/institute/${university.slug}` : `/institute/${university?._id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                aria-label={university.instituteName || university.name}
              >
                {/* University Image */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={university.thumbnailImage ? `${Images}/${university.thumbnailImage}` : "/fallback-institute.jpg"}
                    alt={university.instituteName || university.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/fallback-institute.jpg";
                    }}
                  />
                </div>

                {/* University Details */}
                <div className="!p-6">
                  <h2 className="text-xl md:text-xl lg:text-xl font-bold text-[#0B104A] antialiased leading-tight">
                    {university.instituteName || university.name}
                  </h2>
                  <p className="text-sm mt-2 mb-4 line-clamp-3">
                    {university.about ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: university.about }}
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
              <button
                onClick={handleLoadMore}
                className="bg-[#b82025] text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all"
              >
                Load More Universities
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UniversityListPage;
