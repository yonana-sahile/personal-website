import { motion } from 'motion/react';
import { Terminal, ShieldAlert } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyber-blue/5 to-transparent pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center gap-6"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-4">
            <span className="w-12 h-12 rounded bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center neon-box-blue">
              <span className="text-cyber-blue font-mono text-xl">01</span>
            </span>
            Intelligence<span className="text-cyber-blue">_</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-cyber-blue via-cyber-purple drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-12 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-7 space-y-6 text-white/80 text-lg leading-relaxed font-sans glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-cyber-blue/50 transition-colors duration-500"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyber-blue to-cyber-purple group-hover:w-2 transition-all duration-300" />
            <p>
              <span className="font-mono text-cyber-blue animate-pulse">&gt;</span> Initiating background check... I am Yonas Sahile, a hybrid technologist specializing in both offensive/defensive cyber security and full-stack software engineering.
            </p>
            <p>
              My philosophy is simple: <span className="text-cyber-blue font-semibold neon-text-blue">you cannot truly secure what you cannot build</span>, and <span className="text-cyber-pink font-semibold neon-text-pink">you cannot build resilient systems if you don't know how they break</span>.
            </p>
            <p>
              Over the years, I've developed a unique vantage point by sitting on both sides of the terminal. I write clean, scalable code while simultaneously modeling threat vectors to ensure the architecture is hardened from day zero.
            </p>
          </motion.div>

          <div className="md:col-span-5 grid gap-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 glass-panel border-white/10 rounded-2xl hover:border-cyber-pink/70 transition-all duration-300 group neon-box-pink hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyber-pink/20 rounded-full blur-2xl group-hover:bg-cyber-pink/40 transition-colors" />
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 rounded-lg bg-cyber-pink/20 border border-cyber-pink text-cyber-pink group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,0,85,0.4)]">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl text-white uppercase tracking-wider">Offensive Auth</h3>
              </div>
              <p className="text-white/60 font-mono text-sm relative z-10 leading-relaxed">Conducting advanced penetration testing, vulnerability assessments, and implementing zero-trust architectures.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-8 glass-panel border-white/10 rounded-2xl hover:border-cyber-blue/70 transition-all duration-300 group neon-box-blue hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-cyber-blue/20 rounded-full blur-2xl group-hover:bg-cyber-blue/40 transition-colors" />
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 rounded-lg bg-cyber-blue/20 border border-cyber-blue text-cyber-blue group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <Terminal size={28} />
                </div>
                <h3 className="font-display font-bold text-2xl text-white uppercase tracking-wider">System Eng</h3>
              </div>
              <p className="text-white/60 font-mono text-sm relative z-10 leading-relaxed">Architecting scalable backends, intuitive frontends, and deploying resilient cloud infrastructure.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
