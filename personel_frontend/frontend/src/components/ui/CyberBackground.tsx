import { useEffect, useRef } from 'react';

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: { x: number; y: number; dx: number; dy: number; size: number }[] = [];
    // Calculate a good number of particles (less on mobile, more on huge screens)
    const particleCount = Math.min(Math.floor((width * height) / 12000), 120);

    for (let i = 0; i < particleCount; i++) {
        // distribute them randomly
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 0.5,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep premium gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#030308');
      gradient.addColorStop(0.5, '#050510');
      gradient.addColorStop(1, '#020205');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw and update particles
      particles.forEach((p, index) => {
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around screen bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles within a certain distance
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));

          const connectionDistance = 160;

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);

            const alpha = 1 - distance / connectionDistance;

            // Create a gradient for the connection line to look cyber-like
            const lineGradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);

            // Randomly color paths to add richness
            if (index % 3 === 0) {
              lineGradient.addColorStop(0, `rgba(157, 0, 255, ${alpha * 0.4})`); // Purple
              lineGradient.addColorStop(1, `rgba(0, 240, 255, ${alpha * 0.4})`); // Blue
            } else if (index % 5 === 0) {
              lineGradient.addColorStop(0, `rgba(255, 0, 85, ${alpha * 0.2})`); // Pink
              lineGradient.addColorStop(1, `rgba(157, 0, 255, ${alpha * 0.2})`); // Purple
            } else {
              lineGradient.addColorStop(0, `rgba(0, 240, 255, ${alpha * 0.3})`); // Cyber blue default
              lineGradient.addColorStop(1, `rgba(0, 240, 255, ${alpha * 0.3})`);
            }

            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Overlay to dim the canvas slightly and add a vignette */}
      <div className="absolute inset-0 bg-gradient-to-radial from-transparent to-[#030305] opacity-60"></div>
    </div>
  );
}
