import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import PageBanner from '../Ui components/PageBanner';
import BlogandCareerBox from '../Ui components/BlogandCareerBox';
import Events from '../Components/Events';
import ConsellingBanner from '../Components/ConsellingBanner';
import PopularCourses from '../Components/PopularCourses';
import HighRatedCareers from '../Components/HighRatedCareers';

const Blogpage = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const itemsPerPage = 8;

    const baseURL = import.meta.env.VITE_BASE_URL;

    // Fetch all blogs at once
    const { data: blogData, isLoading: blogLoading, isError: blogError, error: blogFetchError } = useQuery(
        ['all-blogs'],
        async () => {
            const response = await axios.get(`${baseURL}/blogs?sort={"createdAt":"desc"}`, {
                params: {
                    limit: 1000 // Fetch a large number of blogs
                }
            });
            return response.data;
        },
        { enabled: true }
    );

    // Fetch categories
    const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useQuery(
        ['blog-categories'],
        async () => {
            const response = await axios.get(`${baseURL}/blog-category`);
            return response.data;
        },
        { enabled: true }
    );

    // Filter and paginate data
    useEffect(() => {
        if (!blogData?.data?.result) return;

        let filtered = blogData.data.result;

        // Apply category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(blog => 
                blog && blog.category && selectedCategories.includes(blog.category)
            );
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(blog =>
                blog?.title?.toLowerCase()?.includes(term) ||
                blog?.category?.toLowerCase()?.includes(term)
            );
        }

        setFilteredData(filtered);
        setPage(1); // Reset to first page when filters change
    }, [blogData, selectedCategories, searchTerm]);

    const handleCategoryChange = (category) => {
        if (!category) return;
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo(0, 0);
    };

    if (blogLoading || categoryLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (blogError || categoryError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Error: {blogFetchError?.message || 'Something went wrong'}
            </div>
        );
    }

    const categories = categoryData?.data?.result || [];
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current page items
    const currentItems = filteredData.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded-md ${
                        page === 1 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    Previous
                </button>
                
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 rounded-md hover:bg-gray-200"
                        >
                            1
                        </button>
                        {startPage > 2 && <span>...</span>}
                    </>
                )}

                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-1 rounded-md ${
                            page === number 
                            ? 'bg-red-600 text-white' 
                            : 'hover:bg-gray-200'
                        }`}
                    >
                        {number}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span>...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1 rounded-md hover:bg-gray-200"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded-md ${
                        page === totalPages 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <>
            <PageBanner pageName="Blog" currectPage="blog" />
            
            {/* Filter button for mobile */}
            <button
                className="mx-[20px] mt-[30px] z-[500] bg-red-600 text-white rounded-lg px-4 py-2 shadow-lg md:hidden"
                onClick={() => setIsFilterOpen(true)}
            >
                Filters
            </button>

            {/* Sidebar Overlay for Mobile */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-[10001] flex transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div
                    className={`w-3/4 bg-white p-4 rounded-lg shadow-md transform transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <button
                        className="text-gray-800 font-bold text-xl mb-4"
                        onClick={() => setIsFilterOpen(false)}
                    >
                        X
                    </button>
                    <h3 className="text-lg font-semibold mb-6">Filter by Category</h3>
                    <div className="space-y-4">
                        {categories.map((category) => category && (
                            <label
                                key={category._id}
                                className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer transition-all duration-200"
                            >
                                <input
                                    type="checkbox"
                                    value={category.name}
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                    className="form-checkbox h-5 w-5 text-red-500"
                                />
                                <span className="text-base font-medium">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div
                    className="flex-grow cursor-pointer"
                    onClick={() => setIsFilterOpen(false)}
                ></div>
            </div>

            {/* Main Content */}
            <div className={`flex px-[4vw] pb-[2vw] mt-10 ${isFilterOpen ? "pointer-events-none" : ""}`}>
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md sticky top-20 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border-2 border-gray-300 rounded-lg"
                            onChange={(e) => handleSearch(e.target.value)}
                            value={searchTerm}
                        />
                    </div>
                    <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3">
                        {categories.map((category) => category && (
                            <label
                                key={category._id}
                                className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    value={category.name}
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-3/4 pl-6">
                    {/* Display selected categories as red badges */}
                    <div className="mb-4">
                        {selectedCategories.map((category) => (
                            <span key={category} className="inline-block bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                {category}
                            </span>
                        ))}

                        
                    </div>
                    <BlogandCareerBox blogData={currentItems || []} />
                    <Pagination />
                </div>
            </div>

            <PopularCourses />
            <HighRatedCareers />
            <div className="flex gap-2 items-center">
                <Events />
                <ConsellingBanner />
            </div>
        </>
    );
};

export default Blogpage;