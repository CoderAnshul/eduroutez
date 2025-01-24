import React, { useState, useEffect } from 'react';
import axios from 'axios';
import courseImg from '../assets/Images/course.png';

const fetchImage = async (imagePath) => {
        try {
                const response = await axios.get(`${Images}/${imagePath}`, {
                        responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                return imageUrl;
        } catch (error) {
                console.error('Error fetching image:', error);
                return null;
        }
};

const OptimizedImage = ({ imagePath, alt, className, width = 800, quality = 80 }) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(false);

        useEffect(() => {
                const loadImage = async () => {
                        if (imagePath) {
                                const url = await fetchImage(imagePath);
                                if (url) {
                                        setImageUrl(url);
                                        setIsLoading(false);
                                } else {
                                        setError(true);
                                        setIsLoading(false);
                                }
                        } else {
                                setIsLoading(false);
                        }
                };

                loadImage();
        }, [imagePath]);

        return (
                <div className={`relative ${className}`}>
                        <img
                                src={imageUrl || courseImg}
                                alt={alt || 'Course Image'}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${
                                        isLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoad={() => {
                                        console.log('Image loaded successfully:', imagePath);
                                        setIsLoading(false);
                                }}
                                onError={(e) => {
                                        console.error('Image load error for path:', imagePath, e);
                                        setError(true);
                                        setIsLoading(false);
                                }}
                        />
                        
                        {isLoading && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        )}
                        
                        {error && !isLoading && (
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-500">Failed to load image</span>
                                </div>
                        )}
                </div>
        );
};

export default OptimizedImage;
