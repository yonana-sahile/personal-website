import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface DigitalClockProps {
  compact?: boolean;
}

export function DigitalClock({ compact = false }: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const strHours = hours.toString().padStart(2, '0');
    const strMinutes = minutes.toString().padStart(2, '0');
    const strSeconds = seconds.toString().padStart(2, '0');

    return { strHours, strMinutes, strSeconds, ampm };
  };

  const { strHours, strMinutes, strSeconds, ampm } = formatTime(time);

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2 glass-panel border border-cyber-blue/30 rounded-lg neon-box-blue group cursor-default">
        <Clock className="w-4 h-4 text-cyber-blue animate-pulse" />
        <div className="flex items-center font-mono text-sm font-bold tracking-wider text-cyber-light">
          <span>{strHours}</span>
          <span className="text-cyber-blue/50 mx-0.5">:</span>
          <span>{strMinutes}</span>
          <span className="text-cyber-blue/50 mx-0.5">:</span>
          <span className="text-cyber-pink drop-shadow-[0_0_5px_rgba(255,0,85,0.8)]">{strSeconds}</span>
          <span className="ml-1.5 text-cyber-blue">{ampm}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 relative z-10">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-3 h-3 text-cyber-blue" />
        <span className="text-[10px] font-mono tracking-widest text-cyber-blue uppercase">Local_Time</span>
      </div>
      <div className="flex items-center justify-center font-mono text-cyber-light gap-2 glass-panel px-5 py-3 rounded-xl border border-cyber-blue/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/5 rounded-full blur-[30px] pointer-events-none group-hover:bg-cyber-blue/10 transition-colors" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-50" />

        <div className="flex flex-col items-center z-10 relative">
          <span className="text-3xl md:text-4xl font-bold leading-none tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{strHours}</span>
        </div>
        <span className="text-2xl md:text-3xl font-bold leading-none animate-[pulse_1s_ease-in-out_infinite] text-cyber-blue/50 z-10 relative">:</span>
        <div className="flex flex-col items-center z-10 relative">
          <span className="text-3xl md:text-4xl font-bold leading-none tracking-tighter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{strMinutes}</span>
        </div>
        <span className="text-2xl md:text-3xl font-bold leading-none animate-[pulse_1s_ease-in-out_infinite] text-cyber-blue/50 z-10 relative">:</span>
        <div className="flex flex-col items-center z-10 relative">
          <span className="text-3xl md:text-4xl font-bold leading-none tracking-tighter text-cyber-pink drop-shadow-[0_0_12px_rgba(255,0,85,0.8)]">{strSeconds}</span>
        </div>

        <div className="flex flex-col items-start justify-center ml-2 z-10 relative h-full">
          <span className="text-sm font-bold leading-none text-cyber-blue">{ampm}</span>
          <span className="text-[10px] tracking-[0.2em] mt-1 text-cyber-light/40 uppercase font-mono">
            UTC{time.getTimezoneOffset() > 0 ? '-' : '+'}{Math.abs(Math.floor(time.getTimezoneOffset() / 60)).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
