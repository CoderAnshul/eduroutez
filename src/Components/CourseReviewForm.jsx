import React, { useEffect, useRef, useState } from 'react';
import StarRating from '../Ui components/StarRating'; // Assuming you have this component

const CourseReviewSection = ({ course }) => {
  const [showForm, setShowForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    // Get current user ID from localStorage
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
  }, []);

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!course.reviews || course.reviews.length === 0) return 0;
    const sum = course.reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / course.reviews.length).toFixed(1);
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Handle rating selection
  const handleRatingSelect = (rating) => {
    setUserRating(rating);
  };

  // Handle comment change
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Toggle between showing top 3 and all reviews
  const toggleReviewDisplay = () => {
    setShowAllReviews(!showAllReviews);
  };

  // Get reviews to display based on current state
  const getDisplayedReviews = () => {
    if (!course.reviews || course.reviews.length === 0) return [];
    
    // Sort reviews by rating (highest first) and then by date (newest first)
    const sortedReviews = [...course.reviews].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    
    return showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);
  };

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (userRating === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setSubmitError('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const reviewData = {
        id: course._id, // Assuming course has an _id field
        type: "course",
        rating: userRating,
        comment: comment
      };

      const response = await fetch('http://localhost:4001/api/v1/submit-review', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      // Success handling
      setSubmitSuccess(true);
      setUserRating(0);
      setComment('');
      
      // Close the form after a delay
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
        // You might want to refresh the course data here or use a callback function
      }, 2000);
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get displayed reviews
  const displayedReviews = getDisplayedReviews();
  const totalReviews = course.reviews?.length || 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h4 className="text-2xl font-semibold text-red-500 mb-6">Course Reviews</h4>
      
      {/* Reviews Summary */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-gray-800">{calculateAverageRating()}</div>
          <div>
            <div className="flex mb-1">
              <StarRating rating={parseFloat(calculateAverageRating())} size={24} />
            </div>
            <p className="text-gray-500 text-sm">Based on {totalReviews} reviews</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Write a Review
        </button>
      </div>
      
      {/* Reviews List */}
      <div className="mb-4">
        {totalReviews === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this course!</p>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review, index) => (
              <div key={review._id || index} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {review.studentName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.studentName || 'Anonymous User'}</p>
                      <div className="flex">
                        <StarRating rating={review.rating} size={16} />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {review.createdAt ? formatDate(review.createdAt) : 'Recent'}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* See More / See Less Button */}
      {totalReviews > 3 && (
        <div className="text-center mb-6">
          <button 
            onClick={toggleReviewDisplay}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showAllReviews ? 'Show Less' : `See More (${totalReviews - 3} more)`}
          </button>
        </div>
      )}
      
      {/* Review Form - conditionally displayed */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h5 className="text-xl font-semibold mb-4">Write Your Review</h5>
          
          {!currentUserId ? (
            <div className="text-center py-6">
              <p className="text-gray-700 mb-3">Please log in to submit a review</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Log In
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmitReview}>
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingSelect(star)}
                      className={`text-2xl focus:outline-none ${
                        userRating >= star ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows="4"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Share your experience with this course..."
                  value={comment}
                  onChange={handleCommentChange}
                ></textarea>
              </div>
              
              {submitError && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                  {submitError}
                </div>
              )}
              
              {submitSuccess && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                  Your review has been submitted successfully!
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseReviewSection;