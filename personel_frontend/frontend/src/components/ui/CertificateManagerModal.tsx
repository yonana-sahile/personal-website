import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

interface CertificateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCertificateUploaded: () => void;
}

export function CertificateManagerModal({ isOpen, onClose, onCertificateUploaded }: CertificateManagerModalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/certificates/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title,
          issuer,
          date,
          url,
          image: imageFile
        })
      });
      const data = await res.json();
      if (res.ok) {
        onCertificateUploaded();
        onClose();
        setTitle('');
        setIssuer('');
        setDate('');
        setUrl('');
        setImageFile('');
      } else {
        alert(data.error || 'Failed to upload Certificate');
        if (res.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem('adminToken');
        }
      }
    } catch (err) {
      alert('Error uploading Certificate');
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
            className="relative w-full max-w-lg max-h-[90vh] flex flex-col z-[101] glass-panel border border-cyber-green/50 neon-box-green rounded-xl pointer-events-auto"
          >
            <div className="flex justify-between items-center p-6 pb-4 border-b border-cyber-green/30 cursor-grab active:cursor-grabbing">
              <h3 className="font-display font-bold text-xl text-cyber-green tracking-widest uppercase">
                {isLoggedIn ? 'Upload Certificate' : 'Admin Authentication'}
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
                    className="text-xs font-mono text-cyber-green hover:text-cyber-light transition-colors"
                  >
                    LOGOUT
                  </button>
                )}
                <button onClick={onClose} className="text-cyber-light/50 hover:text-cyber-green transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {!isLoggedIn ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">USERNAME</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-green outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">PASSWORD</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-green outline-none transition-colors"
                      required
                    />
                  </div>
                  {loginError && <div className="text-cyber-pink text-xs font-mono flex items-center gap-1"><AlertCircle className="w-3 h-3" />{loginError}</div>}
                  <button type="submit" className="w-full py-2 mt-4 glass-panel border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black font-mono tracking-widest transition-all">
                    AUTHENTICATE
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUploadCertificate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">TITLE</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-green outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">ISSUER</label>
                    <input type="text" value={issuer} onChange={e => setIssuer(e.target.value)} required className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-green outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">DATE</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-green outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">VERIFICATION URL (OPTIONAL)</label>
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-cyber-dark/50 border border-cyber-light/20 rounded p-2 text-cyber-light font-mono focus:border-cyber-green outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cyber-light/50 mb-1">CERTIFICATE IMAGE</label>
                    <div className="border border-dashed border-cyber-light/20 rounded p-4 text-center hover:border-cyber-green transition-colors cursor-pointer relative overflow-hidden group">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                      {imageFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-xs text-cyber-green font-mono flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Image selected</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-cyber-light/40 group-hover:text-cyber-green">
                          <Upload className="w-6 h-6" />
                          <span className="text-xs font-mono">Click to upload image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-2 mt-4 glass-panel border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black font-mono tracking-widest transition-all flex items-center justify-center gap-2">
                    {isSubmitting ? 'PROCESSING...' : <><Upload className="w-4 h-4"/> UPLOAD CERTIFICATE</>}
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
