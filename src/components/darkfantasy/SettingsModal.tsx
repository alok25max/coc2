import React from 'react';
import { Volume2, VolumeX, RotateCcw, PlusCircle, X, Shield, Sparkles, User } from 'lucide-react';
import { sound } from '../../utils/audio';
import { UserResources } from '../../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  resources: UserResources;
  setResources: React.Dispatch<React.SetStateAction<UserResources>>;
  onResetVillage: () => void;
  onRefillResources: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  setSoundEnabled,
  resources,
  setResources,
  onResetVillage,
  onRefillResources,
}) => {
  if (!isOpen) return null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playDeploy();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-gradient-to-b from-[#131b2e] via-[#0e1628] to-[#080d19] border-2 border-[#b45309] w-full max-w-md rounded-3xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.95)] text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#523b18] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="font-clash-header font-black text-lg text-amber-300 dark-fantasy-gold-text">
                Kingdom Settings
              </h2>
              <p className="text-[11px] text-slate-400">Audio, sandbox cheats, and account configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3 text-xs">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090e1c] border border-[#523b18]">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <span className="font-bold text-slate-200 block">Sound Effects</span>
                <span className="text-[10px] text-slate-400">Combat strikes, cannon bursts & fanfares</span>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Sandbox Resources Refill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090e1c] border border-[#523b18]">
            <div className="flex items-center gap-2.5">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-slate-200 block">Refill Kingdom Treasury</span>
                <span className="text-[10px] text-slate-400">Max out Gold, Elixir, and add 500 Gems</span>
              </div>
            </div>

            <button
              onClick={() => {
                onRefillResources();
                sound.playLootChime();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Refill
            </button>
          </div>

          {/* Reset Village Layout */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#090e1c] border border-rose-900/40">
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <div>
                <span className="font-bold text-rose-200 block">Clear Village Layout</span>
                <span className="text-[10px] text-slate-400">Reset buildings and rebuild from scratch</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset village layout to Level 1 outpost?')) {
                  onResetVillage();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-clash-header font-black text-xs shadow-lg transition-all cursor-pointer"
        >
          Save & Exit
        </button>
      </div>
    </div>
  );
};
