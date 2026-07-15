import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';

function TrendCard({ title, children, className = '' }) {
    return (
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/80 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-[#b82025] to-[#e23744] rounded-full inline-block" />
                {title}
            </h2>
            {children}
        </div>
    );
}

function Badge({ label, color }) {
    const colors = {
        green: 'bg-green-100 text-green-700 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        gray: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return (
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${colors[color] || colors.gray}`}>
            {label}
        </span>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (active && payload?.length) {
        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-3 text-xs">
                <p className="font-semibold text-gray-800 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}: <span className="font-medium">{p.value}{p.name === 'Score' ? '%' : ''}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
}

function FadeIn({ children, delay = 0 }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(t);
    }, [delay]);
    return (
        <div className={`transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {children}
        </div>
    );
}

export default function MarketTrends() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [askQuestion, setAskQuestion] = useState('');
    const [askAnswer, setAskAnswer] = useState('');
    const [askLoading, setAskLoading] = useState(false);
    const [askOpen, setAskOpen] = useState(false);

    useEffect(() => {
        fetch(`${BASE_URL}/market-trends`)
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setData(d.data.aiInsights);
                else setError(d.message || 'Failed to load trends');
            })
            .catch(() => setError('Could not connect to server'))
            .finally(() => setLoading(false));
    }, []);

    const askQuestionFn = async (q) => {
        const query = (q || askQuestion).trim();
        if (!query || askLoading) return;
        setAskLoading(true);
        setAskAnswer('');
        if (!q) setAskQuestion('');
        try {
            const res = await fetch(`${BASE_URL}/market-trends/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: query }),
            });
            const d = await res.json();
            setAskAnswer(d.data?.answer || 'No response.');
        } catch (_) {
            setAskAnswer('Could not reach the server.');
        } finally {
            setAskLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative mx-auto w-12 h-12">
                        <svg className="animate-spin" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b82025" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-700 font-medium">Analyzing market trends</p>
                        <p className="text-gray-400 text-sm">AI is crunching the latest data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center mb-5 rotate-12">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b82025" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4M12 17h.01" /><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Could Not Load Trends</h2>
                    <p className="text-gray-500 mb-6 text-sm">{error || 'AI insights unavailable. Check your Gemini API key.'}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-gradient-to-r from-[#b82025] to-[#e23744] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-red-200/50 transition-all active:scale-95">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const demandData = (data.highDemandCourses || []).map((c) => ({ name: c.course, demand: c.demand === 'High' ? 100 : c.demand === 'Medium' ? 60 : 30, ...c }));
    const salaryData = (data.salaryTrends || []).map((s) => ({ name: s.role, entry: parseInt(s.entryLevel?.replace(/[^0-9]/g, '') || '0'), mid: parseInt(s.midLevel?.replace(/[^0-9]/g, '') || '0'), senior: parseInt(s.seniorLevel?.replace(/[^0-9]/g, '') || '0') }));

    const tabs = [
        { key: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { key: 'courses', label: 'Courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { key: 'salary', label: 'Salary', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { key: 'careers', label: 'Careers', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#b82025] to-[#8e1419] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                <div className="relative max-w-6xl mx-auto px-4 py-5 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/15 transition-all active:scale-90">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Market Trend Analyzer</h1>
                        <p className="text-white/60 text-xs">AI-powered insights on the Indian education market</p>
                    </div>
                </div>
                <div className="relative max-w-6xl mx-auto px-4 pb-4 flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                                activeTab === tab.key
                                    ? 'bg-white text-[#b82025] shadow-lg shadow-black/10'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={tab.icon} />
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Market Summary */}
                {data.marketSummary && (
                    <FadeIn>
                        <div className="relative bg-gradient-to-br from-[#b82025]/5 via-[#e23744]/5 to-orange-50/50 rounded-2xl border border-[#b82025]/10 p-6 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#b82025]/5 to-transparent rounded-full -mr-10 -mt-10" />
                            <div className="flex items-start gap-4 relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b82025] to-[#e23744] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-red-200/30">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 2a9 9 0 018.66 6.57M12 2a9 9 0 00-8.66 6.57M12 22a9 9 0 008.66-6.57M12 22a9 9 0 01-8.66-6.57M3.34 8.57a9 9 0 000 6.86M20.66 8.57a9 9 0 010 6.86" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#b82025] uppercase tracking-wider mb-1">Market Overview</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{data.marketSummary}</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {demandData.length > 0 && (
                            <FadeIn delay={50}>
                                <TrendCard title="High Demand Courses (2025-2026)">
                                    <div className="overflow-x-auto -mx-6 px-6">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-left">
                                                    <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Course</th>
                                                    <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Demand</th>
                                                    <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Avg Salary</th>
                                                    <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Growth</th>
                                                    <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Why?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.highDemandCourses.map((c, i) => (
                                                    <tr key={i} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors group">
                                                        <td className="py-3.5 font-medium text-gray-800 pr-4">{c.course}</td>
                                                        <td className="py-3.5 pr-4"><Badge label={c.demand} color={c.demand === 'High' ? 'green' : 'yellow'} /></td>
                                                        <td className="py-3.5 text-gray-600 pr-4 font-medium">{c.avgSalaryRange || 'N/A'}</td>
                                                        <td className="py-3.5 pr-4"><Badge label={c.growthOutlook || 'Stable'} color={c.growthOutlook === 'Positive' ? 'green' : 'blue'} /></td>
                                                        <td className="py-3.5 text-gray-500 text-xs max-w-xs truncate">{c.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </TrendCard>
                            </FadeIn>
                        )}

                        {data.recommendations?.length > 0 && (
                            <FadeIn delay={100}>
                                <TrendCard title="Recommendations for Students">
                                    <ul className="space-y-3">
                                        {data.recommendations.map((r, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-700 group">
                                                <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#b82025] to-[#e23744] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold shadow-md shadow-red-200/30 group-hover:scale-110 transition-transform">
                                                    {i + 1}
                                                </span>
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </TrendCard>
                            </FadeIn>
                        )}

                        {data.emergingFields?.length > 0 && (
                            <FadeIn delay={150}>
                                <TrendCard title="Emerging Fields">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {data.emergingFields.map((f, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-[#b82025]/20 hover:bg-red-50/30 transition-all duration-200 group">
                                                <h3 className="font-bold text-gray-800 text-sm mb-2 group-hover:text-[#b82025] transition-colors">{f.field}</h3>
                                                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{f.whyEmerging}</p>
                                                {f.keySkills?.length > 0 && (
                                                    <div className="flex gap-1.5 flex-wrap mb-2">
                                                        {f.keySkills.map((s, j) => (
                                                            <span key={j} className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">{s}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                {f.careerPaths?.length > 0 && (
                                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                        {f.careerPaths.join(' → ')}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </TrendCard>
                            </FadeIn>
                        )}

                        {data.topInstitutesByStream?.length > 0 && (
                            <FadeIn delay={200}>
                                <TrendCard title="Top Institutes by Stream">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {data.topInstitutesByStream.map((s, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-[#b82025]/10 transition-all">
                                                <span className="text-xs font-semibold text-[#b82025] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full">{s.stream}</span>
                                                <ul className="mt-3 space-y-1.5">
                                                    {s.topInstitutes?.map((inst, j) => (
                                                        <li key={j} className="text-sm text-gray-700 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#b82025] to-[#e23744] flex-shrink-0" />
                                                            {inst}
                                                        </li>
                                                    ))}
                                                </ul>
                                                {s.selectionCriteria && (
                                                    <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{s.selectionCriteria}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </TrendCard>
                            </FadeIn>
                        )}
                    </>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && data.highDemandCourses?.length > 0 && (
                    <>
                        <FadeIn>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.highDemandCourses.map((c, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/80 p-5 hover:shadow-xl hover:border-[#b82025]/20 transition-all duration-300 group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b82025] to-[#e23744] text-white text-xs flex items-center justify-center font-bold shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    {i + 1}
                                                </div>
                                                <h3 className="font-bold text-gray-800 text-sm">{c.course}</h3>
                                            </div>
                                            <Badge label={c.demand} color={c.demand === 'High' ? 'green' : 'yellow'} />
                                        </div>
                                        <div className="space-y-2.5 text-xs">
                                            <div className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-400">Avg Salary</span>
                                                <span className="font-semibold text-gray-700">{c.avgSalaryRange || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 px-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-400">Growth</span>
                                                <Badge label={c.growthOutlook || 'Stable'} color={c.growthOutlook === 'Positive' ? 'green' : 'blue'} />
                                            </div>
                                            <p className="text-gray-500 mt-3 leading-relaxed text-xs">{c.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={100}>
                            <TrendCard title="Course Demand Comparison">
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={demandData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fee2e2' }} />
                                            <Bar dataKey="demand" radius={[0, 6, 6, 0]} fill="#b82025" maxBarSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </TrendCard>
                        </FadeIn>

                        <FadeIn delay={150}>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/80 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-1">Quick Course Compare</h2>
                                <p className="text-xs text-gray-400 mb-4">Type two course names to compare them side by side</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="compareCourse1"
                                        placeholder="e.g. B.Tech"
                                        className="flex-1 bg-gray-100/80 text-sm text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition-all placeholder-gray-400"
                                    />
                                    <span className="text-gray-400 font-bold text-sm px-1">VS</span>
                                    <input
                                        id="compareCourse2"
                                        placeholder="e.g. BCA"
                                        className="flex-1 bg-gray-100/80 text-sm text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition-all placeholder-gray-400"
                                    />
                                    <button
                                        onClick={() => {
                                            const c1 = document.getElementById('compareCourse1').value.trim();
                                            const c2 = document.getElementById('compareCourse2').value.trim();
                                            if (c1 && c2) {
                                                document.getElementById('compareCourse1').value = '';
                                                document.getElementById('compareCourse2').value = '';
                                                setAskOpen(true);
                                                askQuestionFn(`Compare "${c1}" vs "${c2}" in terms of salary, demand, career growth, and difficulty. Give a detailed comparison with table format and a clear verdict.`);
                                            }
                                        }}
                                        className="px-5 py-2.5 bg-gradient-to-r from-[#b82025] to-[#e23744] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-red-200/40 transition-all active:scale-95 flex-shrink-0"
                                    >
                                        Compare
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    </>
                )}

                {/* Salary Tab */}
                {activeTab === 'salary' && salaryData.length > 0 && (
                    <FadeIn>
                        <TrendCard title="Salary Trends by Role (LPA)">
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salaryData} margin={{ left: 20, right: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} angle={-20} textAnchor="end" height={80} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fee2e2' }} />
                                        <Bar dataKey="entry" name="Entry Level" radius={[4, 4, 0, 0]} fill="#f59e0b" maxBarSize={40} />
                                        <Bar dataKey="mid" name="Mid Level" radius={[4, 4, 0, 0]} fill="#b82025" maxBarSize={40} />
                                        <Bar dataKey="senior" name="Senior Level" radius={[4, 4, 0, 0]} fill="#10b981" maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-6 overflow-x-auto -mx-6 px-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left">
                                            <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Role</th>
                                            <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Entry</th>
                                            <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Mid</th>
                                            <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider pr-4">Senior</th>
                                            <th className="pb-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">Growth</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.salaryTrends.map((s, i) => (
                                            <tr key={i} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                                                <td className="py-3 font-medium text-gray-800 pr-4">{s.role}</td>
                                                <td className="py-3 text-gray-600 pr-4 font-medium">{s.entryLevel || 'N/A'}</td>
                                                <td className="py-3 text-gray-600 pr-4 font-medium">{s.midLevel || 'N/A'}</td>
                                                <td className="py-3 text-gray-600 pr-4 font-medium">{s.seniorLevel || 'N/A'}</td>
                                                <td className="py-3"><Badge label={s.growthRate || 'N/A'} color="blue" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TrendCard>
                    </FadeIn>
                )}

                {/* Careers Tab */}
                {activeTab === 'careers' && data.emergingFields?.length > 0 && (
                    <FadeIn>
                        <TrendCard title="Career Paths & Emerging Fields">
                            <div className="space-y-4">
                                {data.emergingFields.map((f, i) => (
                                    <div key={i} className="p-5 rounded-xl border border-gray-100 hover:border-[#b82025]/15 hover:bg-red-50/20 transition-all duration-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#b82025] to-[#e23744] text-white text-xs flex items-center justify-center font-bold shadow-md">{i + 1}</div>
                                            <h3 className="font-bold text-gray-800 text-sm">{f.field}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{f.whyEmerging}</p>
                                        {f.keySkills?.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Skills</p>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {f.keySkills.map((s, j) => (
                                                        <span key={j} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {f.careerPaths?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Career Paths</p>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    {f.careerPaths.map((path, j) => (
                                                        <React.Fragment key={j}>
                                                            {j > 0 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b82025" strokeWidth="2" className="flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
                                                            <span className="px-2 py-0.5 rounded-md bg-[#b82025]/5 text-[#b82025] font-medium">{path}</span>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </TrendCard>
                    </FadeIn>
                )}

                {/* Ask AI Section */}
                <FadeIn delay={250}>
                    <div className="sticky bottom-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100/80 p-4">
                        {!askOpen ? (
                            <button onClick={() => setAskOpen(true)} className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 border-dashed border-[#b82025]/25 text-[#b82025] hover:bg-red-50 hover:border-[#b82025]/50 transition-all text-sm font-medium group">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:rotate-12 transition-transform"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                                Ask AI about any course, career or market trend
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 flex items-center gap-2 bg-gray-100/80 rounded-xl px-3 focus-within:ring-2 focus-within:ring-[#b82025] focus-within:bg-white transition-all">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b82025" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                                        <input
                                            type="text"
                                            value={askQuestion}
                                            onChange={(e) => setAskQuestion(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') askQuestionFn(askQuestion); }}
                                            placeholder="e.g. What is the future of AI engineering in India?"
                                            className="flex-1 bg-transparent text-sm text-gray-800 py-2.5 outline-none placeholder-gray-400"
                                            disabled={askLoading}
                                        />
                                        {askQuestion && (
                                            <button onClick={() => setAskQuestion('')} className="text-gray-400 hover:text-gray-600 p-1 active:scale-90 transition-all">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => askQuestionFn(askQuestion)} disabled={askLoading || !askQuestion.trim()} className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#b82025] to-[#e23744] text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-md shadow-red-200/30">
                                        {askLoading ? (
                                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                                        )}
                                    </button>
                                    <button onClick={() => { setAskOpen(false); setAskAnswer(''); setAskQuestion(''); }} className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-all active:scale-90" title="Close">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                {askLoading && (
                                    <div className="flex items-center gap-2.5 text-sm text-gray-400 py-2 px-1">
                                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b82025" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                        AI is thinking...
                                    </div>
                                )}
                                {askAnswer && !askLoading && (
                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-sm leading-relaxed border border-gray-100 text-gray-700 [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-100 [&_th]:font-semibold [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#b82025]/30 [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:my-2 [&_hr]:border-gray-200 [&_hr]:my-3 [&_a]:text-[#b82025] [&_a]:underline [&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-2 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{askAnswer}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
