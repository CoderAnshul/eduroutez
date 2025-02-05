'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import InstituteReviewBox from '../Ui components/InstituteReviewBox';
import CustomButton from "../Ui components/CustomButton";
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

const ReviewandRating = ({ instituteData }) => {
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchReviewsAndRatings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseURL}/review-by-institute/${instituteData?.data?._id}`);
        setRatings(response.data.ratings || []);
        setReviews(response.data.data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewsAndRatings();
  }, [instituteData?.data._id]);

  const handleReviewClick = (e) => {
    e.preventDefault(); // Prevent default for both buttons
    if (!accessToken) {
      setShowLoginPopup(true);
    } else {
      window.location.href = '/writereview'; // Navigate to write review if logged in
    }
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.slice(0, 6).reduce((total, review) => total + review.rating, 0) / Math.min(reviews.length, 6);
  }, [reviews]);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-28 w-full flex items-center justify-center">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-28 w-full flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-28 w-full flex flex-col items-center justify-center">
        <p>No reviews available for this institute.</p>
        <CustomButton
          text='Be the First to Write a Review'
          className="!bg-red-500 !text-sm font-medium !px-[2.5vw] !py-3 !w-auto !h-auto !rounded-lg mt-4"
          onClick={handleReviewClick}
        />
        {showLoginPopup && (
          <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
            <div className="popup bg-white p-12 rounded-lg shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 w-1/3">
              <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
                Hey there! We'd love to hear your thoughts. Please log in to share your review with us and help others make informed decisions.
              </h3>
              <div className="flex justify-center space-x-6">
                <button
                  onClick={handleLoginPopupClose}
                  className="bg-gray-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none"
                >
                  Close
                </button>
                <Link
                  to="/login"
                  onClick={handleLoginPopupClose}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-red-700 focus:outline-none"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const overallRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + ((typeof review?.placementStars === 'number' ? review.placementStars : 0) + 
      (typeof review?.campusLifeStars === 'number' ? review.campusLifeStars : 0) + 
      (typeof review?.facultyStars === 'number' ? review.facultyStars : 0) + 
      (typeof review?.suggestionsStars === 'number' ? review.suggestionsStars : 0))/4, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl sm:p-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold">Overall Rating & Reviews</h3>

        <div className="flex gap-5">
          <Box sx={{ '& > legend': { mt: 2 } }} className="flex items-center gap-2">
            <Rating 
              className="!text-lg" 
              name="read-only" 
              value={overallRating} 
              precision={0.1}
              readOnly 
            />
            <h4 className="font-semibold opacity-75">{overallRating.toFixed(1)}</h4>
          </Box>
          <h4 className="font-semibold opacity-75">({reviews.length} reviews)</h4>
        </div>

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

        <div className="flex gap-2 items-center mt-4">
          <h5 className="font-semibold">Average Rating of Initial 6 Reviews</h5>
          <Rating className="!text-sm" name="read-only-avg" value={overallRating} readOnly />
          <span className="text-sm font-medium text-gray-600">{overallRating.toFixed(1)}</span>
        </div>

        <div className="w-full h-auto bg-white mt-8 border-2 rounded-xl flex flex-wrap p-3 gap-2">
          {reviews.slice(0, 6).map((review, index) => (
            <InstituteReviewBox
              key={index}
              reviewerName={review.fullName}
              designation={review.suggestionDescription}
              year={review.year}
              placementStars={review?.placementStars}
              campusLifeStars={review?.campusLifeStars}
              campusLifeDescription={review?.campusLifeDescription}
              facultyDescription={review?.facultyDescription}
              placementDescription={review?.placementDescription}
              facultyStars={review?.facultyStars}
              suggestionsStars={review?.suggestionsStars}
              rating={(review.placementStars + review.facultyStars + review.campusLifeStars + review.suggestionsStars) / 4}
              review={review.reviewTitle}
              courseRatings={[review.placementStars, review.facultyStars, review.campusLifeStars, review.suggestionsStars]}
            />
          ))}
        </div>

        <div className='flex justify-between items-center mt-4'>
          <button
            className="text-blue-600 text-sm font-medium hover:underline"
            onClick={toggleModal}
          >
            See More
          </button>

          <CustomButton
            text='Write a Review'
            className="!bg-red-500 !text-sm font-medium !px-[2.5vw] !py-3 !w-auto !h-auto !rounded-lg"
            onClick={handleReviewClick}
          />
        </div>
      </div>

      {showLoginPopup && (
        <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="popup bg-white p-12 rounded-lg shadow-2xl transform transition-all duration-300 scale-95 hover:scale-100 w-1/3">
            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-800">
              Hey there! We'd love to hear your thoughts. Please log in to share your review with us and help others make informed decisions.
            </h3>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleLoginPopupClose}
                className="bg-gray-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 focus:outline-none"
              >
                Close
              </button>
              <Link
                to="/login"
                onClick={handleLoginPopupClose}
                className="bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-red-700 focus:outline-none"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] h-dvh flex items-center justify-center bg-black bg-opacity-50 p-3">
          <div className="bg-white relative rounded-lg shadow-lg p-6 max-w-4xl w-full overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={toggleModal}
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4">Overall Rating & Reviews</h3>

            <div className="flex gap-5 mb-6">
              <Box sx={{ '& > legend': { mt: 2 } }} className="flex items-center gap-2">
                <Rating 
                  className="!text-lg" 
                  name="read-only" 
                  value={overallRating} 
                  precision={0.1}
                  readOnly 
                />
                <h4 className="font-semibold opacity-75">{overallRating.toFixed(1)}</h4>
              </Box>
              <h4 className="font-semibold opacity-75">({reviews.length} reviews)</h4>
            </div>

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

            <div className="bg-white rounded-lg border-2 overflow-y-scroll max-h-80 p-2 overflow-x-hidden gap-2 flex flex-wrap scrollbar-thumb-red">
              {reviews.map((review, index) => (
                <InstituteReviewBox
                  key={index}
                  reviewerName={review.fullName}
                  designation={review.suggestionDescription}
                  year={review.year}
                  placementStars={review?.placementStars}
                  campusLifeStars={review?.campusLifeStars}
                  campusLifeDescription={review?.campusLifeDescription}
                  facultyDescription={review?.facultyDescription}
                  placementDescription={review?.placementDescription}
                  facultyStars={review?.facultyStars}
                  suggestionsStars={review?.suggestionsStars}
                  rating={(review.placementStars + review.facultyStars + review.campusLifeStars + review.suggestionsStars) / 4}
                  review={review.reviewTitle}
                  courseRatings={[review.placementStars, review.facultyStars, review.campusLifeStars, review.suggestionsStars]}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewandRating;