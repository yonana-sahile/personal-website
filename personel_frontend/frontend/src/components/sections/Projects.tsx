import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, TerminalSquare, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProjectManagerModal } from '../ui/ProjectManagerModal';
import { API_BASE } from '../../config';

const initialProjects = [
  {
    id: '1',
    title: 'Zero-Trust Protocol',
    description: 'Authentication flow implementing mutual TLS and biometric verification for high-security enterprise environments. Custom VPN architecture.',
    tech: ['Golang', 'gRPC', 'PostgreSQL', 'Redis'],
    type: 'Security Core',
    github: '#',
    link: '#',
    color: 'cyber-blue',
    image: ''
  },
  {
    id: '2',
    title: 'NetScanner v2',
    description: 'Automated network mapping tool that runs passively to detect vulnerabilities across internal subnets without triggering IDS/IPS systems.',
    tech: ['Python', 'asyncio', 'Scapy', 'Docker'],
    type: 'Offensive',
    github: '#',
    link: '#',
    color: 'cyber-pink',
    image: ''
  },
  {
    id: '3',
    title: 'Threat Intel OSINT',
    description: 'Real-time aggregation of OSINT data processing 50k+ indicators of compromise daily. Interactive D3.js node graph of threat actor networks.',
    tech: ['React', 'Node.js', 'Elasticsearch'],
    type: 'Full-Stack',
    github: '#',
    link: '#',
    color: 'cyber-purple',
    image: ''
  },
  {
    id: '4',
    title: 'WAF Fuzzer Mod',
    description: 'Research tool designed to mutate HTTP requests intelligently to bypass modern firewalls. Uncovered continuous zero-days in enterprise WAFs.',
    tech: ['Rust', 'HTTP/2', 'Machine Learning'],
    type: 'Research',
    github: '#',
    link: '#',
    color: 'cyber-green',
    image: ''
  }
];

const getColorClass = (colorName: string, type: 'text' | 'border' | 'bg' | 'shadow' | 'hover') => {
  const colorMap: Record<string, any> = {
    'cyber-blue': { text: 'text-cyber-blue', border: 'border-cyber-blue', bg: 'bg-cyber-blue', shadow: 'shadow-[0_0_15px_rgba(0,240,255,0.4)]', hover: 'group-hover:border-cyber-blue group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]' },
    'cyber-pink': { text: 'text-cyber-pink', border: 'border-cyber-pink', bg: 'bg-cyber-pink', shadow: 'shadow-[0_0_15px_rgba(255,0,85,0.4)]', hover: 'group-hover:border-cyber-pink group-hover:shadow-[0_0_30px_rgba(255,0,85,0.6)]' },
    'cyber-purple': { text: 'text-cyber-purple', border: 'border-cyber-purple', bg: 'bg-cyber-purple', shadow: 'shadow-[0_0_15px_rgba(157,0,255,0.4)]', hover: 'group-hover:border-cyber-purple group-hover:shadow-[0_0_30px_rgba(157,0,255,0.6)]' },
    'cyber-green': { text: 'text-cyber-green', border: 'border-cyber-green', bg: 'bg-cyber-green', shadow: 'shadow-[0_0_15px_rgba(0,255,65,0.4)]', hover: 'group-hover:border-cyber-green group-hover:shadow-[0_0_30px_rgba(0,255,65,0.6)]' },
  };
  return colorMap[colorName]?.[type] || '';
};

export function Projects() {
  const [projectList, setProjectList] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const handleLogin = () => setAdminToken(localStorage.getItem('adminToken'));
    window.addEventListener('adminLogin', handleLogin);
    return () => window.removeEventListener('adminLogin', handleLogin);
  }, []);

  useEffect(() => {
    // Fetch projects from Django backend
    fetch(`${API_BASE}/api/projects/`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProjectList(data);
        }
      })
      .catch(err => console.error("Failed to fetch projects", err));
  }, []);

  const handleDelete = async (id: string) => {
    if (!adminToken) return;
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/projects/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${adminToken}`
        }
      });
      if (res.ok) {
        setProjectList(projectList.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          setAdminToken(null);
        }
      }
    } catch (err) {
      alert('Error deleting project');
    }
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyber-blue/5 to-transparent pointer-events-none mix-blend-screen" />

      <ProjectManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectAdded={(newProj) => setProjectList([newProj, ...projectList])}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6 w-full md:w-auto flex-grow">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cyber-light uppercase tracking-tight flex items-center gap-4 whitespace-nowrap">
              <span className="w-12 h-12 rounded bg-cyber-purple/20 border border-cyber-purple flex items-center justify-center neon-box-purple">
                <span className="text-cyber-purple font-mono text-xl">03</span>
              </span>
              Projects<span className="text-cyber-purple">_</span>
            </h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-cyber-purple via-cyber-blue drop-shadow-[0_0_8px_rgba(157,0,255,0.8)] to-transparent" />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-cyber-green text-cyber-green text-sm font-mono hover:bg-cyber-green hover:text-black transition-colors rounded neon-box-green uppercase"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <AnimatePresence>
            {projectList.map((project, index) => (
              <motion.div
                key={project.id || project.title + index}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className={`group relative glass-panel border border-cyber-light/10 p-8 rounded-2xl transition-all duration-500 overflow-hidden flex flex-col ${getColorClass(project.color, 'hover')}`}
              >
                <div className={`absolute -inset-2 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 ${getColorClass(project.color, 'bg')}`} />
                <div className={`absolute top-0 left-0 w-1 h-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 ${getColorClass(project.color, 'bg')} ${getColorClass(project.color, 'shadow')}`} />

                <div className="relative z-10 flex justify-between items-start mb-8">
                  <TerminalSquare className={`w-12 h-12 drop-shadow-lg transition-transform group-hover:scale-110 duration-300 ${getColorClass(project.color, 'text')}`} />
                  <div className="flex gap-4">
                    {adminToken && project.id && (
                      <button onClick={() => handleDelete(project.id)} className="text-cyber-pink/70 hover:text-cyber-pink transition-colors hover:scale-110">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <a href={project.github} className="text-cyber-light/40 hover:text-cyber-light transition-colors hover:scale-110">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href={project.link} className={`text-cyber-light/40 transition-colors hover:scale-110 hover:${getColorClass(project.color, 'text')}`}>
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>

                {project.image && (
                  <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden border border-cyber-light/10 group-hover:border-cyber-light/30 transition-colors">
                     <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500`} />
                     <motion.img
                       src={project.image}
                       alt={project.title}
                       className="w-full h-full object-cover filter contrast-[1.1] opacity-70 group-hover:opacity-100 transition-all duration-700"
                       whileHover={{ scale: 1.1 }}
                     />
                     <div className={`absolute top-0 left-0 w-full h-full element-scan opacity-30 z-20 pointer-events-none group-hover:opacity-0 ${getColorClass(project.color, 'bg')}`} />
                  </div>
                )}

                <div className={`mb-4 text-[10px] font-mono tracking-[0.3em] uppercase ${getColorClass(project.color, 'text')}`}>{project.type}</div>

                <h3 className="text-3xl font-display font-bold text-cyber-light mb-4 group-hover:text-cyber-light transition-colors tracking-wide">
                  {project.title}
                </h3>

                <p className={`text-cyber-light/60 text-sm font-sans leading-relaxed mb-10 ${project.image ? 'h-auto' : 'h-[4.5rem]'} flex-grow`}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                  {project.tech.map(t => (
                    <span key={t} className={`px-3 py-1 bg-cyber-dark/40 border border-cyber-light/10 rounded font-mono text-[10px] uppercase tracking-wider text-cyber-light/70 group-hover:border-cyber-light/30 transition-colors`}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="mt-20 text-center"
        >
            <a href="#" className="inline-flex items-center gap-3 px-8 py-4 glass-panel border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue hover:text-black font-mono tracking-widest uppercase transition-all duration-300 neon-box-blue rounded group">
               [ Access Archive ]
               <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>&gt;&gt;</motion.div>
            </a>
        </motion.div>
      </div>
    </section>
  );
}
