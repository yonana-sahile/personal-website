import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Minimize2, Send, Cpu, Loader2, Sparkles } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'System terminal online. How can I assist with your query regarding Yonas?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userText };

    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // 🔁 Updated to your Django AI backend
      const response = await fetch('http://localhost:8000/api/chat/text/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `[ERROR]: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: '[ERROR]: Connection refused.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-8 right-8 z-50 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Animated glowing aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>

            {/* Button body (Pill shape) */}
            <div className="relative flex items-center px-6 py-3 bg-[#030308]/90 backdrop-blur-2xl rounded-full border border-cyber-blue/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.15)] overflow-hidden">

              {/* Shimmer effect traversing the button */}
              <motion.div
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />

              {/* Icon container with spinning gradient ring */}
              <div className="relative flex items-center justify-center mr-4">
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute -inset-3 rounded-full border border-dashed border-cyber-blue/50 pointer-events-none"
                 />
                 <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 relative" />
                 {/* Inner glowing dot */}
                 <div className="absolute inset-0 bg-cyber-blue rounded-full blur-md opacity-60 animate-pulse z-0"></div>
              </div>

              {/* Text Area */}
              <div className="flex flex-col items-start leading-none whitespace-nowrap pt-0.5">
                <span className="font-mono text-[9px] text-cyber-blue uppercase tracking-[0.3em] font-bold mb-1 opacity-80">
                  System Agent
                </span>
                <div className="flex items-center gap-[2px]">
                  <motion.span
                    animate={{
                      color: ["#00f0ff", "#9d00ff", "#ff0055", "#00ff9d", "#00f0ff"],
                      textShadow: ["0 0 5px #00f0ff", "0 0 15px #9d00ff", "0 0 5px #ff0055", "0 0 15px #00ff9d", "0 0 5px #00f0ff"]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="font-display font-black text-[14px]"
                  >
                    A
                  </motion.span>
                  <motion.span
                    animate={{
                      color: ["#ff0055", "#00ff9d", "#00f0ff", "#9d00ff", "#ff0055"],
                      textShadow: ["0 0 5px #ff0055", "0 0 15px #00ff9d", "0 0 5px #00f0ff", "0 0 15px #9d00ff", "0 0 5px #ff0055"]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    className="font-display font-black text-[14px] ml-[1px] mr-1.5"
                  >
                    I
                  </motion.span>
                  <motion.span
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: "linear-gradient(90deg, #00f0ff, #9d00ff, #ff0055, #00ff9d, #00f0ff)",
                      backgroundSize: '200% auto'
                    }}
                    className="bg-clip-text text-transparent font-sans text-[13px] font-extrabold tracking-[0.2em] uppercase drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]"
                  >
                    Assistance
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[360px] h-[500px] max-h-[80vh] flex flex-col bg-cyber-dark/95 backdrop-blur-xl border border-cyber-blue/30 rounded-xl overflow-hidden neon-box-blue shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyber-blue/20 bg-cyber-blue/5">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-cyber-blue rounded bg-cyber-blue/10">
                  <Sparkles className="w-4 h-4 text-cyber-blue" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">AI_Agent_v1</span>
                  <span className="flex items-center gap-1 text-[9px] font-mono text-cyber-green uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-cyber-pink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scanlines-overlay">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg font-mono text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-light'
                        : 'bg-black/40 border border-cyber-purple/30 text-cyber-light'
                    }`}
                  >
                    {msg.role === 'model' && <span className="text-cyber-purple block mb-1 font-bold">SYS&gt;</span>}
                    {msg.role === 'user' && <span className="text-cyber-blue block mb-1 font-bold">USR&gt;</span>}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-lg font-mono text-xs leading-relaxed bg-black/40 border border-cyber-purple/30 text-cyber-purple flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-cyber-blue/20 bg-black/40 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyber-blue/50" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type command..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-cyber-light placeholder:text-cyber-light/30 focus:border-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="p-2 rounded bg-cyber-blue/10 text-cyber-blue hover:bg-cyber-blue hover:text-black hover:neon-box-blue transition-all disabled:opacity-50 disabled:hover:bg-cyber-blue/10 disabled:hover:text-cyber-blue disabled:hover:shadow-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
