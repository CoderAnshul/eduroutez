import SafeImage from "../Ui components/SafeImage";
import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";
import WishlistButton from "../Components/WishlistButton";
import { allRecommendedInstitute } from "../ApiFunctions/api";
import { useQuery } from "react-query";
import BlogComponent from "../Components/BlogComponent";
import HighRatedCareers from "../Components/HighRatedCareers";
import Pagination from "../Components/Pagination";
import { useState, useEffect } from "react";

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const RecommendedInstitute = () => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  const updateIdMapping = (institutes) => {
    let hasChanges = false;
    institutes.forEach((institute) => {
      if (institute.slug && institute._id && !window.instituteIdMap[institute.slug]) {
        window.instituteIdMap[institute.slug] = institute._id;
        hasChanges = true;
      }
    });
    if (hasChanges) {
      localStorage.setItem("instituteIdMap", JSON.stringify(window.instituteIdMap));
    }
  };

  const getInstituteUrl = (institute) => {
    return institute?.slug ? `/institute/${institute.slug}` : `/institute/${institute?._id}`;
  };

  const { isLoading, isError } = useQuery(
    ["recommendedInstitutes"],
    () => allRecommendedInstitute(),
    {
      enabled: true,
      onSuccess: (data) => {
        const institutes = data.data?.result || [];
        setContent(institutes);
        if (institutes.length > 0) updateIdMapping(institutes);
      },
    }
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = content.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(content.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Institutes</h2>
          <p>Unable to fetch recommended institutes. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        No recommended institutes available
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-16 text-center mb-12 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Recommended Institutes</h1>
          <p className="text-xl">
            Hand-picked institutions recommended by our education experts for your academic success
          </p>
        </div>

        <div className="universal-container">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold">Recommended Institutes</h3>
            <p className="text-gray-600">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, content.length)} of {content.length} institutes
            </p>
          </div>

          <div className="boxWrapper w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((institute, index) => (
              <Link to={getInstituteUrl(institute)} key={institute._id || index} className="box shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="imageContainer h-48 overflow-hidden relative">
                  {institute.admissionOpen && (
                    <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      Admission Open
                    </div>
                  )}
                  <SafeImage className="h-full w-full object-cover" src={institute.thumbnailImage ? `${Images}/${institute.thumbnailImage}` : cardPhoto} alt={institute.instituteName} title={institute.instituteName} />
                  <div className="absolute top-3 right-3 z-10">
                    <WishlistButton type="institute" id={institute._id} className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all hover:scale-110" size={4} />
                  </div>
                </div>
                <div className="textContainer p-4">
                  <h3 className="text-xl md:text-xl lg:text-xl font-bold text-[#0B104A] antialiased leading-tight">{institute.instituteName}</h3>
                  <div className="text-sm mt-2 mb-4 line-clamp-3">
                    <span dangerouslySetInnerHTML={{ __html: institute.about && institute.about !== "0" && institute.about !== 0 ? institute.about.slice(0, 100) + "..." : "No description available" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
        </div>

        <BlogComponent />
        <HighRatedCareers />
      </div>
    </>
  );
};

export default RecommendedInstitute;
