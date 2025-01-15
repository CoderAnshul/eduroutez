import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Star, ThumbsUp, Calendar, Book, Trophy, Users, Activity } from 'lucide-react';

const ReviewActivity = () => {
    const { userId } = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const email = localStorage.getItem('email');
                const response = await axios.get(`${apiUrl}/reviews-by-user/${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response.data.data);
                setReviews(response.data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [userId]);

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
                {/* Icon */}
                <div className="flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
                    <Activity className="w-12 h-12 text-red-500" />
                </div>
                
                {/* Message */}
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
                    <div key={review._id} className="bg-white rounded-lg shadow-lg p-6">
                        {/* Header Section */}
                        <div className="border-b pb-4 mb-4">
                            <h2 className="text-2xl font-semibold mb-2">{review.reviewTitle}</h2>
                            <p className="text-gray-600">{review.content}</p>
                        </div>

                        {/* Ratings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Placement Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Placement</h3>
                                    <StarRating rating={review.placementStars} />
                                </div>
                                <p className="text-sm text-gray-600">{review.placementDescription}</p>
                            </div>

                            {/* Faculty Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Faculty</h3>
                                    <StarRating rating={review.facultyStars} />
                                </div>
                                <p className="text-sm text-gray-600">{review.facultyDescription}</p>
                            </div>

                            {/* Campus Life Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Campus Life</h3>
                                    <StarRating rating={review.campusLifeStars} />
                                </div>
                                <p className="text-sm text-gray-600">{review.campusLifeDescription}</p>
                            </div>

                            {/* Suggestions Rating */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">Suggestions</h3>
                                    <StarRating rating={review.suggestionsStars} />
                                </div>
                                <p className="text-sm text-gray-600">{review.suggestionDescription}</p>
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
                                <a href={review.reviewerLinkedInUrl} target="_blank" rel="noopener noreferrer" 
                                   className="flex items-center gap-1 hover:underline">
                                    LinkedIn Profile
                                </a>
                            )}
                            {review.reviewerTwitterUrl && (
                                <a href={review.reviewerTwitterUrl} target="_blank" rel="noopener noreferrer"
                                   className="flex items-center gap-1 hover:underline">
                                    Twitter Profile
                                </a>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex justify-between">
                            <div>Created: {new Date(review.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2">
                                <ThumbsUp className={`w-4 h-4 ${review.recommendation ? 'text-green-500' : 'text-red-500'}`} />
                                {review.recommendation ? 'Recommended' : 'Not Recommended'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Feature = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
        {icon}
        <div>
            <div className="text-sm font-medium">{label}</div>
            <div className="text-sm text-gray-600">{value}</div>
        </div>
    </div>
);

export default ReviewActivity;