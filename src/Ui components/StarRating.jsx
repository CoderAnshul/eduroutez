import React from 'react';

const StarRating = ({ rating, size = 20 }) => {
  // Convert rating to nearest half star
  const roundedRating = Math.round(rating * 2) / 2;
  
  // Create an array to hold stars
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedRating) {
      // Full star
      stars.push(
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="#FFB800" 
          className="mr-1"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      );
    } else if (i - 0.5 === roundedRating) {
      // Half star
      stars.push(
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="#FFB800" 
          className="mr-1"
        >
          <defs>
            <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#FFB800" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-star)"></path>
        </svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          width={size} 
          height={size} 
          viewBox="0 0 24 24" 
          fill="#E5E7EB" 
          className="mr-1"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      );
    }
  }
  
  return <div className="flex">{stars}</div>;
};

export default StarRating;