import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PlacedBuilding, BuildingType, UserResources } from '../../types/game';
import { BUILDINGS_DATA, TOWN_HALL_LEVELS } from '../../data/clashData';
import { GameMaterials } from './materials';
import {
  createBuilding3DModel,
  create3DPineTree,
  create3DDeciduousTree,
  create3DBoulder,
  create3DTorch,
  create3DFlag,
  create3DWoodenPier,
} from './proceduralModels';
import { sound } from '../../utils/audio';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Moon,
  Sunset,
  Eye,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface VillageView3DProps {
  buildings: PlacedBuilding[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string | null) => void;
  onTileClick: (x: number, y: number) => void;
  hoverTile: { x: number; y: number } | null;
  setHoverTile: (tile: { x: number; y: number } | null) => void;
  wallBrushMode: boolean;
  selectedPaletteType: BuildingType;
}

const GRID_SIZE = 20;
const TILE_SIZE = 1.6; // 3D units per grid tile
const BOARD_SIZE = GRID_SIZE * TILE_SIZE; // 32.0 units total

export const VillageView3D: React.FC<VillageView3DProps> = ({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  onTileClick,
  hoverTile,
  setHoverTile,
  wallBrushMode,
  selectedPaletteType,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Three.js State Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const buildingMeshesMap = useRef<Map<string, THREE.Group>>(new Map());
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const hoverIndicatorRef = useRef<THREE.Mesh | null>(null);
  const rangeRingRef = useRef<THREE.LineLoop | null>(null);

  // Animated elements list
  const animatedObjectsRef = useRef<{
    flames: THREE.Object3D[];
    crystals: THREE.Object3D[];
    archers: THREE.Object3D[];
    lights: THREE.PointLight[];
  }>({
    flames: [],
    crystals: [],
    archers: [],
    lights: [],
  });

  // Camera Orbit & Pan State
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 46,
    theta: Math.PI / 4, // 45 deg isometric
    phi: Math.PI / 3.4, // ~53 deg elevated angle
  });

  // Drag interaction
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedSignificantlyRef = useRef<boolean>(false);

  // Time of Day Lighting Mode
  const [lightingPreset, setLightingPreset] = useState<'day' | 'sunset' | 'night'>('day');
  const [cameraMode, setCameraMode] = useState<'iso1' | 'iso2' | 'top'>('iso1');

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Initialize Materials
    GameMaterials.init();

    // 2. Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x132a1e); // Deep rich forest green background
    scene.fog = new THREE.FogExp2(0x132a1e, 0.012);
    sceneRef.current = scene;

    // 3. Camera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 300);
    cameraRef.current = camera;

    // 4. Renderer with ACES ToneMapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 5. Studio Reflections Environment Map
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback if RoomEnvironment fails
    }

    // 6. Lighting Setup
    // Key Directional Sunlight (Warm golden Clash sun)
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    sunLight.position.set(30, 48, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -24;
    sunLight.shadow.camera.right = 24;
    sunLight.shadow.camera.top = 24;
    sunLight.shadow.camera.bottom = -24;
    sunLight.shadow.bias = -0.0004;
    sunLight.name = 'SunLight';
    scene.add(sunLight);

    // Fill Hemisphere Light (Blue sky above, grassy ground below)
    const hemiLight = new THREE.HemisphereLight(0xb1e1ff, 0x3b6e22, 0.85);
    hemiLight.name = 'HemiLight';
    scene.add(hemiLight);

    // Subtle Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    ambientLight.name = 'AmbientLight';
    scene.add(ambientLight);

    // 7. 3D Terrain Construction
    // Main 20x20 Checkered Village Plateau
    const groundGeo = new THREE.BoxGeometry(BOARD_SIZE, 0.5, BOARD_SIZE);
    const groundMesh = new THREE.Mesh(groundGeo, GameMaterials.grassMaterial);
    groundMesh.position.y = -0.25;
    groundMesh.receiveShadow = true;
    groundMesh.name = 'VillageGround';
    scene.add(groundMesh);
    groundMeshRef.current = groundMesh;

    // Stone retaining wall border around the village plateau
    const borderGeo = new THREE.BoxGeometry(BOARD_SIZE + 0.6, 0.45, BOARD_SIZE + 0.6);
    const borderMesh = new THREE.Mesh(borderGeo, GameMaterials.stoneFoundationMaterial);
    borderMesh.position.y = -0.35;
    borderMesh.receiveShadow = true;
    scene.add(borderMesh);

    // Outer Extended Landscape Grass Bed
    const outerGeo = new THREE.BoxGeometry(110, 0.3, 110);
    const outerGrassMat = new THREE.MeshStandardMaterial({
      color: 0x3d7023,
      roughness: 0.9,
    });
    const outerLandscape = new THREE.Mesh(outerGeo, outerGrassMat);
    outerLandscape.position.y = -0.65;
    outerLandscape.receiveShadow = true;
    scene.add(outerLandscape);

    // Coastal Water / River Channel along the Left Perimeter
    const waterGeo = new THREE.PlaneGeometry(16, 90);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
    });
    const river = new THREE.Mesh(waterGeo, waterMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(-27, -0.4, 0);
    river.name = 'RiverCoast';
    scene.add(river);

    // Wooden Pier / Dock on the Coast
    const pier = create3DWoodenPier();
    pier.position.set(-20, -0.4, -6);
    pier.rotation.y = Math.PI / 2;
    scene.add(pier);

    // 8. Scatter Natural Environment Assets (Trees, Rocks, Torches, Flags)
    // Perimeter Pine & Deciduous Trees
    const treePositions = [
      [-19, -15],
      [-19, -9],
      [-19, 5],
      [-19, 12],
      [-19, 18],
      [19, -17],
      [19, -10],
      [19, -2],
      [19, 7],
      [19, 15],
      [-14, -19],
      [-7, -19],
      [2, -19],
      [11, -19],
      [-12, 19],
      [-4, 19],
      [6, 19],
      [14, 19],
      [-22, 2],
      [22, -6],
    ];

    treePositions.forEach(([tx, tz], idx) => {
      const tree = idx % 2 === 0 ? create3DPineTree() : create3DDeciduousTree();
      tree.position.set(tx, -0.5, tz);
      const s = 0.85 + Math.random() * 0.35;
      tree.scale.set(s, s, s);
      tree.rotation.y = Math.random() * Math.PI * 2;
      scene.add(tree);
    });

    // Scattered Faceted Boulders & Riverbank Pebbles
    const boulderCoords = [
      [-21, -3],
      [-20, 9],
      [20, 12],
      [18, -14],
      [-16, 16],
      [21, 2],
    ];
    boulderCoords.forEach(([bx, bz]) => {
      const rock = create3DBoulder(0.9 + Math.random() * 0.4);
      rock.position.set(bx, -0.5, bz);
      scene.add(rock);
    });

    // Perimeter Village Pathway Torches with Flickering Fire
    const torchCoords = [
      [-17, -17],
      [17, -17],
      [-17, 17],
      [17, 17],
      [-17, 0],
      [17, 0],
    ];
    torchCoords.forEach(([tx, tz]) => {
      const torch = create3DTorch();
      torch.position.set(tx, -0.5, tz);
      scene.add(torch);

      const flame = torch.getObjectByName('TorchFlame');
      if (flame) animatedObjectsRef.current.flames.push(flame);
      const light = torch.children.find(c => c instanceof THREE.PointLight) as THREE.PointLight;
      if (light) animatedObjectsRef.current.lights.push(light);
    });

    // Heraldic Red Banners on Wooden Flagpoles
    const flag1 = create3DFlag(0xdc2626);
    flag1.position.set(-17.5, -0.5, -7);
    const flag2 = create3DFlag(0xdc2626);
    flag2.position.set(-17.5, -0.5, 7);
    scene.add(flag1, flag2);

    // 9. Interactive 3D Hover Tile Cursor Indicator
    const hoverGeo = new THREE.PlaneGeometry(TILE_SIZE * 0.94, TILE_SIZE * 0.94);
    const hoverMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const hoverIndicator = new THREE.Mesh(hoverGeo, hoverMat);
    hoverIndicator.rotation.x = -Math.PI / 2;
    hoverIndicator.position.y = 0.02;
    hoverIndicator.visible = false;
    scene.add(hoverIndicator);
    hoverIndicatorRef.current = hoverIndicator;

    // 10. Defensive Range Projection Circle in 3D
    const ringSegments = 48;
    const ringGeo = new THREE.BufferGeometry();
    const positions = new Float32Array((ringSegments + 1) * 3);
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      positions[i * 3] = Math.cos(theta);
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(theta);
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.65,
      linewidth: 2,
    });
    const rangeRing = new THREE.LineLoop(ringGeo, ringMat);
    rangeRing.position.y = 0.05;
    rangeRing.visible = false;
    scene.add(rangeRing);
    rangeRingRef.current = rangeRing;

    // 11. Render Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Update Camera Position via Spherical Orbit Coordinates
      if (cameraRef.current) {
        const { radius, theta, phi } = sphericalRef.current;
        const x = radius * Math.sin(phi) * Math.sin(theta) + cameraTargetRef.current.x;
        const y = radius * Math.cos(phi) + cameraTargetRef.current.y;
        const z = radius * Math.sin(phi) * Math.cos(theta) + cameraTargetRef.current.z;

        cameraRef.current.position.set(x, y, z);
        cameraRef.current.lookAt(cameraTargetRef.current);
      }

      // Animate Campfire and Torch Flames (flickering scaling and light pulse)
      animatedObjectsRef.current.flames.forEach((flame, i) => {
        const flicker = 1 + Math.sin(elapsed * 12 + i) * 0.12;
        flame.scale.set(flicker, 1 + Math.cos(elapsed * 15 + i) * 0.15, flicker);
      });

      animatedObjectsRef.current.lights.forEach((light, i) => {
        light.intensity = 1.0 + Math.sin(elapsed * 14 + i * 2) * 0.25;
      });

      // Animate Tower Archers (subtle idle sway & aiming posture)
      animatedObjectsRef.current.archers.forEach((archer, i) => {
        archer.rotation.y = Math.sin(elapsed * 1.5 + i) * 0.25;
      });

      // Animate Arcane Orbs & Crystals (floating bobbing & rotating)
      animatedObjectsRef.current.crystals.forEach((crystal, i) => {
        crystal.rotation.y += delta * 1.2;
        crystal.position.y += Math.sin(elapsed * 3 + i) * 0.003;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update Time-of-Day Lighting Mode
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const sun = scene.getObjectByName('SunLight') as THREE.DirectionalLight | undefined;
    const hemi = scene.getObjectByName('HemiLight') as THREE.HemisphereLight | undefined;

    if (lightingPreset === 'day') {
      scene.background = new THREE.Color(0x132a1e);
      if (scene.fog) scene.fog.color = new THREE.Color(0x132a1e);
      if (sun) {
        sun.color = new THREE.Color(0xfff3d6);
        sun.intensity = 2.2;
        sun.position.set(30, 48, 25);
      }
      if (hemi) {
        hemi.color = new THREE.Color(0xb1e1ff);
        hemi.groundColor = new THREE.Color(0x3b6e22);
        hemi.intensity = 0.85;
      }
    } else if (lightingPreset === 'sunset') {
      scene.background = new THREE.Color(0x2a1a24);
      if (scene.fog) scene.fog.color = new THREE.Color(0x2a1a24);
      if (sun) {
        sun.color = new THREE.Color(0xf97316); // Golden orange sunset
        sun.intensity = 2.5;
        sun.position.set(40, 20, 15);
      }
      if (hemi) {
        hemi.color = new THREE.Color(0xfdba74);
        hemi.groundColor = new THREE.Color(0x451a03);
        hemi.intensity = 0.6;
      }
    } else if (lightingPreset === 'night') {
      scene.background = new THREE.Color(0x060913); // Dark Fantasy Night
      if (scene.fog) scene.fog.color = new THREE.Color(0x060913);
      if (sun) {
        sun.color = new THREE.Color(0x38bdf8); // Moonlight
        sun.intensity = 0.65;
        sun.position.set(-25, 40, -20);
      }
      if (hemi) {
        hemi.color = new THREE.Color(0x1e293b);
        hemi.groundColor = new THREE.Color(0x090e1a);
        hemi.intensity = 0.35;
      }
    }
  }, [lightingPreset]);

  // Synchronize 3D Building Models with Game State
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Reset animated elements
    animatedObjectsRef.current.crystals = [];
    animatedObjectsRef.current.archers = [];

    const currentMap = buildingMeshesMap.current;
    const activeIds = new Set(buildings.map(b => b.id));

    // Remove meshes for deleted buildings
    currentMap.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        scene.remove(mesh);
        currentMap.delete(id);
      }
    });

    // Add or Update building models
    buildings.forEach(building => {
      const def = BUILDINGS_DATA[building.type];
      if (!def) return;

      const existingMesh = currentMap.get(building.id);
      const isLevelChanged = existingMesh?.userData.level !== building.level;

      let modelGroup: THREE.Group;

      if (!existingMesh || isLevelChanged) {
        if (existingMesh) {
          scene.remove(existingMesh);
        }

        modelGroup = createBuilding3DModel(building.type, building.level);
        modelGroup.userData = {
          id: building.id,
          type: building.type,
          level: building.level,
        };

        scene.add(modelGroup);
        currentMap.set(building.id, modelGroup);
      } else {
        modelGroup = existingMesh;
      }

      // Calculate 3D World Coordinates from Grid (x, y)
      // Tile 0,0 is at the top-left corner
      const worldX = (building.x + def.width / 2 - GRID_SIZE / 2) * TILE_SIZE;
      const worldZ = (building.y + def.height / 2 - GRID_SIZE / 2) * TILE_SIZE;

      modelGroup.position.set(worldX, 0, worldZ);

      // Collect animated parts
      const archerUnit = modelGroup.getObjectByName('TowerArcherUnit');
      if (archerUnit) animatedObjectsRef.current.archers.push(archerUnit);

      const arcaneOrb = modelGroup.getObjectByName('ArcaneCoreOrb');
      if (arcaneOrb) animatedObjectsRef.current.crystals.push(arcaneOrb);

      const thCrystal = modelGroup.getObjectByName('ArcaneCitadelCrystal');
      if (thCrystal) animatedObjectsRef.current.crystals.push(thCrystal);
    });
  }, [buildings]);

  // Update Selected Building Defensive Range Ring in 3D
  useEffect(() => {
    const rangeRing = rangeRingRef.current;
    if (!rangeRing) return;

    if (!selectedBuildingId) {
      rangeRing.visible = false;
      return;
    }

    const building = buildings.find(b => b.id === selectedBuildingId);
    if (!building) {
      rangeRing.visible = false;
      return;
    }

    const def = BUILDINGS_DATA[building.type];
    if (!def || def.range <= 0) {
      rangeRing.visible = false;
      return;
    }

    const worldX = (building.x + def.width / 2 - GRID_SIZE / 2) * TILE_SIZE;
    const worldZ = (building.y + def.height / 2 - GRID_SIZE / 2) * TILE_SIZE;
    const worldRadius = def.range * TILE_SIZE;

    rangeRing.position.set(worldX, 0.06, worldZ);
    rangeRing.scale.set(worldRadius, 1, worldRadius);
    rangeRing.visible = true;
  }, [selectedBuildingId, buildings]);

  // Convert Mouse Event to 3D Grid Coordinate via Raycasting
  const getGridTileFromEvent = (e: React.MouseEvent<HTMLDivElement>): { x: number; y: number } | null => {
    const container = mountRef.current;
    const camera = cameraRef.current;
    const ground = groundMeshRef.current;
    if (!container || !camera || !ground) return null;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseRef.current, camera);

    const intersects = raycasterRef.current.intersectObject(ground);
    if (intersects.length > 0) {
      const p = intersects[0].point;
      // Convert world coord (p.x, p.z) into integer grid coords [0..19]
      const gridX = Math.floor((p.x + BOARD_SIZE / 2) / TILE_SIZE);
      const gridY = Math.floor((p.z + BOARD_SIZE / 2) / TILE_SIZE);

      if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
        return { x: gridX, y: gridY };
      }
    }
    return null;
  };

  // Pointer Move (Hover tile & Drag rotation)
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Orbit drag handling
    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedSignificantlyRef.current = true;
      }

      // Rotate camera
      sphericalRef.current.theta -= dx * 0.008;
      sphericalRef.current.phi = Math.max(
        0.3,
        Math.min(Math.PI / 2.1, sphericalRef.current.phi - dy * 0.008)
      );

      dragStartRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // 2. Tile Hover Raycasting
    const tile = getGridTileFromEvent(e);
    setHoverTile(tile);

    if (hoverIndicatorRef.current) {
      if (tile) {
        const hX = (tile.x + 0.5 - GRID_SIZE / 2) * TILE_SIZE;
        const hZ = (tile.y + 0.5 - GRID_SIZE / 2) * TILE_SIZE;
        hoverIndicatorRef.current.position.set(hX, 0.02, hZ);
        hoverIndicatorRef.current.visible = true;
      } else {
        hoverIndicatorRef.current.visible = false;
      }
    }
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasMovedSignificantlyRef.current = false;
  };

  const handlePointerUp = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;

    // If it was a click without significant drag motion, perform placement or selection!
    if (!hasMovedSignificantlyRef.current) {
      const tile = getGridTileFromEvent(e);
      if (tile) {
        onTileClick(tile.x, tile.y);
      } else {
        onSelectBuilding(null);
      }
    }
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.04;
    sphericalRef.current.radius = Math.max(
      18,
      Math.min(75, sphericalRef.current.radius + zoomDelta)
    );
  };

  // Camera Preset Angles
  const setCameraAngle = (angle: 'iso1' | 'iso2' | 'top') => {
    setCameraMode(angle);
    sound.playDeploy();

    if (angle === 'iso1') {
      sphericalRef.current.theta = Math.PI / 4;
      sphericalRef.current.phi = Math.PI / 3.4;
      sphericalRef.current.radius = 46;
    } else if (angle === 'iso2') {
      sphericalRef.current.theta = (Math.PI * 3) / 4;
      sphericalRef.current.phi = Math.PI / 3.4;
      sphericalRef.current.radius = 46;
    } else if (angle === 'top') {
      sphericalRef.current.theta = 0;
      sphericalRef.current.phi = 0.08; // Directly overhead top-down
      sphericalRef.current.radius = 42;
    }
  };

  return (
    <div className="relative w-full h-[620px] sm:h-[680px] lg:h-[720px] rounded-3xl overflow-hidden shadow-2xl border-3 border-[#784f18] select-none bg-[#0a120c]">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onMouseMove={handlePointerMove}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating 3D Navigation & Camera Controls Dock (Anti-slop collapsible glass dock) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-[#090e1c]/85 border border-[#b45309]/60 px-3 py-1.5 rounded-2xl shadow-lg backdrop-blur text-xs">
        <span className="font-clash-header font-black text-amber-300 flex items-center gap-1 mr-1">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>3D Camera</span>
        </span>

        {/* View Angles */}
        <button
          onClick={() => setCameraAngle('iso1')}
          className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            cameraMode === 'iso1'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Isometric View A"
        >
          Iso 1
        </button>
        <button
          onClick={() => setCameraAngle('iso2')}
          className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            cameraMode === 'iso2'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Isometric View B"
        >
          Iso 2
        </button>
        <button
          onClick={() => setCameraAngle('top')}
          className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            cameraMode === 'top'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          title="Top-Down Tactical View"
        >
          Top
        </button>

        <span className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* Zoom Controls */}
        <button
          onClick={() => {
            sphericalRef.current.radius = Math.max(18, sphericalRef.current.radius - 6);
          }}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            sphericalRef.current.radius = Math.min(75, sphericalRef.current.radius + 6);
          }}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* Lighting Atmosphere Mode */}
        <button
          onClick={() => {
            setLightingPreset('day');
            sound.playDeploy();
          }}
          className={`p-1 rounded-lg transition-all cursor-pointer ${
            lightingPreset === 'day'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Daylight Atmosphere"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setLightingPreset('sunset');
            sound.playDeploy();
          }}
          className={`p-1 rounded-lg transition-all cursor-pointer ${
            lightingPreset === 'sunset'
              ? 'bg-orange-500 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Golden Sunset Atmosphere"
        >
          <Sunset className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setLightingPreset('night');
            sound.playDeploy();
          }}
          className={`p-1 rounded-lg transition-all cursor-pointer ${
            lightingPreset === 'night'
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Dark Fantasy Night Atmosphere"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating 3D Strategy Tip Overlay */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-[#090e1c]/80 border border-[#523b18]/60 px-3 py-1 rounded-xl text-[11px] text-slate-300">
        <span>🎮 Drag to orbit 3D camera • Scroll to zoom • Click building or tile to interact</span>
      </div>

      {/* Current Hover Coordinates Badge */}
      {hoverTile && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none bg-[#090e1c]/80 border border-amber-500/40 px-2.5 py-1 rounded-xl text-[11px] font-mono text-amber-300 shadow">
          Tile [{hoverTile.x}, {hoverTile.y}]
        </div>
      )}
    </div>
  );
};
