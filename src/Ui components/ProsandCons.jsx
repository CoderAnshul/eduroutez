import React, { useState } from 'react';
import prosIcon from "../assets/Images/pros.png";
import dislikeIcon from "../assets/Images/dislike.png";
import parse from 'html-react-parser';

const ProsandCons = ({ course }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayContent, setOverlayContent] = useState("");

  const handleMoreClick = (type) => {
    setOverlayContent(type === "pros" ? course.pros || "No additional information available." : course.cons || "No additional information available.");
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const defaultPros = [
    "Effective communication skills.",
    "Strong problem-solving abilities.",
    "Ability to work well in a team.",
    "Adaptability and flexibility."
  ];

  const defaultCons = [
    "Limited experience in certain areas.",
    "Occasional difficulty with time management.",
    "Tendency to overcommit to tasks.",
    "Need for further development in technical skills."
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-2xl font-semibold mb-4">Pros and Cons</h2>
      <div className='flex h-full gap-4 flex-wrap mb-10'>
        <div className="flex-1 bg-red-100 min-w-[300px] rounded-lg border-red-500 p-4">
          <div className="flex items-center text-red-500 mb-2">
            <img className='h-4' src={dislikeIcon} alt="Dislikes" />
            <h3 className="ml-2 font-bold">Dislikes</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {course?.cons ? parse(course.cons) : defaultCons.map((con, index) => <li key={index}>{con}</li>)}
          </ul>
          <div className="flex justify-center">
            <button className="text-blue-500 mt-2" onClick={() => handleMoreClick("cons")}>More</button>
          </div>
        </div>

        <div className="flex-1 bg-green-100 min-w-[300px] rounded-xl border-green-500 p-4">
          <div className="flex items-center text-green-500 mb-2">
            <img className='h-4' src={prosIcon} alt="Likes" />
            <h3 className="ml-2 font-bold">Likes</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {course?.pros ? parse(course.pros) : defaultPros.map((pro, index) => <li key={index}>{pro}</li>)}
          </ul>
          <div className="flex justify-center">
            <button className="text-blue-500 mt-2" onClick={() => handleMoreClick("pros")}>More</button>
          </div>
        </div>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black z-20 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-lg">
            <h2 className="text-2xl mb-4">More Information</h2>
            <div className="text-gray-700">{parse(overlayContent)}</div>
            <button className="mt-4 text-blue-500" onClick={handleCloseOverlay}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsandCons;
