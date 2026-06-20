import { motion } from 'motion/react';
import { Menu, X, Terminal, ScanEye } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { name: 'INITIALIZE', href: '#about' },
  { name: 'PROTOCOLS', href: '#skills' },
  { name: 'DIRECTIVES', href: '#projects' },
  { name: 'SECURE_COMMS', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-blue/20 py-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded border border-cyber-blue flex items-center justify-center neon-box-blue overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cyber-blue/20"
              animate={{ y: ['100%', '-100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <ScanEye className="w-5 h-5 text-cyber-blue relative z-10 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col hidden md:flex">
            <span className="font-display font-bold text-xl tracking-widest text-white uppercase group-hover:text-cyber-blue transition-colors">
              Yonas<span className="text-cyber-blue">.</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-cyber-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
              Terminal Active
            </span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative px-3 py-2 text-[11px] font-mono tracking-[0.2em] text-white/70 hover:text-white transition-colors group"
            >
              <span className="relative z-10">{item.name}</span>
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-cyber-blue rounded w-0 group-hover:w-full transition-all duration-300"
              />
              <div className="absolute inset-0 bg-cyber-blue/10 rounded scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 blur-sm" />
            </motion.a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-cyber-blue border border-cyber-blue/30 rounded neon-box-blue"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-blue/30 overflow-hidden"
        >
          <div className="flex flex-col px-6 py-6 gap-6">
            {navItems.map((item, i) => (
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono tracking-[0.2em] text-cyber-blue hover:text-white flex items-center gap-3"
              >
                <Terminal className="w-4 h-4" />
                {item.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
