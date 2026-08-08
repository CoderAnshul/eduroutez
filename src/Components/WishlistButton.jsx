import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { addToWishlist } from "../ApiFunctions/api";
import axios from "axios";

const WishlistButton = ({ type, id, initialWishlisted = false, onToggle, className = "", size = 5, showLabel = false, labelClass = "" }) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setIsWishlisted(initialWishlisted);
  }, [initialWishlisted]);

  useEffect(() => {
    if (!id) return;
    const checkWishlist = async () => {
      try {
        const res = await axios.get(`${VITE_BASE_URL}/wishlists`, {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        });
        if (res.data?.success) {
          const data = res.data.data;
          if (type === "institute" && data.college_wishlist) {
            setIsWishlisted(data.college_wishlist.some((c) => c._id === id));
          }
          if (type === "course" && data.course_wishlist) {
            setIsWishlisted(Array.isArray(data.course_wishlist) ? data.course_wishlist.some((c) => c._id === id) : data.course_wishlist._id === id);
          }
        }
      } catch {}
    };
    if (!initialWishlisted) checkWishlist();
  }, [id, type]);

  const handleClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!localStorage.getItem("accessToken")) {
      navigate("/login", { state: { backgroundLocation: location } });
      return;
    }

    setLoading(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    try {
      const payload = type === "course" ? { courseId: id } : { instituteId: id };
      const response = await addToWishlist(payload);
      const msg = String(response?.message || "").toLowerCase();
      const newState = msg.includes("removed") ? false : msg.includes("added") ? true : !isWishlisted;
      setIsWishlisted(newState);
      if (onToggle) onToggle(newState);
    } catch {
      setAnimating(false);
    } finally {
      setLoading(false);
    }
  }, [id, type, isWishlisted, navigate, location, onToggle]);

  const sanitizedClassName = className
    .split(" ")
    .filter((cls) => {
      return !(
        cls.startsWith("bg-") ||
        cls.startsWith("hover:bg-") ||
        cls.startsWith("p-") ||
        cls.startsWith("rounded-") ||
        cls.startsWith("shadow-")
      );
    })
    .join(" ");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 transition-all duration-200 select-none ${sanitizedClassName} ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`transition-all duration-300 ${
          animating ? "scale-125" : ""
        } ${
          isWishlisted
            ? "fill-red-500 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            : "text-white hover:text-red-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        }`}
        style={{ width: `${(size * 0.25 + 0.75) * 0.8}rem`, height: `${(size * 0.25 + 0.75) * 0.8}rem` }}
      />
      {showLabel && (
        <span className={`text-xs font-semibold transition-colors duration-200 ${labelClass || (isWishlisted ? "text-red-500" : "text-gray-500")}`}>
          {isWishlisted ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
