'use client';
import React, { useState, useMemo } from "react";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import rupee from "../assets/Images/rupee.png";
import CustomButton from "../Ui components/CustomButton";
import { useQuery } from "react-query";
import { allbestRatedInstitute } from "../ApiFunctions/api";
import HighRatedCareers from "../Components/HighRatedCareers";
import BlogComponent from "../Components/BlogComponent";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";


const BestRated = () => {
    const [content, setContent] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { data, isLoading, isError } = useQuery(
        ["institutes"],
        () => allbestRatedInstitute(),
        {
            enabled: true,
            onSuccess: (data) => {
                setContent(data.data || []);
            },
        }
    );

    // Paginate content client-side
    const paginatedContent = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return content.slice(0, startIndex + itemsPerPage);
    }, [content, currentPage]);

    const totalPages = Math.ceil(content.length / itemsPerPage);

    const handleLoadMore = () => {
        setCurrentPage(prevPage => 
            prevPage < totalPages ? prevPage + 1 : prevPage
        );
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
                Error loading best-rated institutes.
            </div>
        );
    }

    return (
        <>
        <div className="w-full min-h-44 max-w-[1420px] px-4 pb-10 mx-auto">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white p-16 text-center mb-8">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold leading-tight">
                        Unlock Your Potential with Top Best Rated Institute
                    </h1>
                    <p className="mt-4 text-lg">
                        Learn new skills, elevate your career, and achieve your dreams. Explore our Best Rated Institute!
                    </p>
                   
                </div>
            </div>

            <div className="boxWrapper w-full grid md:grid-cols-3 gap-6">
                {paginatedContent.length > 0 ? (
                    paginatedContent.map((box, index) => (
                        <Link
                            to={`/institute/${box._id}`}
                            key={index}
                            className="box w-full max-w-sm lg:max-w-[500px] shadow-lg"
                        >
                            <div className="imageContainer">
                                <img
                                    className="h-full w-full object-cover"
                                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${box.thumbnailImage || ""}`}
                                    alt="boxphoto"
                                />
                            </div>
                            <div className="textContainer p-4">
                                <h3 className="text-xl md:text-xl lg:text-2xl font-semibold text-[#0B104A]">
                                    {box.instituteName || "Institute Name Not Available"}
                                </h3>
                                <p className="text-sm mt-2">
                                    {box.about
                                        ? <span dangerouslySetInnerHTML={{ __html: box.about.slice(0, 100) + '...' }} />
                                        : "No information available"}
                                </p>
                                {box.maxFees && (
                                    <h3 className="flex items-center mt-2 text-2xl font-bold text-[#000000c4]">
                                        <img
                                            className="h-5 mt-1 opacity-70"
                                            src={rupee}
                                            alt="rupee"
                                        />
                                        {box.maxFees}
                                    </h3>
                                )}
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center w-full">No best-rated institutes available</p>
                )}
            </div>

            {currentPage < totalPages && (
                <div className="flex justify-center mt-8">
                    <CustomButton
                        text="View More"
                        onClick={handleLoadMore}
                        className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all"
                    />
                </div>
            )}
        </div>
        <HighRatedCareers></HighRatedCareers>
      <BlogComponent/> 
           <BestRated />
      
            <div className="w-full flex items-start  mt-10">
              <Events />
              <ConsellingBanner />
            </div>
        </>
    );
};

export default BestRated;