import { useEffect, useState } from "react";
import PageBanner from "../Ui components/PageBanner";
import ExpandedBox from "../Ui components/ExpandedBox";
import SearchResultBox from "../Ui components/SearchResultBox";
import Filter from "../Ui components/Filter";
import BestRated from "../Components/BestRated";
import Pagination from "../Components/Pagination";
import Events from "../Components/Events";
import axios from "axios";
import axiosInstance from "../ApiFunctions/axios";
import BlogComponent from "../Components/BlogComponent";
import HighRatedCareers from "../Components/HighRatedCareers";
import { useQuery } from "react-query";
import { getInstitutes } from "../ApiFunctions/api";
import { useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import Promotions from "./CoursePromotions";
import ConsellingBanner from "../Components/ConsellingBanner";

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
  const inputField = useSelector((store) => store?.input?.inputField || "");
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchSource, setSearchSource] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [lastPayload, setLastPayload] = useState(null);

  const baseURL = import.meta.env.VITE_BASE_URL;

  // Get URL parameters
  const streamFromUrl = searchParams.get("stream");
  const stateFromUrl = searchParams.get("state");
  const cityFromUrl = searchParams.get("city");
  const examFromUrl = searchParams.get("Exam");
  const feesFromUrl = searchParams.get("Fees");
  const ratingsFromUrl = searchParams.get("Ratings");
  const organizationFromUrl = searchParams.get("organization");
  const organizationTypeFromUrl = searchParams.get("organisationType");
  const specializationFromUrl = searchParams.get("specialization");
  const sortFromUrl = searchParams.get("sort"); // For sorting by rating (top colleges)


  useEffect(() => {
    const fromSearch = searchParams.get("fromSearch") === "true";
    const hasUrlFilters = checkForUrlFilters();

    // Set search query for display
    if (fromSearch && inputField) {
      setSearchQuery(inputField);
      setSearchSource("input");
    } else if (hasUrlFilters) {
      setSearchSource("url");
    } else {
      setSearchSource("default");
    }

    function checkForUrlFilters() {
      return !!(
        streamFromUrl ||
        stateFromUrl ||
        cityFromUrl ||
        examFromUrl ||
        feesFromUrl ||
        ratingsFromUrl ||
        organizationFromUrl ||
        organizationTypeFromUrl ||
        specializationFromUrl ||
        sortFromUrl
      );
    }
    // Re-run if input changes OR URL search params change
  }, [inputField, location.search]);

  // This effect handles the initial data loading based on search source
  useEffect(() => {
    if (!searchSource) return; // Wait until search source is determined

    setLoading(true);
    setFetchError(false);
    ////console.debug('SearchPage: baseURL=', baseURL, 'searchSource=', searchSource);

      if (searchSource === "input" && inputField) {
      //console.log("Loading data from Redux input:", inputField);
      // Load data based on the inputField from Redux with pagination
      //console.debug('Calling getInstitutes for input search...');
      getInstitutes(inputField, inputField, inputField, inputField, 1, itemsPerPage)
        .then((data) => {
          //console.debug('getInstitutes (input) response:', data);
          // Normalize response shape: server may return response.data or response.data.data
          const payload = data?.data?.data ?? data?.data ?? data;
          setLastPayload(payload);
          //console.debug('Normalized payload (input):', payload);
          const result = Array.isArray(payload?.result) ? payload.result : (Array.isArray(payload) ? payload : []);
          const totalDocuments = payload?.totalDocuments ?? payload?.total_documents ?? 0;
          const currentPage = payload?.currentPage ?? payload?.page ?? 1;

          setContent(result);
          setFilteredContent(result);
          setTotalDocuments(totalDocuments);
          setCurrentPage(currentPage || 1);

          if (result && result.length > 0) updateIdMapping(result);

          setLoading(false);
          setInitialLoadComplete(true);
        })
        .catch((error) => {
          //console.error("Error fetching institutes:", error);
          setFetchError(true);
          setLoading(false);
          setInitialLoadComplete(true);
        });
    }
    else if (searchSource === "url") {
      // Build filters from URL parameters for state management
      // But let Filter component handle the actual fetch via onFiltersChanged
      const initialFilters = buildInitialFiltersFromUrl();
      //console.log("URL filters detected, waiting for Filter component to initialize:", initialFilters);

      setSelectedFilters(initialFilters);
      // Don't set filtersApplied yet - let Filter component trigger it via onFiltersChanged
      // This prevents duplicate fetches

      // If no filters in URL, load default data
      if (Object.keys(initialFilters).length === 0 && !sortFromUrl) {
          //console.debug('Calling getInstitutes for default load...');
          getInstitutes("", "", "", "", 1, itemsPerPage)
          .then((data) => {
            //console.debug('getInstitutes (default) response:', data);
            const payload = data?.data?.data ?? data?.data ?? data;
            setLastPayload(payload);
            //console.debug('Normalized payload (default):', payload);
            const result = Array.isArray(payload?.result) ? payload.result : (Array.isArray(payload) ? payload : []);
            const totalDocuments = payload?.totalDocuments ?? payload?.total_documents ?? 0;
            const currentPage = payload?.currentPage ?? payload?.page ?? 1;

            setContent(result);
            setFilteredContent(result);
            setTotalDocuments(totalDocuments);
            setCurrentPage(currentPage || 1);

            if (result && result.length > 0) updateIdMapping(result);

            setLoading(false);
            setInitialLoadComplete(true);
          })
          .catch((error) => {
            //console.error("Error fetching institutes:", error);
            setFetchError(true);
            setLoading(false);
            setInitialLoadComplete(true);
          });
      } else {
        // Filters or sort exist in URL - Filter component will trigger fetch via onFiltersChanged
        // But if only sort is present, fetch immediately
        if (sortFromUrl && Object.keys(initialFilters).length === 0) {
          fetchFilteredInstitutes({}, 1, itemsPerPage, sortFromUrl)
              .then((data) => {
                //console.debug('fetchFilteredInstitutes (sort) response:', data);
                setInitialLoadComplete(true);
              })
              .catch((error) => {
                //console.error("Error fetching sorted institutes:", error);
                setFetchError(true);
                setLoading(false);
                setInitialLoadComplete(true);
              });
        } else {
          setInitialLoadComplete(true);
          setLoading(false);
        }
      }
    }
    else {
      // Default data loading with pagination limit
      //console.log("Loading default data");
      setSelectedFilters({});

      getInstitutes("", "", "", "", 1, itemsPerPage)
        .then((data) => {
          //console.debug('getInstitutes (final default) response:', data);
          const payload = data?.data?.data ?? data?.data ?? data;
          setLastPayload(payload);
          const result = Array.isArray(payload?.result) ? payload.result : (Array.isArray(payload) ? payload : []);
          const totalDocuments = payload?.totalDocuments ?? payload?.total_documents ?? 0;
          const currentPage = payload?.currentPage ?? payload?.page ?? 1;

          setContent(result);
          setFilteredContent(result);
          setTotalDocuments(totalDocuments);
          setCurrentPage(currentPage || 1);

          if (result && result.length > 0) {
            updateIdMapping(result);
          }
        })
        .catch((error) => {
          //console.error("Error fetching institutes:", error);
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
    if (organizationFromUrl) initialFilters.organization = [organizationFromUrl];
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
        //console.error("Error loading instituteIdMap from localStorage:", error);
        window.instituteIdMap = {};
      }
    }
  }, []);

  // Note: URL filter initialization is now handled by the Filter component
  // This effect is kept for backward compatibility but should not conflict
  // The Filter component will call handleFiltersChanged when it initializes from URL

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
      const response = await axiosInstance.get(
        `/streams?limit=15&sort={"createdAt":"asc"}&filters={"isCounsellorStream":true}`
      );
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // Cache streams for 10 minutes (they don't change often)
      cacheTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      refetchOnWindowFocus: false,
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
      title: "organization",
      items: ["University", "College", "Institute"],
    },
    {
      title: "organisationType",
      items: [
        "Central",
        "State",
        "Local Body",
        "Private",
        "Aided",
        "Autonomous",
        "Affiliated",
        "Deemed",
        "Distance / Open",
      ],
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
    //console.log("Filter changed:", filterCategory, filterValue);
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

  //     //console.log("Sending filters to API:", apiFilters);

  //     const queryString = `filters=${encodeURIComponent(
  //       JSON.stringify(apiFilters)
  //     )}&page=${page}&limit=${limit}`;

  //     //console.log(`Fetching data with query: ${queryString}`);
  //     const response = await axios.get(`${baseURL}/institutes?${queryString}`);

  //     if (response.data) {
  //       const { result, currentPage, totalPages, totalDocuments } = response.data.data;
  //       //console.log(`Received page ${currentPage} of ${totalPages}, with ${result.length} results out of ${totalDocuments} total`);

  //       setContent(result);
  //       setFilteredContent(result);
  //       setTotalDocuments(totalDocuments);
  //       setCurrentPage(currentPage || 1); // Update current page from API response

  //       if (result && result.length > 0) {
  //         updateIdMapping(result);
  //       }
  //     }
  //   } catch (error) {
  //     //console.error("Error fetching filtered institutes:", error);
  //     setFetchError(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Modified fetchFilteredInstitutes function - return the promise
  const fetchFilteredInstitutes = async (filters, page, limit, sortField = null) => {
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

      //console.log("Sending filters to API:", apiFilters);

      // Build query string with sort parameter if provided
      let queryString = `filters=${encodeURIComponent(
        JSON.stringify(apiFilters)
      )}&page=${page}&limit=${limit}`;

      // Add sort parameter if provided (e.g., sort=rating for top colleges)
      if (sortField) {
        const sortObj = { [sortField]: "desc" }; // Sort descending for rating (highest first)
        queryString += `&sort=${encodeURIComponent(JSON.stringify(sortObj))}`;
      }

      //console.log(`Fetching data with query: ${queryString}`);
      const response = await axiosInstance.get(`/institutes?${queryString}`);

      if (response.data) {
        const { result = [], currentPage, totalPages, totalDocuments } = response?.data?.data || {};
        //console.log(`Received page ${currentPage} of ${totalPages}, with ${result?.length || 0} results out of ${totalDocuments} total`);

        const safeResult = Array.isArray(result) ? result : [];
        setContent(safeResult);
        setFilteredContent(safeResult);
        setTotalDocuments(totalDocuments);
        setCurrentPage(currentPage || 1); // Update current page from API response

        if (result && result.length > 0) {
          updateIdMapping(result);
        }
      }
      return response.data;
    } catch (error) {
      //console.error("Error fetching filtered institutes:", error);
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
    // 2. Filters have been applied (either from URL or user selection)
    // 3. This handles pagination changes after filters are applied
    if (initialLoadComplete && filtersApplied && Object.keys(selectedFilters).length > 0) {
      // Only fetch if page changed (not on initial filter application, which is handled in handleFiltersChanged)
      if (currentPage > 1) {
        //console.log("Fetching data for page change:", selectedFilters, "Page:", currentPage);
        fetchFilteredInstitutes(selectedFilters, currentPage, itemsPerPage, sortFromUrl || null);
      }
    }
  }, [currentPage]); // Only depend on currentPage - filter changes are handled in handleFiltersChanged



  // Modified handlePageChange to ensure API is called
  const handlePageChange = (newPage) => {
    //console.log(`Changing to page ${newPage}`);
    // Save current scroll position
    const scrollPosition = window.scrollY;

    // Update current page state
    setCurrentPage(newPage);

    // Explicitly fetch new page data to ensure it happens
    // This is a backup to the useEffect, providing redundancy
    fetchFilteredInstitutes(selectedFilters, newPage, itemsPerPage, sortFromUrl || null);

    // Scroll to top after page change
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (searchQuery.length > 0 && Array.isArray(content)) {
      const filtered = content.filter((item) => {
        const name = item.instituteName || item.name || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredContent(filtered);
    } else {
      setFilteredContent(content);
    }
  }, [searchQuery, content]);

  const renderPagination = () => {
    const totalPages = Math.ceil(totalDocuments / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  };

  const handleFiltersChanged = (filters) => {
    //console.log("Filters changed in Filter component:", filters);

    // Save current scroll position
    const scrollPosition = window.scrollY;

    // Reset page to 1 when filters change
    setCurrentPage(1);
    setSelectedFilters(filters);
    setFiltersApplied(true);

    // Immediately fetch filtered data - don't wait for useEffect
    // This ensures data is fetched right away when filters change
    // Always fetch if filters are provided, regardless of initialLoadComplete
    // (initialLoadComplete might not be set yet during initial mount from URL)
    if (Object.keys(filters).length > 0 || sortFromUrl) {
      setLoading(true);
      setFetchError(false);
      fetchFilteredInstitutes(filters, 1, itemsPerPage, sortFromUrl || null)
        .then(() => {
          // Mark initial load as complete if it wasn't already
          if (!initialLoadComplete) {
            setInitialLoadComplete(true);
          }
        })
        .catch((error) => {
          //console.error("Error fetching filtered institutes:", error);
          setFetchError(true);
          setLoading(false);
        });
    } else {
      // No filters - load default data
      if (initialLoadComplete) {
        setLoading(true);
        getInstitutes("", "", "", "", 1, itemsPerPage)
          .then((data) => {
            const { result = [], totalDocuments, currentPage, totalPages } = data?.data || {};
            const safeResult = Array.isArray(result) ? result : [];
            setContent(safeResult);
            setFilteredContent(safeResult);
            setTotalDocuments(totalDocuments);
            setCurrentPage(currentPage || 1);

            if (result && result.length > 0) {
              updateIdMapping(result);
            }
            setLoading(false);
          })
          .catch((error) => {
            //console.error("Error fetching institutes:", error);
            setFetchError(true);
            setLoading(false);
          });
      }
    }

    // Restore scroll position
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  // const handlePageChange = (newPage) => {
  //   //console.log(`Changing to page ${newPage}`);

  //   // Update current page state
  //   setCurrentPage(newPage);

  //   // Scroll to top after page change
  //   window.scrollTo(0, 0);
  // };

  // const handleFiltersChanged = (filters) => {
  //   //console.log("Filters changed in Filter component:", filters);
  //   setSelectedFilters(filters);
  //   setFiltersApplied(true);
  //   setCurrentPage(1); // Reset to first page when filters change
  //   // No need to call fetchFilteredInstitutes here, the useEffect will handle it
  // };

  return (
    <>
      <Promotions location="SEARCH_PAGE" className="!h-fit"></Promotions>
      {/* <Promotions location="SEARCH_PAGE" className="!h-[320px]"></Promotions> */}

      <div className="universal-container max-sm:overflow-x-hidden flex flex-col items-start">
        {/* Mobile Filter Drawer */}
        <div className={`fixed inset-0 z-[999] flex pointer-events-none ${isMobileFilterOpen ? "pointer-events-auto" : ""}`}>
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsMobileFilterOpen(false)}
          ></div>
          <div className={`relative ml-auto flex flex-col w-full max-w-sm bg-white h-full shadow-2xl transition-transform duration-300 transform ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 uppercase">
              <Filter
                filterSections={filterSections}
                handleFilterChange={handleFilterChangeWithoutScroll}
                selectedFilters={selectedFilters}
                onFiltersChanged={handleFiltersChanged}
              />
            </div>
            <div className="p-4 border-t bg-white sticky bottom-0 text-center">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#b82025] text-white py-3 rounded-lg font-bold shadow-md active:scale-95 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="universal-container flex gap-4 py-8">
          <div className="filters w-[25%] hidden lg:block">
            <Filter
              filterSections={filterSections}
              handleFilterChange={handleFilterChangeWithoutScroll}
              selectedFilters={selectedFilters}
              onFiltersChanged={handleFiltersChanged}
            />
          </div>

          <div className="filterResult w-full lg:w-[75%] w-full">
            {/* Display search query if available */}
            {(inputField || searchQuery) && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-600 font-medium">Search Results for:</span>
                  <span className="text-red-600 font-bold text-lg">
                    "{inputField || searchQuery}"
                  </span>
                </div>
              </div>
            )}

            {/* {import.meta.env.DEV && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-800">
                <div><strong>Debug:</strong></div>
                <div>totalDocuments: <strong>{totalDocuments}</strong></div>
                <div>content.length: <strong>{Array.isArray(content) ? content.length : 0}</strong></div>
                <div>filteredContent.length: <strong>{Array.isArray(filteredContent) ? filteredContent.length : 0}</strong></div>
                <div className="mt-2">First results: {filteredContent.slice(0,5).map((i)=>i.instituteName || i.name).join(', ') || '—'}</div>
              </div>
            )} */}

            {loading ? (
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="text-center py-8 text-red-500">
                Error fetching results
              </div>
            ) : filteredContent.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold text-red-500">
                      {totalDocuments || "0"}
                    </span>{" "}
                    Institutes Found
                  </div>
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-[#b82025] text-white px-4 py-2 rounded-lg shadow-md text-sm font-semibold active:scale-95 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filters
                  </button>
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
      {/* <Events /> */}
      <div className="flex gap-2 flex-col sm:flex-row items-center">
        <Events />
        <ConsellingBanner />
      </div>
    </>
  );
};

export default SearchPage;