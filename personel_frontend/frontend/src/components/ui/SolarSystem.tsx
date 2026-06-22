import React from 'react';

export const SolarSystem: React.FC = () => {
    const planets = [
        { name: 'Mercury', size: 16,  distance: 70,  speed: 4,   color: '#A5A5A5', type: 'rock' },
        { name: 'Venus',   size: 28, distance: 100,  speed: 7,   color: '#E3BB76', type: 'venus' },
        { name: 'Earth',   size: 32, distance: 140, speed: 12,  color: '#2E86C1', type: 'earth' },
        { name: 'Mars',    size: 24,  distance: 180, speed: 20,  color: '#C0392B', type: 'mars' },
        { name: 'Jupiter', size: 80, distance: 260, speed: 35,  color: '#D4AC0D', type: 'jupiter' },
        { name: 'Saturn',  size: 70, distance: 340, speed: 50,  color: '#F7DC6F', type: 'saturn' },
        { name: 'Uranus',  size: 45, distance: 410, speed: 70,  color: '#5DADE2', type: 'uranus' },
        { name: 'Neptune', size: 42, distance: 470, speed: 85,  color: '#1F618D', type: 'neptune' },
        { name: 'Pluto',   size: 12,  distance: 520, speed: 100, color: '#D7BDE2', type: 'rock' },
    ];

    return (
        <div className="solar-system-wrapper">
            <div className="solar-system">
                <div className="sun">
                    <div className="sun-glow"></div>
                </div>
                {planets.map((p, i) => (
                    <div key={p.name} className="orbit" style={{
                        width: `${p.distance * 2}px`,
                        height: `${p.distance * 2}px`,
                        animationDuration: `${p.speed}s`,
                        zIndex: 50 - i
                    }}>
                        <div className="planet-pos">
                            <div className={`planet ${p.type}`} style={{
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                '--planet-size': `${p.size}px`
                            } as React.CSSProperties}>
                                {p.name === 'Saturn' && <div className="saturn-rings"></div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .solar-system-wrapper {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    overflow: visible;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 1200px;
                    z-index: 20;
                }
                .solar-system {
                    position: relative;
                    width: 0; height: 0;
                    transform-style: preserve-3d;
                    transform: rotateX(65deg) scale(0.6);
                }
                .sun {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 120px; height: 120px;
                    transform: translate(-50%, -50%) rotateX(-65deg);
                    background: radial-gradient(circle, #ffd700, #ff8c00);
                    border-radius: 50%;
                    box-shadow: 0 0 60px #ff4500, 0 0 120px rgba(255, 69, 0, 0.4);
                    z-index: 100;
                }
                .sun-glow {
                    position: absolute;
                    top: -100%; left: -100%;
                    width: 300%; height: 300%;
                    background: radial-gradient(circle, rgba(255, 200, 0, 0.15), transparent 70%);
                    animation: sun-pulse 6s ease-in-out infinite alternate;
                }
                @keyframes sun-pulse {
                    0% { transform: scale(0.9); opacity: 0.4; }
                    100% { transform: scale(1.1); opacity: 0.7; }
                }
                .orbit {
                    position: absolute;
                    top: 50%; left: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transform-style: preserve-3d;
                    animation-name: orbit-rotate;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                .planet-pos {
                    position: absolute;
                    top: 0; left: 50%;
                    transform: translate(-50%, -50%);
                    transform-style: preserve-3d;
                }
                .planet {
                    border-radius: 50%;
                    transform: rotateX(-65deg);
                    position: relative;
                    box-shadow: inset -2px -2px 6px rgba(0,0,0,0.8);
                }
                .planet.rock {
                    background: radial-gradient(circle at 30% 30%, #a1a1a1, #595959);
                }
                .planet.venus {
                    background: radial-gradient(circle at 30% 30%, #e6dbb5, #cfa832);
                }
                .planet.earth {
                    background: radial-gradient(circle at 30% 30%, #4facfe, #00f2fe);
                    background-image: radial-gradient(circle at 40% 40%, #2980b9, #0a2e45);
                    box-shadow: inset -3px -3px 8px rgba(0,0,0,0.8), 0 0 5px rgba(79, 172, 254, 0.4);
                }
                .planet.mars {
                    background: radial-gradient(circle at 30% 30%, #e74c3c, #922b21);
                }
                .planet.jupiter {
                    background: linear-gradient(180deg, #9e8e74 0%, #d1b894 20%, #8c7659 40%, #d1b894 60%, #9e8e74 80%, #6e5c43 100%);
                    box-shadow: inset -4px -4px 10px rgba(0,0,0,0.7);
                }
                .planet.saturn {
                    background: radial-gradient(circle at 30% 30%, #f4d03f, #b7950b);
                }
                .saturn-rings {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 220%; height: 220%;
                    border-radius: 50%;
                    border: 8px solid rgba(212, 172, 13, 0.5);
                    border-top-color: rgba(212, 172, 13, 0.2);
                    transform: translate(-50%, -50%) rotateX(75deg);
                    box-shadow: 0 0 0 2px rgba(212, 172, 13, 0.1);
                }
                .planet.uranus {
                    background: radial-gradient(circle at 30% 30%, #aed6f1, #2e86c1);
                }
                .planet.neptune {
                    background: radial-gradient(circle at 30% 30%, #5dade2, #1b4f72);
                }
                @keyframes orbit-rotate {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
