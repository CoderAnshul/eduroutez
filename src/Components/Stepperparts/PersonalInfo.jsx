import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { getInstitutes } from "../../ApiFunctions/api";
import { setAllFieldsTrue, setAllFieldsFalse } from "../../config/inputSlice";
import axiosInstance from "../../ApiFunctions/axios";
import Promotions from "../../Pages/CoursePromotions";

const SearchableDropdown = ({ 
  options, 
  onChange, 
  selected, 
  searchTerm, 
  onSearchChange, 
  isLoading,
  onLoadMore,
  hasNextPage,
  isFetchingNextPage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const dropdownRef = React.useRef(null);

  // Sync selectedName if selected changes and we find it in options
  useEffect(() => {
    if (selected) {
      const found = options?.find((opt) => opt._id === selected);
      if (found) {
        const name = typeof found.instituteName === 'object' ? found.instituteName.name : found.instituteName;
        setSelectedName(name);
      }
    } else {
      setSelectedName("");
    }
  }, [selected, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  };

  const handleSelect = (option) => {
    const name = typeof option.instituteName === 'object' ? option.instituteName.name : option.instituteName;
    setSelectedName(name);
    onChange({
      target: {
        id: "institute",
        value: option._id,
      },
    });
    onSearchChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={selectedName || "Search and select college"}
          value={isOpen ? searchTerm : (selectedName || searchTerm)}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpen(true);
          }}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b82025]/20 focus:border-[#b82025] focus:outline-none transition-all pr-10 shadow-sm bg-white text-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {(isLoading || isFetchingNextPage) && (
            <div className="w-4 h-4 border-2 border-[#b82025] border-t-transparent rounded-full animate-spin"></div>
          )}
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div 
          onScroll={handleScroll}
          className="absolute z-[200000] left-0 top-full w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-[220px] overflow-y-auto hide-scrollbar animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="sticky top-0 bg-gray-50 px-4 py-1.5 text-[9px] font-bold text-gray-400 border-b border-gray-100 uppercase tracking-widest flex justify-between items-center">
            <span>{options.length} {searchTerm ? 'Matches' : 'Colleges'} Loaded</span>
            {hasNextPage && <span className="text-[8px] text-red-400 animate-pulse italic">Scroll for more...</span>}
          </div>
          {options.length > 0 ? (
            <>
              {options.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(item)}
                  className={`px-4 py-2 cursor-pointer hover:bg-red-50 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0 ${selected === item._id ? 'bg-red-50 text-[#b82025] font-bold' : 'text-gray-700'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {typeof item.instituteName === 'object' ? item.instituteName.name : item.instituteName}
                    </span>
                    {(item.city || item.state) && (
                      <span className="text-[10px] text-gray-400">
                        {typeof item.city === 'object' ? item.city.name : item.city}
                        {item.city && item.state ? ', ' : ''}
                        {typeof item.state === 'object' ? item.state.name : item.state}
                      </span>
                    )}
                  </div>
                  {selected === item._id && (
                    <svg className="w-4 h-4 text-[#b82025]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
              {isFetchingNextPage && (
                <div className="px-4 py-3 text-center text-xs text-gray-400 italic bg-gray-50/50">
                  Loading more...
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-8 text-xs text-gray-400 text-center italic">
              {isLoading ? 'Searching...' : `No colleges found matching "${searchTerm}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PersonalInfo = ({ formData, setFormData, setIsSubmit }) => {
  const [colleges, setColleges] = useState([]);
  const location = useLocation();
  const [countries, setCountries] = useState([]);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [name, setName] = useState(localStorage.getItem("fullName") || "");
  const [mobile, setMobile] = useState(localStorage.getItem("phone") || "");
  const dispatch = useDispatch();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const apiUrl = import.meta.env.VITE_BASE_URL; // Using the same base URL for consistency

  // Fetch student data
  const { data: studentData } = useQuery(
    ["student"],
    async () => {
      const id = localStorage.getItem("userId");
      if (!id || id === "null" || id === "undefined") {
        throw new Error("User ID not found in localStorage");
      }
      const response = await axiosInstance.get(
        `${VITE_BASE_URL}/student/${id}`
      );
      return response.data;
    },
    {
      enabled: !!localStorage.getItem("userId") && localStorage.getItem("userId") !== "null",
      onSuccess: (data) => {
        if (data?.data) {
          setEmail(data.data.email || "");
          setName(data.data.name || "");
          setMobile(data.data.phone || "");

          // Update form data with fetched values
          setFormData((prev) => ({
            ...prev,
            email: data.data.email,
            fullName: data.data.name,
            mobileNumber: data.data.phoneNo,
          }));
        }
      },
    }
  );

  const [collegeSearch, setCollegeSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(collegeSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [collegeSearch]);

  // Fetch institutes with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["institutes", debouncedSearch],
    ({ pageParam = 1 }) => getInstitutes(undefined, undefined, debouncedSearch, undefined, pageParam, 100),
    {
      getNextPageParam: (lastPage) => {
        // Normalize response shape to find next page
        const lastPageData = lastPage?.data || lastPage;
        const totalPages = lastPageData?.totalPages;
        const currentPage = lastPageData?.currentPage;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      keepPreviousData: true,
    }
  );

  // Flatten all pages into a single list of colleges
  useEffect(() => {
    const allColleges = data?.pages.flatMap((page) => {
      const resolved = page ?? {};
      let list = [];
      if (Array.isArray(resolved)) list = resolved;
      else if (Array.isArray(resolved.result)) list = resolved.result;
      else if (resolved.data && Array.isArray(resolved.data.result)) list = resolved.data.result;
      else if (Array.isArray(resolved.data)) list = resolved.data;
      return list;
    }) || [];

    setColleges(allColleges);
  }, [data]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get(`${apiUrl}/countries`);
        setCountries(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, [apiUrl]);

  // Auto-select institute if provided via query param or location state
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const instId = params.get("instituteId") || params.get("institute") || location.state?.instituteId || location.state?.institute || sessionStorage.getItem('pendingReviewInstitute');
      if (instId) {
        setFormData((prev) => ({ ...prev, institute: instId }));
        try { sessionStorage.removeItem('pendingReviewInstitute'); } catch (e) {}
      }
    } catch (err) {
      // ignore
    }
  }, [location.search, location.state, setFormData]);

  // Sync localStorage values into formData on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email || localStorage.getItem("email") || "",
      fullName: prev.fullName || localStorage.getItem("fullName") || "",
      mobileNumber: prev.mobileNumber || localStorage.getItem("phone") || "",
    }));
  }, []);

  // Check if all required fields are filled
  useEffect(() => {
    if (email !== "" && name !== "" && mobile !== "") {
      dispatch(setAllFieldsTrue());
    } else {
      dispatch(setAllFieldsFalse());
    }
  }, [email, name, mobile, dispatch]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update specific state variables
    switch (id) {
      case "email":
        setEmail(value);
        break;
      case "fullName":
        setName(value);
        break;
      case "mobileNumber":
        setMobile(value);
        break;
      case "country":
        // Find the selected country object
        const selectedCountry = countries.find(
          (country) =>
            (country._id || country.id || "").toString() === value.toString()
        );

        // Update form data with structured country object
        setFormData((prevData) => ({
          ...prevData,
          country: value,
          country: selectedCountry
            ? {
                name: selectedCountry.name,
                iso2: selectedCountry.iso2,
              }
            : null,
        }));
        return; // Skip the general formData update at the end
    }

    // Update form data for other fields
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center h-fit mb-4">
      <div className="w-full max-w-4xl px-6 pb-6 bg-white rounded-lg h-fit">
        <h1 className="text-2xl font-semibold text-center">
          Personal Information
        </h1>
        <p className="text-sm text-center text-gray-500">
          Make sure all the details are correct
        </p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-500"
            >
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              readOnly
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-500"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your name"
              value={name}
              readOnly
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-500"
            >
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="mobileNumber"
              placeholder="Enter your number"
              value={mobile}
              readOnly
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-500"
            >
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            >
              <option>Select Gender</option>
              <option selected={formData?.gender === "Male"}>Male</option>
              <option selected={formData?.gender === "Female"}>Female</option>
              <option selected={formData?.gender === "Other"}>Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-500"
            >
              Select Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option
                  key={index}
                  selected={formData?.country?.name === country?.name}
                  value={country._id || country.id || country.name}
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="institute"
              className="block text-sm font-medium text-gray-500"
            >
              College You Are Reviewing <span className="text-red-500">*</span>
            </label>
            <SearchableDropdown
              options={colleges}
              selected={formData?.institute}
              onChange={handleInputChange}
              searchTerm={collegeSearch}
              onSearchChange={setCollegeSearch}
              isLoading={isLoading}
              onLoadMore={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-500"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              value={formData?.address || ""}
              placeholder="Enter location"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="yearOfGraduation"
              className="block text-sm font-medium text-gray-500"
            >
              Year of Pass-out <span className="text-red-500">*</span>
            </label>
            <select
              id="year"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
              value={formData?.year}
            >
              <option>Select Year</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
