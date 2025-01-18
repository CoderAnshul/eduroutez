import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import cardPhoto from '../assets/Images/teacher.jpg';
import rupee from '../assets/Images/rupee.png';
import CustomButton from '../Ui components/CustomButton';
import { useQuery } from 'react-query';
import { AllpopularCourses } from '../ApiFunctions/api';

const PopularCourses = () => {
    const [content, setContent] = useState([]);
    const [images, setImages] = useState({});
    const { data, isLoading, isError } = useQuery(
        ["popularCourses"],
        () => AllpopularCourses(),
        {
            enabled: true,
            onSuccess: (data) => {
                setContent(data.data.result);
            },
        }
    );

    useEffect(() => {
        const fetchImages = async () => {
            const imagePromises = content.map(async (box) => {
                const response = await fetch(`${import.meta.env.VITE_IMAGE_BASE_URL}/${box.coursePreviewThumbnail}`);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                return { id: box.id, url };
            });

            const imageResults = await Promise.all(imagePromises);
            const imageMap = imageResults.reduce((acc, image) => {
                acc[image.id] = image.url;
                return acc;
            }, {});

            setImages(imageMap);
        };

        if (content.length > 0) {
            fetchImages();
        }
    }, [content]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-screen">Error loading popular courses</div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold leading-tight">
                        Unlock Your Potential with Top Courses
                    </h1>
                    <p className="mt-4 text-lg">
                        Learn new skills, elevate your career, and achieve your dreams. Explore our popular courses today!
                    </p>
                    <CustomButton
                        text="Explore Now"
                        className="mt-6 bg-white text-red-800 px-8 py-3 rounded-lg shadow-md hover:bg-red-100 transition-all"
                    />
                </div>
            </div>

            {/* Popular Courses Section */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-bold">Popular Courses</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.map((box) => (
                        <Link
                            to={`/coursesinfopage/${box._id}`}
                            key={box._id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <div className="relative">
                                <img
                                    className="h-48 w-full object-cover"
                                    src={images[box._id] || cardPhoto}
                                    alt="course-thumbnail"
                                />
                                {box.isCourseFree && (
                                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Free
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {box.courseTitle}
                                </h3>
                                <p
                                    className="text-sm text-gray-600 mt-2 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: box.longDescription }}
                                ></p>
                                <div className="flex items-center justify-between mt-4">
                                    <h3 className="flex items-center text-lg font-bold text-gray-900">
                                        <img className="h-5 mr-2" src={rupee} alt="rupee" />
                                        {box.isCourseFree ? "Free" : box.price}
                                    </h3>
                                    <Stack spacing={1}>
                                        <Rating name="read-only" value={box.rating || 0} readOnly />
                                    </Stack>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularCourses;
