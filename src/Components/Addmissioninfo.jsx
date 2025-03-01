import React from 'react';

const renderHTML = (htmlContent) => {
  if (!htmlContent) return <p className="text-gray-500">No content available</p>;
  return (
    <div className="text-base prose prose-gray max-w-full">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <style jsx>{`
        ul {
          list-style-type: disc;
          margin-left: 1.5rem;
        }
        li {
          margin-bottom: 0.5rem;
        }
        h1, h2, h3, h4, h5, h6 {
          margin-top: 1rem;
          color: #1a202c; /* Customize the color as needed */
        }
        h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.3;
        }
        h2 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.3;
        }
        h3 {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.3;
        }
        h4 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.3;
        }
        h5 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
        }
        h6 {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.3;
        }
        a {
          color: blue; /* Link color */
        }
      `}</style>
    </div>
  );
};

const Addmissioninfo = ({ instituteData }) => {
  if (!instituteData?.data?.admissionInfo) {
    return null; // Return null to not render anything if data doesn't exist
  }
  return (
    <div className="min-h-28 w-full flex flex-col justify-between bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)] rounded-xl mb-2 ">
      <div className="mb-4  p-8 pb-2">
        <h3 className="text-lg font-bold">Admission Information</h3>
        {renderHTML(instituteData?.data ? instituteData?.data?.admissionInfo : 'No data found')}
      </div>
    </div>
  );
};

export default Addmissioninfo;
