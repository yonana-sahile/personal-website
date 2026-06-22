import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, ScanFace, Globe, Cpu } from 'lucide-react';

interface ViewerScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ViewerData {
  ip: string;
  os: string;
  browser: string;
  screen: string;
  timestamp: string;
  history: string[];
}

export function ViewerScanner({ isOpen, onClose }: ViewerScannerProps) {
  const [data, setData] = useState<ViewerData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const ipData = await res.json();

          let os = "Unknown OS";
          if (navigator.userAgent.indexOf("Win") !== -1) os = "Windows";
          if (navigator.userAgent.indexOf("Mac") !== -1) os = "MacOS";
          if (navigator.userAgent.indexOf("X11") !== -1) os = "UNIX";
          if (navigator.userAgent.indexOf("Linux") !== -1) os = "Linux";

          let browser = "Unknown Browser";
          if (navigator.userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
          else if (navigator.userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
          else if (navigator.userAgent.indexOf("Safari") !== -1) browser = "Safari";

          const newData = {
            ip: ipData.ip || "REDACTED",
            os,
            browser,
            screen: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString(),
            history: [] // We can load historic IPs from localstorage if needed
          };

          const prevHistory = JSON.parse(localStorage.getItem('viewer_history') || '[]');
          newData.history = prevHistory;

          if (!prevHistory.includes(newData.ip)) {
             const updatedHistory = [newData.ip, ...prevHistory].slice(0, 10);
             localStorage.setItem('viewer_history', JSON.stringify(updatedHistory));
             newData.history = updatedHistory;
          }

          setTimeout(() => {
            setData(newData);
            setLoading(false);
          }, 1500); // Simulate scanning delay
        } catch (err) {
          setData({
             ip: "127.0.0.1 (LOCAL_OVERRIDE)",
             os: "SECURE_OS",
             browser: "ENCRYPTED_CLIENT",
             screen: "RESTRICTED",
             timestamp: new Date().toISOString(),
             history: []
          });
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-cyber-dark/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-6 glass-panel border border-cyber-blue/50 neon-box-blue rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-cyber-blue/30 pb-4">
              <div className="flex items-center gap-3">
                <ScanFace className="w-6 h-6 text-cyber-blue animate-pulse" />
                <h3 className="font-mono text-lg font-bold text-cyber-blue tracking-widest uppercase">Viewer_Log</h3>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-cyber-pink transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="font-mono text-sm">
              {loading || !data ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  <Activity className="w-8 h-8 text-cyber-blue animate-spin" />
                  <p className="text-cyber-green animate-pulse tracking-widest text-xs">ESTABLISHING CONNECTION...</p>
                  <p className="text-white/50 text-[10px] tracking-widest">TRACING ACTIVE PROTOCOLS</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Viewer */}
                  <div className="space-y-3">
                    <h4 className="text-cyber-pink text-xs tracking-widest border-l-2 border-cyber-pink pl-2 mb-2">CURRENT SIGNAL IDENTIFIED</h4>
                    <div className="bg-cyber-blue/5 border border-cyber-blue/20 p-3 rounded-lg space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-blue opacity-50 element-scan pointer-events-none"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs">SOURCE_IP</span>
                        <span className="text-cyber-blue font-bold tracking-wider flex items-center gap-2">
                           <Globe className="w-3 h-3" />
                           {data.ip}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs">HARDWARE</span>
                        <span className="text-cyber-green flex items-center gap-2">
                          <Cpu className="w-3 h-3" />
                          {data.os} [{data.browser}]
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs">RESOLUTION</span>
                        <span className="text-white/80">{data.screen}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 text-xs">TIMESTAMP</span>
                        <span className="text-white/80 text-[10px]">{new Date(data.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* History */}
                  <div className="space-y-3">
                    <h4 className="text-white/50 text-xs tracking-widest border-l-2 border-white/20 pl-2">DATABASE_LOGS</h4>
                    <div className="bg-black/40 border border-white/10 rounded-lg max-h-32 overflow-y-auto custom-scrollbar p-2 space-y-1">
                      {data.history.length > 0 ? (
                        data.history.map((histIp, i) => (
                           <div key={i} className="flex justify-between items-center text-[10px] p-1.5 hover:bg-white/5 rounded">
                             <span className="text-white/40">VISITOR_{1000 + i}</span>
                             <span className={histIp === data.ip ? "text-cyber-blue" : "text-white/60"}>
                               {histIp === data.ip ? "[CURRENT] " : ""}{histIp}
                             </span>
                           </div>
                        ))
                      ) : (
                        <div className="text-white/30 text-center py-2 text-xs font-mono">NO ARCHIVE RECORDS</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer decoration */}
            <div className="mt-6 flex justify-between items-center border-t border-cyber-blue/20 pt-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-cyber-blue"></span>
                <span className="w-2 h-2 rounded-full bg-cyber-pink"></span>
              </div>
              <span className="text-[9px] text-white/30 tracking-widest">SECURE_CHANNEL_ACTIVE</span>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
