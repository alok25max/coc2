import React, { useState } from 'react';
import { UserResources } from '../types/game';
import { TROOPS_DATA, SPELLS_DATA } from '../data/clashData';
import { sound } from '../utils/audio';
import { Sparkles, ArrowUpCircle, CheckCircle2, FlaskConical, Zap, Shield } from 'lucide-react';

interface LaboratoryProps {
  resources: UserResources;
  setResources: React.Dispatch<React.SetStateAction<UserResources>>;
  troopLevels: Record<string, number>;
  setTroopLevels: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  spellLevels: Record<string, number>;
  setSpellLevels: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const Laboratory: React.FC<LaboratoryProps> = ({
  resources,
  setResources,
  troopLevels,
  setTroopLevels,
  spellLevels,
  setSpellLevels,
}) => {
  const [activeCategory, setActiveCategory] = useState<'troops' | 'spells'>('troops');

  const handleUpgradeTroop = (troopId: string) => {
    const currentLvl = troopLevels[troopId] || 1;
    if (currentLvl >= 12) return;

    const cost = Math.round(50000 * Math.pow(1.3, currentLvl));
    if (resources.elixir < cost) {
      sound.playBuildingDestroyed();
      return;
    }

    setResources(prev => ({
      ...prev,
      elixir: Math.max(0, prev.elixir - cost),
    }));

    setTroopLevels(prev => ({
      ...prev,
      [troopId]: currentLvl + 1,
    }));

    sound.playSpellCast();
  };

  const handleUpgradeSpell = (spellId: string) => {
    const currentLvl = spellLevels[spellId] || 1;
    if (currentLvl >= 10) return;

    const cost = Math.round(60000 * Math.pow(1.35, currentLvl));
    if (resources.elixir < cost) {
      sound.playBuildingDestroyed();
      return;
    }

    setResources(prev => ({
      ...prev,
      elixir: Math.max(0, prev.elixir - cost),
    }));

    setSpellLevels(prev => ({
      ...prev,
      [spellId]: currentLvl + 1,
    }));

    sound.playSpellCast();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-3xl shadow-lg">
            🧪
          </div>
          <div>
            <h1 className="text-xl font-bold font-clash-header text-amber-300">Mystic Research Laboratory</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Empower your warriors and intensify arcane battle spells with ancient alchemical research.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setActiveCategory('troops')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeCategory === 'troops' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Troop Upgrades
          </button>
          <button
            onClick={() => setActiveCategory('spells')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeCategory === 'spells' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spell Research
          </button>
        </div>
      </div>

      {/* Grid of Upgrades */}
      {activeCategory === 'troops' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(TROOPS_DATA).map(troop => {
            const level = troopLevels[troop.id] || 1;
            const cost = Math.round(50000 * Math.pow(1.3, level));
            const canAfford = resources.elixir >= cost;
            const isMax = level >= 12;

            const buffedDps = Math.round(troop.baseDps * (1 + (level - 1) * 0.15));
            const buffedHp = Math.round(troop.baseHp * (1 + (level - 1) * 0.18));

            return (
              <div
                key={troop.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow">
                      {troop.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{troop.name}</h3>
                      <span className="text-xs font-semibold text-amber-400">Level {level} / 12</span>
                    </div>
                  </div>

                  {isMax ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      MAX
                    </span>
                  ) : (
                    <span className="text-xs text-purple-400 font-bold">{cost.toLocaleString()} 🧪</span>
                  )}
                </div>

                {/* Level Up Stats comparison */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Current DPS</span>
                    <span className="font-bold text-rose-400">{buffedDps}</span>
                    {!isMax && (
                      <span className="text-[10px] text-emerald-400 block font-semibold">
                        → {Math.round(troop.baseDps * (1 + level * 0.15))}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hit Points</span>
                    <span className="font-bold text-emerald-400">{buffedHp}</span>
                    {!isMax && (
                      <span className="text-[10px] text-emerald-400 block font-semibold">
                        → {Math.round(troop.baseHp * (1 + level * 0.18))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Upgrade Button */}
                <button
                  onClick={() => handleUpgradeTroop(troop.id)}
                  disabled={isMax || !canAfford}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isMax
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{isMax ? 'Fully Mastered' : canAfford ? 'Upgrade in Lab' : 'Need More Elixir'}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(SPELLS_DATA).map(spell => {
            const level = spellLevels[spell.id] || 1;
            const cost = Math.round(60000 * Math.pow(1.35, level));
            const canAfford = resources.elixir >= cost;
            const isMax = level >= 10;

            return (
              <div
                key={spell.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-3xl shadow">
                      {spell.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{spell.name}</h3>
                      <span className="text-xs font-semibold text-purple-400">Level {level} / 10</span>
                    </div>
                  </div>

                  {isMax ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      MAX
                    </span>
                  ) : (
                    <span className="text-xs text-purple-400 font-bold">{cost.toLocaleString()} 🧪</span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{spell.description}</p>

                {/* Upgrade Button */}
                <button
                  onClick={() => handleUpgradeSpell(spell.id)}
                  disabled={isMax || !canAfford}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isMax
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : canAfford
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{isMax ? 'Max Power Reached' : canAfford ? 'Intensify Spell' : 'Need More Elixir'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
