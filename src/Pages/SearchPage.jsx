import { useEffect, useState } from 'react';
import PageBanner from '../Ui components/PageBanner';
import ExpandedBox from '../Ui components/ExpandedBox';
import SearchResultBox from '../Ui components/SearchResultBox';
import Filter from '../Ui components/Filter';
import BestRated from '../Components/BestRated';
import Events from '../Components/Events';
import axios from 'axios';
import BlogComponent from '../Components/BlogComponent';
import HighRatedCareers from '../Components/HighRatedCareers';
import { useQuery } from 'react-query';
import { getInstitutes } from '../ApiFunctions/api';
import { useSelector } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import Promotions from './CoursePromotions';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [streams, setStreams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set the number of items per page
  const inputField = useSelector(store => store.input.inputField);
  const [initialFilterApplied, setInitialFilterApplied] = useState(false);

  const baseURL = import.meta.env.VITE_BASE_URL;
  
  // Get URL parameters
  const streamFromUrl = searchParams.get('stream');
  const stateFromUrl = searchParams.get('state');
  const cityFromUrl = searchParams.get('city');

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

  // This effect handles location changes and URL parameters
  useEffect(() => {
    setCurrentPage(1);
    setInitialFilterApplied(false);
    
    // Build initial filters from URL parameters
    const initialFilters = {};
    
    if (streamFromUrl) {
      const streamValues = streamFromUrl.split(',').map(s => s.trim());
      initialFilters.streams = streamValues;
    }
    
    if (stateFromUrl) {
      initialFilters.state = [stateFromUrl];
    }
    
    if (cityFromUrl) {
      initialFilters.city = [cityFromUrl];
    }
    
    // Apply URL filters or fetch default data
    if (Object.keys(initialFilters).length > 0) {
      setSelectedFilters(initialFilters);
      fetchFilteredInstitutes(initialFilters, 1, itemsPerPage);
    } else {
      // If no URL parameters, fetch default data and reset filters
      setSelectedFilters({});
      setLoading(true);
      getInstitutes(inputField, inputField, inputField, inputField)
        .then(data => {
          const { result, totalDocuments } = data.data;
          setContent(result);
          setFilteredContent(result);
          setTotalDocuments(totalDocuments);
          
          if (result && result.length > 0) {
            updateIdMapping(result);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching institutes:', error);
          setFetchError(true);
          setLoading(false);
        });
    }
  }, [location.key, streamFromUrl, stateFromUrl, cityFromUrl]);

  const updateIdMapping = (institutes) => {
    let hasChanges = false;
    
    institutes.forEach(institute => {
      if (institute.slug && institute._id && !window.instituteIdMap[institute.slug]) {
        window.instituteIdMap[institute.slug] = institute._id;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      localStorage.setItem('instituteIdMap', JSON.stringify(window.instituteIdMap));
    }
  };

  const getInstituteUrl = (institute) => {
    return institute?.slug 
      ? `/institute/${institute.slug}`
      : `/institute/${institute?._id}`;
  };

  const { data: streamsData } = useQuery(
    ["streams"],
    async () => {
      const response = await axios.get(`${baseURL}/streams`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const streamNames = data.data?.result
          ?.filter(stream => stream.status)
          ?.map(stream => stream.name) || [];
        setStreams(streamNames);
      },
    }
  );

  // Apply URL filters to UI once streams data is loaded
  useEffect(() => {
    if (!initialFilterApplied && streams.length > 0 && streamFromUrl && streams.includes(streamFromUrl)) {
      // Apply the filter in UI without triggering another fetch
      setInitialFilterApplied(true);
    }
  }, [streams, streamFromUrl, initialFilterApplied]);

  const staticStateLocations = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];

  const staticCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Pimpri-Chinchwad",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Kalyan-Dombivli",
    "Vasai-Virar",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Navi Mumbai",
    "Allahabad",
    "Ranchi",
    "Howrah",
    "Coimbatore",
    "Jabalpur",
    "Gwalior",
    "Vijayawada",
    "Jodhpur",
    "Madurai",
    "Raipur",
    "Kota",
    "Guwahati",
    "Chandigarh",
    "Solapur",
    "Hubli-Dharwad",
    "Mysore",
    "Tiruchirappalli",
    "Bareilly",
    "Aligarh",
    "Tiruppur",
    "Moradabad",
    "Jalandhar",
    "Bhubaneswar",
    "Salem",
    "Warangal",
    "Guntur",
    "Bhiwandi",
    "Saharanpur",
    "Gorakhpur",
    "Bikaner",
    "Amravati",
    "Noida",
    "Jamshedpur",
    "Bhilai",
    "Cuttack",
    "Firozabad",
    "Kochi",
    "Bhavnagar",
    "Dehradun",
    "Durgapur",
    "Asansol",
    "Nanded",
    "Kolhapur",
    "Ajmer",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Siliguri",
    "Jhansi",
    "Ulhasnagar",
    "Nellore",
    "Jammu",
    "Sangli-Miraj & Kupwad",
    "Belgaum",
    "Mangalore",
    "Ambattur",
    "Tirunelveli",
    "Malegaon",
    "Gaya",
    "Jalgaon",
    "Udaipur",
    "Maheshtala",
    "Davanagere",
    "Kozhikode",
    "Kurnool",
    "Rajpur Sonarpur",
    "Bokaro"
  ];

  const filterSections = [
    {
      "title": "streams",
      "items": streams, 
    },
    {
      title: "state",
      items: staticStateLocations,
    },
    {
      title: "city",
      items: staticCities,
    },
    {
      title: "specialization",
      items: [
        "Computer Science & Engineering",
        "Mechanical Engineering",
        "Electrical & Electronics Engineering",
        "Civil Engineering",
        "Artificial Intelligence & Machine Learning",
        "Data Science & Analytics",
        "Cybersecurity",
        "Robotics & Automation",
        "Aerospace Engineering",
        "Biotechnology Engineering"
      ],
    },
    {
      title: "Fees",
      items: ["> 5 Lakh", "3 - 5 Lakh", "1 - 3 Lakh", "< 1 Lakh"],
    },
    {
      title: "Exam",
      items: [
        "JEE Mains", "JEE Advanced", "BITSAT", "VITEEE", "SRMJEEE", 
        "WBJEE", "COMEDK UGET", "NEET UG", "AIIMS", "JIPMER"
      ]
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

  const handleFilterChange = (filterCategory, filterValue) => {
    setSelectedFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (!newFilters[filterCategory]) {
        newFilters[filterCategory] = [];
      }
      
      // Handle case sensitivity for filter values
      const normalizedValue = filterValue.toLowerCase();
      const existingIndex = newFilters[filterCategory].findIndex(
        val => val.toLowerCase() === normalizedValue
      );
      
      if (existingIndex !== -1) {
        // Remove the filter if it exists
        newFilters[filterCategory].splice(existingIndex, 1);
        if (newFilters[filterCategory].length === 0) {
          delete newFilters[filterCategory];
        }
      } else {
        // Add the filter if it doesn't exist
        newFilters[filterCategory].push(filterValue);
      }
      
      // Reset to page 1 when filters change
      setCurrentPage(1);
      
      return newFilters;
    });
  };

  // Effect to fetch data when filters or pagination changes
  useEffect(() => {
    // Don't trigger a fetch if we're applying initial filters from URL
    if (initialFilterApplied && Object.keys(selectedFilters).length > 0) {
      fetchFilteredInstitutes(selectedFilters, currentPage, itemsPerPage);
    }
  }, [selectedFilters, currentPage, initialFilterApplied]);

  const fetchFilteredInstitutes = async (filters, page, limit) => {
    setLoading(true);
    setFetchError(false);
    
    try {
      // Create a deep copy of filters to avoid modifying the original
      const apiFilters = JSON.parse(JSON.stringify(filters));
      
      // Ensure we're using "streams" (plural) for the API
      if (apiFilters.stream && !apiFilters.streams) {
        apiFilters.streams = apiFilters.stream;
        delete apiFilters.stream;
      }
      
      console.log("Sending filters to API:", apiFilters);
      
      const queryString = `filters=${encodeURIComponent(JSON.stringify(apiFilters))}&page=${page}&limit=${limit}`;
      const response = await axios.get(`${baseURL}/institutes?${queryString}`);
      
      if (response.data) {
        const institutes = response.data.data.result;
        setContent(institutes);
        setFilteredContent(institutes);
        setTotalDocuments(response.data.data.totalDocuments);
        
        if (institutes && institutes.length > 0) {
          updateIdMapping(institutes);
        }
      }
    } catch (error) {
      console.error('Error fetching filtered institutes:', error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = content.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContent(filtered);
    } else {
      setFilteredContent(content);
    }
  }, [searchQuery, content]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedContent = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContent.slice(startIndex, endIndex);
  };

  return (
    <>
      <Promotions location="SEARCH_PAGE" className="h-[320px]"></Promotions>

      <div className="px-[4vw] pb-[2vw] max-sm:overflow-x-hidden flex flex-col items-start">
        <div className="flex gap-4 w-full mt-6">
          <div className="filters w-[25%] hidden lg:block">
            <Filter 
              filterSections={filterSections} 
              handleFilterChange={handleFilterChange} 
              selectedFilters={selectedFilters}
            />
          </div>

          <div className="filterResult w-full">
            {loading ? (
              <div className="text-center py-8">Loading results...</div>
            ) : fetchError ? (
              <div className="text-center py-8 text-red-500">Error fetching results</div>
            ) : filteredContent.length > 0 ? (
              <>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-red-500">{totalDocuments || "0"}</span> Institutes Found
                </div>
                <div style={{ width: '728px', height: '90px', overflow: 'hidden' }}>
                  <Promotions location="INSTITUTE_PAGE_RECTANGLE" className="h-[90px] max-sm:w-[85%]"></Promotions>
                </div>                
                {getPaginatedContent().map((institute, index) => (
                  <SearchResultBox 
                    key={index} 
                    institute={institute} 
                    url={getInstituteUrl(institute)}
                  />
                ))}
                <div className="pagination">
                  {Array.from({ length: Math.ceil(filteredContent.length / itemsPerPage) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">No institutes found.</div>
            )}
          </div>
        </div>
      </div>

      <BlogComponent />
      <HighRatedCareers />
      <BestRated />
      <Events />
    </>
  );
};

export default SearchPage;