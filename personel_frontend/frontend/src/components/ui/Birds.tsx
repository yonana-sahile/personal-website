import React, { useEffect, useState } from 'react';

const BIRD_TEXTS = ["SOFTWARE ENGINEER", "CYBERSECURITY EXPERT"];

export function Birds() {
  const generateBird = (id: number) => {
    const isRightToLeft = Math.random() > 0.5;
    const startX = isRightToLeft ? '120vw' : '-20vw';
    const endX = isRightToLeft ? '-20vw' : '120vw';

    const startYNum = -10 + Math.random() * 90;
    const endYNum = -10 + Math.random() * 90;

    const startY = `${startYNum}vh`;
    const endY = `${endYNum}vh`;

    const dx = isRightToLeft ? -140 : 140;
    const dy = endYNum - startYNum;
    const angle = Math.atan2(dy, Math.abs(dx)) * (180 / Math.PI);

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
          animation: flap-front 0.55s ease-in-out infinite alternate;
          transform-origin: 22px 17px;
        }
        .bird-flap .wing-back {
          animation: flap-back 0.55s ease-in-out infinite alternate;
          transform-origin: 22px 17px;
        }
        .bird-flap .eagle-tail {
          animation: tail-flap 0.55s ease-in-out infinite alternate;
          transform-origin: 10px 21px;
        }

        .eagle-head {
          animation: eagle-head-move 6s ease-in-out infinite;
          transform-origin: 38.5px 13px;
        }

        .eagle-beak-upper {
          animation: eagle-beak-upper-open 6s ease-in-out infinite;
          transform-origin: 44.5px 13px;
        }

        .eagle-beak-lower {
          animation: eagle-beak-open 6s ease-in-out infinite;
          transform-origin: 44.5px 14px;
        }

        @keyframes eagle-head-move {
          0% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateY(0px); }
          10% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(-2deg) translateY(-0.3px); }
          20% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(1deg) translateY(0.2px); }
          30% { transform: perspective(200px) rotateY(-25deg) rotateX(1deg) rotateZ(-1deg) translateY(-0.1px); }
          35% { transform: perspective(200px) rotateY(-50deg) rotateX(2deg) rotateZ(-3deg) translateY(0px); }
          42% { transform: perspective(200px) rotateY(-55deg) rotateX(3deg) rotateZ(2deg) translateY(0.1px); }
          48% { transform: perspective(200px) rotateY(-45deg) rotateX(1deg) rotateZ(-4deg) translateY(-0.1px); }
          55% { transform: perspective(200px) rotateY(-52deg) rotateX(2deg) rotateZ(3deg) translateY(0px); }
          62% { transform: perspective(200px) rotateY(-50deg) rotateX(2deg) rotateZ(-3deg) translateY(0px); }
          70% { transform: perspective(200px) rotateY(-20deg) rotateX(1deg) rotateZ(-1deg) translateY(-0.1px); }
          75% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateY(0px); }
          85% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(-3deg) translateY(-0.4px); }
          92% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(2deg) translateY(0.3px); }
          100% { transform: perspective(200px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateY(0px); }
        }

        @keyframes eagle-beak-upper-open {
          0%, 30%, 70%, 100% { transform: rotate(0deg); }
          38%, 44% { transform: rotate(-8deg); }
          48% { transform: rotate(0deg); }
          52%, 58% { transform: rotate(-10deg); }
          64% { transform: rotate(0deg); }
          82%, 88% { transform: rotate(-12deg); }
          94% { transform: rotate(0deg); }
        }

        @keyframes eagle-beak-open {
          0%, 30%, 70%, 100% { transform: rotate(0deg); }
          38%, 44% { transform: rotate(15deg); }
          48% { transform: rotate(0deg); }
          52%, 58% { transform: rotate(18deg); }
          64% { transform: rotate(0deg); }
          82%, 88% { transform: rotate(16deg); }
          94% { transform: rotate(0deg); }
        }

        @keyframes flap-front {
          0% { transform: rotate(-24deg); }
          100% { transform: rotate(16deg); }
        }
        @keyframes flap-back {
          0% { transform: rotate(24deg); }
          100% { transform: rotate(-16deg); }
        }
        @keyframes tail-flap {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(4deg); }
        }

        .color-shifting-bird {
          animation: color-shift 6s linear infinite;
        }
        @keyframes color-shift {
          0% { filter: drop-shadow(0 12px 16px rgba(0,0,0,0.5)) hue-rotate(0deg); }
          100% { filter: drop-shadow(0 12px 16px rgba(0,0,0,0.5)) hue-rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function BirdSVG({
  className,
  style,
  isFlipped,
  title,
  subtitle,
}: {
  className?: string;
  style?: React.CSSProperties;
  isFlipped?: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <svg
      width="320"
      height="260"
      viewBox="-45 -25 135 115"
      className={className}
      style={{ ...style, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007F" />
          <stop offset="45%" stopColor="#7F00FF" />
          <stop offset="100%" stopColor="#00FFFF" />
        </linearGradient>
        <linearGradient id="wingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="55%" stopColor="#FF00AA" />
          <stop offset="100%" stopColor="#7F00FF" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF007F" />
          <stop offset="40%" stopColor="#00FFFF" />
          <stop offset="100%" stopColor="#7F00FF" />
        </linearGradient>
        <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF007F" />
          <stop offset="100%" stopColor="#7F00FF" />
        </linearGradient>
        <linearGradient id="tailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7F00FF" />
          <stop offset="100%" stopColor="#00FFFF" />
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

      {/* BACK WING */}
      <g className="wing-back">
        <path
          d="M 22 17 C 16 8, 8 2, -3 -1 C -10 -2, -16 -2, -18 2 C -17 8, -11 14, -5 16 C 2 18, 9 19, 16 19 C 19 19, 21 18, 22 17"
          fill="url(#wingGrad)"
        />
        <path
          d="M 22 17 C 14 12, 2 7, -9 6 C -17 4, -22 7, -19 11 C -12 13, 2 15, 22 17"
          fill="#5500CC" opacity="0.55"
        />
        <path d="M -18 2 L 20 16" stroke="#FFD700" strokeWidth="0.5" fill="none" opacity="0.75" />
        <path d="M -13 0 L 20 16" stroke="#00FFFF" strokeWidth="0.45" fill="none" opacity="0.65" />
        <path d="M -8 -1 L 20 16" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M -3 0 L 20 16" stroke="#FFD700" strokeWidth="0.4" fill="none" opacity="0.55" />
        <path d="M 3 2 L 20 16" stroke="#00FFFF" strokeWidth="0.35" fill="none" opacity="0.5" />
        <path d="M 9 5 L 20 16" stroke="#FF007F" strokeWidth="0.3" fill="none" opacity="0.45" />

        <path d="M -18 2 C -23 -1, -21 -7, -16 -4 C -13 -2, -15 1, -18 2" fill="#3300AA" />
        <path d="M -13 0 C -18 -3, -16 -9, -11 -6 C -8 -4, -10 -1, -13 0" fill="#5500CC" />
        <path d="M -8 -1 C -12 -4, -10 -10, -6 -7 C -3 -5, -5 -2, -8 -1" fill="#7F00FF" />
        <path d="M -3 0 C -6 -3, -4 -9, 0 -6 C 3 -4, 1 -1, -3 0" fill="#9F00FF" />

        <path d="M 22 17 C 16 14, 9 10, 3 9 C -3 8, -8 10, -9 13 C -4 13, 5 14, 22 17" fill="#FF007F" opacity="0.45" />
      </g>

      {/* BACK LEG */}
      <g className="leg-back">
        <path d="M 16 26 C 14 28, 14.5 30, 15 32 C 16 32, 17 28, 18 26 Z" fill="#e5e7eb" />
        <path d="M 15 31 L 14.5 34 L 15.5 34 L 16 31 Z" fill="#9ca3af" />
        <path d="M 14.5 34 C 12 35, 11 36, 10 37" stroke="#9ca3af" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M 15 34 C 14 35, 13 37, 13 38" stroke="#6b7280" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M 15.5 34 C 17 35, 18 36, 19 37" stroke="#9ca3af" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <path d="M 10 37 C 9 38, 9 39, 10.5 39 C 10 38.5, 10 37.5, 10 37 Z" fill="#111827" />
        <path d="M 13 38 C 12 39, 12 40, 13.5 40 C 13 39.5, 13 38.5, 13 38 Z" fill="#111827" />
        <path d="M 19 37 C 20 38, 20 39, 18.5 39 C 19 38.5, 19 37.5, 19 37 Z" fill="#111827" />
      </g>

      {/* TAIL */}
      <g className="eagle-tail">
        <path d="M 10 21 C 6 20, 2 20, 0 21 C 3 22, 6 22, 10 21" fill="#FFD700" opacity="0.6" />
        <path d="M 10 20.5 C 7 19.5, 4 19.5, 2 20.5 C 4 21.5, 7 21.5, 10 20.5" fill="#FF007F" opacity="0.5" />
        <path d="M 10 21.5 C 7 21, 4 21, 1 21.5 C 4 22.5, 7 22.5, 10 21.5" fill="#00FFFF" opacity="0.5" />
        <path d="M 10 22 C 6 23, 2 24, 0 23 C 3 22, 6 21.5, 10 22" fill="#7F00FF" opacity="0.65" />
        <path d="M 10 22.5 C 7 24, 4 24.5, 2 23.5 C 4 22.5, 7 22, 10 22.5" fill="#FFD700" opacity="0.5" />

        <path d="M 10 21 C 5 17, -5 14, -22 13.5 C -17 16, -1 19, 10 21" fill="url(#tailGrad)" />
        <path d="M -22 13.5 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 10 21 C 5 17.5, -5 15, -22.8 14.5 C -18 17, -1 19.5, 10 21" fill="#7F00FF" opacity="0.95" />
        <path d="M -22.8 14.5 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 10 21 C 5 18, -5 15.8, -23.5 15.3 C -18 17.8, -1 19.8, 10 21" fill="url(#tailGrad)" opacity="0.9" />
        <path d="M -23.5 15.3 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 18.5, -6 16.5, -24.2 16.2 C -19 18.5, -1 20, 10 21" fill="#5500CC" opacity="0.9" />
        <path d="M -24.2 16.2 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.55" />
        <path d="M 10 21 C 4 19, -6 17.2, -24.8 17.0 C -19 19, -1 20.2, 10 21" fill="url(#tailGrad)" opacity="0.95" />
        <path d="M -24.8 17.0 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 19.3, -6 17.8, -25.3 17.8 C -19 19.5, -1 20.5, 10 21" fill="#7F00FF" opacity="1" />
        <path d="M -25.3 17.8 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 10 21 C 4 19.5, -6 18.3, -25.8 18.6 C -19 20, -1 20.7, 10 21" fill="url(#tailGrad)" opacity="0.95" />
        <path d="M -25.8 18.6 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 19.8, -6 18.8, -26.1 19.4 C -19 20.4, -1 20.9, 10 21" fill="#5500CC" opacity="0.9" />
        <path d="M -26.1 19.4 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.55" />
        <path d="M 10 21 C 4 20, -6 19.4, -26.3 20.2 C -19 20.7, -1 21, 10 21" fill="url(#tailGrad)" opacity="0.9" />
        <path d="M -26.3 20.2 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 10 21 C 3 20.5, -7 20, -26.4 21.0 C -19 21.2, -1 21.1, 10 21" fill="#7F00FF" opacity="1" />
        <path d="M -26.4 21.0 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 10 21 C 3 21, -6 21.2, -26.3 21.8 C -19 21.7, -1 21.2, 10 21" fill="url(#tailGrad)" opacity="0.95" />
        <path d="M -26.3 21.8 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 10 21 C 3 21.2, -6 21.8, -26.1 22.6 C -19 22.2, -1 21.4, 10 21" fill="#5500CC" opacity="0.9" />
        <path d="M -26.1 22.6 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.55" />
        <path d="M 10 21 C 4 21.5, -6 22.3, -25.8 23.4 C -19 22.8, -1 21.6, 10 21" fill="url(#tailGrad)" opacity="0.9" />
        <path d="M -25.8 23.4 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 21.8, -6 22.8, -25.3 24.2 C -19 23.3, -1 21.8, 10 21" fill="#7F00FF" opacity="0.95" />
        <path d="M -25.3 24.2 L 10 21" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.65" />
        <path d="M 10 21 C 4 22, -6 23.4, -24.8 25.0 C -19 23.9, -1 22, 10 21" fill="url(#tailGrad)" opacity="0.9" />
        <path d="M -24.8 25.0 L 10 21" stroke="#00FFFF" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 10 21 C 4 22.2, -6 24, -24.2 25.8 C -19 24.4, -1 22.2, 10 21" fill="#5500CC" opacity="0.85" />
        <path d="M -24.2 25.8 L 10 21" stroke="#FF007F" strokeWidth="0.35" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 22.5, -5 24.5, -23.5 26.7 C -18 25, -1 22.5, 10 21" fill="url(#tailGrad)" opacity="0.8" />
        <path d="M -23.5 26.7 L 10 21" stroke="#00FFFF" strokeWidth="0.35" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 22.8, -5 25, -22.8 27.6 C -18 25.6, -1 22.8, 10 21" fill="#7F00FF" opacity="0.8" />
        <path d="M -22.8 27.6 L 10 21" stroke="#FF007F" strokeWidth="0.35" fill="none" opacity="0.5" />
        <path d="M 10 21 C 4 23, -5 25.5, -22 28.5 C -17 26.2, -1 23, 10 21" fill="url(#tailGrad)" opacity="0.75" />
        <path d="M -22 28.5 L 10 21" stroke="#00FFFF" strokeWidth="0.3" fill="none" opacity="0.4" />
      </g>

      {/* BODY */}
      <path d="M 7 21 C 5 22, 10 26, 17 26 C 20 26, 24 25, 28 24 C 32 23, 35 21, 35 18 C 35 15, 32 13, 28 13 C 23 13, 17 15, 13 18 C 9 20, 7 20, 7 21 Z" fill="url(#bodyGrad)" />

      {/* TEXT */}
      <g transform="translate(25, 46)">
        <text
          fontFamily="'Inter', system-ui, sans-serif"
          fontWeight="900"
          textAnchor="middle"
          transform={isFlipped ? "scale(-1, 1)" : ""}
        >
          <tspan x="0" y="0" fontSize="5.5" fill="url(#titleGrad)">{title}</tspan>
          <tspan x="0" y="7" fontSize="4" fill="url(#subGrad)">{subtitle}</tspan>
        </text>
      </g>

      {/* FRONT WING */}
      <g className="wing-front">
        <path
          d="M 22 17 C 28 8, 36 2, 47 -1 C 54 -2, 60 -2, 62 2 C 61 8, 55 14, 49 16 C 42 18, 35 19, 28 19 C 25 19, 23 18, 22 17"
          fill="url(#wingGrad2)"
        />
        <path
          d="M 22 17 C 30 12, 42 7, 53 6 C 61 4, 66 7, 63 11 C 56 13, 42 15, 22 17"
          fill="#5500CC" opacity="0.55"
        />
        <path d="M 62 2 L 24 16" stroke="#FFD700" strokeWidth="0.5" fill="none" opacity="0.75" />
        <path d="M 57 0 L 24 16" stroke="#00FFFF" strokeWidth="0.45" fill="none" opacity="0.65" />
        <path d="M 52 -1 L 24 16" stroke="#FF007F" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 47 0 L 24 16" stroke="#FFD700" strokeWidth="0.4" fill="none" opacity="0.55" />
        <path d="M 41 2 L 24 16" stroke="#00FFFF" strokeWidth="0.35" fill="none" opacity="0.5" />
        <path d="M 35 5 L 24 16" stroke="#FF007F" strokeWidth="0.3" fill="none" opacity="0.45" />

        <path d="M 62 2 C 67 -1, 65 -7, 60 -4 C 57 -2, 59 1, 62 2" fill="#3300AA" />
        <path d="M 57 0 C 67 -3, 65 -9, 55 -6 C 52 -4, 54 -1, 57 0" fill="#5500CC" />
        <path d="M 52 -1 C 56 -4, 54 -10, 50 -7 C 47 -5, 49 -2, 52 -1" fill="#7F00FF" />
        <path d="M 47 0 C 50 -3, 48 -9, 44 -6 C 41 -4, 43 -1, 47 0" fill="#9F00FF" />

        <path d="M 22 17 C 28 14, 35 10, 41 9 C 47 8, 52 10, 53 13 C 48 13, 39 14, 22 17" fill="#FF007F" opacity="0.45" />
      </g>

      {/* FRONT LEG */}
      <g className="leg-front">
        <path d="M 20 27 C 18 29, 18.5 31, 19 33 C 20 33, 21 29, 22 27 Z" fill="#f3f4f6" />
        <path d="M 19 32 L 18.5 35 L 19.5 35 L 20 32 Z" fill="#9ca3af" />
        <path d="M 18.5 35 C 16 36, 15 38, 14 40" stroke="#9ca3af" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 19 35 C 18 37, 17 39, 17 41" stroke="#6b7280" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 19.5 35 C 21 36, 22 38, 23 40" stroke="#9ca3af" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <path d="M 14 40 C 13 41, 13 42, 14.5 42 C 14 41.5, 14 42.5, 14 40 Z" fill="#111827" />
        <path d="M 17 41 C 16 42, 16 43, 17.5 43 C 17 42.5, 17 41.5, 17 41 Z" fill="#111827" />
        <path d="M 23 40 C 24 41, 24 42, 22.5 42 C 23 41.5, 23 40.5, 23 40 Z" fill="#111827" />
      </g>

      {/* HEAD & NECK */}
      <g className="eagle-head">
        <path
          d="M 32 12 C 30 14, 27 15, 25 18 L 27 18 C 26 20, 25 21, 24 23 L 27 22 C 28 24, 29 25, 30 26 L 32 24 C 34 25, 36 24, 38 22 C 41 19, 42 16, 42 13 C 38 12, 35 11, 32 12 Z"
          fill="url(#headGrad)" opacity="0.95"
        />
        <ellipse cx="39" cy="13" rx="7.5" ry="5" fill="url(#headGrad)" />
        <path d="M 34 10 C 37 9, 40 9, 43 10" stroke="#FFD700" strokeWidth="0.6" fill="none" opacity="0.9" />
        <path d="M 36 11 C 39 10, 42 11, 44 13 C 42 12, 38 12, 36 11 Z" fill="#111827" />
        <ellipse cx="37" cy="18" rx="3.5" ry="2" fill="#FF0044" opacity="0.85" />
        <path d="M 34 18 C 35 20, 39 20, 40 18" stroke="#CC0033" strokeWidth="0.4" fill="none" />

        <g className="eagle-beak-upper">
          <path d="M 44.5 12 C 47 11.5, 49.5 13, 49.8 15 C 49.8 17, 48.8 18, 48 18 C 47.2 16.8, 48.2 15.3, 44.5 13 Z" fill="#FFD700" />
          <path d="M 48 15 C 49.5 16, 49.5 18, 48 18 C 47.2 17, 48 16, 48 15 Z" fill="#E6B800" />
          <path d="M 44.5 13 C 46.5 13, 48 14, 48.5 15" stroke="#B8860B" strokeWidth="0.35" fill="none" />
          <ellipse cx="45.5" cy="12.2" rx="0.6" ry="0.4" fill="#B8860B" opacity="0.85" />
        </g>

        <path
          className="eagle-beak-lower"
          d="M 44.5 14 C 46.5 14, 48.5 15, 48.5 16.5 C 47 15.8, 45.8 15, 44.5 14 Z"
          fill="#E6B800"
        />

        <circle cx="38.5" cy="12.5" r="1.8" fill="#111" />
        <circle cx="38.5" cy="12.5" r="1.2" fill="#FF8800" opacity="0.9" />
        <circle cx="38.5" cy="12.5" r="0.55" fill="#000" />
        <circle cx="39.1" cy="11.9" r="0.35" fill="#ffffff" opacity="0.95" />
        <path d="M 36.5 10.8 C 38 10, 40 10, 41.5 10.8" stroke="#CC0055" strokeWidth="0.7" fill="none" opacity="0.9" />
        <circle cx="38.5" cy="12.5" r="1.8" fill="none" stroke="#FFD700" strokeWidth="0.35" opacity="0.7" />
        <path d="M 35 13 C 34 15, 34 17, 35 17 C 35.5 16, 36 14, 35 13 Z" fill="#AA0044" opacity="0.75" />
        <path d="M 33 15 C 35 13, 38 12, 41 13" stroke="#00FFFF" strokeWidth="0.8" fill="none" opacity="0.35" strokeLinecap="round" />
      </g>
    </svg>
  );
}
