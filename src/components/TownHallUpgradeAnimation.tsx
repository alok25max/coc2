import React, { useEffect } from 'react';
import { TownHallAsset } from './TownHallAsset';
import { TOWN_HALL_LEVELS } from '../data/clashData';
import { Sparkles, Hammer, ArrowUp, Star } from 'lucide-react';

interface TownHallUpgradeAnimationProps {
  newLevel: number;
  onComplete: () => void;
}

export const TownHallUpgradeAnimation: React.FC<TownHallUpgradeAnimationProps> = ({
  newLevel,
  onComplete,
}) => {
  const currentInfo = TOWN_HALL_LEVELS.find(l => l.level === newLevel) || TOWN_HALL_LEVELS[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm cursor-pointer select-none animate-in fade-in duration-200"
    >
      {/* Shockwave Rings */}
      <div className="absolute w-96 h-96 rounded-full border-2 border-amber-400/40 animate-ping pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full border border-yellow-300/30 animate-pulse pointer-events-none" />

      {/* Main Container */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-500/50 p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full mx-4 space-y-4">
        {/* Glow behind model */}
        <div
          className="absolute w-48 h-48 rounded-full blur-3xl -z-10 opacity-60"
          style={{ backgroundColor: currentInfo.themeColor }}
        />

        {/* Construction Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider animate-bounce">
          <Hammer className="w-3.5 h-3.5" />
          <span>Construction Complete!</span>
        </div>

        {/* 3D Asset Preview with bounce animation */}
        <div className="w-44 h-44 my-1 flex items-center justify-center transform transition-all scale-105 hover:scale-110">
          <TownHallAsset level={newLevel} size={170} animate={true} />
        </div>

        {/* Title & Level Details */}
        <div>
          <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="font-clash-header font-black text-xl text-amber-300">
              Town Hall Level {newLevel}
            </span>
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <p className="text-xs font-bold text-slate-300">{currentInfo.subtitle}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">{currentInfo.description}</p>
        </div>

        {/* Unlocks Summary */}
        <div className="w-full bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-left space-y-1.5 text-[11px]">
          <span className="font-bold text-amber-400 text-[10px] uppercase tracking-wider block">New Upgrades Unlocked:</span>
          {currentInfo.unlocks.map((perk, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <span className="text-amber-400">✦</span>
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <span className="text-[10px] text-slate-500">Tap anywhere to continue</span>
      </div>
    </div>
  );
};
