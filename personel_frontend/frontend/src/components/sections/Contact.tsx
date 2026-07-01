import { motion } from 'motion/react';
import {
  Github, Twitter, Facebook, Send, Network, Mail, User, MessageSquare,
  Terminal, ShieldCheck, Activity, Cpu, Phone, Linkedin
} from 'lucide-react';
import { useState } from 'react';
import { API_BASE } from '../../config';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Real backend connection ────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send message');
      }
    } catch {
      alert('Could not connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-blue drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-cyber-blue/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyber-green/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center gap-6 w-full"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-cyber-light uppercase tracking-tight flex items-center gap-4">
            <span className="w-12 h-12 rounded bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center neon-box-blue">
              <span className="text-cyber-blue font-mono text-xl">04</span>
            </span>
            CONTACT<span className="text-cyber-blue">_</span>
          </h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-cyber-blue via-cyber-green drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] to-transparent" />
        </motion.div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

          {/* Left Column: ID Card & Radar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Large Profile Image – ALWAYS CLEAR (no hover effects) */}
            <div className="relative w-full h-[400px] lg:min-h-[450px] lg:flex-grow rounded-3xl overflow-hidden border border-cyber-blue/30 shadow-[0_0_40px_rgba(0,240,255,0.1)]">
              <img
                src="/profile.jpg"
                alt="Yonas Sahile"
                className="absolute inset-0 w-full h-full object-cover filter contrast-[1.1]"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
                  <span className="text-[10px] font-mono tracking-[0.2em] text-cyber-green uppercase">Online // Ready to Connect</span>
                </div>
                <h3 className="font-display font-bold text-3xl text-cyber-light tracking-tighter uppercase">
                  Yonas Sahile
                </h3>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 relative z-10">
              <a href="tel:0967005077" className="flex items-center justify-between px-5 py-3 border border-white/10 rounded-2xl text-cyber-light bg-black/40 backdrop-blur-md transition-all duration-300 group hover:bg-black/60 hover:border-cyber-pink">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyber-pink group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono tracking-widest text-cyber-light/50 uppercase hidden sm:inline-block">Primary_Line</span>
                </div>
                <span className="font-mono text-sm font-bold tracking-widest group-hover:text-cyber-pink transition-colors">0967005077</span>
              </a>

              <a href="tel:0920886220" className="flex items-center justify-between px-5 py-3 border border-white/10 rounded-2xl text-cyber-light bg-black/40 backdrop-blur-md transition-all duration-300 group hover:bg-black/60 hover:border-cyber-pink">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyber-pink group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono tracking-widest text-cyber-light/50 uppercase hidden sm:inline-block">Alt_Line</span>
                </div>
                <span className="font-mono text-sm font-bold tracking-widest group-hover:text-cyber-pink transition-colors">0920886220</span>
              </a>

              <a href="https://linkedin.com/in/yonas-sahile" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-5 py-3 border border-white/10 rounded-2xl text-cyber-light bg-black/40 backdrop-blur-md transition-all duration-300 group hover:bg-black/60 hover:border-[#0a66c2]">
                <div className="flex items-center gap-3">
                  <Linkedin className="w-4 h-4 text-[#0a66c2] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-mono tracking-widest text-cyber-light/50 uppercase hidden sm:inline-block">Professional_Network</span>
                </div>
                <span className="font-mono text-sm font-bold tracking-widest group-hover:text-[#0a66c2] transition-colors">yonas-sahile</span>
              </a>
            </div>

            {/* Social Nodes – redesigned with brand colors */}
            <div className="grid grid-cols-4 gap-3 relative z-10">
              {[
                { icon: Github, name: 'GitHub', color: 'group-hover:text-white', border: 'group-hover:border-white/50 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]', bg: 'group-hover:bg-white/10' },
                { icon: Facebook, name: 'Facebook', color: 'group-hover:text-[#1877F2]', border: 'group-hover:border-[#1877F2]/50 group-hover:shadow-[0_0_15px_rgba(24,119,242,0.2)]', bg: 'group-hover:bg-[#1877F2]/10' },
                { icon: Send, name: 'Telegram', color: 'group-hover:text-[#0088cc]', border: 'group-hover:border-[#0088cc]/50 group-hover:shadow-[0_0_15px_rgba(0,136,204,0.2)]', bg: 'group-hover:bg-[#0088cc]/10' },
                { icon: Twitter, name: 'Twitter', color: 'group-hover:text-[#1DA1F2]', border: 'group-hover:border-[#1DA1F2]/50 group-hover:shadow-[0_0_15px_rgba(29,161,242,0.2)]', bg: 'group-hover:bg-[#1DA1F2]/10' }
              ].map((social) => (
                 <a key={social.name} href="#" title={social.name} className={`relative flex flex-col items-center justify-center gap-2 p-4 border border-white/10 rounded-2xl text-cyber-light/50 bg-black/40 backdrop-blur-md transition-all duration-300 group overflow-hidden ${social.border}`}>
                    <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${social.bg}`} />
                    <social.icon className={`w-6 h-6 relative z-10 transition-all duration-300 group-hover:scale-110 ${social.color}`} />
                    <span className={`text-[9px] font-mono tracking-widest uppercase hidden sm:block relative z-10 transition-colors duration-300 ${social.color}`}>{social.name}</span>
                 </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Terminal Console Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 bg-cyber-dark/80 backdrop-blur-2xl rounded-3xl border border-cyber-blue/20 shadow-[0_0_50px_rgba(0,240,255,0.05)] relative overflow-hidden flex flex-col text-left"
          >
            {/* Terminal Header */}
            <div className="bg-black/60 border-b border-cyber-blue/20 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-cyber-blue" />
                <span className="text-xs font-mono tracking-[0.2em] text-cyber-light/80 uppercase">Main_Frame_Comms</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-cyber-blue/30 border border-cyber-blue/60" />
                <div className="w-3 h-3 rounded-full bg-cyber-green/30 border border-cyber-green/60" />
                <div className="w-3 h-3 rounded-full bg-white/10 border border-white/30" />
              </div>
            </div>

            <div className="p-8 md:p-10 flex-grow flex flex-col justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-blue/5 rounded-full blur-[80px] pointer-events-none" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-cyber-light/30 group-focus-within:text-cyber-blue transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="IDENTIFIER"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-blue focus:bg-cyber-blue/5 focus:outline-none focus:ring-1 focus:ring-cyber-blue/50 transition-all duration-300 placeholder:text-cyber-light/30"
                    />
                  </div>

                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-cyber-light/30 group-focus-within:text-cyber-blue transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="ROUTING_ADDRESS"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-blue focus:bg-cyber-blue/5 focus:outline-none focus:ring-1 focus:ring-cyber-blue/50 transition-all duration-300 placeholder:text-cyber-light/30"
                    />
                  </div>
                </div>

                <div className="group relative flex-grow">
                  <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-cyber-light/30 group-focus-within:text-cyber-blue transition-colors duration-300" />
                  </div>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="TRANSMISSION_PAYLOAD... Construct your message sequence."
                    className="w-full h-full min-h-[180px] bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-cyber-light font-mono text-sm focus:border-cyber-blue focus:bg-cyber-blue/5 focus:outline-none focus:ring-1 focus:ring-cyber-blue/50 transition-all duration-300 placeholder:text-cyber-light/30 resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <div className="text-[10px] font-mono text-cyber-light/40 tracking-widest uppercase hidden sm:flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                    Awaiting Input_
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto group relative flex items-center justify-center px-10 py-4 bg-cyber-blue/10 border border-cyber-blue/50 text-cyber-blue text-sm uppercase tracking-[0.2em] font-bold overflow-hidden rounded-2xl hover:text-cyber-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                  >
                    <div className="absolute inset-0 bg-cyber-blue translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                    <span className="relative z-10 font-mono flex items-center justify-center gap-3 w-full">
                      {isSubmitting ? 'ENCRYPTING...' : submitted ? 'SENT' : 'TRANSMIT_DATA'}
                      {!isSubmitting && !submitted && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />}
                    </span>
                  </button>
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20 border border-cyber-green/30"
                  >
                    <ShieldCheck className="w-20 h-20 text-cyber-green mb-6 drop-shadow-[0_0_20px_rgba(0,255,65,0.5)]" />
                    <h4 className="text-cyber-green font-display text-2xl font-bold uppercase tracking-widest mb-2">Transmission Secure</h4>
                    <p className="text-cyber-green/70 text-xs font-mono tracking-widest uppercase text-center max-w-sm px-4">
                      Payload successfully routed and stored in local node. Awaiting response.
                    </p>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="mt-32 relative z-10 w-full border-t border-cyber-blue/20 bg-cyber-dark/60 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cyber-light/40 font-mono text-xs uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Yonas. All Systems Operational.
          </p>
          <div className="flex gap-4 items-center">
            <div className="h-1 w-1 rounded-full bg-cyber-blue animate-pulse"></div>
            <span className="text-cyber-blue font-mono text-[10px] tracking-widest uppercase">Net_Status: Online</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
