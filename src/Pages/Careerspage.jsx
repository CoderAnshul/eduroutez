import React, { useState, useEffect } from "react";
import PageBanner from "../Ui components/PageBanner";
import CustomButton from "../Ui components/CustomButton";
import { useQuery } from "react-query";
import { careers } from "../ApiFunctions/api";
import PopularCourses from "../Components/PopularCourses";
import BlogComponent from "../Components/BlogComponent";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import axios from "axios";

const fetchImage = async (imagePath) => {
  try {
    const response = await axios.get(`http://localhost:4001/api/uploads/${imagePath}`, {
      responseType: 'blob'
    });
    // Create URL immediately and store it
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

const Careerspage = () => {
  const [imageUrls, setImageUrls] = useState({});

  const { data: careerData, isLoading, isError, error } = useQuery(
    ["careers"],
    () => careers(),
    { enabled: true }
  );

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData =
    selectedCategories.length > 0
      ? careerData?.data.result.filter((career) =>
          selectedCategories.includes(career.category)
        )
      : careerData?.data.result;

  // Use effect to handle image loading
  useEffect(() => {
    const loadImages = async () => {
      if (filteredData) {
        const imagePromises = filteredData.map(async (career) => {
          if (!imageUrls[career.image]) {  // Only fetch if we don't have the URL already
            const url = await fetchImage(career.image);
            return { [career.image]: url };
          }
          return null;
        });

        const results = await Promise.all(imagePromises);
        const newUrls = results.reduce((acc, result) => {
          return result ? { ...acc, ...result } : acc;
        }, {});

        setImageUrls(prev => ({ ...prev, ...newUrls }));
      }
    };

    loadImages();

    // Cleanup function to revoke object URLs
    return () => {
      Object.values(imageUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [filteredData]); // Add filteredData as dependency

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <PageBanner pageName="Career Opportunity" currectPage="career opportunity" />
      
      {/* Filter button for mobile */}
      <button
        className="mx-[20px] mt-[30px] z-[500] bg-blue-600 text-white rounded-lg px-4 py-2 shadow-lg md:hidden"
        onClick={() => setIsFilterOpen(true)}
      >
        Filters
      </button>

      {/* Sidebar Overlay */}
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
            {[
              "Agriculture",
              "Technology",
              "Business",
              "Healthcare",
              "Engineering",
              "Design",
              "Education",
              "Marketing",
            ].map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 cursor-pointer transition-all duration-200"
              >
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="text-base font-medium">{category}</span>
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
      <div className={`flex px-[4vw] pt-5 mb-14 ${isFilterOpen ? "pointer-events-none" : ""}`}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border-2 border-gray-300 rounded-lg"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                setSelectedCategories(
                  careerData?.data.result
                    .filter((career) =>
                      career.title.toLowerCase().includes(searchTerm)
                    )
                    .map((career) => career.category)
                );
              }}
            />
          </div>
          <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-lg p-3">
            {[
              "Agriculture",
              "Technology",
              "Business",
              "Healthcare",
              "Engineering",
              "Design",
              "Education",
              "Marketing",
            ].map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 hover:ml-1 transition-all hover:text-red-500 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-3/4 px-6">
          <div className="flex flex-wrap justify-start gap-6">
            {filteredData?.map((career) => (
              <div
                key={career._id}
                className="max-w-sm flex-1 min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  {!imageUrls[career.image] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p>Loading image...</p>
                    </div>
                  ) : (
                    <img
                      src={imageUrls[career.image]}
                      alt={career.title}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{career.title}</h3>
                  <p
                    className="text-sm text-gray-600 mt-2"
                    dangerouslySetInnerHTML={{
                      __html: career.description
                        .split(" ")
                        .slice(0, 25)
                        .join(" ") + (career.description.split(" ").length > 25 ? "..." : "")
                    }}
                  />
                  <div className="inline-block !mx-auto !mt-2">
                    <CustomButton text="View More" to={`/detailpage/${career._id}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PopularCourses />
      <BlogComponent />
      <div className="flex gap-2 items-center">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default Careerspage;