import React from 'react';
import { ArmySlot, SpellSlot, TroopId, SpellId, UserResources } from '../types/game';
import { TROOPS_DATA, SPELLS_DATA, PRESET_ARMIES } from '../data/clashData';
import { sound } from '../utils/audio';
import { Users, Sparkles, Plus, Minus, Trash2, Swords, CheckCircle2, BookmarkCheck } from 'lucide-react';

interface ArmyPlannerProps {
  playerArmy: ArmySlot[];
  setPlayerArmy: React.Dispatch<React.SetStateAction<ArmySlot[]>>;
  playerSpells: SpellSlot[];
  setPlayerSpells: React.Dispatch<React.SetStateAction<SpellSlot[]>>;
  resources: UserResources;
  setResources: React.Dispatch<React.SetStateAction<UserResources>>;
  onGoToBattle: () => void;
}

const MAX_HOUSING_SPACE = 280;
const MAX_SPELL_SPACE = 11;

export const ArmyPlanner: React.FC<ArmyPlannerProps> = ({
  playerArmy,
  setPlayerArmy,
  playerSpells,
  setPlayerSpells,
  resources,
  setResources,
  onGoToBattle,
}) => {
  // Calculate total used housing space
  const currentHousingSpace = playerArmy.reduce((acc, slot) => {
    const def = TROOPS_DATA[slot.troopId];
    return acc + (def?.housingSpace || 0) * slot.count;
  }, 0);

  // Calculate total used spell space
  const currentSpellSpace = playerSpells.reduce((acc, slot) => {
    const def = SPELLS_DATA[slot.spellId];
    return acc + (def?.housingSpace || 0) * slot.count;
  }, 0);

  // Calculate total army elixir and dark elixir cost
  const totalElixirCost = playerArmy.reduce((acc, slot) => {
    const def = TROOPS_DATA[slot.troopId];
    if (def?.costType === 'elixir') {
      return acc + def.cost * slot.count;
    }
    return acc;
  }, 0);

  const totalDarkElixirCost = playerArmy.reduce((acc, slot) => {
    const def = TROOPS_DATA[slot.troopId];
    if (def?.costType === 'dark_elixir') {
      return acc + def.cost * slot.count;
    }
    return acc;
  }, 0);

  const handleAddTroop = (troopId: TroopId, count: number = 1) => {
    const def = TROOPS_DATA[troopId];
    if (!def) return;

    if (def.isHero) {
      // Heroes have max count 1
      const exists = playerArmy.find(s => s.troopId === troopId);
      if (exists && exists.count >= 1) return;
    } else {
      if (currentHousingSpace + def.housingSpace * count > MAX_HOUSING_SPACE) return;
    }

    setPlayerArmy(prev => {
      const idx = prev.findIndex(s => s.troopId === troopId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], count: updated[idx].count + count };
        return updated;
      }
      return [...prev, { troopId, count }];
    });

    sound.playDeploy();
  };

  const handleRemoveTroop = (troopId: TroopId, count: number = 1) => {
    setPlayerArmy(prev => {
      return prev
        .map(s => (s.troopId === troopId ? { ...s, count: Math.max(0, s.count - count) } : s))
        .filter(s => s.count > 0);
    });
    sound.playDeploy();
  };

  const handleAddSpell = (spellId: SpellId, count: number = 1) => {
    const def = SPELLS_DATA[spellId];
    if (!def) return;
    if (currentSpellSpace + def.housingSpace * count > MAX_SPELL_SPACE) return;

    setPlayerSpells(prev => {
      const idx = prev.findIndex(s => s.spellId === spellId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], count: updated[idx].count + count };
        return updated;
      }
      return [...prev, { spellId, count }];
    });

    sound.playSpellCast();
  };

  const handleRemoveSpell = (spellId: SpellId, count: number = 1) => {
    setPlayerSpells(prev => {
      return prev
        .map(s => (s.spellId === spellId ? { ...s, count: Math.max(0, s.count - count) } : s))
        .filter(s => s.count > 0);
    });
    sound.playSpellCast();
  };

  const handleLoadPresetArmy = (presetKey: string) => {
    const preset = PRESET_ARMIES[presetKey];
    if (preset) {
      setPlayerArmy(preset.troops);
      setPlayerSpells(preset.spells);
      sound.playVictory();
    }
  };

  const handleClearArmy = () => {
    setPlayerArmy([]);
    setPlayerSpells([]);
    sound.playBuildingDestroyed();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Housing Space & Quick Actions */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-clash-header text-amber-300">Army Camp & Training Barracks</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Assemble your raid compositions, balance ground tanks with air strikes, and brew tactical combat spells.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearArmy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Army</span>
            </button>
            <button
              onClick={onGoToBattle}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4" />
              <span>Deploy into Battle</span>
            </button>
          </div>
        </div>

        {/* Housing Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Troop Housing Space */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Troop Housing Capacity
              </span>
              <span className="font-bold text-slate-200">
                {currentHousingSpace} / {MAX_HOUSING_SPACE} Space
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentHousingSpace / MAX_HOUSING_SPACE) * 100)}%` }}
              />
            </div>
          </div>

          {/* Spell Storage Capacity */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Spell Factory Capacity
              </span>
              <span className="font-bold text-slate-200">
                {currentSpellSpace} / {MAX_SPELL_SPACE} Bottles
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (currentSpellSpace / MAX_SPELL_SPACE) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pro Army Presets Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" /> Meta Presets:
          </span>
          {Object.entries(PRESET_ARMIES).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleLoadPresetArmy(key)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>⚔️</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Troop Roster Training Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <span>⚔️</span> Regular Troops & Royal Heroes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.values(TROOPS_DATA).map(troop => {
            const currentSlot = playerArmy.find(s => s.troopId === troop.id);
            const currentCount = currentSlot?.count || 0;

            return (
              <div
                key={troop.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow">
                      {troop.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{troop.name}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>{troop.isHero ? 'Hero' : `${troop.housingSpace} Space`}</span>
                        <span>•</span>
                        <span className={troop.costType === 'elixir' ? 'text-purple-400' : 'text-slate-300'}>
                          {troop.cost > 0 ? `${troop.cost.toLocaleString()} ${troop.costType}` : 'Immortal'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Count Badge */}
                  {currentCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md">
                      x{currentCount}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{troop.description}</p>

                {/* Troop Mini Stats */}
                <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-950/60 p-2 rounded-xl text-center">
                  <div>
                    <span className="text-slate-500 block">DPS</span>
                    <span className="font-bold text-rose-400">{troop.baseDps}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">HP</span>
                    <span className="font-bold text-emerald-400">{troop.baseHp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target</span>
                    <span className="font-bold text-sky-400 capitalize truncate block">{troop.favoriteTarget}</span>
                  </div>
                </div>

                {/* Training Increments */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRemoveTroop(troop.id, 1)}
                      disabled={currentCount === 0}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAddTroop(troop.id, 1)}
                      disabled={!troop.isHero && currentHousingSpace + troop.housingSpace > MAX_HOUSING_SPACE}
                      className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!troop.isHero && (
                    <button
                      onClick={() => handleAddTroop(troop.id, 5)}
                      disabled={currentHousingSpace + troop.housingSpace * 5 > MAX_HOUSING_SPACE}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                    >
                      +5
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spell Factory Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <span>🔮</span> Spell Factory Concoctions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {Object.values(SPELLS_DATA).map(spell => {
            const currentSlot = playerSpells.find(s => s.spellId === spell.id);
            const currentCount = currentSlot?.count || 0;

            return (
              <div
                key={spell.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 hover:border-purple-500/30 transition-all shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-2xl shadow">
                      {spell.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-100">{spell.name}</h3>
                      <span className="text-[10px] text-purple-400 font-semibold">{spell.housingSpace} Bottle Space</span>
                    </div>
                  </div>

                  {currentCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white font-black text-xs shadow-md">
                      x{currentCount}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{spell.description}</p>

                {/* Spell Controls */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  <button
                    onClick={() => handleRemoveSpell(spell.id, 1)}
                    disabled={currentCount === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAddSpell(spell.id, 1)}
                    disabled={currentSpellSpace + spell.housingSpace > MAX_SPELL_SPACE}
                    className="flex-1 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Brew
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
