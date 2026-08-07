import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { History, Clock, MapPin, X, ChevronRight } from "lucide-react";

const MAX_ITEMS = 8;

const RecentlyViewed = () => {
  const [institutes, setInstitutes] = useState([]);
  const [open, setOpen] = useState(false);

  // ---- data logic: unchanged from the original component ----
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
    setOpen(false);
  };
  // ---- end data logic ----

  // Nothing to show yet -> render nothing at all (no icon, no panel)
  if (institutes.length === 0) return null;

  const visible = institutes.slice(0, MAX_ITEMS);
  const morphTransition = { type: "spring", stiffness: 340, damping: 32, mass: 0.9 };

  return createPortal(
    <div className="fixed bottom-6 left-6 z-[99999]">
      <AnimatePresence mode="popLayout">
        {!open && (
          <motion.button
            key="fab"
            layoutId="rv-shell"
            layout
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={morphTransition}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative w-14 h-14 rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 flex items-center justify-center"
            aria-label="Show recently viewed institutes"
          >
            <motion.div layoutId="rv-icon" transition={morphTransition}>
              <History className="w-5 h-5 text-red-500" />
            </motion.div>
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm ring-2 ring-white">
              {institutes.length}
            </span>
          </motion.button>
        )}

        {open && (
          <motion.div
            key="panel"
            layoutId="rv-shell"
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={morphTransition}
            className="w-[320px] max-w-[88vw] max-h-[35vh] rounded-3xl bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-black/5 overflow-hidden flex flex-col"
          >
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <motion.div layoutId="rv-icon" transition={morphTransition} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <History className="w-4 h-4 text-red-500" />
                </motion.div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-gray-800">Recently Viewed</span>
                  <span className="text-[11px] font-medium text-gray-500 mt-1">
                    {institutes.length} {institutes.length === 1 ? "Institute" : "Institutes"}
                  </span>
                </div>
              </div>
              <motion.button
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.08, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-500 transition-colors"
                aria-label="Close recently viewed"
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              className="overflow-y-auto px-3 py-3 space-y-1.5"
              style={{ scrollbarWidth: "thin" }}
            >
              {visible.map((inst, i) => (
                <motion.div
                  key={inst._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.12 + i * 0.03 } }}
                >
                  <Link
                    to={`/institute/${inst.slug || inst._id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50/60 border border-transparent hover:border-red-100 transition-all group relative"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 ring-1 ring-gray-100 shadow-sm">
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 rounded-lg text-red-600 font-bold text-xs">
                        {inst.instituteName?.charAt(0) || "?"}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-gray-800 truncate group-hover:text-red-500 transition-colors">
                          {inst.instituteName}
                        </p>
                        {inst.admissionOpen && (
                          <span className="shrink-0 text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full leading-none">
                            Open
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {inst.city && (
                          <span className="text-[11px] font-medium text-gray-500 truncate flex items-center gap-1">
                            <MapPin size={10} className="text-red-400/70" />
                            {inst.city}
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
                      className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
                      aria-label={`Remove ${inst.instituteName}`}
                    >
                      <X size={11} className="text-gray-400 hover:text-red-500" />
                    </button>

                    <ChevronRight size={14} className="text-gray-300 group-hover:text-red-400 shrink-0 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* footer */}
            <div className="px-3 pb-3 pt-1 shrink-0 border-t border-gray-100">
              <button
                onClick={clearAll}
                className="w-full text-xs font-bold text-gray-500 hover:text-red-500 py-2.5 text-center transition-all rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
              >
                <History size={12} />
                Clear browsing history
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
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