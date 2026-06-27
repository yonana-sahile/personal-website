import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Network } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-pink drop-shadow-[0_0_10px_rgba(255,0,85,0.8)] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center gap-6 w-full"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-cyber-light uppercase tracking-tight flex items-center gap-4">
            <span className="w-12 h-12 rounded bg-cyber-pink/20 border border-cyber-pink flex items-center justify-center neon-box-pink">
              <span className="text-cyber-pink font-mono text-xl">04</span>
            </span>
            CONTACT<span className="text-cyber-pink">_</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-cyber-pink via-cyber-purple drop-shadow-[0_0_8px_rgba(255,0,85,0.8)] to-transparent" />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="flex flex-col items-center w-full max-w-3xl glass-panel p-12 md:p-20 rounded-3xl border border-cyber-pink/40 neon-box-pink"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="mb-8 p-4 rounded-full border border-dashed border-cyber-pink text-cyber-pink"
          >
            <Network size={40} />
          </motion.div>

          <h2 className="text-sm font-mono tracking-[0.5em] text-cyber-pink uppercase mb-6 neon-text-pink">
            Establish Connection
          </h2>

          <h3 className="font-display font-bold text-5xl md:text-7xl text-cyber-light mb-8 tracking-tighter uppercase uppercase">
            Initiate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple">Handshake</span>
          </h3>

          <p className="text-cyber-light/60 text-base md:text-lg font-sans leading-relaxed mb-12">
            Whether you need to fortify your architecture against modern threats or build resilient, highly scalable infrastructure from the ground up, my comms channel is open.
          </p>

          <a
            href="mailto:yonassahile8@gmail.com"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-cyber-pink/10 border-2 border-cyber-pink text-cyber-pink text-sm uppercase tracking-[0.3em] font-bold overflow-hidden rounded neon-box-pink hover:text-black transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-cyber-pink translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
            <span className="relative z-10 font-mono flex items-center gap-3">
              Send Transmission
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>{`>`}</motion.span>
            </span>
          </a>

          <div className="mt-16 flex justify-center gap-8">
            <a href="#" className="p-4 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-blue hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:-translate-y-2 transition-all duration-300">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-green hover:border-cyber-green hover:shadow-[0_0_15px_rgba(0,255,65,0.5)] hover:-translate-y-2 transition-all duration-300">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-purple hover:border-cyber-purple hover:shadow-[0_0_15px_rgba(157,0,255,0.5)] hover:-translate-y-2 transition-all duration-300">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </div>

      <footer className="mt-32 relative z-10 w-full border-t border-cyber-border bg-cyber-dark/40 backdrop-blur-md">
        <div className="w-full absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_#00ff41]" />
               <span className="text-[10px] font-mono uppercase tracking-widest text-cyber-green">99.9% Uptime</span>
             </div>
           </div>

           <div className="flex items-center">
             <p className="text-[10px] font-mono text-cyber-light/40 tracking-widest uppercase">
                &gt; YONAS SAHILE V3.0 // &copy; {new Date().getFullYear()} ALL RIGHTS SECURED.
             </p>
           </div>
        </div>
      </footer>
    </section>
  );
}
