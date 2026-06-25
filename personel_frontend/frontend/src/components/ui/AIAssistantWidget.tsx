import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Send, Loader2, Sparkles, RotateCcw, Zap } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
};

// ─── Quick-action chips shown at start ───────────────────────────────────────
const QUICK_CHIPS = [
  { label: '👨‍💻 Who is Yonas?',     query: 'Who is Yonas Sahile?' },
  { label: '🛠️ Skills',              query: 'What are his technical skills?' },
  { label: '🚀 Projects',            query: 'What projects has he built?' },
  { label: '📬 Contact',             query: 'How can I contact Yonas?' },
  { label: '⭐ Why hire him?',        query: 'Why should I hire Yonas?' },
  { label: '🌍 Languages',           query: 'What languages does Yonas speak?' },
];

// ─── Rich text renderer ───────────────────────────────────────────────────────
// Parses **bold**, *italic*, • bullets, numbered lists, ━ dividers, and line breaks
function RichText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-[3px]">
      {lines.map((line, i) => {
        // Horizontal divider
        if (/^━+$/.test(line.trim())) {
          return <hr key={i} className="border-cyber-blue/20 my-1" />;
        }

        // Empty line → small spacer
        if (line.trim() === '') {
          return <div key={i} className="h-1" />;
        }

        // Parse inline bold (**text**) and italic (*text*)
        const parseInline = (str: string) => {
          const parts: React.ReactNode[] = [];
          const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
          let last = 0;
          let match;
          let idx = 0;
          while ((match = regex.exec(str)) !== null) {
            if (match.index > last) {
              parts.push(<span key={idx++}>{str.slice(last, match.index)}</span>);
            }
            if (match[2]) {
              parts.push(
                <span key={idx++} className="text-cyber-blue font-bold">
                  {match[2]}
                </span>
              );
            } else if (match[3]) {
              parts.push(
                <span key={idx++} className="text-cyber-purple italic">
                  {match[3]}
                </span>
              );
            }
            last = match.index + match[0].length;
          }
          if (last < str.length) parts.push(<span key={idx++}>{str.slice(last)}</span>);
          return parts;
        };

        // Bullet point
        if (line.startsWith('• ') || line.startsWith('* ')) {
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1">
              <span className="text-cyber-blue mt-[2px] shrink-0 text-[10px]">▸</span>
              <span>{parseInline(line.slice(2))}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = line.match(/^(\d+\.\s)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1">
              <span className="text-cyber-purple shrink-0 font-bold">{numMatch[1]}</span>
              <span>{parseInline(line.slice(numMatch[1].length))}</span>
            </div>
          );
        }

        // Regular line
        return (
          <div key={i} className="leading-relaxed">
            {parseInline(line)}
          </div>
        );
      })}
    </div>
  );
}

// ─── Typing indicator dots ────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyber-purple"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AIAssistantWidget() {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "👋 **Hey there!** I'm Yonas's AI assistant.\n\nI can tell you everything about his **skills**, **projects**, **experience**, and more.\n\nWhat would you like to know? 😊",
    },
  ]);
  const [inputVal, setInputVal]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef            = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen, scrollToBottom]);

  // ── Send a message ──────────────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowChips(false);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    const typingMsg: Message = { id: 'typing', role: 'model', text: '', isTyping: true };

    setMessages(prev => [...prev, userMsg, typingMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/text/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await response.json();
      const replyText = response.ok ? data.text : `⚠️ ${data.error || 'Something went wrong.'}`;

      // Replace typing indicator with real message
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        { id: Date.now().toString(), role: 'model', text: replyText },
      ]);
    } catch {
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'typing'),
        {
          id: Date.now().toString(),
          role: 'model',
          text: '⚠️ **Connection error.**\n\nMake sure the backend server is running at `localhost:8000`.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
    setInputVal('');
  };

  const handleChip = (query: string) => {
    sendMessage(query);
  };

  const handleReset = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: "👋 **Hey there!** I'm Yonas's AI assistant.\n\nI can tell you everything about his **skills**, **projects**, **experience**, and more.\n\nWhat would you like to know? 😊",
      },
    ]);
    setShowChips(true);
    setInputVal('');
  };

  return (
    <>
      {/* ── Floating Action Button ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-8 right-8 z-50 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Glowing aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />

            {/* Pill button */}
            <div className="relative flex items-center px-6 py-3 bg-[#030308]/90 backdrop-blur-2xl rounded-full border border-cyber-blue/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.15)] overflow-hidden">
              {/* Shimmer */}
              <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />

              {/* Icon */}
              <div className="relative flex items-center justify-center mr-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-3 rounded-full border border-dashed border-cyber-blue/50 pointer-events-none"
                />
                <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 relative" />
                <div className="absolute inset-0 bg-cyber-blue rounded-full blur-md opacity-60 animate-pulse z-0" />
              </div>

              {/* Label */}
              <div className="flex flex-col items-start leading-none whitespace-nowrap pt-0.5">
                <span className="font-mono text-[9px] text-cyber-blue uppercase tracking-[0.3em] font-bold mb-1 opacity-80">
                  System Agent
                </span>
                <div className="flex items-center gap-[2px]">
                  {['A', 'I'].map((letter, i) => (
                    <motion.span
                      key={letter}
                      animate={{
                        color: i === 0
                          ? ['#00f0ff', '#9d00ff', '#ff0055', '#00ff9d', '#00f0ff']
                          : ['#ff0055', '#00ff9d', '#00f0ff', '#9d00ff', '#ff0055'],
                        textShadow: i === 0
                          ? ['0 0 5px #00f0ff', '0 0 15px #9d00ff', '0 0 5px #ff0055', '0 0 15px #00ff9d', '0 0 5px #00f0ff']
                          : ['0 0 5px #ff0055', '0 0 15px #00ff9d', '0 0 5px #00f0ff', '0 0 15px #9d00ff', '0 0 5px #ff0055'],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                      className={`font-display font-black text-[14px] ${i === 1 ? 'ml-[1px] mr-1.5' : ''}`}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  <motion.span
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #00f0ff, #9d00ff, #ff0055, #00ff9d, #00f0ff)',
                      backgroundSize: '200% auto',
                    }}
                    className="bg-clip-text text-transparent font-sans text-[13px] font-extrabold tracking-[0.2em] uppercase"
                  >
                    Assistance
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Window ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[380px] h-[560px] max-h-[88vh] flex flex-col bg-[#050510]/97 backdrop-blur-xl border border-cyber-blue/25 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.08),0_32px_64px_rgba(0,0,0,0.6)]"
          >

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-cyber-blue/8 via-cyber-purple/5 to-transparent shrink-0">
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent" />

              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyber-blue/30 to-cyber-purple/30 border border-cyber-blue/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyber-blue" />
                  </div>
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyber-green border-2 border-[#050510] animate-pulse" />
                </div>

                <div>
                  <p className="font-mono text-[11px] font-bold text-white tracking-wider">
                    Yonas AI Assistant
                  </p>
                  <p className="font-mono text-[9px] text-cyber-green/80 tracking-widest uppercase flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> Online · Powered by AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Reset button */}
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-white/30 hover:text-cyber-blue hover:bg-cyber-blue/10 transition-all duration-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-cyber-pink hover:bg-cyber-pink/10 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages ─────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: index === messages.length - 1 ? 0 : 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* AI avatar */}
                  {msg.role === 'model' && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 border border-cyber-blue/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-cyber-blue" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl font-mono text-[11px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-cyber-blue/20 to-cyber-blue/10 border border-cyber-blue/30 text-white px-3 py-2.5 rounded-tr-sm'
                        : 'bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/8 text-white/90 px-3 py-2.5 rounded-tl-sm'
                    }`}
                  >
                    {msg.isTyping ? (
                      <TypingDots />
                    ) : msg.role === 'model' ? (
                      <RichText text={msg.text} />
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyber-blue/30 to-cyber-purple/20 border border-cyber-blue/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Terminal className="w-3 h-3 text-cyber-blue" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* ── Quick-action chips ────────────────────────────────────── */}
              <AnimatePresence>
                {showChips && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="flex flex-wrap gap-1.5 mt-1"
                  >
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip.query}
                        onClick={() => handleChip(chip.query)}
                        className="px-2.5 py-1.5 rounded-lg border border-cyber-blue/25 bg-cyber-blue/5 text-[10px] font-mono text-cyber-blue/80 hover:bg-cyber-blue/15 hover:border-cyber-blue/50 hover:text-cyber-blue transition-all duration-200 whitespace-nowrap"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input bar ────────────────────────────────────────────────── */}
            <div className="shrink-0 px-3 pb-3 pt-2 border-t border-white/5 bg-black/20">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 focus-within:border-cyber-blue/40 focus-within:bg-cyber-blue/[0.04] transition-all duration-200"
              >
                <Terminal className="w-3.5 h-3.5 text-cyber-blue/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask anything about Yonas..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] text-white/80 placeholder:text-white/25 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputVal.trim()}
                  className="w-7 h-7 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 text-cyber-blue flex items-center justify-center hover:bg-cyber-blue hover:text-black transition-all duration-200 disabled:opacity-30 disabled:hover:bg-cyber-blue/20 disabled:hover:text-cyber-blue shrink-0"
                >
                  {isLoading
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Send className="w-3.5 h-3.5" />
                  }
                </button>
              </form>

              {/* Footer hint */}
              <p className="text-center font-mono text-[9px] text-white/15 mt-2 tracking-wider">
                AI · Yonas Sahile Portfolio · Powered by Python NLP
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
