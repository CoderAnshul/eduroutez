import React, { useState, useCallback, useMemo } from 'react';
import Rating from '@mui/material/Rating';

const InstituteReviewBox = ({ 
  reviewerName = 'Anonymous', 
  designation = 'Not Specified', 
  year = '',
  rating = 0, 
  review = 'No review text available.',
  courseRatings = {} 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized modal toggle function
  const toggleModal = useCallback(() => {
    setIsModalOpen((prevState) => !prevState);
  }, []);

  // Memoized text truncation with null/undefined handling
  const truncateText = useCallback((text, maxLength) => {
    if (!text || typeof text !== 'string') return 'No text available.';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }, []);

  // Memoized course ratings categories
  const ratingCategories = useMemo(() => [
    'courseContent', 'faculty', 'placement', 'campus', 'fees'
  ], []);

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
              <p className="text-xs text-gray-500">
                {designation} {year && `| ${year}`}
              </p>
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
              {Number(rating).toFixed(1) || 'N/A'}
            </span>
          </div>
        </div>

        {/* Review */}
        <p className="text-gray-700 text-sm leading-5">
          {truncateText(review, 100)}
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
            <p className="text-xs text-gray-500 mb-4">
              {designation} {year && `| ${year}`}
            </p>
            <p className="text-sm text-gray-700 mb-4">{review}</p>

            {/* Course Ratings */}
            {ratingCategories.some(category => courseRatings[category]) ? (
              <>
                <h5 className="font-semibold text-gray-800 mb-2">Course Ratings</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {ratingCategories.map((key) => {
                    const ratingValue = Number(courseRatings[key]) || 0;
                    return ratingValue > 0 ? (
                      <li key={key}>
                        <span className="font-medium">{formatCategoryName(key)}: </span>
                        <Rating 
                          className="!text-sm" 
                          name={key} 
                          value={ratingValue} 
                          precision={0.1} 
                          readOnly 
                        />
                      </li>
                    ) : null;
                  }).filter(Boolean)}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-500">No course ratings available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InstituteReviewBox;