import React, { useState } from 'react';
import facilitiesImg from '../assets/Images/facilities.png';

const InstituteFacilities = ({ instituteData }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  if (!instituteData?.data?.facilities || instituteData.data.facilities.length === 0) {
    return null; // Hide the section if there are no facilities
  }

  const facilitiesList = instituteData.data.facilities.map((facility, index) => ({
    name: facility,
    color: ['#FEF2F2', '#E3F2FD', '#FFF8E1', '#F3E5F5', '#E8F5E9', '#FFEBEE', '#E1F5FE', '#FBE9E7', '#FFF3E0', '#EDE7F6'][index % 10],
  }));

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl sm:p-4">
      <h3 className="text-xl font-bold">College Facilities</h3>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden mt-8 border-2 p-3 rounded-xl flex-wrap flex gap-4 ${
          showAll ? 'max-h-[500px]' : 'max-h-[132px]'
        }`}
      >
        {facilitiesList.map((facility, index) => (
          <div
            key={index}
            className="h-32 w-36 p-2 pt-4 text-center rounded-lg flex flex-col justify-start items-center gap-2 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            style={{ backgroundColor: facility.color }}
          >
            {/* Icon at the top */}
            <img src={facilitiesImg} alt={`${facility.name} Icon`} className="h-10 w-10 object-contain" />
            
            {/* Title below the icon */}
            <div>
              {facility.name.split(' ').map((word, i) => (
                <p key={i} className="text-sm font-semibold text-gray-800">
                  {word}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="text-blue-600 text-sm font-medium hover:underline"
          onClick={toggleShowAll}
        >
          {showAll ? 'See Less' : 'See More'}
        </button>
      </div>
    </div>
  );
};

export default InstituteFacilities;
