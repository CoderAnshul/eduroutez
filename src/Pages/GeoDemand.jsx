import React, { useState, useEffect, useCallback } from "react";
import { MapPin, TrendingUp, Loader2, AlertCircle, Building2, GraduationCap, ArrowUpRight, ArrowDownRight, Search, ChevronDown, ExternalLink } from "lucide-react";
import { getGeoDemand } from "../ApiFunctions/api";
import { Link } from "react-router-dom";
import cardPhoto from "../assets/Images/teacher.jpg";

const Images = import.meta.env.VITE_IMAGE_BASE_URL;

const Section = ({ title, icon: Icon, children }) => (
  <section className="mb-10">
    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-red-500" />} {title}
    </h2>
    {children}
  </section>
);

const TrendBadge = ({ dir, pct }) => {
  if (!dir || dir === "flat") return null;
  const up = dir === "up";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${up ? "text-green-600" : "text-red-600"}`}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {up ? "+" : ""}{pct}%
    </span>
  );
};

const InstituteBadge = ({ name, slug, thumbnail }) => {
  const imgSrc = thumbnail ? `${Images}/${thumbnail}` : cardPhoto;
  return (
    <Link
      to={`/institute/${slug || "#"}`}
      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-red-300 hover:shadow-sm transition-all group"
    >
      <div className="w-6 h-6 rounded overflow-hidden shrink-0 bg-gray-100">
        <img src={imgSrc} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-red-600 truncate max-w-[140px]">{name}</span>
      <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-red-400 shrink-0" />
    </Link>
  );
};

const CategoryTrend = ({ categories }) => {
  if (!categories?.length) return null;
  const rising = categories.filter((c) => c.trend?.dir === "up").slice(0, 4);
  const falling = categories.filter((c) => c.trend?.dir === "down").slice(0, 2);
  if (!rising.length && !falling.length) return null;
  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      {rising.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">▲ Rising</span>
          {rising.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded">
              {c.name} <span className="text-green-400">+{c.trend.pct}%</span>
              {c.source === "google" && <span className="text-[8px] bg-blue-100 text-blue-600 px-1 rounded font-bold">G</span>}
            </span>
          ))}
        </div>
      )}
      {falling.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wide">▼ Cooling</span>
          {falling.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
              {c.name} <span className="text-red-400">{c.trend.pct}%</span>
              {c.source === "google" && <span className="text-[8px] bg-blue-100 text-blue-600 px-1 rounded font-bold">G</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const StateCard = ({ data, max }) => {
  const ratio = max > 0 ? data.count / max : 0;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 truncate">{data.state}</p>
            <p className="text-xs text-gray-400">
              {data.instituteCount} institutes · {data.count} signals
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-2">
          <TrendBadge dir={data.dir} pct={data.pct} />
        </div>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${ratio >= 0.7 ? "bg-red-500" : ratio >= 0.4 ? "bg-orange-500" : "bg-sky-500"}`}
          style={{ width: `${Math.max(3, ratio * 100)}%` }}
        />
      </div>

      <CategoryTrend categories={data.categories} />

      {data.topInstitutes?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
          {data.topInstitutes.slice(0, 3).map((inst, i) => (
            <InstituteBadge key={i} name={inst.name} slug={inst.slug} thumbnail={inst.thumbnail} />
          ))}
        </div>
      )}
    </div>
  );
};

const CityCard = ({ data, max }) => {
  const ratio = max > 0 ? data.count / max : 0;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {data.city}
            <span className="text-xs text-gray-400 font-normal">· {data.state}</span>
          </p>
        </div>
        <span className="flex items-center gap-2 shrink-0 ml-2">
          <TrendBadge dir={data.dir} pct={data.pct} />
          <span className="text-sm font-bold text-gray-700">{data.count}</span>
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full ${ratio >= 0.7 ? "bg-red-500" : ratio >= 0.4 ? "bg-orange-500" : "bg-sky-500"}`}
          style={{ width: `${Math.max(3, ratio * 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-1.5">{data.instituteCount} institutes in this region</p>
      {data.topInstitutes?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.topInstitutes.slice(0, 2).map((inst, i) => (
            <InstituteBadge key={i} name={inst.name} slug={inst.slug} thumbnail={inst.thumbnail} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryBar = ({ data, max }) => {
  const ratio = max > 0 ? data.count / max : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 w-28 shrink-0 truncate">{data.name}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.max(2, ratio * 100)}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-600 w-10 text-right">{data.count}</span>
    </div>
  );
};

export default function GeoDemand() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(365);
  const [search, setSearch] = useState("");
  const [showAllStates, setShowAllStates] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getGeoDemand(days);
      if (!res) throw new Error("No demand data returned");
      setData(res);
    } catch (err) {
      setError("Could not load demand intelligence. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const maxState = data?.states?.[0]?.count || 1;
  const maxCity = data?.cities?.[0]?.count || 1;
  const maxCat = data?.nationalCategories?.[0]?.count || 1;

  const filteredStates = data?.states?.filter((s) =>
    !search || s.state?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const visibleStates = showAllStates ? filteredStates : filteredStates.slice(0, 8);
  const visibleCities = showAllCities ? data?.cities : data?.cities?.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-medium text-white/80 mb-4">
            <MapPin className="w-3.5 h-3.5" /> Geo-Demand Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Education Demand Heatmap</h1>
          <p className="text-base text-white/80 max-w-2xl mx-auto">
            State and city-level demand signals powered by student registrations, institute presence, inquiries, counseling bookings, and engagement activity across the platform.
          </p>

          {/* Stats row */}
          {data && (
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{data.totalSignals?.toLocaleString()}</p>
                <p className="text-xs text-white/70">Total Signals</p>
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{data.states?.length || 0}</p>
                <p className="text-xs text-white/70">States</p>
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{data.cities?.length || 0}</p>
                <p className="text-xs text-white/70">Cities</p>
              </div>
              <div className="bg-white/10 rounded-xl px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{data.instituteCount || 0}</p>
                <p className="text-xs text-white/70">Institutes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search states..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300 w-56"
            />
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
            <option value={365}>Last 365 days</option>
            <option value={730}>Last 2 years</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading demand intelligence…
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {!loading && data && (
          <>
            {/* AI Summary */}
            {data.aiSummary?.text && (
              <div className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4 flex items-start gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mt-0.5 shrink-0 px-2 py-0.5 bg-indigo-100 rounded-md">
                  {data.aiSummary.source === "ai" ? "AI" : "Summary"}
                </span>
                <p className="text-sm text-indigo-900 leading-relaxed">{data.aiSummary.text}</p>
              </div>
            )}

            {/* States */}
            {visibleStates.length > 0 && (
              <Section title="State-Level Demand & Institute Presence" icon={MapPin}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visibleStates.map((s, i) => (
                    <StateCard key={i} data={s} max={maxState} />
                  ))}
                </div>
                {filteredStates.length > 8 && (
                  <button
                    onClick={() => setShowAllStates(!showAllStates)}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 mx-auto"
                  >
                    {showAllStates ? "Show less" : `Show all ${filteredStates.length} states`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllStates ? "rotate-180" : ""}`} />
                  </button>
                )}
              </Section>
            )}

            {/* Cities */}
            {visibleCities?.length > 0 && (
              <Section title="City / District-Level Demand" icon={Building2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {visibleCities.map((c, i) => (
                    <CityCard key={i} data={c} max={maxCity} />
                  ))}
                </div>
                {data.cities?.length > 8 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 mx-auto"
                  >
                    {showAllCities ? "Show less" : `Show all ${data.cities.length} cities`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllCities ? "rotate-180" : ""}`} />
                  </button>
                )}
              </Section>
            )}

            {/* Demand by Category */}
            {data.nationalCategories?.length > 0 && (
              <Section title="Demand by Category / Stream" icon={GraduationCap}>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                  {data.nationalCategories.map((c, i) => (
                    <CategoryBar key={i} data={c} max={maxCat} />
                  ))}
                </div>
              </Section>
            )}

            {/* Top Interests */}
            {data.nationalTop?.length > 0 && (
              <Section title="Top Interests Nationwide" icon={TrendingUp}>
                <div className="flex flex-wrap gap-2">
                  {data.nationalTop.map((n, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-sm hover:border-red-200 hover:shadow-sm transition-all"
                    >
                      {n.name}
                      <span className="text-xs text-gray-400 font-bold">· {n.count}</span>
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Google Trends Attribution */}
            {data.googleTrends && (
              <Section title="Google Trends Intelligence" icon={TrendingUp}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">G</span>
                    <span className="text-xs text-blue-700">Stream trends powered by Google search interest data via Gemini AI</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Google Trends data reflects real-world search interest and market demand for educational streams across states.
                    Trends marked with <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-1 rounded">G</span> come from Google data rather than platform activity.
                  </p>
                </div>
              </Section>
            )}

            {/* Empty state */}
            {!data.states?.length && !data.cities?.length && (
              <div className="text-center py-20">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-500 mb-2">No geo-data yet</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  Signals will appear here as students register, submit inquiries, book counseling sessions, and interact with institutes and courses across the platform.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
