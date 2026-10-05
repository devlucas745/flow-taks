import React, { useEffect, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 text-center select-none min-h-[500px]">
      <div className="w-full flex justify-end">
        <button
          onClick={onFinish}
          className="text-xs font-semibold text-slate-400 hover:text-[#3A65F0] transition-colors py-1 px-3 rounded-full hover:bg-blue-50"
        >
          Pular
        </button>
      </div>

      <div className="flex flex-col items-center my-auto">
        {/* Animated Brand Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-[#3A65F0] shadow-xl shadow-blue-500/30 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
            {/* Check and Arrow Combined Visual Identity */}
            <div className="relative">
              <Check className="w-12 h-12 text-white stroke-[3] -translate-x-1 -translate-y-1" />
              <ArrowRight className="w-7 h-7 text-blue-200 stroke-[3] absolute bottom-0 right-0 translate-x-1.5 translate-y-1" />
            </div>
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-blue-400/20 blur-lg -z-10 animate-pulse" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Flow<span className="text-[#3A65F0]">Task</span>
        </h1>

        {/* Slogan */}
        <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
          "Organize hoje. Conquiste amanhã."
        </p>
      </div>

      {/* Loading Bar & Native Android Indicator */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#3A65F0] h-full rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium">
          <span>Iniciando ambiente local...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
