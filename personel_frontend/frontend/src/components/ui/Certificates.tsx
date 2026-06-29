import { motion } from 'motion/react';
import { Award, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000/api';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  image: string;
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));

  const fetchCertificates = () => {
    fetch(`${API_BASE}/certificates/`)
      .then(res => res.json())
      .then(data => setCertificates(data))
      .catch(err => console.error("Failed to fetch certificates", err));
  };

  useEffect(() => {
    fetchCertificates();

    const handleAdminLogin = () => setIsAdmin(!!localStorage.getItem('adminToken'));
    window.addEventListener('adminLogin', handleAdminLogin);

    return () => window.removeEventListener('adminLogin', handleAdminLogin);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const res = await fetch(`${API_BASE}/certificates/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('adminToken')}`
        }
      });
      if (res.ok) {
        fetchCertificates();
      } else {
        alert('Failed to delete certificate');
      }
    } catch (err) {
      alert('Error deleting certificate');
    }
  };

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex items-center justify-end gap-6"
        >
          <div className="h-[2px] flex-grow bg-gradient-to-l from-cyber-blue via-cyber-green drop-shadow-[0_0_8px_rgba(0,255,65,0.8)] to-transparent" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-cyber-light uppercase tracking-tight flex items-center gap-4">
            Certifications<span className="text-cyber-green">_</span>
            <span className="w-12 h-12 rounded bg-cyber-green/20 border border-cyber-green flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.5)]">
              <span className="text-cyber-green font-mono text-xl">04</span>
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel rounded-2xl relative overflow-hidden group border-cyber-light/10 hover:border-cyber-green/50 transition-colors duration-500 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                {cert.image ? (
                  <img src={cert.image} alt={cert.title} className="w-full h-full object-cover filter grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full bg-cyber-dark/80 flex items-center justify-center">
                    <Award className="w-16 h-16 text-cyber-green/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent opacity-80" />
              </div>

              <div className="p-6 relative z-10 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded bg-cyber-green/10 border border-cyber-green/30 text-cyber-green">
                    <ShieldCheck size={20} />
                  </div>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-cyber-light/50 hover:text-cyber-green transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>

                <h3 className="text-xl font-display font-bold text-cyber-light mb-2">{cert.title}</h3>
                <p className="text-sm font-mono text-cyber-light/60 mb-1">{cert.issuer}</p>
                <p className="text-xs font-mono text-cyber-green/70 mb-4">{new Date(cert.date).toLocaleDateString()}</p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-cyber-light/10">
                  <span className="text-[10px] font-mono tracking-widest text-cyber-green uppercase">Verified</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="text-cyber-pink hover:text-cyber-pink/70 transition-colors p-2"
                      title="Delete Certificate"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {certificates.length === 0 && (
            <div className="col-span-full py-12 text-center text-cyber-light/40 font-mono text-sm border border-dashed border-cyber-light/10 rounded-2xl">
              No certifications found in database.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
