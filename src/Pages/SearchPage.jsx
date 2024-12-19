import React, { useState } from 'react';
import PageBanner from '../Ui components/PageBanner';
import SearchResultInfo from '../Ui components/SearchResultInfo';
import ExpandedBox from '../Ui components/ExpandedBox';
import Filter from '../Ui components/Filter';
import SearchResultBox from '../Ui components/SearchResultBox';
import serachBoximg from "../assets/Images/serachBoximg.jpg";
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import { useQuery, useQueryClient } from 'react-query';
import { getInstitutes } from '../ApiFunctions/api';

const SearchPage = () => {
  const tabs = [
    { id: "best-rated", label: "Best Rated" },
    { id: "most-popular", label: "Most Popular" },
    { id: "latest", label: "Latest" },
  ];

  const [activeFilter, setActiveFilter] = useState(tabs[0].id);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [contentVisibility, setContentVisibility] = useState({});
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [organisationType, setOrganisationType] = useState("");
  const queryClient = useQueryClient();

  console.log( state);

  const { data, isLoading, isError, error  } = useQuery(
    ["institutes", state, city, organisationType],
    () => getInstitutes(state, city, organisationType),
    {
      enabled:true,
    }
  );

  console.log(data);
  

  const toggleFilter = () => {                                             
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filterCategory, filterValue) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: filterValue,
    }));
  };

  const toggleContentVisibility = (index) => {
    setContentVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const contentData = [
    {
      title: "Introduction",
      content: `The Indian Institute of Technology Bombay (IIT Bombay), established in 1958, is one of India's premier engineering and research institutions. Known for its academic excellence and vibrant campus life, IIT Bombay has consistently been ranked among the top institutions in India and globally. The institute offers a dynamic environment that fosters innovation, creativity, and entrepreneurship.`,
    },
    {
      title: "Undergraduate Programs",
      content: `IIT Bombay offers a range of undergraduate programs, primarily in engineering, science, and design. Admissions to these programs are based on the Joint Entrance Examination Advanced (JEE Advanced), one of the toughest engineering entrance exams in the world. The Bachelor of Technology (B.Tech) program remains the most sought-after course at IIT Bombay.`,
    },
    {
      title: "Admission Cutoffs",
      content: `The admission cutoffs for IIT Bombay are highly competitive. For instance, in 2023, the JEE Advanced cutoff for the Computer Science and Engineering program was among the lowest ranks in the country, typically under 70 in the general category. Cutoffs vary significantly for other branches like Electrical, Mechanical, and Civil Engineering.`,
    },
    {
      title: "Postgraduate Programs",
      content: `IIT Bombay offers diverse postgraduate programs, including M.Tech, MBA, MSc, and Ph.D. The admissions for M.Tech programs are primarily based on GATE (Graduate Aptitude Test in Engineering) scores, while MBA admissions are conducted through CAT (Common Admission Test). The institute is also renowned for its research opportunities, providing a world-class platform for innovation and exploration.`,
    },
  ];
  

  const filterSections = [
    {
      title: "Stream",
      items: [
        "Computer Science Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering",
        "Information Technology",
        "Chemical Engineering",
        "Aerospace Engineering",
      ],
    },
    {
      title: "States",
      items: [
        "Rajasthan",
        "Karnataka",
        "Maharashtra",
        "Madhya Pradesh",
        "Assam",
        "Delhi",
      ],
    },
    {
      title: "Cities",
      items: [
        "Bangalore",
        "Indore",
        "Jaipur",
        "Ahmedabad",
        "Delhi",
      ],
    },
    {
      title: "Specialization",
      items: [
        "Health Information Administration",
        "Finance",
        "Sales & Marketing",
        "Human Resources",
        "International Business",
        "IT & Systems",
      ],
    },
    {
      title: "Total Fees",
      items: ["> 5 Lakh"],
    },
    {
      title: "Exam",
      items: ["Jee Mains", "CAT", "GATE", "BITSAT"],
    },
    {
      title: "Ownership",
      items: ["Private", "Public"],
    },
    {
      title: "Ratings",
      items: ["5 stars", "4 stars", "3 stars", "2 stars", "1 star"],
    },
  ];

  const colleges = [
    {
      name: "IIT Madras",
      rank: "#2",
      rating: 4.1,
      reviews: 8,
      location: "India",
      type: "private",
      fees: "5,000 - 2,00,000",
      accreditation: "AICTE",
      averageSalary: "9 Lacs",
      entranceExam: "CAT",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: serachBoximg,
    },
    {
      name: "IIT Bombay",
      rank: "#3",
      rating: 4.3,
      reviews: 15,
      location: "India",
      type: "private",
      fees: "10,000 - 2,50,000",
      accreditation: "AICTE",
      averageSalary: "10 Lacs",
      entranceExam: "JEE Advanced",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: serachBoximg,
    },
    {
      name: "IIT Delhi",
      rank: "#4",
      rating: 4.2,
      reviews: 10,
      location: "India",
      type: "private",
      fees: "12,000 - 2,00,000",
      accreditation: "AICTE",
      averageSalary: "8 Lacs",
      entranceExam: "JEE Advanced",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: serachBoximg,
    },
  ];

  return (
    <>
      <PageBanner pageName="Search" currectPage="Search" />
      <div className="px-[4vw] pb-[2vw] flex flex-col items-start">
        <SearchResultInfo />
        <div className="border-2 mt-3 border-opacity-65 px-4 shadow-lg rounded-lg pt-3 border-gray-300 pb-1 w-full">
          <ExpandedBox contentData={contentData} />
        </div>

        <div className="flex gap-4 w-full mt-14 relative">
          <div className="filters w-[25%] mt-14 hidden lg:block">
            <Filter filterSections={filterSections} onFilterChange={handleFilterChange} setState={setState} setCity={setCity} setOrganisationType={setOrganisationType} />
          </div>

          {isFilterOpen && (
            <div
              className="md:hidden fixed top-0 left-0 w-[75%] h-full bg-white z-[1000] shadow-lg p-4 overflow-y-auto transition-transform transform ease-in-out duration-300"
              style={{ transform: 'translateX(0)' }}
            >
              <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={toggleFilter} className="text-red-500">
                  Close
                </button>
              </div>
              <Filter filterSections={filterSections} onFilterChange={handleFilterChange} />
            </div>
          )}

          <div className={`filterResult w-full ${isFilterOpen ? 'lg:w-[75%]' : 'lg:w-[75%]'}`}>
            <div className="flex flex-col py-4 px-2 border-b">
              <button
                onClick={toggleFilter}
                className="lg:hidden max-w-28 bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Filter
              </button>
              <div className="flex items-center justify-between mt-3 flex-wrap whitespace-nowrap w-full">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold text-red-500">
                    {data?.data?.result?.length || "0"}
                  </span>{" "}
                  Institutes
                </div>
                <div className="flex border-2 border-opacity-15">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`text-xs md:text-sm py-2 px-3 ${
                        tab.id !== tabs[tabs.length - 1].id ? 'border-r-2' : ''
                      } border-opacity-15 font-medium transition-colors ${
                        activeFilter === tab.id
                          ? 'text-red-500 border-red-500 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {data?.data?.result?.map((institute, index) => (
              <SearchResultBox key={institute._id || index} institute={institute} />
            ))}
          </div>
        </div>
      </div>
      <BestRated />
      <Events />
    </>
  );
};

export default SearchPage;

