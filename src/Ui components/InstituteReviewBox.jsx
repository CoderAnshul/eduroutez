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
          {truncateText(review, 140)}
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
        <div className="fixed inset-0 z-[1000] flex items-center h-dvh justify-center bg-black bg-opacity-50">
          <div className="bg-white relative rounded-lg shadow-lg p-6 max-w-lg w-full">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              ✖
            </button>
            
            {/* Reviewer Info */}
            <h4 className="font-bold text-gray-800 mb-2">{reviewerName}</h4>
            {/* <p className="text-xs text-gray-500 mb-4">
              {designation} {year && `| ${year}`}
            </p> */}
            <p className="text-sm text-gray-700 mb-4 break-words">{review}</p>
          

            {/* Suggestions */}
            
            <h5 className="font-bold text-gray-800 mb-2">placement
            </h5>
            <p className='text-sm text-gray-700 mb-4 break-words'>{placementDescription
            }</p>
            
            <h5 className="font-bold text-gray-800 mb-2">Faculty</h5>
            <p className='text-sm text-gray-700 mb-4 break-words'>{facultyDescription
            }</p>
            
            <h5 className="font-bold text-gray-800 mb-2">Campus</h5>
            <p className='text-sm text-gray-700 mb-4 break-words'>{campusLifeDescription}</p>

            {/* Course Ratings */}
            {/* {ratingCategories.some(category => courseRatings[category]) ? ( */}
              <>
                <h5 className="font-semibold text-gray-800 mb-2">Course Ratings</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {allRatings.map((key) => {
                    
                    return  (
                      <li key={key}>
                        <span className="font-medium">{key.name}: </span>
                        <Rating 
                          className="!text-sm" 
                          name={key.stars} 
                          value={key.stars} 
                          precision={0.1} 
                          readOnly 
                        />
                      </li>
                    ) 
                  })}
                </ul>
              </>
            {/* ) : (
              <p className="text-sm text-gray-500">No course ratings available.</p>
            )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default InstituteReviewBox;