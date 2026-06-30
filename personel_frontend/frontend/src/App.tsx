import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/ui/Experience';
import { Certificates } from './components/ui/Certificates';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { CyberBackground } from './components/ui/CyberBackground';
import { AIAssistantWidget } from './components/ui/AIAssistantWidget';
import { BootSequence } from './components/ui/BootSequence';
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { FloatingNav } from './components/ui/FloatingNav';

export default function App() {
  return (
    <div className="min-h-screen text-cyber-light selection:bg-cyber-blue selection:text-black overflow-x-hidden relative">
      <BootSequence />
      <CustomCursor />
      <ScrollProgress />
      <FloatingNav />
      <CyberBackground />
      <Navbar />
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Certificates />
        <Projects />
        <Contact />
      </main>
      <AIAssistantWidget />
    </div>
  );
}
