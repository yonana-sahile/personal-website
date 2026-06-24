import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { TerminalText } from '../ui/TerminalText';
import { ChevronDown } from 'lucide-react';
import { SolarSystem } from '../ui/SolarSystem';
import { Birds } from '../ui/Birds';
import { MatrixRain } from '../ui/MatrixRain';
import ProjectExplainer from '../ui/ProjectExplainer';

const TypewriterSahile = () => {
  const [text, setText] = useState("S");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = "Sahile";
    let speed = isDeleting ? 100 : 200;

    if (!isDeleting && text === fullText) {
      speed = 2000;
      const timer = setTimeout(() => setIsDeleting(true), speed);
      return () => clearTimeout(timer);
    } else if (isDeleting && text === "S") {
      speed = 500;
      const timer = setTimeout(() => setIsDeleting(false), speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [text, isDeleting]);

  return (
    <span className="block flex drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
      {Array.from(text).map((letter, i) => (
        <motion.span
          key={`${i}-${letter}`}
          animate={{
            textShadow: [
              "0 0 10px rgba(255,255,255,0.4)",
              "0 0 25px rgba(0,240,255,0.9)",
              "0 0 25px rgba(188,19,254,0.9)",
              "0 0 25px rgba(255,0,255,0.9)",
              "0 0 25px rgba(255,0,60,0.9)",
              "0 0 25px rgba(255,140,0,0.9)",
              "0 0 25px rgba(255,215,0,0.9)",
              "0 0 25px rgba(0,255,65,0.9)",
              "0 0 25px rgba(10,239,255,0.9)",
              "0 0 25px rgba(157,78,221,0.9)",
              "0 0 10px rgba(255,255,255,0.4)"
            ],
            color: [
              "#ffffff",
              "#00f0ff",
              "#bc13fe",
              "#ff00ff",
              "#ff003c",
              "#ff8c00",
              "#ffd700",
              "#00ff41",
              "#0aefff",
              "#9d4edd",
              "#ffffff"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "linear"
          }}
          className="inline-block"
        >
          {letter}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="text-cyber-green inline-block ml-1"
      >
        .
      </motion.span>
    </span>
  );
};

export function Hero() {
  const float = {
    y: [-15, 15, -15],
    rotate: [-5, 5, -5],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  };

  const floatReverse = {
    y: [15, -15, 15],
    rotate: [5, -5, 5],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <Birds />
      <ProjectExplainer />
      {/* Animated Background Orbs */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-cyber-blue rounded-full blur-[120px] pointer-events-none z-0" />
      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-cyber-purple rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Full Background Matrix Rain */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{ maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
      >
        <MatrixRain />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-12 gap-12 items-center relative z-10 pt-20">
        <div className="flex flex-col gap-4 md:col-span-7">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-2 mb-6">
             {/* Profile Photo - near beginning */}
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.1, duration: 0.5 }}
               className="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden glass-panel bg-cyber-dark border border-cyber-green/50 neon-box-green shadow-[0_0_50px_rgba(0,255,65,0.3)] z-20 group"
             >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-green to-transparent element-scan z-30 opacity-50"></div>
                <img src="/profile.jpg" alt="Yonas Sahile" className="w-full h-full object-cover filter contrast-[1.1] group-hover:scale-105 transition-all duration-700" />
             </motion.div>

             <div className="flex flex-col">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display font-bold text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none uppercase"
                >
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink pb-2 drop-shadow-lg">Yonas</span>
                  <TypewriterSahile />
                </motion.h1>
             </div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-mono text-cyber-blue"
          >
            &lt;<span className="text-cyber-light">Cyber_Security_Architect</span> /&gt;
          </motion.h2>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-mono text-cyber-pink"
          >
            &lt;<span className="text-cyber-light">Software_Engineer</span> /&gt;
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="h-20 mt-6 glass-panel p-4 rounded-xl font-mono text-sm max-w-lg relative overflow-hidden neon-box-blue border-cyber-blue/30"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent element-scan"></div>
            <TerminalText
              text="> Intrusion detected... Deploying countermeasures."
              className="text-cyber-light"
              delay={1000}
            />
            <br/>
            <TerminalText
              text="> Compiling scalable infrastructure..."
              className="text-cyber-blue/80"
              delay={3500}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <a href="#projects" className="relative group px-8 py-4 bg-cyber-blue/10 border border-cyber-blue text-cyber-blue font-mono text-xs font-bold tracking-widest uppercase hover:bg-cyber-blue hover:text-cyber-dark transition-all duration-300 rounded overflow-hidden neon-box-blue">
              <span className="relative z-10">Access Directives</span>
              <div className="absolute inset-0 bg-cyber-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </a>
            <a href="#contact" className="px-8 py-4 bg-transparent border border-white/20 text-white font-mono text-xs font-bold tracking-widest uppercase hover:border-cyber-pink hover:text-cyber-pink hover:shadow-[0_0_20px_rgba(255,0,85,0.4)] transition-all duration-300 rounded">
              Establish Link
            </a>
          </motion.div>
        </div>

        {/* Right side floating animated visual */}
         <div className="hidden md:flex md:col-span-5 justify-center relative items-center h-[500px]">
           <SolarSystem />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyber-blue/60"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll to Decrypt</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-cyber-blue shadow-[0_0_10px_rgba(0,240,255,0.5)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
