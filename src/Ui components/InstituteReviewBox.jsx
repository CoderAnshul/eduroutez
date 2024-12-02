import React, { useState, useCallback } from 'react';
import Rating from '@mui/material/Rating';

const InstituteReviewBox = ({ reviewerName, designation, year, rating, review, courseRatings = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized modal toggle function to prevent unnecessary re-renders
  const toggleModal = useCallback(() => {
    setIsModalOpen((prevState) => !prevState);
  }, []);

  // Memoized text truncation to avoid re-calculations on every render
  const truncateText = useCallback((text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }, []);

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
                {designation} | {year}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Rating className="!text-sm" name="read-only" value={rating} precision={0.1} readOnly />
            <span className="text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
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
        <div className="fixed inset-0 z-[1000] flex items-center h-dvh  justify-center bg-black bg-opacity-50">
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
              {designation} | {year}
            </p>
            <p className="text-sm text-gray-700 mb-4">{review}</p>

            {/* Course Ratings */}
            {Object.keys(courseRatings).length > 0 ? (
              <>
                <h5 className="font-semibold text-gray-800 mb-2">Course Ratings</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {['courseContent', 'faculty', 'placement', 'campus', 'fees'].map((key) => (
                    <li key={key}>
                      <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: </span>
                      <Rating className="!text-sm" name={key} value={courseRatings[key] || 0} precision={0.1} readOnly />
                    </li>
                  ))}
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
