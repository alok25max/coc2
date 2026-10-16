import React from 'react';
import { UserResources } from '../types/game';
import { Volume2, VolumeX, Shield, Hammer, Sparkles, PlusCircle, ArrowLeft, Castle } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  resources: UserResources;
  onAddResources: () => void;
  activeTab: 'village' | 'battle' | 'army' | 'lab' | 'codex';
  setActiveTab: (tab: 'village' | 'battle' | 'army' | 'lab' | 'codex') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenTownHallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  resources,
  onAddResources,
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onOpenTownHallModal,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playDeploy();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Only render Navbar on non-village sub-tabs (Army, Lab, Codex, Battle)
  // because the village view has its own immersive Dark Fantasy HUD!
  if (activeTab === 'village') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#131b2e]/98 via-[#0e1628]/98 to-[#090d18]/98 backdrop-blur border-b-2 border-[#b45309] shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
      {/* Top resource bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Back to Village + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playDeploy();
              setActiveTab('village');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-clash-header font-black text-xs shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Village</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-clash-header font-black text-base tracking-wider text-amber-300 dark-fantasy-gold-text">
              {activeTab === 'battle' && '⚔️ Raid Battlefield'}
              {activeTab === 'army' && '⛺ Army Camp & Barracks'}
              {activeTab === 'lab' && '🧪 Mystic Laboratory'}
              {activeTab === 'codex' && '📜 Strategy Codex Manual'}
            </span>

            <button
              onClick={onOpenTownHallModal}
              title="Click to view all 12 Town Hall Upgrades"
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/50 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span>🏰</span>
              <span>TH {resources.townHallLevel}</span>
            </button>
          </div>
        </div>

        {/* Resources Badges in Dark Fantasy Stone Frames */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Gold */}
          <div className="bg-[#0b101c] border border-[#b45309] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-inner">
            <span>🪙</span>
            <span className="font-bold text-amber-300 font-mono">{formatNumber(resources.gold)}</span>
          </div>

          {/* Elixir */}
          <div className="bg-[#0b101c] border border-[#7e22ce] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-inner">
            <span>🧪</span>
            <span className="font-bold text-purple-300 font-mono">{formatNumber(resources.elixir)}</span>
          </div>

          {/* Gems */}
          <div className="bg-[#0b101c] border border-[#15803d] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span className="font-bold text-emerald-300 font-mono">{formatNumber(resources.gems)}</span>
          </div>

          {/* Refill Button */}
          <button
            onClick={onAddResources}
            title="Refill Resources"
            className="p-1 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Refill</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Secondary navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto border-t border-[#523b18]/60 gap-1 py-1">
        {[
          { id: 'village' as const, label: 'Village Base', icon: '🏰' },
          { id: 'battle' as const, label: 'Attack Simulator', icon: '⚔️' },
          { id: 'army' as const, label: 'Army Camp', icon: '⛺' },
          { id: 'lab' as const, label: 'Laboratory', icon: '🧪' },
          { id: 'codex' as const, label: 'Strategy Codex', icon: '📜' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                sound.playDeploy();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-clash-header font-bold text-xs tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151f33]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
