import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4001/api/v1';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
];

const QUICK_PROMPTS = [
    '🎓 Top institutes in your city',
    '📚 Best MBA courses',
    '💰 Scholarship guidance',
    '🏥 Medical admission process',
    '🛠️ Engineering streams',
    '📝 Admission requirements',
];

const BOT_AVATAR = (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b82025] to-[#8e1419] flex items-center justify-center flex-shrink-0 shadow-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

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
                    className="w-2 h-2 rounded-full bg-[#b82025] animate-bounce"
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
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#b82025] underline hover:text-[#e23744]">
            {children}
        </a>
    ),
    code: ({ children }) => (
        <code className="bg-gray-100 text-[#b82025] px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="bg-gray-100 rounded-lg p-3 mb-2 overflow-x-auto text-xs font-mono">{children}</pre>
    ),
    hr: () => <hr className="my-3 border-gray-200" />,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-[#b82025] pl-3 italic text-gray-600 mb-2">{children}</blockquote>
    ),
};

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-3 animate-fade-in`}>
            {!isUser && BOT_AVATAR}
            <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm shadow-sm break-words ${
                    isUser
                        ? 'bg-gradient-to-br from-[#b82025] to-[#e23744] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                }`}
            >
                {isUser ? (
                    msg.content
                ) : (
                    <ReactMarkdown
                        components={MarkdownComponents}
                        remarkPlugins={[remarkGfm]}
                    >
                        {msg.content}
                    </ReactMarkdown>
                )}
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
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const langMenuRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input when chat opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 150);
            if (!historyLoaded) loadHistory();
        }
    }, [open]);

    // Close lang menu on outside click
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
                    // Greet on first open
                    setMessages([{
                        role: 'assistant',
                        content: '👋 Hi! I\'m EduBot, your 24×7 admission counselor.\n\nI can help you with:\n• Institute & course guidance\n• Admission process & eligibility\n• Fee structure & scholarships\n• Career path recommendations\n\nWhat would you like to know today?',
                    }]);
                }
            }
        } catch (_) {
            // Greet anyway
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
        setError(null);
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
            setError('Could not reach the AI. Please check your connection.');
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

    const clearChat = async () => {
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
                className="fixed bottom-6 right-6 z-[99999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #b82025 0%, #e23744 100%)' }}
                aria-label="Open AI Counselor"
            >
                {open ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        {/* Pulse ring */}
                        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white animate-pulse" />
                    </>
                )}
            </button>

            {/* ── Chat Panel ── */}
            <div
                id="chatbot-panel"
                className={`fixed bottom-24 right-6 z-[99998] w-[360px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
                    }`}
                style={{ height: '540px', maxHeight: 'calc(100vh - 8rem)' }}
            >
                {/* Header */}
                <div
                    className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #b82025 0%, #8e1419 100%)' }}
                >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a9 9 0 018.66 6.57M12 2a9 9 0 00-8.66 6.57M12 22a9 9 0 008.66-6.57M12 22a9 9 0 01-8.66-6.57M3.34 8.57a9 9 0 000 6.86M20.66 8.57a9 9 0 010 6.86" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">EduBot</p>
                        <p className="text-white/75 text-xs">AI Admission Counselor · 24×7</p>
                    </div>

                    {/* Language picker */}
                    <div ref={langMenuRef} className="relative flex-shrink-0">
                        <button
                            onClick={() => setShowLangMenu((s) => !s)}
                            className="flex items-center gap-1 text-white/90 hover:text-white text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition-colors"
                        >
                            <span>{selectedLang.label}</span>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z" /></svg>
                        </button>
                        {showLangMenu && (
                            <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 w-32">
                                {LANGUAGES.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 text-gray-700 transition-colors ${language === l.code ? 'text-[#b82025] font-semibold bg-red-50' : ''}`}
                                    >
                                        {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear chat */}
                    <button
                        onClick={clearChat}
                        className="text-white/70 hover:text-white transition-colors flex-shrink-0 ml-1"
                        title="Clear chat"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 min-h-0">
                    {messages.map((msg, i) => (
                        <MessageBubble key={i} msg={msg} />
                    ))}
                    {loading && (
                        <div className="flex items-end gap-2 mb-3">
                            {BOT_AVATAR}
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm">
                                <TypingDots />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick prompts — only show on first/empty conversation */}
                {messages.length <= 1 && !loading && (
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0 hide-scrollbar">
                        {QUICK_PROMPTS.map((p) => (
                            <button
                                key={p}
                                onClick={() => sendMessage(p)}
                                className="flex-shrink-0 text-xs bg-white border border-[#b82025]/30 text-[#b82025] rounded-full px-3 py-1.5 hover:bg-red-50 hover:border-[#b82025] transition-all whitespace-nowrap shadow-sm"
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input bar */}
                <div className="flex items-end gap-2 px-3 py-3 bg-white border-t border-gray-100 flex-shrink-0">
                    <textarea
                        ref={inputRef}
                        id="chatbot-input"
                        rows={1}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Auto-grow
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about admissions, courses…"
                        className="flex-1 resize-none bg-gray-100 text-gray-800 placeholder-gray-400 text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#b82025] focus:bg-white transition-all max-h-24 overflow-y-auto"
                        style={{ minHeight: '40px' }}
                        disabled={loading}
                    />
                    <button
                        id="chatbot-send-btn"
                        onClick={() => sendMessage()}
                        disabled={loading || !input.trim()}
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #b82025, #e23744)' }}
                        aria-label="Send"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] text-gray-400 py-1.5 bg-white border-t border-gray-50 flex-shrink-0">
                    Powered by <span className="text-[#b82025] font-semibold">Eduroutez AI</span> · API cost applies
                </div>
            </div>
        </>
    );
}
