import React, { useState, useRef, useEffect } from 'react';
import { Globe as GlobeIcon, Play as PlayIcon, Pause as PauseIcon } from 'lucide-react';

// Audio Context Helper – ensure it's created but not started
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

type Language = 'en' | 'am' | 'om' | 'ti';

const SCRIPTS: Record<Language, { label: string; text: string; lang: string }> = {
    en: {
        label: 'English',
        lang: 'en',
        text: `Greetings. Welcome to Weaver Shield. I am here to present a breakthrough in accessible cybersecurity, developed by Software Engineer Yonas Sahile. Weaver Shield is a comprehensive vulnerability assessment platform designed specifically for the Ethiopian digital infrastructure. Unlike standard scanners, we combine a visually immersive galaxy interface with powerful backend engines.
        Our system allows you to perform passive reconnaissance or
        active penetration tests and generate professional PDF reports. Thank you for
         using Weaver Shield.`
    },
    am: {
        label: 'Amharic',
        lang: 'am',
        text: `ሰላም! ዲጂታል ደህንነት የሚጀምረው በንቃት መከታተል ነው! ይህ በሳይበር ደህንነት መሃንዲስ ዮናስ ሳህለ የተሠራው ዊቨር ሺልድ፣ ለአገራችን የሚመጥን ድንቅ የመከላከያ ጋሻ መድረክ ነው። እኛ ዝም ብለን ክፍተቶችን አንለይም፤ የአገራችንን ዲጂታል ሉዓላዊነት እናረጋግጣለን! አስደናቂው የጋላክሲ ምስላዊ እይታ በራስ-መተማመንን ይሰጣል። አሁኑኑ ድረ-ገጾችን በመፈተሽ፣ የደህንነት ክፍተቶችን በመለየትና ፕሮፌሽናል ሪፖርቶችን በማዘጋጀት ድርጅትዎን ከጥቃት ይጠብቁ! አብረን እንልቀቅ፤ ዛሬውኑ ሙከራ ይጀምሩ!`
    },
    om: {
        label: 'Afaan Oromoo',
        lang: 'om',
        text: `Akkam jirtu, gootota keenya! Nageenyi saayibarii gocha qorannoo irraa jalqaba. Pilaatfoormiin Weaver Shield kun, rakkoolee nageenya saayibarii Itiyoophiyaaf fala fiduuf kan hojjetame dha. Meeshaa cimaa fi haasawaa kanaan, weeb-saayitiilee keessan haala ammayyaawaan sakatta’uun balaarraa ittisaa! Gabaasa gadi fagoo argachuun dandeettii keessan guddisaa. Koottaa waliin taanee nageenya keenya haa mirkaneessinu! Ammuma jalqabaa!`
    },
    ti: {
        label: 'Tigrinya',
        lang: 'ti',
        text: `ሰላም የሕዋት! ዲጂታል ጸጥታ ብንቕሓት እዩ ዝጅምር። እዚ መድረኽ እዚ ንናይ ኢትዮጵያ ዲጂታል ጸጥታን ዋልታን ተባሂሉ በቲ ወናሚ ኢንጂነር ዮናስ ሳህለ ዝተዳለወ እሙን ዋልታ እዩ። ናይ ጸጥታ ክፍተታት ብምፍታሽ ሓለዋኹም ኣደልድሉ። ኩልና ብሓባር ንናይ ጸጥታ ሉኣላውነትና ክንሰርሕ ኢና። ሕጂ ፈትኑ!`
    }
};

const MOTIVATIONAL_BUBBLES = [
    "Ready to secure the enterprise? Let's make it bulletproof! 🛡️",
    "Ethiopian Digital Sovereignty is our master key! 🇪🇹",
    "Did you know? Visual space scanning makes defense intuitive & delightful! 🌌",
    "Click me to listen to my voice of absolute confidence! 🎙️",
    "Yonas Sahile's advanced logic is sweeping for vulnerabilities. System secured! 🚀",
    "Enterprise-ready cyber intelligence at your fingertips. Stand tall! 💪",
    "Welcome! I am your energetic protective companion: Cosmo-Bot! 🤖"
];

const ProjectExplainer: React.FC = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [selectedLang, setSelectedLang] = useState<Language>('en');
    const [showMenu, setShowMenu] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeBubble, setActiveBubble] = useState(0);
    const [tickled, setTickled] = useState(false);

    // Track state of energy for extra high motivation animations
    const [energyLevel, setEnergyLevel] = useState<'calm' | 'talking' | 'supercharged'>('calm');

    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cycle speech bubbles occasionally for high customer motivation
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isSpeaking) {
                setActiveBubble((prev) => (prev + 1) % MOTIVATIONAL_BUBBLES.length);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [isSpeaking]);

    // Track mouse dynamic movement for eyeball offset coords
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - (rect.left + rect.width / 2)) / 15;
                const y = (e.clientY - (rect.top + rect.height / 2)) / 15;
                setMousePos({
                    x: Math.max(-8, Math.min(8, x)),
                    y: Math.max(-8, Math.min(8, y))
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Clean up audio source on unmount
    useEffect(() => {
        return () => {
            if (sourceRef.current) {
                try {
                    sourceRef.current.stop();
                } catch(e){}
            }
        };
    }, []);

    const stopAudio = () => {
        if (sourceRef.current) {
            try {
                sourceRef.current.stop();
            } catch (e) {}
            sourceRef.current = null;
        }
        setIsSpeaking(false);
        setEnergyLevel('calm');
    };

    const playExplanation = async () => {
        if (isSpeaking) {
            stopAudio();
            return;
        }

        setIsLoading(true);
        setEnergyLevel('talking');

        try {
            const script = SCRIPTS[selectedLang];

            // Resume AudioContext if suspended (required for current browser rules)
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            // Fetch CSRF token securely
            const getCSRFToken = () => {
                const match = document.cookie.match(/csrftoken=([\w-]+)/);
                return match ? match[1] : "";
            };

            const res = await fetch('/api/api/gtts-robot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify({ text: script.text, lang: script.lang })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Server error speaking.');
            }

            const data = await res.json();
            if (!data.audio_base64) throw new Error("No speech transmission received.");

            // Base64 to ArrayBuffer decode sequence
            const binaryString = atob(data.audio_base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);

            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.onended = () => {
                setIsSpeaking(false);
                setEnergyLevel('calm');
            };
            source.start();

            sourceRef.current = source;
            setIsSpeaking(true);
            setEnergyLevel('supercharged');

        } catch (err: any) {
            console.error('TTS speech error:', err);
            // Non-blocking alert fallback if needed
            setEnergyLevel('calm');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTickle = () => {
        setTickled(true);
        setEnergyLevel('supercharged');
        setActiveBubble(Math.floor(Math.random() * MOTIVATIONAL_BUBBLES.length));
        setTimeout(() => {
            setTickled(false);
            if (!isSpeaking) setEnergyLevel('calm');
        }, 1200);
    };

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed bottom-2 left-6 z-[60] print:hidden select-none select-none transition-all duration-300"
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* Dynamic Motivation Speech Bubble */}
            <div className={`absolute bottom-[115%] left-1/2 -translate-x-1/2 mb-2 w-72 bg-gray-900/95 backdrop-blur-md border ${isSpeaking ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-purple-500/50 shadow-xl'} p-4 rounded-2xl transition-all duration-500 transform ${showMenu || isSpeaking || tickled ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-6 pointer-events-none'}`}>
                {/* Motivational Glow Header */}
                <div className="flex items-center justify-between mb-1.5 border-b border-gray-800 pb-1.5">
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpeaking ? 'bg-cyan-400' : 'bg-purple-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isSpeaking ? 'bg-cyan-500' : 'bg-purple-500'}`}></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#a855f7] font-mono">
                            {isSpeaking ? 'TRANSMITTING CYBER ADVICE' : 'COSMO INTELLIGENCE'}
                        </span>
                    </div>
                    {isSpeaking ? (
                        <div className="flex gap-0.5 items-end h-3">
                            <div className="w-0.5 bg-cyan-400 animate-[music-bar_0.5s_ease-in-out_infinite] h-2"></div>
                            <div className="w-0.5 bg-cyan-400 animate-[music-bar_0.4s_ease-in-out_0.1s_infinite] h-3"></div>
                            <div className="w-0.5 bg-cyan-400 animate-[music-bar_0.6s_ease-in-out_0.2s_infinite] h-1.5"></div>
                        </div>
                    ) : (
                        <span className="text-[9px] text-gray-500 font-mono">STANDBY</span>
                    )}
                </div>

                {/* Bubble Text */}
                <p className={`text-xs text-slate-100 leading-relaxed font-sans first-letter:uppercase italic transition-all duration-300 ${isSpeaking ? 'text-cyan-200' : ''}`}>
                    {isSpeaking
                        ? `"${SCRIPTS[selectedLang].text.substring(0, 160)}..."`
                        : `"${MOTIVATIONAL_BUBBLES[activeBubble]}"`
                    }
                </p>

                {/* Subtitle / Footer inside bubble */}
                <div className="mt-2 text-[10px] text-slate-400 flex justify-between items-center font-mono">
                    <span>Lang: <strong className="text-cyan-400 uppercase">{selectedLang}</strong></span>
                    {isSpeaking && (
                        <span className="text-[#a855f7] animate-pulse">Speaking...</span>
                    )}
                </div>
            </div>

            {/* Language Selection & Audio Fire Station */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-[175px] bg-[#0c0e17]/95 backdrop-blur-lg border border-cyan-500/50 p-3 rounded-2xl shadow-3xl transition-all duration-300 transform origin-bottom ${showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                            <GlobeIcon className="w-3.5 h-3.5" /> Language Signal
                        </span>
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                            {selectedLang}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(SCRIPTS) as Language[]).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    stopAudio();
                                    setSelectedLang(lang);
                                }}
                                className={`text-[11px] font-bold px-2 py-2 rounded-xl border transition-all duration-200 ${selectedLang === lang ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]' : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                {SCRIPTS[lang].label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={playExplanation}
                        className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl ${isSpeaking ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white hover:shadow-cyan-500/30'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-spin w-3 h-3 border-2 border-white/50 border-t-white rounded-full" />
                                <span>Tuning Core...</span>
                            </div>
                        ) : isSpeaking ? (
                            <> <PauseIcon className="w-3.5 h-3.5 text-white" /> Stop Broadcast </>
                        ) : (
                            <> <PlayIcon className="w-3.5 h-3.5 text-white" /> Explain Project </>
                        )}
                    </button>
                </div>
                {/* Speech Bubble Stem Anchor */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#0c0e17]"></div>
            </div>

            {/* Micro Interaction Tooltip Label */}
            <div className="absolute top-1/2 -right-24 transform -translate-y-1/2 bg-cyan-500/10 border border-cyan-500/30 text-[9px] uppercase tracking-wider font-extrabold text-cyan-300 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300">
                Click to Talk! 🎙️
            </div>

            {/* Robot Core Body Container */}
            <div
                className={`relative group cursor-pointer transition-transform duration-300 ${tickled ? 'animate-bounce' : ''}`}
                onClick={handleTickle}
                title="Click me for supercharged motivation!"
            >
                {/* Dynamic futuristic shadow and glow behind him */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/30 blur-2xl transition-all duration-700 ${energyLevel === 'supercharged' ? 'scale-125 opacity-100' : 'scale-90 opacity-60 group-hover:opacity-90'}`} />

                {/* Animated Character Layout with Floating/Hover CSS class */}
                <div className={`w-28 h-32 float-anim transition-all duration-750 ${isSpeaking ? 'scale-110 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'hover:scale-105 hover:rotate-2'}`}>
                    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-3xl filter overflow-visible">
                        <defs>
                            <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1e293b" />
                                <stop offset="50%" stopColor="#0f172a" />
                                <stop offset="100%" stopColor="#020617" />
                            </linearGradient>
                            <linearGradient id="hologramScan" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
                                <stop offset="50%" stopColor="rgba(168,85,247,0.1)" />
                                <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                            </linearGradient>
                            <filter id="neonCore">
                                <feGaussianBlur stdDeviation="3" result="glow"/>
                                <feMerge>
                                    <feMergeNode in="glow"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Floating Shadow Base */}
                        <ellipse cx="50" cy="118" rx="28" ry="7" fill="rgba(0,0,0,0.6)" className="shadow-pulsing transition-all duration-500" />

                        {/* Left & Right Rocket Thruster Trails */}
                        <g className="opacity-70">
                            <ellipse cx="40" cy="110" rx="4" ry="12" fill="#a855f7" filter="url(#neonCore)">
                                <animate attributeName="ry" values="12;24;12" dur="0.15s" repeatCount="indefinite" />
                            </ellipse>
                            <ellipse cx="60" cy="110" rx="4" ry="12" fill="#06b6d4" filter="url(#neonCore)">
                                <animate attributeName="ry" values="12;24;12" dur="0.2s" repeatCount="indefinite" />
                            </ellipse>
                        </g>

                        {/* Upper Antenna with double glowing nodes */}
                        <g className="transition-transform duration-300">
                            <line x1="50" y1="20" x2="50" y2="-4" stroke="#475569" strokeWidth="2.5" />
                            <circle cx="50" cy="-4" r="5" fill={isSpeaking ? "#06b6d4" : "#a855f7"} filter="url(#neonCore)">
                                <animate attributeName="r" values="4;7;4" dur="1s" repeatCount="indefinite" />
                            </circle>
                            <line x1="50" y1="20" x2="35" y2="5" stroke="#475569" strokeWidth="1.5" />
                            <circle cx="35" cy="5" r="3.5" fill={tickled ? "#f43f5e" : "#64748b"} />
                        </g>

                        {/* Head Body Structure (Glow contour) */}
                        <rect x="18" y="16" width="64" height="48" rx="16" fill="url(#robotBodyGrad)" stroke={isSpeaking ? "#22d3ee" : "#475569"} strokeWidth="2.5" />

                        {/* Face Screen with subtle tech grid lines */}
                        <rect x="23" y="21" width="54" height="36" rx="10" fill="#020617" stroke="#1e293b" strokeWidth="1" />

                        {/* Interactive Scan Line Sweeper inside screen */}
                        <line x1="24" y1="22" x2="76" y2="22" stroke="rgba(34, 211, 238, 0.45)" strokeWidth="1.5" filter="url(#neonCore)">
                            <animate attributeName="y1" values="22;54;22" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="y2" values="22;54;22" dur="2s" repeatCount="indefinite" />
                        </line>

                        {/* Dynamic Eyes Group (Mouse and Emotion Tracking) */}
                        <g style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }} className="transition-transform duration-200">
                            {/* Left Cyber Eye */}
                            <ellipse cx="38" cy="36" rx="8" ry="10" fill={tickled ? "#ec4899" : "#22d3ee"} filter="url(#neonCore)">
                                <animate attributeName="ry" values="10;1;10" dur="4s" repeatCount="indefinite" begin="0.5s" />
                            </ellipse>
                            <circle cx="38" cy="36" r="3" fill="#ffffff" />

                            {/* Right Cyber Eye */}
                            <ellipse cx="62" cy="36" rx="8" ry="10" fill={tickled ? "#ec4899" : "#22d3ee"} filter="url(#neonCore)">
                                <animate attributeName="ry" values="10;1;10" dur="4s" repeatCount="indefinite" begin="0.7s" />
                            </ellipse>
                            <circle cx="62" cy="36" r="3" fill="#ffffff" />
                        </g>

                        {/* Dynamic Audio Speaker Mouth */}
                        <g transform="translate(50, 48)">
                            {isSpeaking ? (
                                <path d="M -14 0 Q 0 8 14 0" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#neonCore)">
                                    <animate attributeName="d" values="M -14 0 Q 0 10 14 0; M -14 0 Q 0 -6 14 0; M -14 0 Q 0 10 14 0" dur="0.18s" repeatCount="indefinite" />
                                </path>
                            ) : tickled ? (
                                <path d="M -10 -2 Q 0 8 10 -2" stroke="#ec4899" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                            ) : (
                                <rect x="-8" y="-1.5" width="16" height="3" rx="1.5" fill="#a855f7" opacity="0.8" />
                            )}
                        </g>

                        {/* Metal Neck connection */}
                        <rect x="42" y="64" width="16" height="8" rx="2" fill="#334155" />

                        {/* Robust Core Torso Chest Plate */}
                        <path d="M 24 72 L 76 72 L 82 108 L 18 108 Z" fill="url(#robotBodyGrad)" stroke={isSpeaking ? "#22d3ee" : "#334155"} strokeWidth="2.5" />

                        {/* Energetic Heart Matrix (Core Reactor) */}
                        <g transform="translate(50, 90)">
                            <circle cx="0" cy="0" r={isSpeaking ? 14 : tickled ? 16 : 11} fill={tickled ? "#f43f5e" : isSpeaking ? "#22d3ee" : "#a855f7"} filter="url(#neonCore)" opacity="0.9">
                                <animate attributeName="r" values="9;14;9" dur="1.5s" repeatCount="indefinite" />
                            </circle>
                            <polygon points="0,-7 6,4 -6,4" fill="#ffffff" transform={isSpeaking ? "rotate(180)" : ""} className="transition-transform duration-500" />
                        </g>

                        {/* Left Arm with high wave rotation */}
                        <g transform={isSpeaking ? "rotate(-18 24 78)" : tickled ? "rotate(-40 24 78)" : ""} className="transition-all duration-300 origin-[24px_78px]">
                            <path d="M 22 78 C 8 82 -2 96 4 105" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
                            {/* Glowing Left hand emitter */}
                            <circle cx="4" cy="105" r="4.5" fill="#a855f7" filter="url(#neonCore)" />
                        </g>

                        {/* Right Arm waving or raised happily */}
                        <g transform={isSpeaking ? "rotate(22 76 78)" : tickled ? "rotate(45 76 78)" : "rotate(-10 76 78)"} className="transition-all duration-300 origin-[76px_78px]">
                            <path d="M 78 78 C 92 82 102 96 96 105" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
                            {/* Glowing Right hand emitter */}
                            <circle cx="96" cy="105" r="4.5" fill="#22d3ee" filter="url(#neonCore)" />
                        </g>
                    </svg>
                </div>
            </div>

            <style>{`
                /* Soft hovering flight animation */
                @keyframes float-loop {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(1deg);
                    }
                }
                .float-anim {
                    animation: float-loop 3s ease-in-out infinite;
                }

                @keyframes music-bar {
                    0%, 100% { height: 3px; }
                    50% { height: 13px; }
                }
            `}</style>
        </div>
    );
};

export default ProjectExplainer;
