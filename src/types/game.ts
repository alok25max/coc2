export type BuildingType =
  | 'town_hall'
  | 'cannon'
  | 'archer_tower'
  | 'wizard_tower'
  | 'air_defense'
  | 'mortar'
  | 'hidden_tesla'
  | 'xbow'
  | 'inferno_tower'
  | 'eagle_artillery'
  | 'wall'
  | 'gold_mine'
  | 'gold_storage'
  | 'elixir_collector'
  | 'elixir_storage'
  | 'dark_elixir_drill'
  | 'dark_elixir_storage'
  | 'clan_castle'
  | 'army_camp';

export type BuildingCategory = 'defense' | 'resource' | 'army' | 'core';

export interface BuildingDefinition {
  type: BuildingType;
  name: string;
  category: BuildingCategory;
  width: number; // grid tiles
  height: number; // grid tiles
  baseHp: number;
  baseDps: number;
  range: number; // grid tiles
  minRange?: number;
  attackSpeed: number; // seconds per shot
  targets: 'ground' | 'air' | 'air_and_ground';
  damageType: 'single' | 'splash' | 'ramp_up' | 'none';
  icon: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costType: 'gold' | 'elixir' | 'dark_elixir';
}

export interface PlacedBuilding {
  id: string;
  type: BuildingType;
  x: number; // grid tile X (0 to 19)
  y: number; // grid tile Y (0 to 19)
  level: number;
  currentHp: number;
  maxHp: number;
  isDestroyed?: boolean;
}

export type TroopId =
  | 'barbarian'
  | 'archer'
  | 'giant'
  | 'goblin'
  | 'wall_breaker'
  | 'balloon'
  | 'wizard'
  | 'healer'
  | 'dragon'
  | 'pekka'
  | 'hog_rider'
  | 'archer_queen'
  | 'barbarian_king';

export interface TroopDefinition {
  id: TroopId;
  name: string;
  housingSpace: number;
  trainingTimeSec: number;
  cost: number;
  costType: 'elixir' | 'dark_elixir';
  baseHp: number;
  baseDps: number;
  movementSpeed: number; // tiles per second
  attackRange: number; // tiles
  attackSpeed: number; // seconds
  favoriteTarget: 'any' | 'defenses' | 'resources' | 'walls';
  damageMultiplierForFav?: number;
  isFlying: boolean;
  canJumpWalls?: boolean;
  isHero?: boolean;
  heroAbilityName?: string;
  icon: string;
  description: string;
}

export type SpellId = 'lightning' | 'heal' | 'rage' | 'freeze' | 'jump';

export interface SpellDefinition {
  id: SpellId;
  name: string;
  housingSpace: number;
  cost: number;
  costType: 'elixir' | 'dark_elixir';
  radius: number; // tiles
  durationSec: number;
  effectValue: number; // damage for lightning, heal/sec for heal, boost% for rage, freeze duration for freeze
  icon: string;
  description: string;
  color: string;
}

export interface ActiveTroop {
  id: string;
  troopId: TroopId;
  x: number; // continuous coordinate
  y: number; // continuous coordinate
  currentHp: number;
  maxHp: number;
  targetBuildingId: string | null;
  targetX?: number;
  targetY?: number;
  lastAttackTime: number;
  speed: number;
  isAbilityActive?: boolean;
  abilityCooldownUntil?: number;
}

export interface ActiveProjectile {
  id: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  sourceBuildingId?: string;
  sourceTroopId?: string;
  targetId: string;
  speed: number; // tiles per second
  damage: number;
  isSplash: boolean;
  splashRadius?: number;
  type: 'cannon' | 'arrow' | 'wizard_orb' | 'mortar_shell' | 'tesla_beam' | 'inferno_beam' | 'eagle_shell';
  progress: number; // 0 to 1
}

export interface ActiveSpellZone {
  id: string;
  spellId: SpellId;
  x: number;
  y: number;
  radius: number;
  expiresAt: number;
  color: string;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
}

export interface UserResources {
  gold: number;
  elixir: number;
  darkElixir: number;
  gems: number;
  maxGold: number;
  maxElixir: number;
  maxDarkElixir: number;
  buildersTotal: number;
  buildersBusy: number;
  townHallLevel: number;
  username?: string;
  playerLevel?: number;
  xp?: number;
  maxXp?: number;
  trophies?: number;
  shieldTimeRemainingSec?: number;
}

export interface ArmySlot {
  troopId: TroopId;
  count: number;
}

export interface SpellSlot {
  spellId: SpellId;
  count: number;
}

export interface BattleResults {
  stars: number;
  destructionPercent: number;
  goldLooted: number;
  elixirLooted: number;
  darkElixirLooted: number;
  trophiesWon: number;
  isTownHallDestroyed: boolean;
  totalTimeSec: number;
}
