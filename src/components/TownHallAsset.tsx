import React from 'react';

interface TownHallAssetProps {
  level: number;
  className?: string;
  size?: number | string;
  isDestroyed?: boolean;
  showShadow?: boolean;
  animate?: boolean;
}

export const TownHallAsset: React.FC<TownHallAssetProps> = ({
  level = 1,
  className = '',
  size = '100%',
  isDestroyed = false,
  showShadow = true,
  animate = true,
}) => {
  // Clamp level between 1 and 12
  const lvl = Math.min(12, Math.max(1, Math.round(level)));

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ground Contact Shadow */}
          <radialGradient id={`th-shadow-${lvl}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#051b11" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#02120a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Torch Fire & Glow Gradients */}
          <linearGradient id="torch-fire" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="90%" stopColor="#fef08a" />
          </linearGradient>

          {/* Gold Spire Gradients */}
          <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#b45309" />
          </linearGradient>

          {/* Arcane Crystal Gradient (TH 12) */}
          <linearGradient id="arcane-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d0fe" />
            <stop offset="40%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>

          {/* Magma Fissure Gradient (TH 10) */}
          <linearGradient id="magma-glow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7c2d12" />
            <stop offset="60%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>

        {/* 1. Isometric Ground Ambient Contact Shadow */}
        {showShadow && (
          <ellipse
            cx="100"
            cy="158"
            rx="78"
            ry="30"
            fill={`url(#th-shadow-${lvl})`}
          />
        )}

        {/* 2. Specific Level Architectural Building Artwork */}
        <g className={isDestroyed ? 'opacity-40 grayscale filter contrast-75' : ''}>
          {lvl === 1 && <Level1Outpost animate={animate} />}
          {lvl === 2 && <Level2WoodenHall animate={animate} />}
          {lvl === 3 && <Level3StoneTimber animate={animate} />}
          {lvl === 4 && <Level4StoneFortress animate={animate} />}
          {lvl === 5 && <Level5RoyalManor animate={animate} />}
          {lvl === 6 && <Level6PowerPrestige animate={animate} />}
          {lvl === 7 && <Level7RoyalFortress animate={animate} />}
          {lvl === 8 && <Level8GoldenCitadel animate={animate} />}
          {lvl === 9 && <Level9DragonKeep animate={animate} />}
          {lvl === 10 && <Level10InfernalFortress animate={animate} />}
          {lvl === 11 && <Level11ImperialPalace animate={animate} />}
          {lvl === 12 && <Level12ArcaneCitadel animate={animate} />}
        </g>

        {/* 3. Destroyed Rubble & Fire Smoke Overlay if Destroyed in Raid */}
        {isDestroyed && (
          <g>
            <path
              d="M60 145 L85 130 L115 135 L140 148 L120 162 L75 160 Z"
              fill="#1c1917"
              stroke="#292524"
              strokeWidth="2"
            />
            {/* Charred embers and cracks */}
            <path d="M75 140 L90 148 L105 138 L125 152" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx="85" cy="135" r="4" fill="#f97316" className="animate-ping" />
            <circle cx="115" cy="140" r="5" fill="#ef4444" className="animate-ping" />
            <text x="100" y="115" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="900">
              DESTROYED
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/* =========================================================================
   LEVEL 1: Small Beginnings
   Small wooden outpost with a timber roof, stone foundation, and simple entrance.
   Chimney with smoke, blue banner over doorway, torch posts.
   ========================================================================= */
const Level1Outpost: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-1">
    {/* Cobblestone Foundation */}
    <path d="M50 142 L100 165 L150 142 L100 120 Z" fill="#475569" stroke="#334155" strokeWidth="2" />
    <path d="M50 142 L50 152 L100 175 L100 165 Z" fill="#334155" />
    <path d="M100 165 L100 175 L150 152 L150 142 Z" fill="#1e293b" />

    {/* Stone Foundation Steps */}
    <path d="M85 156 L100 163 L115 156 L100 149 Z" fill="#64748b" />
    <path d="M85 156 L85 160 L100 167 L100 163 Z" fill="#475569" />
    <path d="M100 163 L100 167 L115 160 L115 156 Z" fill="#334155" />

    {/* Wooden Wall Body */}
    <path d="M60 135 L100 152 L100 105 L60 88 Z" fill="#92400e" stroke="#78350f" strokeWidth="1" />
    <path d="M100 152 L140 135 L140 88 L100 105 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />

    {/* Horizontal Timber Siding Planks */}
    <line x1="60" y1="120" x2="100" y2="137" stroke="#78350f" strokeWidth="1.5" />
    <line x1="60" y1="106" x2="100" y2="123" stroke="#78350f" strokeWidth="1.5" />
    <line x1="100" y1="137" x2="140" y2="120" stroke="#5c2602" strokeWidth="1.5" />
    <line x1="100" y1="123" x2="140" y2="106" stroke="#5c2602" strokeWidth="1.5" />

    {/* Stone Chimney on left */}
    <path d="M65 85 L75 80 L82 84 L72 89 Z" fill="#64748b" />
    <path d="M65 85 L65 105 L72 109 L72 89 Z" fill="#475569" />
    <path d="M72 89 L72 109 L82 104 L82 84 Z" fill="#334155" />
    {/* Chimney smoke */}
    {animate && (
      <g className="animate-pulse opacity-70">
        <circle cx="73" cy="74" r="3.5" fill="#e2e8f0" />
        <circle cx="71" cy="66" r="4.5" fill="#cbd5e1" />
        <circle cx="75" cy="57" r="5.5" fill="#94a3b8" />
      </g>
    )}

    {/* Timber Roof (Gabled Pitch) */}
    <path d="M52 92 L100 68 L148 92 L100 114 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
    {/* Left Roof Plane with shadow */}
    <path d="M52 92 L100 68 L100 114 Z" fill="#d97706" />
    <path d="M100 68 L148 92 L100 114 Z" fill="#b45309" />
    {/* Roof Planks lines */}
    <line x1="64" y1="86" x2="100" y2="103" stroke="#92400e" strokeWidth="1.5" />
    <line x1="76" y1="80" x2="100" y2="92" stroke="#92400e" strokeWidth="1.5" />
    <line x1="88" y1="74" x2="100" y2="80" stroke="#92400e" strokeWidth="1.5" />
    <line x1="100" y1="103" x2="136" y2="86" stroke="#78350f" strokeWidth="1.5" />
    <line x1="100" y1="92" x2="124" y2="80" stroke="#78350f" strokeWidth="1.5" />

    {/* Wooden Entrance Door */}
    <path d="M92 148 L108 141 L108 124 L92 131 Z" fill="#451a03" stroke="#291002" strokeWidth="1" />
    <circle cx="104" cy="133" r="1.5" fill="#f59e0b" />

    {/* Blue Banner Over Entrance */}
    <path d="M93 125 L107 119 L107 132 L100 137 L93 133 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
    <polygon points="100,125 102,129 98,129" fill="#fef08a" />

    {/* Left & Right Wooden Torch Posts with Fire */}
    <rect x="42" y="132" width="3" height="15" fill="#78350f" />
    <polygon points="41,132 43.5,123 46,132" fill="url(#torch-fire)" className={animate ? 'animate-bounce' : ''} />
    <rect x="155" y="132" width="3" height="15" fill="#78350f" />
    <polygon points="154,132 156.5,123 159,132" fill="url(#torch-fire)" className={animate ? 'animate-bounce' : ''} />
  </g>
);

/* =========================================================================
   LEVEL 2: Growing Stronger
   Reinforced wooden hall with a wider roof, stronger beams, and blue fabric details.
   ========================================================================= */
const Level2WoodenHall: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-2">
    {/* Base Stone Slab */}
    <path d="M46 142 L100 167 L154 142 L100 117 Z" fill="#475569" stroke="#334155" strokeWidth="2" />
    <path d="M46 142 L46 153 L100 178 L100 167 Z" fill="#334155" />
    <path d="M100 167 L100 178 L154 153 L154 142 Z" fill="#1e293b" />

    {/* Heavy Stone Corner Pillars */}
    <rect x="52" y="112" width="10" height="34" fill="#64748b" stroke="#334155" />
    <rect x="138" y="112" width="10" height="34" fill="#475569" stroke="#1e293b" />

    {/* Main Wall Structure */}
    <path d="M58 136 L100 154 L100 98 L58 80 Z" fill="#a16207" stroke="#854d0e" />
    <path d="M100 154 L142 136 L142 80 L100 98 Z" fill="#854d0e" stroke="#582d06" />

    {/* Cross Timber Bracing */}
    <line x1="62" y1="130" x2="96" y2="105" stroke="#713f12" strokeWidth="2.5" />
    <line x1="62" y1="105" x2="96" y2="130" stroke="#713f12" strokeWidth="2.5" />
    <line x1="104" y1="105" x2="138" y2="130" stroke="#532d0c" strokeWidth="2.5" />
    <line x1="104" y1="130" x2="138" y2="105" stroke="#532d0c" strokeWidth="2.5" />

    {/* Wide Double Timber Roof */}
    <path d="M44 86 L100 58 L156 86 L100 112 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="2" />
    <path d="M44 86 L100 58 L100 112 Z" fill="#eab308" />
    <path d="M100 58 L156 86 L100 112 Z" fill="#ca8a04" />

    {/* Front Gable Timber Truss */}
    <polygon points="100,58 92,100 108,100" fill="#713f12" />
    <polygon points="100,64 96,96 104,96" fill="#854d0e" />

    {/* Large Blue Crest Banner Draped over Gable */}
    <path d="M92 78 L108 78 L108 126 L100 134 L92 126 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1" />
    {/* Gold Shield Emblem */}
    <polygon points="100,85 104,90 104,97 100,102 96,97 96,90" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />

    {/* Roof Flagpole & Pennant */}
    <line x1="100" y1="58" x2="100" y2="42" stroke="#475569" strokeWidth="2" />
    <polygon points="100,43 115,48 100,53" fill="#3b82f6" />

    {/* Heavy Arched Entrance Doorway */}
    <path d="M88 150 L100 155 L112 150 L112 130 Q100 124 88 130 Z" fill="#381c07" stroke="#1f0f04" strokeWidth="1.5" />

    {/* Stone Steps */}
    <path d="M82 156 L100 164 L118 156 L100 148 Z" fill="#94a3b8" />
    <path d="M82 156 L82 161 L100 169 L100 164 Z" fill="#64748b" />
    <path d="M100 164 L100 169 L118 161 L118 156 Z" fill="#475569" />

    {/* Lantern Torches on Front Posts */}
    <rect x="74" y="136" width="3" height="12" fill="#475569" />
    <circle cx="75.5" cy="134" r="3.5" fill="#f59e0b" className={animate ? 'animate-ping' : ''} />
    <rect x="123" y="136" width="3" height="12" fill="#475569" />
    <circle cx="124.5" cy="134" r="3.5" fill="#f59e0b" className={animate ? 'animate-ping' : ''} />
  </g>
);

/* =========================================================================
   LEVEL 3: Building the Foundation
   Stone-and-timber hall with terracotta roof tiles and a more developed entrance.
   ========================================================================= */
const Level3StoneTimber: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-3">
    {/* Stepped Stone Base */}
    <path d="M42 144 L100 170 L158 144 L100 118 Z" fill="#64748b" stroke="#475569" strokeWidth="2" />
    <path d="M42 144 L42 154 L100 180 L100 170 Z" fill="#475569" />
    <path d="M100 170 L100 180 L158 154 L158 144 Z" fill="#334155" />

    {/* Ashlar Fieldstone Walls */}
    <path d="M52 136 L100 156 L100 95 L52 75 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
    <path d="M100 156 L148 136 L148 75 L100 95 Z" fill="#64748b" stroke="#334155" strokeWidth="1" />
    {/* Brickwork details */}
    <rect x="60" y="110" width="8" height="4" fill="#64748b" />
    <rect x="75" y="118" width="9" height="4" fill="#64748b" />
    <rect x="68" y="128" width="8" height="4" fill="#64748b" />
    <rect x="115" y="110" width="9" height="4" fill="#475569" />
    <rect x="128" y="118" width="8" height="4" fill="#475569" />

    {/* Brick Chimney with Smoke */}
    <path d="M60 70 L72 65 L80 69 L68 74 Z" fill="#b91c1c" />
    <path d="M60 70 L60 92 L68 96 L68 74 Z" fill="#991b1b" />
    <path d="M68 74 L68 96 L80 91 L80 69 Z" fill="#7f1d1d" />
    {animate && (
      <g className="animate-pulse opacity-80">
        <circle cx="70" cy="58" r="3.5" fill="#cbd5e1" />
        <circle cx="67" cy="49" r="4.5" fill="#94a3b8" />
        <circle cx="71" cy="39" r="6" fill="#64748b" />
      </g>
    )}

    {/* Terracotta Burnt-Orange Tile Roof */}
    <path d="M40 82 L100 52 L160 82 L100 110 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
    <path d="M40 82 L100 52 L100 110 Z" fill="#f97316" />
    <path d="M100 52 L160 82 L100 110 Z" fill="#c2410c" />
    {/* Terracotta Tile Ridges */}
    {[60, 72, 84, 96].map(x => (
      <line key={x} x1={x - 12} y1={80 - (96 - x) * 0.4} x2={x + 8} y2={106 - (96 - x) * 0.4} stroke="#ea580c" strokeWidth="1.5" />
    ))}
    {[104, 116, 128, 140].map(x => (
      <line key={x} x1={x - 8} y1={106 - (x - 104) * 0.4} x2={x + 12} y2={80 - (x - 104) * 0.4} stroke="#9a3412" strokeWidth="1.5" />
    ))}

    {/* Stone Portico & Grand Entrance */}
    <path d="M84 150 L100 157 L116 150 L116 122 Q100 114 84 122 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
    <rect x="83" y="122" width="5" height="28" fill="#cbd5e1" stroke="#64748b" />
    <rect x="112" y="122" width="5" height="28" fill="#94a3b8" stroke="#475569" />

    {/* Pair of Royal Banners flanking entrance */}
    <path d="M78 126 L83 126 L83 144 L80.5 147 L78 144 Z" fill="#4f46e5" />
    <path d="M117 126 L122 126 L122 144 L119.5 147 L117 144 Z" fill="#4f46e5" />

    {/* Stone Steps */}
    <path d="M78 158 L100 167 L122 158 L100 149 Z" fill="#cbd5e1" stroke="#94a3b8" />
    <path d="M78 158 L78 163 L100 172 L100 167 Z" fill="#94a3b8" />
    <path d="M100 167 L100 172 L122 163 L122 158 Z" fill="#64748b" />

    {/* Perimeter Barrel & Burning Torches */}
    <ellipse cx="138" cy="146" rx="6" ry="7" fill="#854d0e" stroke="#582d06" />
    <circle cx="138" cy="141" r="5" fill="#a16207" />
    <polygon points="50,135 52,126 54,135" fill="url(#torch-fire)" className={animate ? 'animate-bounce' : ''} />
    <polygon points="150,135 152,126 154,135" fill="url(#torch-fire)" className={animate ? 'animate-bounce' : ''} />
  </g>
);

/* =========================================================================
   LEVEL 4: Defending the Land
   Blue-gray stone fortress with battlements and reinforced corners.
   ========================================================================= */
const Level4StoneFortress: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-4">
    {/* Reinforced Fortress Plinth */}
    <path d="M38 144 L100 172 L162 144 L100 116 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
    <path d="M38 144 L38 156 L100 184 L100 172 Z" fill="#1e293b" />
    <path d="M100 172 L100 184 L162 156 L162 144 Z" fill="#0f172a" />

    {/* Sturdy Blue-Gray Stone Quoins & Fortress Walls */}
    <path d="M48 136 L100 158 L100 88 L48 66 Z" fill="#475569" stroke="#334155" />
    <path d="M100 158 L152 136 L152 66 L100 88 Z" fill="#334155" stroke="#1e293b" />

    {/* Defensive Battlements / Crenellations */}
    {[50, 62, 74, 86].map(x => (
      <rect key={x} x={x} y={70 + (x - 50) * 0.4} width="8" height="10" fill="#64748b" stroke="#334155" />
    ))}
    {[104, 116, 128, 140].map(x => (
      <rect key={x} x={x} y={84 - (x - 104) * 0.4} width="8" height="10" fill="#475569" stroke="#1e293b" />
    ))}

    {/* Slate-Blue Mansard Tile Roof */}
    <path d="M52 68 L100 44 L148 68 L100 92 Z" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
    <path d="M52 68 L100 44 L100 92 Z" fill="#2563eb" />
    <path d="M100 44 L148 68 L100 92 Z" fill="#1d4ed8" />

    {/* Corner Watchtowers with Red Heraldic Flags */}
    <rect x="44" y="60" width="8" height="24" fill="#64748b" stroke="#334155" />
    <line x1="48" y1="60" x2="48" y2="44" stroke="#e2e8f0" strokeWidth="1.5" />
    <polygon points="48,45 60,49 48,53" fill="#dc2626" />

    <rect x="148" y="60" width="8" height="24" fill="#475569" stroke="#1e293b" />
    <line x1="152" y1="60" x2="152" y2="44" stroke="#e2e8f0" strokeWidth="1.5" />
    <polygon points="152,45 164,49 152,53" fill="#dc2626" />

    {/* Heavy Iron-Banded Gateway */}
    <path d="M86 150 L100 156 L114 150 L114 120 L86 120 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
    <line x1="86" y1="128" x2="114" y2="128" stroke="#f59e0b" strokeWidth="1.5" />
    <line x1="86" y1="138" x2="114" y2="138" stroke="#f59e0b" strokeWidth="1.5" />

    {/* Arrow Slit Windows */}
    <rect x="64" y="105" width="4" height="12" rx="2" fill="#0f172a" />
    <rect x="132" y="105" width="4" height="12" rx="2" fill="#0f172a" />

    {/* Stone Staircase */}
    <path d="M78 158 L100 167 L122 158 L100 149 Z" fill="#94a3b8" />
  </g>
);

/* =========================================================================
   LEVEL 5: A Stronger Kingdom
   Royal manor with red-orange tiled roofs, decorative stonework, and royal banners.
   ========================================================================= */
const Level5RoyalManor: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-5">
    {/* Foundation */}
    <path d="M36 145 L100 174 L164 145 L100 116 Z" fill="#475569" stroke="#334155" strokeWidth="2" />
    <path d="M36 145 L36 157 L100 186 L100 174 Z" fill="#334155" />
    <path d="M100 174 L100 186 L164 157 L164 145 Z" fill="#1e293b" />

    {/* Lower Tier Sandstone Walls */}
    <path d="M46 138 L100 160 L100 90 L46 68 Z" fill="#cbd5e1" stroke="#94a3b8" />
    <path d="M100 160 L154 138 L154 68 L100 90 Z" fill="#94a3b8" stroke="#64748b" />

    {/* Multi-Tiered Terracotta Red Roof (Double Mansard) */}
    <path d="M42 74 L100 48 L158 74 L100 100 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="2" />
    <path d="M42 74 L100 48 L100 100 Z" fill="#dc2626" />
    <path d="M100 48 L158 74 L100 100 Z" fill="#991b1b" />

    {/* Second Story Tower Structure */}
    <path d="M70 56 L100 42 L130 56 L100 70 Z" fill="#f87171" stroke="#b91c1c" strokeWidth="1.5" />
    <path d="M76 46 L100 32 L124 46 L100 60 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />

    {/* Red Heraldic Banners & Gold Crests */}
    <path d="M54 94 L62 94 L62 120 L58 124 L54 120 Z" fill="#b91c1c" />
    <polygon points="58,102 60,105 56,105" fill="#facc15" />
    <path d="M138 94 L146 94 L146 120 L142 124 L138 120 Z" fill="#b91c1c" />
    <polygon points="142,102 144,105 140,105" fill="#facc15" />

    {/* Ornate Royal Archway */}
    <path d="M84 152 L100 159 L116 152 L116 118 Q100 110 84 118 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
    <circle cx="100" cy="122" r="4" fill="#facc15" />

    {/* Gold Corner Spire Accents */}
    <polygon points="42,74 40,64 44,74" fill="#facc15" />
    <polygon points="158,74 156,64 160,74" fill="#facc15" />

    {/* Braziers */}
    <polygon points="44,142 46,132 48,142" fill="url(#torch-fire)" className={animate ? 'animate-bounce' : ''} />
    <polygon points="152,142 154,132 156,142" fill="url(#torch-fire)" className={animate ? 'animate-bounce' : ''} />
  </g>
);

/* =========================================================================
   LEVEL 6: Power and Prestige
   Dark stone stronghold with golden reinforcements and elaborate roof structures.
   ========================================================================= */
const Level6PowerPrestige: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-6">
    {/* Dark Stone Plinth */}
    <path d="M34 146 L100 176 L166 146 L100 116 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
    <path d="M34 146 L34 158 L100 188 L100 176 Z" fill="#0f172a" />
    <path d="M100 176 L100 188 L166 158 L166 146 Z" fill="#020617" />

    {/* Dark Ashlar Stronghold Walls */}
    <path d="M44 138 L100 162 L100 84 L44 60 Z" fill="#334155" stroke="#1e293b" />
    <path d="M100 162 L156 138 L156 60 L100 84 Z" fill="#1e293b" stroke="#0f172a" />

    {/* Polished Gold Corner Reinforcements */}
    <path d="M44 60 L50 62 L50 140 L44 138 Z" fill="url(#gold-metal)" />
    <path d="M150 62 L156 60 L156 138 L150 140 Z" fill="url(#gold-metal)" />
    <path d="M97 84 L103 84 L103 162 L97 162 Z" fill="url(#gold-metal)" />

    {/* Elaborate Dark Roof with Gold Trim Cresting */}
    <path d="M40 68 L100 40 L160 68 L100 96 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
    <path d="M40 68 L100 40 L100 96 Z" fill="#334155" />
    <path d="M100 40 L160 68 L100 96 Z" fill="#0f172a" />

    {/* Roof Golden Cresting & Ridge Finials */}
    <line x1="100" y1="40" x2="100" y2="28" stroke="#f59e0b" strokeWidth="2.5" />
    <polygon points="100,26 104,32 96,32" fill="url(#gold-metal)" />
    <line x1="50" y1="64" x2="50" y2="52" stroke="#f59e0b" strokeWidth="2" />
    <polygon points="50,50 53,55 47,55" fill="url(#gold-metal)" />
    <line x1="150" y1="64" x2="150" y2="52" stroke="#f59e0b" strokeWidth="2" />
    <polygon points="150,50 153,55 147,55" fill="url(#gold-metal)" />

    {/* Royal Azure Banners with Golden Crests */}
    <path d="M88 78 L112 78 L112 122 L100 130 L88 122 Z" fill="#1d4ed8" stroke="#1e40af" strokeWidth="1" />
    <polygon points="100,88 106,96 100,104 94,96" fill="url(#gold-metal)" />

    {/* Grand Golden Gateway Arch */}
    <path d="M84 154 L100 160 L116 154 L116 126 Q100 118 84 126 Z" fill="#020617" stroke="url(#gold-metal)" strokeWidth="2" />
  </g>
);

/* =========================================================================
   LEVEL 7: The Royal Fortress
   Royal fortress with multiple towers, pointed roofs, and purple-and-blue banners.
   ========================================================================= */
const Level7RoyalFortress: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-7">
    {/* Base */}
    <path d="M32 148 L100 178 L168 148 L100 118 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />

    {/* Main Castle Keep Walls */}
    <path d="M46 138 L100 162 L100 78 L46 54 Z" fill="#475569" stroke="#334155" />
    <path d="M100 162 L154 138 L154 54 L100 78 Z" fill="#334155" stroke="#1e293b" />

    {/* 4 Corner Round Watchtowers with Conical Purple Spire Roofs */}
    {/* Tower 1 (Left) */}
    <rect x="36" y="58" width="16" height="80" fill="#334155" stroke="#1e293b" />
    <polygon points="44,24 32,58 56,58" fill="#6b21a8" stroke="#581c87" strokeWidth="1.5" />
    <polygon points="44,24 32,58 44,58" fill="#7e22ce" />

    {/* Tower 2 (Right) */}
    <rect x="148" y="58" width="16" height="80" fill="#1e293b" stroke="#0f172a" />
    <polygon points="156,24 144,58 168,58" fill="#581c87" stroke="#3b0764" strokeWidth="1.5" />
    <polygon points="156,24 144,58 156,58" fill="#6b21a8" />

    {/* Center Castle Tower & Pointed Spire */}
    <rect x="88" y="44" width="24" height="40" fill="#475569" stroke="#1e293b" />
    <polygon points="100,10 82,44 118,44" fill="#7e22ce" stroke="#581c87" strokeWidth="2" />
    <polygon points="100,10 82,44 100,44" fill="#9333ea" />

    {/* Purple and Blue Banners */}
    <path d="M62 90 L70 90 L70 120 L66 124 L62 120 Z" fill="#7e22ce" />
    <path d="M130 90 L138 90 L138 120 L134 124 L130 120 Z" fill="#2563eb" />

    {/* Machicolations & Portcullis Gate */}
    <path d="M84 156 L100 162 L116 156 L116 124 Q100 114 84 124 Z" fill="#0f172a" stroke="#475569" strokeWidth="2" />
    {/* Iron Grate */}
    <line x1="92" y1="126" x2="92" y2="158" stroke="#64748b" strokeWidth="1.5" />
    <line x1="100" y1="124" x2="100" y2="160" stroke="#64748b" strokeWidth="1.5" />
    <line x1="108" y1="126" x2="108" y2="158" stroke="#64748b" strokeWidth="1.5" />
  </g>
);

/* =========================================================================
   LEVEL 8: The Golden Era
   Golden citadel with ornate golden spires, dark stone, and rich architectural details.
   ========================================================================= */
const Level8GoldenCitadel: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-8">
    {/* Obsidian Base */}
    <path d="M30 148 L100 180 L170 148 L100 116 Z" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />

    {/* Dark Stone Core Walls */}
    <path d="M42 138 L100 164 L100 74 L42 48 Z" fill="#1e293b" stroke="#0f172a" />
    <path d="M100 164 L158 138 L158 48 L100 74 Z" fill="#0f172a" stroke="#020617" />

    {/* Solid Gold Battlements & Balustrades */}
    <path d="M38 48 L100 24 L162 48 L100 72 Z" fill="url(#gold-metal)" stroke="#d97706" strokeWidth="2" />

    {/* 4 Golden Corner Spires */}
    <polygon points="40,16 36,48 44,48" fill="url(#gold-metal)" />
    <polygon points="160,16 156,48 164,48" fill="url(#gold-metal)" />
    <polygon points="100,4 94,36 106,36" fill="url(#gold-metal)" />

    {/* Gold Filigree Corner Ribs */}
    <line x1="42" y1="48" x2="42" y2="138" stroke="url(#gold-metal)" strokeWidth="3" />
    <line x1="158" y1="48" x2="158" y2="138" stroke="url(#gold-metal)" strokeWidth="3" />
    <line x1="100" y1="74" x2="100" y2="164" stroke="url(#gold-metal)" strokeWidth="3" />

    {/* Golden Royal Banners with Lion Heraldry */}
    <path d="M84 82 L116 82 L116 128 L100 138 L84 128 Z" fill="#1e3a8a" stroke="url(#gold-metal)" strokeWidth="1.5" />
    <polygon points="100,92 106,102 100,112 94,102" fill="url(#gold-metal)" />

    {/* Ornate Gold Gateway Portico */}
    <path d="M82 158 L100 165 L118 158 L118 126 Q100 114 82 126 Z" fill="#020617" stroke="url(#gold-metal)" strokeWidth="2.5" />

    {/* Braziers */}
    <circle cx="50" cy="144" r="4" fill="#fbbf24" className={animate ? 'animate-ping' : ''} />
    <circle cx="150" cy="144" r="4" fill="#fbbf24" className={animate ? 'animate-ping' : ''} />
  </g>
);

/* =========================================================================
   LEVEL 9: Dragon's Keep
   Dragon-themed keep with charcoal stone, dark red roofs, and fiery accents.
   ========================================================================= */
const Level9DragonKeep: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-9">
    {/* Volcanic Basalt Base */}
    <path d="M30 148 L100 180 L170 148 L100 116 Z" fill="#18181b" stroke="#71717a" strokeWidth="2" />

    {/* Charcoal Stone Keep */}
    <path d="M42 138 L100 164 L100 70 L42 44 Z" fill="#27272a" stroke="#18181b" />
    <path d="M100 164 L158 138 L158 44 L100 70 Z" fill="#18181b" stroke="#09090b" />

    {/* Crimson Dragon-Scale Roof */}
    <path d="M38 46 L100 20 L162 46 L100 72 Z" fill="#7f1d1d" stroke="#991b1b" strokeWidth="2" />
    <path d="M38 46 L100 20 L100 72 Z" fill="#991b1b" />
    <path d="M100 20 L162 46 L100 72 Z" fill="#450a0a" />

    {/* Horned Dragon Spires */}
    <path d="M38 44 Q30 20 22 14 Q28 28 36 46 Z" fill="#3f3f46" stroke="#27272a" />
    <path d="M162 44 Q170 20 178 14 Q172 28 164 46 Z" fill="#27272a" stroke="#18181b" />
    <polygon points="100,6 92,30 108,30" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />

    {/* Glowing Fiery Heat Vents */}
    <rect x="55" y="90" width="8" height="14" rx="2" fill="#ef4444" className={animate ? 'animate-pulse' : ''} />
    <rect x="137" y="90" width="8" height="14" rx="2" fill="#ef4444" className={animate ? 'animate-pulse' : ''} />

    {/* Dragon Maw Archway with Molten Red Glow */}
    <path d="M82 158 L100 165 L118 158 L118 122 Q100 108 82 122 Z" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
    <polygon points="90,122 93,128 96,122" fill="#e4e4e7" />
    <polygon points="104,122 107,128 110,122" fill="#e4e4e7" />
  </g>
);

/* =========================================================================
   LEVEL 10: Infernal Fortress
   Infernal fortress with blackened stone, orange glowing elements, and powerful towers.
   ========================================================================= */
const Level10InfernalFortress: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-10">
    {/* Blackened Stone & Magma Base */}
    <path d="M28 148 L100 182 L172 148 L100 114 Z" fill="#09090b" stroke="#ea580c" strokeWidth="2" />

    {/* Obsidian Spiked Ramparts */}
    <path d="M40 138 L100 166 L100 66 L40 38 Z" fill="#18181b" stroke="#09090b" />
    <path d="M100 166 L160 138 L160 38 L100 66 Z" fill="#09090b" stroke="#000000" />

    {/* Molten Magma Conduits / Fissures */}
    <line x1="40" y1="38" x2="40" y2="138" stroke="url(#magma-glow)" strokeWidth="3" className={animate ? 'animate-pulse' : ''} />
    <line x1="160" y1="38" x2="160" y2="138" stroke="url(#magma-glow)" strokeWidth="3" className={animate ? 'animate-pulse' : ''} />
    <line x1="100" y1="66" x2="100" y2="166" stroke="url(#magma-glow)" strokeWidth="4" className={animate ? 'animate-pulse' : ''} />

    {/* Infernal Crown Top Tower */}
    <polygon points="100,10 70,36 82,42 100,32 118,42 130,36" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
    <circle cx="100" cy="24" r="7" fill="#facc15" className={animate ? 'animate-ping' : ''} />

    {/* Glowing Orange Lava Core Gateway */}
    <path d="M80 160 L100 168 L120 160 L120 120 L80 120 Z" fill="#7c2d12" stroke="#ea580c" strokeWidth="2.5" />
    <polygon points="100,130 92,156 108,156" fill="url(#magma-glow)" />
  </g>
);

/* =========================================================================
   LEVEL 11: Imperial Palace
   Imperial palace with elegant white stone, blue roofs, and luxurious golden ornaments.
   ========================================================================= */
const Level11ImperialPalace: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-11">
    {/* Pristine White Marble Plinth */}
    <path d="M28 148 L100 182 L172 148 L100 114 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />

    {/* Elegant White Granite Columns & Walls */}
    <path d="M38 138 L100 166 L100 66 L38 38 Z" fill="#f8fafc" stroke="#e2e8f0" />
    <path d="M100 166 L162 138 L162 38 L100 66 Z" fill="#e2e8f0" stroke="#cbd5e1" />

    {/* Royal Lapis Lazuli Blue Roofs */}
    <path d="M34 44 L100 16 L166 44 L100 72 Z" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
    <path d="M34 44 L100 16 L100 72 Z" fill="#2563eb" />
    <path d="M100 16 L166 44 L100 72 Z" fill="#1e40af" />

    {/* Gilded Golden Eagle Spires */}
    <polygon points="100,4 90,24 110,24" fill="url(#gold-metal)" />
    <polygon points="34,28 30,46 38,46" fill="url(#gold-metal)" />
    <polygon points="166,28 162,46 170,46" fill="url(#gold-metal)" />

    {/* Luxurious Gold Trim & Eagle Crest Banner */}
    <line x1="38" y1="38" x2="38" y2="138" stroke="url(#gold-metal)" strokeWidth="3" />
    <line x1="162" y1="38" x2="162" y2="138" stroke="url(#gold-metal)" strokeWidth="3" />
    <path d="M84 76 L116 76 L116 122 L100 132 L84 122 Z" fill="#1e3a8a" stroke="url(#gold-metal)" strokeWidth="2" />
    <circle cx="100" cy="94" r="6" fill="url(#gold-metal)" />

    {/* Grand Marble Archway */}
    <path d="M80 158 L100 166 L120 158 L120 120 Q100 108 80 120 Z" fill="#0f172a" stroke="url(#gold-metal)" strokeWidth="2.5" />
  </g>
);

/* =========================================================================
   LEVEL 12: Legendary Arcane Citadel
   Legendary arcane citadel with dark royal stone, golden spires, purple crystals,
   and a luminous magical centerpiece (Giga Tesla core).
   ========================================================================= */
const Level12ArcaneCitadel: React.FC<{ animate: boolean }> = ({ animate }) => (
  <g id="th-lvl-12">
    {/* Dark Royal Obsidian Plinth */}
    <path d="M26 148 L100 184 L174 148 L100 112 Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />

    {/* Dark Royal Midnight Walls */}
    <path d="M36 138 L100 168 L100 62 L36 32 Z" fill="#2e1065" stroke="#1e1b4b" />
    <path d="M100 168 L164 138 L164 32 L100 62 Z" fill="#1e1b4b" stroke="#0f172a" />

    {/* Golden Citadel Cornices */}
    <line x1="36" y1="32" x2="36" y2="138" stroke="url(#gold-metal)" strokeWidth="3.5" />
    <line x1="164" y1="32" x2="164" y2="138" stroke="url(#gold-metal)" strokeWidth="3.5" />
    <line x1="100" y1="62" x2="100" y2="168" stroke="url(#gold-metal)" strokeWidth="4" />

    {/* High Tower Arcane Spire Top */}
    <path d="M30 40 L100 10 L170 40 L100 70 Z" fill="#3b0764" stroke="url(#gold-metal)" strokeWidth="2" />

    {/* Luminous Arcane Magic Centerpiece (Giga Tesla Core) */}
    <circle
      cx="100"
      cy="32"
      r="13"
      fill="url(#arcane-crystal)"
      stroke="#f5d0fe"
      strokeWidth="2"
      className={animate ? 'animate-pulse' : ''}
    />
    <circle cx="100" cy="32" r="5" fill="#ffffff" />
    {/* Electric Spark Rays */}
    {animate && (
      <g stroke="#38bdf8" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: '100px 32px' }}>
        <line x1="100" y1="14" x2="100" y2="20" />
        <line x1="100" y1="44" x2="100" y2="50" />
        <line x1="82" y1="32" x2="88" y2="32" />
        <line x1="112" y1="32" x2="118" y2="32" />
      </g>
    )}

    {/* Floating Arcane Crystals over Corner Spires */}
    <polygon
      points="36,12 30,24 36,36 42,24"
      fill="url(#arcane-crystal)"
      className={animate ? 'animate-bounce' : ''}
      style={{ animationDuration: '2s' }}
    />
    <polygon
      points="164,12 158,24 164,36 170,24"
      fill="url(#arcane-crystal)"
      className={animate ? 'animate-bounce' : ''}
      style={{ animationDuration: '2.5s' }}
    />

    {/* Grand Golden Arcane Gateway */}
    <path d="M78 160 L100 169 L122 160 L122 118 Q100 104 78 118 Z" fill="#0f172a" stroke="url(#gold-metal)" strokeWidth="3" />
    <polygon points="100,126 92,142 108,142" fill="url(#arcane-crystal)" />
  </g>
);
