import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleCallPopup from '../Components/DashboardComponent/ScheduleCallPopup';
import ReviewFeedbackPopup from '../Components/DashboardComponent/ReviewFeedbackPopup';

const CounselorListPage = () => {
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const response =  await axios.get("http://localhost:4001/api/v1/counselors");
      setCounselors(response.data.data.result || []);
    } catch (error) {
      console.error('Error fetching counselors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleCall = (counselor) => {
    setSelectedCounselor(counselor||null);
    setIsCallPopupOpen(true);
  };

  const handleReviewFeedback = (counselor) => {
    setSelectedCounselor(counselor);
    setIsReviewPopupOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Talk To Our Expert Counselors
        </h1>
        <button 
          className="flex items-center text-red-600 font-medium"
          onClick={() => setIsCallPopupOpen(true)}
        >
          <i className="fa fa-phone mr-2"></i>
          Talk To Counselor
        </button>
      </div>

      {/* Counselors Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          
          {counselors.map((counselor, index) => (
            console.log(counselor),
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                {counselor.profilePhoto ? (
                  <img
                    src={counselor.profilePhoto}
                    alt={counselor.firstname}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fa fa-user text-gray-400 text-3xl"></i>
                  </div>
                )}

                {/* Counselor Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">

                    {counselor.firstname} {counselor.lastname}
                  </h2>
                  <div className="flex items-center mt-1">
                    <i className="fa fa-star text-yellow-500 mr-1"></i>
                    <span className="text-sm text-gray-600">
                      {counselor.rating || 0} ({counselor.rating ? '1' : '0'} Rating)
                    </span>
                  </div>
                  {counselor.level && (
                    <p className="text-sm text-gray-600 mt-2">
                      Level: {counselor.level}
                    </p>
                  )}
                  {counselor.language && (
                    <p className="text-sm text-gray-600 mt-1">
                      Languages: {counselor.language}
                    </p>
                  )}
                </div>
              </div>

              {/* Experience */}
              {counselor.ExperienceYear && (
                <p className="text-sm text-gray-600 mt-3">
                  Experience: {counselor.ExperienceYear} years
                </p>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleScheduleCall(counselor)}
                  className="flex-1 px-4 py-2 border-2 border-red-600 text-red-600 font-medium text-sm rounded-md hover:bg-red-50"
                >
                  <i className="fa fa-phone mr-2"></i>
                  Schedule Call
                </button>
                <button
                  onClick={() => handleReviewFeedback(counselor)}
                  className="flex-1 px-4 py-2 border-2 border-red-600 text-red-600 font-medium text-sm rounded-md hover:bg-red-50"
                >
                  <i className="fa fa-comment mr-2"></i>
                  Review And Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popups */}
      <ScheduleCallPopup
        isOpen={isCallPopupOpen}
        onClose={() => {
          setIsCallPopupOpen(false);
          setSelectedCounselor(null);
        }}
        counselor={selectedCounselor}
      />
      <ReviewFeedbackPopup
        isOpen={isReviewPopupOpen}
        onClose={() => {
          setIsReviewPopupOpen(false);
          setSelectedCounselor(null);
        }}
        counselor={selectedCounselor}
      />
    </div>
  );
};

export default CounselorListPage;