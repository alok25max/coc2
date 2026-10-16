import React, { useState } from 'react';
import { BUILDINGS_DATA } from '../../data/clashData';
import { BuildingType, BuildingCategory } from '../../types/game';
import { sound } from '../../utils/audio';
import { X, Shield, Plus, Sparkles, Check } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuildingToPlace: (type: BuildingType) => void;
  userGold: number;
  userElixir: number;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  onSelectBuildingToPlace,
  userGold,
  userElixir,
}) => {
  const [activeCategory, setActiveCategory] = useState<BuildingCategory | 'all'>('defense');

  if (!isOpen) return null;

  const categories: { id: BuildingCategory | 'all'; label: string; icon: string }[] = [
    { id: 'defense', label: 'Defenses', icon: '🛡️' },
    { id: 'resource', label: 'Resources', icon: '🪙' },
    { id: 'army', label: 'Army Buildings', icon: '⚔️' },
    { id: 'all', label: 'All Items', icon: '🏰' },
  ];

  const handleSelect = (type: BuildingType) => {
    sound.playDeploy();
    onSelectBuildingToPlace(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-gradient-to-b from-[#131b2e] via-[#0e1628] to-[#080d19] border-2 border-[#b45309] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="border-b border-[#523b18] p-4 sm:p-5 flex items-center justify-between bg-[#0a0f1d]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-500 to-yellow-700 flex items-center justify-center text-xl shadow-lg border border-yellow-200/50">
              🪙
            </div>
            <div>
              <h2 className="font-clash-header font-black text-xl text-amber-300 dark-fantasy-gold-text">
                Kingdom Building Shop
              </h2>
              <p className="text-xs text-slate-400">Fortify your village with advanced towers, resource extractors, and army camps</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-3 sm:px-6 bg-[#0a0f1d]/50 border-b border-[#523b18]/60 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                sound.playDeploy();
              }}
              className={`px-4 py-2 rounded-xl font-clash-header font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-[#151f33] text-slate-300 hover:bg-[#1b2740] border border-[#523b18]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(BUILDINGS_DATA)
            .filter(b => activeCategory === 'all' || b.category === activeCategory)
            .map(building => {
              const canAfford =
                building.costType === 'gold'
                  ? userGold >= building.baseCost
                  : userElixir >= building.baseCost;

              return (
                <div
                  key={building.type}
                  className="bg-gradient-to-b from-[#162138] to-[#0c1220] border-2 border-[#523b18] hover:border-[#b45309] rounded-2xl p-3.5 flex flex-col justify-between space-y-3 shadow-lg transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-[#1b2640] to-[#0a0f1d] border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                      {building.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-clash-header font-black text-sm text-slate-100 truncate">
                        {building.name}
                      </h4>
                      <span className="text-[10px] text-amber-400 font-semibold block">
                        Size: {building.width}x{building.height} • Max Lv {building.maxLevel}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        HP: {building.baseHp.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {building.description}
                  </p>

                  <div className="pt-2 border-t border-[#523b18]/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold font-mono">
                      <span>{building.costType === 'gold' ? '🪙' : '🧪'}</span>
                      <span className={canAfford ? 'text-amber-300' : 'text-slate-400'}>
                        {building.baseCost.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelect(building.type)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-clash-header font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Place</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
