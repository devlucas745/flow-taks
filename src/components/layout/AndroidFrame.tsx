import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900/95 flex flex-col items-center justify-start md:justify-center p-0 md:p-4 text-slate-900 selection:bg-blue-100">
      {/* Top Device Bar & Quick Switcher for preview */}
      <div className="w-full max-w-md hidden md:flex items-center justify-between py-2 px-3 text-xs text-slate-300 font-medium select-none mb-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200 font-semibold tracking-wide">FlowTask Android Nativo</span>
          <span className="text-slate-400 text-[11px] font-mono">v1.0 (Jetpack Compose)</span>
        </div>
        <button
          onClick={() => setIsDeviceFrame(!isDeviceFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors shadow-xs"
          title="Alternar entre Moldura Android e Tela Cheia"
        >
          {isDeviceFrame ? (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Tela Cheia</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Moldura Android</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container - Either phone shell or full container */}
      <div
        className={`w-full bg-slate-50 transition-all duration-300 flex flex-col overflow-hidden relative ${
          isDeviceFrame
            ? 'max-w-[430px] h-screen md:h-[880px] md:max-h-[92vh] md:rounded-[44px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_10px_#1e293b,0_0_0_12px_#334155]'
            : 'max-w-2xl h-screen md:h-[92vh] md:rounded-2xl shadow-2xl'
        }`}
      >
        {/* Android Status Bar (top notch, clock, icons) */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between select-none border-b border-slate-100/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 tracking-tight">
            <span>{currentTime}</span>
          </div>

          {/* Android Punch Hole Camera */}
          <div className="w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center ring-2 ring-slate-800/20 shadow-inner">
            <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
          </div>

          <div className="flex items-center gap-2 text-slate-800">
            <span className="text-[10px] font-bold tracking-tight">5G</span>
            <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">98%</span>
              <Battery className="w-4 h-4 stroke-[2.2] fill-slate-800" />
            </div>
          </div>
        </div>

        {/* Dynamic App Content Body */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative bg-slate-50">
          {children}
        </div>

        {/* Android System Gesture Navigation Bar Pill */}
        <div className="bg-white py-1.5 flex justify-center items-center shrink-0 border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
