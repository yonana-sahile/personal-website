import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface TerminalTextProps {
  text: string;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export function TerminalText({ text, delay = 0, className = '', cursor = true }: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // fast typing speed

    return () => clearInterval(typingInterval);
  }, [text, started]);

  return (
    <span className={`font-mono ${className}`}>
      {displayedText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className="inline-block w-[0.5em] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
}
