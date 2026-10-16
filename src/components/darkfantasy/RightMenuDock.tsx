import React from 'react';
import { Hammer, Users, Settings, BookOpen, FlaskConical, Castle, ChevronUp } from 'lucide-react';
import { sound } from '../../utils/audio';

interface RightMenuDockProps {
  onOpenShop: () => void;
  onOpenArmy: () => void;
  onOpenLab: () => void;
  onOpenCodex: () => void;
  onOpenSettings: () => void;
  onOpenTownHall: () => void;
}

export const RightMenuDock: React.FC<RightMenuDockProps> = ({
  onOpenShop,
  onOpenArmy,
  onOpenLab,
  onOpenCodex,
  onOpenSettings,
  onOpenTownHall,
}) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Menu Panel Quick Action Square Buttons (matching reference image) */}
      <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#131b2e]/95 via-[#0e1628]/95 to-[#080d19]/95 p-1.5 rounded-2xl border-2 border-[#523b18] shadow-[0_6px_20px_rgba(0,0,0,0.8)] backdrop-blur">
        {/* Army Camp Button */}
        <button
          onClick={() => {
            sound.playDeploy();
            onOpenArmy();
          }}
          title="Army Camp & Troop Training"
          className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1c2942] to-[#0f1728] border-2 border-[#b45309] hover:border-[#f59e0b] flex flex-col items-center justify-center text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <span className="text-base">⚔️</span>
          <span className="text-[8px] font-black uppercase text-amber-300 tracking-tight">Army</span>
        </button>

        {/* Laboratory Research Button */}
        <button
          onClick={() => {
            sound.playSpellCast();
            onOpenLab();
          }}
          title="Mystic Research Laboratory"
          className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1c2942] to-[#0f1728] border-2 border-[#7e22ce] hover:border-[#a855f7] flex flex-col items-center justify-center text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <span className="text-base">🧪</span>
          <span className="text-[8px] font-black uppercase text-purple-300 tracking-tight">Lab</span>
        </button>

        {/* Town Hall 12-Tier Upgrades Button */}
        <button
          onClick={() => {
            sound.playDeploy();
            onOpenTownHall();
          }}
          title="Town Hall 1-12 Progression Gallery"
          className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1c2942] to-[#0f1728] border-2 border-[#b45309] hover:border-[#f59e0b] flex flex-col items-center justify-center text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <span className="text-base">🏰</span>
          <span className="text-[8px] font-black uppercase text-amber-300 tracking-tight">Town</span>
        </button>

        {/* Strategy Codex Button */}
        <button
          onClick={() => {
            sound.playDeploy();
            onOpenCodex();
          }}
          title="Strategy Codex Manual"
          className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1c2942] to-[#0f1728] border-2 border-[#523b18] hover:border-[#b45309] flex flex-col items-center justify-center text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <span className="text-base">📜</span>
          <span className="text-[8px] font-black uppercase text-slate-300 tracking-tight">Wiki</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            sound.playDeploy();
            onOpenSettings();
          }}
          title="Settings & Audio"
          className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1c2942] to-[#0f1728] border-2 border-[#523b18] hover:border-[#b45309] flex flex-col items-center justify-center text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <Settings className="w-4 h-4 text-slate-300" />
          <span className="text-[8px] font-black uppercase text-slate-400 tracking-tight">Setup</span>
        </button>
      </div>

      {/* Prominent Shop Button with Gold Coins & Hammer (matching reference image) */}
      <button
        onClick={() => {
          sound.playDeploy();
          onOpenShop();
        }}
        className="relative group flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-[#1f2a42] via-[#121a2d] to-[#090e1a] border-3 border-[#b45309] hover:border-[#f59e0b] shadow-[0_8px_24px_rgba(0,0,0,0.9)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Metal Corner Rivets */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />

        {/* Stacked Gold Coins & Hammer Icon */}
        <div className="flex items-center justify-center text-xl mb-0.5 group-hover:scale-110 transition-transform">
          <span>🪙</span>
        </div>

        {/* Label */}
        <span className="font-clash-header font-black text-xs text-amber-300 dark-fantasy-text-shadow leading-none">
          Shop
        </span>

        {/* Available item badge */}
        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-purple-600 border border-amber-300 text-[9px] font-black text-white shadow-md">
          5
        </span>
      </button>
    </div>
  );
};
