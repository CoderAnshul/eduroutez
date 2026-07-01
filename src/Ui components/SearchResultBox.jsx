import React from "react";

import { useState } from "react";
import SafeImage from "./SafeImage";
import CustomButton from "./CustomButton";
import serachBoximg from "../assets/Images/serachBoximg.jpg";
import rupee from "../assets/Images/rupee.png";
import badge from "../assets/Images/badge.png";
import cashhand from "../assets/Images/cashhand.png";
import checklist from "../assets/Images/checklist.png";
import { addToWishlist } from "../ApiFunctions/api";
import axiosInstance from "../ApiFunctions/axios";
import { MapPin, Building } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const SearchResultBox = ({ institute, url, className = "" }) => {
  console.log("Institute:", institute);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();

  const [isWishlisted, setIsWishlisted] = useState(
    institute.wishlist && institute.wishlist.includes(userId)
  );
  const baseURL = import.meta.env.VITE_BASE_URL;
  const Image = import.meta.env.VITE_IMAGE_BASE_URL;

  // Get the correct URL for the institute (using slug if available)
  const getInstituteUrl = () => {
    // If a URL is provided from parent component, use it
    if (url) return url;

    // Otherwise, fall back to slug-based URL if available, or ID-based URL as last resort
    return institute?.slug
      ? `/institute/${institute.slug}`
      : `/institute/${institute?._id}`;
  };

  const instituteUrl = getInstituteUrl();

  const handleAddToWishlist = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();

    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // Only require a valid access token and userId to allow wishlist actions.
    // Some login flows may not set a refresh token in localStorage immediately,
    // causing authenticated users to be incorrectly redirected to login.
    if (!userId || !accessToken) {
      navigate("/login", { state: { backgroundLocation: location } });
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      };
      if (refreshToken) headers["x-refresh-token"] = refreshToken;

      const response = await addToWishlist({
        instituteId: institute._id,
        customHeaders: headers,
      });
      const responseMessage = String(
        response?.message || response?.data?.message || ""
      ).toLowerCase();

      if (responseMessage.includes("removed")) {
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
      } else if (responseMessage.includes("added")) {
        setIsWishlisted(true);
        toast.success("Added to wishlist");
      } else {
        // Fallback for inconsistent API response text.
        setIsWishlisted((prev) => !prev);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Unable to update wishlist right now");
    }
  };

  const hasWishlistFeature = true;

  const overallRating =
    institute?.reviews?.length > 0
      ? institute?.reviews.reduce(
        (sum, review) =>
          sum +
          (review.placementStars || 0) +
          (review.campusLifeStars || 0) +
          (review.facultyStars || 0) +
          (review.suggestionsStars || 0),
        0
      ) / (institute?.reviews.length * 4 || 1)
      : 0;
  console.log("h", isNaN(overallRating) ? 3 : overallRating);

  const handleDownloadBrochure = async () => {
    // Guard: don't attempt download if brochure is not present
    const hasBrochure = Boolean(
      institute?.brochure ||
      institute?.brochureUrl ||
      institute?.brochure_link ||
      institute?.brochureFile ||
      institute?.brochureName ||
      institute?.hasBrochure ||
      institute?.brochureUploaded
    );
    if (!hasBrochure) {
      toast.info("Brochure not available");
      return;
    }
    try {
      const response = await axiosInstance.get(
        `${baseURL}/download-bruchure/${institute._id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
          responseType: "blob",
        }
      );

      // Get content type from response
      const contentType = response.headers["content-type"];

      // Set file extension and type based on content type
      let fileExtension;
      let mimeType;

      if (contentType.includes("pdf")) {
        fileExtension = "pdf";
        mimeType = "application/pdf";
      } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        fileExtension = "jpg";
        mimeType = "image/jpeg";
      } else if (contentType.includes("png")) {
        fileExtension = "png";
        mimeType = "image/png";
      } else {
        // Default to PDF if content type is not recognized
        fileExtension = "pdf";
        mimeType = "application/pdf";
      }

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `brochure.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);

      toast.success("Brochure downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download brochure");
    }
  };

  return (
    <>
      <div
        className={`border rounded-lg shadow-md p-4 flex flex-col space-y-4 md:space-y-0 md:space-x-6 bg-white mb-2 ${className}`}
      >
        {/* Left Section - Image */}
        <div className="flex justify-between flex-col gap-3"></div>
        <div className="flex justify-between flex-col md:flex-row gap-3">
        {/* Make image clickable */}
        <div className="relative w-full md:w-2/6 !ml-0 block">
          {institute.admissionOpen && (
            <div className="absolute top-2 left-2 z-20 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              Admission Open
            </div>
          )}
          <Link to={instituteUrl} className="group block">
            <SafeImage
              src={
                institute.thumbnailImage
                  ? `${Image}/${institute.thumbnailImage}`
                  : serachBoximg
              }
              alt="Institute Thumbnail"
              title={institute.instituteName}
              className="rounded-lg object-cover w-full h-44 group-hover:opacity-90 transition-opacity duration-200"
              style={{ cursor: 'pointer' }}
            />
          </Link>

          {hasWishlistFeature && (
            <button
              className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md pointer-events-auto transition-all duration-200 ${isWishlisted ? "bg-red-50 shadow-red-200" : "bg-white hover:bg-gray-50"}`}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={handleAddToWishlist}
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={isWishlisted ? 0 : 1.5}
                stroke={isWishlisted ? "none" : "currentColor"}
                fill={isWishlisted ? "#dc2626" : "none"}
                className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? "drop-shadow-sm scale-110" : "hover:scale-110"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Right Section - Details */}
        <div className="w-full md:w-3/4 flex flex-col">
          <div className="flex justify-between items-center">
            {/* Make title clickable */}
            <Link to={instituteUrl} className="text-xl font-medium hover:no-underline hover:text-red-600" style={{ cursor: 'pointer' }}>
              {institute.instituteName}
            </Link>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            {overallRating !== 0 && (
              <span className="flex items-center">
                <span className="text-yellow-500">★</span>
                {overallRating}
              </span>
            )}
            {institute?.reviews?.length > 0 && (
              <span>({institute.reviews.length})</span>
            )}
            <span className="flex items-center gap-2 text-gray-600">
              {institute.state?.name && (
                <>
                  <MapPin size={16} className="text-gray-500" />
                  <span>{institute.state?.name}</span>
                </>
              )}
              {institute.organisationType && (
                <>
                  <Building size={16} className="text-gray-500" />
                  <span>{institute.organisationType}</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-4 mt-5 mb-2">
            {institute.minFees && institute.maxFees && (
              <span className="text-gray-700 font-medium md:text-xl text-xs sm:text-sm flex items-center gap-1">
                <img src={rupee} className="h-4 opacity-75 mt-1" alt="rupee" />
                {institute.minFees}-{institute.maxFees}
              </span>
            )}
            <span className="flex items-center font-medium md:text-xl text-xs sm:text-sm space-x-1">
              <img src={badge} alt="AICTE" className="h-4 opacity-75 mt-1" />
              <span>{institute.affiliation || "AICTE"}</span>
            </span>
            {institute.highestPackage && (
              <span className="text-gray-700 flex items-center gap-1 font-medium text-xs sm:text-sm md:text-xl">
                <img
                  src={cashhand}
                  alt="cash"
                  className="h-4 opacity-75 mt-1"
                />
                {institute.highestPackage}
              </span>
            )}
            {institute.examAccepted && (
              <span className="text-gray-700 flex items-center gap-1 font-medium text-xs sm:text-sm md:text-xl relative group">
                <img
                  src={checklist}
                  alt="checklist"
                  className="h-4 opacity-75 mt-1"
                />
                <span>
                  {institute.examAccepted.split(",")[0]}
                  {institute.examAccepted.split(",").length > 1 && (
                    <span className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer ml-1">
                      + {institute.examAccepted.split(",").length - 1} more
                    </span>
                  )}
                </span>
                {institute.examAccepted.split(",").length > 1 && (
                  <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]">
                    <div className="max-h-[200px] overflow-y-auto">
                      {institute.examAccepted
                        .split(",")
                        .slice(1)
                        .map((exam, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            {exam.trim()}
                          </div>
                        ))}
                    </div>
                  </span>
                )}
              </span>
            )}
          </div>

          {institute.about && institute.about !== "0" && institute.about !== 0 ? (
            <p
              className="text-sm text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: institute.about }}
            />
          ) : (
            <p className="text-sm text-gray-600 line-clamp-3">
              No information available
            </p>
          )}
          <div className="flex justify-between items-center flex-wrap gap-3 !mt-8 md:!mt-3 text-sm text-blue-600">
            <div className="space-x-4">
              {/* Links updated below to use slug URLs */}
            </div>
          </div>
        </div>
      </div>
        <div className="flex space-x-4 justify-center md:justify-between gap-4 items-center flex-wrap">
          <div className="flex justify-between items-center flex-wrap gap-3 mt-3 text-sm text-blue-600">
            <div className="space-x-4">
              <Link to={`${instituteUrl}`} className="hover:no-underline hover:text-red-600">
                Fees and Courses
              </Link>
              <Link to={`${instituteUrl}`} className="hover:no-underline hover:text-red-600">
                Admission
              </Link>
              <Link to={`${instituteUrl}`} className="hover:no-underline hover:text-red-600">
                Placement
              </Link>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-4 !ml-0">
            {(institute?.brochure ||
              institute?.brochureUrl ||
              institute?.brochure_link ||
              institute?.brochureFile ||
              institute?.brochureName ||
              institute?.hasBrochure ||
              institute?.brochureUploaded) && (
              <button
                className="bg-[#b82025] text-white px-4 py-2 rounded-lg"
                onClick={handleDownloadBrochure}
              >
                Download Brochure
              </button>
            )}
            <Link to={instituteUrl} className="!bg-gray-100 !text-red-600 px-4 py-2 rounded-lg border border-red-600 !text-md viewmorebtn bg-[#b82025] text-sm text-white w-32 whitespace-nowrap transition-transform transform active:scale-95 hover:scale-105 flex items-center justify-center" style={{ textDecoration: 'none' }}>
              View more
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResultBox;
