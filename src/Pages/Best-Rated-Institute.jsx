import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import { Link } from 'react-router-dom';
import CustomButton from '../Ui components/CustomButton';
import { useQuery } from 'react-query';
import { allbestRatedInstitute } from '../ApiFunctions/api';

const BestRatedInstitute = () => {
    const [content, setContent] = useState([]);
    const { data, isLoading, isError } = useQuery(
        ["institutes"],
        () => allbestRatedInstitute(),
        {
            enabled: true,
            onSuccess: (data) => {
                setContent(data.data);
            }
        }
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-screen">Error loading best-rated institutes</div>;
    }

    return (
        <div className="w-full  text-white pb-16">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-20  bg-gradient-to-b from-red-600 to-red-800  text-center">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    Best Rated Institutes
                </h1>
                <p className="mt-4 text-lg md:text-xl font-light">
                    Explore the top-rated institutes tailored for your success.
                </p>
                <CustomButton
                    text="Explore More"
                    className="mt-6 bg-white text-red-800 px-8 py-3 rounded-lg shadow-md hover:bg-red-100 transition-all"
                />
            </div>

            {/* Card Section */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">Our Top Picks</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.slice(0, 5).map((box, index) => (
                        <Link
                        to={`/institute/${box._id}`}                 
                                    key={index}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
                        >
                            {/* Image Section */}
                            <div className="h-48">
                                <img
                                    className="h-full w-full object-cover"
                                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${box.brochure}`}
                                    alt={box.instituteName}
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {box.instituteName}
                                </h3>
                                <p className="text-sm text-gray-600 mt-3">
                                    {box.collegeInfo.slice(0, 80)}...
                                </p>

                                {/* Rating Section */}
                                <div className="flex items-center mt-4">
                                    <Rating value={box.rating || 0} readOnly />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BestRatedInstitute;
