import React, { useState } from "react";
import instituteLogo from "../assets/Images/instituteLogo.png";
import location from "../assets/Images/location.png";
import serachBoximg from "../assets/Images/serachBoximg.jpg";
import axiosInstance from "../ApiFunctions/axios";
import { toast } from "react-toastify";
const Images = import.meta.env.VITE_IMAGE_BASE_URL;
const baseURL = import.meta.env.VITE_BASE_URL;

const InstitueName = ({ instituteData }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleDownloadBrochure = async () => {
    try {
      const response = await axiosInstance.get(
        `${baseURL}/download-bruchure/${instituteData.data._id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
          responseType: "blob", // Ensures the response is treated as binary data
        }
      );

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);

      // Trigger a download
      const a = document.createElement("a");
      a.href = url;
      a.download = "brochure.jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Application submitted successfully!");
    setIsPopupVisible(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="min-h-20 w-full py-4 flex flex-col sm:flex-row gap-2 px-2 relative">
      <div className="instituteLogo absolute h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-48 xl:w-48 bg-white rounded-lg shadow-lg -top-[60px] sm:-top-[60px] md:-top-[80px] xl:-top-[100px] flex items-center justify-center">
        <img
          className="h-full w-4/5 object-contain"
          src={
            instituteData.thumbnailImage
              ? `${Images}/${instituteData.thumbnailImage}`
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
            <p className="flex items-center text-sm font-semibold opacity-75">
              <img className="h-3" src={location} alt="location" />
              {instituteData?.data?.city}
            </p>
            <p className="text-sm font-semibold opacity-75">
              ● {instituteData?.data?.organisationType}
            </p>
            <p className="text-sm font-semibold opacity-75">
              ● {instituteData?.data?.establishedYear}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={handleDownloadBrochure}
            >
              Download Brochure
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setIsPopupVisible(true)}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-[1000]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Apply Now</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                  onClick={() => setIsPopupVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Submit
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
