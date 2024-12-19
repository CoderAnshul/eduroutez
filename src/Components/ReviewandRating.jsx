import React, { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import InstituteReviewBox from '../Ui components/InstituteReviewBox';
import CustomButton from "../Ui components/CustomButton";

const ReviewandRating = ({ ratings, reviews, instituteData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize average rating calculation for the first 6 reviews
  const averageRating = useMemo(() => {
    return reviews.slice(0, 6).reduce((total, review) => total + review.rating, 0) / Math.min(reviews.length, 6);
  }, [reviews]);

  // Memoize toggle modal function
  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl sm:p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold">Overall Rating & Reviews</h3>

        {/* Overall Rating */}
        <div className="flex gap-5">
          <Box sx={{ '& > legend': { mt: 2 } }} className="flex items-center gap-2">
            <Rating className="!text-lg" name="read-only" value={4.1} readOnly />
            <h4 className="font-semibold opacity-75">4.1</h4>
          </Box>
          <h4 className="font-semibold opacity-75">(8 reviews)</h4>
        </div>

        {/* Category-wise Ratings */}
        <div className="flex gap-[2vw] flex-wrap justify-between sm:justify-normal mt-10">
          {ratings.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <h5 className="font-semibold text-gray-700">{item.category}</h5>
              <div className="flex items-center gap-2">
                <Rating
                  className="!text-sm"
                  name={`read-only-${index}`}
                  value={item.rating}
                  precision={0.1}
                  readOnly
                />
                <span className="text-sm font-medium text-gray-600">{item.rating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Average Rating of Initial 6 Reviews */}
        <div className="flex gap-2 items-center mt-4">
          <h5 className="font-semibold">Average Rating of Initial 6 Reviews</h5>
          <Rating className="!text-sm" name="read-only-avg" value={averageRating} readOnly />
          <span className="text-sm font-medium text-gray-600">{averageRating.toFixed(1)}</span>
        </div>

        {/* Initial 6 Reviews */}
        <div className="w-full h-auto bg-white mt-8 border-2 rounded-xl flex flex-wrap p-3 gap-2">
          {reviews.slice(0, 6).map((review, index) => (
            <InstituteReviewBox
              key={index}
              reviewerName={review.reviewerName}
              designation={review.designation}
              year={review.year}
              rating={review.rating}
              review={review.review}
              courseRatings={review.courseRatings}
            />
          ))}
        </div>

        {/* "See More" Button */}
        <div className='flex justify-between items-center mt-4'>
          <button
            className=" text-blue-600 text-sm font-medium hover:underline "
            onClick={toggleModal}
          >
            See More
          </button>

          <CustomButton
            text='Write a Review'
            className="!bg-red-500 !text-sm font-medium !px-[2.5vw] !py-3 !w-auto !h-auto !rounded-lg"
            to="/writereview"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] h-dvh flex items-center justify-center bg-black bg-opacity-50 p-3">
          <div className="bg-white relative rounded-lg shadow-lg p-6 max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              ✖
            </button>

            {/* Modal Content */}
            <h3 className="text-xl font-bold mb-4">Overall Rating & Reviews</h3>

            {/* Overall Rating in Modal */}
            <div className="flex gap-5 mb-6">
              <Box sx={{ '& > legend': { mt: 2 } }} className="flex items-center gap-2">
                <Rating className="!text-lg" name="read-only" value={4.1} readOnly />
                <h4 className="font-semibold opacity-75">4.1</h4>
              </Box>
              <h4 className="font-semibold opacity-75">(8 reviews)</h4>
            </div>

            {/* Category-wise Ratings in Modal */}
            <div className="flex gap-[2vw] mb-6 flex-wrap justify-between sm:justify-normal">
              {ratings.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <h5 className="font-semibold text-gray-700">{item.category}</h5>
                  <div className="flex items-center gap-2">
                    <Rating
                      className="!text-sm"
                      name={`read-only-${index}`}
                      value={item.rating}
                      precision={0.1}
                      readOnly
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Scrollable Section for All Reviews */}
            <div className="bg-white rounded-lg border-2 overflow-y-scroll max-h-80 p-2 overflow-x-hidden gap-2 flex flex-wrap scrollbar-thumb-red">
              {reviews.slice(0, 20).map((review, index) => (
                <InstituteReviewBox key={index} {...review} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewandRating;
