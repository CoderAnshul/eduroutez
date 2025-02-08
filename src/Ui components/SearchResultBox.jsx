import React, { useState } from "react";
import CustomButton from "./CustomButton";
import serachBoximg from "../assets/Images/serachBoximg.jpg";
import rupee from "../assets/Images/rupee.png";
import badge from "../assets/Images/badge.png";
import cashhand from "../assets/Images/cashhand.png";
import checklist from "../assets/Images/checklist.png";
import { addToWishlist } from '../ApiFunctions/api';
import axiosInstance from "../ApiFunctions/axios";
import { MapPin, Building } from 'lucide-react';

import { toast } from "react-toastify";

const SearchResultBox = ({ institute }) => {

  console.log('Institute:', institute);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL;
  const Image=import.meta.env.VITE_IMAGE_BASE_URL;


  const handleAddToWishlist = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const response = await addToWishlist(userId, institute._id, null, {
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': localStorage.getItem('accessToken'),
      'x-refresh-token': localStorage.getItem('refreshToken')  }
    }); // Assuming courseId is null for now
    if (response.message.includes('removed')) {
    setIsWishlisted(false);
    } else if (response.message.includes('added')) {
    setIsWishlisted(true);
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
  }
  };

  const hasWishlistFeature = institute.plan?.features?.some(feature => feature.key === 'WishList' && feature.value === 'Yes');


  const overallRating = institute.reviews.length > 0 
    ? institute?.reviews.reduce((sum, review) => sum + ( review.placementStars || 0) + 
      ( review.campusLifeStars || 0) + 
      ( review.facultyStars || 0) + 
      (review.suggestionsStars || 0), 0) / (institute?.reviews.length * 4 || 1)
    : 0;
console.log('h',isNaN(overallRating) ? 3 : overallRating)


  const handleDownloadBrochure = async () => {
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
      const contentType = response.headers['content-type'];
      
      // Set file extension and type based on content type
      let fileExtension;
      let mimeType;
      
      if (contentType.includes('pdf')) {
        fileExtension = 'pdf';
        mimeType = 'application/pdf';
      } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        fileExtension = 'jpg';
        mimeType = 'image/jpeg';
      } else if (contentType.includes('png')) {
        fileExtension = 'png';
        mimeType = 'image/png';
      } else {
        // Default to PDF if content type is not recognized
        fileExtension = 'pdf';
        mimeType = 'application/pdf';
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
    <div className="border rounded-lg shadow-md p-4 flex flex-col  space-y-4 md:space-y-0 md:space-x-6 bg-white mb-2">
      {/* Left Section - Image */}
      <div className="flex justify-between flex-col gap-3"></div>
        <div className="flex justify-between flex-col md:flex-row gap-3">
        <div className="relative w-full md:w-2/6 !ml-0">
          <img
            src={institute.thumbnailImage ? `${Image}/${institute.thumbnailImage}` : serachBoximg}
            alt="Institute Thumbnail"
            className="rounded-lg object-cover w-full h-44"
          />
          {hasWishlistFeature && (
            <button
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleAddToWishlist}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={isWishlisted ? "white" : "currentColor"}
                fill={isWishlisted ? "red" : "none"}
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-2.64 2.36-4.5 5-4.5 1.54 0 3.04.99 3.76 2.39h.48C13.95 4.99 15.46 4 17 4c2.64 0 5 1.86 5 4.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Right Section - Details */}
        <div className="w-full md:w-3/4 flex flex-col ">
                <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{institute.instituteName}</h3>
                </div>

                <div className="flex items-center space-x-3 text-sm text-gray-600">
                {overallRating !==0 && (
              <span className="flex items-center">
                <span className="text-yellow-500">★</span>{overallRating}
              </span>
            )}
                <span>{institute.reviews.length} Reviews</span>
                <span className="flex items-center gap-2 text-gray-600">
      <MapPin size={16} className="text-gray-500" />
      <span>{institute.state}</span>
      <span className="mx-1">•</span>
      <Building size={16} className="text-gray-500" />
      <span>{institute.organisationType}</span>
    </span>                </div>

                <div className="flex items-center space-x-4 mt-5 mb-2">
               {/* <span className="text-gray-700 font-medium md:text-xl text-xs sm:text-sm flex items-center gap-1">
                  <img src={rupee} className="h-4 opacity-75 mt-1" alt="rupee" />{institute.minFees || '300000'}-{institute.maxFees || 'onwards'}
                </span>*/}
                <span className="flex items-center font-medium md:text-xl text-xs sm:text-sm space-x-1">
                  <img src={badge} alt="AICTE" className="h-4 opacity-75 mt-1" />
                  <span>{institute.affiliation || 'AICTE'}</span>
                </span>
                <span className="text-gray-700 flex items-center gap-1 font-medium text-xs sm:text-sm md:text-xl">
                  <img src={cashhand} alt="cash" className="h-4 opacity-75 mt-1" />{institute.highestPackage || '10LPA'}
                </span>
                {institute.examAccepted && (
  <span className="text-gray-700 flex items-center gap-1 font-medium text-xs sm:text-sm md:text-xl relative group">
    <img src={checklist} alt="checklist" className="h-4 opacity-75 mt-1" />
    <span>
      {institute.examAccepted.split(',')[0]}
      {institute.examAccepted.split(',').length > 1 && (
        <span className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer ml-1">
          + {institute.examAccepted.split(',').length-1} more
        </span>
      )}
    </span>
    {institute.examAccepted.split(',').length > 1 && (
      <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]">
 
        <div className="max-h-[200px] overflow-y-auto">
          {institute.examAccepted.split(',').slice(1).map((exam, index) => (
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

                <p className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: institute.about }} />
          <div className="flex justify-between items-center flex-wrap gap-3 !mt-8 md:!mt-3 text-sm text-blue-600">
            <div className="space-x-4">
              <a href={`/institute/${institute._id}`} className="hover:underline">Fees and Courses</a>
              <a href={`/institute/${institute._id}`} className="hover:underline">Admission</a>
              <a href={`/institute/${institute._id}`} className="hover:underline">Placement</a>
            </div>
            <div className="flex space-x-4 justify-end">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={handleDownloadBrochure}>
                Download Brochure
              </button>
              <CustomButton to={`/institute/${institute._id}`} className='!bg-gray-100 !text-red-600 px-4 py-2 rounded-lg border border-red-600 !text-md ' text='View more'>
                View more
              </CustomButton>
          </div>
        </div>
    </div>
  </div>
</div>
  );
};

export default SearchResultBox;