import  { useEffect, useState } from 'react';
import PageBanner from '../Ui components/PageBanner';
import SearchResultInfo from '../Ui components/SearchResultInfo';
import ExpandedBox from '../Ui components/ExpandedBox';
import Filter from '../Ui components/Filter';
import SearchResultBox from '../Ui components/SearchResultBox';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import { useQuery } from 'react-query';
import { getInstitutes } from '../ApiFunctions/api';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SearchPage = () => {
  const tabs = [
    { id: "best-rated", label: "Best Rated" },
    { id: "most-popular", label: "Most Popular" },
    { id: "latest", label: "Latest" },
  ];

  const [activeFilter, setActiveFilter] = useState(tabs[0].id);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [value, setValue] = useState(null);
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [visibleItems, setVisibleItems] = useState(10); // Initially show 10 items
  const [totalDocuments, setTotalDocuments] = useState(0);
  const inputField = useSelector(store => store.input.inputField)
  // console.log("input field " + inputField)
  // console.log(content)


  const { data, isLoading, isError } = useQuery(
    ["institute"],
    () => getInstitutes(inputField,inputField),
    {
      enabled: true,
      onSuccess: (data) => {
        const { result, totalDocuments } = data.data;
        setContent(result);
        setFilteredContent(result);
        // console.log('result',result);
        setTotalDocuments(totalDocuments);
      }
    }
  );

  

  useEffect(() => {
    if (title && value && content.length > 0) {
      const filteredArray = content.filter(item => {
        const hasKey = item.hasOwnProperty(title);
        if (hasKey) {
          const fieldValue = item[title];
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(value);
          } else {
            return fieldValue === value;
          }
        }
        return false;
      });
      setFilteredContent(filteredArray);
    } else {
      setFilteredContent(content);
    }
  }, [title, value, content]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filterCategory, filterValue) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterCategory]: filterValue,
    }));
  };

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10); // Show 10 more items
  };

  const loadLess = () => {
    setVisibleItems(10); // Reset to initial 10 items
  };

  const contentData = [
    {
      title: "Introduction",
      content: `The Indian Institute of Technology Bombay (IIT Bombay), established in 1958, is one of India's premier engineering and research institutions.`,
    },
    {
      title: "Undergraduate Programs",
      content: `IIT Bombay offers a range of undergraduate programs, primarily in engineering, science, and design.`,
    },
    {
      title: "Admission Cutoffs",
      content: `The admission cutoffs for IIT Bombay are highly competitive.`,
    },
    {
      title: "Postgraduate Programs",
      content: `IIT Bombay offers diverse postgraduate programs, including M.Tech, MBA, MSc, and Ph.D.`,
    },
  ];

  const filterSections = [
    {
      title: "streams",
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
      title: "state",
      items: [
        "Rajasthan",
        "Karnataka",
        "Maharashtra",
        "Madhya Pradesh",
        "Uttar Pradesh",
        "Delhi",
        "Tamil Nadu"
      ],
    },
    {
      title: "city",
      items: [
        "Bangalore",
        "Indore",
        "Jaipur",
        "Mumbai",
        "Delhi",
      ],
    },
    {
      title: "specialization",
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
      title: "organisationType",
      items: ["Private", "Public"],
    },
    {
      title: "Ratings",
      items: ["5 stars", "4 stars", "3 stars", "2 stars", "1 star"],
    },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">{console.log("calling api")}</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading institutes</div>;
  }

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
            <Filter 
              filterSections={filterSections} 
              settitle={setTitle} 
              setvalue={setValue} 
            />
          </div>

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
                    {totalDocuments || "0"}
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

            {/* Display institutes */}
            {filteredContent?.slice(0, visibleItems).map((institute, index) => (
              <SearchResultBox key={institute._id || index} institute={institute} />
            ))}

            {/* "See More" button - show if there are more items to display */}
            {/* {visibleItems < filteredContent && (
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                >
                  See More
                </button>
              </div>
            )} */}

            {/* "See Less" button - show if expanded and there are more than 10 items */}
            {visibleItems > 10 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadLess}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                >
                  See Less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <BestRated />
      <Events />
    </>
  );
};

export default SearchPage;
