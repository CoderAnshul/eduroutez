import React, { useState } from 'react';

const ReviewFeedbackPopup = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  if (!isOpen) return null;

  const handleRating = (index) => {
    setRating(index + 1); // Set rating based on the selected star
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic (e.g., send to API)
    console.log('Submitted Rating:', rating);
    console.log('Submitted Review:', review);
    onClose();
  };

  return (
    <div className="fixed p-4 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review Counselor</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fa fa-times"></i>
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
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="5"
              placeholder="Enter your review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFeedbackPopup;
