import { motion } from 'motion/react';
import { Database, Layout, Lock, Network, Server, Shield } from 'lucide-react';

const secSkills = [
  { name: 'Penetration Testing', level: 90 },
  { name: 'Network Security', level: 85 },
  { name: 'Cryptography', level: 80 },
  { name: 'Incident Response', level: 85 },
  { name: 'Vulnerability Assessment', level: 95 },
  { name: 'Malware Analysis', level: 75 },
];

const devSkills = [
  { name: 'TypeScript / Node.js', level: 90 },
  { name: 'Python / Golang', level: 85 },
  { name: 'React / Next.js', level: 88 },
  { name: 'Docker / Kubernetes', level: 80 },
  { name: 'AWS / Cloudflare', level: 85 },
  { name: 'Linux / Bash Scripting', level: 95 },
];

export function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-purple to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center justify-end gap-6"
        >
          <div className="h-[2px] flex-grow bg-gradient-to-l from-cyber-purple via-cyber-pink drop-shadow-[0_0_8px_rgba(255,0,85,0.8)] to-transparent" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-4">
            Architecture<span className="text-cyber-pink">_</span>
            <span className="w-12 h-12 rounded bg-cyber-pink/20 border border-cyber-pink flex items-center justify-center neon-box-pink">
              <span className="text-cyber-pink font-mono text-xl">02</span>
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Sec Skills */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 flex flex-col gap-8 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-pink/10 rounded-full blur-[80px]" />
            <div className="flex items-center gap-4 relative z-10">
              <Shield className="text-cyber-pink w-10 h-10 drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]" />
              <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Offensive</h3>
            </div>

            <div className="space-y-6 relative z-10">
              {secSkills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between text-xs font-mono text-white/80 mb-2 uppercase tracking-wide">
                    <span>{skill.name}</span>
                    <span className="text-cyber-pink neon-text-pink">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-black/50 border border-cyber-pink/20 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyber-pink/50 to-cyber-pink relative"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dev Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 flex flex-col gap-8 rounded-2xl relative overflow-hidden border-cyber-blue/30"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-cyber-blue/10 rounded-full blur-[80px]" />
            <div className="flex items-center gap-4 relative z-10">
              <Server className="text-cyber-blue w-10 h-10 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
              <h3 className="text-3xl font-display font-bold text-white uppercase tracking-wider">Engineering</h3>
            </div>

            <div className="space-y-6 relative z-10">
              {devSkills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between text-xs font-mono text-white/80 mb-2 uppercase tracking-wide">
                    <span>{skill.name}</span>
                    <span className="text-cyber-blue neon-text-blue">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-black/50 border border-cyber-blue/20 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-cyber-blue/50 to-cyber-blue relative"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Spinning Environment Core */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-8 glass-panel border-cyber-purple/40 rounded-3xl flex flex-wrap justify-center gap-12 md:gap-24 relative overflow-hidden neon-box-purple"
        >
          <div className="absolute inset-0 cyber-grid opacity-20"></div>

          <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="flex flex-col items-center gap-4 text-cyber-purple hover:text-white transition-all group z-10 cursor-pointer">
            <div className="p-4 rounded-full border border-cyber-purple group-hover:bg-cyber-purple/20 transition-colors shadow-[0_0_15px_rgba(157,0,255,0.4)]">
              <Network size={36} strokeWidth={1.5} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest group-hover:neon-text-blue">Net_Sec</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.2, rotate: -10 }} className="flex flex-col items-center gap-4 text-cyber-pink hover:text-white transition-all group z-10 cursor-pointer">
            <div className="p-4 rounded-full border border-cyber-pink group-hover:bg-cyber-pink/20 transition-colors shadow-[0_0_15px_rgba(255,0,85,0.4)]">
              <Lock size={36} strokeWidth={1.5} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest group-hover:neon-text-pink">Crypto</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="flex flex-col items-center gap-4 text-cyber-blue hover:text-white transition-all group z-10 cursor-pointer">
            <div className="p-4 rounded-full border border-cyber-blue group-hover:bg-cyber-blue/20 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Layout size={36} strokeWidth={1.5} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest group-hover:neon-text-blue">Frontend</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.2, rotate: -10 }} className="flex flex-col items-center gap-4 text-cyber-green hover:text-white transition-all group z-10 cursor-pointer">
            <div className="p-4 rounded-full border border-cyber-green group-hover:bg-cyber-green/20 transition-colors shadow-[0_0_15px_rgba(0,255,65,0.4)]">
              <Database size={36} strokeWidth={1.5} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]">Databases</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
