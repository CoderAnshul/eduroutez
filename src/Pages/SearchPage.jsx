import { useEffect, useState } from "react";
import PageBanner from "../Ui components/PageBanner";
import ExpandedBox from "../Ui components/ExpandedBox";
import SearchResultBox from "../Ui components/SearchResultBox";
import Filter from "../Ui components/Filter";
import BestRated from "../Components/BestRated";
import Events from "../Components/Events";
import axios from "axios";
import BlogComponent from "../Components/BlogComponent";
import HighRatedCareers from "../Components/HighRatedCareers";
import { useQuery } from "react-query";
import { getInstitutes } from "../ApiFunctions/api";
import { useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import Promotions from "./CoursePromotions";

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
  const inputField = useSelector((store) => store.input.inputField);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchSource, setSearchSource] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Get URL parameters
  const streamFromUrl = searchParams.get("stream");
  const stateFromUrl = searchParams.get("state");
  const cityFromUrl = searchParams.get("city");
  const examFromUrl = searchParams.get("Exam");
  const feesFromUrl = searchParams.get("Fees");
  const ratingsFromUrl = searchParams.get("Ratings");
  const organizationTypeFromUrl = searchParams.get("organisationType");
  const specializationFromUrl = searchParams.get("specialization");


  useEffect(() => {
    const fromSearch = searchParams.get("fromSearch") === "true";
    const hasUrlFilters = checkForUrlFilters();
    
    // Determine search source priority
    if (fromSearch && inputField) {
      setSearchSource("input");
    } else if (hasUrlFilters) {
      setSearchSource("url");
    } else {
      setSearchSource("default");
    }
    
    function checkForUrlFilters() {
      return !!(streamFromUrl || stateFromUrl || cityFromUrl || 
        examFromUrl || feesFromUrl || ratingsFromUrl || 
        organizationTypeFromUrl || specializationFromUrl);
    }
  }, []);
  
  // This effect handles the initial data loading based on search source
  useEffect(() => {
    if (!searchSource) return; // Wait until search source is determined
    
    setLoading(true);
    setFetchError(false);
    
    if (searchSource === "input" && inputField) {
      console.log("Loading data from Redux input:", inputField);
      // Load data based on the inputField from Redux
      getInstitutes(inputField, inputField, inputField, inputField)
        .then((data) => {
          const { result, totalDocuments, currentPage, totalPages } = data.data;
          setContent(result);
          setFilteredContent(result);
          setTotalDocuments(totalDocuments);
          setCurrentPage(currentPage || 1);
  
          if (result && result.length > 0) {
            updateIdMapping(result);
          }
        })
        .catch((error) => {
          console.error("Error fetching institutes:", error);
          setFetchError(true);
        })
        .finally(() => {
          setLoading(false);
          setInitialLoadComplete(true);
        });
    } 
    else if (searchSource === "url") {
      // Build filters from URL parameters
      const initialFilters = buildInitialFiltersFromUrl();
      console.log("Loading data from URL filters:", initialFilters);
      
      setSelectedFilters(initialFilters);
      setFiltersApplied(true);
      
      fetchFilteredInstitutes(initialFilters, 1, itemsPerPage)
        .finally(() => {
          setInitialLoadComplete(true);
        });
    } 
    else {
      // Default data loading
      console.log("Loading default data");
      setSelectedFilters({});
      
      getInstitutes("", "", "", "")
        .then((data) => {
          const { result, totalDocuments, currentPage, totalPages } = data.data;
          setContent(result);
          setFilteredContent(result);
          setTotalDocuments(totalDocuments);
          setCurrentPage(currentPage || 1);
  
          if (result && result.length > 0) {
            updateIdMapping(result);
          }
        })
        .catch((error) => {
          console.error("Error fetching institutes:", error);
          setFetchError(true);
        })
        .finally(() => {
          setLoading(false);
          setInitialLoadComplete(true);
        });
    }
  }, [searchSource]);
  
  // Helper function to build filters from URL params
  function buildInitialFiltersFromUrl() {
    const initialFilters = {};
    
    if (streamFromUrl) {
      const streamValues = streamFromUrl
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (streamValues.length > 0) {
        initialFilters.streams = streamValues;
      }
    }
  
    if (stateFromUrl) initialFilters.state = [stateFromUrl];
    if (cityFromUrl) initialFilters.city = [cityFromUrl];
    if (examFromUrl) initialFilters.Exam = [examFromUrl];
    if (feesFromUrl) initialFilters.Fees = [feesFromUrl];
    if (ratingsFromUrl) initialFilters.Ratings = [ratingsFromUrl];
    if (organizationTypeFromUrl) initialFilters.organisationType = [organizationTypeFromUrl];
    if (specializationFromUrl) initialFilters.specialization = [specializationFromUrl];
    
    return initialFilters;
  }

  useEffect(() => {
    if (!window.instituteIdMap) {
      try {
        const storedInstituteIdMap = JSON.parse(
          localStorage.getItem("instituteIdMap") || "{}"
        );
        window.instituteIdMap = storedInstituteIdMap;
      } catch (error) {
        console.error("Error loading instituteIdMap from localStorage:", error);
        window.instituteIdMap = {};
      }
    }
  }, []);

  // This effect builds initial filters from URL parameters only once on component mount
  useEffect(() => {
    // Build initial filters from URL parameters
    const initialFilters = {};

    if (streamFromUrl) {
      const streamValues = streamFromUrl
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (streamValues.length > 0) {
        initialFilters.streams = streamValues;
      }
    }

    if (stateFromUrl) {
      initialFilters.state = [stateFromUrl];
    }

    if (cityFromUrl) {
      initialFilters.city = [cityFromUrl];
    }

    if (examFromUrl) {
      initialFilters.Exam = [examFromUrl];
    }

    if (feesFromUrl) {
      initialFilters.Fees = [feesFromUrl];
    }

    if (ratingsFromUrl) {
      initialFilters.Ratings = [ratingsFromUrl];
    }

    if (organizationTypeFromUrl) {
      initialFilters.organisationType = [organizationTypeFromUrl];
    }

    if (specializationFromUrl) {
      initialFilters.specialization = [specializationFromUrl];
    }

    // Apply URL filters or fetch default data
    if (Object.keys(initialFilters).length > 0) {
      setSelectedFilters(initialFilters);
      setFiltersApplied(true);
      fetchFilteredInstitutes(initialFilters, 1, itemsPerPage);
    } else {
      // If no URL parameters, fetch default data and reset filters
      setSelectedFilters({});
      setLoading(true);
      getInstitutes(inputField, inputField, inputField, inputField)
        .then((data) => {
          const { result, totalDocuments, currentPage, totalPages } = data.data;
          setContent(result);
          setFilteredContent(result);
          setTotalDocuments(totalDocuments);
          setCurrentPage(currentPage || 1);

          if (result && result.length > 0) {
            updateIdMapping(result);
          }
          setLoading(false);
          setInitialLoadComplete(true);
        })
        .catch((error) => {
          console.error("Error fetching institutes:", error);
          setFetchError(true);
          setLoading(false);
          setInitialLoadComplete(true);
        });
    }
  }, []); // Empty dependency array means this runs once on mount

  const updateIdMapping = (institutes) => {
    let hasChanges = false;

    institutes.forEach((institute) => {
      if (
        institute.slug &&
        institute._id &&
        !window.instituteIdMap[institute.slug]
      ) {
        window.instituteIdMap[institute.slug] = institute._id;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      localStorage.setItem(
        "instituteIdMap",
        JSON.stringify(window.instituteIdMap)
      );
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
      const response = await axios.get(
        `${baseURL}/streams?&page=0&sort={"createdAt":"asc"}`
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        const streamNames =
          data.data?.result
            ?.filter((stream) => stream.status)
            ?.map((stream) => stream.name) || [];
        setStreams(streamNames);
      },
    }
  );

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
    "Puducherry",
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
    "Bokaro",
  ];

  const filterSections = [
    {
      title: "streams",
      items: streams,
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
        "General Medicine",
        "Dentistry",
        "Nursing",
        "Pharmacy",
        "Physiotherapy",
        "Ayurveda",
        "Homeopathy",
        "Veterinary Science",
        "Radiology",
        "Ophthalmology",
        "Biotechnology",
        "Computer Science & Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Electrical Engineering",
        "Electronics & Communication Engineering",
        "Aerospace Engineering",
        "Artificial Intelligence & Machine Learning",
        "Data Science & Analytics",
        "Cybersecurity",
        "Robotics",
        "Automobile Engineering",
        "Chemical Engineering",
        "Finance",
        "Marketing",
        "Human Resource Management",
        "Operations Management",
        "Business Analytics",
        "International Business",
        "Retail Management",
        "Healthcare Management",
        "Supply Chain & Logistics",
        "Entrepreneurship",
        "Corporate Law",
        "Criminal Law",
        "Constitutional Law",
        "Cyber Law",
        "Intellectual Property Law",
        "Environmental Law",
        "Human Rights Law",
        "International Law",
        "Family Law",
        "Graphic Design",
        "Fashion Design",
        "Interior Design",
        "UI/UX Design",
        "Animation & VFX",
        "Product Design",
        "Game Design",
        "Hotel Management",
        "Tourism Management",
        "Event Management",
        "Culinary Arts",
        "English Literature",
        "History",
        "Political Science",
        "Sociology",
        "Psychology",
        "Economics",
        "Philosophy",
        "Software Development",
        "Web Development",
        "Cloud Computing",
        "Network Security",
        "Database Management",
        "Mobile App Development",
        "Ethical Hacking",
        "Journalism",
        "Advertising & Public Relations",
        "Film & Television Production",
        "Digital Media",
        "Photography",
        "Accounting & Taxation",
        "Banking & Insurance",
        "Financial Planning",
        "Stock Market & Investment",
        "Physics",
        "Chemistry",
        "Mathematics",
        "Biotechnology",
        "Microbiology",
        "Environmental Science",
        "Forensic Science",
        "Early Childhood Education",
        "Special Education",
        "Educational Psychology",
        "Physical Education",
        "Social Sciences",
        "Humanities",
      ],
    },
    {
      title: "Fees",
      items: ["> 5 Lakh", "3 - 5 Lakh", "1 - 3 Lakh", "< 1 Lakh"],
    },
    {
      title: "Exam",
      items: [
        // Engineering Entrance Exams
        "JEE Main",
        "JEE Advanced",
        "BITSAT",
        "VITEEE",
        "SRMJEEE",
        // Medical & Pharmacy Entrance Exams
        "NEET UG",
        "NEET PG",
        "AIIMS PG",
        "GPAT",
        // Management Entrance Exams
        "CAT",
        "XAT",
        "MAT",
        "CMAT",
        "NMAT",
        // Law Entrance Exams
        "CLAT",
        "AILET",
        "LSAT India",
        // Design & Architecture Entrance Exams
        "NATA",
        "UCEED",
        "CEED",
        // Education & Teaching Entrance Exams
        "CTET",
        "DSSSB",
        "B.Ed Entrance Exams",
        // Science & Research Entrance Exams
        "IIT JAM",
        "GATE",
        "CSIR NET",
        "UGC NET",
      ],
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

  // Add this function to prevent scroll reset
  const handleFilterChangeWithoutScroll = (filterCategory, filterValue) => {
    // Save current scroll position
    const scrollPosition = window.scrollY;

    // Apply filter change
    handleFilterChange(filterCategory, filterValue);

    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };
  
  const handleFilterChange = (filterCategory, filterValue) => {
    // This function should do nothing or be removed entirely
    // Let Filter component handle all filter state
    console.log("Filter changed:", filterCategory, filterValue);
    // Do not update selectedFilters here - it will be updated via onFiltersChanged
  };

  // Modified fetchFilteredInstitutes function - made more robust
  // const fetchFilteredInstitutes = async (filters, page, limit) => {
  //   setLoading(true);
  //   setFetchError(false);

  //   try {
  //     // Create a deep copy of filters to avoid modifying the original
  //     const apiFilters = JSON.parse(JSON.stringify(filters));

  //     // Ensure we're using "streams" (plural) for the API
  //     if (apiFilters.stream && !apiFilters.streams) {
  //       apiFilters.streams = apiFilters.stream;
  //       delete apiFilters.stream;
  //     }

  //     // Make sure all filter arrays are properly formatted
  //     Object.keys(apiFilters).forEach((key) => {
  //       // If the value is not already an array, convert it to an array
  //       if (!Array.isArray(apiFilters[key])) {
  //         apiFilters[key] = [apiFilters[key]];
  //       }
  //     });

  //     console.log("Sending filters to API:", apiFilters);

  //     const queryString = `filters=${encodeURIComponent(
  //       JSON.stringify(apiFilters)
  //     )}&page=${page}&limit=${limit}`;
      
  //     console.log(`Fetching data with query: ${queryString}`);
  //     const response = await axios.get(`${baseURL}/institutes?${queryString}`);

  //     if (response.data) {
  //       const { result, currentPage, totalPages, totalDocuments } = response.data.data;
  //       console.log(`Received page ${currentPage} of ${totalPages}, with ${result.length} results out of ${totalDocuments} total`);
        
  //       setContent(result);
  //       setFilteredContent(result);
  //       setTotalDocuments(totalDocuments);
  //       setCurrentPage(currentPage || 1); // Update current page from API response

  //       if (result && result.length > 0) {
  //         updateIdMapping(result);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching filtered institutes:", error);
  //     setFetchError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Modified fetchFilteredInstitutes function - return the promise
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

    // Make sure all filter arrays are properly formatted
    Object.keys(apiFilters).forEach((key) => {
      // If the value is not already an array, convert it to an array
      if (!Array.isArray(apiFilters[key])) {
        apiFilters[key] = [apiFilters[key]];
      }
    });

    console.log("Sending filters to API:", apiFilters);

    const queryString = `filters=${encodeURIComponent(
      JSON.stringify(apiFilters)
    )}&page=${page}&limit=${limit}`;
    
    console.log(`Fetching data with query: ${queryString}`);
    const response = await axios.get(`${baseURL}/institutes?${queryString}`);

    if (response.data) {
      const { result, currentPage, totalPages, totalDocuments } = response.data.data;
      console.log(`Received page ${currentPage} of ${totalPages}, with ${result.length} results out of ${totalDocuments} total`);
      
      setContent(result);
      setFilteredContent(result);
      setTotalDocuments(totalDocuments);
      setCurrentPage(currentPage || 1); // Update current page from API response

      if (result && result.length > 0) {
        updateIdMapping(result);
      }
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered institutes:", error);
    setFetchError(true);
    throw error;
  } finally {
    setLoading(false);
  }
};

// Modified useEffect for filter changes
useEffect(() => {
  // Only run this effect if:
  // 1. Initial loading is complete
  // 2. Either filters have been explicitly applied OR we're changing pages with existing filters
  if (initialLoadComplete && (filtersApplied || (Object.keys(selectedFilters).length > 0 && currentPage > 1))) {
    console.log("Fetching data based on filters/pagination:", selectedFilters, "Page:", currentPage);
    fetchFilteredInstitutes(selectedFilters, currentPage, itemsPerPage);
  }
}, [selectedFilters, currentPage, initialLoadComplete, filtersApplied]);



  // Modified handlePageChange to ensure API is called
  const handlePageChange = (newPage) => {
    console.log(`Changing to page ${newPage}`);
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Update current page state
    setCurrentPage(newPage);
    
    // Explicitly fetch new page data to ensure it happens
    // This is a backup to the useEffect, providing redundancy
    fetchFilteredInstitutes(selectedFilters, newPage, itemsPerPage);
    
    // Scroll to top after page change
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = content.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContent(filtered);
    } else {
      setFilteredContent(content);
    }
  }, [searchQuery, content]);

  const renderPagination = () => {
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);
    if (totalPages <= 1) return null;

    // Logic to show a reasonable number of page buttons
    const maxButtonsToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    const pageButtons = [];
    
    // Previous button
    if (currentPage > 1) {
      pageButtons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 mx-1"
        >
          &laquo;
        </button>
      );
    }
    
    // First page button if not starting from page 1
    if (startPage > 1) {
      pageButtons.push(
        <button
          key="1"
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 bg-gray-200 mx-1"
        >
          1
        </button>
      );
      
      // Show ellipsis if there's a gap
      if (startPage > 2) {
        pageButtons.push(
          <span key="startEllipsis" className="px-2">...</span>
        );
      }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 ${
            currentPage === i
              ? "bg-[#b82025] text-white"
              : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Show ellipsis if there's a gap before the last page
    if (endPage < totalPages - 1) {
      pageButtons.push(
        <span key="endEllipsis" className="px-2">...</span>
      );
    }
    
    // Last page button if not ending at the last page
    if (endPage < totalPages) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 bg-gray-200 mx-1"
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 mx-1"
        >
          &raquo;
        </button>
      );
    }

    return (
      <div className="pagination flex flex-wrap justify-center my-6">
        {pageButtons}
      </div>
    );
  };

  const handleFiltersChanged = (filters) => {
    console.log("Filters changed in Filter component:", filters);
    
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    // Reset page to 1 when filters change
    setCurrentPage(1);
    setSelectedFilters(filters);
    setFiltersApplied(true);
    
    // Restore scroll position
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };
  
  // const handlePageChange = (newPage) => {
  //   console.log(`Changing to page ${newPage}`);
    
  //   // Update current page state
  //   setCurrentPage(newPage);
    
  //   // Scroll to top after page change
  //   window.scrollTo(0, 0);
  // };

  // const handleFiltersChanged = (filters) => {
  //   console.log("Filters changed in Filter component:", filters);
  //   setSelectedFilters(filters);
  //   setFiltersApplied(true);
  //   setCurrentPage(1); // Reset to first page when filters change
  //   // No need to call fetchFilteredInstitutes here, the useEffect will handle it
  // };

  return (
    <>
      <Promotions location="SEARCH_PAGE" className="!h-fit"></Promotions>
      {/* <Promotions location="SEARCH_PAGE" className="!h-[320px]"></Promotions> */}

      <div className="px-[4vw] pb-[2vw] max-sm:overflow-x-hidden flex flex-col items-start">
        <div className="flex gap-4 w-full mt-6">
          <div className="filters w-[25%] hidden lg:block">
            <Filter
              filterSections={filterSections}
              handleFilterChange={handleFilterChangeWithoutScroll}
              selectedFilters={selectedFilters}
              onFiltersChanged={handleFiltersChanged}
            />
          </div>

          <div className="filterResult w-full">
            {loading ? (
              <div className="text-center py-8">Loading results...</div>
            ) : fetchError ? (
              <div className="text-center py-8 text-red-500">
                Error fetching results
              </div>
            ) : filteredContent.length > 0 ? (
              <>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-red-500">
                    {totalDocuments || "0"}
                  </span>{" "}
                  Institutes Found
                </div>
                {/* <div style={{ width: '728px', height: '90px', overflow: 'hidden' }}> */}
                <div style={{ width: "fit-content" }}>
                  <Promotions
                    location="INSTITUTE_PAGE_RECTANGLE"
                    className="h-[90px] w-full max-sm:w-[100%] !p-0"
                  ></Promotions>
                </div>
                {filteredContent.map((institute, index) => (
                  <SearchResultBox
                    key={index}
                    institute={institute}
                    url={getInstituteUrl(institute)}
                    className="!mt-4"
                  />
                ))}
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No institutes found.
              </div>
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