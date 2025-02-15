import { useEffect, useState } from 'react';
import PageBanner from '../Ui components/PageBanner';
import SearchResultInfo from '../Ui components/SearchResultInfo';
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
import { useSearchParams } from 'react-router-dom';
import Promotions from './CoursePromotions';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [streams, setStreams] = useState([]);
  const inputField = useSelector(store => store.input.inputField);

  const baseURL = import.meta.env.VITE_BASE_URL;
  const streamFromUrl = searchParams.get('stream');

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

  useEffect(() => {
    if (streamFromUrl && streams.includes(streamFromUrl)) {
      handleFilterChange('streams', streamFromUrl);
    }
  }, [streams, streamFromUrl]);

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
  ]

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
      title: "Total Fees",
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

  const { data, isLoading, isError } = useQuery(
    ["institute"],
    () => getInstitutes(inputField,inputField,inputField),
    {
      enabled: true,
      onSuccess: (data) => {
        const { result, totalDocuments } = data.data;
        setContent(result);
        setFilteredContent(result);
        setTotalDocuments(totalDocuments);
      }
    }
  );

  const handleFilterChange = (filterCategory, filterValue) => {
    setSelectedFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (!newFilters[filterCategory]) newFilters[filterCategory] = [];
      if (newFilters[filterCategory].includes(filterValue)) {
        newFilters[filterCategory] = newFilters[filterCategory].filter(value => value !== filterValue);
        if (newFilters[filterCategory].length === 0) delete newFilters[filterCategory];
      } else {
        newFilters[filterCategory].push(filterValue);
      }
      return newFilters;
    });
  };

  useEffect(() => {
    if (Object.keys(selectedFilters).length > 0) {
      fetchFilteredInstitutes(selectedFilters);
    }
  }, [selectedFilters]);

  const fetchFilteredInstitutes = async (filters) => {
    setLoading(true);
    try {
      const queryString = `filters=${encodeURIComponent(JSON.stringify(filters))}`;
      const response = await axios.get(`${baseURL}/institutes?${queryString}`);
      if (response.data) {
        setContent(response.data.data.result);
        setFilteredContent(response.data.data.result);
        setTotalDocuments(response.data.data.totalDocuments);
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

  return (
    <>
      <PageBanner pageName="Search" currectPage="Search" />
      <div className="px-[4vw] pb-[2vw] flex flex-col items-start">
        <SearchResultInfo />

        <div className="flex gap-4 w-full mt-6">
          <div className="filters w-[25%] hidden lg:block">
            <Filter filterSections={filterSections} handleFilterChange={handleFilterChange} />
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
                <Promotions location="INSTITUTE_PAGE_RECTANGLE" className="h-[90px]"></Promotions>
</div>                {filteredContent.map((institute, index) => (
                  
                  <SearchResultBox key={index} institute={institute} />
                ))}
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
