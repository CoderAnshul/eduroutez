import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import useVoice from '../utils/useVoice';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
];

const QUICK_PROMPTS = [
    { icon: '🎓', text: 'Top institutes in your city' },
    { icon: '📚', text: 'Best MBA courses' },
    { icon: '💰', text: 'Scholarship guidance' },
    { icon: '🏥', text: 'Medical admission' },
    { icon: '🛠️', text: 'Engineering streams' },
    { icon: '📝', text: 'Admission requirements' },
];

function getOrCreateSessionId() {
    let sid = localStorage.getItem('edu_chat_session_id');
    if (!sid) {
        sid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
        localStorage.setItem('edu_chat_session_id', sid);
    }
    return sid;
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}

const MarkdownComponents = {
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold mb-1.5 text-gray-900">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-rose-600 underline hover:text-rose-700">
            {children}
        </a>
    ),
    code: ({ children }) => (
        <code className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="bg-gray-50 rounded-lg p-3 mb-2 overflow-x-auto text-xs font-mono border border-gray-100">{children}</pre>
    ),
    hr: () => <hr className="my-3 border-gray-100" />,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-rose-400 pl-3 italic text-gray-500 mb-2">{children}</blockquote>
    ),
};

function stripMarkdown(text) {
    return text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/>\s/g, '')
        .replace(/[-*+]\s/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
}

function MessageBubble({ msg, isSpeaking, onSpeak, onStopSpeaking }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex items-end gap-2.5 mb-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {!isUser && (
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
            <div className={`max-w-[80%] text-sm leading-relaxed break-words ${isUser ? 'order-1' : 'order-2'}`}>
                <div
                    className={`px-3.5 py-2.5 ${
                        isUser
                            ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-[18px] rounded-br-[4px] shadow-lg shadow-rose-500/20'
                            : 'bg-white text-gray-800 rounded-[18px] rounded-bl-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100/80'
                    }`}
                >
                    {isUser ? (
                        <span className="leading-relaxed">{msg.content}</span>
                    ) : (
                        <>
                            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                                {msg.content}
                            </ReactMarkdown>
                            {onSpeak && (
                                <button
                                    onClick={isSpeaking ? onStopSpeaking : onSpeak}
                                    className={`mt-2 flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full transition-all ${
                                        isSpeaking
                                            ? 'bg-rose-500/10 text-rose-600 animate-pulse'
                                            : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50'
                                    }`}
                                >
                                    {isSpeaking ? (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="4" width="4" height="16" rx="1" />
                                            <rect x="14" y="4" width="4" height="16" rx="1" />
                                        </svg>
                                    ) : (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                                        </svg>
                                    )}
                                    <span className="font-medium">{isSpeaking ? 'Playing' : 'Listen'}</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('en');
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [sessionId] = useState(getOrCreateSessionId);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [speakingIndex, setSpeakingIndex] = useState(null);

    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const langMenuRef = useRef(null);

    const sendMessageRef = useRef(null);
    const voice = useVoice({ language, onTranscript: (text) => sendMessageRef.current?.(text) });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 150);
            if (!historyLoaded) loadHistory();
        }
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
                setShowLangMenu(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const loadHistory = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}/chatbot/history/${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.data?.messages?.length) {
                    setMessages(data.data.messages);
                    if (data.data.language) setLanguage(data.data.language);
                } else {
                    setMessages([{
                        role: 'assistant',
                        content: '👋 Hi! I\'m **EduBot**, your 24×7 admission counselor.\n\n🎯 **Try our AI tools:**\n• 🧠 **Personality Assessment** — Find your ideal college match\n• 📊 **Market Trends** — Course demand & salary insights\n• 🎤 **Voice Counselor** — Speak in Hindi, English & more\n\nWhat would you like to explore today?',
                    }]);
                }
            }
        } catch (_) {
            setMessages([{
                role: 'assistant',
                content: '👋 Hi! I\'m EduBot, your 24×7 admission counselor. How can I help you today?',
            }]);
        } finally {
            setHistoryLoaded(true);
        }
    }, [sessionId]);

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
        } catch (err) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: '⚠️ I\'m having trouble connecting right now. Please try again in a moment.',
            }]);
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [input, loading, sessionId, language]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSpeak = useCallback((text, index) => {
        if (speakingIndex === index) {
            voice.stopSpeaking();
            setSpeakingIndex(null);
        } else {
            voice.stopSpeaking();
            voice.speak(stripMarkdown(text));
            setSpeakingIndex(index);
        }
    }, [voice, speakingIndex]);

    useEffect(() => {
        if (!voice.isSpeaking && speakingIndex !== null) {
            setSpeakingIndex(null);
        }
    }, [voice.isSpeaking]);

    sendMessageRef.current = sendMessage;

    const clearChat = async () => {
        voice.stopSpeaking();
        setSpeakingIndex(null);
        try {
            await fetch(`${BASE_URL}/chatbot/session/${sessionId}`, { method: 'DELETE' });
            localStorage.removeItem('edu_chat_session_id');
        } catch (_) { }
        const newSid = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now());
        localStorage.setItem('edu_chat_session_id', newSid);
        setMessages([{
            role: 'assistant',
            content: '🔄 Chat cleared! How can I help you?',
        }]);
        setHistoryLoaded(true);
    };

    const selectedLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

    return (
        <>
            {/* ── Floating Button ── */}
            <button
                id="chatbot-toggle-btn"
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 right-6 z-[99999] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
                style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', boxShadow: '0 8px 32px rgba(225,29,72,0.4)' }}
                aria-label="Open AI Counselor"
            >
                <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute -inset-[3px] rounded-full border border-rose-300/30 animate-pulse" style={{ animationDuration: '2.5s' }} />
                <span className="absolute -inset-[7px] rounded-full border border-white/10 animate-pulse" style={{ animationDuration: '3.5s' }} />
                {open ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="relative z-10">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <div className="relative z-10">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-[2.5px] border-white shadow-lg" />
                    </div>
                )}
            </button>

            {/* ── Chat Panel ── */}
            <div
                id="chatbot-panel"
                className={`fixed bottom-24 right-6 z-[99998] w-[380px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-[20px] overflow-hidden transition-all duration-300 origin-bottom-right ${
                    open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-[0.85] opacity-0 pointer-events-none'
                }`}
                style={{
                    height: '580px',
                    maxHeight: 'calc(100vh - 8rem)',
                    boxShadow: open
                        ? '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.1)'
                        : 'none',
                }}
            >
                {/* Header */}
                <div className="relative flex items-center gap-2.5 px-4 py-[14px] flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #e11d48 0%, #881337 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 25% 40%, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a9 9 0 018.66 6.57M12 2a9 9 0 00-8.66 6.57M12 22a9 9 0 008.66-6.57M12 22a9 9 0 01-8.66-6.57M3.34 8.57a9 9 0 000 6.86M20.66 8.57a9 9 0 010 6.86" />
                                </svg>
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-rose-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-semibold text-sm leading-tight tracking-wide">EduBot</p>
                            <p className="text-rose-200/80 text-[11px] font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                Online · 24×7
                            </p>
                        </div>
                    </div>

                    {/* Feature links */}
                    <div className="flex items-center gap-0.5 flex-shrink-0 relative z-10">
                        <button onClick={() => navigate('/personality-assessment')}
                            className="text-white/60 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15"
                            title="Personality Assessment"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </button>
                        <button onClick={() => navigate('/market-trends')}
                            className="text-white/60 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15"
                            title="Market Trends"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 20V10M12 20V4M6 20v-6" />
                            </svg>
                        </button>
                        <button onClick={() => navigate('/voice-counselor')}
                            className="text-white/60 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15"
                            title="Voice Counselor"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                        </button>
                    </div>

                    {/* Language */}
                    <div ref={langMenuRef} className="relative flex-shrink-0 z-10">
                        <button onClick={() => setShowLangMenu((s) => !s)}
                            className="flex items-center gap-1 text-white/70 hover:text-white text-[11px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full transition-all font-medium"
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                            <span>{selectedLang.label}</span>
                            <svg width="7" height="7" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z" /></svg>
                        </button>
                        {showLangMenu && (
                            <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 w-28 overflow-hidden">
                                {LANGUAGES.map((l) => (
                                    <button key={l.code}
                                        onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs hover:bg-rose-50 text-gray-600 transition-colors flex items-center gap-2 ${
                                            language === l.code ? 'text-rose-600 font-semibold bg-rose-50' : ''
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${language === l.code ? 'bg-rose-500' : 'bg-gray-200'}`} />
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear */}
                    <button onClick={clearChat}
                        className="text-white/40 hover:text-white transition-all p-1.5 rounded-lg hover:bg-white/10 active:bg-white/15 relative z-10"
                        title="Clear chat"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-custom" style={{ background: '#f1f5f9' }}>
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center mb-4 shadow-inner">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-400">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">Start a conversation</p>
                            <p className="text-gray-400 text-xs mt-1">Ask about courses, colleges, or admissions</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <MessageBubble
                            key={i}
                            msg={msg}
                            isSpeaking={speakingIndex === i && voice.isSpeaking}
                            onSpeak={msg.role === 'assistant' ? () => handleSpeak(msg.content, i) : undefined}
                            onStopSpeaking={() => { voice.stopSpeaking(); setSpeakingIndex(null); }}
                        />
                    ))}
                    {loading && (
                        <div className="flex items-end gap-2.5 mb-3 animate-fade-in">
                            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-white">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="bg-white rounded-[18px] rounded-bl-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-gray-100/80">
                                <TypingDots />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts */}
                {messages.length <= 1 && !loading && (
                    <div className="px-3 py-2.5 flex gap-2 overflow-x-auto flex-shrink-0 hide-scrollbar" style={{ background: '#f1f5f9', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                        {QUICK_PROMPTS.map((p) => (
                            <button key={p.text}
                                onClick={() => sendMessage(p.icon + ' ' + p.text)}
                                className="flex-shrink-0 text-xs font-medium bg-white text-gray-600 rounded-full px-3.5 py-2 hover:bg-rose-600 hover:text-white transition-all whitespace-nowrap shadow-sm border border-gray-100/80"
                            >
                                <span className="mr-1">{p.icon}</span>
                                {p.text}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input bar */}
                <div className="relative flex items-end gap-2 px-3 py-[10px] bg-white flex-shrink-0" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent" />

                    {voice.isListening && (
                        <div className="absolute bottom-full left-0 right-0 bg-gradient-to-r from-rose-600 to-rose-500 text-white text-xs py-2.5 flex items-center justify-center gap-2.5 shadow-lg">
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                            <span className="font-medium tracking-wide">Listening... Speak now</span>
                            <button onClick={voice.stopListening} className="text-white/70 hover:text-white underline font-medium">Cancel</button>
                        </div>
                    )}
                    {voice.voiceError && !voice.isListening && (
                        <div className="absolute bottom-full left-0 right-0 bg-red-500 text-white text-xs py-2.5 text-center shadow-lg font-medium tracking-wide">
                            {voice.voiceError}
                        </div>
                    )}

                    <textarea
                        ref={inputRef}
                        id="chatbot-input"
                        rows={1}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={voice.isListening ? 'Listening…' : "Ask about admissions, courses…"}
                        className="flex-1 resize-none bg-gray-50 text-gray-800 placeholder-gray-400 text-sm rounded-2xl px-4 py-2.5 outline-none transition-all max-h-24 overflow-y-auto border-0 focus:ring-2 focus:ring-rose-500/20 focus:bg-white focus:shadow-inner"
                        style={{ minHeight: '42px' }}
                        disabled={loading || voice.isListening}
                    />

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button id="chatbot-mic-btn"
                            onClick={voice.toggleListening}
                            disabled={loading}
                            className={`w-[42px] h-[42px] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                                voice.isListening
                                    ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 animate-pulse'
                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 border border-gray-100'
                            }`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                                <path d="M19 10v2a7 7 0 01-14 0v-2" />
                                <path d="M12 19v3" />
                            </svg>
                        </button>
                        <button id="chatbot-send-btn"
                            onClick={() => sendMessage()}
                            disabled={loading || !input.trim()}
                            className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-rose-500/25"
                            style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-[10px] text-gray-400 py-[10px] bg-white flex-shrink-0 text-center font-medium tracking-wide">
                    <span className="text-rose-500">●</span> Powered by <span className="text-rose-600 font-semibold">Eduroutez AI</span>
                </div>
            </div>
        </>
    );
}
