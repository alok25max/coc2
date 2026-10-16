import React, { useState, useEffect, useRef } from 'react';
import {
  PlacedBuilding,
  ActiveTroop,
  ActiveProjectile,
  ActiveSpellZone,
  FloatingText,
  ArmySlot,
  SpellSlot,
  TroopId,
  SpellId,
  BattleResults,
  UserResources,
} from '../types/game';
import { BUILDINGS_DATA, TROOPS_DATA, SPELLS_DATA, PRESET_BASES } from '../data/clashData';
import { TownHallAsset } from './TownHallAsset';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Swords, Play, Pause, FastForward, RotateCcw, Award, Star, Flame, Zap, Shield, Trophy } from 'lucide-react';

interface BattlefieldProps {
  playerArmy: ArmySlot[];
  playerSpells: SpellSlot[];
  baseToAttack: PlacedBuilding[];
  resources: UserResources;
  setResources: React.Dispatch<React.SetStateAction<UserResources>>;
  onReturnToVillage: () => void;
}

const GRID_SIZE = 20;

export const Battlefield: React.FC<BattlefieldProps> = ({
  playerArmy,
  playerSpells,
  baseToAttack,
  resources,
  setResources,
  onReturnToVillage,
}) => {
  // Available deployment counts (decrements as player drops units)
  const [deployableTroops, setDeployableTroops] = useState<{ [key in TroopId]?: number }>({});
  const [deployableSpells, setDeployableSpells] = useState<{ [key in SpellId]?: number }>({});

  const [selectedDeployTroop, setSelectedDeployTroop] = useState<TroopId | null>(null);
  const [selectedDeploySpell, setSelectedDeploySpell] = useState<SpellId | null>(null);

  // Simulation state
  const [buildings, setBuildings] = useState<PlacedBuilding[]>([]);
  const [troops, setTroops] = useState<ActiveTroop[]>([]);
  const [projectiles, setProjectiles] = useState<ActiveProjectile[]>([]);
  const [spellZones, setSpellZones] = useState<ActiveSpellZone[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const [battleSpeed, setBattleSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [battleTimeRemaining, setBattleTimeRemaining] = useState<number>(180); // 3 minutes
  const [battleStarted, setBattleStarted] = useState<boolean>(false);
  const [battleEnded, setBattleEnded] = useState<boolean>(false);
  const [battleResults, setBattleResults] = useState<BattleResults | null>(null);

  const [targetBasePreset, setTargetBasePreset] = useState<string>('custom');

  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Initialize or reset battle
  const initBattle = (presetKey?: string) => {
    let initialBuildings: PlacedBuilding[] = [];

    if (presetKey && PRESET_BASES[presetKey]) {
      initialBuildings = PRESET_BASES[presetKey].buildings.map(b => ({
        ...b,
        id: `battle_${b.id}_${Date.now()}`,
        currentHp: b.maxHp,
      }));
      setTargetBasePreset(presetKey);
    } else if (baseToAttack && baseToAttack.length > 0) {
      initialBuildings = baseToAttack.map(b => ({
        ...b,
        id: `battle_${b.id}_${Date.now()}`,
        currentHp: b.maxHp,
      }));
      setTargetBasePreset('custom');
    } else {
      initialBuildings = PRESET_BASES['hybrid_trophy'].buildings.map(b => ({
        ...b,
        id: `battle_${b.id}_${Date.now()}`,
        currentHp: b.maxHp,
      }));
      setTargetBasePreset('hybrid_trophy');
    }

    setBuildings(initialBuildings);
    setTroops([]);
    setProjectiles([]);
    setSpellZones([]);
    setFloatingTexts([]);
    setBattleTimeRemaining(180);
    setBattleStarted(false);
    setBattleEnded(false);
    setBattleResults(null);
    setIsPaused(false);

    // Populate deployable counts from army planner
    const troopCounts: { [key in TroopId]?: number } = {};
    playerArmy.forEach(slot => {
      troopCounts[slot.troopId] = slot.count;
    });
    setDeployableTroops(troopCounts);

    const spellCounts: { [key in SpellId]?: number } = {};
    playerSpells.forEach(slot => {
      spellCounts[slot.spellId] = slot.count;
    });
    setDeployableSpells(spellCounts);

    // Default select first available troop
    const firstTroop = playerArmy.find(s => s.count > 0);
    setSelectedDeployTroop(firstTroop ? firstTroop.troopId : 'barbarian');
    setSelectedDeploySpell(null);
  };

  useEffect(() => {
    initBattle();
  }, [baseToAttack, playerArmy, playerSpells]);

  // Handle Deploying a Troop onto the Grid
  const handleDeployTroop = (x: number, y: number) => {
    if (battleEnded) return;

    if (selectedDeploySpell) {
      handleDeploySpell(x, y);
      return;
    }

    if (!selectedDeployTroop) return;
    const remainingCount = deployableTroops[selectedDeployTroop] || 0;
    if (remainingCount <= 0) return;

    const troopDef = TROOPS_DATA[selectedDeployTroop];
    if (!troopDef) return;

    // Decrement deploy count
    setDeployableTroops(prev => ({
      ...prev,
      [selectedDeployTroop]: (prev[selectedDeployTroop] || 1) - 1,
    }));

    if (!battleStarted) setBattleStarted(true);

    // Create active troop entity
    const newTroop: ActiveTroop = {
      id: `troop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      troopId: selectedDeployTroop,
      x,
      y,
      currentHp: troopDef.baseHp,
      maxHp: troopDef.baseHp,
      targetBuildingId: null,
      lastAttackTime: 0,
      speed: troopDef.movementSpeed,
    };

    setTroops(prev => [...prev, newTroop]);
    sound.playDeploy();

    // Floating text feedback
    setFloatingTexts(prev => [
      ...prev,
      {
        id: `ft_${Date.now()}_${Math.random()}`,
        x,
        y: y - 0.5,
        text: troopDef.name,
        color: '#fbbf24',
        createdAt: Date.now(),
      },
    ]);
  };

  const handleDeploySpell = (x: number, y: number) => {
    if (!selectedDeploySpell) return;
    const remainingCount = deployableSpells[selectedDeploySpell] || 0;
    if (remainingCount <= 0) return;

    const spellDef = SPELLS_DATA[selectedDeploySpell];
    if (!spellDef) return;

    setDeployableSpells(prev => ({
      ...prev,
      [selectedDeploySpell]: (prev[selectedDeploySpell] || 1) - 1,
    }));

    if (!battleStarted) setBattleStarted(true);
    sound.playSpellCast();

    // Lightning Instant Effect
    if (selectedDeploySpell === 'lightning') {
      sound.playExplosion('small');
      setBuildings(prev =>
        prev.map(b => {
          const dist = Math.hypot(b.x + 1 - x, b.y + 1 - y);
          if (dist <= spellDef.radius) {
            const nextHp = Math.max(0, b.currentHp - spellDef.effectValue);
            return { ...b, currentHp: nextHp, isDestroyed: nextHp <= 0 };
          }
          return b;
        })
      );
      setFloatingTexts(prev => [
        ...prev,
        {
          id: `ft_lt_${Date.now()}`,
          x,
          y,
          text: `⚡ -${spellDef.effectValue} DMG`,
          color: '#38bdf8',
          createdAt: Date.now(),
        },
      ]);
      return;
    }

    // Persistent Zone (Heal, Rage, Freeze, Jump)
    const newZone: ActiveSpellZone = {
      id: `spell_${Date.now()}`,
      spellId: selectedDeploySpell,
      x,
      y,
      radius: spellDef.radius,
      expiresAt: Date.now() + spellDef.durationSec * 1000,
      color: spellDef.color,
    };

    setSpellZones(prev => [...prev, newZone]);
  };

  // Main Simulation Loop
  useEffect(() => {
    if (isPaused || battleEnded) return;

    const tick = () => {
      const now = Date.now();
      const rawDelta = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;
      const dt = Math.min(rawDelta, 0.1) * battleSpeed;

      // 1. Clean expired spell zones
      setSpellZones(prev => prev.filter(z => z.expiresAt > now));

      // 2. Clean floating texts
      setFloatingTexts(prev => prev.filter(ft => now - ft.createdAt < 1200));

      // 3. Update Troops AI & Movement & Combat
      setTroops(prevTroops => {
        const liveBuildings = buildings.filter(b => b.currentHp > 0);
        if (liveBuildings.length === 0) return prevTroops;

        return prevTroops
          .filter(t => t.currentHp > 0)
          .map(troop => {
            const troopDef = TROOPS_DATA[troop.troopId];
            if (!troopDef) return troop;

            // Check if troop is in a Heal or Rage spell zone
            const inHeal = spellZones.some(z => z.spellId === 'heal' && Math.hypot(z.x - troop.x, z.y - troop.y) <= z.radius);
            const inRage = spellZones.some(z => z.spellId === 'rage' && Math.hypot(z.x - troop.x, z.y - troop.y) <= z.radius);

            let hp = troop.currentHp;
            if (inHeal) {
              hp = Math.min(troop.maxHp, hp + 220 * dt);
            }

            const currentSpeed = troopDef.movementSpeed * (inRage ? 1.7 : 1.0);
            const currentDps = troopDef.baseDps * (inRage ? 1.7 : 1.0);

            // Find optimal target building
            let targetB = liveBuildings.find(b => b.id === troop.targetBuildingId);

            // If no target or target destroyed, acquire new target based on troop preference
            if (!targetB || targetB.currentHp <= 0) {
              let candidateBuildings = liveBuildings;

              if (troopDef.favoriteTarget === 'defenses') {
                const defenseOnly = liveBuildings.filter(b => BUILDINGS_DATA[b.type]?.category === 'defense');
                if (defenseOnly.length > 0) candidateBuildings = defenseOnly;
              } else if (troopDef.favoriteTarget === 'resources') {
                const resourceOnly = liveBuildings.filter(b => BUILDINGS_DATA[b.type]?.category === 'resource');
                if (resourceOnly.length > 0) candidateBuildings = resourceOnly;
              } else if (troopDef.favoriteTarget === 'walls') {
                const wallsOnly = liveBuildings.filter(b => b.type === 'wall');
                if (wallsOnly.length > 0) candidateBuildings = wallsOnly;
              }

              // Pick physically nearest building center
              let nearestDist = Infinity;
              let bestTarget: PlacedBuilding | null = null;

              candidateBuildings.forEach(b => {
                const def = BUILDINGS_DATA[b.type];
                const cx = b.x + (def?.width || 1) / 2;
                const cy = b.y + (def?.height || 1) / 2;
                const dist = Math.hypot(cx - troop.x, cy - troop.y);
                if (dist < nearestDist) {
                  nearestDist = dist;
                  bestTarget = b;
                }
              });

              targetB = bestTarget || liveBuildings[0];
            }

            if (!targetB) return { ...troop, currentHp: hp };

            const targetDef = BUILDINGS_DATA[targetB.type];
            const targetCenterX = targetB.x + (targetDef?.width || 1) / 2;
            const targetCenterY = targetB.y + (targetDef?.height || 1) / 2;
            const distToTarget = Math.hypot(targetCenterX - troop.x, targetCenterY - troop.y);

            // In attack range?
            const attackRange = troopDef.attackRange;
            if (distToTarget <= attackRange + (targetDef?.width || 1) / 2) {
              // Attack building!
              if (now - troop.lastAttackTime >= troopDef.attackSpeed * 1000) {
                // Apply damage to target building
                let damage = currentDps * troopDef.attackSpeed;
                if (
                  (troopDef.favoriteTarget === 'resources' && targetDef?.category === 'resource') ||
                  (troopDef.favoriteTarget === 'walls' && targetB.type === 'wall')
                ) {
                  damage *= troopDef.damageMultiplierForFav || 2.0;
                }

                // If wall breaker explodes
                if (troop.troopId === 'wall_breaker') {
                  damage = 3500;
                  sound.playExplosion('large');
                  hp = 0; // dies on detonating
                } else if (troop.troopId === 'archer' || troop.troopId === 'archer_queen') {
                  sound.playBowShoot();
                } else if (troop.troopId === 'wizard') {
                  sound.playMagicFireball();
                } else {
                  sound.playExplosion('small');
                }

                setBuildings(bList =>
                  bList.map(b => {
                    if (b.id === targetB?.id) {
                      const nextBhp = Math.max(0, b.currentHp - damage);
                      if (nextBhp <= 0 && b.currentHp > 0) {
                        sound.playBuildingDestroyed();
                      }
                      return { ...b, currentHp: nextBhp, isDestroyed: nextBhp <= 0 };
                    }
                    return b;
                  })
                );

                return {
                  ...troop,
                  currentHp: hp,
                  targetBuildingId: targetB.id,
                  lastAttackTime: now,
                };
              }

              return { ...troop, currentHp: hp, targetBuildingId: targetB.id };
            }

            // Move closer towards target
            const angle = Math.atan2(targetCenterY - troop.y, targetCenterX - troop.x);
            const moveStep = currentSpeed * dt;
            const nextX = troop.x + Math.cos(angle) * moveStep;
            const nextY = troop.y + Math.sin(angle) * moveStep;

            return {
              ...troop,
              x: nextX,
              y: nextY,
              currentHp: hp,
              targetBuildingId: targetB.id,
            };
          });
      });

      // 4. Defenses Attack Live Troops
      setBuildings(prevBuildings => {
        return prevBuildings.map(building => {
          if (building.currentHp <= 0) return building;
          const bDef = BUILDINGS_DATA[building.type];
          if (!bDef || bDef.category !== 'defense' || bDef.baseDps <= 0) return building;

          // Check if building is frozen by a Freeze spell
          const isFrozen = spellZones.some(
            z => z.spellId === 'freeze' && Math.hypot(z.x - (building.x + bDef.width / 2), z.y - (building.y + bDef.height / 2)) <= z.radius
          );
          if (isFrozen) return building;

          // Find alive troops in range
          const bCenterX = building.x + bDef.width / 2;
          const bCenterY = building.y + bDef.height / 2;

          const eligibleTroops = troops.filter(t => {
            if (t.currentHp <= 0) return false;
            const tDef = TROOPS_DATA[t.troopId];
            if (!tDef) return false;

            // Target check: ground, air, air_and_ground
            if (bDef.targets === 'ground' && tDef.isFlying) return false;
            if (bDef.targets === 'air' && !tDef.isFlying) return false;

            const dist = Math.hypot(t.x - bCenterX, t.y - bCenterY);
            if (dist > bDef.range) return false;
            if (bDef.minRange && dist < bDef.minRange) return false;

            return true;
          });

          if (eligibleTroops.length === 0) return building;

          // Target nearest eligible troop
          eligibleTroops.sort((a, b) => Math.hypot(a.x - bCenterX, a.y - bCenterY) - Math.hypot(b.x - bCenterX, b.y - bCenterY));
          const primaryTarget = eligibleTroops[0];

          // Deal DPS damage directly proportional to dt
          const damageThisTick = bDef.baseDps * dt;

          setTroops(tList =>
            tList.map(t => {
              if (t.id === primaryTarget.id) {
                const nextHp = Math.max(0, t.currentHp - damageThisTick);
                return { ...t, currentHp: nextHp };
              }
              return t;
            })
          );

          return building;
        });
      });

      // 5. Timer countdown
      setBattleTimeRemaining(prev => {
        const next = Math.max(0, prev - dt);
        if (next <= 0 && !battleEnded) {
          endBattle();
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    lastTickTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused, battleEnded, battleSpeed, buildings, troops, spellZones]);

  // Check Victory Condition or Total Annihilation
  const totalBaseHp = buildings.reduce((acc, b) => acc + b.maxHp, 0);
  const currentBaseHp = buildings.reduce((acc, b) => acc + Math.max(0, b.currentHp), 0);
  const destructionPercent = totalBaseHp > 0 ? Math.min(100, Math.round(((totalBaseHp - currentBaseHp) / totalBaseHp) * 100)) : 0;

  const townHall = buildings.find(b => b.type === 'town_hall');
  const isTownHallDestroyed = townHall ? townHall.currentHp <= 0 : false;

  // Star calculation:
  // ★ 1 Star: 50% destruction OR Town Hall destroyed
  // ★★ 2 Stars: 50% destruction AND Town Hall destroyed
  // ★★★ 3 Stars: 100% destruction
  let stars = 0;
  if (destructionPercent === 100) {
    stars = 3;
  } else if (destructionPercent >= 50 && isTownHallDestroyed) {
    stars = 2;
  } else if (destructionPercent >= 50 || isTownHallDestroyed) {
    stars = 1;
  }

  // End Battle Action
  const endBattle = () => {
    setBattleEnded(true);
    setIsPaused(true);

    const goldLoot = Math.round(destructionPercent * 1850);
    const elixirLoot = Math.round(destructionPercent * 1800);
    const darkElixirLoot = Math.round(destructionPercent * 35);
    const trophies = stars === 3 ? 32 : stars === 2 ? 21 : stars === 1 ? 11 : 0;

    const results: BattleResults = {
      stars,
      destructionPercent,
      goldLooted: goldLoot,
      elixirLooted: elixirLoot,
      darkElixirLooted: darkElixirLoot,
      trophiesWon: trophies,
      isTownHallDestroyed,
      totalTimeSec: 180 - battleTimeRemaining,
    };

    setBattleResults(results);

    // Reward player resources
    setResources(prev => ({
      ...prev,
      gold: Math.min(prev.maxGold, prev.gold + goldLoot),
      elixir: Math.min(prev.maxElixir, prev.elixir + elixirLoot),
      darkElixir: Math.min(prev.maxDarkElixir, prev.darkElixir + darkElixirLoot),
    }));

    if (stars > 0) {
      sound.playVictory();
      confetti({
        particleCount: stars === 3 ? 120 : 60,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      sound.playBuildingDestroyed();
    }
  };

  // Auto-end battle when 100% reached
  useEffect(() => {
    if (destructionPercent === 100 && !battleEnded && battleStarted) {
      endBattle();
    }
  }, [destructionPercent, battleEnded, battleStarted]);

  // Activate Hero Ability
  const handleHeroAbility = (troopId: TroopId) => {
    const hero = troops.find(t => t.troopId === troopId && t.currentHp > 0);
    if (!hero) return;

    sound.playSpellCast();

    // Queen Cloak: heals Queen, grants rage speed, summons 4 archers
    if (troopId === 'archer_queen') {
      setTroops(prev => {
        const summoned: ActiveTroop[] = [
          {
            id: `summon_arch_1_${Date.now()}`,
            troopId: 'archer',
            x: hero.x + 0.5,
            y: hero.y,
            currentHp: 120,
            maxHp: 120,
            targetBuildingId: null,
            lastAttackTime: 0,
            speed: 3.5,
          },
          {
            id: `summon_arch_2_${Date.now()}`,
            troopId: 'archer',
            x: hero.x - 0.5,
            y: hero.y,
            currentHp: 120,
            maxHp: 120,
            targetBuildingId: null,
            lastAttackTime: 0,
            speed: 3.5,
          },
        ];
        return prev.map(t => (t.id === hero.id ? { ...t, currentHp: Math.min(t.maxHp, t.currentHp + 1200) } : t)).concat(summoned);
      });
    }

    // King Iron Fist: enrages King, summons 4 brawlers
    if (troopId === 'barbarian_king') {
      setTroops(prev => {
        const summoned: ActiveTroop[] = [
          {
            id: `summon_barb_1_${Date.now()}`,
            troopId: 'barbarian',
            x: hero.x + 0.6,
            y: hero.y,
            currentHp: 250,
            maxHp: 250,
            targetBuildingId: null,
            lastAttackTime: 0,
            speed: 3.2,
          },
          {
            id: `summon_barb_2_${Date.now()}`,
            troopId: 'barbarian',
            x: hero.x - 0.6,
            y: hero.y,
            currentHp: 250,
            maxHp: 250,
            targetBuildingId: null,
            lastAttackTime: 0,
            speed: 3.2,
          },
        ];
        return prev.map(t => (t.id === hero.id ? { ...t, currentHp: Math.min(t.maxHp, t.currentHp + 2500) } : t)).concat(summoned);
      });
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 select-none">
      {/* Combat Status Bar */}
      <div className="bg-gradient-to-b from-[#131b2e] via-[#0e1628] to-[#090d18] border-2 border-[#b45309] p-4 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-4">
        {/* Stars & Destruction Display */}
        <div className="flex items-center gap-6">
          {/* 3 Stars Gauge */}
          <div className="flex items-center gap-1.5 bg-[#090e1c] px-3.5 py-1.5 rounded-2xl border-2 border-[#b45309] shadow-inner">
            {[1, 2, 3].map(starNum => (
              <Star
                key={starNum}
                className={`w-7 h-7 transition-all ${
                  starNum <= stars
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Destruction Percentage */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-clash-header text-2xl font-black text-amber-300 dark-fantasy-gold-text">{destructionPercent}%</span>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Damage</span>
            </div>
            <div className="w-32 h-2.5 bg-slate-900 rounded-full overflow-hidden mt-1 border border-[#523b18]">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                style={{ width: `${destructionPercent}%` }}
              />
            </div>
          </div>

          {/* Town Hall Status */}
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              isTownHallDestroyed
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-md'
                : 'bg-[#090e1c] border-[#523b18] text-slate-400'
            }`}
          >
            <span>🏰</span>
            <span>{isTownHallDestroyed ? 'Town Hall Smashed! (+1★)' : 'Town Hall Standing'}</span>
          </div>
        </div>

        {/* Battle Controls (Speed, Pause, Timer, Surrender) */}
        <div className="flex items-center gap-2.5">
          {/* Timer */}
          <div className="bg-[#090e1c] px-3.5 py-1.5 rounded-2xl border-2 border-[#523b18] text-xs font-mono font-black text-rose-400 shadow-inner flex items-center gap-1.5">
            <span>⏱️</span>
            <span>{formatTimer(battleTimeRemaining)}</span>
          </div>

          {/* Speed Button */}
          <button
            onClick={() => {
              const speeds = [1, 2, 4];
              const nextIndex = (speeds.indexOf(battleSpeed) + 1) % speeds.length;
              setBattleSpeed(speeds[nextIndex]);
              sound.playDeploy();
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#18233b] to-[#0c1220] border-2 border-[#b45309] hover:border-[#f59e0b] text-xs font-black text-amber-300 flex items-center gap-1 cursor-pointer shadow"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{battleSpeed}x</span>
          </button>

          {/* Pause Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-gradient-to-b from-[#18233b] to-[#0c1220] border-2 border-[#523b18] hover:border-amber-400 text-slate-300 cursor-pointer shadow"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Reset / Restart */}
          <button
            onClick={() => initBattle(targetBasePreset)}
            className="p-2 rounded-xl bg-gradient-to-b from-[#18233b] to-[#0c1220] border-2 border-[#523b18] hover:border-amber-400 text-slate-300 cursor-pointer shadow"
            title="Restart Raid"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* End Battle / Surrender (Dark Fantasy Red Button) */}
          <button
            onClick={endBattle}
            disabled={battleEnded}
            className="px-4 py-1.5 rounded-xl dark-fantasy-btn-red text-white font-clash-header font-black text-xs shadow-lg cursor-pointer disabled:opacity-50"
          >
            {battleEnded ? 'Raid Over' : 'Surrender'}
          </button>
        </div>
      </div>

      {/* Hero Abilities Bar (if heroes spawned) */}
      {troops.some(t => (t.troopId === 'archer_queen' || t.troopId === 'barbarian_king') && t.currentHp > 0) && (
        <div className="bg-slate-900/80 border border-amber-500/30 px-4 py-2 rounded-xl flex items-center gap-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Hero Special Abilities:
          </span>
          {troops.some(t => t.troopId === 'archer_queen' && t.currentHp > 0) && (
            <button
              onClick={() => handleHeroAbility('archer_queen')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <span>👑</span>
              <span>Archer Queen: Royal Cloak</span>
            </button>
          )}
          {troops.some(t => t.troopId === 'barbarian_king' && t.currentHp > 0) && (
            <button
              onClick={() => handleHeroAbility('barbarian_king')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer"
            >
              <span>🦁</span>
              <span>Barbarian King: Iron Fist</span>
            </button>
          )}
        </div>
      )}

      {/* Combat Battlefield Canvas Grid */}
      <div className="bg-gradient-to-b from-stone-900 via-slate-950 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Perimeter notice */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5" /> Click anywhere along the grass border to deploy selected troops & spells
          </span>
          <span className="text-slate-500 text-[11px]">
            Troops active: {troops.filter(t => t.currentHp > 0).length} | Defenses standing:{' '}
            {buildings.filter(b => b.currentHp > 0 && BUILDINGS_DATA[b.type]?.category === 'defense').length}
          </span>
        </div>

        {/* 20x20 Interactive Battlefield */}
        <div className="relative p-2 bg-emerald-950/60 border-2 border-amber-900/40 rounded-xl shadow-2xl max-w-full overflow-auto">
          {/* Active Spell Visual Zones */}
          {spellZones.map(zone => (
            <div
              key={zone.id}
              className="absolute rounded-full pointer-events-none transition-opacity duration-300 animate-pulse z-20"
              style={{
                width: `${zone.radius * 2 * 32}px`,
                height: `${zone.radius * 2 * 32}px`,
                left: `${zone.x * 32 - zone.radius * 32}px`,
                top: `${zone.y * 32 - zone.radius * 32}px`,
                backgroundColor: `${zone.color}33`,
                border: `2px dashed ${zone.color}`,
              }}
            />
          ))}

          {/* Floating Damage & Action Texts */}
          {floatingTexts.map(ft => (
            <div
              key={ft.id}
              className="absolute pointer-events-none font-black text-xs z-30 transition-all duration-700 animate-bounce"
              style={{
                left: `${ft.x * 32}px`,
                top: `${ft.y * 32}px`,
                color: ft.color,
                textShadow: '0 0 4px #000',
              }}
            >
              {ft.text}
            </div>
          ))}

          {/* Grid Tiles */}
          <div
            className="grid gap-[1px] bg-emerald-900/30 p-1 rounded-lg border border-emerald-800/30 relative"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(26px, 32px))`,
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(26px, 32px))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
              const x = idx % GRID_SIZE;
              const y = Math.floor(idx / GRID_SIZE);

              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleDeployTroop(x, y)}
                  className={`w-full aspect-square rounded transition-colors cursor-crosshair relative select-none ${
                    (x + y) % 2 === 0 ? 'bg-emerald-950/40 hover:bg-emerald-700/30' : 'bg-emerald-900/20 hover:bg-emerald-700/30'
                  }`}
                />
              );
            })}

            {/* Render Buildings */}
            {buildings.map(building => {
              const def = BUILDINGS_DATA[building.type];
              if (!def) return null;
              const isDestroyed = building.currentHp <= 0;
              const hpPercent = (building.currentHp / building.maxHp) * 100;

              return (
                <div
                  key={building.id}
                  className="absolute pointer-events-none flex flex-col items-center justify-center p-0.5 z-10 transition-transform duration-200"
                  style={{
                    left: `${building.x * 32}px`,
                    top: `${building.y * 32}px`,
                    width: `${def.width * 32}px`,
                    height: `${def.height * 32}px`,
                  }}
                >
                  {building.type === 'town_hall' ? (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <TownHallAsset
                        level={building.level}
                        size="100%"
                        isDestroyed={isDestroyed}
                        animate={!isDestroyed}
                      />
                      {/* Hit Points Bar */}
                      {!isDestroyed && (
                        <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 z-20">
                          <div
                            className={`h-full transition-all duration-200 ${
                              hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 20 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${hpPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full rounded flex flex-col items-center justify-center border relative shadow-md ${
                        isDestroyed
                          ? 'bg-stone-900/70 border-stone-800 opacity-30 grayscale'
                          : def.type === 'wall'
                          ? 'bg-stone-700 border-stone-600'
                          : def.category === 'defense'
                          ? 'bg-gradient-to-br from-slate-900 to-rose-950/80 border-rose-500/50'
                          : 'bg-gradient-to-br from-slate-900 to-amber-950/80 border-amber-500/50'
                      }`}
                    >
                      <span className={`${def.width >= 3 ? 'text-2xl' : 'text-sm'}`}>{def.icon}</span>

                      {/* Hit Points Bar */}
                      {!isDestroyed && def.type !== 'wall' && (
                        <div className="absolute -bottom-1 left-1 right-1 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className={`h-full transition-all duration-200 ${
                              hpPercent > 50 ? 'bg-emerald-500' : hpPercent > 20 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${hpPercent}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Render Troops */}
            {troops
              .filter(t => t.currentHp > 0)
              .map(troop => {
                const def = TROOPS_DATA[troop.troopId];
                if (!def) return null;
                const hpPercent = (troop.currentHp / troop.maxHp) * 100;

                return (
                  <div
                    key={troop.id}
                    className="absolute pointer-events-none z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
                    style={{
                      left: `${troop.x * 32}px`,
                      top: `${troop.y * 32}px`,
                      width: '28px',
                      height: '28px',
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg border relative ${
                        def.isHero
                          ? 'bg-amber-500 border-yellow-200 shadow-amber-500/50 scale-125'
                          : def.isFlying
                          ? 'bg-sky-500/80 border-sky-300 shadow-sky-500/40'
                          : 'bg-slate-900/90 border-slate-600'
                      }`}
                    >
                      <span>{def.icon}</span>
                      {/* Health bar over troop head */}
                      <div className="absolute -top-1.5 w-6 h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-emerald-400" style={{ width: `${hpPercent}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Troop & Spell Deployment Dock (Classic Dark Fantasy Bottom Dock) */}
      <div className="bg-gradient-to-b from-[#131b2e] via-[#0e1628] to-[#090d18] border-2 border-[#b45309] p-4 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-clash-header font-black uppercase tracking-wider text-amber-300 dark-fantasy-gold-text">
            Deploy Troops & Spells
          </span>
          <span className="text-[11px] text-slate-400">Select warrior or spell below, then tap battlefield border</span>
        </div>

        {/* Units Scroll Area */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {/* Troops Slots */}
          {Object.entries(deployableTroops).map(([tid, count]) => {
            const troopDef = TROOPS_DATA[tid as TroopId];
            if (!troopDef || (count || 0) <= 0) return null;
            const isSelected = selectedDeployTroop === tid && !selectedDeploySpell;

            return (
              <button
                key={tid}
                onClick={() => {
                  setSelectedDeployTroop(tid as TroopId);
                  setSelectedDeploySpell(null);
                  sound.playDeploy();
                }}
                className={`relative flex-shrink-0 w-20 p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-600/30 to-amber-950/50 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-gradient-to-b from-[#18233b] to-[#0c1220] border-[#523b18] hover:border-[#b45309]'
                }`}
              >
                <span className="text-2xl mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{troopDef.icon}</span>
                <span className="text-[10px] font-bold text-slate-200 truncate w-full text-center">{troopDef.name}</span>
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] shadow border border-yellow-200">
                  x{count}
                </span>
              </button>
            );
          })}

          {/* Spell Slots */}
          {Object.entries(deployableSpells).map(([sid, count]) => {
            const spellDef = SPELLS_DATA[sid as SpellId];
            if (!spellDef || (count || 0) <= 0) return null;
            const isSelected = selectedDeploySpell === sid;

            return (
              <button
                key={sid}
                onClick={() => {
                  setSelectedDeploySpell(sid as SpellId);
                  sound.playSpellCast();
                }}
                className={`relative flex-shrink-0 w-18 p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/20 scale-105'
                    : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-700'
                }`}
              >
                <span className="text-2xl mb-1">{spellDef.icon}</span>
                <span className="text-[10px] font-bold text-slate-200 truncate w-full text-center">{spellDef.name}</span>
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-purple-500 text-white font-black text-[10px] shadow">
                  x{count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory / Defeat Modal Report */}
      {battleEnded && battleResults && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 max-w-md w-full rounded-3xl p-6 shadow-2xl text-center space-y-6">
            {/* Header stars */}
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3].map(num => (
                <Star
                  key={num}
                  className={`w-10 h-10 ${
                    num <= battleResults.stars
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse'
                      : 'text-slate-700 fill-slate-800'
                  }`}
                />
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-black font-clash-header text-amber-300">
                {battleResults.stars === 3
                  ? 'TOTAL DESTRUCTION!'
                  : battleResults.stars > 0
                  ? 'VICTORY!'
                  : 'BATTLE FINISHED'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {battleResults.destructionPercent}% Base Demolished • Town Hall {battleResults.isTownHallDestroyed ? 'Smashed' : 'Survived'}
              </p>
            </div>

            {/* Loot Stolen Breakdown */}
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Loot Stolen</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900 p-2 rounded-xl border border-yellow-500/30">
                  <span className="text-xl">🪙</span>
                  <span className="text-xs font-bold text-yellow-400 block mt-1">+{battleResults.goldLooted}</span>
                  <span className="text-[10px] text-slate-400">Gold</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-purple-500/30">
                  <span className="text-xl">🧪</span>
                  <span className="text-xs font-bold text-purple-400 block mt-1">+{battleResults.elixirLooted}</span>
                  <span className="text-[10px] text-slate-400">Elixir</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-700">
                  <span className="text-xl">🛢️</span>
                  <span className="text-xs font-bold text-slate-200 block mt-1">+{battleResults.darkElixirLooted}</span>
                  <span className="text-[10px] text-slate-400">Dark Elixir</span>
                </div>
              </div>

              {/* Trophies */}
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 pt-2 border-t border-slate-700/60">
                <Trophy className="w-4 h-4" />
                <span>+{battleResults.trophiesWon} Trophies Won!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => initBattle(targetBasePreset)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                Attack Again
              </button>
              <button
                onClick={onReturnToVillage}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all"
              >
                Return to Village
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
