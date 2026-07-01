import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Upload, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../config';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: any) => void;
}

export function ProjectManagerModal({ isOpen, onClose, onProjectAdded }: ProjectManagerModalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password reset states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [type, setType] = useState('Full-Stack');
  const [color, setColor] = useState('cyber-blue');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Login (updated for DRF token) ──────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('adminToken', data.token);
        window.dispatchEvent(new Event('adminLogin'));
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Server error');
    }
  };

  // ── Forgot / Reset Password ──────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setForgotMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setForgotMessage(data.message || 'OTP Sent to your phone');
      } else {
        setLoginError(data.error || 'Request failed');
      }
    } catch(err) {
      setLoginError('Server error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setForgotMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage('Password reset successfully! You can now login.');
        setTimeout(() => {
          setIsForgotPassword(false);
          setOtpSent(false);
          setForgotMessage('');
          setPassword('');
        }, 2000);
      } else {
        setLoginError(data.error || 'Reset failed');
      }
    } catch(err) {
      setLoginError('Server error');
    }
  };

  // ── Image upload (unchanged) ───────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Add project (updated for Django) ────────────────────────────────────
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newProject = {
      title,
      description,
      tech: tech.split(',').map(t => t.trim()).filter(t => t),
      type,
      color,
      image,
      github: '#',
      link: '#'
    };

    try {
      const res = await fetch(`${API_BASE}/api/projects/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();
      if (res.ok) {
        onProjectAdded(data);
        onClose();
      } else {
        alert(data.error || 'Failed to add project');
      }
    } catch (err) {
      alert('Error adding project');
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyber-dark/80 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            drag
            dragMomentum={false}
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col z-[101] glass-panel border border-cyber-blue/50 neon-box-blue rounded-xl pointer-events-auto"
          >
            <div className="flex justify-between items-center p-6 pb-4 border-b border-cyber-blue/30 cursor-grab active:cursor-grabbing">
              <h3 className="font-display font-bold text-xl text-cyber-blue tracking-widest uppercase">
                {isLoggedIn ? 'Add New Project' : 'Admin Authentication'}
              </h3>
              <div className="flex items-center gap-4">
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('adminToken');
                      setIsLoggedIn(false);
                      setToken('');
                      window.dispatchEvent(new Event('adminLogin'));
                    }}
                    className="text-xs font-mono text-cyber-pink hover:text-cyber-light transition-colors"
                  >
                    LOGOUT
                  </button>
                )}
                <button onClick={onClose} className="text-cyber-light/50 hover:text-cyber-pink transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
            {!isLoggedIn ? (
              isForgotPassword ? (
                <form onSubmit={otpSent ? handleResetPassword : handleForgotPassword} className="space-y-4">
                  {!otpSent ? (
                    <div>
                      <label className="block text-xs font-mono text-cyber-light/50 mb-1">PHONE NUMBER</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none transition-colors"
                        required
                        placeholder="0967005077"
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-mono text-cyber-light/50 mb-1">OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none transition-colors"
                          required
                          placeholder="123456"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-cyber-light/50 mb-1">NEW PASSWORD</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none transition-colors"
                          required
                        />
                      </div>
                    </>
                  )}
                  {forgotMessage && <div className="text-cyber-green text-xs font-mono flex items-center gap-1"><CheckCircle className="w-3 h-3" />{forgotMessage}</div>}
                  {loginError && <div className="text-cyber-pink text-xs font-mono flex items-center gap-1"><AlertCircle className="w-3 h-3" />{loginError}</div>}
                  <button type="submit" className="w-full py-2 mt-4 glass-panel border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black font-mono tracking-widest transition-all">
                    {otpSent ? 'RESET PASSWORD' : 'SEND OTP'}
                  </button>
                  <button type="button" onClick={() => { setIsForgotPassword(false); setLoginError(''); setForgotMessage(''); }} className="w-full py-2 mt-2 text-xs text-cyber-light/50 hover:text-cyber-light font-mono transition-all">
                    BACK TO LOGIN
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">USERNAME</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">PASSWORD</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none transition-colors"
                      required
                    />
                  </div>
                  {loginError && <div className="text-cyber-pink text-xs font-mono flex items-center gap-1"><AlertCircle className="w-3 h-3" />{loginError}</div>}
                  <button type="submit" className="w-full py-2 mt-4 glass-panel border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black font-mono tracking-widest transition-all">
                    AUTHENTICATE
                  </button>
                  <button type="button" onClick={() => { setIsForgotPassword(true); setLoginError(''); setForgotMessage(''); }} className="w-full py-2 mt-2 text-xs text-cyber-light/50 hover:text-cyber-light font-mono transition-all">
                    FORGOT PASSWORD?
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-cyber-light/50 mb-1">PROJECT TITLE</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-cyber-light/50 mb-1">DESCRIPTION</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none h-24" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-cyber-light/50 mb-1">TECHNOLOGIES (comma separated)</label>
                  <input type="text" value={tech} onChange={(e) => setTech(e.target.value)} placeholder="React, Node.js, Tailwind" className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">TYPE</label>
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">COLOR THEME</label>
                    <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-blue outline-none">
                      <option value="cyber-blue">Blue</option>
                      <option value="cyber-pink">Pink</option>
                      <option value="cyber-purple">Purple</option>
                      <option value="cyber-green">Green</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-cyber-light/50 mb-1">PROJECT IMAGE (Optional)</label>
                  <div className="border border-dashed border-cyber-light/20 rounded p-4 text-center hover:border-cyber-blue transition-colors cursor-pointer relative overflow-hidden group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {image ? (
                       <div className="flex flex-col items-center gap-2">
                         <img src={image} alt="Preview" className="h-20 object-cover rounded border border-cyber-blue/30" />
                         <span className="text-xs text-cyber-green font-mono flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Image selected</span>
                       </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-cyber-light/40 group-hover:text-cyber-blue">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-mono">Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-2 mt-4 glass-panel border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black font-mono tracking-widest transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? 'PROCESSING...' : <><Plus className="w-4 h-4"/> DEPLOY PROJECT</>}
                </button>
              </form>
            )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
