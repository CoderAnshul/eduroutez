import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";

const Faqs = ({ instituteData }) => {
  const [faqs, setFaqs] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          `${apiUrl}/faq-by-institute/${instituteData?.data?._id}`
        );
        const faqData = response?.data?.data || [];
        setFaqs(Array.isArray(faqData) ? faqData : []);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFaqs();
    }
  }, [id, apiUrl]);

  const renderContent = () => {
    if (isLoading) return <div>Loading FAQs...</div>;
    if (error) return null;

    if (!faqs || faqs.length === 0) {
      return (
        <div className="text-gray-500 italic">
          No FAQs available for this institute.
        </div>
      );
    }

    return (
      <>
        <div
          className="border-2 rounded-xl p-3 overflow-hidden transition-all"
          style={{ maxHeight: showMore ? "1000px" : "calc(8 * 60px)" }}
        >
          {faqs.slice(0, showMore ? faqs.length : 8).map((faq, index) => (
            <div key={index} className="border-b last:border-b-0 py-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => {
                  const details = document.getElementById(
                    `faq-details-${index}`
                  );
                  details?.classList.toggle("hidden");
                }}
              >
                <h4 className="text-md font-semibold">
                  {faq?.question || "Untitled Question"}
                </h4>
                <ChevronDown className="text-gray-500" />
              </div>
              <div
                id={`faq-details-${index}`}
                className="hidden mt-2 text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: faq?.answer || "No answer available",
                }}
              />
            </div>
          ))}
        </div>

        {faqs.length > 8 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-600 mt-2"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="min-h-28 w-full flex flex-col justify-between rounded-xl mb-5 sm:p-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Questions & Answers</h3>
          <h4 className="font-semibold opacity-75">
            ({faqs?.length || 0} Questions)
          </h4>
        </div>
        <button
          className="bg-[#b82025] text-sm font-medium px-4 py-3 rounded-lg text-white"
          onClick={() =>
            (window.location.href = `/questionandAnswer/${instituteData?.data?.email}`)
          }
        >
          Ask our experts
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Faqs;