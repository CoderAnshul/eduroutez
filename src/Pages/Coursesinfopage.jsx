import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoursesName from '../Ui components/CoursesName';
import QueryForm from '../Ui components/QueryForm';
import ProsandCons from '../Ui components/ProsandCons';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import { getCoursesById } from '../ApiFunctions/api';
import { useQuery } from 'react-query';

const Coursesinfopage = () => {
  const [content, setContent] = useState();
  const { id } = useParams();

  const { data: CourseData, isLoading, isError } = useQuery(
    ['course', id],
    () => getCoursesById(id),
    { enabled: Boolean(id) }
  );

  useEffect(() => {
    if (CourseData?.data) {
      setContent(CourseData.data);
    }
  }, [CourseData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError || !content) {
    return <div className="flex justify-center items-center h-screen">Error loading course data.</div>;
  }

  return (
    <div className="px-8 py-6 flex flex-col items-start bg-gray-50">
      {/* Course Title */}
      <CoursesName content={content.courseTitle} />

      {/* Main Content */}
      <div className="w-full flex flex-wrap gap-8">
        {/* Course Details */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-2xl font-semibold text-red-500 mb-4">Overview</h4>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Type:</strong> {content.courseType || 'N/A'}</p>
              <p><strong>Instructor:</strong> {content.instructor || 'N/A'}</p>
              <p><strong>Language:</strong> {content.language || 'N/A'}</p>
              <p><strong>Level:</strong> {content.courseLevel || 'N/A'}</p>
              <p><strong>Duration:</strong> 
                {content.courseDurationYears && `${content.courseDurationYears} years`} 
                {content.courseDurationMonths && ` ${content.courseDurationMonths} months`}
              </p>
              <p><strong>Cost:</strong> {content.isCourseFree === 'free' ? 'Free' : 'Paid'}</p>
              <p><strong>Category:</strong> {content.category || 'N/A'}</p>
              <p><strong>Institute:</strong> {content.instituteCategory || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-2xl font-semibold text-red-500 mb-4">Eligibility</h4>
            <p className="text-gray-700">{content.eligibility || 'Eligibility criteria not available'}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-2xl font-semibold text-red-500 mb-4">Exams Accepted</h4>
            <p className="text-gray-700">{content.examAccepted || 'No exams mentioned'}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h4 className="text-2xl font-semibold text-red-500 mb-4">Application Dates</h4>
            <p><strong>Start Date:</strong> {new Date(content.applicationStartDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(content.applicationEndDate).toLocaleDateString()}</p>
          </div>

          <ProsandCons />
        </div>

        {/* Query Form */}
        <QueryForm />
      </div>

      {/* Additional Sections */}
      <BestRated />
      <Events />
    </div>
  );
};

export default Coursesinfopage;
