import React, { useState } from 'react';

const ExpandedBox = ({ contentData ,instituteData}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // console.log(instituteData);
  

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="min-h-24 relative w-full flex flex-col justify-between rounded-xl px-4 mb-2  ">
      {/* Apply conditional height based on whether expanded or not */}
      <div 
        className="overflow-hidden transition-all duration-300"
        style={{ height: isExpanded ? 'auto' : '100px' }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-bold">{instituteData?.data?.instituteName || "College information"}</h3>
          <p className="text-base" dangerouslySetInnerHTML={{ __html: instituteData?.data?.about || "no data found" }} />
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white mb-10 to-transparent" />
        )}
      </div>

      {/* Button to toggle between showing more or less */}
      <button
        onClick={toggleText}
        className="text-blue-600 font-semibold mt-6"
      >
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
};

export default ExpandedBox;
