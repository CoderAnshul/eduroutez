import React, { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import axiosInstance from "../ApiFunctions/axios";
import { Link } from "react-router-dom";

export default function NewsPage() {
  const [latestNews, setLatestNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  const fetchLatestNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/news/superadmin`
      );
      setLatestNews(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching latest news:", error.message);
      setError("Failed to load news. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestNews();
  }, []);

  // Filter and sort news based on search query and selected order
  const filteredAndSortedNews = [...latestNews]
    .filter((news) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        news.title.toLowerCase().includes(searchLower) ||
        news.description.toLowerCase().includes(searchLower) ||
        (news.category && news.category.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedNews.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = filteredAndSortedNews.slice(startIndex, endIndex);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchLatestNews}
          className="rounded-lg bg-[#b82025] px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Latest News</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredAndSortedNews.length === 0 ? (
        <div className="text-center text-gray-500">
          {searchQuery
            ? "No results found for your search."
            : "No news articles available."}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentNews.map((news, index) => (
              <div
                key={news.id || index}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {news.image && (
                  <img
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${news.image}`}
                    alt={news.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-800">
                    {news.title}
                  </h2>
                  <p className="line-clamp-3 text-gray-600">
                    {news.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </span>
                    {news.category && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600">
                        {news.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                className={`rounded-lg border px-4 py-2 text-sm transition-colors
                  ${
                    page === 1
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors
                    ${
                      page === index + 1
                        ? "bg-[#b82025] text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`rounded-lg border px-4 py-2 text-sm transition-colors
                  ${
                    page === totalPages
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
