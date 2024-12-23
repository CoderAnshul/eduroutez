import React, { useEffect, useState } from 'react';
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
  // const [city, setCity] = useState("");
  // const [state, setState] = useState("");
  // const [organisationType, setOrganisationType] = useState("");
  const [title, settitle] = useState(null)
  const [value, setvalue] = useState(null)

  const queryClient = useQueryClient();

  // console.log( state);

  const { data, isLoading, isError, error  } = useQuery(
    ["institutes"],
    () => getInstitutes(),
    {
      enabled:true,
    }
  );
  console.log(data);

  const [content, setcontent] = useState([]);
  const [filteredContent, setfilteredContent] = useState([]);

  useEffect(() => {
    const result=data?.data?.result;
    setcontent(result);
    setfilteredContent(result);
  }, [data])

  // useEffect(() => {
  //   for(let i=0;i<content.length;i++){
  //     filterSections[1].items.push(content[i]?.state);
  //     //same for specialization
  //   }
  //   console.log(filterSections[1]);
  // }, [content])
  
  
  

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




  useEffect(() => {
    console.log("Title:", title);
    console.log("Value:", value);
    console.log("Initial filteredContent:", filteredContent);
    
    if (title && value && filteredContent.length > 0) {
      const filteredArray = filteredContent.filter(item => {
        const hasKey = item.hasOwnProperty(title);
        
        if (hasKey) {
          const fieldValue = item[title];
          
          // Check if the field value is an array
          if (Array.isArray(fieldValue)) {
            // Check if the array includes the specified value
            return fieldValue.includes(value);
          } else {
            // Otherwise, perform a direct equality check
            return fieldValue === value;
          }
        }
        
        return false;
      });
  
      console.log("Filtered Array:", filteredArray);
      setfilteredContent(filteredArray);
    }
  
    if (title === null || value === null) {
      setfilteredContent(content);
    }
  }, [title, value]); // Dependencies
  
  
  

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
            <Filter filterSections={filterSections} settitle={settitle} setvalue={setvalue} />
          </div>

          {/* {isFilterOpen && (
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
          )} */}

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
                    {content?.length || "0"}
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
            {filteredContent?.map((institute, index) => (
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


