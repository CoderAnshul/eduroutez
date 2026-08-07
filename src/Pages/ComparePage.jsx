import React, { useState, useEffect, useRef } from "react";
import {
    Search, X, Check, ArrowRight, MapPin, Building,
    Award, GraduationCap, DollarSign, Briefcase, Globe, Phone,
    Mail, Shield, FileText, Trophy, ChevronDown, ChevronUp,
    CalendarDays, Layers, Star, FileDown
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const COMPARE_LIMIT = 3;
const BASE_IMG = import.meta.env.VITE_BASE_URL?.replace("/api", "") || "";

/* ─── Helpers ─────────────────────────────────────────── */
const val = (v, fallback = "—") => {
    if (v === null || v === undefined || v === "" || v === "null" || v === "undefined") return fallback;
    if (typeof v === "object" && !Array.isArray(v)) return v.name || fallback;
    return v;
};

const imgSrc = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    return `${BASE_IMG}/uploads/${filename}`;
};

/* Collapsible HTML Cell for long rich text fields */
const CollapsibleHtmlCell = ({ html }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);
    const [shouldShowToggle, setShouldShowToggle] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            setShouldShowToggle(contentRef.current.scrollHeight > 120);
        }
    }, [html]);

    if (!html) return <span className="cp-empty">Not provided</span>;

    return (
        <div className="cp-collapsible-html-container">
            <div
                ref={contentRef}
                className={`cp-html-content ${!isExpanded ? "cp-html-content-collapsed" : ""}`}
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ maxHeight: isExpanded ? "none" : "120px" }}
            />
            {shouldShowToggle && (
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cp-html-expand-btn"
                >
                    {isExpanded ? "Show Less" : "Read More"}
                </button>
            )}
        </div>
    );
};

/* Tag pill */
const Tag = ({ label, color = "blue" }) => {
    const colors = {
        blue: "cp-tag-blue",
        green: "cp-tag-green",
        purple: "cp-tag-purple",
        orange: "cp-tag-orange",
        red: "cp-tag-red",
        gray: "cp-tag-gray",
    };
    return <span className={`cp-tag ${colors[color] || colors.gray}`}>{label}</span>;
};

/* ─── Main Component ───────────────────────────────────── */
const ComparePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [preferredCollegeId, setPreferredCollegeId] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [collapsedSections, setCollapsedSections] = useState({
        basic: false,
        academics: false,
        fees: false,
        placement: false,
        ranking: false,
        admission: false,
        facilities: false,
        about: true, // Collapse Overview by default
    });
    
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        let active = true;
        const fetch = async () => {
            if (searchQuery.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
            setIsSearching(true);
            try {
                let list = [];
                const r = await axios.get(`${import.meta.env.VITE_BASE_URL}/institutes`, {
                    params: { searchFields: JSON.stringify({ instituteName: searchQuery }), limit: 10, page: 1 }
                });
                list = r.data?.data?.result || r.data?.result || [];
                if (active) { setSuggestions(list); setShowSuggestions(list.length > 0); }
            } catch { if (active) { setSuggestions([]); setShowSuggestions(false); } }
            finally { if (active) setIsSearching(false); }
        };
        const t = setTimeout(fetch, 450);
        return () => { active = false; clearTimeout(t); };
    }, [searchQuery]);

    const handleSelect = async (item) => {
        setShowSuggestions(false);
        setSearchQuery("");
        if (selectedItems.find(i => i._id === item._id) || selectedItems.length >= COMPARE_LIMIT) return;
        try {
            const endpoint = `${import.meta.env.VITE_BASE_URL}/institute/${item._id}`;
            const r = await axios.get(endpoint);
            const full = r.data?.data || r.data;
            setSelectedItems(prev => [...prev, full || item]);
            toast.success("College added to comparison");
        } catch {
            setSelectedItems(prev => [...prev, item]);
            toast.success("College added to comparison");
        }
    };

    const removeItem = (id) => {
        setSelectedItems(prev => prev.filter(i => i._id !== id));
        if (preferredCollegeId === id) setPreferredCollegeId(null);
        toast.success("College removed");
    };

    const toggleMainSection = (key) => setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));

    const handleVote = (id) => {
        setPreferredCollegeId(id);
        toast.success("Thank you for voting your preference!");
    };

    const handleRating = (r) => {
        setUserRating(r);
        toast.success(`Thank you for rating us ${r} stars!`);
    };

    // Dynamic Title & Summary texts
    const comparedNamesStr = selectedItems.map(item => item.instituteName).join(" Vs ");
    const summaryText = selectedItems.length > 0
        ? `Compare ${selectedItems.map(item => item.instituteName).join(", ")} on the basis of their Fees, Placements, Course duration, Rankings, Facilities, and overall admission criteria. Choose the college that fits your career goals.`
        : "";

    return (
        <>
            <style>{`
                /* ─── SHIKSHA COMPARE OVERHAUL STYLES ──────────────── */
                .cp-root { min-height: 100vh; background: #f8fafc; padding-bottom: 80px; font-family: 'Inter', sans-serif; }

                /* Minimal Search Header */
                .cp-header-minimal { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 18px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .cp-header-minimal-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; flex-direction: column; gap: 16px; }
                @media (min-width: 768px) {
                    .cp-header-minimal-inner { flex-direction: row; align-items: center; justify-content: space-between; }
                }
                .cp-header-info { text-align: left; }
                .cp-header-info h1 { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 3px; }
                .cp-header-info p { font-size: 0.8rem; color: #64748b; }
                .cp-header-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex: 1; justify-content: flex-end; }

                /* Tab Toggle (Minimal) */
                .cp-toggle { display: inline-flex; background: #f1f5f9; border-radius: 999px; padding: 4px; border: 1px solid #e2e8f0; flex-shrink: 0; }
                .cp-toggle-btn { padding: 6px 18px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; background: transparent; color: #475569; }
                .cp-toggle-btn.active { background: #fff; color: #b82025; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                /* Search Bar */
                .cp-search-wrap { width: 100%; max-width: 400px; position: relative; }
                .cp-search-box { display: flex; align-items: center; background: #fff; border-radius: 999px; padding: 3px 3px 3px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.2s; border: 1px solid #cbd5e1; }
                .cp-search-box:focus-within { border-color: #b82025; box-shadow: 0 4px 12px rgba(184,32,37,0.08), 0 0 0 3px rgba(184,32,37,0.12); }
                .cp-search-icon { color: #94a3b8; flex-shrink: 0; width: 16px; height: 16px; }
                .cp-search-input { flex: 1; border: none; outline: none; background: transparent; padding: 6px 10px; font-size: 0.85rem; color: #1e293b; font-weight: 500; min-width: 0; }
                .cp-search-input::placeholder { color: #94a3b8; }
                
                .cp-searching-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(184, 32, 37, 0.15);
                    border-top: 2px solid #b82025;
                    border-radius: 50%;
                    animation: cp-spin 0.6s linear infinite;
                    margin-right: 10px;
                    flex-shrink: 0;
                }
                @keyframes cp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

                .cp-search-btn {
                    background: #b82025;
                    color: #fff;
                    font-size: 0.78rem;
                    font-weight: 700;
                    padding: 6px 16px;
                    border: none;
                    border-radius: 999px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .cp-search-btn:hover:not(:disabled) { background: #9a1a1f; }
                .cp-search-btn:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

                /* Suggestions Dropdown */
                .cp-suggestions { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); z-index: 100; max-height: 260px; overflow-y: auto; text-align: left; }
                .cp-suggestion-item { padding: 10px 14px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
                .cp-suggestion-item:last-child { border-bottom: none; }
                .cp-suggestion-item:hover { background: #fff5f5; }
                .cp-sugg-name { font-weight: 600; font-size: 0.8rem; color: #0f172a; }
                .cp-sugg-meta { font-size: 0.7rem; color: #64748b; margin-top: 3px; display: flex; align-items: center; gap: 4px; }
                .cp-add-badge { font-size: 0.68rem; background: #fff0f0; color: #b82025; padding: 3px 8px; border-radius: 999px; font-weight: 700; white-space: nowrap; }
                .cp-added-badge { font-size: 0.68rem; background: #f1f5f9; color: #64748b; padding: 3px 8px; border-radius: 999px; font-weight: 600; }

                /* Main Body Container */
                .cp-container { max-width: 1200px; margin: 24px auto 0; padding: 0 24px; }

                /* Top Summary Banner */
                .cp-summary-banner { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); text-align: left; }
                .cp-summary-banner h2 { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
                .cp-summary-desc { font-size: 0.8rem; color: #475569; line-height: 1.5; overflow: hidden; max-height: 40px; transition: max-height 0.3s; }
                .cp-summary-desc.expanded { max-height: 200px; }
                .cp-summary-desc p { margin: 0; }
                .cp-readmore-btn { background: none; border: none; cursor: pointer; color: #b82025; font-size: 0.75rem; font-weight: 700; padding: 0; margin-top: 8px; display: inline-flex; align-items: center; gap: 4px; outline: none; }
                .cp-readmore-btn:hover { text-decoration: underline; }

                /* Header Cards Grid Row */
                .cp-headers-outer-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; position: relative; }
                .cp-header-card-wrapper { position: relative; }
                
                /* VS Badge positioning between cards */
                .cp-vs-badge {
                    position: absolute;
                    top: 50px;
                    right: -24px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #0f172a;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.72rem;
                    font-weight: 800;
                    border: 2px solid #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
                    z-index: 10;
                }

                .cp-header-card {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 24px 16px 16px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    position: relative;
                }

                .cp-card-remove {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: #f1f5f9;
                    border: none;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    transition: all 0.15s;
                }
                .cp-card-remove:hover { background: #fff0f0; color: #b82025; }

                /* Large logo frame */
                .cp-logo-container-large {
                    width: 72px;
                    height: 72px;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 14px;
                    padding: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                }
                .cp-logo-container-large img { max-height: 100%; max-width: 100%; object-fit: contain; }
                .cp-logo-placeholder-large { color: #94a3b8; }

                .cp-card-title-link {
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: #0f172a;
                    text-decoration: none;
                    line-height: 1.35;
                    margin-bottom: 6px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color 0.15s;
                }
                .cp-card-title-link:hover { color: #b82025; text-decoration: underline; }

                .cp-card-location { display: flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #64748b; margin-bottom: 6px; }
                .cp-card-course { font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 16px; min-height: 18px; }

                .cp-modify-btn {
                    border: 1px solid #b82025;
                    background: transparent;
                    color: #b82025;
                    padding: 6px 18px;
                    border-radius: 8px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: auto;
                }
                .cp-modify-btn:hover { background: #fff0f0; }

                /* Empty Header Card Slot */
                .cp-header-card-empty {
                    border: 2px dashed #cbd5e1;
                    background: #f8fafc;
                    cursor: pointer;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .cp-header-card-empty:hover { background: #fff; border-color: #b82025; }
                .cp-add-icon-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    margin-bottom: 10px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                }
                .cp-add-text { font-size: 0.78rem; color: #64748b; font-weight: 600; }

                /* Accordion Section container */
                .cp-sections-container { margin-top: 12px; }

                .cp-accordion-block {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    margin-bottom: 16px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
                .cp-accordion-toggle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 14px 20px;
                    background: #fafafa;
                    border: none;
                    border-left: 4px solid #b82025;
                    font-size: 0.82rem;
                    font-weight: 800;
                    color: #0f172a;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    outline: none;
                }
                .cp-accordion-toggle:hover { background: #fff5f5; }

                /* Columns details mapping grid */
                .cp-accordion-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; padding: 16px 20px; background: #fff; }
                
                .cp-grid-column { display: flex; flex-direction: column; height: 100%; }
                .cp-grid-column-empty {
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px dashed #e2e8f0;
                    height: 100%;
                    min-height: 80px;
                }

                /* Key-Value lines inside columns */
                .cp-shiksha-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 11px 0;
                    border-bottom: 1px solid #f1f5f9;
                    font-size: 0.78rem;
                }
                .cp-shiksha-row:last-child { border-bottom: none; }
                
                .cp-shiksha-label { color: #64748b; font-weight: 500; text-align: left; }
                .cp-shiksha-value { color: #0f172a; font-weight: 700; text-align: right; max-width: 60%; }
                .cp-shiksha-value a.cp-text-link { color: #b82025; text-decoration: none; font-weight: 700; }
                .cp-shiksha-value a.cp-text-link:hover { text-decoration: underline; }

                .cp-shiksha-row-tags {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding: 11px 0;
                    border-bottom: 1px solid #f1f5f9;
                }
                .cp-shiksha-row-tags:last-child { border-bottom: none; }
                .cp-shiksha-row-tags .cp-shiksha-label { margin-bottom: 2px; }
                .cp-tags-container { display: flex; flex-wrap: wrap; gap: 4px; }

                /* HTML blocks vertically stacked */
                .cp-shiksha-html-row {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding: 11px 0;
                    border-bottom: 1px solid #f1f5f9;
                }
                .cp-shiksha-html-row:last-child { border-bottom: none; }
                .cp-shiksha-html-row .cp-shiksha-label { margin-bottom: 2px; }
                .cp-shiksha-html-val { font-size: 0.78rem; color: #334155; }

                /* Tags */
                .cp-tag { display: inline-flex; align-items: center; padding: 2.5px 8px; border-radius: 999px; font-size: 0.65rem; font-weight: 700; margin: 1px; }
                .cp-tag-blue { background: #eff6ff; color: #1d4ed8; }
                .cp-tag-green { background: #f0fdf4; color: #15803d; }
                .cp-tag-purple { background: #faf5ff; color: #7e22ce; }
                .cp-tag-orange { background: #fff7ed; color: #c2410c; }
                .cp-tag-red { background: #fff0f0; color: #b82025; }
                .cp-tag-gray { background: #f1f5f9; color: #475569; }
                .cp-empty { color: #cbd5e1; font-style: italic; font-size: 0.75rem; }

                /* HTML Collapsible Cell overlay styling */
                .cp-collapsible-html-container { position: relative; }
                .cp-html-content { font-size: 0.75rem; color: #475569; line-height: 1.55; text-align: left; }
                .cp-html-content-collapsed { overflow: hidden; position: relative; }
                .cp-html-content-collapsed::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 28px;
                    background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
                    pointer-events: none;
                }
                .cp-html-expand-btn { background: none; border: none; cursor: pointer; font-size: 0.7rem; color: #b82025; font-weight: 700; padding: 2px 0 0; margin-top: 4px; display: block; outline: none; }
                .cp-html-expand-btn:hover { text-decoration: underline; }

                .cp-html-content table { width: 100%; border-collapse: collapse; font-size: 0.7rem; margin-top: 6px; }
                .cp-html-content th { background: #f8fafc; padding: 4px 8px; font-weight: 700; color: #1e293b; border: 1px solid #e2e8f0; font-size: 0.65rem; text-transform: uppercase; }
                .cp-html-content td { padding: 4px 8px; border: 1px solid #e2e8f0; color: #334155; }
                .cp-html-content p { margin: 0 0 4px; }

                /* Package rates formatting */
                .cp-money { font-size: 0.9rem; font-weight: 800; color: #b82025; }
                .cp-money-sub { font-size: 0.65rem; color: #94a3b8; }

                /* Preference Poll Card */
                .cp-poll-container { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-top: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); text-align: center; }
                .cp-poll-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin-bottom: 18px; }
                .cp-poll-grid { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
                .cp-poll-card {
                    flex: 1;
                    min-width: 200px;
                    max-width: 280px;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: #fff;
                }
                .cp-poll-card:hover { border-color: #b82025; box-shadow: 0 4px 12px rgba(184,32,37,0.05); }
                .cp-poll-card.active { border-color: #b82025; background: #fff5f5; }
                .cp-poll-name { font-size: 0.8rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; text-align: center; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
                .cp-poll-course { font-size: 0.7rem; color: #64748b; margin-bottom: 12px; }
                .cp-poll-heart {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .cp-poll-card.active .cp-poll-heart { background: #b82025; color: #fff; transform: scale(1.1); }

                /* Download PDF Banner */
                .cp-pdf-banner { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 24px; margin-top: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .cp-pdf-content { display: flex; align-items: center; gap: 12px; text-align: left; }
                .cp-pdf-icon-box { width: 40px; height: 40px; border-radius: 10px; background: #fff0f0; display: flex; align-items: center; justify-content: center; color: #b82025; }
                .cp-pdf-text h3 { font-size: 0.88rem; font-weight: 800; color: #0f172a; margin: 0 0 2px; }
                .cp-pdf-text p { font-size: 0.75rem; color: #64748b; margin: 0; }
                .cp-pdf-btn { background: #f97316; color: #fff; font-size: 0.8rem; font-weight: 700; padding: 8px 20px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s; }
                .cp-pdf-btn:hover { background: #ea580c; }

                /* Rate Us Section */
                .cp-rating-container { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center; }
                .cp-rating-title { font-size: 0.88rem; font-weight: 800; color: #334155; }
                .cp-rating-stars { display: flex; gap: 4px; }
                .cp-rating-star-btn { background: none; border: none; cursor: pointer; padding: 4px; color: #cbd5e1; transition: all 0.15s; outline: none; }
                .cp-rating-star-btn.active { color: #f59e0b; }
                .cp-rating-star-btn:hover { transform: scale(1.15); }
                .cp-rating-sub { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }

                /* Empty state when 0 colleges */
                .cp-empty-page-state { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 80px 24px; text-align: center; max-width: 600px; margin: 40px auto 0; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .cp-empty-page-icon { width: 64px; height: 64px; background: #fff0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #b82025; }
                .cp-empty-page-state h3 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
                .cp-empty-page-state p { color: #64748b; font-size: 0.85rem; max-width: 380px; margin: 0 auto; line-height: 1.5; }

                /* Print optimizations */
                @media print {
                    .cp-header-minimal, .cp-search-wrap, .cp-card-remove, .cp-modify-btn, .cp-pdf-banner, .cp-rating-container, .cp-poll-container { display: none !important; }
                    .cp-root { background: #fff; }
                    .cp-accordion-toggle { border: 1px solid #ccc; background: #eee !important; -webkit-print-color-adjust: exact; }
                }

                /* Mobile stacking */
                @media (max-width: 768px) {
                    .cp-headers-outer-row { grid-template-columns: 1fr; gap: 24px; }
                    .cp-accordion-grid { grid-template-columns: 1fr; gap: 24px; }
                    .cp-vs-badge { top: auto; bottom: -28px; right: calc(50% - 16px); }
                    .cp-grid-column-empty { display: none; }
                }
            `}</style>

            <div className="cp-root">
                {/* ── Minimal Header ── */}
                <div className="cp-header-minimal">
                    <div className="cp-header-minimal-inner">
                        <div className="cp-header-info">
                            <h1>Side-by-Side Comparison</h1>
                            <p>Compare colleges, courses, placements, and criteria side-by-side.</p>
                        </div>

                        <div className="cp-header-controls">
                            <div className="cp-toggle">
                                <button className="cp-toggle-btn active">
                                    🏛 Institutes
                                </button>
                            </div>

                            <div ref={searchRef} className="cp-search-wrap">
                                <div className="cp-search-box">
                                    <Search className="cp-search-icon" />
                                    <input
                                        className="cp-search-input"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={
                                            selectedItems.length >= COMPARE_LIMIT
                                                ? "Max 3 items — remove one to add more"
                                                : "Search for an institute to compare…"
                                        }
                                        disabled={selectedItems.length >= COMPARE_LIMIT}
                                    />
                                    {isSearching && <div className="cp-searching-spinner" />}
                                    <button
                                        type="button"
                                        className="cp-search-btn"
                                        disabled={selectedItems.length >= COMPARE_LIMIT || !searchQuery.trim()}
                                        onClick={() => {
                                            if (suggestions.length > 0) {
                                                const firstItem = suggestions[0];
                                                const already = !!selectedItems.find(i => i._id === firstItem._id);
                                                if (!already) handleSelect(firstItem);
                                            }
                                        }}
                                    >
                                        Search
                                    </button>
                                </div>

                                {showSuggestions && (
                                    <div className="cp-suggestions">
                                        {suggestions.map((s) => {
                                            const already = !!selectedItems.find(i => i._id === s._id);
                                            return (
                                                <div key={s._id} className="cp-suggestion-item" onClick={() => !already && handleSelect(s)}>
                                                    <div>
                                                        <div className="cp-sugg-name">
                                                            {s.instituteName}
                                                        </div>
                                                        <div className="cp-sugg-meta">
                                                            <MapPin size={11} />
                                                            {`${val(s.city)} · ${val(s.state)}`}
                                                        </div>
                                                    </div>
                                                    {already
                                                        ? <span className="cp-added-badge">Added ✓</span>
                                                        : <span className="cp-add-badge">+ Add</span>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Panel Grid ── */}
                <div className="cp-container">
                    {selectedItems.length === 0 ? (
                        <div className="cp-empty-page-state">
                            <div className="cp-empty-page-icon">
                                <Building size={36} />
                            </div>
                            <h3>Compare Colleges side-by-side</h3>
                            <p>Search and select up to 3 colleges to compare their established year, ownership, fee structures, courses, and placement parameters.</p>
                        </div>
                    ) : (
                        <>
                            {/* Summary Banner Description */}
                            <div className="cp-summary-banner">
                                <h2>Compare {comparedNamesStr}</h2>
                                <div className={`cp-summary-desc ${isSummaryExpanded ? "expanded" : ""}`}>
                                    <p>{summaryText}</p>
                                </div>
                                <button className="cp-readmore-btn" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                                    {isSummaryExpanded ? "Read Less" : "Read More"}
                                </button>
                            </div>

                            {/* Column Header Cards */}
                            <div className="cp-headers-outer-row">
                                {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                    const item = selectedItems[idx];
                                    if (item) {
                                        const logoSrc = imgSrc(item.instituteLogo || item.logo || item.thumbnail);
                                        const nameStr = item.instituteName;
                                        return (
                                            <div key={item._id} className="cp-header-card-wrapper">
                                                {idx < selectedItems.length - 1 && idx < selectedItems.length - 1 && (
                                                    <div className="cp-vs-badge">VS</div>
                                                )}
                                                <div className="cp-header-card">
                                                    <button className="cp-card-remove" onClick={() => removeItem(item._id)}>
                                                        <X size={12} />
                                                    </button>
                                                    
                                                    <div className="cp-logo-container-large">
                                                        {logoSrc ? (
                                                            <img src={logoSrc} alt="logo" onError={(e) => e.target.style.display = "none"} />
                                                        ) : (
                                                            <div className="cp-logo-placeholder-large">
                                                                <Building size={32} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Link to={`/institute/${item.slug || item._id}`} className="cp-card-title-link">
                                                        {nameStr}
                                                    </Link>

                                                    <div className="cp-card-location">
                                                        <MapPin size={11} />
                                                        <span>{val(item.city)} · {val(item.state)}</span>
                                                    </div>

                                                    <div className="cp-card-course">
                                                        {item.streams?.[0] || "General Stream"}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="cp-modify-btn"
                                                        onClick={() => {
                                                            const inp = document.querySelector(".cp-search-input");
                                                            if (inp) {
                                                                inp.focus();
                                                                inp.scrollIntoView({ behavior: "smooth", block: "center" });
                                                            }
                                                        }}
                                                    >
                                                        Modify Selection
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={`empty-hdr-${idx}`} className="cp-header-card-wrapper">
                                                <div
                                                    className="cp-header-card cp-header-card-empty"
                                                    onClick={() => document.querySelector(".cp-search-input")?.focus()}
                                                >
                                                    <div className="cp-add-icon-circle">
                                                        <Search size={18} />
                                                    </div>
                                                    <span className="cp-add-text">Add college</span>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>

                            {/* Accordion Blocks */}
                            <div className="cp-sections-container">
                                
                                {/* Accordion 1: Institute Information */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("basic")}>
                                        <span>Institute Information</span>
                                        {collapsedSections.basic ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.basic && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    return (
                                                        <div key={`basic-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Established Year</span>
                                                                <span className="cp-shiksha-value">{item.establishedYear || "—"}</span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Ownership</span>
                                                                <span className="cp-shiksha-value">{val(item.organisationType || item.type, "—")}</span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Affiliation</span>
                                                                <span className="cp-shiksha-value">{val(item.affiliation)}</span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Website</span>
                                                                <span className="cp-shiksha-value">
                                                                    {item.website ? (
                                                                        <a href={item.website} target="_blank" rel="noreferrer" className="cp-text-link">Visit Site</a>
                                                                    ) : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Address</span>
                                                                <span className="cp-shiksha-value">{val(item.address)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`basic-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 2: Course Details */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("academics")}>
                                        <span>Course Details</span>
                                        {collapsedSections.academics ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.academics && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    const specs = item.specialization || [];
                                                    return (
                                                        <div key={`acad-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-row-tags">
                                                                <span className="cp-shiksha-label">Streams</span>
                                                                <div className="cp-tags-container">
                                                                    {item.streams?.length ? (
                                                                        item.streams.map((s, i) => <Tag key={i} label={s} color="orange" />)
                                                                    ) : <span className="cp-empty">—</span>}
                                                                </div>
                                                            </div>
                                                            <div className="cp-shiksha-row-tags">
                                                                <span className="cp-shiksha-label">Specializations</span>
                                                                <div className="cp-tags-container">
                                                                    {specs.length ? (
                                                                        specs.slice(0, 5).map((s, i) => <Tag key={i} label={s} color="purple" />)
                                                                    ) : <span className="cp-empty">—</span>}
                                                                </div>
                                                            </div>
                                                            <div className="cp-shiksha-row-tags">
                                                                <span className="cp-shiksha-label">Exams Accepted</span>
                                                                <div className="cp-tags-container">
                                                                    {item.examAccepted ? (
                                                                        item.examAccepted.split(",").map((e, i) => <Tag key={i} label={e.trim()} color="green" />)
                                                                    ) : <span className="cp-empty">—</span>}
                                                                </div>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Total Courses</span>
                                                                <span className="cp-shiksha-value">{item.courses?.length || "—"}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`acad-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 3: Fees & Courses */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("fees")}>
                                        <span>Fees & Courses</span>
                                        {collapsedSections.fees ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.fees && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    const prices = (item.courses || []).map(c => c.coursePrice).filter(Boolean);
                                                    const min = prices.length ? Math.min(...prices) : null;
                                                    const max = prices.length ? Math.max(...prices) : null;
                                                    return (
                                                        <div key={`fees-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Min Fees</span>
                                                                <span className="cp-shiksha-value">
                                                                    {item.minFees ? (
                                                                        <div className="cp-money">₹ {Number(item.minFees).toLocaleString()} <span className="cp-money-sub">/yr</span></div>
                                                                    ) : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Max Fees</span>
                                                                <span className="cp-shiksha-value">
                                                                    {item.maxFees ? (
                                                                        <div className="cp-money">₹ {Number(item.maxFees).toLocaleString()} <span className="cp-money-sub">/yr</span></div>
                                                                    ) : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Course Fee (Min)</span>
                                                                <span className="cp-shiksha-value">
                                                                    {min ? <div className="cp-money">₹ {min.toLocaleString()}</div> : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Course Fee (Max)</span>
                                                                <span className="cp-shiksha-value">
                                                                    {max ? <div className="cp-money">₹ {max.toLocaleString()}</div> : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="cp-shiksha-html-row">
                                                                <span className="cp-shiksha-label">Fee Details</span>
                                                                <div className="cp-shiksha-html-val">
                                                                    <CollapsibleHtmlCell html={item.fee} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`fees-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 4: Placements */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("placement")}>
                                        <span>Placements</span>
                                        {collapsedSections.placement ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.placement && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    return (
                                                        <div key={`placement-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-row">
                                                                <span className="cp-shiksha-label">Highest Package</span>
                                                                <span className="cp-shiksha-value">
                                                                    {item.highestPackage ? (
                                                                        <div className="cp-money">₹ {Number(item.highestPackage).toLocaleString()} <span className="cp-money-sub">LPA</span></div>
                                                                    ) : "—"}
                                                                </span>
                                                            </div>
                                                            <div className="cp-shiksha-html-row">
                                                                <span className="cp-shiksha-label">Placement Details</span>
                                                                <div className="cp-shiksha-html-val">
                                                                    <CollapsibleHtmlCell html={item.placementInfo} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`placement-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 5: Rankings */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("ranking")}>
                                        <span>Rankings</span>
                                        {collapsedSections.ranking ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.ranking && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    return (
                                                        <div key={`ranking-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-html-row">
                                                                <span className="cp-shiksha-label">Ranking Details</span>
                                                                <div className="cp-shiksha-html-val">
                                                                    <CollapsibleHtmlCell html={item.ranking} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`ranking-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 6: Admission Info */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("admission")}>
                                        <span>Admission Info</span>
                                        {collapsedSections.admission ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.admission && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    return (
                                                        <div key={`admission-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-html-row">
                                                                <span className="cp-shiksha-label">Admission Criteria</span>
                                                                <div className="cp-shiksha-html-val">
                                                                    <CollapsibleHtmlCell html={item.admissionInfo} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`admission-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 7: Infrastructure & Facilities */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("facilities")}>
                                        <span>Infrastructure & Facilities</span>
                                        {collapsedSections.facilities ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.facilities && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    const facs = item.facilities || item.facility || item.institute?.facility || [];
                                                    return (
                                                        <div key={`facilities-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-row-tags">
                                                                <span className="cp-shiksha-label">Available Facilities</span>
                                                                <div className="cp-tags-container">
                                                                    {facs.length ? (
                                                                        facs.map((f, i) => <Tag key={i} label={typeof f === "object" ? f.name : f} color="gray" />)
                                                                    ) : <span className="cp-empty">Not listed</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`facilities-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Accordion 8: About Overview */}
                                <div className="cp-accordion-block">
                                    <button className="cp-accordion-toggle" onClick={() => toggleMainSection("about")}>
                                        <span>About Overview</span>
                                        {collapsedSections.about ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                    </button>
                                    {!collapsedSections.about && (
                                        <div className="cp-accordion-grid">
                                            {Array.from({ length: COMPARE_LIMIT }).map((_, idx) => {
                                                const item = selectedItems[idx];
                                                if (item) {
                                                    return (
                                                        <div key={`about-${item._id}`} className="cp-grid-column">
                                                            <div className="cp-shiksha-html-row">
                                                                <span className="cp-shiksha-label">Overview</span>
                                                                <div className="cp-shiksha-html-val">
                                                                    <CollapsibleHtmlCell html={item.about} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={`about-empty-${idx}`} className="cp-grid-column-empty" />;
                                                }
                                            })}
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Preference Choice Poll */}
                            <div className="cp-poll-container">
                                <h3 className="cp-poll-title">If you had to choose any one of these courses which one would you prefer?</h3>
                                <div className="cp-poll-grid">
                                    {selectedItems.map((item) => (
                                        <div
                                            key={`poll-${item._id}`}
                                            className={`cp-poll-card ${preferredCollegeId === item._id ? "active" : ""}`}
                                            onClick={() => handleVote(item._id)}
                                        >
                                            <span className="cp-poll-name">{item.instituteName}</span>
                                            <span className="cp-poll-course">{item.streams?.[0] || "General Course"}</span>
                                            <div className="cp-poll-heart">
                                                <Star size={16} fill={preferredCollegeId === item._id ? "#fff" : "none"} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Download PDF Offline Banner */}
                            <div className="cp-pdf-banner">
                                <div className="cp-pdf-content">
                                    <div className="cp-pdf-icon-box">
                                        <FileDown size={20} />
                                    </div>
                                    <div className="cp-pdf-text">
                                        <h3>Download this Comparison as PDF</h3>
                                        <p>Save and read offline or share with friends and family.</p>
                                    </div>
                                </div>
                                <button type="button" className="cp-pdf-btn" onClick={() => window.print()}>
                                    Download PDF
                                </button>
                            </div>

                            {/* Rating widget */}
                            <div className="cp-rating-container">
                                <h4 className="cp-rating-title">How would you rate this page?</h4>
                                <div className="cp-rating-stars">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={`star-${s}`}
                                            type="button"
                                            className={`cp-rating-star-btn ${(hoverRating || userRating) >= s ? "active" : ""}`}
                                            onMouseEnter={() => setHoverRating(s)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => handleRating(s)}
                                        >
                                            <Star size={24} fill={(hoverRating || userRating) >= s ? "#f59e0b" : "none"} />
                                        </button>
                                    ))}
                                </div>
                                <span className="cp-rating-sub">We value your feedback to improve Eduroutez.</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ComparePage;
