import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { getInstitutes } from "../../ApiFunctions/api";
import { setAllFieldsTrue, setAllFieldsFalse } from "../../config/inputSlice";
import axiosInstance from "../../ApiFunctions/axios";
import Promotions from "../../Pages/CoursePromotions";

const SearchableDropdown = ({ options, onChange, selected }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOptions = (options || [])?.filter((option) =>
    option.instituteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search college"
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
      />
      <select
        id="institute"
        className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
        onChange={onChange}
      >
        <option value="">Select</option>
        {filteredOptions.map((item, index) => (
          <option
            selected={selected === item?._id}
            key={index}
            value={item._id}
          >
            {item.instituteName}
          </option>
        ))}
      </select>
    </div>
  );
};

const PersonalInfo = ({ formData, setFormData, setIsSubmit }) => {
  const [colleges, setColleges] = useState([]);
  const [countries, setCountries] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const dispatch = useDispatch();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const apiUrl = import.meta.env.VITE_BASE_URL; // Using the same base URL for consistency

  // Fetch student data
  const { data: studentData } = useQuery(
    ["student"],
    async () => {
      const id = localStorage.getItem("userId");
      const response = await axiosInstance.get(
        `${VITE_BASE_URL}/student/${id}`
      );
      return response.data;
    },
    {
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

  // Fetch institutes
  const { data, isLoading, isError, error } = useQuery(
    ["institutes"],
    () => getInstitutes(),
    {
      enabled: true,
    }
  );

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axiosInstance.get(`${apiUrl}/countries`);
        setCountries(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        // If you have toast imported, uncomment the following line
        // toast.error("Failed to fetch countries");
      }
    };
    fetchCountries();
  }, [apiUrl]);

  useEffect(() => {
    if (data?.success === true) {
      setColleges(data?.data?.result);
    }
  }, [data]);

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
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg h-fit">
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
              disabled
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
              disabled
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
              disabled
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
