import React, { useState, useEffect } from 'react';
import { PlacedBuilding, ArmySlot, SpellSlot, UserResources } from './types/game';
import { PRESET_BASES, PRESET_ARMIES, TOWN_HALL_LEVELS } from './data/clashData';
import { Navbar } from './components/Navbar';
import { VillageGrid } from './components/VillageGrid';
import { Battlefield } from './components/Battlefield';
import { ArmyPlanner } from './components/ArmyPlanner';
import { Laboratory } from './components/Laboratory';
import { CodexWiki } from './components/CodexWiki';
import { TownHallProgressionModal } from './components/TownHallProgressionModal';
import { TownHallUpgradeAnimation } from './components/TownHallUpgradeAnimation';
import { SettingsModal } from './components/darkfantasy/SettingsModal';
import { sound } from './utils/audio';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'village' | 'battle' | 'army' | 'lab' | 'codex'>('village');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isTownHallModalOpen, setIsTownHallModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [upgradingLevel, setUpgradingLevel] = useState<number | null>(null);

  // User Resources with Player Profile defaults matching reference image
  const [resources, setResources] = useState<UserResources>(() => {
    const saved = localStorage.getItem('coc2_resources');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.townHallLevel > 12) parsed.townHallLevel = 12;
        if (!parsed.username) parsed.username = 'AlokVerse';
        if (!parsed.playerLevel) parsed.playerLevel = 18;
        if (parsed.xp === undefined) parsed.xp = 312;
        if (!parsed.maxXp) parsed.maxXp = 1000;
        if (parsed.trophies === undefined) parsed.trophies = 842;
        return parsed;
      } catch {
        // ignore
      }
    }
    return {
      gold: 4500000,
      elixir: 4200000,
      darkElixir: 120000,
      gems: 1500,
      maxGold: 8000000,
      maxElixir: 8000000,
      maxDarkElixir: 250000,
      buildersTotal: 4,
      buildersBusy: 2,
      townHallLevel: 3, // Defaults to Level 3 or saved state
      username: 'AlokVerse',
      playerLevel: 18,
      xp: 312,
      maxXp: 1000,
      trophies: 842,
    };
  });

  // Base Buildings
  const [buildings, setBuildings] = useState<PlacedBuilding[]>(() => {
    const saved = localStorage.getItem('coc2_buildings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((b: PlacedBuilding) => {
          if (b.type === 'town_hall' && b.level > 12) {
            return { ...b, level: 12 };
          }
          return b;
        });
      } catch {
        // ignore
      }
    }
    const defaultPreset = PRESET_BASES['hybrid_trophy'].buildings;
    return defaultPreset.map(b => b.type === 'town_hall' ? { ...b, level: 3 } : b);
  });

  // Army Slots
  const [playerArmy, setPlayerArmy] = useState<ArmySlot[]>(() => {
    const saved = localStorage.getItem('coc2_army');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return PRESET_ARMIES['dragon_rush'].troops;
  });

  // Spell Slots
  const [playerSpells, setPlayerSpells] = useState<SpellSlot[]>(() => {
    const saved = localStorage.getItem('coc2_spells');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return PRESET_ARMIES['dragon_rush'].spells;
  });

  // Upgrades
  const [troopLevels, setTroopLevels] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('coc2_troop_levels');
    return saved ? JSON.parse(saved) : {};
  });

  const [spellLevels, setSpellLevels] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('coc2_spell_levels');
    return saved ? JSON.parse(saved) : {};
  });

  // Ensure placed Town Hall level stays in sync with resources.townHallLevel
  useEffect(() => {
    const currentTh = buildings.find(b => b.type === 'town_hall');
    if (currentTh && currentTh.level !== resources.townHallLevel) {
      const thInfo = TOWN_HALL_LEVELS.find(l => l.level === resources.townHallLevel) || TOWN_HALL_LEVELS[0];
      setBuildings(prev =>
        prev.map(b =>
          b.type === 'town_hall'
            ? { ...b, level: resources.townHallLevel, maxHp: thInfo.hp, currentHp: thInfo.hp }
            : b
        )
      );
    }
  }, [resources.townHallLevel, buildings]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('coc2_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('coc2_buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('coc2_army', JSON.stringify(playerArmy));
  }, [playerArmy]);

  useEffect(() => {
    localStorage.setItem('coc2_spells', JSON.stringify(playerSpells));
  }, [playerSpells]);

  useEffect(() => {
    localStorage.setItem('coc2_troop_levels', JSON.stringify(troopLevels));
  }, [troopLevels]);

  useEffect(() => {
    localStorage.setItem('coc2_spell_levels', JSON.stringify(spellLevels));
  }, [spellLevels]);

  const handleRefillResources = () => {
    setResources(prev => ({
      ...prev,
      gold: prev.maxGold,
      elixir: prev.maxElixir,
      darkElixir: prev.maxDarkElixir,
      gems: prev.gems + 500,
    }));
    sound.playLootChime();
  };

  // Upgrades the Town Hall to any target level (1 to 12)
  const handleUpgradeTownHall = (targetLevel: number) => {
    const validLevel = Math.min(12, Math.max(1, targetLevel));
    const thInfo = TOWN_HALL_LEVELS.find(l => l.level === validLevel) || TOWN_HALL_LEVELS[0];

    // Deduct cost if available
    setResources(prev => {
      const nextGold = Math.max(0, prev.gold - (validLevel > prev.townHallLevel ? thInfo.upgradeCost : 0));
      return {
        ...prev,
        townHallLevel: validLevel,
        gold: nextGold,
      };
    });

    // Update Town Hall in village buildings
    setBuildings(prev => {
      const hasTh = prev.some(b => b.type === 'town_hall');
      if (!hasTh) {
        return [
          ...prev,
          {
            id: `th_${Date.now()}`,
            type: 'town_hall',
            x: 8,
            y: 8,
            level: validLevel,
            currentHp: thInfo.hp,
            maxHp: thInfo.hp,
          },
        ];
      }
      return prev.map(b =>
        b.type === 'town_hall'
          ? {
              ...b,
              level: validLevel,
              maxHp: thInfo.hp,
              currentHp: thInfo.hp,
            }
          : b
      );
    });

    // Trigger celebratory audio and upgrade animation
    sound.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    setUpgradingLevel(validLevel);
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navigation & Status Bar for Subpages */}
      <Navbar
        resources={resources}
        onAddResources={handleRefillResources}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenTownHallModal={() => setIsTownHallModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'village' && (
          <VillageGrid
            buildings={buildings}
            setBuildings={setBuildings}
            resources={resources}
            setResources={setResources}
            onStartAttackOnThisBase={() => {
              setActiveTab('battle');
              sound.playDeploy();
            }}
            onOpenTownHallModal={() => setIsTownHallModalOpen(true)}
            onUpgradeTownHall={handleUpgradeTownHall}
            onOpenArmy={() => setActiveTab('army')}
            onOpenLab={() => setActiveTab('lab')}
            onOpenCodex={() => setActiveTab('codex')}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            onRefillResources={handleRefillResources}
          />
        )}

        {activeTab === 'battle' && (
          <Battlefield
            playerArmy={playerArmy}
            playerSpells={playerSpells}
            baseToAttack={buildings}
            resources={resources}
            setResources={setResources}
            onReturnToVillage={() => {
              setActiveTab('village');
              sound.playDeploy();
            }}
          />
        )}

        {activeTab === 'army' && (
          <ArmyPlanner
            playerArmy={playerArmy}
            setPlayerArmy={setPlayerArmy}
            playerSpells={playerSpells}
            setPlayerSpells={setPlayerSpells}
            resources={resources}
            setResources={setResources}
            onGoToBattle={() => {
              setActiveTab('battle');
              sound.playDeploy();
            }}
          />
        )}

        {activeTab === 'lab' && (
          <Laboratory
            resources={resources}
            setResources={setResources}
            troopLevels={troopLevels}
            setTroopLevels={setTroopLevels}
            spellLevels={spellLevels}
            setSpellLevels={setSpellLevels}
          />
        )}

        {activeTab === 'codex' && <CodexWiki />}
      </main>

      {/* Town Hall Progression Modal (Matching the Reference Image) */}
      <TownHallProgressionModal
        isOpen={isTownHallModalOpen}
        onClose={() => setIsTownHallModalOpen(false)}
        currentLevel={resources.townHallLevel}
        onUpgradeToLevel={(lvl) => {
          handleUpgradeTownHall(lvl);
          setIsTownHallModalOpen(false);
        }}
        resources={resources}
      />

      {/* Settings & Cheats Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        resources={resources}
        setResources={setResources}
        onResetVillage={() => {
          setBuildings([{ id: 'th1', type: 'town_hall', x: 8, y: 8, level: 1, currentHp: 450, maxHp: 450 }]);
          setResources(prev => ({ ...prev, townHallLevel: 1 }));
        }}
        onRefillResources={handleRefillResources}
      />

      {/* Upgrading Celebratory Animation */}
      {upgradingLevel !== null && (
        <TownHallUpgradeAnimation
          newLevel={upgradingLevel}
          onComplete={() => setUpgradingLevel(null)}
        />
      )}
    </div>
  );
};
