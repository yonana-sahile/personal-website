import { motion } from 'motion/react';
import { Menu, X, Terminal, ScanEye, Sun, Moon, Download, Upload, Award, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ViewerScanner } from '../ui/ViewerScanner';
import { CVManagerModal } from '../ui/CVManagerModal';
import { CertificateManagerModal } from '../ui/CertificateManagerModal';
import { DigitalClock } from '../ui/DigitalClock';   // 👈 re-added

const navItems = [
  { name: 'ABOUT', href: '#about' },
  { name: 'PROTOCOLS', href: '#skills' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'CERTS', href: '#certificates' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'CONTACT', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [cvUrl, setCvUrl] = useState('');
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'skills', 'experience', 'certificates', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const offsetTop = top + window.scrollY;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + element.offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Check initial theme
    if (document.documentElement.classList.contains('light')) {
      setIsLightMode(true);
    }

    // Fetch CV URL from Django backend
    fetch('http://localhost:8000/api/cv/')
      .then(res => res.json())
      .then(data => {
        if (data && data.url) {
          setCvUrl(data.url);
        }
      })
      .catch(err => console.error("Failed to fetch cv", err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-cyber-dark/80 backdrop-blur-xl border-b border-cyber-blue/20 py-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'bg-transparent py-8'
      }`}
    >
      <ViewerScanner isOpen={showViewer} onClose={() => setShowViewer(false)} />
      <CVManagerModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} onCVUploaded={(url) => setCvUrl(url)} />
      <CertificateManagerModal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} onCertificateUploaded={() => window.location.reload()} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => setShowViewer(true)}
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
            <span className="font-display font-bold text-xl tracking-widest text-cyber-light uppercase group-hover:text-cyber-blue transition-colors">
              Yonas<span className="text-cyber-blue">.</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-cyber-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
              Terminal Active
            </span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* 🔹 Digital Clock (compact) */}
          <DigitalClock compact />

          {navItems.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative px-3 py-2 text-[11px] font-mono tracking-[0.2em] transition-colors group ${activeSection === item.href.substring(1) ? 'text-cyber-blue' : 'text-cyber-light/70 hover:text-cyber-blue'}`}
            >
              <span className="relative z-10">{item.name}</span>
              <motion.div
                className={`absolute bottom-0 left-0 h-[2px] bg-cyber-blue rounded transition-all duration-300 ${activeSection === item.href.substring(1) ? 'w-full shadow-[0_0_8px_#00f0ff]' : 'w-0 group-hover:w-full'}`}
              />
              <div className={`absolute inset-0 bg-cyber-blue/10 rounded transition-all duration-300 blur-sm ${activeSection === item.href.substring(1) ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
            </motion.a>
          ))}
          <div className="flex items-center gap-2 ml-2">
            {cvUrl && (
              <a
                href={cvUrl}
                download="Yonas_Sahile_CV"
                className="flex items-center gap-2 px-3 py-1.5 border border-cyber-green text-cyber-green text-[10px] font-mono tracking-widest uppercase rounded hover:bg-cyber-green hover:text-black transition-colors neon-box-green"
                title="Download CV"
              >
                <Download className="w-3 h-3" /> CV
              </a>
            )}

            <div className="relative">
              <button
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-cyber-blue text-cyber-blue text-[10px] font-mono tracking-widest uppercase rounded hover:bg-cyber-blue hover:text-black transition-colors neon-box-blue ml-2"
              >
                <Settings className="w-3 h-3" /> ADMIN <ChevronDown className={`w-3 h-3 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAdminMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-cyber-dark/95 backdrop-blur-xl border border-cyber-blue/30 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.1)] overflow-hidden z-50 py-2">
                  <button
                    onClick={() => {
                      setIsCVModalOpen(true);
                      setIsAdminMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-mono tracking-[0.1em] text-cyber-light/70 hover:text-cyber-pink hover:bg-cyber-pink/10 transition-colors text-left"
                  >
                    <Upload className="w-4 h-4" /> Upload CV
                  </button>
                  <button
                    onClick={() => {
                      setIsCertModalOpen(true);
                      setIsAdminMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-mono tracking-[0.1em] text-cyber-light/70 hover:text-cyber-green hover:bg-cyber-green/10 transition-colors text-left"
                  >
                    <Award className="w-4 h-4" /> Upload Cert
                  </button>
                </div>
              )}
            </div>

            <button
               onClick={toggleTheme}
               className="ml-2 p-2 text-cyber-blue hover:text-cyber-pink transition-colors border border-cyber-blue/20 hover:border-cyber-pink/50 rounded-full neon-box-blue hover:neon-box-pink"
               title="Toggle Theme"
             >
               {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          {cvUrl && (
            <a
              href={cvUrl}
              download="Yonas_Sahile_CV"
              className="p-1.5 border border-cyber-green text-cyber-green rounded hover:bg-cyber-green hover:text-black transition-colors neon-box-green"
              title="Download CV"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
             onClick={toggleTheme}
             className="p-1.5 text-cyber-blue hover:text-cyber-pink transition-colors border border-cyber-blue/20 rounded-full"
           >
             {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-cyber-blue border border-cyber-blue/30 rounded neon-box-blue"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-cyber-dark/95 backdrop-blur-xl border-b border-cyber-blue/30 overflow-hidden"
        >
          <div className="flex flex-col px-6 py-6 gap-6">
            {/* 🔹 Digital Clock in mobile menu */}
            <div className="flex justify-center mb-2">
              <DigitalClock compact />
            </div>
            {navItems.map((item, i) => (
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-xs font-mono tracking-[0.2em] flex items-center gap-3 transition-colors ${activeSection === item.href.substring(1) ? 'text-cyber-light bg-cyber-blue/10 px-4 py-2 rounded border-l-2 border-cyber-blue shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]' : 'text-cyber-blue hover:text-cyber-light px-4 py-2'}`}
              >
                <Terminal className="w-4 h-4" />
                {item.name}
              </motion.a>
            ))}

            <div className="h-[1px] bg-cyber-blue/20 w-full my-2"></div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-4"
            >
              <span className="text-[10px] font-mono tracking-[0.3em] text-cyber-light/40 uppercase">Admin Operations</span>
              <button
                onClick={() => {
                  setIsCVModalOpen(true);
                  setIsOpen(false);
                }}
                className="text-xs font-mono tracking-[0.2em] text-cyber-pink hover:text-cyber-light flex items-center gap-3 w-fit"
              >
                <Upload className="w-4 h-4" />
                UPLOAD CV
              </button>
              <button
                onClick={() => {
                  setIsCertModalOpen(true);
                  setIsOpen(false);
                }}
                className="text-xs font-mono tracking-[0.2em] text-cyber-green hover:text-cyber-light flex items-center gap-3 w-fit"
              >
                <Award className="w-4 h-4" />
                UPLOAD CERT
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
