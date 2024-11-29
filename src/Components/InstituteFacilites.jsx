import React, { useState } from 'react';
import facilitiesImg from '../assets/Images/facilities.png';

const facilitiesList = [
  { name: 'Central Library', color: '#FEF2F2' },
  { name: 'Sports Complex', color: '#E3F2FD' },
  { name: 'Hostel', color: '#FFF8E1' },
  { name: 'Cafeteria', color: '#F3E5F5' },
  { name: 'Computer Lab', color: '#E8F5E9' },
  { name: 'Auditorium', color: '#FFEBEE' },
  { name: 'Medical Center', color: '#E1F5FE' },
  { name: 'Gymnasium', color: '#FBE9E7' },
  { name: 'Transport Facility', color: '#FFF3E0' },
  { name: 'WiFi Campus', color: '#EDE7F6' },
];

const InstituteFacilities = () => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl  sm:p-4">
      <h3 className="text-xl font-bold">College Facilities</h3>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden mt-8 border-2 p-3 rounded-xl flex-wrap flex gap-2 ${
          showAll ? 'max-h-[500px]' : 'max-h-[132px]'
        }`}
      >
        {facilitiesList.map((facility, index) => (
          <div
            key={index}
            className={`h-28 w-32 p-2 pt-4 text-center rounded-lg flex flex-col flex-1 min-w-28 flex-wrap justify-start items-center gap-3`}
            style={{ backgroundColor: facility.color }}
          >
            <img src={facilitiesImg} alt={`${facility.name} Icon`} />
            <div>
              {facility.name.split(' ').map((word, i) => (
                <p key={i} className="text-md font-semibold opacity-90">
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
