import React, { useState } from 'react';
import axiosInstance from '../ApiFunctions/axios';
import { Star } from 'lucide-react';

const BlogReviewForm = ({ blog }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false); // New state for form visibility
    
    // Get reviews directly from the blog object
    const reviews = blog.reviews || [];
    const baseURL = import.meta.env.VITE_BASE_URL;


    // Get current user info
    const currentUserId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || 'Anonymous';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUserId) {
            setError('Please log in to submit a review');
            return;
        }
        
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        
        try {
            const response = await axiosInstance.post(`${baseURL}/submit-review`, {
                type: "blog",
                id: blog._id,
                rating,
                comment,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken')
                }
            });
            
            setSuccess(true);
            setComment('');
            setRating(0);
            
            // Reload the page to see updated reviews
            // You might want to implement a more elegant solution that updates the parent component
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            {/* Review Stats */}
            <div className="mb-6 flex max-sm:flex-col max-sm:items-start max-sm:gap-6 items-center justify-between">
                <div>
                    <h4 className="text-xl font-semibold">OverAll Reviews</h4>
                    <div className="mt-2 flex items-center">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    fill={star <= Math.round(averageRating) ? "#FFD700" : "none"}
                                    color={star <= Math.round(averageRating) ? "#FFD700" : "#D1D5DB"}
                                    size={24}
                                />
                            ))}
                        </div>
                        <span className="ml-2 text-lg font-semibold">{averageRating}</span>
                        <span className="ml-2 text-gray-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                </div>
                   {/* Toggle Form Button */}
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="mb-4 px-6 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
            >
                {isFormVisible ? 'Hide Review Form' : 'Write a Review'}
            </button>
            </div>

         

            {/* Review Form */}
            {isFormVisible && (
                <div className="mb-8 border-t border-b py-6">
                    <h5 className="text-lg font-medium mb-4">Write a Review</h5>
                    
                    {!currentUserId && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md mb-4">
                            Please log in to submit a review.
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                            Your review has been submitted successfully!
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Rating</label>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        fill={(hoveredRating || rating) >= star ? "#FFD700" : "none"}
                                        color={(hoveredRating || rating) >= star ? "#FFD700" : "#D1D5DB"}
                                        size={32}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="cursor-pointer transition-transform hover:scale-110"
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-gray-700 mb-2">Your Comment</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows="4"
                                placeholder="Share your thoughts about this blog post..."
                                disabled={!currentUserId || isSubmitting}
                            ></textarea>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!currentUserId || isSubmitting}
                            className={`px-6 py-2 rounded-lg font-medium ${
                                !currentUserId
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Existing Reviews */}
            <div>
                <h5 className="text-lg font-medium mb-4">All Reviews</h5>
                
                {reviews.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No reviews yet. Be the first to review!</div>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h6 className="font-medium">{review.studentName || 'Anonymous'}</h6>
                                        <div className="flex mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    fill={star <= review.rating ? "#FFD700" : "none"}
                                                    color={star <= review.rating ? "#FFD700" : "#D1D5DB"}
                                                    size={16}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogReviewForm;