import React from 'react';
import DOMPurify from 'dompurify';

const Placementinfo = ({ instituteData }) => {
  const sanitizedPlacementInfo = DOMPurify.sanitize(instituteData?.data?.placementInfo || '');
  if (!instituteData?.data?.placementInfo) {
    return null; // Return null to not render anything if data doesn't exist
  }

  return (
    <div className="min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2">
      <div className="mb-4  p-8 pb-2">

        <h3 className="text-lg font-bold">Placement Information</h3>
        <p className="text-base" dangerouslySetInnerHTML={{ __html: sanitizedPlacementInfo }}></p>
      </div>
    </div>
  );
}

export default Placementinfo;
