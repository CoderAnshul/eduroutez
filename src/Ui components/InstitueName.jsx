import React, { useState, useEffect } from "react";
import location from "../assets/Images/location.png";
import serachBoximg from "../assets/Images/serachBoximg.jpg";
import axiosInstance from "../ApiFunctions/axios";
import { toast } from "react-toastify";
import { Building, Calendar } from "lucide-react";

const Images = import.meta.env.VITE_IMAGE_BASE_URL;
const baseURL = import.meta.env.VITE_BASE_URL;

const InstitueName = ({ instituteData }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [streams, setStreams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    city: "",
    queryRelatedTo: "",
    instituteId: "",
    stream: "",
    level: "",
  });

  // Fetch streams on component mount
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await axiosInstance.get(
          `${baseURL}/streams?page=0&sort={"createdAt":"asc"}`,
          {
            headers: {
              "x-access-token": localStorage.getItem("accessToken"),
              "x-refresh-token": localStorage.getItem("refreshToken"),
            },
          }
        );
        console.log("Streams:", response.data.data);
        setStreams(response.data.data || []);
      } catch (error) {
        console.error("Error fetching streams:", error);
        toast.error("Failed to load streams");
      }
    };

    fetchStreams();
  }, []);

  const handleDownloadBrochure = async () => {
    try {
      const response = await axiosInstance.get(
        `${baseURL}/download-bruchure/${instituteData.data._id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
          responseType: "blob",
        }
      );

      // Get content type from response
      const contentType = response.headers["content-type"];

      // Set file extension and type based on content type
      let fileExtension;
      let mimeType;

      if (contentType.includes("pdf")) {
        fileExtension = "pdf";
        mimeType = "application/pdf";
      } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
        fileExtension = "jpg";
        mimeType = "image/jpeg";
      } else if (contentType.includes("png")) {
        fileExtension = "png";
        mimeType = "image/png";
      } else {
        // Default to PDF if content type is not recognized
        fileExtension = "pdf";
        mimeType = "application/pdf";
      }

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `brochure.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);

      toast.success("Brochure downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download brochure");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const queryPayload = {
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phone,
        city: formData.city,
        query: formData.message,
        queryRelatedTo: formData.queryRelatedTo,
        instituteId: instituteData?.data?._id,
        stream: formData.stream,
        level: formData.level,
      };

      console.log("Query payload:", queryPayload);

      await axiosInstance.post(`${baseURL}/query`, queryPayload, {
        headers: {
          "x-access-token": localStorage.getItem("accessToken"),
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
      });

      toast.success("Application submitted successfully!");
      setIsPopupVisible(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        city: "",
        queryRelatedTo: "",
        stream: "",
        level: "",
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit application");
    }
  };

  return (
    <div className="min-h-20 w-full py-4 flex flex-col sm:flex-row gap-2 px-2 relative">
      <div className="instituteLogo absolute h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-48 xl:w-48 bg-white rounded-lg shadow-lg -top-[60px] sm:-top-[60px] md:-top-[80px] xl:-top-[100px] flex items-center justify-center">
        <img
          className="h-full w-4/5 object-contain"
          src={
            instituteData?.data?.instituteLogo
              ? `${Images}/${instituteData?.data?.instituteLogo}`
              : serachBoximg
          }
          alt="instituteLogo"
        />
      </div>

      <div className="filler h-10 w-36 sm:h-14 sm:w-40 md:h-[70px] bg-transparent md:w-52 xl:h-[80px] xl:w-56 rounded-lg flex items-center justify-center "></div>

      <div className="name w-full min-h-20 ">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold ">
          {instituteData.data.instituteName}
        </h2>

        <div className="text-container flex justify-between items-center flex-wrap gap-2 mt-1">
          <div className="flex mt-2 gap-3 whitespace-nowrap">
            {instituteData?.data?.city?.name && (
              <p className="flex items-center text-sm font-semibold opacity-75">
                <img className="h-3" src={location} alt="location" />
                {instituteData.data.city.name}
              </p>
            )}

            {instituteData?.data?.organisationType && (
              <p className="text-sm font-semibold opacity-75 flex items-center">
                <Building size={16} className="text-gray-500 mr-2" />
                {instituteData.data.organisationType}
              </p>
            )}

            {instituteData?.data?.establishedYear && (
              <p className="text-sm font-semibold opacity-75  flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                {instituteData.data.establishedYear}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              className="bg-[#b82025] text-white px-4 py-2 rounded-lg"
              onClick={handleDownloadBrochure}
            >
              Download Brochure
            </button>
            <button
              className="bg-[#b82025] text-white px-4 py-2 rounded-lg"
              onClick={() => setIsPopupVisible(true)}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-[1000] p-4 overflow-hidden">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto border border-gray-100 max-h-70vh] w-full overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Apply Now</h2>
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => setIsPopupVisible(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                Close
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[500px] overflow-y-auto pr-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Left column */}
                <div className="space-y-2">
                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                        placeholder="(123) 456-7890"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="city"
                    >
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-2">
                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="stream"
                    >
                      Stream
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <select
                        id="stream"
                        name="stream"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 appearance-none bg-white"
                        value={formData.stream}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a Stream</option>
                        {streams?.result?.map((stream) => (
                          <option key={stream._id} value={stream._id}>
                            {stream.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="level"
                    >
                      Academic Level
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                      </div>
                      <select
                        id="level"
                        name="level"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 appearance-none bg-white"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Academic Level</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="masters">Master's Degree</option>
                        <option value="diploma">Diploma</option>
                        <option value="phd">PhD</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-1"
                      htmlFor="queryRelatedTo"
                    >
                      Query Topic
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="queryRelatedTo"
                        name="queryRelatedTo"
                        className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                        placeholder="Topic of your query"
                        value={formData.queryRelatedTo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full width message field */}
              <div className="mt-3">
                <label
                  className="block text-xs font-medium text-gray-700 mb-1"
                  htmlFor="message"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 min-h-16"
                  placeholder="Please describe your query in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="3"
                ></textarea>
              </div>

              {/* Submit button */}
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#b82025] hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 shadow-sm text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitueName;
