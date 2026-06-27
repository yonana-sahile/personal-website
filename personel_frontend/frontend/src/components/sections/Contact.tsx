import { motion } from 'motion/react';
import { Github, Twitter, Facebook, Send, Network, Mail, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

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
           className="flex flex-col md:flex-row w-full max-w-5xl glass-panel rounded-3xl border border-cyber-pink/40 neon-box-pink overflow-hidden text-left"
        >
          <div className="w-full md:w-5/12 p-12 bg-cyber-dark/80 border-r border-cyber-pink/20 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-pink to-cyber-purple" />

            <div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-8 p-4 rounded-full border border-dashed border-cyber-pink text-cyber-pink"
              >
                <Network size={32} />
              </motion.div>

              <h2 className="text-xs font-mono tracking-[0.5em] text-cyber-pink uppercase mb-4 neon-text-pink">
                Secure Comms
              </h2>

              <h3 className="font-display font-bold text-4xl text-cyber-light mb-6 tracking-tighter uppercase">
                Initiate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple">Handshake</span>
              </h3>

              <p className="text-cyber-light/60 text-sm font-sans leading-relaxed mb-8">
                Connect directly through my encrypted comms channel. Whether for project inquiries or technical discussions, I'm ready to receive your transmission.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <a href="#" title="GitHub" className="p-3 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-blue hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:-translate-y-1 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" title="Facebook" className="p-3 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-blue hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:-translate-y-1 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" title="Telegram" className="p-3 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-purple hover:border-cyber-purple hover:shadow-[0_0_15px_rgba(157,0,255,0.5)] hover:-translate-y-1 transition-all duration-300">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" title="Twitter" className="p-3 border border-cyber-border rounded-full text-cyber-light/50 hover:text-cyber-pink hover:border-cyber-pink hover:shadow-[0_0_15px_rgba(255,0,85,0.5)] hover:-translate-y-1 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="w-full md:w-7/12 p-12 bg-black/40">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cyber-pink/50 group-focus-within:text-cyber-pink transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="IDENTIFIER [NAME]"
                  className="w-full bg-cyber-dark/50 border border-cyber-pink/20 rounded-lg py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-pink focus:outline-none focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-cyber-light/30"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyber-pink/50 group-focus-within:text-cyber-pink transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="ROUTING_ADDRESS [EMAIL]"
                  className="w-full bg-cyber-dark/50 border border-cyber-pink/20 rounded-lg py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-pink focus:outline-none focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-cyber-light/30"
                />
              </div>

              <div className="group relative">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-cyber-pink/50 group-focus-within:text-cyber-pink transition-colors" />
                </div>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="TRANSMISSION_PAYLOAD [MESSAGE]"
                  rows={5}
                  className="w-full bg-cyber-dark/50 border border-cyber-pink/20 rounded-lg py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-pink focus:outline-none focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-cyber-light/30 resize-none custom-scrollbar"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-cyber-pink/10 border border-cyber-pink text-cyber-pink text-sm uppercase tracking-[0.2em] font-bold overflow-hidden rounded-lg neon-box-pink hover:text-black hover:bg-cyber-pink transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2"
              >
                <span className="relative z-10 font-mono flex items-center gap-2">
                  {isSubmitting ? 'TRANSMITTING...' : submitted ? 'TRANSMISSION SENT' : 'SEND TRANSMISSION'}
                  {!isSubmitting && !submitted && <Send className="w-4 h-4 ml-2" />}
                </span>
              </button>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-cyber-green text-xs font-mono text-center tracking-widest uppercase mt-2"
                >
                  [SUCCESS] Message securely routed to destination.
                </motion.p>
              )}
            </form>
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
