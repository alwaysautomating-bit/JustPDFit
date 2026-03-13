
import React, { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export const LaunchScreen: React.FC<Props> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: Main Title Focus (0.5s)
    const t1 = setTimeout(() => setStage(1), 500);
    // Stage 2: Subhead Reveal (1.5s)
    const t2 = setTimeout(() => setStage(2), 1500);
    // Stage 3: Pixelated Line Reveal (2.5s)
    const t3 = setTimeout(() => setStage(3), 2500);
    // Stage 4: Exit (4.0s)
    const t4 = setTimeout(() => setStage(4), 4000);
    // Stage 5: Done (4.5s)
    const t5 = setTimeout(() => onComplete(), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-1000 ${stage === 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Main Headline: JustPDFIt */}
        <h1 className={`text-7xl md:text-9xl font-bold tracking-tighter text-black transition-all duration-1000 ease-out ${
          stage >= 1 ? 'blur-0 opacity-100 scale-100' : 'blur-xl opacity-0 scale-95'
        }`}>
          JustPDFIt
        </h1>

        {/* Subhead: PDF, Powered by AI */}
        <h2 className={`text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-gray-400 transition-all duration-700 delay-300 ${
          stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          PDF, Powered by AI
        </h2>

        {/* Supporting Line: Pixelated Style */}
        <p className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.5em] text-gray-300 transition-all duration-700 delay-500 ${
          stage >= 3 ? 'opacity-100' : 'opacity-0'
        }`} style={{ 
          imageRendering: 'pixelated',
          textShadow: stage >= 3 ? '1px 1px 0px rgba(0,0,0,0.05)' : 'none'
        }}>
          A Document Transformation Experience
        </p>
      </div>
      
      {/* Visual Accent */}
      <div className={`absolute bottom-20 w-32 h-[1px] bg-gray-100 transition-all duration-1000 ${stage >= 1 ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}></div>
    </div>
  );
};
