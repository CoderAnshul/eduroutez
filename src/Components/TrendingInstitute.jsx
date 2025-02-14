import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import { useQuery } from 'react-query';
import { trendingInstitute } from '../ApiFunctions/api';
const Images=import.meta.env.VITE_IMAGE_BASE_URL;

const TrendingInstitute = () => {
  const [content, setContent] = useState([]);

  const { data, isLoading, isError } = useQuery(
    ['institutes'],
    () => trendingInstitute(),
    {
      enabled: true,
      onSuccess: (data) => {
        setContent(data.data || []); // Ensure content is set to an empty array if data is null or undefined
      },
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading trending institutes.
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No trending institutes available.
      </div>
    );
  }

  return (
    <div className="w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold">Trending Institutes</h3>
        <Link to="/trending-institute">
          <button className="bg-red-500 text-white py-2 px-4 rounded">
            View more
          </button>
        </Link>
      </div>

      <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
        {(content?.length > 0) ? content.map((institute, index) => {
          if (index < 3) {
            return (
              <Link
              to={`/institute/${institute._id}`}
              key={institute._id || index}
              className="box lg:max-w-[500px] shadow-lg"
              >
              <div className="imageContainer">
                <img
                className="h-full w-full object-cover"
                src={
                  institute.thumbnailImage
                  ? `${Images}/${institute.thumbnailImage}`
                  : cardPhoto
                }
                alt="Institute"
                />
              </div>
              <div className="textContainer p-4">
                <h3 className="text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]">
                {institute.instituteName || 'Institute Name Not Available'}
                </h3>

                <p className="text-sm mt-2">
                {institute.about
                  ? <span dangerouslySetInnerHTML={{ __html: institute.about.slice(0, 100) + '...' }} />
                  : 'No description available'}
                </p>

               {/* {institute.maxFees && (
                <h3 className="flex items-center mt-2 text-2xl font-bold text-[#000000c4]">
                  <img className="h-5 mt-1 opacity-70" src={rupee} alt="rupee" />
                  {institute.maxFees}
                </h3>
                )}*/}
              </div>
              </Link>
            );
          }
          return null;
        }):
        <p>No trending institutes available</p>}
      </div>
    </div>
  );
};

export default TrendingInstitute;
