import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { getInstitutes } from "../../ApiFunctions/api";
import { setAllFieldsTrue, setAllFieldsFalse } from "../../config/inputSlice";

const SearchableDropdown = ({ options, onChange }) => {
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
          <option key={index} value={item._id}>
            {item.instituteName}
          </option>
        ))}
      </select>
    </div>
  );
};

const PersonalInfo = ({ setFormData, setIsSubmit }) => {
  const [colleges, setColleges] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const dispatch = useDispatch();

  // Dispatch actions based on input state
  useEffect(() => {
    if (email !== "" && name !== "" && mobile !== "") {
      dispatch(setAllFieldsTrue());
    } else {
      dispatch(setAllFieldsFalse());
    }
  }, [email, name, mobile, dispatch]);

  const { data, isLoading, isError, error } = useQuery(
    ["institutes"],
    () => getInstitutes(),
    {
      enabled: true,
    }
  );

  useEffect(() => {
    if (data?.success === true) {
      setColleges(data?.data?.result);
    }
  }, [data]);

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
    }

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg h-[480px] overflow-y-scroll">
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
              Email ID
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email" 
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-500"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your name"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-500"
            >
              Gender
            </label>
            <select
              id="gender"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="contactNumber"
              className="block text-sm font-medium text-gray-500"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              placeholder="Enter your number"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-500"
            >
              Select Country
            </label>
            <select
              id="country"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            >
              <option>Select Country</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="institute"
              className="block text-sm font-medium text-gray-500"
            >
              College You Are Reviewing
            </label>
            <SearchableDropdown 
              options={colleges} 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-500"
            >
              Location
            </label>
            <input
              type="text"
              id="address"
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
              Year of Pass-out
            </label>
            <select
              id="year"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
              onChange={handleInputChange}
            >
              <option>Select Year</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;