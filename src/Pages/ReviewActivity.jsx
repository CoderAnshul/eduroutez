import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
    Star, ThumbsUp, Calendar, Book, Trophy, Activity, Edit, X, Save 
} from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewActivity = () => {
    const { userId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const apiUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await axios.get(`${apiUrl}/reviews-by-user/${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('accessToken'),
                        'x-refresh-token': localStorage.getItem('refreshToken')
                    },
                });
                setReviews(response.data.data ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [userId, apiUrl]);

    const handleEditReview = (review) => {
        setEditingReview({...review});
    };

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

    const StarRatingEdit = ({ rating, onChange }) => (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    onClick={() => onChange(index + 1)}
                    className={`h-4 w-4 cursor-pointer ${
                        index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                />
            ))}
        </div>
    );

    const StarRating = ({ rating }) => (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`h-4 w-4 ${
                        index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                />
            ))}
        </div>
    );

    const Feature = ({ icon, label, value }) => (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            {icon}
            <div>
                <div className="text-sm font-medium">{label}</div>
                <div className="text-sm text-gray-600">{value}</div>
            </div>
        </div>
    );

    const renderEditModal = () => {
        if (!editingReview) return null;

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
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input 
                                    type="text"
                                    value={editingReview?.fullName ?? ''}
                                    onChange={(e) => setEditingReview({
                                        ...editingReview, 
                                        fullName: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select 
                                    value={editingReview?.gender ?? ''} 
                                    onChange={(e) => setEditingReview({
                                        ...editingReview, 
                                        gender: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

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
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Review Title and Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                            <input 
                                type="text"
                                value={editingReview?.reviewTitle ?? ''}
                                onChange={(e) => setEditingReview({
                                    ...editingReview, 
                                    reviewTitle: e.target.value
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review Content</label>
                            <textarea 
                                value={editingReview?.content ?? ''}
                                onChange={(e) => setEditingReview({
                                    ...editingReview, 
                                    content: e.target.value
                                })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
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
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"/>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 p-4">Error: {error}</div>
    );

    if (!reviews || reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
                    <Activity className="w-12 h-12 text-red-500" />
                </div>
                
                <div className="text-center mt-6">
                    <h2 className="text-2xl font-bold text-gray-700">
                        No Reviews Yet
                    </h2>
                    <p className="text-gray-500 mt-2">
                        It seems you haven't added any reviews yet.
                        Start sharing your experiences to help others!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Reviews</h1>
            <div className="space-y-8">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-lg p-6 relative">
                        {/* Edit Icon */}
                        <button 
                            onClick={() => handleEditReview(review)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-blue-500"
                        >
                            <Edit className="w-5 h-5" />
                        </button>

                        {/* Header Section */}
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-2xl font-semibold mb-2">{review.reviewTitle}</h2>
                            
                          
                           <h4 className="text-lg font-medium text-gray-600"> Collage Name : <strong> {review?.institute?.instituteName ?? 'N/A'}</strong></h4>
                            <p className="text-gray-600">{review.content}</p>
                        </div>

                        {/* Ratings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Placement Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Placement</h3>
                                    <StarRating rating={review.placementStars ?? 0} />
                                </div>
                                <p className="text-sm text-gray-600">{review.placementDescription ?? 'No description provided'}</p>
                            </div>

                            {/* Faculty Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Faculty</h3>
                                    <StarRating rating={review.facultyStars ?? 0} />
                                </div>
                                <p className="text-sm text-gray-600">{review.facultyDescription ?? 'No description provided'}</p>
                            </div>

                            {/* Campus Life Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Campus Life</h3>
                                    <StarRating rating={review.campusLifeStars ?? 0} />
                                </div>
                                <p className="text-sm text-gray-600">{review.campusLifeDescription ?? 'No description provided'}</p>
                            </div>

                            {/* Suggestions Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Suggestions</h3>
                                    <StarRating rating={review.suggestionsStars ?? 0} />
                                </div>
                                <p className="text-sm text-gray-600">{review.suggestionDescription ?? 'No description provided'}</p>
                            </div>
                        </div>

                        {/* Key Features Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <Feature 
                                icon={<Trophy className="w-5 h-5"/>}
                                label="Placement"
                                value={review.estimativePlacementProcess ? "Active" : "Inactive"}
                            />
                            <Feature 
                                icon={<Book className="w-5 h-5"/>}
                                label="Library"
                                value={review.isLatestVersionOfBooksAvailable ? "Latest Books" : "Limited Resources"}
                            />
                            <Feature 
                                icon={<Calendar className="w-5 h-5"/>}
                                label="Events"
                                value={review.workshopAndSeminarsAreCunductedRegularly ? "Regular" : "Limited"}
                            />
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 text-sm text-red-600">
                            {review.reviewerLinkedInUrl && (
                                <a 
                                    href={review.reviewerLinkedInUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-1 hover:underline"
                                >
                                    LinkedIn Profile
                                </a>
                            )}
                            {review.reviewerTwitterUrl && (
                                <a 
                                    href={review.reviewerTwitterUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:underline"
                                >
                                    Twitter Profile
                                </a>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex justify-between">
                            <div>Created: {new Date(review.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2">
                                <ThumbsUp 
                                    className={`w-4 h-4 ${review.recommendation ? 'text-green-500' : 'text-red-500'}`} 
                                />
                                {review.recommendation ? 'Recommended' : 'Not Recommended'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Edit Modal */}
            {renderEditModal()}
        </div>
    );
};

export default ReviewActivity;