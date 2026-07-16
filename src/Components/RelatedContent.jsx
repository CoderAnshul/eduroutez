import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Building2, Briefcase, ChevronRight, Sparkles, Eye } from "lucide-react";
import { getRelatedContent } from "../ApiFunctions/api";

const RelatedContent = ({ contentId, contentType }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchId = useRef(0);

  useEffect(() => {
    if (!contentId || !contentType) {
      setLoading(false);
      return;
    }

    const id = ++fetchId.current;
    setLoading(true);

    const safeSet = (fn, val) => { if (id === fetchId.current) fn(val); };

    const timer = setTimeout(() => safeSet(setLoading, false), 8000);

    getRelatedContent({ contentId, contentType, limit: 6 })
      .then((res) => {
        safeSet(setData, res);
      })
      .catch(() => {
        safeSet(setData, null);
      })
      .finally(() => {
        clearTimeout(timer);
        safeSet(setLoading, false);
      });
  }, [contentId, contentType]);

  if (loading) {
    return (
      <div className="w-full max-w-[1420px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { blogs = [], careers = [], courses = [], institutes = [] } = data;
  const allItems = [];

  blogs.forEach((b) => allItems.push({ ...b, _type: "blog", _link: `/blogdetailpage/${b._id}`, _title: b.title, _desc: b.description, _image: b.thumbnail || b.coverImages?.[0] || null, _badge: "Blog", _badgeColor: "bg-purple-100 text-purple-700" }));
  careers.forEach((c) => allItems.push({ ...c, _type: "career", _link: `/career/${c.slug || c._id}`, _title: c.title, _desc: c.description, _image: null, _badge: "Career", _badgeColor: "bg-green-100 text-green-700" }));
  courses.forEach((c) => allItems.push({ ...c, _type: "course", _link: `/coursesinfopage/${c._id}`, _title: c.courseTitle, _desc: c.shortDescription, _image: null, _badge: "Course", _badgeColor: "bg-blue-100 text-blue-700" }));
  institutes.forEach((i) => allItems.push({ ...i, _type: "institute", _link: `/institute/${i._id}`, _title: i.instituteName, _desc: i.about, _image: null, _badge: "Institute", _badgeColor: "bg-amber-100 text-amber-700" }));

  allItems.sort((a, b) => (b._relScore || 0) - (a._relScore || 0));

  if (!allItems.length) return null;

  const Images = import.meta.env.VITE_IMAGE_BASE_URL;

  const stripHtml = (html) => {
    if (!html) return "";
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    } catch { return html.replace(/<[^>]*>/g, ""); }
  };

  const fallbackIcon = (type) => {
    if (type === "career") return <Briefcase className="w-12 h-12 text-green-400" />;
    if (type === "course") return <BookOpen className="w-12 h-12 text-blue-400" />;
    if (type === "institute") return <Building2 className="w-12 h-12 text-amber-400" />;
    return <BookOpen className="w-12 h-12 text-purple-400" />;
  };

  const fallbackBg = (type) => {
    if (type === "career") return "from-green-50 to-emerald-50";
    if (type === "course") return "from-blue-50 to-indigo-50";
    if (type === "institute") return "from-amber-50 to-orange-50";
    return "from-purple-50 to-pink-50";
  };

  return (
    <div className="w-full max-w-[1420px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          You May Also Like
        </h3>
        <Link
          to="/recommendations"
          className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allItems.slice(0, 6).map((item) => (
          <Link
            key={`${item._type}-${item._id}`}
            to={item._link}
            className="group bg-white shadow-md rounded-xl overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`relative h-48 overflow-hidden flex-shrink-0 bg-gradient-to-br ${fallbackBg(item._type)}`}>
              {item._image ? (
                <img
                  src={`${Images}/${item._image}`}
                  alt={item._title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  {fallbackIcon(item._type)}
                </div>
              )}
              <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm ${item._badgeColor}`}>
                {item._badge}
              </span>
              {item.views > 0 && (
                <span className="absolute top-3 right-3 bg-black/40 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                  <Eye className="w-3 h-3" /> {item.views}
                </span>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-gray-800 text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-red-600 transition-colors">
                  {item._title}
                </h4>
                {item._desc && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {stripHtml(item._desc).length > 120
                      ? stripHtml(item._desc).slice(0, 120) + "..."
                      : stripHtml(item._desc)}
                  </p>
                )}
              </div>

              <span className="mt-4 w-full bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-center font-medium text-sm flex items-center justify-center gap-1.5 group-hover:bg-[#b82025] group-hover:text-white transition-all duration-300">
                View {item._badge} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedContent;
