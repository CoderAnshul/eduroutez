import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import CustomButton from '../Ui components/CustomButton';
import {alltrendingInstitute, allbestRatedInstitute, getInstituteById, trendingInstitute } from '../ApiFunctions/api';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import BlogComponent from '../Components/BlogComponent';
import HighRatedCareers from '../Components/HighRatedCareers';
import Events from '../Components/Events';
import ConsellingBanner from '../Components/ConsellingBanner';

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const TrendingInstitute = () => {
    const [content, setContent] = useState([]);

    // Initialize window.instituteIdMap from localStorage on component mount
    useEffect(() => {
        if (!window.instituteIdMap) {
            try {
                const storedInstituteIdMap = JSON.parse(localStorage.getItem('instituteIdMap') || '{}');
                window.instituteIdMap = storedInstituteIdMap;
            } catch (error) {
                console.error('Error loading instituteIdMap from localStorage:', error);
                window.instituteIdMap = {};
            }
        }
    }, []);

    // Batch update the ID mapping when data arrives
    const updateIdMapping = (institutes) => {
        let hasChanges = false;
        
        institutes.forEach(institute => {
            if (institute.slug && institute._id && !window.instituteIdMap[institute.slug]) {
                window.instituteIdMap[institute.slug] = institute._id;
                hasChanges = true;
            }
        });
        
        // Only update localStorage if there are actual changes
        if (hasChanges) {
            localStorage.setItem('instituteIdMap', JSON.stringify(window.instituteIdMap));
        }
    };

    // Helper function to get URL for display - consistent with other components
    const getInstituteUrl = (institute) => {
        // Prefer slugs for SEO, fall back to IDs
        return institute?.slug 
            ? `/institute/${institute.slug}`
            : `/institute/${institute?._id}`;
    };

    const { data, isLoading, isError } = useQuery(
        ["institutes"],
        () => allbestRatedInstitute(),
        {
            enabled: true,
            onSuccess: (data) => {
                const institutes = data.data || [];
                setContent(institutes);
                
                // Update ID mapping
                if (institutes.length > 0) {
                    updateIdMapping(institutes);
                }
            }
        }
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Error Loading Institutes</h2>
                    <p>Unable to fetch trending institutes. Please try again later.</p>
                </div>
            </div>
        );
    }

    if (content.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                No trending institutes available
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold mb-4">Trending Institutes</h1>
                    <p className="text-xl">
                        Discover the most popular and in-demand educational institutions 
                        that are making waves in the academic world
                    </p>
                </div>

                <div className='w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto'>
                    <div className='flex items-center justify-between mb-10'>
                        <h3 className='text-xl font-bold'>Trending Institutes</h3>
                    </div>

                    <div className="boxWrapper w-full flex flex-col flex-wrap md:flex-row items-center gap-6">
                        {content.map((institute, index) => {
                            if(index < 3){
                                return (
                                    <Link 
                                        to={getInstituteUrl(institute)} 
                                        key={institute._id || index} 
                                        className="box lg:max-w-[500px] shadow-lg"
                                    >
                                        <div className="imageContainer">
                                            <img 
                                                className='h-full w-full object-cover'
                                                src={institute.thumbnailImage ? `${Images}/${institute.thumbnailImage}` : cardPhoto}
                                                alt="boxphoto" 
                                            />
                                        </div>
                                        <div className="textContainer">
                                            <h3 className='text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]'>
                                                {institute.instituteName}
                                            </h3>
                                            <span 
                                                dangerouslySetInnerHTML={{ 
                                                    __html: institute.about ? institute.about.slice(0, 100) + '...' : 'No description available'
                                                }} 
                                            />
                                            {institute.maxFees && (
                                                <h3 className='flex items-center mt-2 text-2xl font-bold text-[#000000c4]'>
                                                    <img className='h-5 mt-1 opacity-70' src={rupee} alt="rupee" />
                                                    {institute.maxFees}
                                                </h3>
                                            )}
                                        </div>
                                    </Link>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                <BlogComponent />
                <HighRatedCareers />
            </div>

            <div className="flex gap-4 flex-col sm:flex-row">
                <Events />
                <ConsellingBanner />
            </div>
        </>
    );
};

export default TrendingInstitute;