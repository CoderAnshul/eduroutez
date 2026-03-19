import React, { useState } from "react";
import { useQuery } from "react-query";
import { getWebinars } from "../ApiFunctions/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const WebinarsPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery(
    ["webinars", { search, page, limit }],
    () => getWebinars({ search, page, limit }),
    {
      keepPreviousData: true,
    }
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  // Normalize API response so webinars is always an array
  let webinars = [];
  let totalPages = 1;

  if (data) {
    const inner = data.data;

    if (Array.isArray(inner)) {
      webinars = inner;
      totalPages = data.totalPages || 1;
    } else if (inner && typeof inner === "object") {
      webinars = Array.isArray(inner.result) ? inner.result : [];
      totalPages = inner.totalPages || data.totalPages || 1;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Webinars</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Browse upcoming and recorded webinars across all institutes.
          </p>
        </div>
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto flex gap-2">
          <input
            type="text"
            placeholder="Search webinars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#b82025] text-white rounded-lg font-semibold hover:bg-[#971a1f]"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-600">Loading webinars...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-red-500">Error loading webinars.</p>
        </div>
      ) : webinars.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-gray-600">No webinars found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {webinars.map((webinar) => {
              const formattedDate = webinar?.date
                ? format(new Date(webinar.date), "MMM dd, yyyy")
                : "Date TBA";

              return (
                <div
                  key={webinar._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-4 flex flex-col justify-between h-56">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {webinar?.title || "Untitled Webinar"}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <span>📅 {formattedDate}</span>
                        <span>⏰ {webinar?.time || "Time TBA"}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {webinar?.description || "No description available"}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center gap-2">
                      <button
                        className="px-3 py-2 bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-200 border border-gray-200"
                        onClick={() => navigate("/dashboard/refer&earn")}
                      >
                        Refer for Webinar
                      </button>
                      {webinar?.webinarLink && (
                        <button
                          className="px-3 py-2 bg-[#b82025] text-white text-xs font-semibold rounded-lg hover:bg-[#971a1f]"
                          onClick={() => window.open(webinar.webinarLink, "_blank")}
                        >
                          Join Webinar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WebinarsPage;
