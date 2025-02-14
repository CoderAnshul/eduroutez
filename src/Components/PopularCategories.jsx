import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { category } from '../ApiFunctions/api';

const PopularCategories = () => {
  const [content, setContent] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery(
    ['category'],
    () => category(),
    {
      enabled: true,
      onSuccess: (data) => {
        const { result } = data.data;
        setContent(result || []);
      },
    }
  );

  const handleCategoryClick = (categoryName) => {
    // Navigate to search page with category as query parameter
    navigate(`/searchpage?stream=${encodeURIComponent(categoryName)}`);
  };

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
        Error loading category
      </div>
    );
  }

  return (
    <div className="gradient-background flex flex-wrap flex-col items-center justify-center text-center min-h-96 w-full p-2 lg:p-8">
      <h1 className="text-3xl lg:text-4xl flex flex-col items-center justify-center text-center text-[#0B104A] font-semibold mb-5">
        Find Out by Popular Categories
      </h1>
      <p className="text-sm md:w-[50%]">
        We offer a brand new approach to the most basic learning paradigms. Choose from a wide range of learning options and gain new skills! Our school is known for its quality education.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 lg:max-w-[1100px] justify-center">
        {content.length > 0 ? (
          content
            .filter(category => category.status === true)
            .map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className="h-12 py-2 px-2 md:px-3 md:max-w-auto flex flex-1 max-w-fit gap-1 whitespace-nowrap items-center rounded-full bg-white hover:bg-gray-100 transition-colors"
              >
                <h4 className="text-xs md:text-md">
                  {category.name || 'Category Name Not Available'}
                </h4>
              </button>
            ))
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
};

export default PopularCategories;