import React from "react";

const CourseCard = ({ course }) => {

  console.log(course);

  function convertToReadableFormat(number) {
    if (number >= 10000000) {
      return (number / 10000000).toFixed(2).replace(/\.00$/, '') + 'Cr';
    } else if (number >= 100000) { // Adjusted threshold to avoid incorrect 'K' formatting
      return (number / 100000).toFixed(2).replace(/\.00$/, '') + 'L';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
    } else {
      return number.toString();
    }
  }

  // Helper function to format date range
  const formatDate = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";

    // Parse the start and end dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Check if both dates are valid
    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) return "N/A";

    // Format both dates
    const formattedStartDate = parsedStartDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedEndDate = parsedEndDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  return (
    <div className="border max-w-sm hover:-translate-y-2 hover:shadow-lg hover:bg-red-50 transform transition-all flex-1 w-full rounded-lg shadow-sm p-2 flex flex-col justify-between group">
      
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 min-w-[260px]">
          <div className="border-b-2 p-1 mb-2">
            <h4 className="text-sm font-bold mb-2 text-gray-700">Duration</h4>
            <p className="text-xs font-medium opacity-70">
          {course.courseDurationYears ? `${course.courseDurationYears} Year${course.courseDurationYears > 1 ? 's' : ''}` : ''}
          {course.courseDurationMonths ? ` & ${course.courseDurationMonths} Month${course.courseDurationMonths > 1 ? 's' : ''}` : ''}
            </p>
          </div>
          <div className="border-b-2 p-1 mb-2">
            <h4 className="text-sm font-bold mb-2 text-gray-700">Exam Accepted</h4>
            <p className="text-xs font-medium opacity-70">{course.examAccepted || "N/A"}</p>
          </div>
          <div className="border-b-2 p-1 mb-2">
            <h4 className="text-sm font-bold mb-2 text-gray-700">Type</h4>
            <p className="text-xs font-medium opacity-70">{course.courseType || "N/A"}</p>
          </div>
          <div className="border-b-2 p-1 mb-2">
            <h4 className="text-sm font-bold mb-2 text-gray-700">Application Date</h4>
            <p className="text-xs font-medium opacity-70">
          {formatDate(course.applicationStartDate, course.applicationEndDate)}
            </p>
          </div>
          <div className="border-b-2 p-1 mb-2">
            <h4 className="text-sm font-bold mb-2 text-gray-700">Eligibility</h4>
            <p
          className="text-xs font-medium opacity-70"
          dangerouslySetInnerHTML={{
            __html: course.eligibility || "N/A",
          }}
            />
          </div>
          <div className="border-b-2 p-1 mb-2">
            <h4 className="text-sm font-bold mb-2 text-gray-700">Cut Off</h4>
            <p className="text-xs font-medium opacity-70">{course.cutOff ? `${course.cutOff}` : "N/A"}</p>
          </div>
        </div>

        {/* Footer */}
      <div className="flex justify-between items-center bg-red-100 rounded-lg p-3 group-hover:bg-red-200">
        <span className="text-red-600 font-medium">{course.courseTitle || "PGPM"}</span>
        {course.coursePrice && (
          <p>
            <span
              className="text-black flex font-semibold">
              {"₹" + convertToReadableFormat(course.coursePrice)}
                </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
