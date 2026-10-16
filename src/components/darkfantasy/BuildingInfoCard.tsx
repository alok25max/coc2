import React from 'react';
import { PlacedBuilding } from '../../types/game';
import { BUILDINGS_DATA, TOWN_HALL_LEVELS } from '../../data/clashData';
import { TownHallAsset } from '../TownHallAsset';
import { sound } from '../../utils/audio';
import { ArrowUpCircle, Trash2, Castle, Info, Shield, X, Sparkles } from 'lucide-react';

interface BuildingInfoCardProps {
  building: PlacedBuilding | null;
  onClose: () => void;
  onUpgrade: () => void;
  onRemove: () => void;
  onOpenTownHallModal?: () => void;
  userGold: number;
}

export const BuildingInfoCard: React.FC<BuildingInfoCardProps> = ({
  building,
  onClose,
  onUpgrade,
  onRemove,
  onOpenTownHallModal,
  userGold,
}) => {
  if (!building) return null;

  const def = BUILDINGS_DATA[building.type];
  if (!def) return null;

  const isTownHall = building.type === 'town_hall';
  const thInfo = isTownHall ? TOWN_HALL_LEVELS[building.level - 1] : null;
  const isMax = building.level >= def.maxLevel;

  // Next level cost
  const nextCost = isTownHall
    ? (TOWN_HALL_LEVELS[building.level]?.upgradeCost || 1000000)
    : Math.round(def.baseCost * Math.pow(1.25, building.level));

  const canAfford = userGold >= nextCost;

  return (
    <div className="relative select-none max-w-sm w-full bg-gradient-to-b from-[#151f35]/95 via-[#0e1628]/95 to-[#080d1a]/95 border-2 border-[#b45309] rounded-3xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.9)] backdrop-blur text-slate-100 animate-in slide-in-from-bottom-4 duration-200">
      {/* Corner Antique Gold Rivets */}
      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />
      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />
      <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />
      <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-yellow-200 border border-amber-900" />

      {/* Header & Close */}
      <div className="flex items-center justify-between border-b border-[#523b18] pb-2 mb-3">
        <span className="font-clash-header font-black text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> Building Info
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Building Artwork & Title (matching reference image) */}
      <div className="flex items-center gap-4 mb-3">
        {/* Render 3D Asset for Town Hall or Category Icon */}
        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-b from-[#1b253d] to-[#0a0f1d] rounded-2xl border border-amber-500/40 p-1 flex items-center justify-center shadow-inner relative overflow-hidden">
          {isTownHall ? (
            <TownHallAsset level={building.level} size={88} animate={true} />
          ) : (
            <span className="text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{def.icon}</span>
          )}
        </div>

        {/* Title, Level & Subtitle */}
        <div className="flex-1 min-w-0">
          <h3 className="font-clash-header font-black text-base text-slate-100 truncate dark-fantasy-text-shadow">
            {def.name}
          </h3>
          <span className="text-xs font-bold text-amber-300 block">
            Level {building.level}
            {thInfo && ` • ${thInfo.subtitle}`}
          </span>
          <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
            {thInfo?.description || def.description}
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-2 bg-[#080d19]/80 p-2.5 rounded-xl border border-[#523b18] mb-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Hit Points</span>
          <span className="font-bold text-emerald-400 font-mono">
            {building.currentHp.toLocaleString()} / {building.maxHp.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block">{def.baseDps > 0 ? 'Damage / Sec' : 'Building Type'}</span>
          <span className="font-bold text-rose-400 font-mono">
            {def.baseDps > 0 ? `${def.baseDps} DPS` : def.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action Buttons: Green Metallic Upgrade Button matching reference */}
      <div className="flex items-center gap-2">
        {isTownHall && onOpenTownHallModal && (
          <button
            onClick={onOpenTownHallModal}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
            title="Inspect 12 Town Hall Levels"
          >
            <Castle className="w-4 h-4" />
          </button>
        )}

        {/* Primary Green Metallic Upgrade Button (matching reference image) */}
        {!isMax ? (
          <button
            onClick={() => {
              sound.playSpellCast();
              onUpgrade();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl dark-fantasy-btn-green font-clash-header font-black text-xs text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <ArrowUpCircle className="w-4 h-4 text-emerald-200" />
            <div className="flex items-center gap-1.5">
              <span>Upgrade</span>
              <span className="text-amber-200 font-sans font-bold text-[11px] bg-slate-950/40 px-2 py-0.5 rounded-md border border-yellow-300/30">
                {nextCost.toLocaleString()} 🪙
              </span>
            </div>
          </button>
        ) : (
          <div className="flex-1 py-2.5 text-center text-xs font-bold text-amber-400 bg-slate-800/60 rounded-xl border border-slate-700">
            Max Level Mastered
          </div>
        )}

        {/* Delete / Remove button */}
        {!isTownHall && (
          <button
            onClick={() => {
              sound.playBuildingDestroyed();
              onRemove();
            }}
            className="p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition-colors cursor-pointer"
            title="Demolish Building"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
