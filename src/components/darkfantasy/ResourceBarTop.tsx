import React from 'react';
import { UserResources } from '../../types/game';
import { Shield, Plus, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ResourceBarTopProps {
  resources: UserResources;
  onAddResources: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const ResourceBarTop: React.FC<ResourceBarTopProps> = ({
  resources,
  onAddResources,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playDeploy();
  };

  const formatResource = (num: number) => {
    return num.toLocaleString();
  };

  const freeBuilders = resources.buildersTotal - resources.buildersBusy;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5 select-none">
      {/* 1. Builder Status Pill (matching reference image) */}
      <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#162035] to-[#0c1220] border-2 border-[#523b18] px-2.5 py-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.7)] backdrop-blur">
        {/* Builder Face Avatar Icon */}
        <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-amber-600 to-yellow-800 flex items-center justify-center text-sm shadow-inner border border-amber-400/40">
          👷
        </div>
        <span className="font-clash-header font-black text-xs text-slate-100 dark-fantasy-text-shadow">
          {freeBuilders}/{resources.buildersTotal}
        </span>
      </div>

      {/* 2. Shield Timer Pill (matching reference image) */}
      <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#162035] to-[#0c1220] border-2 border-[#523b18] px-2 py-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.7)] backdrop-blur">
        <div className="w-5 h-5 rounded-md bg-gradient-to-b from-sky-600 to-indigo-800 flex items-center justify-center shadow">
          <Shield className="w-3.5 h-3.5 text-sky-200 fill-sky-400" />
        </div>
        <span className="font-bold text-xs text-sky-200 dark-fantasy-text-shadow font-mono">
          8h 24m
        </span>
        <button
          onClick={onAddResources}
          title="Buy Shield or Refill Resources"
          className="w-4 h-4 rounded bg-gradient-to-b from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 border border-emerald-300/60 flex items-center justify-center text-white font-black text-[10px] shadow transition-transform active:scale-90 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* 3. Gold Counter (matching reference image) */}
      <div className="relative flex items-center bg-gradient-to-b from-[#151e32] via-[#0d1424] to-[#090d18] border-2 border-[#b45309] rounded-2xl pl-3 pr-1 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.85)] min-w-[130px] justify-between">
        <div className="flex flex-col">
          <span className="font-clash-header font-black text-xs text-amber-200 dark-fantasy-gold-text tracking-wide">
            {formatResource(resources.gold)}
          </span>
          <div className="w-20 h-1 bg-slate-900 rounded-full overflow-hidden mt-0.5 border border-[#78350f]/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(245,158,11,0.8)]"
              style={{ width: `${Math.min(100, (resources.gold / resources.maxGold) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3D Glowing Gold Coin Orb on Right */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] border border-[#fef08a] flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.9)] ml-2">
          <span className="text-xs">🪙</span>
        </div>
      </div>

      {/* 4. Elixir Counter (matching reference image) */}
      <div className="relative flex items-center bg-gradient-to-b from-[#151e32] via-[#0d1424] to-[#090d18] border-2 border-[#7e22ce] rounded-2xl pl-3 pr-1 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.85)] min-w-[130px] justify-between">
        <div className="flex flex-col">
          <span className="font-clash-header font-black text-xs text-purple-200 dark-fantasy-text-shadow tracking-wide">
            {formatResource(resources.elixir)}
          </span>
          <div className="w-20 h-1 bg-slate-900 rounded-full overflow-hidden mt-0.5 border border-[#581c87]/60">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(192,38,211,0.8)]"
              style={{ width: `${Math.min(100, (resources.elixir / resources.maxElixir) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3D Glowing Violet/Magenta Elixir Orb */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#f0abfc] via-[#c026d3] to-[#581c87] border border-[#f5d0fe] flex items-center justify-center shadow-[0_0_12px_rgba(192,38,211,0.9)] ml-2">
          <span className="text-xs">🧪</span>
        </div>
      </div>

      {/* 5. Gems Counter (matching reference image) */}
      <div className="relative flex items-center bg-gradient-to-b from-[#151e32] via-[#0d1424] to-[#090d18] border-2 border-[#15803d] rounded-2xl pl-2.5 pr-1 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.85)] min-w-[105px] justify-between">
        {/* Plus Button */}
        <button
          onClick={onAddResources}
          title="Refill Resources (Sandbox Mode)"
          className="w-4 h-4 rounded bg-gradient-to-b from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 border border-emerald-300/60 flex items-center justify-center text-white font-black text-[10px] shadow transition-transform active:scale-90 cursor-pointer mr-1.5"
        >
          <Plus className="w-3 h-3" />
        </button>

        <span className="font-clash-header font-black text-xs text-emerald-200 dark-fantasy-text-shadow tracking-wide">
          {formatResource(resources.gems)}
        </span>

        {/* 3D Glowing Emerald Cut Gem */}
        <div className="w-7 h-7 bg-gradient-to-b from-[#a7f3d0] via-[#10b981] to-[#047857] rotate-45 rounded-md border border-[#a7f3d0] flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.9)] ml-2 scale-90">
          <Sparkles className="w-3.5 h-3.5 text-white -rotate-45 fill-white" />
        </div>
      </div>

      {/* Audio SFX Toggle Button */}
      <button
        onClick={toggleSound}
        title={soundEnabled ? 'Mute Game SFX' : 'Enable Game SFX'}
        className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#162035] to-[#0c1220] border-2 border-[#523b18] hover:border-amber-400/60 text-slate-300 flex items-center justify-center shadow transition-all cursor-pointer"
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-500" />
        )}
      </button>
    </div>
  );
};
