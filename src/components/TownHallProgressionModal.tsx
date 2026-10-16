import React, { useState } from 'react';
import { TownHallAsset } from './TownHallAsset';
import { TOWN_HALL_LEVELS, TownHallLevelInfo } from '../data/clashData';
import { UserResources, PlacedBuilding } from '../types/game';
import { sound } from '../utils/audio';
import { Shield, Sparkles, X, Check, ArrowUpCircle, Hammer, ChevronRight } from 'lucide-react';

interface TownHallProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  onUpgradeToLevel: (level: number) => void;
  resources: UserResources;
}

export const TownHallProgressionModal: React.FC<TownHallProgressionModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onUpgradeToLevel,
  resources,
}) => {
  const [selectedInspectLevel, setSelectedInspectLevel] = useState<number>(currentLevel);

  if (!isOpen) return null;

  const currentInfo = TOWN_HALL_LEVELS.find(l => l.level === currentLevel) || TOWN_HALL_LEVELS[0];
  const inspectedInfo = TOWN_HALL_LEVELS.find(l => l.level === selectedInspectLevel) || currentInfo;

  const handleUpgrade = (targetLvl: number) => {
    const info = TOWN_HALL_LEVELS.find(l => l.level === targetLvl);
    if (!info) return;

    onUpgradeToLevel(targetLvl);
    sound.playSpellCast();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header matching the Reference Image */}
        <div className="relative border-b border-amber-900/40 p-4 sm:p-5 flex items-center justify-between bg-slate-950/60">
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60 hidden sm:block" />
              <h2 className="text-xl sm:text-2xl font-black font-clash-header tracking-wider text-amber-300">
                Town Hall Upgrades
              </h2>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60 hidden sm:block" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Each level brings a new look, more power and new possibilities!
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors border border-slate-700 cursor-pointer absolute right-4 top-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 12 Level Progression Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOWN_HALL_LEVELS.map(item => {
              const isCurrent = item.level === currentLevel;
              const isNext = item.level === currentLevel + 1;
              const isUnlocked = item.level <= currentLevel;
              const canAfford = resources.gold >= item.upgradeCost;

              return (
                <div
                  key={item.level}
                  onClick={() => setSelectedInspectLevel(item.level)}
                  className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/30'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Card Header: Level Shield Badge & Title */}
                  <div className="flex items-start gap-2.5 mb-2">
                    {/* Golden Hexagonal Level Shield Badge */}
                    <div className="flex-shrink-0 w-9 h-11 bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 rounded-lg p-0.5 shadow flex flex-col items-center justify-center border border-yellow-200/50">
                      <span className="text-[8px] font-black tracking-tighter text-slate-950 uppercase leading-none">Level</span>
                      <span className="text-base font-black text-slate-950 leading-none">{item.level}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-slate-100 truncate">{item.name}</h3>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  {/* 3D Isometric Town Hall Building Render */}
                  <div className="w-full h-36 flex items-center justify-center my-1 bg-gradient-to-b from-transparent via-slate-950/30 to-slate-950/60 rounded-xl overflow-hidden relative">
                    <TownHallAsset level={item.level} size={130} animate={true} />
                  </div>

                  {/* 3 Perk Bullets with Icons Matching the Reference Image */}
                  <div className="space-y-1.5 my-2 text-[11px] bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-amber-400 text-xs">🛡️</span>
                      <span className="truncate">{item.unlocks[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-yellow-400 text-xs">🪙</span>
                      <span className="truncate">{item.unlocks[1]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-rose-400 text-xs">⚔️</span>
                      <span className="truncate">{item.unlocks[2]}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Upgrade / Select */}
                  <div className="pt-2 border-t border-slate-800/80">
                    {isCurrent ? (
                      <div className="w-full py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Current Base Level</span>
                      </div>
                    ) : isNext ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(item.level);
                        }}
                        className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-amber-500/20'
                            : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        <span>Upgrade ({item.upgradeCost.toLocaleString()} 🪙)</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(item.level);
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Set Town Hall Lv {item.level}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner with Current Stats & Fast Level Slider */}
        <div className="border-t border-slate-800 p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              Lv {currentLevel}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {currentInfo.name}: {currentInfo.subtitle}
              </div>
              <div className="text-[11px] text-slate-400">
                Hit Points: <span className="text-emerald-400 font-semibold">{currentInfo.hp.toLocaleString()} HP</span> • Max Level: 12
              </div>
            </div>
          </div>

          {currentLevel < 12 && (
            <button
              onClick={() => handleUpgrade(currentLevel + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Upgrade to Level {currentLevel + 1} ({TOWN_HALL_LEVELS[currentLevel]?.upgradeCost.toLocaleString()} Gold)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
