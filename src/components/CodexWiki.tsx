import React, { useState } from 'react';
import { BUILDINGS_DATA, TROOPS_DATA, SPELLS_DATA } from '../data/clashData';
import { BookOpen, Shield, Swords, Sparkles, Lightbulb, Compass, Award, Zap } from 'lucide-react';

export const CodexWiki: React.FC = () => {
  const [section, setSection] = useState<'tactics' | 'troops' | 'defenses' | 'spells'>('tactics');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow">
            📜
          </div>
          <div>
            <h1 className="text-xl font-bold font-clash-header text-amber-300">Clash Strategy Codex & War Manual</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Battle mechanics, base defense doctrines, troop synergies, and competitive 3-star strategies.
            </p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          {[
            { id: 'tactics' as const, label: 'Tactics & Funneling', icon: '💡' },
            { id: 'troops' as const, label: 'Troops Compendium', icon: '⚔️' },
            { id: 'defenses' as const, label: 'Defenses Almanac', icon: '🛡️' },
            { id: 'spells' as const, label: 'Spell Chemistry', icon: '🔮' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                section === tab.id ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Display */}
      {section === 'tactics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Lightbulb className="w-5 h-5" />
              <h3>The Golden Rule of Funneling</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Troops will always target the closest building within their sight range. If perimeter collectors and camps are left intact, your main attack force (Pekkas, Giants, Kings) will walk around the ring instead of entering the village core!
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-amber-300 block">Pro Execution:</span>
              <p>1. Deploy 1 Baby Dragon or Wizard on each outer flank to trim edge buildings.</p>
              <p>2. Send Wall Breakers or Jump Spell to create the path toward the Town Hall.</p>
              <p>3. Pour main tanks and damage dealers right down the cleared funnel corridor!</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Compass className="w-5 h-5" />
              <h3>The Queen Walk / Queen Charge</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pairing the Archer Queen with 4-5 Healers lets her operate as an unstoppable autonomous demolition team. With her 5-tile reach, she snipes key defenses while remaining fully healed.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-purple-300 block">Pro Tip:</span>
              <p>Keep a Rage Spell ready when entering Single-Target Inferno or Eagle Artillery range to hyper-boost Healers' recovery rate!</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <Zap className="w-5 h-5" />
              <h3>Air Attack: Zap Dragons & LavaLoon</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Air attacks completely ignore walls and ground-only defenses like Cannons and Mortars. The key threat is always Air Defenses.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-sky-300 block">Calculation:</span>
              <p>Use 3-4 Lightning Spells directly onto enemy Air Defenses to vaporize them before releasing your Dragons or Balloons in a wide spread.</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Shield className="w-5 h-5" />
              <h3>Base Layout Defensive Philosophy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Centralize the Town Hall, Clan Castle, and Eagle Artillery in segmented compartments. Stagger Wizard Towers and Air Defenses so lightning spells cannot hit both at the same time.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-rose-300 block">Anti-3-Star Architecture:</span>
              <p>Place high hit point storages right in front of defensive towers to absorb heavy fire while your cannons shred incoming armies.</p>
            </div>
          </div>
        </div>
      )}

      {section === 'troops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(TROOPS_DATA).map(troop => (
            <div key={troop.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{troop.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{troop.name}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{troop.isHero ? 'Hero' : `${troop.housingSpace} Space`}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{troop.description}</p>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Favorite Target</span>
                  <span className="font-semibold text-sky-400 capitalize">{troop.favoriteTarget}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Movement Speed</span>
                  <span className="font-semibold text-amber-400">{troop.movementSpeed} Tiles/s</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Base DPS</span>
                  <span className="font-semibold text-rose-400">{troop.baseDps}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Base Hit Points</span>
                  <span className="font-semibold text-emerald-400">{troop.baseHp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'defenses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(BUILDINGS_DATA)
            .filter(b => b.category === 'defense' || b.category === 'core')
            .map(building => (
              <div key={building.type} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{building.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{building.name}</h3>
                    <span className="text-xs text-amber-400 font-semibold">{building.width}x{building.height} Size</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{building.description}</p>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">Targets</span>
                    <span className="font-semibold text-sky-400 capitalize">{building.targets.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Attack Range</span>
                    <span className="font-semibold text-amber-400">{building.range} Tiles</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Damage Type</span>
                    <span className="font-semibold text-rose-400 capitalize">{building.damageType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Base Hit Points</span>
                    <span className="font-semibold text-emerald-400">{building.baseHp}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {section === 'spells' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(SPELLS_DATA).map(spell => (
            <div key={spell.id} className="bg-slate-900/80 border border-purple-500/20 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{spell.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{spell.name}</h3>
                  <span className="text-xs text-purple-400 font-semibold">{spell.housingSpace} Bottle Space</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{spell.description}</p>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Radius</span>
                  <span className="font-semibold text-amber-400">{spell.radius} Tiles</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Duration</span>
                  <span className="font-semibold text-sky-400">{spell.durationSec} Seconds</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
