import React, { useState, useEffect, useRef } from "react";
import {
    Search, X, Check, ArrowRight, MapPin, Building,
    Award, GraduationCap, DollarSign, Briefcase, Globe, Phone,
    Mail, FlaskConical, Users, Star, TrendingUp, Shield, FileText,
    Trophy, ChevronDown, ChevronUp, CalendarDays, Layers
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import SafeImage from "../Ui components/SafeImage";

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

/* Safely render HTML string */
const HtmlCell = ({ html }) => {
    if (!html) return <span className="cp-empty">Not provided</span>;
    return (
        <div
            className="cp-html-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
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

/* Section header row */
const SectionRow = ({ icon: Icon, label, colSpan }) => (
    <tr className="cp-section-header-row">
        <td colSpan={colSpan} className="cp-section-header-cell">
            <Icon className="cp-section-icon" />
            {label}
        </td>
    </tr>
);

/* Standard data row */
const DataRow = ({ label, items, render, colSpan }) => {
    const empties = COMPARE_LIMIT - items.length;
    return (
        <tr className="cp-data-row">
            <td className="cp-label-cell">{label}</td>
            {items.map((item) => (
                <td key={item._id} className="cp-value-cell">
                    {render(item)}
                </td>
            ))}
            {Array.from({ length: empties }).map((_, i) => (
                <td key={`e-${i}`} className="cp-empty-slot-cell" />
            ))}
        </tr>
    );
};

/* ─── Main Component ───────────────────────────────────── */
const ComparePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});
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
        } catch {
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const removeItem = (id) => setSelectedItems(prev => prev.filter(i => i._id !== id));

    const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

    const colSpan = COMPARE_LIMIT + 1;

    return (
        <>
            <style>{`
                /* ─── COMPARE PAGE STYLES ─────────────────────────── */
                .cp-root { min-height: 100vh; background: #f4f6fb; padding-bottom: 80px; font-family: 'Inter', sans-serif; }

                /* Hero */
                .cp-hero { position: relative; background: linear-gradient(135deg, #7f0000 0%, #b82025 50%, #e84040 100%); color: #fff; padding: 96px 0 72px; overflow: hidden; }
                .cp-hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
                .cp-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; text-align: center; position: relative; z-index: 1; }
                .cp-hero h1 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; letter-spacing: -0.5px; margin-bottom: 12px; text-shadow: 0 2px 12px rgba(0,0,0,0.2); }
                .cp-hero p { font-size: 1.1rem; opacity: 0.88; max-width: 560px; margin: 0 auto 32px; }

                /* Tab Toggle */
                .cp-toggle { display: inline-flex; background: rgba(255,255,255,0.18); backdrop-filter: blur(8px); border-radius: 999px; padding: 6px; margin-bottom: 28px; border: 1px solid rgba(255,255,255,0.2); }
                .cp-toggle-btn { padding: 10px 28px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; background: transparent; color: #fff; letter-spacing: 0.3px; }
                .cp-toggle-btn.active { background: #fff; color: #b82025; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transform: scale(1.04); }
                .cp-toggle-btn:hover:not(.active) { background: rgba(255,255,255,0.12); }

                /* Search */
                .cp-search-wrap { max-width: 680px; margin: 0 auto; position: relative; }
                .cp-search-box { display: flex; align-items: center; background: #fff; border-radius: 999px; padding: 6px 8px 6px 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); transition: box-shadow 0.2s; }
                .cp-search-box:focus-within { box-shadow: 0 8px 32px rgba(0,0,0,0.22), 0 0 0 4px rgba(255,255,255,0.25); }
                .cp-search-icon { color: #9ca3af; flex-shrink: 0; width: 20px; height: 20px; }
                .cp-search-input { flex: 1; border: none; outline: none; background: transparent; padding: 10px 16px; font-size: 0.95rem; color: #111; font-weight: 500; }
                .cp-search-input::placeholder { color: #aaa; font-weight: 400; }
                .cp-searching-label { font-size: 0.78rem; color: #9ca3af; margin-right: 12px; animation: pulse 1.2s infinite; white-space: nowrap; }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

                /* Suggestions Dropdown */
                .cp-suggestions { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.13); z-index: 100; max-height: 280px; overflow-y: auto; }
                .cp-suggestion-item { padding: 14px 18px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f5f5f5; transition: background 0.15s; }
                .cp-suggestion-item:last-child { border-bottom: none; }
                .cp-suggestion-item:hover { background: #fff5f5; }
                .cp-sugg-name { font-weight: 600; font-size: 0.9rem; color: #111; }
                .cp-sugg-meta { font-size: 0.75rem; color: #888; margin-top: 3px; display: flex; align-items: center; gap: 4px; }
                .cp-add-badge { font-size: 0.72rem; background: #fff0f0; color: #b82025; padding: 4px 12px; border-radius: 999px; font-weight: 700; white-space: nowrap; }
                .cp-added-badge { font-size: 0.72rem; background: #f0f0f0; color: #888; padding: 4px 12px; border-radius: 999px; font-weight: 600; }

                /* Main Panel */
                .cp-panel-wrap { max-width: 1200px; margin: 32px auto 0; padding: 0 16px; }
                .cp-empty-state { background: #fff; border-radius: 24px; border: 1px solid #ebebeb; padding: 80px 24px; text-align: center; box-shadow: 0 2px 20px rgba(0,0,0,0.04); }
                .cp-empty-icon { width: 80px; height: 80px; background: #fff0f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                .cp-empty-state h3 { font-size: 1.5rem; font-weight: 800; color: #222; margin-bottom: 8px; }
                .cp-empty-state p { color: #888; max-width: 380px; margin: 0 auto; }

                /* Table Card */
                .cp-card { background: #fff; border-radius: 24px; box-shadow: 0 4px 32px rgba(0,0,0,0.07); border: 1px solid #ebebeb; overflow: hidden; }
                .cp-table-scroll { overflow-x: auto; }
                .cp-table { width: 100%; min-width: 760px; border-collapse: collapse; text-align: left; }

                /* Table Head */
                .cp-thead-attr { padding: 24px 20px; background: #fafafa; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; width: 220px; vertical-align: top; }
                .cp-thead-attr h3 { font-size: 1rem; font-weight: 800; color: #333; margin-bottom: 4px; }
                .cp-thead-attr p { font-size: 0.75rem; color: #aaa; font-weight: 500; }
                .cp-thead-item { padding: 20px 20px 16px; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; vertical-align: top; position: relative; min-width: 260px; background: #fff; }
                .cp-thead-empty { padding: 20px; background: #fafafa; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; min-width: 260px; text-align: center; vertical-align: middle; border-style: dashed; }
                .cp-remove-btn { position: absolute; top: 12px; right: 12px; background: #f5f5f5; border: none; cursor: pointer; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
                .cp-remove-btn:hover { background: #fff0f0; color: #b82025; }
                .cp-inst-logo { height: 56px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
                .cp-inst-logo img { max-height: 56px; max-width: 120px; object-fit: contain; }
                .cp-inst-avatar { width: 56px; height: 56px; background: linear-gradient(135deg, #b82025, #e84040); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.4rem; font-weight: 800; }
                .cp-inst-name { font-size: 1rem; font-weight: 800; color: #111; line-height: 1.3; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .cp-inst-subtitle { font-size: 0.72rem; color: #888; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
                .cp-view-link { font-size: 0.75rem; color: #b82025; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; margin-top: 4px; }
                .cp-view-link:hover { text-decoration: underline; }
                .cp-add-slot-icon { width: 40px; height: 40px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); color: #ccc; }
                .cp-add-slot-text { font-size: 0.82rem; color: #bbb; font-weight: 500; }

                /* Section header */
                .cp-section-header-row { background: linear-gradient(90deg, #fff7f7, #fff); }
                .cp-section-header-cell { padding: 12px 20px; font-size: 0.7rem; font-weight: 800; color: #b82025; text-transform: uppercase; letter-spacing: 1.2px; border-bottom: 1px solid #f5e0e0; display: flex; align-items: center; gap: 8px; border-top: 2px solid #f5e0e0; }
                .cp-section-icon { width: 14px; height: 14px; flex-shrink: 0; }

                /* Data row */
                .cp-data-row:hover { background: #fafafa; }
                .cp-data-row:hover .cp-value-cell { background: #fafafa; }
                .cp-label-cell { padding: 14px 20px; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f8f8f8; color: #555; font-size: 0.83rem; font-weight: 600; width: 220px; vertical-align: top; white-space: nowrap; }
                .cp-value-cell { padding: 14px 20px; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f8f8f8; font-size: 0.88rem; color: #222; vertical-align: top; min-width: 260px; max-width: 320px; }
                .cp-empty-slot-cell { padding: 14px 20px; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f8f8f8; background: #fafafa; min-width: 260px; }
                .cp-empty { color: #ccc; font-size: 0.82rem; font-style: italic; }

                /* Tags */
                .cp-tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; margin: 2px; }
                .cp-tag-blue { background: #eff6ff; color: #1d4ed8; }
                .cp-tag-green { background: #f0fdf4; color: #15803d; }
                .cp-tag-purple { background: #faf5ff; color: #7e22ce; }
                .cp-tag-orange { background: #fff7ed; color: #c2410c; }
                .cp-tag-red { background: #fff0f0; color: #b82025; }
                .cp-tag-gray { background: #f3f4f6; color: #4b5563; }
                .cp-tags-wrap { display: flex; flex-wrap: wrap; gap: 4px; }

                /* Boolean badge */
                .cp-bool-yes { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #f0fdf4; color: #15803d; font-size: 0.78rem; font-weight: 700; border-radius: 8px; }
                .cp-bool-no { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: #fef2f2; color: #b91c1c; font-size: 0.78rem; font-weight: 700; border-radius: 8px; }

                /* Money display */
                .cp-money { font-size: 1.05rem; font-weight: 800; color: #b82025; }
                .cp-money-sub { font-size: 0.72rem; color: #aaa; margin-top: 2px; }

                /* HTML content */
                .cp-html-content { font-size: 0.8rem; color: #444; line-height: 1.6; }
                .cp-html-content table { width: 100%; border-collapse: collapse; font-size: 0.75rem; margin-top: 8px; }
                .cp-html-content th { background: #fafafa; padding: 6px 10px; font-weight: 700; color: #333; border: 1px solid #eee; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.4px; }
                .cp-html-content td { padding: 6px 10px; border: 1px solid #f0f0f0; color: #555; }
                .cp-html-content tr:hover td { background: #fafafa; }
                .cp-html-content p { margin: 0 0 6px; }
                .cp-html-content strong { color: #111; }

                /* Expandable row */
                .cp-expand-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #b82025; font-weight: 700; padding: 0; margin-top: 8px; }
                .cp-expand-btn:hover { text-decoration: underline; }

                /* PLAN feature row */
                .cp-plan-feature { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px dashed #f5f5f5; font-size: 0.78rem; }
                .cp-plan-feature:last-child { border-bottom: none; }
                .cp-plan-key { color: #777; font-weight: 500; }
                .cp-plan-val { font-weight: 700; color: #222; }

                /* Cover image */
                .cp-cover { width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 10px; }

                /* Responsive */
                @media (max-width: 768px) {
                    .cp-hero { padding: 80px 0 56px; }
                    .cp-toggle-btn { padding: 8px 18px; font-size: 0.8rem; }
                    .cp-thead-attr, .cp-label-cell { width: 160px; min-width: 160px; }
                }
            `}</style>

            <div className="cp-root">
                {/* ── Hero ── */}
                <div className="cp-hero">
                    <div className="cp-hero-inner">
                        <h1>Side-by-Side Comparison</h1>
                        <p>Make the best decision for your future. Compare institutes &amp; courses with every detail that matters.</p>

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
                                {isSearching && <span className="cp-searching-label">Searching…</span>}
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

                {/* ── Panel ── */}
                <div className="cp-panel-wrap">
                    {selectedItems.length === 0 ? (
                        <div className="cp-empty-state">
                            <div className="cp-empty-icon">
                                <Building size={36} color="#b82025" />
                            </div>
                            <h3>Nothing to compare yet</h3>
                            <p>Search above and add up to 3 institutes to see a detailed side-by-side breakdown.</p>
                        </div>
                    ) : (
                        <div className="cp-card">
                            <div className="cp-table-scroll">
                                <table className="cp-table">
                                    {/* ── THEAD ── */}
                                    <thead>
                                        <tr>
                                            <th className="cp-thead-attr">
                                                <h3>Attributes</h3>
                                                <p>Comparing {selectedItems.length} institute{selectedItems.length > 1 ? "s" : ""}</p>
                                            </th>
                                            {selectedItems.map((item) => {
                                                const logoSrc = imgSrc(item.instituteLogo || item.logo || item.thumbnail);
                                                const coverSrc = imgSrc(item.coverImage || item.thumbnailImage);
                                                const nameStr = item.instituteName;
                                                return (
                                                    <th key={item._id} className="cp-thead-item">
                                                        <button className="cp-remove-btn" onClick={() => removeItem(item._id)}>
                                                            <X size={14} />
                                                        </button>
                                                        {coverSrc && (
                                                            <img src={coverSrc} alt="cover" className="cp-cover" onError={(e) => e.target.style.display = "none"} />
                                                        )}
                                                        <div className="cp-inst-logo">
                                                            {logoSrc ? (
                                                                <img src={logoSrc} alt="logo" onError={(e) => e.target.style.display = "none"} />
                                                            ) : (
                                                                <div className="cp-inst-avatar">{nameStr?.charAt(0) || "?"}</div>
                                                            )}
                                                        </div>
                                                        <div className="cp-inst-name">{nameStr}</div>
                                                        {item.city && (
                                                            <div className="cp-inst-subtitle">
                                                                <MapPin size={10} style={{ display: "inline", marginRight: 3 }} />
                                                                {val(item.city)} · {val(item.state)}
                                                            </div>
                                                        )}
                                                        <Link
                                                            to={`/institute/${item.slug || item._id}`}
                                                            className="cp-view-link"
                                                        >
                                                            View full profile <ArrowRight size={12} />
                                                        </Link>
                                                    </th>
                                                );
                                            })}
                                            {Array.from({ length: COMPARE_LIMIT - selectedItems.length }).map((_, i) => (
                                                <th key={`es-${i}`} className="cp-thead-empty">
                                                    <div className="cp-add-slot-icon"><Search size={18} /></div>
                                                    <div className="cp-add-slot-text">Add another institute</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    {/* ── TBODY ── */}
                                    <tbody>

                                        {/* ─── SECTION: Basic Info ─────────────────── */}
                                        <SectionRow icon={Building} label="Basic Information" colSpan={colSpan} />

                                        <DataRow label="Type / Ownership" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            <Tag label={val(item.organisationType || item.type, "N/A")} color="blue" />
                                        )} />

                                        <DataRow label="Established" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            item.establishedYear
                                                ? <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
                                                    <CalendarDays size={14} color="#f97316" /> {item.establishedYear}
                                                </span>
                                                : <span className="cp-empty">—</span>
                                        )} />

                                        <DataRow label="Affiliation" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            val(item.affiliation) !== "—"
                                                ? <Tag label={val(item.affiliation)} color="purple" />
                                                : <span className="cp-empty">—</span>
                                        )} />

                                        <DataRow label="Website" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            item.website
                                                ? <a href={item.website} target="_blank" rel="noreferrer" style={{ color: "#b82025", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Globe size={12} /> Visit Site
                                                </a>
                                                : <span className="cp-empty">—</span>
                                        )} />

                                        <DataRow label="Contact" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                {item.email && <span style={{ fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 5 }}><Mail size={11} color="#888" /> {item.email}</span>}
                                                {item.institutePhone && <span style={{ fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 5 }}><Phone size={11} color="#888" /> {item.institutePhone}</span>}
                                                {!item.email && !item.institutePhone && <span className="cp-empty">—</span>}
                                            </div>
                                        )} />

                                        {/* ─── SECTION: Location ──────────────────── */}
                                        <SectionRow icon={MapPin} label="Location" colSpan={colSpan} />

                                        <DataRow label="Address" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            <span style={{ fontSize: "0.82rem", color: "#555" }}>{val(item.address)}</span>
                                        )} />

                                        <DataRow label="City" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            <Tag label={val(item.city)} color="gray" />
                                        )} />

                                        <DataRow label="State" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            <Tag label={val(item.state)} color="gray" />
                                        )} />

                                        <DataRow label="Country" items={selectedItems} colSpan={colSpan} render={(item) => (
                                            <Tag label={val(item.country)} color="blue" />
                                        )} />

                                        {/* ─── SECTION: Academics ─────────────────── */}
                                        <>
                                            <SectionRow icon={GraduationCap} label="Academics" colSpan={colSpan} />

                                            <DataRow label="Streams" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                <div className="cp-tags-wrap">
                                                    {(item.streams || []).length > 0
                                                        ? item.streams.map((s, i) => <Tag key={i} label={s} color="orange" />)
                                                        : <span className="cp-empty">—</span>}
                                                </div>
                                            )} />

                                            <DataRow label="Specializations" items={selectedItems} colSpan={colSpan} render={(item) => {
                                                const specs = item.specialization || [];
                                                const isExpanded = !!expandedSections[`specs_${item._id}`];
                                                const visible = isExpanded ? specs : specs.slice(0, 4);
                                                return (
                                                    <div>
                                                        <div className="cp-tags-wrap">
                                                            {visible.length > 0
                                                                ? visible.map((s, i) => <Tag key={i} label={s} color="purple" />)
                                                                : <span className="cp-empty">—</span>}
                                                        </div>
                                                        {specs.length > 4 && (
                                                            <button className="cp-expand-btn" onClick={() => toggleSection(`specs_${item._id}`)}>
                                                                {isExpanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> +{specs.length - 4} more</>}
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            }} />

                                            <DataRow label="Exams Accepted" items={selectedItems} colSpan={colSpan} render={(item) => {
                                                if (!item.examAccepted) return <span className="cp-empty">—</span>;
                                                const exams = item.examAccepted.split(",").map(e => e.trim()).filter(Boolean);
                                                return (
                                                    <div className="cp-tags-wrap">
                                                        {exams.map((e, i) => <Tag key={i} label={e} color="green" />)}
                                                    </div>
                                                );
                                            }} />

                                            <DataRow label="No. of Courses" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                item.courses?.length
                                                    ? <strong style={{ color: "#b82025", fontSize: "1.1rem" }}>{item.courses.length}</strong>
                                                    : <span className="cp-empty">—</span>
                                            )} />
                                        </>

                                        {/* ─── SECTION: Fees ──────────────────────── */}
                                        <>
                                            <SectionRow icon={DollarSign} label="Fees" colSpan={colSpan} />
                                            <DataRow label="Min Fees" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                item.minFees
                                                    ? <div><div className="cp-money">₹ {Number(item.minFees).toLocaleString()}</div><div className="cp-money-sub">per annum</div></div>
                                                    : <span className="cp-empty">—</span>
                                            )} />
                                            <DataRow label="Max Fees" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                item.maxFees
                                                    ? <div><div className="cp-money">₹ {Number(item.maxFees).toLocaleString()}</div><div className="cp-money-sub">per annum</div></div>
                                                    : <span className="cp-empty">—</span>
                                            )} />
                                            <DataRow label="Fee Structure" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                <HtmlCell html={item.fee} />
                                            )} />
                                            <DataRow label="Total Courses" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                item.courses?.length
                                                    ? <strong style={{ color: "#b82025", fontSize: "1.1rem" }}>{item.courses.length}</strong>
                                                    : <span className="cp-empty">—</span>
                                            )} />
                                            <DataRow label="Course Fees (Min)" items={selectedItems} colSpan={colSpan} render={(item) => {
                                                const prices = (item.courses || []).map(c => c.coursePrice).filter(Boolean);
                                                const min = prices.length ? Math.min(...prices) : null;
                                                return min
                                                    ? <div className="cp-money">₹ {min.toLocaleString()}</div>
                                                    : <span className="cp-empty">—</span>;
                                            }} />
                                            <DataRow label="Course Fees (Max)" items={selectedItems} colSpan={colSpan} render={(item) => {
                                                const prices = (item.courses || []).map(c => c.coursePrice).filter(Boolean);
                                                const max = prices.length ? Math.max(...prices) : null;
                                                return max
                                                    ? <div className="cp-money">₹ {max.toLocaleString()}</div>
                                                    : <span className="cp-empty">—</span>
                                            }} />
                                            <DataRow label="Sample Courses" items={selectedItems} colSpan={colSpan} render={(item) => {
                                                const cs = (item.courses || []).slice(0, 5);
                                                if (!cs.length) return <span className="cp-empty">—</span>;
                                                return (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                                        {cs.map(c => (
                                                            <div key={c._id} style={{ fontSize: "0.78rem", borderBottom: "1px dashed #f0f0f0", paddingBottom: 4 }}>
                                                                <div style={{ fontWeight: 700, color: "#b82025" }}>{c.courseTitle}</div>
                                                                <div style={{ display: "flex", gap: 8, color: "#666", marginTop: 2 }}>
                                                                    <span>₹{c.coursePrice?.toLocaleString() || "—"}</span>
                                                                    <span>{c.courseDurationYears ? `${c.courseDurationYears}yr` : ""}{c.courseDurationMonths ? ` ${c.courseDurationMonths}m` : ""}</span>
                                                                    <span>{c.courseType || ""}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }} />
                                        </>


                                        {/* ─── SECTION: Placement ─────────────────── */}
                                        <>
                                            <SectionRow icon={Briefcase} label="Placements" colSpan={colSpan} />
                                            <DataRow label="Highest Package" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                item.highestPackage
                                                    ? <div className="cp-money">₹ {Number(item.highestPackage).toLocaleString()} <span style={{ fontSize: "0.72rem", color: "#aaa" }}>LPA</span></div>
                                                    : <span className="cp-empty">—</span>
                                            )} />
                                            <DataRow label="Placement Details" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                <HtmlCell html={item.placementInfo} />
                                            )} />
                                        </>

                                        {/* ─── SECTION: Rankings ──────────────────── */}
                                        <>
                                            <SectionRow icon={Trophy} label="Rankings" colSpan={colSpan} />
                                            <DataRow label="Ranking Details" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                <HtmlCell html={item.ranking} />
                                            )} />

                                        </>


                                        {/* ─── SECTION: Admission ─────────────────── */}
                                        <>
                                            <SectionRow icon={FileText} label="Admission Info" colSpan={colSpan} />
                                            <DataRow label="Admission Criteria" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                <HtmlCell html={item.admissionInfo} />
                                            )} />
                                        </>

                                        {/* ─── SECTION: Facilities ────────────────── */}
                                        <SectionRow icon={Shield} label="Facilities" colSpan={colSpan} />
                                        <DataRow label="Available Facilities" items={selectedItems} colSpan={colSpan} render={(item) => {
                                            const facs = item.facilities || item.facility || item.institute?.facility || [];
                                            return facs.length > 0
                                                ? <div className="cp-tags-wrap">{facs.map((f, i) => <Tag key={i} label={typeof f === "object" ? f.name : f} color="gray" />)}</div>
                                                : <span className="cp-empty">Not listed</span>;
                                        }} />



                                        {/* ─── SECTION: About ─────────────────────── */}
                                        <>
                                            <SectionRow icon={Layers} label="About" colSpan={colSpan} />
                                            <DataRow label="Overview" items={selectedItems} colSpan={colSpan} render={(item) => (
                                                <HtmlCell html={item.about} />
                                            )} />
                                        </>




                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ComparePage;
