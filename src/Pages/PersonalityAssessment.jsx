import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';

const DIMENSION_COLORS = {
    Analytical: '#b82025',
    Creative: '#f59e0b',
    Social: '#10b981',
    Leadership: '#6366f1',
    Practical: '#f97316',
    Conventional: '#8b5cf6',
};

const STEPS = ['welcome', 'questions', 'results'];

export default function PersonalityAssessment() {
    const navigate = useNavigate();
    const [step, setStep] = useState('welcome');
    const [assessment, setAssessment] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${BASE_URL}/assessments`)
            .then((r) => r.json())
            .then((d) => {
                if (d.data?.length) setAssessment(d.data[0]);
                else setError('No assessment available');
            })
            .catch(() => setError('Could not load assessment'));
    }, []);

    const selectOption = useCallback((optionIndex) => {
        const q = assessment.questions[currentQ];
        setAnswers((prev) => [...prev, { questionId: q._id, selectedOptionIndex: optionIndex, dimension: q.options[optionIndex].dimension }]);
        if (currentQ + 1 < assessment.questions.length) {
            setCurrentQ((i) => i + 1);
        } else {
            submitAnswers();
        }
    }, [assessment, currentQ]);

    const submitAnswers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/assessment/${assessment._id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assessmentId: assessment._id, answers }),
            });
            if (!res.ok) throw new Error('Submission failed');
            const data = await res.json();
            setResult(data.data);
            setStep('results');
        } catch (_) {
            setError('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const profileData = result?.profile
        ? Object.entries(result.profile).map(([dimension, score]) => ({
            dimension,
            score,
            fill: DIMENSION_COLORS[dimension] || '#888',
        }))
        : [];

    const formatProfileKey = (key) => {
        const map = { Analytical: 'Analytical', Creative: 'Creative', Social: 'Social', Leadership: 'Leadership', Practical: 'Practical', Conventional: 'Conventional' };
        return map[key] || key;
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b82025" strokeWidth="2"><path d="M12 9v4M12 17h.01" /><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-gradient-to-r from-[#b82025] to-[#e23744] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#b82025] to-[#8e1419] text-white">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button onClick={() => step === 'results' ? navigate(-1) : step === 'questions' ? setStep('welcome') : navigate(-1)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="flex-1">
                        <h1 className="font-bold text-lg">Personality-to-College Fit</h1>
                        <p className="text-white/70 text-xs">Find your ideal college match</p>
                    </div>
                    {step === 'questions' && (
                        <span className="text-white/80 text-sm font-medium">{currentQ + 1}/{assessment?.questions?.length || '?'}</span>
                    )}
                </div>
                {step === 'questions' && assessment && (
                    <div className="max-w-4xl mx-auto px-4 pb-3">
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                            <div className="bg-white rounded-full h-1.5 transition-all duration-300" style={{ width: `${((currentQ) / assessment.questions.length) * 100}%` }} />
                        </div>
                    </div>
                )}
            </header>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {step === 'welcome' && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#b82025] to-[#e23744] flex items-center justify-center shadow-lg mb-6">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Discover Your Perfect College Match</h2>
                        <p className="text-gray-500 mb-2">Answer {assessment?.questions?.length || 12} quick questions about your personality and preferences.</p>
                        <p className="text-gray-400 text-sm mb-8">We'll match you with colleges that fit your unique personality profile.</p>
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {['🎯 Quick Quiz', '🧠 Smart Match', '🎓 Best Fit'].map((item) => (
                                <div key={item} className="bg-gray-50 rounded-xl p-3 text-xs font-medium text-gray-600">{item}</div>
                            ))}
                        </div>
                        {assessment ? (
                            <button onClick={() => setStep('questions')} className="px-8 py-3 bg-gradient-to-r from-[#b82025] to-[#e23744] text-white rounded-full font-semibold text-sm hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                                Start Assessment →
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-400">
                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                Loading assessment...
                            </div>
                        )}
                    </div>
                )}

                {step === 'questions' && assessment && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                        <p className="text-xs font-semibold text-[#b82025] uppercase tracking-wider mb-1">Question {currentQ + 1} of {assessment.questions.length}</p>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">{assessment.questions[currentQ].questionText}</h3>
                        <div className="space-y-3">
                            {assessment.questions[currentQ].options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => selectOption(i)}
                                    disabled={loading}
                                    className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-[#b82025] hover:bg-red-50 transition-all text-sm text-gray-700 font-medium disabled:opacity-50"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'results' && result && (
                    <div className="space-y-6">
                        {/* Personality Profile */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Personality Profile</h2>
                                <p className="text-gray-400 text-sm mt-1">Based on your responses</p>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                <div className="w-72 h-72 flex-shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={profileData} cx="50%" cy="50%" outerRadius="70%">
                                            <PolarGrid stroke="#e5e7eb" />
                                            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#6b7280' }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar dataKey="score" stroke="#b82025" fill="#b82025" fillOpacity={0.2} strokeWidth={2} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 w-full">
                                    <div className="space-y-3">
                                        {profileData.sort((a, b) => b.score - a.score).map((d) => (
                                            <div key={d.dimension}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-gray-700">{d.dimension}</span>
                                                    <span className="text-gray-500">{d.score}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div className="rounded-full h-2 transition-all duration-500" style={{ width: `${d.score}%`, backgroundColor: DIMENSION_COLORS[d.dimension] }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {result.dominantDimensions?.length > 0 && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Dominant Traits</p>
                                            <p className="text-sm font-medium text-gray-800">{result.dominantDimensions.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* College Matches */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Your Top College Matches</h2>
                            <p className="text-gray-400 text-sm mb-6">Ranked by personality fit</p>
                            {result.topInstitutes?.length > 0 ? (
                                <div className="space-y-4">
                                    {result.topInstitutes.map((inst, i) => (
                                        <div key={inst._id || i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#b82025]/30 hover:bg-red-50/50 transition-all">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b82025] to-[#e23744] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 text-sm truncate">{inst.instituteName}</p>
                                                <p className="text-xs text-gray-400">{[inst.city?.name, inst.state?.name].filter(Boolean).join(', ') || 'Location N/A'}</p>
                                                {inst.matchedDimensions?.length > 0 && (
                                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                                        {inst.matchedDimensions.map((d) => (
                                                            <span key={d} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${DIMENSION_COLORS[d]}20`, color: DIMENSION_COLORS[d] }}>{d}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-lg font-bold" style={{ color: inst.fitScore >= 80 ? '#10b981' : inst.fitScore >= 60 ? '#f59e0b' : '#6b7280' }}>{inst.fitScore}%</div>
                                                <p className="text-[10px] text-gray-400">Match</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-8">No college matches found. Try the assessment again!</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => { setStep('welcome'); setCurrentQ(0); setAnswers([]); setResult(null); }} className="px-6 py-2.5 border border-[#b82025] text-[#b82025] rounded-full text-sm font-medium hover:bg-red-50 transition-all">
                                Retake Assessment
                            </button>
                            <button onClick={() => navigate('/chat')} className="px-6 py-2.5 bg-gradient-to-r from-[#b82025] to-[#e23744] text-white rounded-full text-sm font-medium hover:shadow-lg transition-all">
                                Talk to Counselor
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
