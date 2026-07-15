import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import useVoice from '../utils/useVoice';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'हिंदी', native: 'हिंदी' },
];

function getOrCreateSessionId() {
    let sid = localStorage.getItem('edu_chat_session_id');
    if (!sid) {
        sid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem('edu_chat_session_id', sid);
    }
    return sid;
}

const stripMd = (text) => text
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/>\s/g, '')
    .replace(/[-*+]\s/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();

const WaveBars = () => (
    <div className="flex items-center justify-center gap-0.5 h-8">
        {[1, 2, 3, 4, 5].map((i) => (
            <span
                key={i}
                className="w-1 bg-white rounded-full animate-pulse"
                style={{
                    height: `${12 + i * 5}px`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: '0.6s',
                }}
            />
        ))}
    </div>
);

export default function VoiceCounselor() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('en');
    const [sessionId] = useState(getOrCreateSessionId);
    const [mode, setMode] = useState('voice');

    const messagesEndRef = useRef(null);

    const onTranscript = useCallback((text) => {
        setInput(text);
        setTimeout(() => sendMessage(text), 200);
    }, []);

    const voice = useVoice({ language, onTranscript });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: '👋 Namaste! I\'m your **Voice AI Counselor**. Ask me anything about colleges, courses, admissions, or careers — in English or Hindi!',
            }]);
        }
    }, []);

    const sendMessage = useCallback(async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/chatbot/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, sessionId, language }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            const reply = data.data?.reply || 'Sorry, I could not process that. Please try again.';
            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

            if (mode === 'voice') {
                setTimeout(() => voice.speak(stripMd(reply)), 300);
            }
        } catch (_) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: '⚠️ Connection issue. Please try again.',
            }]);
        } finally {
            setLoading(false);
        }
    }, [input, loading, sessionId, language, mode, voice]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startVoiceSession = () => {
        voice.startListening();
    };

    const selectedLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#b82025] to-[#8e1419] text-white">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Voice AI Counselor</h1>
                            <p className="text-white/70 text-xs">Multilingual · Voice-Powered</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {LANGUAGES.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLanguage(l.code)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                    language === l.code
                                        ? 'bg-white text-[#b82025]'
                                        : 'bg-white/20 text-white/80 hover:bg-white/30'
                                }`}
                            >
                                {l.native}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mode Toggle */}
                <div className="max-w-4xl mx-auto px-4 pb-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('voice')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                mode === 'voice'
                                    ? 'bg-white text-[#b82025] shadow-md'
                                    : 'bg-white/15 text-white/80 hover:bg-white/25'
                            }`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                            Voice Mode
                        </button>
                        <button
                            onClick={() => setMode('text')}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                                mode === 'text'
                                    ? 'bg-white text-[#b82025] shadow-md'
                                    : 'bg-white/15 text-white/80 hover:bg-white/25'
                            }`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            Text Mode
                        </button>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    {/* Messages */}
                    <div className="h-[calc(100vh-340px)] min-h-[400px] overflow-y-auto px-6 py-6 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-end gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b82025] to-[#8e1419] flex items-center justify-center flex-shrink-0 shadow-md">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2a9 9 0 018.66 6.57M12 2a9 9 0 00-8.66 6.57M12 22a9 9 0 008.66-6.57M12 22a9 9 0 01-8.66-6.57M3.34 8.57a9 9 0 000 6.86M20.66 8.57a9 9 0 010 6.86" />
                                        </svg>
                                    </div>
                                )}
                                <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-[#b82025] to-[#e23744] text-white rounded-br-sm'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                }`}>
                                    {msg.role === 'user' ? (
                                        <p>{msg.content}</p>
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex items-end gap-3 mb-4">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#b82025] to-[#8e1419] flex items-center justify-center flex-shrink-0 shadow-md">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a9 9 0 018.66 6.57M12 2a9 9 0 00-8.66 6.57M12 22a9 9 0 008.66-6.57M12 22a9 9 0 01-8.66-6.57M3.34 8.57a9 9 0 000 6.86M20.66 8.57a9 9 0 010 6.86" />
                                    </svg>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm px-5 py-3">
                                    <div className="flex items-center gap-1">
                                        {[0, 1, 2].map((j) => (
                                            <span key={j} className="w-2 h-2 rounded-full bg-[#b82025] animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Voice / Input Area */}
                    <div className="border-t border-gray-100 p-4 bg-white">
                        {mode === 'voice' ? (
                            <div className="flex flex-col items-center gap-4">
                                {voice.isListening ? (
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#b82025] to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                                            <WaveBars />
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-gray-700">Listening...</p>
                                        <p className="text-xs text-gray-400">Speak in {selectedLang.native}</p>
                                        <button
                                            onClick={voice.stopListening}
                                            className="mt-3 px-6 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : voice.isSpeaking ? (
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                                            </svg>
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-gray-700">Speaking...</p>
                                        <button
                                            onClick={voice.stopSpeaking}
                                            className="mt-3 px-6 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
                                        >
                                            Stop
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <button
                                            onClick={startVoiceSession}
                                            className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#b82025] to-[#e23744] flex items-center justify-center shadow-xl shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-200 group"
                                        >
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                                <path d="M12 19v3" />
                                            </svg>
                                        </button>
                                        <p className="mt-4 text-sm font-medium text-gray-700">Tap to start speaking</p>
                                        <p className="text-xs text-gray-400">Ask in {selectedLang.native} about colleges, courses & more</p>
                                    </div>
                                )}
                                {voice.voiceError && (
                                    <p className="text-xs text-red-500 text-center">{voice.voiceError}</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-end gap-2">
                                <textarea
                                    rows={1}
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your question..."
                                    className="flex-1 resize-none bg-gray-100 text-gray-800 placeholder-gray-400 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition-all"
                                    style={{ minHeight: '44px' }}
                                    disabled={loading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={loading || !input.trim()}
                                    className="px-5 h-11 rounded-xl flex items-center gap-2 font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 text-white"
                                    style={{ background: 'linear-gradient(135deg, #b82025, #e23744)' }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                    Send
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
