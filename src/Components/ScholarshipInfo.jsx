import React from "react";

const ScholarshipInfo = ({ instituteData }) => {
  if (!instituteData?.data?.scholarshipInfo) {
    return null; // Return null to not render anything if data doesn't exist
  }

  return (
    <div className="min-h-28 w-full  max-sm:h-fit flex flex-col justify-between  shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2 ">
      <div className="mb-4 p-8 pb-2">
        <h3 className="text-lg font-bold">Scholarship opportunities</h3>
        <p
          className="text-base institute-tables"
          dangerouslySetInnerHTML={{
            __html: instituteData?.data
              ? instituteData?.data?.scholarshipInfo
              : "no data found",
          }}
        ></p>
      </div>
    </div>
  );
};

export default ScholarshipInfo;
