import React from 'react';
import { Swords, Shield } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AttackButtonProps {
  onAttack: () => void;
}

export const AttackButton: React.FC<AttackButtonProps> = ({ onAttack }) => {
  const handleClick = () => {
    sound.playDeploy();
    onAttack();
  };

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Primary Massive Red & Antique Gold Attack Button */}
      <button
        onClick={handleClick}
        className="group relative flex flex-col items-center justify-center px-6 py-2.5 rounded-2xl dark-fantasy-btn-red cursor-pointer transition-all duration-150 active:scale-95"
      >
        {/* Antique Gold Metallic Border Rivets */}
        <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900 shadow-sm" />
        <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900 shadow-sm" />
        <div className="absolute bottom-1 left-1.5 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900 shadow-sm" />
        <div className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900 shadow-sm" />

        {/* Crossed Swords Icon */}
        <div className="flex items-center justify-center text-amber-200 mb-0.5 group-hover:scale-110 transition-transform">
          <Swords className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-yellow-300" />
        </div>

        {/* Embossed Bold Fantasy Typography */}
        <span className="font-clash-header font-black text-sm tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Attack!
        </span>
      </button>

      {/* Small Defense Shield Badge beside Attack button (matching reference image) */}
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-[#18233b] to-[#090d18] border-2 border-[#b45309] flex items-center justify-center shadow-lg">
        <Shield className="w-4 h-4 text-sky-400 fill-sky-500/40" />
        <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-rose-600 border border-amber-300 text-[8px] font-black text-white shadow">
          3
        </span>
      </div>
    </div>
  );
};
