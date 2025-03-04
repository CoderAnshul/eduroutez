import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, X, LoaderCircle, Edit, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewsFilterPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('');
    const [editingReview, setEditingReview] = useState(null);

    const apiUrl = import.meta.env.VITE_BASE_URL;

    // Render star rating
    const renderStarRating = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                    <svg 
                        key={index} 
                        className={`h-5 w-5 ${
                            index < rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                    ({rating}/5)
                </span>
            </div>
        );
    };

    // Star Rating Edit Component for Institute Reviews
    const StarRatingEdit = ({ rating, onChange }) => (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    onClick={() => onChange(index + 1)}
                    className={`h-5 w-5 cursor-pointer ${
                        index < rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    // Fetch reviews by type
    const fetchReviews = async (type) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${apiUrl}/my-reviews`, 
                { type },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')
                    }
                }
            );

            setReviews(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching reviews');
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    // Handle type change
    const handleTypeChange = (type) => {
        setFilterType(type);
        fetchReviews(type);
    };

    // New function to handle editing a review
    const handleEditReview = (review) => {
        setEditingReview({...review});
    };

    // Function to update review
    const handleUpdateReview = async () => {
        try {
            const response = await axios.patch(`${apiUrl}/review/${editingReview?._id}`, editingReview, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('accessToken'),
                    'x-refresh-token': localStorage.getItem('refreshToken')
                },
            });

            const updatedReviews = reviews.map(review => 
                review._id === editingReview?._id ? response.data.data : review
            );
            toast.success('Review updated successfully');
            setReviews(updatedReviews);
            setEditingReview(null);
        } catch (err) {
            toast.error('Error updating review');
            console.error('Error updating review:', err);
        }
    };

    // Edit Modal for Institute Reviews
    const renderEditModal = () => {
        if (!editingReview || filterType !== 'institute') return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Edit Review</h2>
                        <button 
                            onClick={() => setEditingReview(null)}
                            className="text-gray-500 hover:text-red-500"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Ratings Sections */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Placement Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Placement Rating</label>
                                <StarRatingEdit 
                                    rating={editingReview?.placementStars ?? 0}
                                    onChange={(stars) => setEditingReview({
                                        ...editingReview, 
                                        placementStars: stars
                                    })}
                                />
                                <textarea 
                                    value={editingReview?.placementDescription ?? ''}
                                    onChange={(e) => setEditingReview({
                                        ...editingReview, 
                                        placementDescription: e.target.value
                                    })}
                                    placeholder="Describe placement experience"
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>

                            {/* Faculty Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Faculty Rating</label>
                                <StarRatingEdit 
                                    rating={editingReview?.facultyStars ?? 0}
                                    onChange={(stars) => setEditingReview({
                                        ...editingReview, 
                                        facultyStars: stars
                                    })}
                                />
                                <textarea 
                                    value={editingReview?.facultyDescription ?? ''}
                                    onChange={(e) => setEditingReview({
                                        ...editingReview, 
                                        facultyDescription: e.target.value
                                    })}
                                    placeholder="Describe faculty experience"
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>

                            {/* Campus Life Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Campus Life Rating</label>
                                <StarRatingEdit 
                                    rating={editingReview?.campusLifeStars ?? 0}
                                    onChange={(stars) => setEditingReview({
                                        ...editingReview, 
                                        campusLifeStars: stars
                                    })}
                                />
                                <textarea 
                                    value={editingReview?.campusLifeDescription ?? ''}
                                    onChange={(e) => setEditingReview({
                                        ...editingReview, 
                                        campusLifeDescription: e.target.value
                                    })}
                                    placeholder="Describe campus life experience"
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>

                            {/* Suggestions Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions Rating</label>
                                <StarRatingEdit 
                                    rating={editingReview?.suggestionsStars ?? 0}
                                    onChange={(stars) => setEditingReview({
                                        ...editingReview, 
                                        suggestionsStars: stars
                                    })}
                                />
                                <textarea 
                                    value={editingReview?.suggestionDescription ?? ''}
                                    onChange={(e) => setEditingReview({
                                        ...editingReview, 
                                        suggestionDescription: e.target.value
                                    })}
                                    placeholder="Describe suggestions"
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recommendation
                            </label>
                            <select 
                                value={editingReview?.recommendation ?? false}
                                onChange={(e) => setEditingReview({
                                    ...editingReview, 
                                    recommendation: e.target.value === 'true'
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                            >
                                <option value="true">Recommended</option>
                                <option value="false">Not Recommended</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
                            <button 
                                onClick={() => setEditingReview(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <X className="mr-2 h-4 w-4 inline-block" /> Cancel
                            </button>
                            <button 
                                onClick={handleUpdateReview}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                            >
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render review content based on type
    const renderReviewContent = (review, type) => {
        switch(type) {
            case 'counselor':
                return (
                    <>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-700">Counseling Experience</h4>
                                <div className="flex items-center">
                                    {renderStarRating(review.rating)}
                                </div>
                                <p className="text-gray-600 mt-2">{review?.comment}</p>
                            </div>
                        </div>
                    </>
                );
            case 'institute':
                return (
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-gray-700">Placement Review</h4>
                                <div className="flex items-center">
                                    {renderStarRating(review.placementStars)}
                                </div>
                                <p className="text-gray-600 mt-2">{review.placementDescription}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700">Faculty Review</h4>
                                <div className="flex items-center">
                                    {renderStarRating(review.facultyStars)}
                                </div>
                                <p className="text-gray-600 mt-2">{review.facultyDescription}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <h4 className="font-semibold text-gray-700">Campus Life Review</h4>
                                <div className="flex items-center">
                                    {renderStarRating(review.campusLifeStars)}
                                </div>
                                <p className="text-gray-600 mt-2">{review.campusLifeDescription}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700">Suggestions</h4>
                                <div className="flex items-center">
                                    {renderStarRating(review.suggestionsStars)}
                                </div>
                                <p className="text-gray-600 mt"></p>
                                <p className="text-gray-600 mt-2">{review.suggestionDescription}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-gray-600">
                                <span className="font-semibold">Recommendation:</span> {review.recommendation ? 'Recommended' : 'Not Recommended'}
                            </p>
                        </div>
                    </div>
                );
            case 'blog':
            case 'course':
                return (
                    <>
                        <p className="text-gray-600">{review.comment}</p>
                        <div className="flex items-center mt-4">
                            {renderStarRating(review.rating)}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchReviews('blog');  // Default to blog type
    }, []);

    // Review types
    const reviewTypes = [
        'blog',
        'course',
        'institute',
        'counselor'
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Reviews</h1>

            {/* Filters */}
            <div className="mb-6 bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <Filter className="mr-2 h-5 w-5" /> Filter by Type
                    </h2>
                    {filterType && (
                        <button 
                            onClick={() => {
                                setFilterType('');
                                fetchReviews('blog');  // Reset to default
                            }}
                            className="text-red-500 hover:bg-red-50 px-2 py-1 rounded flex items-center"
                        >
                            <X className="mr-1 h-4 w-4" /> Clear Filter
                        </button>
                    )}
                </div>

                <div className="flex space-x-4">
                    {reviewTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`px-4 py-2 rounded-md transition-colors ${
                                filterType === type 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center min-h-[300px]">
                    <LoaderCircle className="animate-spin h-8 w-8 text-red-500" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    {error}
                </div>
            )}

            {/* Reviews List */}
            {!loading && reviews.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-xl">No reviews found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {reviews.map(review => (
                        <div 
                            key={review._id} 
                            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow relative"
                        >
                            {/* Edit button for institute reviews */}
                            {filterType === 'institute' && (
                                <button 
                                    onClick={() => handleEditReview(review)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {filterType === 'institute' 
                                            ? review.institute?.instituteName 
                                            : (filterType === 'counselor' 
                                                ? review.counselor?.name 
                                                : review.objectName)}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Reviewed by {review.fullName || review.studentName}
                                    </p>
                                </div>
                            </div>

                            {renderReviewContent(review, filterType)}

                            <div className="text-sm text-gray-500 flex justify-between items-center mt-4">
                                <span>{review.email || review.studentEmail}</span>
                                <span className="text-xs text-gray-400">
                                    Review ID: {review._id}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Edit Modal */}
            {renderEditModal()}
        </div>
    );
};

export default ReviewsFilterPage;