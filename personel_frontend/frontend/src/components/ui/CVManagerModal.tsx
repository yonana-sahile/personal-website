import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../config';

interface CVManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCVUploaded: (url: string) => void;
}

export function CVManagerModal({ isOpen, onClose, onCVUploaded }: CVManagerModalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const [cvFile, setCvFile] = useState('');
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

  // ── File upload (unchanged) ────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ── Upload CV (updated for Django) ──────────────────────────────────────
  const handleUploadCV = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/cv/upload/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ url: cvFile })
      });
      const data = await res.json();
      if (res.ok) {
        onCVUploaded(data.url);
        onClose();
      } else {
        alert(data.error || 'Failed to upload CV');
        if (res.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem('adminToken');
        }
      }
    } catch (err) {
      alert('Error uploading CV');
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
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col z-[101] glass-panel border border-cyber-pink/50 neon-box-pink rounded-xl pointer-events-auto"
          >
            <div className="flex justify-between items-center p-6 pb-4 border-b border-cyber-pink/30 cursor-grab active:cursor-grabbing">
              <h3 className="font-display font-bold text-xl text-cyber-pink tracking-widest uppercase">
                {isLoggedIn ? 'Upload CV' : 'Admin Authentication'}
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
                        className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-pink outline-none transition-colors"
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
                          className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-pink outline-none transition-colors"
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
                          className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-pink outline-none transition-colors"
                          required
                        />
                      </div>
                    </>
                  )}
                  {forgotMessage && <div className="text-cyber-green text-xs font-mono flex items-center gap-1"><CheckCircle className="w-3 h-3" />{forgotMessage}</div>}
                  {loginError && <div className="text-cyber-pink text-xs font-mono flex items-center gap-1"><AlertCircle className="w-3 h-3" />{loginError}</div>}
                  <button type="submit" className="w-full py-2 mt-4 glass-panel border border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black font-mono tracking-widest transition-all">
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
                      className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-pink outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">PASSWORD</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-pink outline-none transition-colors"
                      required
                    />
                  </div>
                  {loginError && <div className="text-cyber-pink text-xs font-mono flex items-center gap-1"><AlertCircle className="w-3 h-3" />{loginError}</div>}
                  <button type="submit" className="w-full py-2 mt-4 glass-panel border border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black font-mono tracking-widest transition-all">
                    AUTHENTICATE
                  </button>
                  <button type="button" onClick={() => { setIsForgotPassword(true); setLoginError(''); setForgotMessage(''); }} className="w-full py-2 mt-2 text-xs text-cyber-light/50 hover:text-cyber-light font-mono transition-all">
                    FORGOT PASSWORD?
                  </button>
                </form>
              )
            ) : (
              <form onSubmit={handleUploadCV} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-cyber-light/50 mb-1">CV DOCUMENT (PDF/Image)</label>
                  <div className="border border-dashed border-cyber-light/20 rounded p-4 text-center hover:border-cyber-pink transition-colors cursor-pointer relative overflow-hidden group">
                    <input type="file" accept="application/pdf,image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                    {cvFile ? (
                       <div className="flex flex-col items-center gap-2">
                         <span className="text-xs text-cyber-green font-mono flex items-center gap-1"><CheckCircle className="w-3 h-3"/> File selected</span>
                       </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-cyber-light/40 group-hover:text-cyber-pink">
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-mono">Click to upload CV file</span>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-2 mt-4 glass-panel border border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black font-mono tracking-widest transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? 'PROCESSING...' : <><Upload className="w-4 h-4"/> UPLOAD CV</>}
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
