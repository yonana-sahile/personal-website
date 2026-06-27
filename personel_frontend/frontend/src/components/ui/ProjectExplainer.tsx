import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe as GlobeIcon, Mic, MicOff, X, Volume2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Language = 'en' | 'am' | 'om' | 'ti';
type RobotState = 'idle' | 'greeting' | 'listening' | 'thinking' | 'speaking';

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES: { label: string; flag: string; lang: Language; recognitionLang: string }[] = [
  { label: 'English',  flag: '🇬🇧', lang: 'en', recognitionLang: 'en-US' },
  { label: 'Amharic',  flag: '🇪🇹', lang: 'am', recognitionLang: 'am-ET' },
  { label: 'Oromo',    flag: '🟢',   lang: 'om', recognitionLang: 'om-ET' },
  { label: 'Tigrinya', flag: '🔵',   lang: 'ti', recognitionLang: 'ti-ET' },
];

// ─── Greetings per language ───────────────────────────────────────────────────
const GREETINGS: Record<Language, string[]> = {
  en: [
    "Hey there! I'm Cosmo, Yonas's AI assistant! I'm here to tell you all about him. What would you like to know?",
    "Hi! Great to meet you! I'm Cosmo — your guide to everything about Yonas Sahile. Fire away!",
    "Hello! I'm Cosmo! Ask me anything about Yonas's skills, projects, or how to reach him!",
  ],
  am: [
    "ሰላም! እኔ ኮስሞ ነኝ — የዮናስ AI ረዳት። ስለ ዮናስ ሁሉ ነገር ልነግርዎ እችላለሁ።",
    "ሰላም! ኮስሞ እባላለሁ። ስለ ዮናስ ሳሂሌ ምን ማወቅ ይፈልጋሉ?",
  ],
  om: [
    "Akkam! Ani Cosmo, AI gargaaraa Yonas ti. Waa'ee Yonas maal gaafachuu barbaaddu?",
  ],
  ti: [
    "ሰላም! ኣነ ኮስሞ እየ — ናይ ዮናስ AI ሓጋዚ። ብዛዕባ ዮናስ ኩሉ ክነግረካ እኽእል!",
  ],
};

// ─── Idle motivational bubbles ────────────────────────────────────────────────
const IDLE_BUBBLES = [
  "👋 Click me to start talking!",
  "🎙️ I can answer anything about Yonas!",
  "🤖 Try asking about his projects!",
  "🌍 I speak 4 languages!",
  "🔐 Ask me about cybersecurity!",
  "⚡ Voice-powered AI — just click!",
];

// ─── Audio context singleton ──────────────────────────────────────────────────
let globalAudioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
    globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return globalAudioCtx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCSRFToken(): string {
  const match = document.cookie.match(/csrftoken=([\w-]+)/);
  return match ? match[1] : '';
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Waveform bars (shown while speaking/listening) ───────────────────────────
function WaveBars({ active, color }: { active: boolean; color: string }) {
  if (!active) return null;
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.3, 0.7].map((h, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full"
          style={{
            backgroundColor: color,
            height: `${h * 16}px`,
            animation: `wave-bar ${0.3 + i * 0.07}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const ProjectExplainer: React.FC = () => {
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleText, setBubbleText] = useState(IDLE_BUBBLES[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Conversation display
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [statusText, setStatusText] = useState('Click me to talk! 🎙️');

  // Refs
  const containerRef    = useRef<HTMLDivElement>(null);
  const sourceRef       = useRef<AudioBufferSourceNode | null>(null);
  const recognitionRef  = useRef<any>(null);
  const stateRef        = useRef<RobotState>('idle');
  const langRef         = useRef<Language>('en');
  const bubbleTimerRef  = useRef<NodeJS.Timeout | null>(null);
  const retryTimerRef   = useRef<NodeJS.Timeout | null>(null);

  // Keep refs in sync
  useEffect(() => { stateRef.current = robotState; }, [robotState]);
  useEffect(() => { langRef.current = selectedLang; }, [selectedLang]);

  // ── Mouse tracking for eyes ───────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / 15;
      const y = (e.clientY - (rect.top + rect.height / 2)) / 15;
      setMousePos({ x: Math.max(-8, Math.min(8, x)), y: Math.max(-8, Math.min(8, y)) });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // ── Idle bubble cycling ───────────────────────────────────────────────────
  useEffect(() => {
    let i = 0;
    const cycle = () => {
      if (stateRef.current === 'idle') {
        i = (i + 1) % IDLE_BUBBLES.length;
        setBubbleText(IDLE_BUBBLES[i]);
      }
      bubbleTimerRef.current = setTimeout(cycle, 6000);
    };
    bubbleTimerRef.current = setTimeout(cycle, 6000);
    return () => { if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current); };
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopAudio();
      stopRecognition();
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  // ── Stop audio playback ───────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); sourceRef.current.disconnect(); } catch {}
      sourceRef.current = null;
    }
  }, []);

  // ── Stop speech recognition ───────────────────────────────────────────────
  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (retryTimerRef.current) { clearTimeout(retryTimerRef.current); retryTimerRef.current = null; }
  }, []);

  // ── Speak text via gTTS backend ───────────────────────────────────────────
  const speak = useCallback(async (text: string, lang: Language, onEnd?: () => void) => {
    try {
      stopAudio();
      stopRecognition();

      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') await ctx.resume();

      setRobotState('speaking');
      setStatusText('Speaking...');
      setAiResponse(text);

      const res = await fetch('http://localhost:8000/api/gtts-robot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
        credentials: 'include',
        body: JSON.stringify({ text, lang }),
      });

      if (!res.ok) throw new Error('TTS fetch failed');
      const data = await res.json();
      if (!data.audio_base64) throw new Error('No audio returned');

      const binary = atob(data.audio_base64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const buffer = await ctx.decodeAudioData(bytes.buffer);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      source.onended = () => {
        sourceRef.current = null;
        onEnd?.();
      };

      source.start();
      sourceRef.current = source;

    } catch (err) {
      console.error('TTS error:', err);
      // Fallback: browser TTS
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = LANGUAGES.find(l => l.lang === lang)?.recognitionLang || 'en-US';
        utt.onend = () => onEnd?.();
        speechSynthesis.speak(utt);
      } else {
        onEnd?.();
      }
    }
  }, [stopAudio, stopRecognition]);

  // ── Start speech recognition ──────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }

    stopRecognition();

    const recognition = new SpeechRecognitionAPI();
    const langConfig  = LANGUAGES.find(l => l.lang === langRef.current);
    recognition.lang              = langConfig?.recognitionLang || 'en-US';
    recognition.continuous        = false;
    recognition.interimResults    = true;
    recognition.maxAlternatives   = 1;

    recognition.onstart = () => {
      setRobotState('listening');
      setStatusText('Listening... speak now! 🎙️');
      setTranscript('');
    };

    recognition.onresult = async (event: any) => {
      const isFinal    = event.results[event.results.length - 1].isFinal;
      const text       = event.results[event.results.length - 1][0].transcript;

      setTranscript(text);

      if (isFinal && text.trim()) {
        recognition.stop();
        recognitionRef.current = null;

        setRobotState('thinking');
        setStatusText('Thinking... 🧠');

        try {
          const response = await fetch('http://localhost:8000/api/chat/text/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text.trim() }),
          });
          const data    = await response.json();
          const answer  = response.ok ? (data.text || 'Sorry, I could not understand that.') : 'Sorry, something went wrong.';

          // Speak the answer, then auto-listen again
          speak(answer, langRef.current, () => {
            if (stateRef.current !== 'idle') {
              retryTimerRef.current = setTimeout(() => startListening(), 1200);
            }
          });

        } catch {
          speak("Sorry, I couldn't connect to the server. Please try again!", langRef.current, () => {
            if (stateRef.current !== 'idle') {
              retryTimerRef.current = setTimeout(() => startListening(), 1200);
            }
          });
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Silently restart listening
        if (stateRef.current !== 'idle') {
          retryTimerRef.current = setTimeout(() => startListening(), 800);
        }
      } else if (event.error !== 'aborted') {
        setStatusText('Could not hear you. Try again! 🎙️');
        if (stateRef.current !== 'idle') {
          retryTimerRef.current = setTimeout(() => startListening(), 1500);
        }
      }
    };

    recognition.onend = () => {
      // If we're still in listening state and nothing handled it
      if (stateRef.current === 'listening') {
        retryTimerRef.current = setTimeout(() => startListening(), 800);
      }
    };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch {}
  }, [speak, stopRecognition]);

  // ── Start full conversation ───────────────────────────────────────────────
  const startConversation = useCallback(async () => {
    setShowBubble(false);
    setTranscript('');
    setAiResponse('');

    const greeting = randomFrom(GREETINGS[selectedLang]);
    speak(greeting, selectedLang, () => {
      retryTimerRef.current = setTimeout(() => startListening(), 600);
    });
  }, [selectedLang, speak, startListening]);

  // ── Stop everything ───────────────────────────────────────────────────────
  const stopConversation = useCallback(() => {
    stopAudio();
    stopRecognition();
    setRobotState('idle');
    setStatusText('Click me to talk! 🎙️');
    setShowBubble(true);
    setBubbleText(IDLE_BUBBLES[0]);
  }, [stopAudio, stopRecognition]);

  // ── Robot click ───────────────────────────────────────────────────────────
  const handleRobotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (robotState === 'idle') {
      startConversation();
    } else {
      stopConversation();
    }
  };

  // ── State-based colors ────────────────────────────────────────────────────
  const stateColor = {
    idle:      '#a855f7',
    greeting:  '#22d3ee',
    listening: '#ec4899',
    thinking:  '#f59e0b',
    speaking:  '#22d3ee',
  }[robotState];

  const stateLabel = {
    idle:      '● READY',
    greeting:  '▶ GREETING',
    listening: '🎙 LISTENING',
    thinking:  '⏳ THINKING',
    speaking:  '🔊 SPEAKING',
  }[robotState];

  const isActive = robotState !== 'idle';

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-6 z-[60] print:hidden select-none"
    >
      <style>{`
        @keyframes float-loop {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(1deg); }
        }
        .float-anim { animation: float-loop 3s ease-in-out infinite; }

        @keyframes wave-bar {
          0%   { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring { animation: pulse-ring 1.2s ease-out infinite; }
      `}</style>

      {/* ── Conversation Panel ─────────────────────────────────────────────── */}
      {isActive && (
        <div className="absolute bottom-[145px] left-0 w-[300px] bg-[#070b18]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-purple-500/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: stateColor }} />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: stateColor }}>
                {stateLabel}
              </span>
            </div>
            <WaveBars active={robotState === 'speaking' || robotState === 'listening'} color={stateColor} />
          </div>

          <div className="px-4 py-3 space-y-3 min-h-[80px]">
            {/* User transcript */}
            {transcript ? (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-purple-400 mb-1 font-bold">🎤 You</p>
                <p className="text-[12px] text-white/85 leading-relaxed italic">"{transcript}"</p>
              </div>
            ) : robotState === 'listening' ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                  ))}
                </div>
                <p className="text-[11px] text-pink-300/80 font-mono">Listening... speak now</p>
              </div>
            ) : null}

            {/* AI response */}
            {aiResponse && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 mb-1 font-bold">🤖 Cosmo</p>
                <p className="text-[12px] text-white/90 leading-relaxed">{aiResponse}</p>
              </div>
            )}

            {/* Thinking state */}
            {robotState === 'thinking' && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                  ))}
                </div>
                <p className="text-[11px] text-yellow-300/80 font-mono">Processing your question...</p>
              </div>
            )}
          </div>

          {/* Stop button */}
          <div className="px-4 pb-3">
            <button
              onClick={stopConversation}
              className="w-full py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-3 h-3" /> Stop Conversation
            </button>
          </div>
        </div>
      )}

      {/* ── Idle speech bubble ────────────────────────────────────────────── */}
      {!isActive && showBubble && (
        <div className="absolute bottom-[145px] left-0 w-[240px] bg-[#0c0e1a]/95 backdrop-blur-lg border border-purple-500/30 px-4 py-3 rounded-2xl shadow-xl">
          <p className="text-[12px] text-white/80 leading-relaxed">{bubbleText}</p>
          <div className="absolute bottom-0 left-8 translate-y-full">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#0c0e1a]" />
          </div>
        </div>
      )}

      {/* ── Language menu ─────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-[145px] right-0 translate-x-[110%]"
        onMouseEnter={() => setShowLangMenu(true)}
        onMouseLeave={() => setShowLangMenu(false)}
      >
        {/* Trigger tab */}
        <button
          onClick={() => setShowLangMenu(v => !v)}
          className="flex items-center gap-1.5 bg-[#0c0e1a]/90 border border-cyan-500/30 text-cyan-400 font-mono text-[9px] uppercase tracking-widest px-2 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-all"
        >
          <GlobeIcon className="w-3 h-3" />
          {LANGUAGES.find(l => l.lang === selectedLang)?.flag}
        </button>

        {showLangMenu && (
          <div className="absolute bottom-0 left-full ml-2 bg-[#0c0e17]/98 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-3 shadow-2xl w-[160px]">
            <p className="font-mono text-[9px] text-cyan-400/60 uppercase tracking-wider mb-2 pb-1 border-b border-white/5">Voice Language</p>
            <div className="flex flex-col gap-1">
              {LANGUAGES.map(({ label, flag, lang }) => (
                <button
                  key={lang}
                  onClick={() => {
                    stopConversation();
                    setSelectedLang(lang);
                    setShowLangMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-mono font-bold transition-all duration-200 ${
                    selectedLang === lang
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{flag}</span> {label}
                  {selectedLang === lang && <span className="ml-auto text-cyan-400 text-[8px]">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Robot body ────────────────────────────────────────────────────── */}
      <div className="relative" onClick={handleRobotClick}>

        {/* Outer glow ring */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${isActive ? 'opacity-100 scale-125' : 'opacity-50 scale-90'}`}
          style={{ background: `radial-gradient(circle, ${stateColor}33, transparent 70%)` }}
        />

        {/* Pulse ring when listening */}
        {robotState === 'listening' && (
          <div className="absolute inset-4 rounded-full border-2 border-pink-400 pulse-ring" />
        )}

        {/* SVG robot */}
        <div
          className="relative w-28 h-32 cursor-pointer float-anim"
          style={{ filter: isActive ? `drop-shadow(0 0 16px ${stateColor}88)` : 'none' }}
          title={isActive ? 'Click to stop' : 'Click to start talking!'}
        >
          <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#1e293b" />
                <stop offset="50%"  stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <filter id="neon">
                <feGaussianBlur stdDeviation="2.5" result="glow"/>
                <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Shadow */}
            <ellipse cx="50" cy="118" rx="26" ry="6" fill="rgba(0,0,0,0.5)" />

            {/* Thrusters */}
            <ellipse cx="40" cy="112" rx="3.5" ry="10" fill="#a855f7" filter="url(#neon)" opacity="0.8">
              <animate attributeName="ry" values="10;20;10" dur="0.15s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="60" cy="112" rx="3.5" ry="10" fill="#06b6d4" filter="url(#neon)" opacity="0.8">
              <animate attributeName="ry" values="10;20;10" dur="0.2s" repeatCount="indefinite" />
            </ellipse>

            {/* Antenna */}
            <line x1="50" y1="20" x2="50" y2="-4" stroke="#475569" strokeWidth="2.5" />
            <circle cx="50" cy="-4" r="5" filter="url(#neon)" fill={stateColor}>
              <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" />
            </circle>
            <line x1="50" y1="20" x2="35" y2="5" stroke="#475569" strokeWidth="1.5" />
            <circle cx="35" cy="5" r="3" fill={isActive ? '#f43f5e' : '#64748b'} />

            {/* Head */}
            <rect x="18" y="16" width="64" height="48" rx="16" fill="url(#bodyGrad)" stroke={stateColor} strokeWidth="2" />
            <rect x="23" y="21" width="54" height="36" rx="10" fill="#020617" stroke="#1e293b" strokeWidth="1" />

            {/* Scan line */}
            <line x1="24" y1="22" x2="76" y2="22" stroke={`${stateColor}55`} strokeWidth="1.5" filter="url(#neon)">
              <animate attributeName="y1" values="22;54;22" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="y2" values="22;54;22" dur="2.5s" repeatCount="indefinite" />
            </line>

            {/* Eyes tracking mouse */}
            <g style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}>
              <ellipse cx="38" cy="36" rx="8" ry="10" fill="#22d3ee" filter="url(#neon)">
                <animate attributeName="ry" values="10;1;10" dur="4s" repeatCount="indefinite" begin="0.3s" />
              </ellipse>
              <circle cx="38" cy="36" r="3.5" fill="#fff" />
              <circle cx={38 + mousePos.x * 0.3} cy={36 + mousePos.y * 0.3} r="1.5" fill="#000" />

              <ellipse cx="62" cy="36" rx="8" ry="10" fill="#22d3ee" filter="url(#neon)">
                <animate attributeName="ry" values="10;1;10" dur="4s" repeatCount="indefinite" begin="0.7s" />
              </ellipse>
              <circle cx="62" cy="36" r="3.5" fill="#fff" />
              <circle cx={62 + mousePos.x * 0.3} cy={36 + mousePos.y * 0.3} r="1.5" fill="#000" />
            </g>

            {/* Mouth — changes per state */}
            <g transform="translate(50,50)">
              {robotState === 'speaking' && (
                <path d="M -12 0 Q 0 10 12 0" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#neon)">
                  <animate attributeName="d" values="M -12 0 Q 0 10 12 0; M -12 0 Q 0 -5 12 0; M -12 0 Q 0 10 12 0" dur="0.2s" repeatCount="indefinite" />
                </path>
              )}
              {robotState === 'listening' && (
                <ellipse cx="0" cy="0" rx="8" ry="5" fill="none" stroke="#ec4899" strokeWidth="2.5" filter="url(#neon)">
                  <animate attributeName="ry" values="5;9;5" dur="0.5s" repeatCount="indefinite" />
                </ellipse>
              )}
              {robotState === 'thinking' && (
                <g>
                  {[-8, 0, 8].map((x, i) => (
                    <circle key={i} cx={x} cy="0" r="2" fill="#f59e0b">
                      <animate attributeName="cy" values="0;-4;0" dur="0.6s" repeatCount="indefinite" begin={`${i*0.15}s`} />
                    </circle>
                  ))}
                </g>
              )}
              {(robotState === 'idle' || robotState === 'greeting') && (
                <path d="M -10 -1 Q 0 7 10 -1" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}
            </g>

            {/* Neck */}
            <rect x="42" y="64" width="16" height="8" rx="2" fill="#334155" />

            {/* Body */}
            <path d="M 24 72 L 76 72 L 82 108 L 18 108 Z" fill="url(#bodyGrad)" stroke={stateColor} strokeWidth="2" />

            {/* Core reactor */}
            <circle cx="50" cy="90" r="12" fill={stateColor} filter="url(#neon)" opacity="0.85">
              <animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <polygon points="50,83 56,94 44,94" fill="#fff" opacity="0.9" />

            {/* Arms */}
            <g style={{ transformOrigin: '24px 78px', transform: robotState === 'speaking' ? 'rotate(-20deg)' : robotState === 'listening' ? 'rotate(-35deg)' : 'rotate(0deg)', transition: 'transform 0.5s ease' }}>
              <path d="M 22 78 C 8 82 -2 96 4 105" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="4" cy="105" r="4" fill="#a855f7" filter="url(#neon)" />
            </g>
            <g style={{ transformOrigin: '76px 78px', transform: robotState === 'speaking' ? 'rotate(20deg)' : robotState === 'listening' ? 'rotate(35deg)' : 'rotate(0deg)', transition: 'transform 0.5s ease' }}>
              <path d="M 78 78 C 92 82 102 96 96 105" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="96" cy="105" r="4" fill="#22d3ee" filter="url(#neon)" />
            </g>
          </svg>
        </div>

        {/* Mic badge */}
        <div
          className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg transition-all duration-300 ${
            robotState === 'listening'
              ? 'bg-pink-500 scale-110'
              : robotState === 'speaking'
              ? 'bg-cyan-500 scale-110'
              : 'bg-gradient-to-br from-cyan-500 to-purple-600'
          }`}
        >
          {robotState === 'listening'
            ? <MicOff className="w-4 h-4 text-white animate-pulse" />
            : robotState === 'speaking'
            ? <Volume2 className="w-4 h-4 text-white" />
            : <Mic className="w-4 h-4 text-white" />
          }
        </div>

        {/* Listening pulse ring */}
        {robotState === 'listening' && (
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-pink-400 animate-ping opacity-50 pointer-events-none" />
        )}
      </div>

      {/* ── Bottom label ─────────────────────────────────────────────────── */}
      <div className="mt-1 text-center">
        <span className="font-mono text-[9px] tracking-widest uppercase text-white/30">
          {isActive ? 'tap to stop' : 'tap to talk'}
        </span>
      </div>
    </div>
  );
};

export default ProjectExplainer;
