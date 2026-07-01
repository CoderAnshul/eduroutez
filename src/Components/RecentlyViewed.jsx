import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { History, Clock, MapPin, X, Eye, ChevronRight } from "lucide-react";

const RecentlyViewed = ({ compact }) => {
  const [institutes, setInstitutes] = useState([]);
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(true);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem("recentlyViewed") || "[]";
      setInstitutes(JSON.parse(raw));
    } catch { }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);
    window.addEventListener("recentlyViewedUpdate", load);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
      window.removeEventListener("recentlyViewedUpdate", load);
    };
  }, [load]);

  const removeItem = (id) => {
    const updated = institutes.filter((i) => i._id !== id);
    setInstitutes(updated);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };

  const clearAll = () => {
    setInstitutes([]);
    localStorage.removeItem("recentlyViewed");
  };

  if (institutes.length === 0) return null;

  if (compact) {
    return (
      <div className="rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div
          onClick={() => setMinimized(!minimized)}
          className="flex items-center justify-between px-4 py-3.5 cursor-pointer select-none hover:bg-gray-50/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <History className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 leading-none">Recently Viewed</span>
              <span className="text-[11px] font-medium text-gray-500 mt-1">{institutes.length} {institutes.length === 1 ? 'Institute' : 'Institutes'}</span>
            </div>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white shadow-sm ring-1 ring-gray-100/50 bg-gray-50 transition-all">
            <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${minimized ? "" : "rotate-90"}`} />
          </div>
        </div>

        <div className={`transition-all duration-300 ease-in-out origin-top ${minimized ? "max-h-0 opacity-0 hidden" : "max-h-[500px] opacity-100 block"}`}>
          <div className="px-3 pb-3 space-y-1.5 border-t border-gray-100/80 pt-3">
            {institutes.slice(0, 5).map((inst) => (
              <Link
                key={inst._id}
                to={`/institute/${inst.slug || inst._id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white hover:shadow-md hover:shadow-red-500/5 border border-transparent hover:border-red-100/50 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-white ring-1 ring-gray-100 shadow-sm relative z-10 p-1">
                  {inst.logo ? (
                    <img src={inst.logo} alt="" className="w-full h-full object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => { e.target.style.display = "none" }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 rounded-md text-red-600 font-bold text-xs">
                      {inst.instituteName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-bold text-gray-800 truncate group-hover:text-red-500 transition-colors">
                      {inst.instituteName}
                    </p>
                    {inst.admissionOpen && (
                      <span className="shrink-0 text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full leading-none">Open</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {inst.city && (
                      <span className="text-[11px] font-medium text-gray-500 truncate flex items-center gap-1">
                        <MapPin size={10} className="text-red-400/70" />{inst.city}
                      </span>
                    )}
                    {inst.viewedAt && (
                      <span className="text-[9px] font-medium text-gray-400 ml-auto flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                        <Clock size={8} />
                        {formatTimeAgo(inst.viewedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(inst._id); }}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 relative z-10 transition-all duration-200"
                >
                  <X size={12} className="text-gray-400 hover:text-red-500" />
                </button>
              </Link>
            ))}
            {institutes.length > 5 && (
              <div className="pt-2">
                <button onClick={clearAll} className="w-full text-xs font-bold text-gray-500 hover:text-red-500 py-2.5 text-center transition-all rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center gap-2">
                  <History size={12} />
                  Clear browsing history
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (dismissed) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[95vw] max-w-5xl animate-slideUp">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white p-5 pl-6 ring-1 ring-black/5">
          <div className="absolute -top-4 left-8 px-5 py-2 rounded-xl bg-gray-900 shadow-xl flex items-center gap-2 border border-gray-800 transform transition-transform hover:-translate-y-1">
            <History className="w-4 h-4 text-red-500" />
            <span className="text-xs font-black text-white tracking-widest uppercase">Recently Viewed</span>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-3 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 hover:bg-red-50 hover:scale-110 hover:text-red-500 transition-all group"
          >
            <X size={14} className="text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>

          <div className="flex gap-4 overflow-x-auto pt-3 pb-2 scrollbar-none snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {institutes.slice(0, 8).map((inst) => (
              <Link
                key={inst._id}
                to={`/institute/${inst.slug || inst._id}`}
                className="group snap-start shrink-0 relative outline-none"
              >
                <div className="w-[260px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-[140px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-orange-50/0 group-hover:from-red-50/50 group-hover:to-orange-50/50 transition-colors z-0" />

                  <div className="relative z-10 flex flex-col h-full bg-transparent rounded-2xl p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-14 h-14 rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-center bg-white overflow-hidden flex-shrink-0 group-hover:scale-105 group-hover:border-red-100 group-hover:shadow-md transition-all duration-300 relative z-10">
                        {inst.logo ? (
                          <img src={inst.logo} alt="" className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = "none" }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-500 font-bold text-lg rounded-lg">
                            {inst.instituteName?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pt-0.5">
                        {inst.admissionOpen && (
                          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full mb-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full" />
                            Admissions Open
                          </span>
                        )}
                        <p className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                          {inst.instituteName}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100/50 relative z-10">
                      <div className="flex flex-col gap-1">
                        {inst.city ? (
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                            <MapPin size={11} className="text-red-400" />
                            <span className="truncate max-w-[120px]">{inst.city}{inst.state ? `, ${inst.state}` : ""}</span>
                          </div>
                        ) : <div />}
                        {inst.viewedAt && (
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                            <Clock size={10} className="text-gray-300" />
                            <span>{formatTimeAgo(inst.viewedAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm ring-1 ring-gray-100 group-hover:ring-red-500">
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          0% { opacity: 0; transform: translate(-50%, 50px) scale(0.95); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </>
  );
};

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default RecentlyViewed;
