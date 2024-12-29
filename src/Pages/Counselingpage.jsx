import React, { useState } from "react";
import PageBanner from "../Ui components/PageBanner";
import ConsellingBanner from "../Components/ConsellingBanner";
import { useQuery } from "react-query";
import { counsellers } from "../ApiFunctions/api";
import { Link } from "react-router-dom";

const counselors = [
  {
    name: "Prof. Nitish Kumar",
    expertise: "Medical",
    languages: "Hindi, English, Marathi",
    experience: "12 Years",
    rating: "4.1",
  },
  {
    name: "Prof. Priya Sharma",
    expertise: "Computer Science",
    languages: "English, Hindi",
    experience: "10 Years",
    rating: "4.5",
  },
  {
    name: "Dr. Rahul Verma",
    expertise: "Psychology",
    languages: "Hindi, English",
    experience: "8 Years",
    rating: "4.3",
  },
  {
    name: "Dr. Anjali Desai",
    expertise: "Education",
    languages: "Marathi, English",
    experience: "15 Years",
    rating: "4.7",
  },
  {
    name: "Prof. Sneha Gupta",
    expertise: "Law",
    languages: "Hindi, English",
    experience: "7 Years",
    rating: "4.2",
  },
  {
    name: "Prof. Amit Patel",
    expertise: "Engineering",
    languages: "Gujarati, English",
    experience: "9 Years",
    rating: "4.4",
  },
  {
    name: "Dr. Kavita Rao",
    expertise: "Medical",
    languages: "Tamil, English",
    experience: "12 Years",
    rating: "4.6",
  },
  {
    name: "Prof. Manoj Tiwari",
    expertise: "Data Science",
    languages: "Hindi, English",
    experience: "6 Years",
    rating: "4.0",
  },
  {
    name: "Dr. Radhika Singh",
    expertise: "Literature",
    languages: "Hindi, English",
    experience: "14 Years",
    rating: "4.8",
  },
  {
    name: "Prof. Sanjay Kumar",
    expertise: "Finance",
    languages: "Hindi, English",
    experience: "11 Years",
    rating: "4.3",
  },
  {
    name: "Dr. Meena Chakraborty",
    expertise: "Biology",
    languages: "Bengali, English",
    experience: "10 Years",
    rating: "4.5",
  },
  {
    name: "Prof. Rajesh Malhotra",
    expertise: "History",
    languages: "Punjabi, English",
    experience: "13 Years",
    rating: "4.6",
  },
];

const tabs = [
  "Best Rated Counseling",
  "Highly recommended",
  "Domain expert counselor",
  "Highly Experience Counselor",
];

const Counselingpage = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Default to the first tab

  const {
    data: counselingData,
    isLoading,
    isError,
    error,
  } = useQuery(["blogs"], () => counsellers(), { enabled: true });
  console.log(counselingData);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  const imageURL = import.meta.env.IMAGE_BASE_URL;

  const handleConnectClick = (email) => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      window.location.href = `/counselling/${email}`;
    } else {
      alert("Please log in first.");
    }
  };

  return (
    <>
      <PageBanner pageName="Counseling" currectPage="Counseling" />
      <div className="px-[4vw] py-[2vw] flex flex-col items-center w-full">
        <div className="md:p-6 w-full">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-gray-300"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(index)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  selectedTab === index
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="flex gap-4 flex-wrap">
            {counselingData?.data?.result.map((counselor, index) => (
              <div
                key={index}
                className=" flex-1 !min-w-[300px] !max-w-sm border rounded-lg shadow-sm bg-red-50 p-4 space-x-4"
              >
                <div className="flex gap-3 justify-between w-full ">
                  <div className="flex flex-col items-center">
                    <img
                      className="w-16 h-16 bg-gray-300 rounded-full"
                      src={`${imageURL}/${counselor?.profilePicture}`}
                      alt="logo"
                    />
                    <div className="flex items-center mt-2 text-yellow-500">
                      <span>★</span>
                      <span className="ml-1 text-sm">{counselor.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap w-full">
                    {/* Counselor Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {`${counselor.firstname} ${counselor.lastname}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Expert in: {counselor.category}
                      </p>
                      <p className="text-sm text-gray-600">
                        {counselor.language}
                      </p>
                      <p className="text-sm text-gray-600">
                        Exp: {counselor.ExperienceYear}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Connect Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleConnectClick(counselor?.email)}
                    className="px-4 py-2 self-end bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConsellingBanner className="!w-full" />
    </>
  );
};

export default Counselingpage;
