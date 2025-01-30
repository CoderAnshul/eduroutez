import React, { useState } from 'react'
import PageBanner from '../Ui components/PageBanner'
import BlogandCareerBox from '../Ui components/BlogandCareerBox'
import Events from '../Components/Events'
import ConsellingBanner from '../Components/ConsellingBanner'
import PopularCourses from '../Components/PopularCourses'
import { useQuery } from 'react-query'
import { blogs } from '../ApiFunctions/api'
import axios from 'axios'

const Blogpage = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const baseURL = import.meta.env.VITE_BASE_URL;
    // Fetch blogs
    const { data: blogData, isLoading: blogLoading, isError: blogError, error: blogFetchError } = useQuery(
      ['blogs'], 
      blogs,
      { enabled: true }
    );

    // Fetch categories
    const { data: categoryData, isLoading: categoryLoading, isError: categoryError } = useQuery(
      ['blog-categories'],
      async () => {
        const response = await axios.get(`${baseURL}/blog-category`);
        console.log('cat',response.data);
        return response.data;
      },
      { enabled: true }
    );

    const handleCategoryChange = (category) => {
        if (!category) return;
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    };
  
    if (blogLoading || categoryLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (blogError || categoryError) {
        return <div className="min-h-screen flex items-center justify-center">
            Error: {blogFetchError?.message || 'Something went wrong'}
        </div>;
    }

    if (!blogData?.data) {
        return <div className="min-h-screen flex items-center justify-center">
            No blog data available
        </div>;
    }

    const categories = categoryData?.data?.result || [];

    const filteredBlogData = selectedCategories.length > 0
        ? blogData?.data?.result?.filter((blog) =>
            blog && blog.category && selectedCategories.includes(blog.category)
        )
        : blogData?.data?.result;

    const handleSearch = (searchTerm) => {
        if (!searchTerm || !blogData?.data?.result) return;
        
        const term = searchTerm.toLowerCase().trim();
        setSelectedCategories(
            blogData.data.result
                .filter((blog) =>
                    blog?.title?.toLowerCase()?.includes(term)
                )
                .map((blog) => blog?.category)
                .filter(Boolean)
        );
    };

    return (
        <>
            <PageBanner pageName="Blog" currectPage="blog" />
            
            {/* Filter button for mobile */}
            <button
                className="mx-[20px] mt-[30px] z-[500] bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg md:hidden"
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
                                    className="form-checkbox h-5 w-5 text-blue-500"
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
                <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border-2 border-gray-300 rounded-lg"
                            onChange={(e) => handleSearch(e.target.value)}
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
                 <BlogandCareerBox 
                            blogData={blogData || []} 
                        />
                </div>
            </div>

            <PopularCourses />
            <div className="flex gap-2 items-center">
                <Events />
                <ConsellingBanner />
            </div>
        </>
    )
}

export default Blogpage