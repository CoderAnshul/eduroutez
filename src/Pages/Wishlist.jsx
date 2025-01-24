import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, Plus } from 'lucide-react';
import searchBoximg from "../assets/Images/serachBoximg.jpg";

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${VITE_BASE_URL}/wishlists`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('accessToken'),
              'x-refresh-token': localStorage.getItem('refreshToken')  }
            }
        );
        if (response.data.success) {
          setWishlists(response.data.data.college_wishlist || []);
        }
      } catch (error) {
        console.error('Error fetching wishlists:', error);
        setWishlists([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchWishlists();
  }, []);

  const displayedItems = wishlists.length ? (showAll ? wishlists : wishlists.slice(0, currentPage * itemsPerPage)) : [];

  const handleSeeMore = () => {
    if (!showAll) {
      if (currentPage * itemsPerPage < wishlists.length) {
        setCurrentPage(currentPage + 1);
      } else {
        setShowAll(true);
      }
    }
  };

  const handleSeeLess = () => {
    setShowAll(false);
    setCurrentPage(1);
  };

  const handleExploreColleges = () => {
    window.location.href = '/colleges'; // Or use your routing method
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 relative">
        My Wishlist
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-red-500 rounded-full"></div>
      </h1>

      {wishlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-6 py-16">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Your wishlist is empty</h2>
          <p className="text-gray-600 text-center max-w-md">
            Start exploring colleges and add them to your wishlist to keep track of your favorite institutions.
          </p>
          <button
            onClick={handleExploreColleges}
            className="mt-4 flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Explore Colleges
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {displayedItems.map((college) => (
              <div
                key={college._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={college.thumbnailImage
                      ? `${VITE_BASE_URL}/${college.thumbnailImage}`
                      : searchBoximg}
                    alt={college.instituteName}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 border-b border-red-200 pb-2">
                    {college.instituteName}
                  </h2>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-red-600">Established:</span> {college.establishedYear}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{college.collegeInfo}</p>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium text-red-600">Highest Package:</span> {college.highestPackage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            {!showAll && currentPage * itemsPerPage < wishlists.length && (
              <button
                onClick={handleSeeMore}
                className="px-8 py-3 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                See More
              </button>
            )}
            {currentPage > 1 && (
              <button
                onClick={handleSeeLess}
                className="px-8 py-3 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                See Less
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;