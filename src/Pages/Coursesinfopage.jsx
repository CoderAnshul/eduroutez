import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import CoursesName from '../Ui components/CoursesName';
import TabSlider from '../Ui components/TabSlider';
import QueryForm from '../Ui components/QueryForm';
import ProsandCons from '../Ui components/ProsandCons';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import { getCoursesById } from '../ApiFunctions/api';
import { useQuery } from 'react-query';
import ConsellingBanner from '../Components/ConsellingBanner';
import HighRatedCareers from '../Components/HighRatedCareers';
import BlogComponent from '../Components/BlogComponent';
import Promotions from '../Pages/CoursePromotions';

const tabs = [
  "Overview",
  "Eligibility",
  "Curriculum",
  "Fees",
  "Opportunities",
  "Application"
];

const Coursesinfopage = () => {
  const { id } = useParams();
  const sectionRefs = tabs.map(() => useRef(null));

  const { data: courseData, isLoading, isError } = useQuery(
    ['course', id],
    () => getCoursesById(id),
    { 
      enabled: Boolean(id),
      retry: 2,
      staleTime: 5 * 60 * 1000
    }
  );

  const content = courseData?.data ?? {};

  if (!id) {
    return <div className="flex justify-center items-center h-screen">Invalid course ID.</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (isError || !content) {
    return <div className="flex justify-center items-center h-screen">Error loading course data.</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

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
            color: #1a202c;
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
            color: blue;
          }
        `}</style>
      </div>
    );
  };

  return (
    <>
      <div className="container max-w-[1300px] mx-auto px-8 py-6 flex flex-col items-start bg-gray-50">
        {/* Course Title */}
        <CoursesName content={content.courseTitle || 'Untitled Course'} />

        {/* Tab Navigation */}
        <TabSlider tabs={tabs} sectionRefs={sectionRefs} />

        {/* Main Content Area with Sidebar */}
        <div className="w-full mt-5 flex gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Overview Section */}
            <div ref={sectionRefs[0]} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-2xl font-semibold text-red-500 mb-4">Overview</h4>
              {renderHTML(content.courseOverview)}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <p>
                  {(content.courseDurationYears || content.courseDurationMonths) && (
                    <>
                      <strong>Duration: </strong>
                      {[
                        content.courseDurationYears > 0 && `${content.courseDurationYears} years`,
                        content.courseDurationMonths > 0 && `${content.courseDurationMonths} months`
                      ].filter(Boolean).join(' ')}
                    </>
                  )}
                </p>
                <p><strong>Cost:</strong> {content.isCourseFree === 'free' ? 'Free' : 'Paid'}</p>
                <p><strong>Category:</strong> {content.category?.title || 'Not specified'}</p>
              </div>
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Short Description</h5>
                {renderHTML(content.shortDescription)}
                <h5 className="font-semibold mb-2 mt-4">Long Description</h5>
                {renderHTML(content.longDescription)}
              </div>
            </div>

            {/* Other sections... */}
            {/* Eligibility Section */}
            <div ref={sectionRefs[1]} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-2xl font-semibold text-red-500 mb-4">Eligibility</h4>
              {renderHTML(content.courseEligibility)}
              <div className="mt-4">
              <h5 className="font-semibold mb-2">General Eligibility</h5>
              <p className="text-gray-700">{content.eligibility || 'Not specified'}</p>
              <h5 className="font-semibold mb-2 mt-4">Cut Off</h5>
              <p className="text-gray-700">{content.cutOff || 'Not specified'}</p>
              <h5 className="font-semibold mb-2 mt-4">Exams Accepted</h5>
              <p className="text-gray-700">{content.examAccepted || 'Not specified'}</p>
            </div>
            </div>

            {/* Curriculum Section */}
            <div ref={sectionRefs[2]} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-2xl font-semibold text-red-500 mb-4">Curriculum</h4>
              {renderHTML(content.courseCurriculum)}
            </div>

            {/* Fees Section */}
            <div ref={sectionRefs[3]} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-2xl font-semibold text-red-500 mb-4">Course Fees</h4>
              {renderHTML(content.courseFee)}
            </div>
<Promotions location="COURSES_PAGE" />
            {/* Opportunities Section */}
            <div ref={sectionRefs[4]} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-2xl font-semibold text-red-500 mb-4">Career Opportunities</h4>
              {renderHTML(content.courseOpportunities)}
            </div>

            {/* Application Section */}
            <div ref={sectionRefs[5]} className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h4 className="text-2xl font-semibold text-red-500 mb-4">Application Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Application Start Date:</strong></p>
                <p>{formatDate(content.applicationStartDate)}</p>
                <p><strong>Application End Date:</strong></p>
                <p>{formatDate(content.applicationEndDate)}</p>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="mb-6">
              <ProsandCons course={content} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:w-1/3 space-y-6">
                   <QueryForm />
          </div>
        </div>

        {/* Additional Sections */}
        <HighRatedCareers />
        <BlogComponent />
        <BestRated />
      </div>
      
      <div className="w-full flex items-start mt-10">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default Coursesinfopage;