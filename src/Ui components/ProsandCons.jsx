import React, { useState } from 'react';
import pros from "../assets/Images/pros.png";
import dislike from "../assets/Images/dislike.png";

const ProsandCons = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleMoreClick = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const course = {
    pros: [
      "Effective communication skills.",
      "Strong problem-solving abilities.",
      "Ability to work well in a team.",
      "Adaptability and flexibility."
    ],
    cons: [
      "Limited experience in certain areas.",
      "Occasional difficulty with time management.",
      "Tendency to overcommit to tasks.",
      "Need for further development in technical skills."
    ]
  };

  return (
    <div className="container !mt-4">
      <h2 className="text-2xl font-semibold mb-4">Pros and Cons</h2>
      <div className='flex h-full gap-4 flex-wrap mb-10'>
        <div className="flex-1 bg-red-100 min-w-[300px] rounded-lg border-red-500 p-4">
          <div className="flex items-center text-red-500 mb-2">
            <span className="material-icons "><img className='h-4' src={dislike} alt="" /></span>
            <h3 className="ml-2 font-bold">Dislikes</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {course.cons.map((con, index) => (
              <li key={index}>{con}</li>
            ))}
          </ul>
          <div className="flex justify-center">
            <button className="text-blue-500 mt-2" onClick={handleMoreClick}>More</button>
          </div>
        </div>

        <div className="flex-1 bg-green-100 min-w-[300px] rounded-xl border-green-500 p-4">
          <div className="flex items-center text-green-500 mb-2">
            <span className="material-icons"><img className='h-4' src={pros} alt="" /></span>
            <h3 className="ml-2 font-bold">Likes</h3>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {course.pros.map((pro, index) => (
              <li key={index}>{pro}</li>
            ))}
          </ul>
          <div className="flex justify-center">
            <button className="text-blue-500 mt-2" onClick={handleMoreClick}>More</button>
          </div>
        </div>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black z-20 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl mb-4">More Information</h2>
            <p>Here is more information about the pros and cons.</p>
            <button className="mt-4 text-blue-500" onClick={handleCloseOverlay}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsandCons;