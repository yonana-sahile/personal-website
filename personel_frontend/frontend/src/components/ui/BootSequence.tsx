import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function BootSequence() {
  const [lines, setLines] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const bootLines = [
    "BIOS Date 06/28/26 08:44:11 Ver 08.00.15",
    "CPU: Cybernetic Quantum Processor",
    "Speed : 4.8 GHz",
    "Press DEL to run Setup",
    "Press F11 for BBS POPUP",
    "Initializing Neural Interface...",
    "Loading Main Modules... OK",
    "Decrypting User Data... OK",
    "Bypassing Security Protocols... SUCCESS",
    "CONNECTION ESTABLISHED."
  ];

  useEffect(() => {
    // Check if already booted in this session
    if (sessionStorage.getItem('hasBooted')) {
      setIsVisible(false);
      return;
    }

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setLines(prev => [...prev, bootLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsDone(true);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('hasBooted', 'true');
        }, 1500);
      }
    }, 200); // Fast typing speed

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[100001] bg-cyber-dark flex flex-col justify-end p-8 md:p-16 font-mono text-cyber-green text-sm md:text-base cursor-none"
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-50 z-10" />

        <div className="max-w-4xl relative z-20">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-1 text-cyber-green drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]"
            >
              {line}
            </motion.div>
          ))}
          {!isDone && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-2.5 h-4 bg-cyber-green mt-1"
            />
          )}
          {isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-xl md:text-3xl text-cyber-blue font-bold drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-pulse"
            >
              ACCESS GRANTED_
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
