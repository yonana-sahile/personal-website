import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Calendar, Terminal, Cpu, Database, ChevronRight, Activity } from 'lucide-react';
import { useState } from 'react';

const experiences = [
  {
    id: "SYS-ARCH-01",
    role: "Senior Security Architect",
    company: "CyberDyne Systems",
    period: "2024 - Present",
    description: "Leading the global security infrastructure team. Designing quantum-resistant encryption protocols and zero-trust networks for enterprise clients. Spearheaded the transition to fully decentralized authorization nodes, increasing network resilience by 400%.",
    skills: ["Zero-Trust", "Cryptography", "Network Sec", "AWS"],
    status: "ACTIVE_NODE"
  },
  {
    id: "PEN-TEST-02",
    role: "Penetration Tester",
    company: "Neon Matrix Inc.",
    period: "2022 - 2024",
    description: "Conducted advanced red team operations against financial institutions. Developed custom exploitation frameworks and vulnerability assessment tools. Discovered and patched 15+ zero-day vulnerabilities in core banking systems.",
    skills: ["Red Teaming", "Python", "Metasploit", "Reverse Engineering"],
    status: "ARCHIVED"
  },
  {
    id: "SEC-ANA-03",
    role: "Security Analyst",
    company: "Grid Protocols",
    period: "2020 - 2022",
    description: "Monitored global network traffic for anomalous behavior. Responded to active breaches and coordinated incident response efforts across multiple time zones. Automated threat detection using machine learning models.",
    skills: ["SIEM", "Incident Response", "Threat Hunting", "Forensics"],
    status: "ARCHIVED"
  }
];

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-cyber-blue/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center justify-start gap-6"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-cyber-light uppercase tracking-tight flex items-center gap-4">
            <span className="w-12 h-12 rounded bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <span className="text-cyber-blue font-mono text-xl">03</span>
            </span>
            Experience<span className="text-cyber-blue">_</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-cyber-blue via-cyber-purple drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] to-transparent" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 min-h-[500px]">
          {/* Left Column: Terminal Directory */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/3 flex flex-col gap-3 relative z-10"
          >
            <div className="mb-4 flex items-center gap-2 border-b border-cyber-blue/30 pb-2">
              <Terminal className="w-4 h-4 text-cyber-blue" />
              <span className="text-xs font-mono text-cyber-blue tracking-widest uppercase">Select_Data_Node</span>
            </div>

            {experiences.map((exp, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveIndex(index)}
                  className={`relative w-full text-left p-4 rounded-xl font-mono text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-between group overflow-hidden ${
                    isActive
                      ? 'bg-cyber-blue/10 border border-cyber-blue/50 text-cyber-blue shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'bg-black/40 border border-white/5 text-cyber-light/50 hover:bg-black/60 hover:border-cyber-blue/30 hover:text-cyber-light'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-blue shadow-[0_0_10px_#00f0ff]" />}

                  <div className="flex flex-col gap-1 z-10">
                    <span className="font-bold flex items-center gap-2">
                      {isActive && <ChevronRight className="w-4 h-4" />}
                      {exp.company}
                    </span>
                    <span className={`text-[10px] ${isActive ? 'text-cyber-light/80' : 'text-cyber-light/30'}`}>
                      ID: {exp.id}
                    </span>
                  </div>

                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyber-blue animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-white/10'}`} />
                </button>
              );
            })}
          </motion.div>

          {/* Right Column: Experience Details (Terminal Decrypted Data) */}
          <div className="w-full lg:w-2/3 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="glass-panel p-8 md:p-10 rounded-2xl border-cyber-blue/30 shadow-[0_0_30px_rgba(0,240,255,0.05)] h-full flex flex-col relative overflow-hidden group">

                  {/* Decorative background for active panel */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 rounded-full blur-[60px] pointer-events-none" />
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Cpu className="w-32 h-32 text-cyber-blue" />
                  </div>

                  <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                    <Activity className="w-5 h-5 text-cyber-blue animate-pulse" />
                    <span className="text-[10px] font-mono text-cyber-light/50 uppercase tracking-[0.3em]">
                      Status: <span className="text-cyber-blue">{experiences[activeIndex].status}</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyber-light/30 uppercase tracking-widest ml-auto">
                      Decrypted // Level_0{activeIndex + 1}
                    </span>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-cyber-light uppercase tracking-tighter mb-2">
                      {experiences[activeIndex].role}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-cyber-blue font-mono text-xs uppercase tracking-widest mb-8">
                      <span className="flex items-center gap-1.5 bg-cyber-blue/10 px-3 py-1.5 rounded border border-cyber-blue/20">
                        <Briefcase className="w-3.5 h-3.5" />
                        {experiences[activeIndex].company}
                      </span>
                      <span className="flex items-center gap-1.5 bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20 px-3 py-1.5 rounded border">
                        <Calendar className="w-3.5 h-3.5" />
                        {experiences[activeIndex].period}
                      </span>
                    </div>

                    <div className="font-sans text-cyber-light/70 leading-relaxed text-sm md:text-base mb-10 border-l-2 border-cyber-blue/30 pl-4 relative">
                       {experiences[activeIndex].description}
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-cyber-light/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        Loaded_Modules
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {experiences[activeIndex].skills.map((skill, i) => (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + (i * 0.05) }}
                            key={skill}
                            className="text-xs font-mono tracking-widest text-cyber-light uppercase px-4 py-2 bg-black/60 border border-cyber-blue/20 rounded hover:border-cyber-blue/60 hover:bg-cyber-blue/10 transition-colors shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
