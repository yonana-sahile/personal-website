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

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-cyber-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none" />

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
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           whileInView={{ opacity: 1, scale: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="flex flex-col md:flex-row w-full max-w-5xl bg-cyber-dark/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl shadow-cyber-pink/5 overflow-hidden text-left relative"
        >
          {/* Decorative tech lines */}
          <div className="absolute -right-10 top-20 w-40 h-[1px] bg-cyber-pink/30 rotate-45 pointer-events-none" />
          <div className="absolute -right-10 top-24 w-40 h-[1px] bg-cyber-purple/30 rotate-45 pointer-events-none" />

          <div className="w-full md:w-5/12 p-10 md:p-14 bg-gradient-to-br from-cyber-dark to-black border-r border-white/5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-pink via-cyber-purple to-cyber-blue opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyber-pink/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-flex items-center justify-center mb-10 p-4 rounded-2xl bg-cyber-pink/5 border border-cyber-pink/30 text-cyber-pink shadow-[0_0_15px_rgba(255,0,85,0.2)]"
              >
                <Network size={36} className="opacity-80" />
              </motion.div>

              <h2 className="text-[10px] font-mono tracking-[0.4em] text-cyber-pink/80 uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse" />
                Encrypted Channel
              </h2>

              <h3 className="font-display font-bold text-4xl lg:text-5xl text-cyber-light mb-6 tracking-tighter uppercase leading-tight">
                Initiate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-pink to-cyber-purple drop-shadow-sm">Handshake</span>
              </h3>

              <p className="text-cyber-light/50 text-sm font-sans leading-relaxed mb-8 max-w-sm">
                Connect directly through my encrypted comms channel. Whether for project inquiries or technical discussions, I'm ready to receive your transmission.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 relative z-10">
              {[
                { icon: Github, name: 'GitHub', color: 'hover:text-cyber-blue hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:bg-cyber-blue/10' },
                { icon: Facebook, name: 'Facebook', color: 'hover:text-cyber-blue hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:bg-cyber-blue/10' },
                { icon: Send, name: 'Telegram', color: 'hover:text-cyber-purple hover:border-cyber-purple hover:shadow-[0_0_15px_rgba(157,0,255,0.5)] hover:bg-cyber-purple/10' },
                { icon: Twitter, name: 'Twitter', color: 'hover:text-cyber-pink hover:border-cyber-pink hover:shadow-[0_0_15px_rgba(255,0,85,0.5)] hover:bg-cyber-pink/10' }
              ].map((social) => (
                 <a key={social.name} href="#" title={social.name} className={`p-3.5 border border-white/5 rounded-2xl text-cyber-light/40 bg-white/[0.02] ${social.color} hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm group/icon`}>
                    <social.icon className="w-5 h-5 group-hover/icon:scale-110 transition-transform" />
                 </a>
              ))}
            </div>
          </div>

          <div className="w-full md:w-7/12 p-10 md:p-14 bg-black/20 relative z-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full justify-center">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-cyber-light/30 group-focus-within:text-cyber-pink transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="IDENTIFIER [NAME]"
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-pink focus:bg-cyber-pink/5 focus:outline-none focus:ring-4 focus:ring-cyber-pink/10 transition-all duration-300 placeholder:text-cyber-light/30"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-cyber-light/30 group-focus-within:text-cyber-pink transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="ROUTING_ADDRESS [EMAIL]"
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-pink focus:bg-cyber-pink/5 focus:outline-none focus:ring-4 focus:ring-cyber-pink/10 transition-all duration-300 placeholder:text-cyber-light/30"
                />
              </div>

              <div className="group relative flex-grow">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-cyber-light/30 group-focus-within:text-cyber-pink transition-colors duration-300" />
                </div>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="TRANSMISSION_PAYLOAD [MESSAGE]"
                  rows={5}
                  className="w-full h-full min-h-[140px] bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-pink focus:bg-cyber-pink/5 focus:outline-none focus:ring-4 focus:ring-cyber-pink/10 transition-all duration-300 placeholder:text-cyber-light/30 resize-none custom-scrollbar"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyber-pink/10 to-cyber-purple/10 border border-cyber-pink/40 text-cyber-pink text-sm uppercase tracking-[0.2em] font-bold overflow-hidden rounded-xl hover:text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-[0_0_20px_rgba(255,0,85,0.1)] hover:shadow-[0_0_30px_rgba(255,0,85,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                <span className="relative z-10 font-mono flex items-center justify-center gap-3 w-full">
                  {isSubmitting ? 'TRANSMITTING...' : submitted ? 'TRANSMISSION SENT' : 'SEND TRANSMISSION'}
                  {!isSubmitting && !submitted && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
                </span>
              </button>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-cyber-green text-xs font-mono text-center tracking-widest uppercase mt-2 absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-full"
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
