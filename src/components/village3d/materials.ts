import * as THREE from 'three';

// Procedural Canvas Texture Generator for Rich PBR Textures
export class ProceduralTextureFactory {
  // Stylized Clash of Clans Grass Checkerboard Texture
  static createGrassTexture(gridSize: number = 20): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base lush grass green
    ctx.fillStyle = '#4c8a2b';
    ctx.fillRect(0, 0, 1024, 1024);

    const tileSize = 1024 / gridSize;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const isAlternate = (x + y) % 2 === 0;
        // Subtle checker tone difference like in Clash of Clans
        ctx.fillStyle = isAlternate ? '#5ca233' : '#458026';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

        // Subtle inner border for tile grid definition
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

        // Grass blades / flecks noise
        ctx.fillStyle = isAlternate ? '#6dbb3d' : '#396d1e';
        for (let i = 0; i < 4; i++) {
          const fx = x * tileSize + Math.random() * tileSize;
          const fy = y * tileSize + Math.random() * tileSize;
          ctx.fillRect(fx, fy, 2, 3);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Stone / Cobblestone Texture
  static createStoneTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#475569';
    for (let y = 0; y < 256; y += 32) {
      const offsetX = (y / 32) % 2 === 0 ? 0 : 32;
      for (let x = -32; x < 256; x += 64) {
        ctx.strokeRect(x + offsetX, y, 62, 30);
        ctx.fillRect(x + offsetX + 2, y + 2, 58, 26);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Water Shore Texture
  static createWaterTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Tropical River Blue Gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(1, '#075985');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Wave ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      const y = Math.random() * 512;
      ctx.arc(Math.random() * 512, y, 40 + Math.random() * 40, 0, Math.PI);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Red & White Tent Fabric Pattern
  static createTentFabricTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#dc2626'; // Clash red
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#f8fafc'; // Off white
    for (let x = 0; x < 256; x += 64) {
      ctx.fillRect(x, 0, 32, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  // Gold Coins Texture for Gold Storages
  static createGoldPileTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = 4 + Math.random() * 6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? '#fbbf24' : '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}

// Common Shared PBR Materials
export class GameMaterials {
  public static grassMaterial: THREE.MeshStandardMaterial;
  public static stoneFoundationMaterial: THREE.MeshStandardMaterial;
  public static wallStoneMaterial: THREE.MeshStandardMaterial;
  public static woodPlanksMaterial: THREE.MeshStandardMaterial;
  public static woodDarkMaterial: THREE.MeshStandardMaterial;
  public static ironMetalMaterial: THREE.MeshStandardMaterial;
  public static goldMetalMaterial: THREE.MeshStandardMaterial;
  public static elixirGlassMaterial: THREE.MeshPhysicalMaterial;
  public static elixirLiquidMaterial: THREE.MeshStandardMaterial;
  public static roofTileRedMaterial: THREE.MeshStandardMaterial;
  public static roofTileBlueMaterial: THREE.MeshStandardMaterial;
  public static tentFabricMaterial: THREE.MeshStandardMaterial;
  public static foliageGreenMaterial: THREE.MeshStandardMaterial;
  public static foliageDarkGreenMaterial: THREE.MeshStandardMaterial;
  public static treeTrunkMaterial: THREE.MeshStandardMaterial;
  public static boulderMaterial: THREE.MeshStandardMaterial;
  public static torchFireMaterial: THREE.MeshBasicMaterial;

  private static initialized = false;

  public static init() {
    if (this.initialized) return;

    this.grassMaterial = new THREE.MeshStandardMaterial({
      map: ProceduralTextureFactory.createGrassTexture(20),
      roughness: 0.85,
      metalness: 0.05,
    });

    this.stoneFoundationMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a6578,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.wallStoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a92a0,
      roughness: 0.8,
      metalness: 0.15,
    });

    this.woodPlanksMaterial = new THREE.MeshStandardMaterial({
      color: 0x935626,
      roughness: 0.75,
      metalness: 0.05,
    });

    this.woodDarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c3314,
      roughness: 0.8,
      metalness: 0.05,
    });

    this.ironMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e3440,
      roughness: 0.35,
      metalness: 0.85,
    });

    this.goldMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.9,
    });

    this.elixirGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
    });

    this.elixirLiquidMaterial = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0xa21caf,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.1,
    });

    this.roofTileRedMaterial = new THREE.MeshStandardMaterial({
      color: 0xd95328,
      roughness: 0.6,
      metalness: 0.05,
    });

    this.roofTileBlueMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.6,
      metalness: 0.05,
    });

    this.tentFabricMaterial = new THREE.MeshStandardMaterial({
      map: ProceduralTextureFactory.createTentFabricTexture(),
      roughness: 0.7,
      metalness: 0.05,
    });

    this.foliageGreenMaterial = new THREE.MeshStandardMaterial({
      color: 0x489d2d,
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true,
    });

    this.foliageDarkGreenMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b6b22,
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true,
    });

    this.treeTrunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x654321,
      roughness: 0.9,
      metalness: 0.05,
    });

    this.boulderMaterial = new THREE.MeshStandardMaterial({
      color: 0x71717a,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true,
    });

    this.torchFireMaterial = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
    });

    this.initialized = true;
  }
}
