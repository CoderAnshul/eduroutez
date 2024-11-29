import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import CustomButton from './CustomButton';


const BlogandCareerBox = ({ boxData }) => {
  return (
    <div className="flex flex-wrap justify-start gap-6">
      {boxData.map((box, index) => (
        <div key={index} className="max-w-sm flex-1 min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <img src={box.imgSrc} alt={box.title} className="w-full h-48 rounded-xl object-cover" />
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800">{box.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{box.description}</p>
            <div  className="inline-block !mx-auto !mt-2">
              <CustomButton text="View More" to={box.link} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogandCareerBox;
