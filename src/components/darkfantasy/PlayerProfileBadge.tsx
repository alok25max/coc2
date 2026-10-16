import React, { useState } from 'react';
import { UserResources } from '../../types/game';
import { Trophy, Shield, Sparkles, User, Award, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

interface PlayerProfileBadgeProps {
  resources: UserResources;
  setResources: React.Dispatch<React.SetStateAction<UserResources>>;
  onOpenTownHallModal?: () => void;
}

export const PlayerProfileBadge: React.FC<PlayerProfileBadgeProps> = ({
  resources,
  setResources,
  onOpenTownHallModal,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(resources.username || 'AlokVerse');

  const username = resources.username || 'AlokVerse';
  const playerLevel = resources.playerLevel || 18;
  const xp = resources.xp ?? 312;
  const maxXp = resources.maxXp || 1000;
  const trophies = resources.trophies ?? 842;

  const handleSaveName = () => {
    if (tempName.trim()) {
      setResources(prev => ({ ...prev, username: tempName.trim() }));
      setIsEditingName(false);
      sound.playSpellCast();
    }
  };

  return (
    <div className="relative select-none flex items-start gap-2">
      {/* Outer Ornate Shield & Frame Container */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#0d1627]/95 via-[#111c33]/95 to-[#0b1220]/95 border-2 border-[#b45309] rounded-2xl p-1.5 pr-3 shadow-[0_8px_20px_rgba(0,0,0,0.8)] backdrop-blur">
        {/* Blue Level Shield Badge with Spiked Gold Edge */}
        <div className="relative flex-shrink-0 w-11 h-12 flex items-center justify-center">
          {/* Spiked Gold Star Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fde047] via-[#b45309] to-[#78350f] rounded-xl rotate-45 scale-90 shadow-md border border-[#fef08a]/60" />
          {/* Inner Blue Shield */}
          <div className="relative z-10 w-9 h-9 bg-gradient-to-b from-[#1e40af] via-[#1d4ed8] to-[#172554] rounded-lg flex items-center justify-center border border-[#93c5fd]/50 shadow-inner">
            <span className="font-clash-header font-black text-sm text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {playerLevel}
            </span>
          </div>
        </div>

        {/* Player Info & XP Bar */}
        <div className="flex flex-col justify-center space-y-1">
          {/* Username & Town Hall Quick Pill */}
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-1.5 py-0.5 rounded bg-slate-900 border border-amber-500/60 text-xs text-amber-200 font-bold focus:outline-none w-24"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-0.5 rounded bg-amber-500 text-slate-950 hover:bg-amber-400"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span
                onClick={() => setIsEditingName(true)}
                title="Click to edit player name"
                className="font-clash-header font-black text-xs text-slate-100 hover:text-amber-300 transition-colors cursor-pointer dark-fantasy-text-shadow tracking-wide flex items-center gap-1"
              >
                {username}
              </span>
            )}

            <button
              onClick={onOpenTownHallModal}
              title="View Town Hall Upgrades"
              className="px-1.5 py-0.2 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-[9px] font-black text-amber-300 transition-all cursor-pointer shadow-sm"
            >
              TH {resources.townHallLevel}
            </button>
          </div>

          {/* Blue Glowing XP Bar */}
          <div className="flex items-center gap-1.5">
            <div className="w-24 h-2.5 bg-[#0a0f1d] rounded-full p-[1px] border border-[#2563eb]/40 shadow-inner relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-[#60a5fa] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.7)] transition-all duration-300"
                style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                {xp} / {maxXp}
              </span>
            </div>
          </div>

          {/* Trophy Counter Badge */}
          <div className="flex items-center gap-1 bg-[#0a101f]/90 px-2 py-0.5 rounded-md border border-[#b45309]/50 shadow-inner w-fit">
            <Trophy className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-bold text-[10px] text-amber-300 dark-fantasy-text-shadow font-mono">
              {trophies}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
