import { useState, useRef, useCallback, useEffect } from 'react';

const LANG_MAP = {
    en: 'en-IN',
    hi: 'hi-IN',
};

export default function useVoice({ language = 'en', onTranscript } = {}) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceError, setVoiceError] = useState(null);
    const [voices, setVoices] = useState([]);

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);
    const utteranceRef = useRef(null);

    useEffect(() => {
        const synth = synthRef.current;
        if (!synth) return;
        const updateVoices = () => setVoices(synth.getVoices());
        synth.addEventListener('voiceschanged', updateVoices);
        updateVoices();
        return () => synth.removeEventListener('voiceschanged', updateVoices);
    }, []);

    const stopListening = useCallback(() => {
        try { recognitionRef.current?.stop(); } catch (_) { }
        setIsListening(false);
    }, []);

    const startListening = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceError('Speech recognition not supported in this browser');
            return;
        }
        stopListening();
        const recognition = new SpeechRecognition();
        recognition.lang = LANG_MAP[language] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onTranscript?.(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            if (event.error !== 'aborted' && event.error !== 'no-speech') {
                setVoiceError(`Microphone error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        try {
            recognition.start();
            setIsListening(true);
            setVoiceError(null);
            recognitionRef.current = recognition;
        } catch (err) {
            setVoiceError('Could not access microphone');
            setIsListening(false);
        }
    }, [language, onTranscript, stopListening]);

    const findVoice = useCallback((lang) => {
        const langCode = LANG_MAP[language] || 'en-IN';
        return voices.find((v) => v.lang.startsWith(langCode)) || voices.find((v) => v.lang.startsWith('en')) || null;
    }, [language, voices]);

    const speak = useCallback((text) => {
        const synth = synthRef.current;
        if (!synth) return;
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = findVoice();
        if (voice) utterance.voice = voice;
        utterance.lang = LANG_MAP[language] || 'en-IN';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        utteranceRef.current = utterance;
        synth.speak(utterance);
    }, [language, findVoice]);

    const stopSpeaking = useCallback(() => {
        const synth = synthRef.current;
        if (!synth) return;
        synth.cancel();
        setIsSpeaking(false);
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    useEffect(() => {
        return () => {
            stopListening();
            stopSpeaking();
        };
    }, [stopListening, stopSpeaking]);

    return {
        isListening,
        isSpeaking,
        voiceError,
        startListening,
        stopListening,
        toggleListening,
        speak,
        stopSpeaking,
        voices,
    };
}
