import * as THREE from 'three';
import { GameMaterials } from './materials';

// Helper to create shadow-casting meshes
export function createMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  castShadow = true,
  receiveShadow = true
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  return mesh;
}

/* =========================================================================
   3D CHARACTER BUILDERS
   Fully modeled 3D game characters with head, body, limbs, hair, and gear
   ========================================================================= */

// 3D Archer Character with pink hair, tunic, bow and quiver
export function createArcherCharacter(scale: number = 0.5): THREE.Group {
  const char = new THREE.Group();
  char.name = 'ArcherCharacter';

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 }); // Pink hair
  const tunicMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 }); // Emerald tunic
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }); // Brown leather
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });

  // 1. Legs
  const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.45, 8);
  const leftLeg = createMesh(legGeo, leatherMat);
  leftLeg.position.set(-0.12, 0.22, 0);
  const rightLeg = createMesh(legGeo, leatherMat);
  rightLeg.position.set(0.12, 0.22, 0);
  char.add(leftLeg, rightLeg);

  // 2. Torso / Tunic
  const torsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.5, 8);
  const torso = createMesh(torsoGeo, tunicMat);
  torso.position.set(0, 0.65, 0);
  char.add(torso);

  // Belt
  const beltGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.08, 8);
  const belt = createMesh(beltGeo, leatherMat);
  belt.position.set(0, 0.48, 0);
  char.add(belt);

  // 3. Head & Face
  const headGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const head = createMesh(headGeo, skinMat);
  head.position.set(0, 1.05, 0);
  char.add(head);

  // Pink Hair (Stylized Bun & Fringe)
  const hairGeo = new THREE.SphereGeometry(0.21, 12, 12);
  const hair = createMesh(hairGeo, hairMat);
  hair.position.set(0, 1.08, -0.04);
  hair.scale.set(1.05, 1.1, 1.15);
  char.add(hair);

  const bunGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const bun = createMesh(bunGeo, hairMat);
  bun.position.set(0, 1.25, -0.15);
  char.add(bun);

  // 4. Arms & Bow
  const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.4, 8);
  const leftArm = createMesh(armGeo, skinMat);
  leftArm.position.set(-0.25, 0.65, 0.1);
  leftArm.rotation.set(0.6, 0, 0.4);
  char.add(leftArm);

  const rightArm = createMesh(armGeo, skinMat);
  rightArm.position.set(0.25, 0.65, 0.1);
  rightArm.rotation.set(0.6, 0, -0.4);
  char.add(rightArm);

  // Bow (Torus / Curved Tube)
  const bowCurve = new THREE.TorusGeometry(0.35, 0.03, 6, 12, Math.PI * 0.7);
  const bow = createMesh(bowCurve, woodMat);
  bow.position.set(0.28, 0.65, 0.28);
  bow.rotation.set(0, 1.5, 0.5);
  char.add(bow);

  // Quiver on Back with Arrows
  const quiverGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.45, 8);
  const quiver = createMesh(quiverGeo, leatherMat);
  quiver.position.set(-0.12, 0.75, -0.2);
  quiver.rotation.set(0.3, 0, -0.3);
  char.add(quiver);

  // Arrows in quiver
  const arrowGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6);
  const fletchMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const arrow1 = createMesh(arrowGeo, fletchMat);
  arrow1.position.set(-0.12, 0.95, -0.25);
  char.add(arrow1);

  char.scale.set(scale, scale, scale);
  return char;
}

// 3D Barbarian Soldier
export function createBarbarianCharacter(scale: number = 0.5): THREE.Group {
  const char = new THREE.Group();
  char.name = 'BarbarianCharacter';

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5b971, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }); // Yellow hair & mustache
  const kiltMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.4, 8);
  const leftLeg = createMesh(legGeo, skinMat);
  leftLeg.position.set(-0.14, 0.2, 0);
  const rightLeg = createMesh(legGeo, skinMat);
  rightLeg.position.set(0.14, 0.2, 0);
  char.add(leftLeg, rightLeg);

  // Torso (Muscular)
  const torsoGeo = new THREE.BoxGeometry(0.48, 0.52, 0.3);
  const torso = createMesh(torsoGeo, skinMat);
  torso.position.set(0, 0.65, 0);
  char.add(torso);

  // Leather Kilt
  const kiltGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.24, 8);
  const kilt = createMesh(kiltGeo, kiltMat);
  kilt.position.set(0, 0.44, 0);
  char.add(kilt);

  // Head
  const headGeo = new THREE.SphereGeometry(0.2, 10, 10);
  const head = createMesh(headGeo, skinMat);
  head.position.set(0, 1.05, 0);
  char.add(head);

  // Yellow Hair & Big Mustache
  const hairGeo = new THREE.BoxGeometry(0.42, 0.2, 0.38);
  const hair = createMesh(hairGeo, hairMat);
  hair.position.set(0, 1.18, -0.02);
  char.add(hair);

  const mustacheGeo = new THREE.BoxGeometry(0.32, 0.08, 0.12);
  const stache = createMesh(mustacheGeo, hairMat);
  stache.position.set(0, 0.98, 0.18);
  char.add(stache);

  // Broadsword in hand
  const swordBlade = createMesh(new THREE.BoxGeometry(0.08, 0.65, 0.02), ironMat);
  swordBlade.position.set(0.35, 0.75, 0.15);
  swordBlade.rotation.x = 0.5;
  char.add(swordBlade);

  char.scale.set(scale, scale, scale);
  return char;
}

// 3D Builder Character with Yellow Cap and Hammer
export function createBuilderCharacter(scale: number = 0.5): THREE.Group {
  const char = new THREE.Group();
  char.name = 'BuilderCharacter';

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.6 });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }); // Yellow hardhat
  const overallMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 }); // Blue overalls
  const toolMat = new THREE.MeshStandardMaterial({ color: 0x78716c, metalness: 0.7, roughness: 0.4 });

  // Body
  const bodyGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.55, 8);
  const body = createMesh(bodyGeo, overallMat);
  body.position.set(0, 0.5, 0);
  char.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.2, 10, 10);
  const head = createMesh(headGeo, skinMat);
  head.position.set(0, 0.92, 0);
  char.add(head);

  // Yellow Hardhat / Builder Cap
  const hatGeo = new THREE.SphereGeometry(0.23, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const hat = createMesh(hatGeo, hatMat);
  hat.position.set(0, 0.98, 0);
  char.add(hat);

  // Hammer in hand
  const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 6);
  const handle = createMesh(handleGeo, GameMaterials.woodPlanksMaterial);
  handle.position.set(0.3, 0.55, 0.1);
  handle.rotation.z = -0.4;
  const headTool = createMesh(new THREE.BoxGeometry(0.18, 0.1, 0.1), toolMat);
  headTool.position.set(0.38, 0.7, 0.1);
  char.add(handle, headTool);

  char.scale.set(scale, scale, scale);
  return char;
}

/* =========================================================================
   3D MODULAR WALL SEGMENT (Single Block 3D)
   Thick stone block with chamfered top coping, realistic mortar, and pillars
   ========================================================================= */
export function create3DWallSegment(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Wall_Block';

  const stoneMat = GameMaterials.wallStoneMaterial;
  const darkStoneMat = GameMaterials.stoneFoundationMaterial;

  // 1. Base foundation stone
  const baseGeo = new THREE.BoxGeometry(0.96, 0.2, 0.96);
  const base = createMesh(baseGeo, darkStoneMat);
  base.position.y = 0.1;
  group.add(base);

  // 2. Main Wall Body Block (Visible thickness & sides)
  const wallBodyGeo = new THREE.BoxGeometry(0.88, 0.75, 0.88);
  const wallBody = createMesh(wallBodyGeo, stoneMat);
  wallBody.position.y = 0.55;
  group.add(wallBody);

  // 3. Chamfered Top Coping Stone
  const topCopingGeo = new THREE.BoxGeometry(0.94, 0.18, 0.94);
  const topCoping = createMesh(topCopingGeo, stoneMat);
  topCoping.position.y = 1.0;
  group.add(topCoping);

  // 4. Subtle corner bevel studs / rivets for tactile medieval feel
  const studGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const studMat = GameMaterials.ironMetalMaterial;
  const corners = [
    [-0.42, -0.42],
    [0.42, -0.42],
    [-0.42, 0.42],
    [0.42, 0.42],
  ];
  corners.forEach(([cx, cz]) => {
    const s = createMesh(studGeo, studMat);
    s.position.set(cx, 1.08, cz);
    group.add(s);
  });

  return group;
}

/* =========================================================================
   3D ARCHER TOWER (Timber Frame, Elevated Platform, Archer Atop)
   ========================================================================= */
export function create3DArcherTower(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Archer_Tower';

  const woodMat = GameMaterials.woodPlanksMaterial;
  const darkWood = GameMaterials.woodDarkMaterial;
  const stoneMat = GameMaterials.stoneFoundationMaterial;

  // 1. Stone Foundation Footings (4 Corners)
  const footGeo = new THREE.BoxGeometry(0.45, 0.35, 0.45);
  const corners = [
    [-0.8, -0.8],
    [0.8, -0.8],
    [-0.8, 0.8],
    [0.8, 0.8],
  ];
  corners.forEach(([x, z]) => {
    const footing = createMesh(footGeo, stoneMat);
    footing.position.set(x, 0.175, z);
    group.add(footing);
  });

  // 2. Four Slanted Wooden Timber Support Legs
  corners.forEach(([x, z]) => {
    const legGeo = new THREE.CylinderGeometry(0.12, 0.16, 2.5, 6);
    const leg = createMesh(legGeo, woodMat);
    leg.position.set(x * 0.75, 1.45, z * 0.75);
    leg.rotation.x = z * -0.07;
    leg.rotation.z = x * 0.07;
    group.add(leg);
  });

  // 3. Horizontal & Diagonal Cross Braces
  const braceGeo = new THREE.BoxGeometry(1.4, 0.12, 0.12);
  const b1 = createMesh(braceGeo, darkWood);
  b1.position.set(0, 1.3, -0.6);
  const b2 = createMesh(braceGeo, darkWood);
  b2.position.set(0, 1.3, 0.6);
  group.add(b1, b2);

  const b3 = createMesh(braceGeo, darkWood);
  b3.position.set(-0.6, 1.3, 0);
  b3.rotation.y = Math.PI / 2;
  const b4 = createMesh(braceGeo, darkWood);
  b4.position.set(0.6, 1.3, 0);
  b4.rotation.y = Math.PI / 2;
  group.add(b3, b4);

  // 4. Elevated Wooden Observation Platform Floor
  const floorGeo = new THREE.BoxGeometry(1.9, 0.2, 1.9);
  const floor = createMesh(floorGeo, darkWood);
  floor.position.set(0, 2.6, 0);
  group.add(floor);

  // 5. Wooden Railings & Corner Posts
  const railGeo = new THREE.BoxGeometry(1.85, 0.45, 0.08);
  const rNorth = createMesh(railGeo, woodMat);
  rNorth.position.set(0, 2.9, -0.9);
  const rSouth = createMesh(railGeo, woodMat);
  rSouth.position.set(0, 2.9, 0.9);
  const rEast = createMesh(railGeo, woodMat);
  rEast.position.set(0.9, 2.9, 0);
  rEast.rotation.y = Math.PI / 2;
  const rWest = createMesh(railGeo, woodMat);
  rWest.position.set(-0.9, 2.9, 0);
  rWest.rotation.y = Math.PI / 2;
  group.add(rNorth, rSouth, rEast, rWest);

  // 6. Wooden Access Ladder
  const ladderRail = new THREE.BoxGeometry(0.06, 2.4, 0.06);
  const l1 = createMesh(ladderRail, darkWood);
  l1.position.set(-0.25, 1.3, 0.7);
  const l2 = createMesh(ladderRail, darkWood);
  l2.position.set(0.25, 1.3, 0.7);
  group.add(l1, l2);
  for (let y = 0.4; y < 2.4; y += 0.4) {
    const rung = createMesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), woodMat);
    rung.position.set(0, y, 0.7);
    group.add(rung);
  }

  // 7. 3D Archer Character Standing Atop the Tower
  const archer = createArcherCharacter(0.6);
  archer.position.set(0, 2.7, 0);
  archer.name = 'TowerArcherUnit';
  group.add(archer);

  return group;
}

/* =========================================================================
   3D CANNON (Wooden Turntable Base, Cast-Iron Rotating Barrel)
   ========================================================================= */
export function create3DCannon(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Cannon';

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const woodMat = GameMaterials.woodPlanksMaterial;
  const ironMat = GameMaterials.ironMetalMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;

  // 1. Stone Octagonal Foundation Slab
  const baseGeo = new THREE.CylinderGeometry(1.3, 1.45, 0.25, 8);
  const base = createMesh(baseGeo, stoneMat);
  base.position.y = 0.125;
  group.add(base);

  // 2. Heavy Timber Turntable Platform
  const turntableGeo = new THREE.CylinderGeometry(1.15, 1.2, 0.3, 8);
  const turntable = createMesh(turntableGeo, woodMat);
  turntable.position.y = 0.4;
  group.add(turntable);

  // 3. Revolving Mount Assembly
  const mountAssembly = new THREE.Group();
  mountAssembly.name = 'CannonMountAssembly';
  mountAssembly.position.y = 0.55;

  // Pivot Side Brackets
  const bracketGeo = new THREE.BoxGeometry(0.22, 0.75, 0.9);
  const leftBracket = createMesh(bracketGeo, ironMat);
  leftBracket.position.set(-0.55, 0.35, 0);
  const rightBracket = createMesh(bracketGeo, ironMat);
  rightBracket.position.set(0.55, 0.35, 0);
  mountAssembly.add(leftBracket, rightBracket);

  // Golden Pivot Screws
  const boltGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.25, 8);
  boltGeo.rotateZ(Math.PI / 2);
  const axle = createMesh(boltGeo, goldMat);
  axle.position.set(0, 0.45, 0);
  mountAssembly.add(axle);

  // Heavy Cast-Iron Barrel
  const barrelGroup = new THREE.Group();
  barrelGroup.position.set(0, 0.45, 0);
  barrelGroup.rotation.x = -0.3; // Aimed up in classic Clash angle

  // Breech (back sphere/cylinder)
  const breechGeo = new THREE.SphereGeometry(0.38, 12, 12);
  const breech = createMesh(breechGeo, ironMat);
  breech.position.set(0, 0, -0.4);
  barrelGroup.add(breech);

  // Main Barrel Tube
  const tubeGeo = new THREE.CylinderGeometry(0.34, 0.42, 1.4, 16);
  tubeGeo.rotateX(Math.PI / 2);
  const tube = createMesh(tubeGeo, ironMat);
  tube.position.set(0, 0, 0.3);
  barrelGroup.add(tube);

  // Reinforced Gold Rings on Barrel
  const ringGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 16);
  const r1 = createMesh(ringGeo, goldMat);
  r1.position.set(0, 0, 0.1);
  const r2 = createMesh(ringGeo, goldMat);
  r2.position.set(0, 0, 0.6);
  barrelGroup.add(r1, r2);

  // Muzzle Flare Ring & Dark Bore
  const muzzleGeo = new THREE.CylinderGeometry(0.44, 0.4, 0.18, 16);
  muzzleGeo.rotateX(Math.PI / 2);
  const muzzle = createMesh(muzzleGeo, ironMat);
  muzzle.position.set(0, 0, 1.0);
  barrelGroup.add(muzzle);

  // Bore opening (dark inside)
  const boreMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const boreGeo = new THREE.CircleGeometry(0.25, 12);
  const bore = new THREE.Mesh(boreGeo, boreMat);
  bore.position.set(0, 0, 1.1);
  barrelGroup.add(bore);

  mountAssembly.add(barrelGroup);
  group.add(mountAssembly);

  return group;
}

/* =========================================================================
   3D MORTAR (Angled High-Trajectory Heavy Tube & Cannonball Stack)
   ========================================================================= */
export function create3DMortar(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Mortar';

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const ironMat = GameMaterials.ironMetalMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;

  // 1. Octagonal Stone Base with Bronze Rivet Band
  const baseGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.35, 8);
  const base = createMesh(baseGeo, stoneMat);
  base.position.y = 0.175;
  group.add(base);

  // 2. Heavy Circular Turntable
  const ringGeo = new THREE.TorusGeometry(1.0, 0.14, 8, 16);
  ringGeo.rotateX(Math.PI / 2);
  const ring = createMesh(ringGeo, goldMat);
  ring.position.y = 0.4;
  group.add(ring);

  // 3. Heavy Mortar Tube (Angled steeply)
  const tubeGroup = new THREE.Group();
  tubeGroup.position.set(0, 0.45, -0.15);
  tubeGroup.rotation.x = -0.7; // 40-degree high trajectory

  const tubeGeo = new THREE.CylinderGeometry(0.48, 0.6, 1.5, 16);
  const tube = createMesh(tubeGeo, ironMat);
  tube.position.y = 0.6;
  tubeGroup.add(tube);

  // Gold Band around Mortar Lip
  const lipGeo = new THREE.TorusGeometry(0.52, 0.08, 8, 16);
  lipGeo.rotateX(Math.PI / 2);
  const lip = createMesh(lipGeo, goldMat);
  lip.position.y = 1.35;
  tubeGroup.add(lip);

  // Dark Inner Chamber
  const darkChamber = new THREE.Mesh(
    new THREE.CircleGeometry(0.38, 12),
    new THREE.MeshBasicMaterial({ color: 0x050505 })
  );
  darkChamber.position.y = 1.36;
  darkChamber.rotation.x = -Math.PI / 2;
  tubeGroup.add(darkChamber);

  group.add(tubeGroup);

  // 4. Pyramid of Iron Cannonballs Stacked Beside Mortar
  const ballGeo = new THREE.SphereGeometry(0.18, 10, 10);
  const ballPositions = [
    [-0.7, 0.18, 0.7],
    [-0.35, 0.18, 0.7],
    [-0.52, 0.18, 0.38],
    [-0.52, 0.45, 0.55], // Top ball
  ];
  ballPositions.forEach(([bx, by, bz]) => {
    const ball = createMesh(ballGeo, ironMat);
    ball.position.set(bx, by, bz);
    group.add(ball);
  });

  return group;
}

/* =========================================================================
   3D WIZARD TOWER (Stone Spire, Crystal Sconces, Swirling Violet Orb)
   ========================================================================= */
export function create3DWizardTower(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Wizard_Tower';

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });

  // 1. Chiseled Octagonal Base
  const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.6, 8);
  const base = createMesh(baseGeo, stoneMat);
  base.position.y = 0.3;
  group.add(base);

  // 2. Tower Midsection
  const midGeo = new THREE.CylinderGeometry(0.9, 1.15, 2.2, 8);
  const mid = createMesh(midGeo, stoneMat);
  mid.position.y = 1.6;
  group.add(mid);

  // 3. Upper Parapet Platform with Crenellations
  const parapetGeo = new THREE.CylinderGeometry(1.2, 0.95, 0.4, 8);
  const parapet = createMesh(parapetGeo, stoneMat);
  parapet.position.y = 2.8;
  group.add(parapet);

  // 4. Purple Crystal Horns / Brackets
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const hornGeo = new THREE.ConeGeometry(0.16, 0.6, 6);
    const horn = createMesh(hornGeo, crystalMat);
    horn.position.set(Math.cos(angle) * 1.05, 3.1, Math.sin(angle) * 1.05);
    horn.rotation.z = -Math.cos(angle) * 0.4;
    horn.rotation.x = Math.sin(angle) * 0.4;
    group.add(horn);
  }

  // 5. Levitating Arcane Orb (Magic Core)
  const orbGeo = new THREE.SphereGeometry(0.45, 16, 16);
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: 0xf472b6,
    emissive: 0xc026d3,
    emissiveIntensity: 0.8,
    transmission: 0.6,
    roughness: 0.1,
  });
  const orb = createMesh(orbGeo, orbMat);
  orb.position.set(0, 3.3, 0);
  orb.name = 'ArcaneCoreOrb';
  group.add(orb);

  return group;
}

/* =========================================================================
   3D ARMY CAMP (Red/White Striped Tent, Campfire, Troops, Crates)
   ========================================================================= */
export function create3DArmyCamp(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Army_Camp';

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const woodMat = GameMaterials.woodPlanksMaterial;
  const tentMat = GameMaterials.tentFabricMaterial;

  // 1. Earth / Campsite Clearing Circle
  const dirtGeo = new THREE.CylinderGeometry(2.2, 2.3, 0.08, 16);
  const dirtMat = new THREE.MeshStandardMaterial({ color: 0x60452b, roughness: 0.95 });
  const dirt = createMesh(dirtGeo, dirtMat);
  dirt.position.y = 0.04;
  group.add(dirt);

  // 2. Main Red & White Striped Tent
  const tentGroup = new THREE.Group();
  tentGroup.position.set(-0.7, 0, -0.6);

  // Conical faceted roof
  const tentRoofGeo = new THREE.ConeGeometry(1.25, 1.4, 10);
  const tentRoof = createMesh(tentRoofGeo, tentMat);
  tentRoof.position.y = 1.35;
  tentGroup.add(tentRoof);

  // Tent wooden center pole
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.3, 6);
  const pole = createMesh(poleGeo, woodMat);
  pole.position.y = 1.15;
  tentGroup.add(pole);

  // Tent pennant flag
  const flagGeo = new THREE.ConeGeometry(0.12, 0.35, 3);
  flagGeo.rotateZ(Math.PI / 2);
  const flag = createMesh(flagGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
  flag.position.set(0.15, 2.2, 0);
  tentGroup.add(flag);

  group.add(tentGroup);

  // 3. Central Campfire with Stone Ring & Fire Embers
  const fireGroup = new THREE.Group();
  fireGroup.position.set(0.3, 0, 0.2);

  // Stone ring
  const stoneRing = new THREE.TorusGeometry(0.35, 0.1, 6, 10);
  stoneRing.rotateX(Math.PI / 2);
  const ring = createMesh(stoneRing, stoneMat);
  ring.position.y = 0.08;
  fireGroup.add(ring);

  // Wooden burning logs
  for (let i = 0; i < 3; i++) {
    const log = createMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6), GameMaterials.woodDarkMaterial);
    log.position.y = 0.12;
    log.rotation.y = (i * Math.PI) / 3;
    log.rotation.z = 0.3;
    fireGroup.add(log);
  }

  // Fire Flame Cone
  const flameGeo = new THREE.ConeGeometry(0.22, 0.5, 8);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.y = 0.35;
  flame.name = 'CampfireFlame';
  fireGroup.add(flame);

  // Fire Warm Point Light
  const fireLight = new THREE.PointLight(0xf97316, 2.0, 4.5);
  fireLight.position.set(0, 0.45, 0);
  fireLight.name = 'CampfireLight';
  fireGroup.add(fireLight);

  group.add(fireGroup);

  // 4. Wooden Crates & Training Target
  const crateGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const c1 = createMesh(crateGeo, woodMat);
  c1.position.set(1.2, 0.2, -0.9);
  const c2 = createMesh(crateGeo, woodMat);
  c2.position.set(1.4, 0.2, -0.5);
  group.add(c1, c2);

  // 5. 3D Miniature Soldiers (Barbarian & Archer) Gathering at Camp
  const soldier1 = createBarbarianCharacter(0.45);
  soldier1.position.set(0.9, 0, 0.4);
  soldier1.rotation.y = -2.2;
  group.add(soldier1);

  const soldier2 = createArcherCharacter(0.45);
  soldier2.position.set(-0.2, 0, 1.1);
  soldier2.rotation.y = -0.5;
  group.add(soldier2);

  return group;
}

/* =========================================================================
   3D GOLD STORAGE (Vault with Glittering Mounds of Gold)
   ========================================================================= */
export function create3DGoldStorage(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Gold_Storage';

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;
  const ironMat = GameMaterials.ironMetalMaterial;

  // 1. Stone Vault Base
  const baseGeo = new THREE.BoxGeometry(1.8, 0.4, 1.8);
  const base = createMesh(baseGeo, stoneMat);
  base.position.y = 0.2;
  group.add(base);

  // 2. Four Stone Corner Pillars
  const colGeo = new THREE.BoxGeometry(0.4, 1.4, 0.4);
  const corners = [
    [-0.7, -0.7],
    [0.7, -0.7],
    [-0.7, 0.7],
    [0.7, 0.7],
  ];
  corners.forEach(([cx, cz]) => {
    const col = createMesh(colGeo, stoneMat);
    col.position.set(cx, 0.9, cz);
    group.add(col);
  });

  // 3. Vault Iron Grate Walls
  const wallGeo = new THREE.BoxGeometry(1.4, 0.8, 0.1);
  const w1 = createMesh(wallGeo, ironMat);
  w1.position.set(0, 0.8, -0.7);
  const w2 = createMesh(wallGeo, ironMat);
  w2.position.set(0, 0.8, 0.7);
  const w3 = createMesh(wallGeo, ironMat);
  w3.position.set(-0.7, 0.8, 0);
  w3.rotation.y = Math.PI / 2;
  const w4 = createMesh(wallGeo, ironMat);
  w4.position.set(0.7, 0.8, 0);
  w4.rotation.y = Math.PI / 2;
  group.add(w1, w2, w3, w4);

  // 4. Mounds of Glittering 3D Gold Coins inside the Vault
  const goldMoundGeo = new THREE.SphereGeometry(0.75, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const goldMound = createMesh(goldMoundGeo, goldMat);
  goldMound.position.set(0, 0.4, 0);
  group.add(goldMound);

  // Gold Bullion Bars on top
  for (let i = 0; i < 4; i++) {
    const bar = createMesh(new THREE.BoxGeometry(0.3, 0.1, 0.15), goldMat);
    bar.position.set((Math.random() - 0.5) * 0.6, 0.95 + i * 0.08, (Math.random() - 0.5) * 0.6);
    bar.rotation.y = Math.random() * Math.PI;
    group.add(bar);
  }

  return group;
}

/* =========================================================================
   3D ELIXIR STORAGE (Octagonal Base, Translucent Glass Sphere with Liquid)
   ========================================================================= */
export function create3DElixirStorage(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Elixir_Storage';

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;
  const glassMat = GameMaterials.elixirGlassMaterial;
  const liquidMat = GameMaterials.elixirLiquidMaterial;

  // 1. Octagonal Stone Base Ring
  const baseGeo = new THREE.CylinderGeometry(1.1, 1.25, 0.4, 8);
  const base = createMesh(baseGeo, stoneMat);
  base.position.y = 0.2;
  group.add(base);

  // 2. Brass Support Clamp Feet
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const clamp = createMesh(new THREE.BoxGeometry(0.18, 0.5, 0.22), goldMat);
    clamp.position.set(Math.cos(angle) * 1.05, 0.45, Math.sin(angle) * 1.05);
    clamp.rotation.y = -angle;
    group.add(clamp);
  }

  // 3. Glowing Purple Liquid Sphere
  const liquidGeo = new THREE.SphereGeometry(0.85, 16, 16);
  const liquid = createMesh(liquidGeo, liquidMat);
  liquid.position.set(0, 1.15, 0);
  liquid.name = 'ElixirLiquidSphere';
  group.add(liquid);

  // 4. Outer Translucent Glass Containment Sphere
  const glassGeo = new THREE.SphereGeometry(0.92, 16, 16);
  const glass = createMesh(glassGeo, glassMat);
  glass.position.set(0, 1.15, 0);
  group.add(glass);

  // Subtle interior violet glow light
  const elixirLight = new THREE.PointLight(0xc026d3, 1.2, 3.5);
  elixirLight.position.set(0, 1.15, 0);
  group.add(elixirLight);

  return group;
}

/* =========================================================================
   3D BARRACKS (Military Quarters, Red Tiled Roof, Crossed Swords Emblem)
   ========================================================================= */
export function create3DBarracks(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Barracks';

  const woodMat = GameMaterials.woodPlanksMaterial;
  const roofMat = GameMaterials.roofTileRedMaterial;
  const darkWood = GameMaterials.woodDarkMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;

  // 1. Timber Wall Body
  const houseGeo = new THREE.BoxGeometry(1.6, 0.9, 1.4);
  const house = createMesh(houseGeo, woodMat);
  house.position.y = 0.45;
  group.add(house);

  // 2. Gabled Red Shingle Roof
  const roofGeo = new THREE.ConeGeometry(1.4, 0.9, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = createMesh(roofGeo, roofMat);
  roof.position.y = 1.35;
  group.add(roof);

  // 3. Wooden Doorway
  const doorGeo = new THREE.BoxGeometry(0.45, 0.65, 0.05);
  const door = createMesh(doorGeo, darkWood);
  door.position.set(0, 0.35, 0.72);
  group.add(door);

  // 4. Crossed Swords Insignia above the Door
  const swordBlade1 = createMesh(new THREE.BoxGeometry(0.05, 0.45, 0.02), goldMat);
  swordBlade1.position.set(0, 0.85, 0.74);
  swordBlade1.rotation.z = 0.7;
  const swordBlade2 = createMesh(new THREE.BoxGeometry(0.05, 0.45, 0.02), goldMat);
  swordBlade2.position.set(0, 0.85, 0.74);
  swordBlade2.rotation.z = -0.7;
  group.add(swordBlade1, swordBlade2);

  return group;
}

/* =========================================================================
   3D BUILDER HUT (Cabin with Chimney, Hammer Sign, Workbench & Builder)
   ========================================================================= */
export function create3DBuilderHut(): THREE.Group {
  const group = new THREE.Group();
  group.name = '3D_Builder_Hut';

  const woodMat = GameMaterials.woodPlanksMaterial;
  const darkWood = GameMaterials.woodDarkMaterial;
  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;

  // 1. Cabin Log Walls
  const cabinGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
  const cabin = createMesh(cabinGeo, woodMat);
  cabin.position.y = 0.4;
  group.add(cabin);

  // 2. Timber Gabled Roof
  const roofGeo = new THREE.ConeGeometry(1.1, 0.7, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = createMesh(roofGeo, darkWood);
  roof.position.y = 1.15;
  group.add(roof);

  // 3. Stone Chimney
  const chimneyGeo = new THREE.BoxGeometry(0.3, 0.9, 0.3);
  const chimney = createMesh(chimneyGeo, stoneMat);
  chimney.position.set(0.4, 0.9, -0.3);
  group.add(chimney);

  // 4. Hammer Sign above Entrance
  const signGeo = new THREE.BoxGeometry(0.35, 0.22, 0.04);
  const sign = createMesh(signGeo, goldMat);
  sign.position.set(0, 0.75, 0.62);
  group.add(sign);

  // 5. 3D Builder Character Standing Outside
  const builder = createBuilderCharacter(0.45);
  builder.position.set(0.7, 0, 0.5);
  builder.rotation.y = -0.8;
  group.add(builder);

  return group;
}

/* =========================================================================
   3D TOWN HALL (Levels 1 to 12 Architectural Progression)
   Matches the user's Town Hall designs!
   ========================================================================= */
export function create3DTownHall(level: number = 3): THREE.Group {
  const group = new THREE.Group();
  group.name = `3D_Town_Hall_Lv${level}`;

  const lvl = Math.min(12, Math.max(1, Math.round(level)));

  const stoneMat = GameMaterials.stoneFoundationMaterial;
  const woodMat = GameMaterials.woodPlanksMaterial;
  const darkWood = GameMaterials.woodDarkMaterial;
  const goldMat = GameMaterials.goldMetalMaterial;

  // Theme palettes based on Town Hall progression
  let primaryRoofMat = GameMaterials.roofTileRedMaterial;
  let wallMat = stoneMat;

  if (lvl <= 2) {
    wallMat = woodMat;
    primaryRoofMat = GameMaterials.woodDarkMaterial;
  } else if (lvl === 3) {
    wallMat = stoneMat;
    primaryRoofMat = GameMaterials.roofTileRedMaterial; // Terracotta
  } else if (lvl === 4) {
    wallMat = GameMaterials.wallStoneMaterial; // Blue-gray fortress
    primaryRoofMat = GameMaterials.roofTileBlueMaterial;
  } else if (lvl === 5 || lvl === 6) {
    wallMat = stoneMat;
    primaryRoofMat = GameMaterials.roofTileRedMaterial; // Royal manor
  } else if (lvl === 7 || lvl === 8) {
    wallMat = stoneMat;
    primaryRoofMat = GameMaterials.roofTileBlueMaterial; // Royal citadel
  } else if (lvl === 9) {
    // Dragon Keep
    wallMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.9 });
    primaryRoofMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.6 });
  } else if (lvl === 10) {
    // Infernal Fortress
    wallMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });
    primaryRoofMat = new THREE.MeshStandardMaterial({ color: 0xea580c, emissive: 0x7c2d12, emissiveIntensity: 0.4 });
  } else if (lvl === 11) {
    // Imperial Palace (White Marble & Blue)
    wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 });
    primaryRoofMat = GameMaterials.roofTileBlueMaterial;
  } else if (lvl === 12) {
    // Arcane Citadel (Royal Stone, Gold Spires, Arcane Core)
    wallMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.7 });
    primaryRoofMat = new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.4 });
  }

  // 1. Foundation Podium
  const foundationGeo = new THREE.BoxGeometry(3.6, 0.4, 3.6);
  const foundation = createMesh(foundationGeo, stoneMat);
  foundation.position.y = 0.2;
  group.add(foundation);

  // Stone steps
  const stepsGeo = new THREE.BoxGeometry(1.6, 0.2, 0.8);
  const steps = createMesh(stepsGeo, stoneMat);
  steps.position.set(0, 0.1, 1.9);
  group.add(steps);

  // 2. Main Floor Fortress Walls
  const firstFloorGeo = new THREE.BoxGeometry(3.1, 1.4, 3.1);
  const firstFloor = createMesh(firstFloorGeo, wallMat);
  firstFloor.position.y = 1.1;
  group.add(firstFloor);

  // 3. Second Floor / Tier
  const secondFloorGeo = new THREE.BoxGeometry(2.4, 1.0, 2.4);
  const secondFloor = createMesh(secondFloorGeo, wallMat);
  secondFloor.position.y = 2.3;
  group.add(secondFloor);

  // 4. Main Gabled / Hip Roof
  const roofGeo = new THREE.ConeGeometry(2.3, 1.3, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = createMesh(roofGeo, primaryRoofMat);
  roof.position.y = 3.4;
  group.add(roof);

  // 5. Arched Main Entrance & Royal Banners
  const archGeo = new THREE.BoxGeometry(0.85, 1.0, 0.1);
  const arch = createMesh(archGeo, darkWood);
  arch.position.set(0, 0.8, 1.58);
  group.add(arch);

  // Royal Red Banners hanging beside door
  const bannerMat = new THREE.MeshStandardMaterial({ color: lvl >= 7 ? 0x2563eb : 0xdc2626 });
  const b1 = createMesh(new THREE.BoxGeometry(0.28, 0.9, 0.04), bannerMat);
  b1.position.set(-0.7, 1.1, 1.58);
  const b2 = createMesh(new THREE.BoxGeometry(0.28, 0.9, 0.04), bannerMat);
  b2.position.set(0.7, 1.1, 1.58);
  group.add(b1, b2);

  // 6. Corner Battlements & Gilded Spires
  const cornerCols = [
    [-1.4, -1.4],
    [1.4, -1.4],
    [-1.4, 1.4],
    [1.4, 1.4],
  ];
  cornerCols.forEach(([cx, cz]) => {
    const col = createMesh(new THREE.BoxGeometry(0.5, 1.8, 0.5), stoneMat);
    col.position.set(cx, 1.3, cz);
    group.add(col);

    if (lvl >= 6) {
      // Golden battlements
      const spire = createMesh(new THREE.ConeGeometry(0.3, 0.6, 4), goldMat);
      spire.position.set(cx, 2.4, cz);
      group.add(spire);
    }
  });

  // Level 12: Arcane Glowing Centerpiece
  if (lvl === 12) {
    const crystalGeo = new THREE.OctahedronGeometry(0.55, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xe879f9,
      emissive: 0x9333ea,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    });
    const crystal = createMesh(crystalGeo, crystalMat);
    crystal.position.set(0, 4.3, 0);
    crystal.name = 'ArcaneCitadelCrystal';
    group.add(crystal);
  }

  // Corner Torches on Entry Steps
  const t1 = create3DTorch();
  t1.position.set(-1.1, 0.4, 1.9);
  const t2 = create3DTorch();
  t2.position.set(1.1, 0.4, 1.9);
  group.add(t1, t2);

  return group;
}

/* =========================================================================
   3D ENVIRONMENT NATURE & PROPS (Trees, Rocks, Torches, Flags, Pier)
   ========================================================================= */

// Stylized 3D Pine Tree
export function create3DPineTree(): THREE.Group {
  const tree = new THREE.Group();
  tree.name = '3D_Pine_Tree';

  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 1.2, 6);
  const trunk = createMesh(trunkGeo, GameMaterials.treeTrunkMaterial);
  trunk.position.y = 0.6;
  tree.add(trunk);

  // 3 Layered Foliage Cones
  const layers = [
    { r: 1.2, h: 1.3, y: 1.6 },
    { r: 0.95, h: 1.2, y: 2.3 },
    { r: 0.65, h: 1.1, y: 3.0 },
  ];
  layers.forEach(({ r, h, y }) => {
    const cone = createMesh(new THREE.ConeGeometry(r, h, 7), GameMaterials.foliageDarkGreenMaterial);
    cone.position.y = y;
    tree.add(cone);
  });

  return tree;
}

// Stylized 3D Deciduous Leafy Tree (Chunky Clash of Clans Style)
export function create3DDeciduousTree(): THREE.Group {
  const tree = new THREE.Group();
  tree.name = '3D_Leafy_Tree';

  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.38, 1.5, 7);
  const trunk = createMesh(trunkGeo, GameMaterials.treeTrunkMaterial);
  trunk.position.y = 0.75;
  tree.add(trunk);

  // Chunky stylized foliage spheres
  const foliageGeo = new THREE.DodecahedronGeometry(1.2, 1);
  const fMain = createMesh(foliageGeo, GameMaterials.foliageGreenMaterial);
  fMain.position.set(0, 2.4, 0);
  fMain.scale.set(1.2, 1.0, 1.1);
  tree.add(fMain);

  const fSub1 = createMesh(new THREE.DodecahedronGeometry(0.8, 1), GameMaterials.foliageGreenMaterial);
  fSub1.position.set(0.6, 2.0, 0.3);
  tree.add(fSub1);

  const fSub2 = createMesh(new THREE.DodecahedronGeometry(0.75, 1), GameMaterials.foliageGreenMaterial);
  fSub2.position.set(-0.5, 2.1, -0.4);
  tree.add(fSub2);

  return tree;
}

// 3D Faceted Rock / Boulder
export function create3DBoulder(scale: number = 1.0): THREE.Mesh {
  const rockGeo = new THREE.DodecahedronGeometry(0.7 * scale, 0);
  const rock = createMesh(rockGeo, GameMaterials.boulderMaterial);
  rock.position.y = 0.35 * scale;
  rock.scale.set(1.1, 0.85, 0.95);
  rock.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
  return rock;
}

// 3D Torch Post with Real-Time Warm Fire Light
export function create3DTorch(): THREE.Group {
  const torch = new THREE.Group();
  torch.name = '3D_Torch';

  const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 1.4, 6);
  const post = createMesh(postGeo, GameMaterials.woodDarkMaterial);
  post.position.y = 0.7;
  torch.add(post);

  // Iron basket at top
  const basketGeo = new THREE.CylinderGeometry(0.2, 0.1, 0.25, 6);
  const basket = createMesh(basketGeo, GameMaterials.ironMetalMaterial);
  basket.position.y = 1.45;
  torch.add(basket);

  // Burning Flame
  const flameGeo = new THREE.ConeGeometry(0.14, 0.35, 6);
  const flame = new THREE.Mesh(flameGeo, GameMaterials.torchFireMaterial);
  flame.position.y = 1.65;
  flame.name = 'TorchFlame';
  torch.add(flame);

  // Warm Point Light
  const light = new THREE.PointLight(0xf59e0b, 1.0, 3.5);
  light.position.set(0, 1.7, 0);
  torch.add(light);

  return torch;
}

// 3D Heraldic Flagpole
export function create3DFlag(flagColor: number = 0xdc2626): THREE.Group {
  const flag = new THREE.Group();
  flag.name = '3D_Flagpole';

  const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.6, 6);
  const pole = createMesh(poleGeo, GameMaterials.woodDarkMaterial);
  pole.position.y = 1.3;
  flag.add(pole);

  // Flag fabric
  const fabricGeo = new THREE.BoxGeometry(0.8, 0.55, 0.02);
  const fabricMat = new THREE.MeshStandardMaterial({
    color: flagColor,
    roughness: 0.6,
  });
  const fabric = createMesh(fabricGeo, fabricMat);
  fabric.position.set(0.42, 2.1, 0);
  flag.add(fabric);

  return flag;
}

// 3D River Coastal Pier / Dock
export function create3DWoodenPier(): THREE.Group {
  const pier = new THREE.Group();
  pier.name = '3D_Wooden_Pier';

  const woodMat = GameMaterials.woodPlanksMaterial;
  const darkWood = GameMaterials.woodDarkMaterial;

  // Deck Planks
  const deckGeo = new THREE.BoxGeometry(1.6, 0.15, 3.8);
  const deck = createMesh(deckGeo, woodMat);
  deck.position.set(0, 0.35, 0);
  pier.add(deck);

  // Mooring Posts
  const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 6);
  const postPositions = [
    [-0.75, 0.5, -1.8],
    [0.75, 0.5, -1.8],
    [-0.75, 0.5, 0],
    [0.75, 0.5, 0],
    [-0.75, 0.5, 1.8],
    [0.75, 0.5, 1.8],
  ];
  postPositions.forEach(([px, py, pz]) => {
    const p = createMesh(postGeo, darkWood);
    p.position.set(px, py, pz);
    pier.add(p);
  });

  return pier;
}

// Factory function for ANY building type
export function createBuilding3DModel(type: string, level: number = 1): THREE.Group {
  switch (type) {
    case 'town_hall':
      return create3DTownHall(level);
    case 'wall':
      return create3DWallSegment();
    case 'archer_tower':
      return create3DArcherTower();
    case 'cannon':
      return create3DCannon();
    case 'mortar':
      return create3DMortar();
    case 'wizard_tower':
      return create3DWizardTower();
    case 'army_camp':
      return create3DArmyCamp();
    case 'gold_storage':
    case 'gold_mine':
      return create3DGoldStorage();
    case 'elixir_storage':
    case 'elixir_collector':
      return create3DElixirStorage();
    case 'barracks':
      return create3DBarracks();
    case 'builder_hut':
      return create3DBuilderHut();
    default:
      // Fallback stylized medieval building
      return create3DBarracks();
  }
}
