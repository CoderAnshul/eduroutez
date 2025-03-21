import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import counsellor1 from "../assets/Images/counsellor1.jpeg";
import counsellor2 from "../assets/Images/Counsellor2.jpg";
import counsellor3 from "../assets/Images/Counsellor3.jpg";
import counsellor4 from "../assets/Images/Counsellor4.jpg";
import counsellor5 from "../assets/Images/Counsellor5.jpg";
import aditi from "../assets/Images/AditiJoshi.png";
import  DurviKaskar from "../assets/Images/DurviKaskar.png";
import RohanPatil from "../assets/Images/RohanPatil.png";
import PrinceMishra from "../assets/Images/PrinceMishra.jpeg";
import Natasha from "../assets/Images/NatashaSawant.jpeg";

const ReviewBox = ({ review, onReadMore }) => {
  // Function to truncate text if too long
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return (
      <>
        {text.substr(0, maxLength)}...
        <button
          onClick={() => onReadMore(review)}
          className="text-blue-500 ml-2"
        >
          Read More
        </button>
      </>
    );
  };

  // Function to determine star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ⭐
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-500">
            ⭐
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ☆
          </span>
        );
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col max-w-md w-full">
      <div className="flex items-center mb-4">
        {/* Add the image here */}
        <div className="mr-4">
          <img 
            src={review.userImage} 
            alt={`${review.name}`} 
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-lg">{review.name}</h4>
          <p className="text-sm text-gray-600">{review.type}</p>
          <p className="text-xs text-gray-500">{review.company}</p>
          {renderStars(review.rating)}
        </div>
      </div>
      <p className="text-gray-700">{truncateText(review.text, 200)}</p>
    </div>
  );
};

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <div className="flex items-center mb-4">
          <img 
            src={review.userImage} 
            alt={`${review.name}`} 
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-bold text-lg mb-2">{review.name}</h4>
            <p className="text-sm text-gray-600 mb-1">{review.type}</p>
            {review.company && <p className="text-xs text-gray-500 mb-2">{review.company}</p>}
          </div>
        </div>
        <p className="text-gray-700">{review.text}</p>
        <button 
          onClick={onClose} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [selectedReview, setSelectedReview] = useState(null);

  // Map of images to use for different review types
  const imageMap = {
    student: [aditi, RohanPatil, PrinceMishra, DurviKaskar,Natasha],
    counselor: [ counsellor1, counsellor2,counsellor3, counsellor4, counsellor5]
  };

  // Combined review data from all sources
  const allReviews = [
    // Student reviews
    {
      id: 1,
      name: "Durvi Kaskar ",
      type: "Student",
      company: "",
      text: "Eduroutez is an amazing platform for students looking for college information, career options, and entrance exam details. The career-related webinars are very helpful in understanding different fields!",
      userImage: imageMap.student[3],
      rating: 5,
    },
    {
      id: 2,
      name: "Aditi Joshi",
      type: "Student",
      company: "",
      text: "Finding the right college was so confusing until I found Eduroutez. It provides detailed insights into colleges, courses, and even connects you with expert counselors for career guidance!",
      userImage: imageMap.student[0],
      rating: 5,
    },
    {
      id: 3,
      name: "Natasha Sawant",
      type: "Student",
      company: "",
      text: "This website made my career search so easy! I attended a webinar and got valuable insights about the career I want to pursue. Highly recommended for students!",
      userImage: imageMap.student[4],
      rating: 5,
    },
    {
      id: 4,
      name: "Prince Mishra",
      type: "Student",
      company: "",
      text: "Eduroutez helped me clear my doubts about my career path. Their paid counseling service is worth it, as I got expert advice tailored to my interests.",
      userImage: imageMap.student[2],
      rating: 5,
    },
    {
      id: 5,
      name: "Rohan Patil",
      type: "Student",
      company: "",
      text: "A one-stop destination for students! From college listings to career guidance, everything is available in one place. I love how user-friendly the website is.",
      userImage: imageMap.student[1],
      rating: 5,
    },

    // Counselor reviews
    {
      id: 6,
      name: "Dr. Anjali Mehta",
      type: "Counselor",
      company: "",
      text: "As a counselor, Eduroutez has given me a great platform to connect with students and share my knowledge. It helps bridge the gap between students and experts.",
      userImage: imageMap.counselor[0],
      rating: 5,
    },
    {
      id: 7,
      name: "Rajeev Nair",
      type: "Counselor",
      company: "",
      text: "I have been able to guide many students through this platform. It provides an excellent space to reach students who genuinely need career advice.",
      userImage: imageMap.counselor[1],
      rating: 5,
    },
    {
      id: 8,
      name: "Neha Choudhary",
      type: "Counselor",
      company: "",
      text: "Eduroutez is a fantastic platform for counselors like me. It allows us to share our expertise and help students make informed decisions about their careers.",
      userImage: imageMap.counselor[2],
      rating: 5,
    },
    {
      id: 9,
      name: "Amit Kulkarni",
      type: "Counselor",
      company: "",
      text: "Being a career counselor, I appreciate how Eduroutez connects students with the right mentors. It's a great opportunity for professionals to make an impact.",
      userImage: imageMap.counselor[3],
      rating: 5,
    },
    {
      id: 10,
      name: "Sonal Gupta",
      type: "Counselor",
      company: "",
      text: "I've had a great experience counseling students on Eduroutez. The platform ensures that students get authentic and expert advice for their future.",
      userImage: imageMap.counselor[4],
      rating: 5,
    }
  ];

  // Determine how many reviews to show based on screen size
  const getVisibleCount = (width) => {
    if (width >= 1280) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  // Update visible reviews based on current index
  const updateVisibleReviews = () => {
    const visibleCount = getVisibleCount(windowWidth);
    const reviews = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % allReviews.length;
      reviews.push(allReviews[index]);
    }

    setVisibleReviews(reviews);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Update visible reviews when index or window size changes
  useEffect(() => {
    updateVisibleReviews();
  }, [currentIndex, windowWidth]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allReviews.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + allReviews.length) % allReviews.length
    );
  };

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-44 p-4 md:p-8 bg-gray-50">
      <div className="w-full mx-auto min-h-44 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">What People Say About Us</h3>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md z-10 hidden md:flex"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          {/* Reviews container */}
          <div className="flex gap-4 overflow-hidden h-[17rem] pb-4 max-sm:h-fit transition-all duration-300">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-shrink-0  w-full md:w-1/2 lg:w-1/3 transition-all duration-300"
              >
                <ReviewBox review={review} onReadMore={setSelectedReview} />
              </div>
            ))}
          </div>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md z-10 hidden md:flex"
            aria-label="Next review"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {allReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? "bg-red-600 w-4" : "bg-gray-300"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
};

export { Reviews };