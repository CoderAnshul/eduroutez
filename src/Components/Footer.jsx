import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const [mbaBlogs, setMbaBlogs] = useState([]);
  const [medicineBlogs, setMedicineBlogs] = useState([]);
  const [resourceBlogs, setResourceBlogs] = useState([]);
  const [loading, setLoading] = useState({
    mba: true,
    medicine: true,
    resources: true
  });

  useEffect(() => {
    const fetchBlogs = async (category, setter) => {
      try {
        const response = await axios.get('https://api.eduroutez.com/api/v1/blogs', {
          params: {
            filters: JSON.stringify({ category: [category] }),
            sort: JSON.stringify({ createdAt: "desc" })
          }
        });
        
        const blogs = response.data?.data?.result || [];
        const limitedBlogs = blogs.slice(0, 8); // Limit to top 8 blogs
        
        setter(limitedBlogs);
        setLoading(prev => ({ ...prev, [category.toLowerCase()]: false }));
      } catch (error) {
        console.error(`Error fetching ${category} blogs:`, error);
        setter([]);
        setLoading(prev => ({ ...prev, [category.toLowerCase()]: false }));
      }
    };

    // Fetch all categories in parallel
    fetchBlogs("MBA", setMbaBlogs);
    fetchBlogs("Medicine", setMedicineBlogs);
    fetchBlogs("Resources", setResourceBlogs);
  }, []);

  // Split blogs into two columns
  const splitBlogs = (blogs) => {
    const halfIndex = Math.ceil(blogs.length / 2);
    return {
      firstHalf: blogs.slice(0, halfIndex),
      secondHalf: blogs.slice(halfIndex)
    };
  };

  const mbaBlogsSplit = splitBlogs(mbaBlogs);
  const medicineBlogsSplit = splitBlogs(medicineBlogs);
  const resourceBlogsSplit = splitBlogs(resourceBlogs);

  const renderBlogSection = (title, blogs, isLoading) => (
    <div>
      <h3 className="font-semibold text-red-500 mb-3">{title}</h3>
      {isLoading ? (
        <div className="text-sm text-gray-400">Loading {title.toLowerCase()} content...</div>
      ) : blogs.firstHalf.length === 0 && blogs.secondHalf.length === 0 ? (
        <div className="text-sm text-gray-400">No {title.toLowerCase()} content available</div>
      ) : (
        <div className="flex gap-4">
          <ul className="space-y-1 text-sm">
            {blogs.firstHalf.map((blog) => (
              <li key={blog._id}>
                <Link 
                  to={`/blogdetailpage/${blog._id}`} 
                  className="footerText hover:text-red-500 transition-colors"
                >
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-1 text-sm">
            {blogs.secondHalf.map((blog) => (
              <li key={blog._id}>
                <Link 
                  to={`/blogdetailpage/${blog._id}`} 
                  className="footerText hover:text-red-500 transition-colors"
                >
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <footer className="bg-black lg:whitespace-nowrap text-white py-8 px-4">
      <div className="flex justify-between flex-wrap gap-4 px-[4vw] mx-auto w-full mb-4 max-w-[1300px]">
        {renderBlogSection("MBA", mbaBlogsSplit, loading.mba)}
        {renderBlogSection("Medicine", medicineBlogsSplit, loading.medicine)}
        {renderBlogSection("Resources", resourceBlogsSplit, loading.resources)}
      </div>
    </footer>
  );
};

export default Footer;