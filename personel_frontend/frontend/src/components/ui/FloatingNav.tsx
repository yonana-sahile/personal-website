import { useState, useEffect } from 'react';

const sections = ['home', 'about', 'skills', 'experience', 'certificates', 'projects', 'contact'];

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const offsetTop = top + window.scrollY;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + element.offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-5 items-center">
      {sections.map((section) => (
        <div key={section} className="relative group flex items-center justify-end">
          <span className="absolute right-8 text-[10px] font-mono tracking-widest text-cyber-blue uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap bg-black/50 px-2 py-1 rounded border border-cyber-blue/30 backdrop-blur-md">
            {section}
          </span>
          <a
            href={`#${section === 'home' ? '' : section}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 border ${
              activeSection === section
                ? 'bg-cyber-blue border-cyber-blue shadow-[0_0_12px_#00f0ff] scale-150'
                : 'bg-transparent border-cyber-light/40 hover:border-cyber-blue hover:bg-cyber-blue/20'
            }`}
            aria-label={`Scroll to ${section}`}
          />
        </div>
      ))}
      {/* Decorative vertical line */}
      <div className="absolute top-0 bottom-0 right-[4.5px] w-[1px] bg-cyber-light/10 -z-10" />
    </div>
  );
}
