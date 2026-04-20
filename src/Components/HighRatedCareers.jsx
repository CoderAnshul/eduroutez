import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { career } from "../ApiFunctions/api";
import cardPhoto from "../assets/Images/teacher.jpg";
import SocialShare from "./SocialShare";
import { Sparkles, ArrowRight, Eye } from "lucide-react";

// Clean HTML content
const stripHtml = (html) => {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

const HighRatedCareers = ({ title = "High Rated careers", streamId, categoryId }) => {
  const [content, setContent] = useState([]);
  const [images, setImages] = useState({});

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    try {
      const storedCareerIdMap = JSON.parse(
        localStorage.getItem("careerIdMap") || "{}"
      );
      window.careerIdMap = storedCareerIdMap;
    } catch (error) {
      console.error("Error loading careerIdMap from localStorage:", error);
      window.careerIdMap = {};
    }
  }, []);

  const handleShareClick = (e, blog) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const { data, isLoading, isError } = useQuery(
    ["career", streamId, categoryId],
    async () => {
      let url = `${baseURL}/careers?limit=3&sort={"createdAt":"desc"}`;

      const filters = {};
      if (streamId) filters.stream = streamId;
      if (categoryId) filters.category = categoryId;

      if (Object.keys(filters).length > 0) {
        url = `${baseURL}/careers?filters=${encodeURIComponent(JSON.stringify(filters))}&limit=3&sort={"createdAt":"desc"}`;
      }

      const response = await axios.get(url);
      return response.data;
    },
    {
      enabled: true,
      onSuccess: async (data) => {
        const { result } = data?.data || {};
        if (result) {
          const careerIdMap = { ...window.careerIdMap };

          result.forEach((blog) => {
            if (blog.slug) {
              careerIdMap[blog.slug] = blog._id;
            }
          });

          window.careerIdMap = careerIdMap;
          localStorage.setItem("careerIdMap", JSON.stringify(careerIdMap));

          setContent(result);

          const imageMap = result.reduce((acc, career) => {
            acc[career._id] = career.thumbnail
              ? `${Images}/${career.thumbnail}`
              : cardPhoto;
            return acc;
          }, {});
          setImages(imageMap);
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      Object.values(images).forEach((url) => {
        if (url !== cardPhoto) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  const memoizedContent = useMemo(() => content, [content]);

  if (isLoading) {
    return null; // Return nothing while loading to avoid layout shifts
  }

  if (isError) {
    return null; // Hide on error
  }

  if (content.length === 0) {
    return null;
  }

  return (
    <div className="universal-container py-12 w-full min-h-44 max-w-[1420px] pl-[10px] pr-[10px] pb-10 mx-auto">
    {/* <div className="container mx-auto px-4 py-12"> */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <Link to="/careerspage">
          <button className="bg-[#b82025] hover:bg-red-700 text-white py-2 px-5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group">
            <span className="font-medium text-sm">View more</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {memoizedContent && memoizedContent.length > 0 ? (
          memoizedContent.map((box, index) => (
            <Link
              to={`/detailpage/${box.slug}`}
              key={box._id || index}
              className="group bg-white text-black shadow-md rounded-xl overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image with Overlay */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={images[box._id] || cardPhoto}
                  alt={box?.title || "Career"}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-medium px-2 py-1 rounded shadow-sm">
                      Career
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white text-xl font-bold line-clamp-2 drop-shadow-md antialiased leading-tight mb-2">
                      {box?.title || "Untitled"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 px-2 pt-1 flex-1">
                  <div 
                    className="text-gray-700 text-sm line-clamp-3 h-18"
                    dangerouslySetInnerHTML={{
                      __html: stripHtml(box?.description || "No description available")
                    }}
                  ></div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Eye size={14} className="text-gray-400" />
                      <span>{box.views || 0} views</span>
                    </div>

                    <div 
                      className="transition-transform hover:scale-110"
                      onClick={(e) => handleShareClick(e, box)}
                    >
                      <SocialShare
                        title={box.title}
                        url={`${window.location.origin}/detailpage/${box.slug}`}
                        contentType="career"
                      />
                    </div>
                  </div>
                </div>

                {/* Pin Action Button to Bottom */}
                <div className="mt-6">
                  <div className="w-full bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-center font-medium text-sm flex items-center justify-center group-hover:bg-[#b82025] group-hover:text-white transition-all duration-300">
                    <span>View Career</span>
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full text-center">
            No careers available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default HighRatedCareers;
