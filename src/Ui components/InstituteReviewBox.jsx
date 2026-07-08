import React, { useState, useCallback, useMemo } from 'react';
import Rating from '@mui/material/Rating';

const InstituteReviewBox = ({ 

  reviewerName, 
  designation , 
  year ,
  campusLifeDescription,
  facultyDescription,
  placementDescription,
  review ,
  courseRatings,
  placementStars,
  campusLifeStars,
  facultyStars,
  suggestionsStars
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
// console.log(rating)
  // Memoized modal toggle function
  const toggleModal = useCallback(() => {
    setIsModalOpen((prevState) => !prevState);
  }, []);

  // Memoized text truncation with null/undefined handling
  const truncateText = useCallback((text, maxLength) => {
    if (!text || typeof text !== 'string') return 'No text available.';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }, []);


  // Calculate average of all star ratings
const calculateAverageRating = () => {
  // Get all valid ratings (non-null, non-undefined, numeric values)
  const validRatings = [
    placementStars,
    campusLifeStars,
    facultyStars,
    suggestionsStars
  ].filter(rating => rating !== null && rating !== undefined && !isNaN(Number(rating)));
  
  // If no valid ratings, return 0
  if (validRatings.length === 0) return 0;
  
  // Calculate the sum and divide by number of valid ratings
  const sum = validRatings.reduce((total, current) => total + Number(current), 0);
  return sum / validRatings.length;
};

const rating = calculateAverageRating();

  // Memoized course ratings categories
  const ratingCategories = useMemo(() => [
    'courseContent', 'faculty', 'placement', 'campus', 'fees'
  ], []);

  const allRatings=[
    {
    name: 'faculty',
    stars : facultyStars
    },
    {
    name: 'placement',
    stars : placementStars
    },
    {
    name: 'campus',
    stars : campusLifeStars
    },
    {
    name: 'courseContent',
    stars : suggestionsStars
    },
]

  // Format category name
  const formatCategoryName = useCallback((key) => 
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  , []);

  return (
    <>
      {/* Review Box */}
      <div className="border min-w-[285px] rounded-lg max-w-sm md:max-w-md flex-1 shadow-sm p-4 flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <h4 className="font-bold text-gray-800">{reviewerName}</h4>
              {/* <p className="text-xs text-gray-500">
                {designation} {year && `| ${year}`}
              </p> */}
            </div>
          </div>

          
          <div className="flex items-center gap-1">
            <Rating 
              className="!text-sm" 
              name="read-only" 
              value={Number(rating) || 0} 
              precision={0.1} 
              readOnly 
            />
            <span className="text-sm font-medium text-gray-600">
              {Number(rating) || 0}
            </span>
          </div>
        </div>

        {/* Review */}
        <p className="text-gray-700 text-sm leading-5 break-words">
          {review || 'No text available.'}
        </p>

        {/* Read More */}
        <button
          onClick={toggleModal}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Read More
        </button>
        </div>
                
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-6">
          <div className="bg-white relative rounded-lg shadow-lg p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={toggleModal}
            >
              ✖
            </button>
            
            <h4 className="font-bold text-gray-800 mb-2 pr-8">{reviewerName}</h4>
            <p className="text-sm text-gray-700 mb-4 break-words">{review}</p>
          
            <div className="space-y-3">
              <div>
                <h5 className="font-bold text-gray-800 mb-1">Placement</h5>
                <p className="text-sm text-gray-700 break-words">{placementDescription}</p>
              </div>
              
              <div>
                <h5 className="font-bold text-gray-800 mb-1">Faculty</h5>
                <p className="text-sm text-gray-700 break-words">{facultyDescription}</p>
              </div>
              
              <div>
                <h5 className="font-bold text-gray-800 mb-1">Campus</h5>
                <p className="text-sm text-gray-700 break-words">{campusLifeDescription}</p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Course Ratings</h5>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {allRatings.map((item) => (
                    <div key={item.name} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium text-xs sm:text-sm capitalize">{item.name}</span>
                      <Rating 
                        className="!text-sm" 
                        name={item.name} 
                        value={Number(item.stars) || 0} 
                        precision={0.1} 
                        readOnly 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstituteReviewBox;