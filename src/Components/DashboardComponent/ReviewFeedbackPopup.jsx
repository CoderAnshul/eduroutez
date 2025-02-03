import React, { useState } from 'react';
import axiosInstance from '../../ApiFunctions/axios';

const ReviewFeedbackPopup = ({ isOpen, onClose, counselorId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
const apiUrl =  import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';
  if (!isOpen) return null;

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Get student email from localStorage
      const studentEmail = localStorage.getItem('email');
      
      if (!studentEmail) {
        throw new Error('Student email not found in localStorage');
      }

      const response = await axiosInstance.post(`${apiUrl}/submit-counsellor-review`, {
        headers: {
          'Content-Type': 'application/json',
        },
  
          studentEmail,
          counselorId,
          rating,
          review
        
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review Counselor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="mb-6 text-center">
            <p className="text-lg font-medium mb-2">Give Your Rating</p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`cursor-pointer text-2xl ${
                    index < rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => handleRating(index)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Review Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Note</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
              rows="5"
              placeholder="Enter your review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFeedbackPopup;