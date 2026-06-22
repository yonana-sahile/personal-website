import React, { useEffect, useState } from 'react';

const BIRD_TEXTS = ["SOFTWARE ENGINEER", "CYBERSECURITY EXPERT"];

export function Birds() {
  const generateBird = (id: number) => {
    const isRightToLeft = Math.random() > 0.5;
    const startX = isRightToLeft ? '120vw' : '-20vw';
    const endX = isRightToLeft ? '-20vw' : '120vw';

    // Randomize Y to allow diagonal flight
    const startYNum = -10 + Math.random() * 90; // -10 to 80
    const endYNum = -10 + Math.random() * 90;

    const startY = `${startYNum}vh`;
    const endY = `${endYNum}vh`;

    // Calculate rotation angle
    const dx = isRightToLeft ? -140 : 140; // 120 - (-20) = 140
    const dy = endYNum - startYNum;
    const angle = Math.atan2(dy, Math.abs(dx)) * (180 / Math.PI);

    // Choose subtitle
    const textIndex = Math.floor(Math.random() * BIRD_TEXTS.length);

    return {
      id,
      key: Math.random().toString(36).substring(7),
      isRightToLeft,
      startX,
      startY,
      endX,
      endY,
      angle,
      title: "YONAS SAHILE",
      subtitle: BIRD_TEXTS[textIndex],
      delay: Math.random() * 5,
      duration: 12 + Math.random() * 15,
      scale: 0.25 + Math.random() * 0.35,
      bobDuration: 1.5 + Math.random() * 3,
    };
  };

  const [birds, setBirds] = useState<Array<ReturnType<typeof generateBird>>>([]);

  useEffect(() => {
    setBirds([generateBird(0), generateBird(1), generateBird(2)]);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[5] overflow-hidden">
      {/* Birds */}
      {birds.map((bird) => (
        <div
          key={bird.key}
          className="absolute top-0 left-0"
          onAnimationEnd={() => {
            setBirds(prev => prev.map(b => b.id === bird.id ? generateBird(bird.id) : b));
          }}
          style={{
            '--startX': bird.startX,
            '--startY': bird.startY,
            '--endX': bird.endX,
            '--endY': bird.endY,
            animation: `flyDynamic ${bird.duration}s linear forwards`,
            animationDelay: `${bird.delay}s`,
            animationFillMode: 'both',
          } as React.CSSProperties}
        >
          <div style={{
            animation: `bobbing ${bird.bobDuration}s ease-in-out infinite alternate`,
            width: 'fit-content',
            transform: `rotate(${bird.angle}deg)`
          }}>
            <BirdSVG
              className="bird-flap color-shifting-bird"
              isFlipped={bird.isRightToLeft}
              title={bird.title}
              subtitle={bird.subtitle}
              style={{
                transform: `scale(${bird.scale}) ${bird.isRightToLeft ? 'scaleX(-1)' : ''}`
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes flyDynamic {
          0% { transform: translate(var(--startX), var(--startY)); }
          100% { transform: translate(var(--endX), var(--endY)); }
        }

        @keyframes bobbing {
          0% { transform: translateY(-30px); }
          100% { transform: translateY(30px); }
        }

        .bird-flap .wing-front {
          animation: flap-front 0.15s ease-in-out infinite alternate;
          transform-origin: 20px 19px;
        }
        .bird-flap .wing-back {
          animation: flap-back 0.15s ease-in-out infinite alternate;
          transform-origin: 22px 18px;
        }

        @keyframes flap-front {
          0% { transform: rotate(50deg); }
          100% { transform: rotate(-30deg); }
        }
        @keyframes flap-back {
          0% { transform: rotate(60deg); }
          100% { transform: rotate(-40deg); }
        }

        .color-shifting-bird {
          animation: color-shift 6s linear infinite;
        }
        @keyframes color-shift {
          0% { filter: drop-shadow(0 12px 16px rgba(0,0,0,0.5)) hue-rotate(0deg); }
          100% { filter: drop-shadow(0 12px 16px rgba(0,0,0,0.5)) hue-rotate(360deg); }
        }

        .neon-text {
          animation: neon-blink 2s infinite alternate;
        }
        @keyframes neon-blink {
          0% { fill: #ff00ff; filter: drop-shadow(0 0 2px #ff00ff) drop-shadow(0 0 5px #ff00ff); }
          33% { fill: #00ffff; filter: drop-shadow(0 0 2px #00ffff) drop-shadow(0 0 5px #00ffff); }
          66% { fill: #00ff00; filter: drop-shadow(0 0 2px #00ff00) drop-shadow(0 0 5px #00ff00); }
          100% { fill: #ffff00; filter: drop-shadow(0 0 2px #ffff00) drop-shadow(0 0 5px #ffff00); }
        }
      `}</style>
    </div>
  );
}

function BirdSVG({ className, style, isFlipped, title, subtitle }: { className?: string, style?: React.CSSProperties, isFlipped?: boolean, title: string, subtitle: string }) {
  return (
    <svg width="240" height="240" viewBox="0 0 60 70" className={className} style={{...style, overflow: 'visible'}}>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007F" />
          <stop offset="50%" stopColor="#7F00FF" />
          <stop offset="100%" stopColor="#00FFFF" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF007F" />
          <stop offset="40%" stopColor="#00FFFF" />
          <stop offset="100%" stopColor="#7F00FF" />
        </linearGradient>
        <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#FF00FF" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FF00" />
          <stop offset="100%" stopColor="#00FFFF" />
        </linearGradient>
      </defs>

      {/* Back Wing */}
      <g className="wing-back">
        <path d="M 22 18 C 26 2, 12 -2, 8 6 C 12 12, 18 15, 22 18" fill="url(#wingGrad)" />
        {/* Wing details */}
        <path d="M 12 5 C 15 8, 18 12, 20 16" stroke="#FFD700" strokeWidth="0.5" fill="none" />
        <path d="M 10 7 C 13 10, 16 14, 18 17" stroke="#171717" strokeWidth="0.5" fill="none" />
      </g>

      {/* Back Leg */}
      <g className="leg-back">
        <path d="M 16 23 C 14 26, 14.5 28, 15 30 C 16 30, 17 26, 18 23 Z" fill="#e5e7eb" />
        <path d="M 15 29 L 14.5 32 L 15.5 32 L 16 29 Z" fill="#9ca3af" />
        <path d="M 14.5 32 C 12 33, 11 34, 10 35" stroke="#9ca3af" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M 15 32 C 14 33, 13 35, 13 36" stroke="#6b7280" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M 15.5 32 C 17 33, 18 34, 19 35" stroke="#9ca3af" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M 10 35 C 9 36, 9 37, 10.5 37 C 10 36.5, 10 35.5, 10 35 Z" fill="#111827" />
        <path d="M 13 36 C 12 37, 12 38, 13.5 38 C 13 37.5, 13 36.5, 13 36 Z" fill="#111827" />
        <path d="M 19 35 C 20 36, 20 37, 18.5 37 C 19 36.5, 19 35.5, 19 35 Z" fill="#111827" />
      </g>

      {/* Tail */}
      <g>
        <path d="M 14 20 L 2 16 L 4 28 Z" fill="url(#wingGrad)" />
        <path d="M 14 20 L 4 20" stroke="#7F00FF" strokeWidth="0.5" fill="none" />
        <path d="M 14 20 L 6 24" stroke="#7F00FF" strokeWidth="0.5" fill="none" />
      </g>

      {/* Body */}
      <path d="M 12 20 C 12 28, 28 26, 32 20 C 32 15, 18 12, 12 20" fill="url(#bodyGrad)" />

      {/* Text held by legs */}
      <g transform="translate(25, 46)">
        <text
          fontFamily="'Inter', system-ui, sans-serif"
          fontWeight="900"
          textAnchor="middle"
          transform={isFlipped ? "scale(-1, 1)" : ""}
        >
          <tspan x="0" y="0" fontSize="5.5" fill="url(#titleGrad)" style={{ textShadow: "0px 2px 6px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,255,255,0.6)" }}>{title}</tspan>
          <tspan x="0" y="7" fontSize="4" fill="url(#subGrad)" style={{ textShadow: "0px 2px 5px rgba(0,0,0,0.9), 0px 0px 8px rgba(0,255,0,0.5)" }}>{subtitle}</tspan>
        </text>
      </g>

      {/* Front Leg */}
      <g className="leg-front">
        <path d="M 20 24 C 18 27, 18.5 29, 19 31 C 20 31, 21 27, 22 24 Z" fill="#f3f4f6" />
        <path d="M 19 30 L 18.5 33 L 19.5 33 L 20 30 Z" fill="#9ca3af" />
        <path d="M 18.5 33 C 16 34, 15 36, 14 38" stroke="#9ca3af" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 19 33 C 18 35, 17 37, 17 39" stroke="#6b7280" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 19.5 33 C 21 34, 22 36, 23 38" stroke="#9ca3af" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 14 38 C 13 39, 13 40, 14.5 40 C 14 39.5, 14 40.5, 14 38 Z" fill="#111827" />
        <path d="M 17 39 C 16 40, 16 41, 17.5 41 C 17 40.5, 17 39.5, 17 39 Z" fill="#111827" />
        <path d="M 23 38 C 24 39, 24 40, 22.5 40 C 23 39.5, 23 38.5, 23 38 Z" fill="#111827" />
      </g>

      {/* Head */}
      <circle cx="32" cy="18" r="5.5" fill="#FF007F" />

      {/* Black Face Mask */}
      <path d="M 30 16 C 33 16, 36 17, 36 19 C 36 21, 31 21, 30 19 Z" fill="#171717" />

      {/* Beak */}
      <polygon points="36,17 41,18.5 36,20" fill="#FFD700" />

      {/* Eye */}
      <circle cx="33" cy="18" r="1" fill="#ffffff" />
      <circle cx="33.5" cy="18" r="0.4" fill="#000000" />

      {/* Front Wing */}
      <g className="wing-front">
        <path d="M 20 19 C 24 4, 10 2, 5 8 C 10 14, 17 17, 20 19" fill="url(#wingGrad)" />
        <path d="M 14 7 C 17 10, 19 14, 21 17" stroke="#00FFFF" strokeWidth="0.6" fill="none" />
        <path d="M 11 9 C 14 12, 17 16, 19 18" stroke="#171717" strokeWidth="0.6" fill="none" />
        <path d="M 8 11 C 11 14, 14 17, 16 19" stroke="#FF007F" strokeWidth="0.6" fill="none" />
      </g>
    </svg>
  );
}
