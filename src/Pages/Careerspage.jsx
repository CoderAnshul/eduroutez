import React, { useState } from "react";
import PageBanner from "../Ui components/PageBanner";
import CustomButton from "../Ui components/CustomButton";
import { useQuery } from "react-query";
import { careers } from "../ApiFunctions/api";
import PopularCourses from "../Components/PopularCourses";
import BlogComponent from "../Components/BlogComponent";
import Events from "../Components/Events";
import ConsellingBanner from "../Components/ConsellingBanner";
import img1 from "../assets/Images/img1.png";
import img2 from "../assets/Images/img2.png";
import img3 from "../assets/Images/img3.png";
import img4 from "../assets/Images/img4.png";

const boxData = [
  { title: "Agriculture", imgSrc: img1, category: "Agriculture", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Technology", imgSrc: img2, category: "Technology", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Business", imgSrc: img3, category: "Business", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Healthcare", imgSrc: img4, category: "Healthcare", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Engineering", imgSrc: img1, category: "Engineering", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Design", imgSrc: img1, category: "Design", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Education", imgSrc: img1, category: "Education", description: "Lorem ipsum...", link: "/detailpage" },
  { title: "Marketing", imgSrc: img1, category: "Marketing", description: "Lorem ipsum...", link: "/detailpage" },
];

const Careerspage = () => {
  const { data: careerData, isLoading, isError, error } = useQuery(
    ["blogs"],
    () => careers(),
    { enabled: true }
  );

  console.log(careerData);
  

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const filteredData =
    selectedCategories.length > 0
      ? boxData.filter((box) =>
          selectedCategories.includes(box.category)
        )
      : boxData;

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
                  boxData
                    .filter((box) =>
                      box.title.toLowerCase().includes(searchTerm)
                    )
                    .map((box) => box.category)
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
            {filteredData.map((box, index) => (
              <div
                key={index}
                className="max-w-sm flex-1 min-w-[300px] bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={box.imgSrc}
                    alt={box.title}
                    className="w-full h-48 rounded-xl object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{box.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{box.description}</p>
                  <div className="inline-block !mx-auto !mt-2">
                    <CustomButton text="View More" to={box.link} />
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
