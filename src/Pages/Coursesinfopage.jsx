import React, { useEffect, useRef, useState } from 'react';
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
import CourseReviewForm from '../Components/CourseReviewForm'; // Import the new component
import axiosInstance from '../ApiFunctions/axios';
import SocialShare from '../Components/SocialShare';
const tabs = [
  "Overview",
  "Eligibility",
  "Curriculum",
  "Fees",
  "Opportunities",
  "Application",
  "Reviews"  // Added new tab for reviews
];

const Coursesinfopage = () => {
  const { id } = useParams();
  const sectionRefs = tabs.map(() => useRef(null));
  const [isLiked, setIsLiked] = useState(false);

  const { data: courseData, isLoading, isError } = useQuery(
    ['course', id],
    () => getCoursesById(id),
    { 
      enabled: Boolean(id),
      retry: 2,
      staleTime: 5 * 60 * 1000
    }
  );

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userId');

  // Check if user has already liked this course
  useEffect(() => {
    if (courseData?.data?.likes && currentUserId) {
      const userHasLiked = courseData.data.likes.includes(currentUserId);
      setIsLiked(userHasLiked);
    }
  }, [courseData, currentUserId]);

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

  const handleLike = async () => {
    if (!currentUserId) {
      // Redirect to login or show login modal
      alert("Please login to like this course");
      return;
    }
    
    try {
      const likeValue = isLiked ? "0" : "1"; // Toggle like value
      
      // Call the like-dislike API
      await axiosInstance.post('http://localhost:4001/api/v1/like-dislike', {
        id: id,
        type: "course",
        like: likeValue
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
          'x-refresh-token': localStorage.getItem('refreshToken')
        }
      });
    
      // Update local state
      setIsLiked(!isLiked);
      console.log(`Course ${id} like status updated to ${!isLiked}`);
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

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

  // Calculate number of likes
  const likesCount = content.likes?.length || 0;

  return (
    <>
      <div className="container max-w-[1300px] mx-auto px-8 py-6 flex flex-col items-start bg-gray-50">
        {/* Course Title */}
        <div className="flex justify-between items-center w-full">
          <CoursesName content={content.courseTitle || 'Untitled Course'} />
          <div className="flex items-center gap-4">
              {/* Views Counter */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="font-medium">{content.views || 0}</span>
              </div>


              <SocialShare 
      title={content.courseTitle} 
      url={`${window.location.origin}/coursesinfopage/${id}`}
      contentType="course"
    />
              
           </div>
       
          <button 
            onClick={handleLike}
            disabled={!currentUserId }
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
              !currentUserId ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
              isLiked ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill={isLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth={isLiked ? "1" : "2"} 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform ${isLiked ? 'scale-110' : ''}`}
            >
              <path d="M14 9V5a3 3 0 0 0-3-3L7 6v12h11.28a2 2 0 0 0 1.94-1.52l1.16-5A2 2 0 0 0 19.44 9z"></path>
            </svg>
            <span className="font-medium">{likesCount > 0 && likesCount}</span>
          </button>
        </div>

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

            {/* Reviews Section - New */}
            <div ref={sectionRefs[6]} id="reviews" className="mb-6">
              <CourseReviewForm course={content}  />
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