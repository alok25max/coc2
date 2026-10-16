import React, { useState } from 'react';
import { PlacedBuilding, BuildingType, UserResources } from '../types/game';
import { BUILDINGS_DATA, PRESET_BASES, TOWN_HALL_LEVELS } from '../data/clashData';
import { TownHallAsset } from './TownHallAsset';
import { PlayerProfileBadge } from './darkfantasy/PlayerProfileBadge';
import { ResourceBarTop } from './darkfantasy/ResourceBarTop';
import { LeftMenuDock } from './darkfantasy/LeftMenuDock';
import { AttackButton } from './darkfantasy/AttackButton';
import { RightMenuDock } from './darkfantasy/RightMenuDock';
import { BuildingInfoCard } from './darkfantasy/BuildingInfoCard';
import { ShopModal } from './darkfantasy/ShopModal';
import { VillageView3D } from './village3d/VillageView3D';
import { sound } from '../utils/audio';
import { Shield, Hammer, RotateCcw, Swords, Plus, Sparkles, Layers, Castle, ChevronRight, Box, Grid } from 'lucide-react';

interface VillageGridProps {
  buildings: PlacedBuilding[];
  setBuildings: React.Dispatch<React.SetStateAction<PlacedBuilding[]>>;
  resources: UserResources;
  setResources: React.Dispatch<React.SetStateAction<UserResources>>;
  onStartAttackOnThisBase: () => void;
  onOpenTownHallModal?: () => void;
  onUpgradeTownHall?: (newLevel: number) => void;
  onOpenArmy: () => void;
  onOpenLab: () => void;
  onOpenCodex: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onRefillResources: () => void;
}

const GRID_SIZE = 20;

export const VillageGrid: React.FC<VillageGridProps> = ({
  buildings,
  setBuildings,
  resources,
  setResources,
  onStartAttackOnThisBase,
  onOpenTownHallModal,
  onUpgradeTownHall,
  onOpenArmy,
  onOpenLab,
  onOpenCodex,
  onOpenSettings,
  soundEnabled,
  setSoundEnabled,
  onRefillResources,
}) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedPaletteType, setSelectedPaletteType] = useState<BuildingType>('cannon');
  const [wallBrushMode, setWallBrushMode] = useState<boolean>(false);
  const [hoverTile, setHoverTile] = useState<{ x: number; y: number } | null>(null);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || null;
  const selectedDef = selectedBuilding ? BUILDINGS_DATA[selectedBuilding.type] : null;

  // Calculate Base Stats
  const totalDps = buildings.reduce((acc, b) => {
    const def = BUILDINGS_DATA[b.type];
    return acc + (def?.baseDps || 0);
  }, 0);

  const totalHp = buildings.reduce((acc, b) => acc + b.maxHp, 0);

  // Check if tile is occupied
  const getBuildingAt = (x: number, y: number): PlacedBuilding | undefined => {
    return buildings.find(b => {
      const def = BUILDINGS_DATA[b.type];
      const w = def?.width || 1;
      const h = def?.height || 1;
      return x >= b.x && x < b.x + w && y >= b.y && y < b.y + h;
    });
  };

  const handleTileClick = (x: number, y: number) => {
    const existing = getBuildingAt(x, y);

    if (existing) {
      setSelectedBuildingId(existing.id);
      sound.playDeploy();
      return;
    }

    // Place building from palette or wall
    const placeType = wallBrushMode ? 'wall' : selectedPaletteType;
    const def = BUILDINGS_DATA[placeType];
    if (!def) return;

    // Check bounds
    if (x + def.width > GRID_SIZE || y + def.height > GRID_SIZE) return;

    // Check collision with any existing building
    let collision = false;
    for (let dx = 0; dx < def.width; dx++) {
      for (let dy = 0; dy < def.height; dy++) {
        if (getBuildingAt(x + dx, y + dy)) {
          collision = true;
          break;
        }
      }
      if (collision) break;
    }

    if (collision) {
      return;
    }

    // Check resource affordability
    const cost = def.baseCost;
    if (def.costType === 'gold' && resources.gold < cost) {
      sound.playBuildingDestroyed();
      return;
    }
    if (def.costType === 'elixir' && resources.elixir < cost) {
      sound.playBuildingDestroyed();
      return;
    }

    // Deduct cost
    setResources(prev => ({
      ...prev,
      gold: def.costType === 'gold' ? Math.max(0, prev.gold - cost) : prev.gold,
      elixir: def.costType === 'elixir' ? Math.max(0, prev.elixir - cost) : prev.elixir,
    }));

    // Add building
    const newBuilding: PlacedBuilding = {
      id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: placeType,
      x,
      y,
      level: 1,
      currentHp: def.baseHp,
      maxHp: def.baseHp,
    };

    setBuildings(prev => [...prev, newBuilding]);
    setSelectedBuildingId(newBuilding.id);
    sound.playDeploy();
  };

  const handleUpgradeBuilding = () => {
    if (!selectedBuilding || !selectedDef) return;
    if (selectedBuilding.level >= selectedDef.maxLevel) return;

    const nextLevel = selectedBuilding.level + 1;

    if (selectedBuilding.type === 'town_hall' && onUpgradeTownHall) {
      onUpgradeTownHall(nextLevel);
      return;
    }

    const hpBoost = Math.round(selectedDef.baseHp * 0.15);

    setBuildings(prev =>
      prev.map(b =>
        b.id === selectedBuilding.id
          ? {
              ...b,
              level: nextLevel,
              maxHp: b.maxHp + hpBoost,
              currentHp: b.currentHp + hpBoost,
            }
          : b
      )
    );
    sound.playSpellCast();
  };

  const handleRemoveBuilding = () => {
    if (!selectedBuilding) return;
    setBuildings(prev => prev.filter(b => b.id !== selectedBuilding.id));
    setSelectedBuildingId(null);
    sound.playBuildingDestroyed();
  };

  const handleLoadPreset = (presetKey: string) => {
    const preset = PRESET_BASES[presetKey];
    if (preset) {
      setBuildings(preset.buildings.map(b => ({ ...b, id: `${b.id}_${Date.now()}` })));
      setSelectedBuildingId(null);
      sound.playSpellCast();
    }
  };

  const handleClearBase = () => {
    if (window.confirm('Clear all buildings except Town Hall?')) {
      const th = buildings.find(b => b.type === 'town_hall');
      setBuildings(th ? [th] : [{ id: 'th1', type: 'town_hall', x: 8, y: 8, level: 1, currentHp: 450, maxHp: 450 }]);
      setSelectedBuildingId(null);
      sound.playBuildingDestroyed();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between overflow-hidden select-none p-2 sm:p-4">
      {/* 1. TOP HUD OVERLAY (Player Profile Left + Resource Counters Right) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 z-30 pointer-events-auto">
        <PlayerProfileBadge
          resources={resources}
          setResources={setResources}
          onOpenTownHallModal={onOpenTownHallModal}
        />

        <ResourceBarTop
          resources={resources}
          onAddResources={onRefillResources}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      </div>

      {/* 2. MAIN VILLAGE CANVAS WITH CRISP ART STYLE */}
      <div className="my-auto py-2 flex flex-col items-center justify-center relative z-10 w-full overflow-hidden">
        {/* Subtle Base Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2 bg-[#090e1c]/80 border border-[#523b18]/60 px-3 py-1.5 rounded-2xl backdrop-blur shadow-md text-xs text-slate-300">
          {/* View Mode Toggle: 3D Isometric World vs 2D Tactical Grid */}
          <div className="flex items-center gap-1 bg-[#101728] border border-[#b45309] rounded-xl p-0.5 text-xs mr-1">
            <button
              onClick={() => {
                setViewMode('3d');
                sound.playDeploy();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md font-clash-header font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D World</span>
            </button>
            <button
              onClick={() => {
                setViewMode('2d');
                sound.playDeploy();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-md font-clash-header font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>2D Grid</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pr-2 border-r border-[#523b18]">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Base DPS: {totalDps}
            </span>
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <span>❤️</span> {totalHp.toLocaleString()} HP
            </span>
          </div>

          {/* Wall Tool Button */}
          <button
            onClick={() => setWallBrushMode(!wallBrushMode)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border cursor-pointer ${
              wallBrushMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#141d30] text-slate-300 border-[#523b18] hover:bg-[#1a2740]'
            }`}
          >
            <span>🧱</span>
            <span>{wallBrushMode ? 'Wall Tool Active' : 'Wall Brush'}</span>
          </button>

          {/* Preset bases dropdown */}
          <div className="flex items-center gap-1 bg-[#101728] border border-[#523b18] rounded-xl p-0.5 text-xs">
            <span className="text-slate-400 pl-1.5 font-medium text-[11px] flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" /> Presets:
            </span>
            <button
              onClick={() => handleLoadPreset('hybrid_trophy')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Hybrid
            </button>
            <button
              onClick={() => handleLoadPreset('anti_three_star_war')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Anti-3★
            </button>
            <button
              onClick={() => handleLoadPreset('goblin_gold_vault')}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Vault
            </button>
          </div>

          <button
            onClick={handleClearBase}
            className="p-1 px-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset layout"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* VIEW CONTAINER: 3D ISOMETRIC WORLD (DEFAULT) OR 2D GRID */}
        {viewMode === '3d' ? (
          <div className="w-full max-w-5xl">
            <VillageView3D
              buildings={buildings}
              selectedBuildingId={selectedBuildingId}
              onSelectBuilding={setSelectedBuildingId}
              onTileClick={handleTileClick}
              hoverTile={hoverTile}
              setHoverTile={setHoverTile}
              wallBrushMode={wallBrushMode}
              selectedPaletteType={selectedPaletteType}
            />
          </div>
        ) : (
          /* 20x20 2D Tactical Grid Board */
          <div className="relative p-2.5 bg-gradient-to-b from-[#113a25] via-[#092918] to-[#041a0e] border-3 border-[#784f18] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] max-w-full overflow-auto">
            <div
              className="grid gap-[2px] bg-emerald-950/60 p-1.5 rounded-xl border border-emerald-800/30"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(26px, 34px))`,
                gridTemplateRows: `repeat(${GRID_SIZE}, minmax(26px, 34px))`,
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                const x = idx % GRID_SIZE;
                const y = Math.floor(idx / GRID_SIZE);
                const building = getBuildingAt(x, y);
                const isSelected = building && building.id === selectedBuildingId;
                const isOrigin = building && building.x === x && building.y === y;
                const def = building ? BUILDINGS_DATA[building.type] : null;
                const isWall = building && building.type === 'wall';

                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => handleTileClick(x, y)}
                    onMouseEnter={() => setHoverTile({ x, y })}
                    className={`relative w-full aspect-square rounded transition-all cursor-pointer flex items-center justify-center select-none text-xs ${
                      building
                        ? isSelected
                          ? 'ring-2 ring-amber-400 bg-amber-500/30 z-10'
                          : isWall
                          ? 'bg-gradient-to-b from-stone-700 to-stone-900 border border-stone-600 shadow-sm'
                          : 'bg-slate-800/70 border border-slate-700/50'
                        : hoverTile?.x === x && hoverTile?.y === y
                        ? 'bg-emerald-500/20 border border-emerald-400/40'
                        : (x + y) % 2 === 0
                        ? 'bg-emerald-900/30 hover:bg-emerald-800/30'
                        : 'bg-emerald-950/40 hover:bg-emerald-800/30'
                    }`}
                  >
                    {/* Building Artwork Rendering at Origin Tile */}
                    {isOrigin && def && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
                        style={{
                          width: `${def.width * 100}%`,
                          height: `${def.height * 100}%`,
                        }}
                      >
                        {building.type === 'town_hall' ? (
                          <div className="w-full h-full relative flex items-center justify-center">
                            <TownHallAsset level={building.level} size="100%" animate={true} />
                            <span className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-slate-950/85 border border-amber-500/60 text-[9px] font-black text-amber-300 shadow">
                              TH {building.level}
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`w-[90%] h-[90%] rounded-xl flex flex-col items-center justify-center p-1 text-center shadow-lg border ${
                              def.category === 'defense'
                                ? 'bg-gradient-to-br from-slate-900 via-rose-950/70 to-slate-900 border-rose-500/50'
                                : def.category === 'resource'
                                ? 'bg-gradient-to-br from-slate-900 via-amber-950/70 to-slate-900 border-yellow-500/50'
                                : 'bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border-indigo-500/50'
                            }`}
                          >
                            <span className={`${def.width >= 3 ? 'text-2xl' : 'text-base'}`}>{def.icon}</span>
                            {def.type !== 'wall' && (
                              <span className="text-[9px] font-bold text-slate-200 truncate max-w-full leading-none mt-0.5">
                                L{building.level}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Defensive Range Ring */}
                    {isSelected && selectedDef && selectedDef.range > 0 && isOrigin && (
                      <div
                        className="absolute rounded-full border-2 border-amber-400/60 bg-amber-400/10 pointer-events-none z-0 animate-pulse"
                        style={{
                          width: `${selectedDef.range * 2 * 100}%`,
                          height: `${selectedDef.range * 2 * 100}%`,
                          top: `${-(selectedDef.range - selectedDef.height / 2) * 100}%`,
                          left: `${-(selectedDef.range - selectedDef.width / 2) * 100}%`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. FLOATING LEFT MENU (Mail, Clan Chat, Defense Log) */}
      <div className="absolute left-3 sm:left-5 top-28 z-30 pointer-events-auto">
        <LeftMenuDock />
      </div>

      {/* 4. FLOATING BUILDING INFO CARD (when building is selected) */}
      {selectedBuilding && (
        <div className="absolute right-3 sm:right-6 top-24 z-30 pointer-events-auto max-w-xs">
          <BuildingInfoCard
            building={selectedBuilding}
            onClose={() => setSelectedBuildingId(null)}
            onUpgrade={handleUpgradeBuilding}
            onRemove={handleRemoveBuilding}
            onOpenTownHallModal={onOpenTownHallModal}
            userGold={resources.gold}
          />
        </div>
      )}

      {/* 5. BOTTOM HUD OVERLAY (Attack Button on Left + Shop & Action Dock on Right) */}
      <div className="w-full flex items-end justify-between gap-4 z-30 pointer-events-auto pt-2">
        <AttackButton onAttack={onStartAttackOnThisBase} />

        <RightMenuDock
          onOpenShop={() => setIsShopOpen(true)}
          onOpenArmy={onOpenArmy}
          onOpenLab={onOpenLab}
          onOpenCodex={onOpenCodex}
          onOpenSettings={onOpenSettings}
          onOpenTownHall={onOpenTownHallModal || (() => {})}
        />
      </div>

      {/* 6. DARK FANTASY SHOP MODAL */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onSelectBuildingToPlace={(type) => {
          setSelectedPaletteType(type);
          setWallBrushMode(type === 'wall');
        }}
        userGold={resources.gold}
        userElixir={resources.elixir}
      />
    </div>
  );
};
