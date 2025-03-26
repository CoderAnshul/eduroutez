import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import rupee from "../assets/Images/rupee.png";
import CustomButton from "../Ui components/CustomButton";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { bestRatedInstitute } from "../ApiFunctions/api";

const BestRated = () => {
  const [content, setContent] = useState([]);
  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  const navigate = useNavigate();

  const handleViewMore = () => {
    console.log("Navigating to institutes");
    navigate("/institute");
  };

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
    ["best-rated-institutes"],
    () => bestRatedInstitute(),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        const institutes = data.data || [];
        setContent(institutes);

        // Update ID mapping
        if (institutes.length > 0) {
          updateIdMapping(institutes);
        }
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading best-rated institutes.
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No best-rated institutes available.
      </div>
    );
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold">Best Rated Institutes</h3>
        <button
          onClick={handleViewMore}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          View more
        </button>
      </div>

      <div className="boxWrapper w-full flex flex-col md:flex-row flex-wrap items-center gap-6">
        {content.length > 0 ? (
          content.slice(0, 3).map((institute, index) => {
            return (
              <Link
                to={getInstituteUrl(institute)}
                key={institute._id || index}
                className="box w-full text-black max-w-sm lg:max-w-[500px] shadow-lg"
              >
                <div className="imageContainer">
                  <img
                    className="h-full w-full object-cover"
                    src={
                      institute.thumbnailImage
                        ? `${Images}/${institute.thumbnailImage}`
                        : cardPhoto
                    }
                    alt="Institute"
                  />
                </div>
                <div className="textContainer p-4">
                  <h3 className="text-xl md:text-xl lg:text-xl font-bold text-[#0B104A]">
                    {institute.instituteName || "Institute Name Not Available"}
                  </h3>

                  <p className="text-sm mt-2">
                    {institute.about ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: institute.about.slice(0, 100) + "...",
                        }}
                      />
                    ) : (
                      "No information available"
                    )}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <p>No best-rated institutes available</p>
        )}
      </div>
    </div>
  );
};

export default BestRated;
