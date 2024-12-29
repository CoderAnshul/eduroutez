import React, { useState } from 'react';
import ScheduleCallPopup from '../Components/DashboardComponent/ScheduleCallPopup';
import ReviewFeedbackPopup from '../Components/DashboardComponent/ReviewFeedbackPopup';

const CounselorListPage = () => {
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const counselors = [
    { name: 'Counseller123', rating: 0, description: '' },
    {
      name: 'Counseller25',
      rating: 0,
      description:
        'UPSC IES 2025 application process will end tomorrow for 232 vacancies. Candidates can fill up the IE...',
    },
    { name: 'Eduroutezcon', rating: 0, description: '' },
    { name: 'Patrick Carson', rating: 0, description: '' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Talk To Our Expert Counselors
      </h1>
      <button className="flex items-center text-red-600 font-medium">
        <i className="fa fa-phone mr-2"></i>
        Talk To Counselor
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        {counselors.map((counselor, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col"
          >
            <div className="h-24 w-24 mb-4 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-sm text-gray-400">images</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{counselor.name}</h2>
            <p className="text-sm text-gray-600 flex items-center">
              <i className="fa fa-star text-yellow-500 mr-1"></i> ({counselor.rating}) (0 Rating)
            </p>
            {counselor.description && (
              <p className="text-sm text-gray-500 mt-2">{counselor.description}</p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsCallPopupOpen(true)}
                className="px-4 py-2 border-2 border-red-600 text-red-600 font-medium text-sm rounded-md hover:bg-red-50"
              >
                <i className="fa fa-phone"></i> Schedule Call
              </button>
              <button
                onClick={() => setIsReviewPopupOpen(true)}
                className="px-4 py-2 border-2 border-red-600 text-red-600 font-medium text-sm rounded-md hover:bg-red-50"
              >
                <i className="fa fa-comment"></i> Review And Feedback
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popups */}
      <ScheduleCallPopup
        isOpen={isCallPopupOpen}
        onClose={() => setIsCallPopupOpen(false)}
      />
      <ReviewFeedbackPopup
        isOpen={isReviewPopupOpen}
        onClose={() => setIsReviewPopupOpen(false)}
      />
    </div>
  );
};

export default CounselorListPage;
