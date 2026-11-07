import Phaser from 'phaser';
import {
  preloadExtractedSprites,
  generateAllGameTextures,
} from '../assets/TextureGenerator';
import { getVehicleById, VehicleConfig } from '../config/vehicles';
import { WEAPONS, WeaponId } from '../config/weapons';
import { UPGRADE_DEFINITIONS, UpgradeDefinition } from '../config/upgrades';
import {
  ENEMY_ARCHETYPES,
  EnemyArchetype,
  BOSS_ARCHETYPES,
  BossConfig,
} from '../config/enemies';
import { useGameStore, UpgradeChoiceItem } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useGarageStore } from '../../stores/garageStore';
import { useProgressionStore } from '../../stores/progressionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { gameEvents } from '../systems/GameEvents';
import { audioSystem } from '../systems/AudioSystem';

interface ActiveEnemy {
  sprite: Phaser.GameObjects.Sprite;
  hpBarBg: Phaser.GameObjects.Rectangle;
  hpBarFill: Phaser.GameObjects.Rectangle;
  label?: Phaser.GameObjects.Text;
  labelBg?: Phaser.GameObjects.Rectangle;
  bracketGraphics?: Phaser.GameObjects.Graphics;
  archetype: EnemyArchetype;
  hp: number;
  maxHp: number;
  speed: number;
  vx: number;
  contactDamage: number;
  xpValue: number;
  coinChance: number;
  coinValue: number;
  scoreValue: number;
  aiTimer: number;
  aiState: string;
  slowTimer: number;
  hitFlashTimer: number;
}

interface ActiveBoss {
  config: BossConfig;
  sprite: Phaser.GameObjects.Sprite;
  hp: number;
  maxHp: number;
  phase: number;
  attackTimer: number;
  moveAngle: number;
  chargeState: 'idle' | 'telegraph' | 'charging' | 'recover';
  chargeTimer: number;
  targetX: number;
}

interface ActiveProjectile {
  sprite: Phaser.GameObjects.Sprite;
  vx: number;
  vy: number;
  damage: number;
  isRocket: boolean;
  aoeRadius: number;
  pierce: number;
  lifeMs: number;
  trailColor?: number;
  blastHex?: string;
}

interface ActiveEnemyProjectile {
  sprite: Phaser.GameObjects.Sprite;
  vx: number;
  vy: number;
  damage: number;
  lifeMs: number;
}

interface ActiveObstacle {
  sprite: Phaser.GameObjects.Sprite;
  hp: number;
  damage: number;
  width: number;
  height: number;
}

interface ActiveOilTrap {
  sprite: Phaser.GameObjects.Sprite;
  radius: number;
  dps: number;
  slowRatio: number;
  lifeMs: number;
  tickTimer: number;
  isBurning: boolean;
}

interface ActiveCollectible {
  sprite: Phaser.GameObjects.Sprite;
  type: 'xp' | 'coin' | 'heal';
  value: number;
  vx: number;
  vy: number;
}

export class MainGameScene extends Phaser.Scene {
  private roadLeft = 220;
  private roadRight = 820;
  private roadWidth = 600;
  private entityScale = 1.0;
  private laneCenters: number[] = [];
  private scrollSpeed = 310;
  private dashOffset = 0;

  private roadGraphics!: Phaser.GameObjects.Graphics;
  private fxGraphics!: Phaser.GameObjects.Graphics;
  private roadEnvTile!: Phaser.GameObjects.TileSprite;

  private vehicleConfig!: VehicleConfig;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private playerBaseRing!: Phaser.GameObjects.Arc;
  private headlightCone!: Phaser.GameObjects.Image;
  private shieldCircle!: Phaser.GameObjects.Arc;

  private playerHp = 120;
  private playerMaxHp = 120;
  private invulnTimer = 0;
  private nitroTimer = 0;
  private specialCooldownMs = 0;
  private specialMaxCooldownMs = 8000;
  private dodgeCooldownMs = 0;
  private dodgeMaxCooldownMs = 4000;

  // Run telemetry
  private score = 0;
  private survivalTimeSec = 0;
  private level = 1;
  private xp = 0;
  private xpToNextLevel = 55;
  private enemiesDestroyed = 0;
  private bossesDefeated = 0;
  private coinsEarned = 0;
  private waveNumber = 1;
  private isPausedByModal = false;
  private isGameOver = false;

  // Spawners & Timers
  private enemySpawnTimer = 0;
  private obstacleSpawnTimer = 0;
  private hudSyncTimer = 0;
  private regenTimer = 0;
  private ExhaustParticleTimer = 0;
  private spawnedBossIndices = new Set<number>();

  // Weapon timers
  private weaponCooldowns: Record<WeaponId, number> = {
    'double-shot': 0,
    'klakson-sonic': 0,
    'roket-knalpot': 0,
    'petir-pln': 0,
    'oli-tumpah': 0,
  };

  // Entities
  private enemies: ActiveEnemy[] = [];
  private activeBoss: ActiveBoss | null = null;
  private projectiles: ActiveProjectile[] = [];
  private enemyProjectiles: ActiveEnemyProjectile[] = [];
  private obstacles: ActiveObstacle[] = [];
  private oilTraps: ActiveOilTrap[] = [];
  private collectibles: ActiveCollectible[] = [];

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
    SHIFT: Phaser.Input.Keyboard.Key;
    ESC: Phaser.Input.Keyboard.Key;
  };
  private touchMoveVec = { x: 0, y: 0 };
  private manualFiring = false;
  private unsubscribers: Array<() => void> = [];

  constructor() {
    super({ key: 'MainGameScene' });
  }

  preload(): void {
    preloadExtractedSprites(this);
  }

  create(): void {
    generateAllGameTextures(this);

    // Background & Road layers
    this.roadGraphics = this.add.graphics().setDepth(1);
    this.fxGraphics = this.add.graphics().setDepth(25);

    // Seamless Illustrated Jakarta 4-Lane Street & Sidewalks (with HALTE, trees, streetlamps, curbstones)
    this.roadEnvTile = this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, 'road-environment')
      .setOrigin(0, 0)
      .setDepth(2);

    this.computeRoadGeometry(this.scale.width, this.scale.height);
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.computeRoadGeometry(gameSize.width, gameSize.height);
    });

    // Initialize Player Vehicle from Garage & Progression stores
    const equippedId = useGarageStore.getState().equippedVehicle;
    this.vehicleConfig = getVehicleById(equippedId);
    usePlayerStore.getState().initForRun(equippedId);

    const playerState = usePlayerStore.getState();
    this.playerHp = playerState.hp;
    this.playerMaxHp = playerState.maxHp;
    this.specialMaxCooldownMs = this.vehicleConfig.specialCooldown * 1000;
    this.specialCooldownMs = 0;

    const startX = (this.roadLeft + this.roadRight) / 2;
    const startY = this.scale.height * 0.8;

    // Glowing Cyan-Green Ring underneath Player Vehicle (matching Panel 3 & 6)
    this.playerBaseRing = this.add
      .circle(startX, startY + 6, 32, 0x22c55e, 0.22)
      .setStrokeStyle(3, 0x4ade80, 0.9)
      .setDepth(18);

    // Realistic Volumetric Headlight Beam with ADD blend mode and feathered gradient falloff
    this.headlightCone = this.add
      .image(startX, startY - 20, 'fx-headlight-beam')
      .setOrigin(0.5, 0.96)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(13)
      .setScale(this.entityScale * 1.15)
      .setAlpha(0.85);

    // Player Sprite with crisp high-res display dimensions scaled to viewport road width
    const [pw, ph] = this.getPlayerDisplayDims();
    this.playerSprite = this.add
      .sprite(startX, startY, `player-${this.vehicleConfig.id}`)
      .setDepth(20)
      .setDisplaySize(pw, ph);

    // Shield / Overdrive aura circle
    this.shieldCircle = this.add
      .circle(startX, startY, 44 * this.entityScale, 0x38bdf8, 0.22)
      .setStrokeStyle(3, 0xfacc15, 0.9)
      .setDepth(21)
      .setVisible(false);

    // Spawn initial traffic enemies, XP cubes & cone on screen matching Panel 3 composition
    this.spawnRandomEnemy('angkot-chaos', this.laneCenters[1], this.scale.height * 0.36);
    this.spawnRandomEnemy('truk-odol', this.laneCenters[2] + 12, this.scale.height * 0.24);
    this.spawnRandomEnemy('lawan-arah', this.laneCenters[1] + 40, this.scale.height * 0.16);
    this.spawnRandomEnemy('polisi-lalu-lintas', this.laneCenters[0], this.scale.height * 0.72);
    this.spawnCollectible(this.laneCenters[1] + 14, this.scale.height * 0.62, 'xp', 20);
    this.spawnCollectible(this.laneCenters[2] + 8, this.scale.height * 0.61, 'xp', 20);
    this.spawnObstacle(this.laneCenters[1] - 6, this.scale.height * 0.82, 'cone');

    // Controls setup
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        SHIFT: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
        ESC: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
      };

      this.wasd.SPACE.on('down', () => {
        if (!this.isPausedByModal && !this.isGameOver) {
          this.activateSpecialAbility();
        }
      });

      this.wasd.SHIFT.on('down', () => {
        if (!this.isPausedByModal && !this.isGameOver) {
          this.activateDodgeNitro();
        }
      });

      this.wasd.ESC.on('down', () => {
        if (this.isGameOver) return;
        const currentModal = useGameStore.getState().modal;
        if (currentModal === 'NONE') {
          this.pauseGameplay();
          useGameStore.getState().setModal('PAUSED');
        } else if (currentModal === 'PAUSED') {
          useGameStore.getState().setModal('NONE');
          this.resumeGameplay();
        }
      });
    }

    // Event Bus Subscriptions
    this.unsubscribers.push(
      gameEvents.on('react:select-upgrade', (upgrade) => {
        this.applyUpgrade(upgrade);
      }),
      gameEvents.on('react:pause-game', () => {
        this.pauseGameplay();
      }),
      gameEvents.on('react:resume-game', () => {
        this.resumeGameplay();
      }),
      gameEvents.on('react:trigger-special', () => {
        if (!this.isPausedByModal && !this.isGameOver) {
          this.activateSpecialAbility();
        }
      }),
      gameEvents.on('react:trigger-dodge', () => {
        if (!this.isPausedByModal && !this.isGameOver) {
          this.activateDodgeNitro();
        }
      }),
      gameEvents.on('react:manual-fire', (firing) => {
        this.manualFiring = firing;
      }),
      gameEvents.on('react:touch-move', (vec) => {
        this.touchMoveVec = vec;
      }),
      gameEvents.on('react:spawn-boss-now', () => {
        if (!this.activeBoss && !this.isPausedByModal && !this.isGameOver) {
          const nextBossIndex = Math.min(
            this.spawnedBossIndices.size,
            BOSS_ARCHETYPES.length - 1
          );
          this.spawnedBossIndices.add(nextBossIndex);
          this.triggerBossEncounter(BOSS_ARCHETYPES[nextBossIndex]);
        }
      })
    );

    audioSystem.startMusic();

    this.events.once('shutdown', () => this.cleanupScene());
    this.events.once('destroy', () => this.cleanupScene());
  }

  private getPlayerDisplayDims(): [number, number] {
    const playerDims: Record<string, [number, number]> = {
      'motor-ojol': [58, 88],
      bajaj: [62, 92],
      'city-car': [70, 106],
      angkot: [74, 112],
      'pickup-truck': [78, 146],
      'police-car': [72, 112],
      'heavy-truck': [90, 152],
      'crazy-rich': [72, 112],
    };
    const [baseW, baseH] = playerDims[this.vehicleConfig?.id ?? 'motor-ojol'] ?? [58, 88];
    return [Math.round(baseW * this.entityScale), Math.round(baseH * this.entityScale)];
  }

  private cleanupScene(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }

  private computeRoadGeometry(width: number, height: number): void {
    // Preserve player relative position across orientation / viewport resize
    const prevRoadLeft = this.roadLeft;
    const prevRoadWidth = Math.max(1, this.roadWidth);
    const relPlayerX = this.playerSprite
      ? Phaser.Math.Clamp((this.playerSprite.x - prevRoadLeft) / prevRoadWidth, 0.08, 0.92)
      : 0.5;

    // Adapt road proportion to viewport width & aspect ratio:
    // - Mobile Portrait (< 640px): 78% of screen width so 4 lanes are wide & playable
    // - Tablet (640px..1023px): 64% of screen width
    // - Desktop (>= 1024px): 49% of screen width (exact 1:1 with 1376x768 source art)
    const isPortrait = height > width;
    let roadRatio = 0.49;
    if (width < 640) {
      roadRatio = isPortrait ? 0.78 : 0.62;
    } else if (width < 1024) {
      roadRatio = isPortrait ? 0.68 : 0.56;
    }

    this.roadWidth = width * roadRatio;
    this.roadLeft = (width - this.roadWidth) / 2;
    this.roadRight = this.roadLeft + this.roadWidth;
    this.entityScale = Phaser.Math.Clamp(this.roadWidth / 540, 0.66, 1.05);

    const laneWidth = this.roadWidth / 4;
    this.laneCenters = [
      this.roadLeft + laneWidth * 0.5,
      this.roadLeft + laneWidth * 1.5,
      this.roadLeft + laneWidth * 2.5,
      this.roadLeft + laneWidth * 3.5,
    ];

    // Align bg_road_seamless.png (1376x768, where road is the center 49% = 674.24px)
    // so visual curbstones and lanes line up 100% with roadLeft..roadRight on all devices!
    if (this.roadEnvTile) {
      this.roadEnvTile.setPosition(0, 0);
      this.roadEnvTile.setSize(width, height);
      const sourceRoadPx = 1376 * 0.49;
      const tileScale = this.roadWidth / sourceRoadPx;
      this.roadEnvTile.tileScaleX = tileScale;
      this.roadEnvTile.tileScaleY = tileScale;
      this.roadEnvTile.tilePositionX = 1376 / 2 - width / (2 * tileScale);
    }

    if (this.playerSprite) {
      const [pw, ph] = this.getPlayerDisplayDims();
      this.playerSprite.setDisplaySize(pw, ph);
      this.playerSprite.x = Phaser.Math.Clamp(
        this.roadLeft + relPlayerX * this.roadWidth,
        this.roadLeft + 24 * this.entityScale,
        this.roadRight - 24 * this.entityScale
      );
      this.playerSprite.y = Phaser.Math.Clamp(
        this.playerSprite.y,
        75,
        height - (isPortrait ? 115 : 65)
      );
    }
  }

  public pauseGameplay(): void {
    this.isPausedByModal = true;
    this.tweens.pauseAll();
  }

  public resumeGameplay(): void {
    this.isPausedByModal = false;
    this.tweens.resumeAll();
  }

  update(_time: number, deltaMs: number): void {
    if (this.isPausedByModal || this.isGameOver) return;

    const dt = Math.min(deltaMs, 50) / 1000;
    this.survivalTimeSec += dt;

    // Wave progression every 30 seconds
    this.waveNumber = 1 + Math.floor(this.survivalTimeSec / 30);

    // Check Boss Spawn Milestones & Schedule
    let nextBossCfg: BossConfig | null = null;
    let nextBossRemainingSec: number | null = null;

    if (!this.activeBoss) {
      for (let idx = 0; idx < BOSS_ARCHETYPES.length; idx++) {
        if (!this.spawnedBossIndices.has(idx)) {
          const cfg = BOSS_ARCHETYPES[idx];
          const remaining = Math.max(0, Math.ceil(cfg.spawnTimeSec - this.survivalTimeSec));
          nextBossCfg = cfg;
          nextBossRemainingSec = remaining;

          if (this.survivalTimeSec >= cfg.spawnTimeSec) {
            this.spawnedBossIndices.add(idx);
            this.triggerBossEncounter(cfg);
          }
          break;
        }
      }

      // If all initial bosses completed, loop recurring bosses every 75 seconds
      if (!nextBossCfg && !this.activeBoss) {
        const lastSpawnSec = BOSS_ARCHETYPES[BOSS_ARCHETYPES.length - 1].spawnTimeSec;
        const timeSince = this.survivalTimeSec - lastSpawnSec;
        const loopInterval = 75;
        const loopIdx = Math.max(0, Math.floor(timeSince / loopInterval));
        const nextTime = lastSpawnSec + (loopIdx + 1) * loopInterval;
        const remaining = Math.max(0, Math.ceil(nextTime - this.survivalTimeSec));
        const bossPoolIdx = loopIdx % BOSS_ARCHETYPES.length;
        nextBossCfg = BOSS_ARCHETYPES[bossPoolIdx];
        nextBossRemainingSec = remaining;

        if (this.survivalTimeSec >= nextTime) {
          this.triggerBossEncounter({
            ...nextBossCfg,
            baseHp: Math.round(nextBossCfg.baseHp * (1 + (loopIdx + 1) * 0.3)),
          });
        }
      }
    }

    this.fxGraphics.clear();
    this.drawScrollingRoad(dt);
    this.updateScenery(dt);
    this.updatePlayer(dt, deltaMs);
    this.updateWeapons(deltaMs);
    this.updateSpawners(deltaMs);
    this.updateObstacles(dt);
    this.updateOilTraps(deltaMs);
    this.updateEnemies(dt, deltaMs);
    this.updateBoss(dt, deltaMs);
    this.updateProjectiles(dt, deltaMs);
    this.updateEnemyProjectiles(dt, deltaMs);
    this.updateCollectibles(dt);

    // Sync telemetry to React store at ~10Hz to avoid excessive re-renders
    this.hudSyncTimer += deltaMs;
    if (this.hudSyncTimer >= 100) {
      this.hudSyncTimer = 0;
      useGameStore.getState().updateTelemetry({
        score: Math.floor(this.score),
        survivalTimeSec: this.survivalTimeSec,
        level: this.level,
        xp: Math.floor(this.xp),
        xpToNextLevel: this.xpToNextLevel,
        enemiesDestroyed: this.enemiesDestroyed,
        bossesDefeated: this.bossesDefeated,
        coinsEarned: this.coinsEarned,
        waveNumber: this.waveNumber,
      });

      usePlayerStore
        .getState()
        .setSpecialState(
          this.specialCooldownMs / this.specialMaxCooldownMs,
          this.nitroTimer > 0,
          this.dodgeCooldownMs / this.dodgeMaxCooldownMs
        );

      if (this.activeBoss) {
        useGameStore.getState().setActiveBoss({
          id: this.activeBoss.config.id,
          name: this.activeBoss.config.name,
          subtitle: this.activeBoss.config.subtitle,
          hp: Math.max(0, Math.round(this.activeBoss.hp)),
          maxHp: this.activeBoss.maxHp,
        });
        useGameStore.getState().updateBossSchedule(null, null);
      } else {
        useGameStore.getState().setActiveBoss(null);
        useGameStore.getState().updateBossSchedule(
          nextBossRemainingSec,
          nextBossCfg?.name ?? null
        );
      }
    }
  }

  private drawScrollingRoad(dt: number): void {
    const speedBonus = this.nitroTimer > 0 ? 1.55 : 1.0;
    this.dashOffset = (this.dashOffset + this.scrollSpeed * speedBonus * dt) % 96;
    this.roadGraphics.clear();
  }

  private updateScenery(dt: number): void {
    const speedBonus = this.nitroTimer > 0 ? 1.55 : 1.0;
    const dy = this.scrollSpeed * speedBonus * dt;

    if (this.roadEnvTile) {
      const scaleY = this.roadEnvTile.tileScaleY || 1;
      this.roadEnvTile.tilePositionY -= dy / scaleY;
    }
  }

  private updatePlayer(dt: number, deltaMs: number): void {
    const passives = usePlayerStore.getState().passiveLevels;
    const workshop = useProgressionStore.getState().workshopLevels;
    const { graphicsQuality } = useSettingsStore.getState();

    // Timers
    if (this.invulnTimer > 0) {
      this.invulnTimer -= deltaMs;
      this.playerSprite.setAlpha(Math.floor(this.invulnTimer / 80) % 2 === 0 ? 0.45 : 1);
    } else {
      this.playerSprite.setAlpha(1);
    }

    if (this.nitroTimer > 0) {
      this.nitroTimer -= deltaMs;
      this.shieldCircle.setVisible(true);
    } else {
      this.shieldCircle.setVisible(false);
    }

    if (this.specialCooldownMs > 0) {
      this.specialCooldownMs = Math.max(0, this.specialCooldownMs - deltaMs);
    }

    if (this.dodgeCooldownMs > 0) {
      this.dodgeCooldownMs = Math.max(0, this.dodgeCooldownMs - deltaMs);
    }

    // Passive HP Regen (Montir Darurat)
    const regenLvl = passives['passive-regen'] ?? 0;
    if (regenLvl > 0 && this.playerHp < this.playerMaxHp) {
      this.regenTimer += deltaMs;
      if (this.regenTimer >= 1000) {
        this.regenTimer = 0;
        this.healPlayer(regenLvl * 2.5);
      }
    }

    // Directional Input
    let moveX = this.touchMoveVec.x;
    let moveY = this.touchMoveVec.y;

    if (this.cursors && this.wasd) {
      if (this.cursors.left.isDown || this.wasd.A.isDown) moveX -= 1;
      if (this.cursors.right.isDown || this.wasd.D.isDown) moveX += 1;
      if (this.cursors.up.isDown || this.wasd.W.isDown) moveY -= 1;
      if (this.cursors.down.isDown || this.wasd.S.isDown) moveY += 1;
    }

    const len = Math.hypot(moveX, moveY);
    if (len > 1) {
      moveX /= len;
      moveY /= len;
    }

    const speedPassiveMult = 1 + (passives['passive-speed'] ?? 0) * 0.12 + workshop.engine * 0.06;
    const nitroMult = this.nitroTimer > 0 ? 1.45 : 1.0;
    const moveSpeed = this.vehicleConfig.stats.moveSpeedPx * speedPassiveMult * nitroMult;

    const edgePad = 24 * this.entityScale;
    const bottomPad = this.scale.height > this.scale.width ? 115 : 65;

    this.playerSprite.x = Phaser.Math.Clamp(
      this.playerSprite.x + moveX * moveSpeed * dt,
      this.roadLeft + edgePad,
      this.roadRight - edgePad
    );
    this.playerSprite.y = Phaser.Math.Clamp(
      this.playerSprite.y + moveY * moveSpeed * dt,
      80,
      this.scale.height - bottomPad
    );

    // Smooth banking rotation
    const targetAngle = moveX * 14;
    this.playerSprite.angle = Phaser.Math.Linear(this.playerSprite.angle, targetAngle, 0.22);

    this.playerBaseRing.setPosition(this.playerSprite.x, this.playerSprite.y + 4);
    const frontOffset = this.playerSprite.displayHeight * 0.38;
    this.headlightCone.setPosition(this.playerSprite.x, this.playerSprite.y - frontOffset);
    this.headlightCone.angle = this.playerSprite.angle;
    this.headlightCone.setScale(this.entityScale * 1.15);
    this.headlightCone.setVisible(graphicsQuality !== 'low');
    this.shieldCircle.setPosition(this.playerSprite.x, this.playerSprite.y);

    // Adaptive Exhaust trail smoke particles based on Graphics Quality
    const exhaustInterval =
      graphicsQuality === 'low' ? 240 : graphicsQuality === 'medium' ? 110 : 70;
    this.ExhaustParticleTimer += deltaMs;
    if (this.ExhaustParticleTimer >= exhaustInterval) {
      this.ExhaustParticleTimer = 0;
      const puff = this.add
        .circle(
          this.playerSprite.x + (Math.random() - 0.5) * 10,
          this.playerSprite.y + 32 * this.entityScale,
          (4 + Math.random() * 4) * this.entityScale,
          this.nitroTimer > 0 ? 0x38bdf8 : 0x94a3b8,
          0.45
        )
        .setDepth(14);
      this.tweens.add({
        targets: puff,
        y: puff.y + 40 * this.entityScale,
        scale: 2.0,
        alpha: 0,
        duration: graphicsQuality === 'low' ? 180 : 280,
        onComplete: () => puff.destroy(),
      });
    }
  }

  private getAimTarget(): { x: number; y: number; hasTarget: boolean } {
    const { autoAim } = useSettingsStore.getState();
    const px = this.playerSprite.x;
    const py = this.playerSprite.y;

    if (!autoAim && this.input.activePointer) {
      return {
        x: this.input.activePointer.worldX,
        y: this.input.activePointer.worldY,
        hasTarget: true,
      };
    }

    // Find closest enemy or boss in front/around player
    let bestDist = 680;
    let targetX = px;
    let targetY = py - 300;
    let found = false;

    if (this.activeBoss) {
      const d = Phaser.Math.Distance.Between(
        px,
        py,
        this.activeBoss.sprite.x,
        this.activeBoss.sprite.y
      );
      if (d < bestDist) {
        bestDist = d;
        targetX = this.activeBoss.sprite.x;
        targetY = this.activeBoss.sprite.y;
        found = true;
      }
    }

    for (const enemy of this.enemies) {
      const d = Phaser.Math.Distance.Between(px, py, enemy.sprite.x, enemy.sprite.y);
      if (d < bestDist) {
        bestDist = d;
        targetX = enemy.sprite.x;
        targetY = enemy.sprite.y;
        found = true;
      }
    }

    return { x: targetX, y: targetY, hasTarget: found };
  }

  private updateWeapons(deltaMs: number): void {
    const playerState = usePlayerStore.getState();
    const workshop = useProgressionStore.getState().workshopLevels;
    const { autoFire } = useSettingsStore.getState();
    const pointerDown = this.input.activePointer?.isDown ?? false;
    const shouldFirePrimary = autoFire || this.manualFiring || pointerDown;

    const damageMult =
      (this.vehicleConfig.stats.damage / 12) *
      (1 + (playerState.passiveLevels['passive-damage'] ?? 0) * 0.2 + workshop.weapons * 0.08);

    const fireRateMult =
      (this.vehicleConfig.stats.fireRate / 5.0) *
      (1 + (playerState.passiveLevels['passive-firerate'] ?? 0) * 0.15 + workshop.exhaust * 0.07) *
      (this.nitroTimer > 0 ? 1.65 : 1.0);

    const aim = this.getAimTarget();

    // Draw subtle aim reticle on locked target if auto-aim found one
    if (aim.hasTarget) {
      this.fxGraphics.lineStyle(1.5, 0xfacc15, 0.55);
      this.fxGraphics.strokeCircle(aim.x, aim.y, 26);
    }

    for (const equipped of playerState.weapons) {
      const wId = equipped.id;
      const lvl = equipped.level;
      const cfg = WEAPONS[wId];

      this.weaponCooldowns[wId] -= deltaMs;
      if (this.weaponCooldowns[wId] > 0) continue;

      if (wId === 'double-shot' && !shouldFirePrimary) continue;

      const lvlCooldownFactor = Math.max(0.55, 1 - (lvl - 1) * 0.09);
      this.weaponCooldowns[wId] = (cfg.baseCooldownMs * lvlCooldownFactor) / fireRateMult;

      const finalDamage = cfg.baseDamage * (1 + (lvl - 1) * 0.28) * damageMult;

      switch (wId) {
        case 'double-shot':
          this.fireDoubleShot(lvl, finalDamage, aim);
          break;
        case 'klakson-sonic':
          this.fireKlaksonSonic(lvl, finalDamage);
          break;
        case 'roket-knalpot':
          this.fireRoketKnalpot(lvl, finalDamage, aim);
          break;
        case 'petir-pln':
          this.firePetirPln(lvl, finalDamage);
          break;
        case 'oli-tumpah':
          this.dropOliTumpah(lvl, finalDamage);
          break;
      }
    }
  }

  private fireDoubleShot(
    lvl: number,
    damage: number,
    aim: { x: number; y: number }
  ): void {
    this.fireVehicleBasicSkill(lvl, damage, aim);
  }

  private fireVehicleBasicSkill(
    lvl: number,
    damage: number,
    aim: { x: number; y: number }
  ): void {
    const px = this.playerSprite.x;
    const py = this.playerSprite.y - 28;
    const vId = this.vehicleConfig.id;
    const baseAngle = useSettingsStore.getState().autoAim
      ? -Math.PI / 2 + Phaser.Math.Clamp((aim.x - px) * 0.0012, -0.32, 0.32)
      : Phaser.Math.Angle.Between(px, py, aim.x, aim.y);

    switch (vId) {
      case 'motor-ojol': {
        // Pistol Panah Bintang Lima: Twin fast emerald starlight darts that track enemies with star trails
        audioSystem.playShoot();
        const count = lvl >= 4 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const spread = (i - (count - 1) / 2) * 0.08;
          const angle = baseAngle + spread;
          const sp = this.add
            .sprite(px + (i - (count - 1) / 2) * 14, py, 'proj-basic-dart')
            .setDepth(18)
            .setRotation(angle + Math.PI / 2);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(angle) * 820,
            vy: Math.sin(angle) * 820,
            damage: damage * 1.05,
            isRocket: false,
            aoeRadius: 0,
            pierce: lvl >= 5 ? 2 : 1,
            lifeMs: 1400,
            trailColor: 0x4ade80,
          });
        }
        break;
      }

      case 'bajaj': {
        // Semprotan Knalpot Api 2-Tak: Conic burst of piercing orange flames and exhaust smoke
        audioSystem.playShoot();
        const count = 3 + (lvl >= 4 ? 2 : 0);
        for (let i = 0; i < count; i++) {
          const spread = (i - (count - 1) / 2) * 0.16;
          const angle = baseAngle + spread;
          const sp = this.add
            .sprite(px + (i - (count - 1) / 2) * 10, py, 'proj-basic-flame')
            .setDepth(18)
            .setRotation(angle + Math.PI / 2);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(angle) * (640 + Math.random() * 80),
            vy: Math.sin(angle) * (640 + Math.random() * 80),
            damage: damage * 0.85,
            isRocket: false,
            aoeRadius: 0,
            pierce: 2,
            lifeMs: 850,
            trailColor: 0xf97316,
          });
        }
        break;
      }

      case 'city-car': {
        // Meriam Plasma Tol Gateless: Dual high-velocity cyan ion laser bolts with holographic speed streaks
        audioSystem.playShoot();
        const count = lvl >= 5 ? 4 : lvl >= 3 ? 3 : 2;
        const offsets = count === 2 ? [-12, 12] : count === 3 ? [-16, 0, 16] : [-22, -8, 8, 22];
        offsets.forEach((offX, i) => {
          const angle = baseAngle + (i - (count - 1) / 2) * 0.04;
          const sp = this.add
            .sprite(px + offX, py, 'proj-basic-plasma')
            .setDepth(18)
            .setRotation(angle + Math.PI / 2);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(angle) * 940,
            vy: Math.sin(angle) * 940,
            damage: damage * 1.1,
            isRocket: false,
            aoeRadius: 0,
            pierce: 3,
            lifeMs: 1500,
            trailColor: 0x38bdf8,
          });
        });
        break;
      }

      case 'angkot': {
        // Dentuman Subwoofer 5000W: Concussive acoustic shockwave rings in magenta
        audioSystem.playKlakson();
        const count = lvl >= 4 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const sp = this.add
            .sprite(px, py - i * 16, 'proj-basic-bass')
            .setDepth(18)
            .setRotation(baseAngle + Math.PI / 2)
            .setScale(1.15 * this.entityScale);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(baseAngle) * 620,
            vy: Math.sin(baseAngle) * 620,
            damage: damage * 1.35,
            isRocket: false,
            aoeRadius: 0,
            pierce: 99,
            lifeMs: 1100,
            trailColor: 0xf43f5e,
          });
        }
        break;
      }

      case 'pickup-truck': {
        // Pelontar Roket Tabung Melon: Dual lobbed mini LPG canisters that detonate with fiery craters
        audioSystem.playRocketLaunch();
        const count = lvl >= 4 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const spread = (i - (count - 1) / 2) * 0.14;
          const angle = baseAngle + spread;
          const sp = this.add
            .sprite(px + (i - (count - 1) / 2) * 16, py, 'proj-basic-melon')
            .setDepth(18)
            .setRotation(angle + Math.PI / 2);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(angle) * 580,
            vy: Math.sin(angle) * 580,
            damage: damage * 1.25,
            isRocket: true,
            aoeRadius: 70,
            pierce: 1,
            lifeMs: 1600,
            trailColor: 0x22c55e,
            blastHex: '#EF4444',
          });
        }
        break;
      }

      case 'police-car': {
        // Sinar Strobo EMP Polisi: Alternating red & blue dual stun taser bolts that micro-slow targets
        audioSystem.playShoot();
        const count = lvl >= 4 ? 4 : 2;
        const offsets = count === 2 ? [-10, 10] : [-18, -6, 6, 18];
        offsets.forEach((offX, i) => {
          const angle = baseAngle + (i - (count - 1) / 2) * 0.05;
          const sp = this.add
            .sprite(px + offX, py, 'proj-basic-taser')
            .setDepth(18)
            .setRotation(angle + Math.PI / 2);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(angle) * 860,
            vy: Math.sin(angle) * 860,
            damage: damage * 1.15,
            isRocket: false,
            aoeRadius: 0,
            pierce: 2,
            lifeMs: 1400,
            trailColor: i % 2 === 0 ? 0x3b82f6 : 0xef4444,
          });
        });
        break;
      }

      case 'heavy-truck': {
        // Meriam Peluru Baja Pantura: Heavy kinetic tungsten sabot that pierces armor and obstacles
        audioSystem.playShoot();
        const count = lvl >= 4 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const offX = count === 1 ? 0 : i === 0 ? -14 : 14;
          const sp = this.add
            .sprite(px + offX, py, 'proj-basic-cannon')
            .setDepth(18)
            .setRotation(baseAngle + Math.PI / 2)
            .setScale(1.2 * this.entityScale);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(baseAngle) * 720,
            vy: Math.sin(baseAngle) * 720,
            damage: damage * 1.6,
            isRocket: false,
            aoeRadius: 0,
            pierce: 4,
            lifeMs: 1500,
            trailColor: 0xf59e0b,
          });
        }
        break;
      }

      case 'crazy-rich': {
        // Laser Kripto Emas & Shuriken Berlian: Spinning faceted diamond shurikens and golden laser bolts
        audioSystem.playShoot();
        const count = lvl >= 4 ? 4 : 3;
        for (let i = 0; i < count; i++) {
          const spread = (i - (count - 1) / 2) * 0.09;
          const angle = baseAngle + spread;
          const sp = this.add
            .sprite(px + (i - (count - 1) / 2) * 16, py, 'proj-basic-diamond')
            .setDepth(18)
            .setRotation(angle + Math.PI / 2);

          this.projectiles.push({
            sprite: sp,
            vx: Math.cos(angle) * 880,
            vy: Math.sin(angle) * 880,
            damage: damage * 1.2,
            isRocket: false,
            aoeRadius: 0,
            pierce: 2,
            lifeMs: 1500,
            trailColor: 0xfacc15,
          });
        }
        break;
      }

      default: {
        // Fallback default bullet
        audioSystem.playShoot();
        const sp = this.add
          .sprite(px, py, 'proj-bullet')
          .setDepth(18)
          .setRotation(baseAngle + Math.PI / 2);
        this.projectiles.push({
          sprite: sp,
          vx: Math.cos(baseAngle) * 780,
          vy: Math.sin(baseAngle) * 780,
          damage,
          isRocket: false,
          aoeRadius: 0,
          pierce: 1,
          lifeMs: 1400,
        });
        break;
      }
    }
  }

  private fireKlaksonSonic(lvl: number, damage: number): void {
    audioSystem.playKlakson();

    const px = this.playerSprite.x;
    const py = this.playerSprite.y;
    const maxRadius = WEAPONS['klakson-sonic'].baseRange * (1 + (lvl - 1) * 0.18);

    // Expanding Sonic Ring Visual
    const ringCount = lvl >= 4 ? 2 : 1;
    for (let r = 0; r < ringCount; r++) {
      const ring = this.add
        .circle(px, py, 20, 0xa855f7, 0.18)
        .setStrokeStyle(4, r === 0 ? 0xa855f7 : 0x38bdf8, 0.95)
        .setDepth(22);

      this.tweens.add({
        targets: ring,
        radius: maxRadius,
        alpha: 0,
        delay: r * 120,
        duration: 380,
        ease: 'Cubic.easeOut',
        onComplete: () => ring.destroy(),
      });
    }

    // Damage & Knockback nearby enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const dist = Phaser.Math.Distance.Between(px, py, enemy.sprite.x, enemy.sprite.y);
      if (dist <= maxRadius) {
        if (enemy.archetype === 'lawan-arah') {
          // Lawan Arah charges forward with momentum - never knocked backwards into oncoming traffic!
          // It swerves violently sideways and suffers brake deceleration instead
          enemy.vx += (enemy.sprite.x > px ? 175 : -175);
          enemy.slowTimer = Math.max(enemy.slowTimer, 450);
        } else {
          enemy.sprite.y -= 45 + lvl * 10; // Knockback upward for same-direction traffic
        }
        this.damageEnemy(i, damage, '#C084FC');
      }
    }

    if (this.activeBoss) {
      const dist = Phaser.Math.Distance.Between(
        px,
        py,
        this.activeBoss.sprite.x,
        this.activeBoss.sprite.y
      );
      if (dist <= maxRadius + 50) {
        this.damageBoss(damage, '#C084FC');
      }
    }

    // Level 5 destroys nearby enemy projectiles
    if (lvl >= 5) {
      for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
        const ep = this.enemyProjectiles[i];
        if (Phaser.Math.Distance.Between(px, py, ep.sprite.x, ep.sprite.y) <= maxRadius) {
          ep.sprite.destroy();
          this.enemyProjectiles.splice(i, 1);
        }
      }
    }
  }

  private fireRoketKnalpot(
    lvl: number,
    damage: number,
    aim: { x: number; y: number }
  ): void {
    audioSystem.playRocketLaunch();

    const px = this.playerSprite.x;
    const py = this.playerSprite.y - 20;
    const rocketCount = lvl >= 5 ? 3 : lvl >= 3 ? 2 : 1;
    const aoeRadius = 85 + lvl * 16;
    const baseAngle = Phaser.Math.Angle.Between(px, py, aim.x, aim.y);
    const speed = 520 + lvl * 35;

    const vId = this.vehicleConfig.id;
    const rocketTex = this.textures.exists(`proj-rocket-${vId}`)
      ? `proj-rocket-${vId}`
      : 'proj-rocket';

    // Vehicle-specific missile trail and AoE explosion palettes
    const rocketThemes: Record<string, { trail: number; blastHex: string }> = {
      'motor-ojol': { trail: 0x22c55e, blastHex: '#4ADE80' },
      'bajaj': { trail: 0xf97316, blastHex: '#FB923C' },
      'city-car': { trail: 0x38bdf8, blastHex: '#38BDF8' },
      'angkot': { trail: 0xc084fc, blastHex: '#F43F5E' },
      'pickup-truck': { trail: 0x16a34a, blastHex: '#EF4444' },
      'police-car': { trail: 0x3b82f6, blastHex: '#38BDF8' },
      'heavy-truck': { trail: 0xf59e0b, blastHex: '#F59E0B' },
      'crazy-rich': { trail: 0xfacc15, blastHex: '#FDE047' },
    };
    const theme = rocketThemes[vId] || { trail: 0xf97316, blastHex: '#F97316' };

    for (let i = 0; i < rocketCount; i++) {
      const spread = (i - (rocketCount - 1) / 2) * 0.16;
      const angle = baseAngle + spread;
      const sprite = this.add
        .sprite(px + (i - (rocketCount - 1) / 2) * 18, py, rocketTex)
        .setDepth(19)
        .setRotation(angle + Math.PI / 2);

      this.projectiles.push({
        sprite,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage,
        isRocket: true,
        aoeRadius,
        pierce: 1,
        lifeMs: 1800,
        trailColor: theme.trail,
        blastHex: theme.blastHex,
      });
    }
  }

  private firePetirPln(lvl: number, damage: number): void {
    const maxTargets = 2 + lvl;
    const range = WEAPONS['petir-pln'].baseRange * (1 + (lvl - 1) * 0.12);

    const candidates: Array<{ x: number; y: number; enemyIndex: number; isBoss: boolean }> = [];
    this.enemies.forEach((e, idx) => {
      const d = Phaser.Math.Distance.Between(
        this.playerSprite.x,
        this.playerSprite.y,
        e.sprite.x,
        e.sprite.y
      );
      if (d <= range) {
        candidates.push({ x: e.sprite.x, y: e.sprite.y, enemyIndex: idx, isBoss: false });
      }
    });

    if (this.activeBoss) {
      const d = Phaser.Math.Distance.Between(
        this.playerSprite.x,
        this.playerSprite.y,
        this.activeBoss.sprite.x,
        this.activeBoss.sprite.y
      );
      if (d <= range + 60) {
        candidates.push({
          x: this.activeBoss.sprite.x,
          y: this.activeBoss.sprite.y,
          enemyIndex: -1,
          isBoss: true,
        });
      }
    }

    if (candidates.length === 0) return;

    audioSystem.playLightning();

    // Sort closest first
    candidates.sort(
      (a, b) =>
        Phaser.Math.Distance.Between(this.playerSprite.x, this.playerSprite.y, a.x, a.y) -
        Phaser.Math.Distance.Between(this.playerSprite.x, this.playerSprite.y, b.x, b.y)
    );

    const hitTargets = candidates.slice(0, maxTargets);
    const boltGraphics = this.add.graphics().setDepth(24);
    boltGraphics.lineStyle(3, 0x38bdf8, 1);

    let prevX = this.playerSprite.x;
    let prevY = this.playerSprite.y - 15;

    // Collect indices in descending order before damaging so splice doesn't shift indices
    const enemyHitIndices: number[] = [];

    hitTargets.forEach((t) => {
      // Draw jagged lightning segments
      boltGraphics.beginPath();
      boltGraphics.moveTo(prevX, prevY);
      const midX = (prevX + t.x) / 2 + (Math.random() - 0.5) * 32;
      const midY = (prevY + t.y) / 2 + (Math.random() - 0.5) * 32;
      boltGraphics.lineTo(midX, midY);
      boltGraphics.lineTo(t.x, t.y);
      boltGraphics.strokePath();

      prevX = t.x;
      prevY = t.y;

      if (t.isBoss) {
        this.damageBoss(damage, '#38BDF8');
      } else {
        enemyHitIndices.push(t.enemyIndex);
      }
    });

    enemyHitIndices
      .sort((a, b) => b - a)
      .forEach((idx) => {
        if (this.enemies[idx]) {
          this.damageEnemy(idx, damage, '#38BDF8');
        }
      });

    this.tweens.add({
      targets: boltGraphics,
      alpha: 0,
      duration: 180,
      onComplete: () => boltGraphics.destroy(),
    });
  }

  private dropOliTumpah(lvl: number, damage: number): void {
    const count = lvl >= 3 ? 2 : 1;
    const scale = 1 + (lvl - 1) * 0.15;
    const isBurning = lvl >= 5;

    for (let i = 0; i < count; i++) {
      const offsetX = count === 2 ? (i === 0 ? -24 : 24) : 0;
      const sprite = this.add
        .sprite(this.playerSprite.x + offsetX, this.playerSprite.y + 38, 'trap-oil')
        .setDepth(5)
        .setScale(scale);

      if (isBurning) {
        sprite.setTint(0xf97316);
      }

      this.oilTraps.push({
        sprite,
        radius: 36 * scale,
        dps: damage * (isBurning ? 1.8 : 1.0),
        slowRatio: lvl >= 4 ? 0.6 : 0.42,
        lifeMs: 4200 + lvl * 500,
        tickTimer: 0,
        isBurning,
      });
    }
  }

  public activateDodgeNitro(): void {
    if (this.dodgeCooldownMs > 0) return;
    this.dodgeCooldownMs = this.dodgeMaxCooldownMs;
    this.nitroTimer = Math.max(this.nitroTimer, 950);
    this.invulnTimer = Math.max(this.invulnTimer, 950);

    audioSystem.playShoot();

    const ring = this.add
      .circle(this.playerSprite.x, this.playerSprite.y, 18, 0x38bdf8, 0.3)
      .setStrokeStyle(3, 0x38bdf8, 0.95)
      .setDepth(22);

    this.tweens.add({
      targets: ring,
      radius: 95 * this.entityScale,
      alpha: 0,
      duration: 280,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy(),
    });
  }

  public activateSpecialAbility(): void {
    if (this.specialCooldownMs > 0) return;

    const passives = usePlayerStore.getState().passiveLevels;
    const cdReduction = Math.min(0.6, (passives['passive-cooldown'] ?? 0) * 0.15);
    this.specialMaxCooldownMs = this.vehicleConfig.specialCooldown * 1000 * (1 - cdReduction);
    this.specialCooldownMs = this.specialMaxCooldownMs;

    audioSystem.playUltimateAudio(this.vehicleConfig.id);

    if (useSettingsStore.getState().screenShake) {
      this.cameras.main.shake(380, 0.015);
    }

    const px = this.playerSprite.x;
    const py = this.playerSprite.y;
    const baseDamage =
      this.vehicleConfig.stats.damage * 6.5 * (1 + (passives['passive-cooldown'] ?? 0) * 0.25);

    // Clear all active enemy projectiles immediately
    for (const ep of this.enemyProjectiles) {
      ep.sprite.destroy();
    }
    this.enemyProjectiles = [];

    // Cinematic Arcade Ultimate Cut-In Banner across Top-Center of Screen
    this.showUltimateCutInBanner(
      this.vehicleConfig.specialName.toUpperCase(),
      this.vehicleConfig.primaryColor
    );

    switch (this.vehicleConfig.id) {
      case 'motor-ojol': {
        // =====================================================================
        // ULTIMATE 1: KONVOI SOLIDARITAS OJOL (6 Wingman Ojol Squadron Stampede!)
        // =====================================================================
        this.nitroTimer = 3600;
        this.invulnTimer = Math.max(this.invulnTimer, 3400);

        // Spawn 6 AI Wingman Ojol Riders roaring up from the bottom in V-formation
        const squadCount = 6;
        for (let s = 0; s < squadCount; s++) {
          const laneFrac = (s + 0.5) / squadCount;
          const startX = this.roadLeft + 34 + laneFrac * (this.roadWidth - 68);
          const vOffset = Math.abs(s - 2.5) * 42;
          const startY = this.scale.height + 60 + vOffset;

          const wingman = this.add
            .sprite(startX, startY, 'player-motor-ojol')
            .setDepth(24)
            .setDisplaySize(54 * this.entityScale, 82 * this.entityScale);

          const aura = this.add
            .circle(startX, startY, 34 * this.entityScale, 0x22c55e, 0.28)
            .setStrokeStyle(3, 0xfacc15, 0.95)
            .setDepth(23);

          const starBadge = this.add
            .text(startX, startY - 46 * this.entityScale, '★★★★★', {
              fontFamily: 'Outfit, sans-serif',
              fontSize: '11px',
              fontStyle: '900',
              color: '#FACC15',
              stroke: '#0F172A',
              strokeThickness: 3,
            })
            .setOrigin(0.5)
            .setDepth(25);

          // Move wingman up across the entire screen while firing & bulldozing enemies
          this.tweens.add({
            targets: [wingman, aura, starBadge],
            y: '-=1150',
            duration: 2300 + (s % 2) * 220,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
              aura.setPosition(wingman.x, wingman.y);
              starBadge.setPosition(wingman.x, wingman.y - 46 * this.entityScale);

              // Leave green neon speed trail
              if (Math.random() < 0.35) {
                const spark = this.add
                  .circle(wingman.x, wingman.y + 34, 6, 0x22c55e, 0.7)
                  .setDepth(22);
                this.tweens.add({
                  targets: spark,
                  alpha: 0,
                  scale: 0.2,
                  duration: 240,
                  onComplete: () => spark.destroy(),
                });
              }

              // Destroy any obstacle in path
              for (let oi = this.obstacles.length - 1; oi >= 0; oi--) {
                const obs = this.obstacles[oi];
                if (
                  Phaser.Math.Distance.Between(wingman.x, wingman.y, obs.sprite.x, obs.sprite.y) <
                  58
                ) {
                  this.spawnExplosion(obs.sprite.x, obs.sprite.y, false);
                  obs.sprite.destroy();
                  this.obstacles.splice(oi, 1);
                }
              }

              // Ram & damage enemies in path
              for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
                const en = this.enemies[ei];
                if (
                  Phaser.Math.Distance.Between(wingman.x, wingman.y, en.sprite.x, en.sprite.y) < 68
                ) {
                  en.sprite.y -= 35;
                  this.damageEnemy(ei, baseDamage * 0.38, '#22C55E');
                }
              }
            },
            onComplete: () => {
              wingman.destroy();
              aura.destroy();
              starBadge.destroy();
            },
          });

          // Wingman rapid-fires golden bullets every 240ms
          for (let shot = 1; shot <= 7; shot++) {
            this.time.delayedCall(shot * 240 + s * 35, () => {
              if (!wingman.active || this.isGameOver) return;
              const bSprite = this.add
                .sprite(wingman.x, wingman.y - 32, 'proj-bullet')
                .setDepth(19)
                .setTint(0x4ade80);
              this.projectiles.push({
                sprite: bSprite,
                vx: 0,
                vy: -880,
                damage: baseDamage * 0.32,
                isRocket: false,
                aoeRadius: 0,
                pierce: 2,
                lifeMs: 1400,
              });
            });
          }
        }

        // Magnetize all collectibles on screen straight to the player + initial AoE hit
        for (const item of this.collectibles) {
          this.tweens.add({
            targets: item.sprite,
            x: this.playerSprite.x,
            y: this.playerSprite.y,
            duration: 380,
          });
        }
        if (this.activeBoss) {
          this.damageBoss(baseDamage * 1.4, '#22C55E');
        }
        break;
      }

      case 'city-car': {
        // =====================================================================
        // ULTIMATE 2: LASER TOL & PLASMA DRIFT (Sweeping Twin Orbital Beams + Hurricane!)
        // =====================================================================
        this.nitroTimer = 4500;
        this.invulnTimer = Math.max(this.invulnTimer, 4500);

        const beamGfx = this.add.graphics().setDepth(28);
        const totalTicks = 28; // 28 * 110ms = ~3.1 seconds of continuous sweeping laser + plasma spiral

        for (let tick = 0; tick < totalTicks; tick++) {
          this.time.delayedCall(tick * 110, () => {
            if (this.isGameOver) {
              beamGfx.clear();
              return;
            }
            const cX = this.playerSprite.x;
            const cY = this.playerSprite.y;

            // Spawn neon cyan/magenta afterimage ghost clone behind car
            if (tick % 2 === 0) {
              const [pw, ph] = this.getPlayerDisplayDims();
              const ghost = this.add
                .sprite(cX, cY, 'player-city-car')
                .setDisplaySize(pw, ph)
                .setTint(tick % 4 === 0 ? 0x38bdf8 : 0xa855f7)
                .setAlpha(0.55)
                .setDepth(14);
              this.tweens.add({
                targets: ghost,
                y: cY + 65,
                alpha: 0,
                scaleX: ghost.scaleX * 0.85,
                scaleY: ghost.scaleY * 0.85,
                duration: 320,
                onComplete: () => ghost.destroy(),
              });
            }

            // Draw sweeping Twin Plasma Laser Beams from front bumper to top of screen
            const sweepPhase = Math.sin((tick / totalTicks) * Math.PI * 3);
            const leftBeamTargetX = cX - 65 + sweepPhase * (this.roadWidth * 0.45);
            const rightBeamTargetX = cX + 65 - sweepPhase * (this.roadWidth * 0.45);

            beamGfx.clear();
            // Outer Magenta/Cyan Glow
            beamGfx.lineStyle(22, 0xa855f7, 0.35);
            beamGfx.beginPath();
            beamGfx.moveTo(cX - 18, cY - 36);
            beamGfx.lineTo(leftBeamTargetX, -20);
            beamGfx.moveTo(cX + 18, cY - 36);
            beamGfx.lineTo(rightBeamTargetX, -20);
            beamGfx.strokePath();

            // Mid Cyan Plasma Beam
            beamGfx.lineStyle(11, 0x38bdf8, 0.85);
            beamGfx.beginPath();
            beamGfx.moveTo(cX - 18, cY - 36);
            beamGfx.lineTo(leftBeamTargetX, -20);
            beamGfx.moveTo(cX + 18, cY - 36);
            beamGfx.lineTo(rightBeamTargetX, -20);
            beamGfx.strokePath();

            // Inner White-Hot Core
            beamGfx.lineStyle(4, 0xffffff, 1);
            beamGfx.beginPath();
            beamGfx.moveTo(cX - 18, cY - 36);
            beamGfx.lineTo(leftBeamTargetX, -20);
            beamGfx.moveTo(cX + 18, cY - 36);
            beamGfx.lineTo(rightBeamTargetX, -20);
            beamGfx.strokePath();

            // Fire 2 spiraling Cyber-Plasma Orbs every tick
            for (let side = 0; side < 2; side++) {
              const spiralAngle = tick * 0.55 + side * Math.PI;
              const orb = this.add
                .sprite(cX, cY, 'ult-plasma-orb')
                .setDepth(21)
                .setScale(0.95);
              this.projectiles.push({
                sprite: orb,
                vx: Math.cos(spiralAngle) * 580,
                vy: Math.sin(spiralAngle) * 580 - 180,
                damage: baseDamage * 0.22,
                isRocket: false,
                aoeRadius: 0,
                pierce: 3,
                lifeMs: 1500,
              });
            }

            // Continuous laser incineration damage across enemies in front
            for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
              const en = this.enemies[ei];
              if (en.sprite.y < cY + 40) {
                this.damageEnemy(ei, baseDamage * 0.14, '#38BDF8');
              }
            }
            if (this.activeBoss && tick % 2 === 0) {
              this.damageBoss(baseDamage * 0.16, '#38BDF8');
            }

            if (tick === totalTicks - 1) {
              beamGfx.destroy();
            }
          });
        }
        break;
      }

      case 'angkot': {
        // =====================================================================
        // ULTIMATE 3: DUGEM NGETEM 10.000 WATT (4s Street Rave, Equalizers & Bass Vortex!)
        // =====================================================================
        this.nitroTimer = 4000;
        this.invulnTimer = Math.max(this.invulnTimer, 4000);

        const raveGfx = this.add.graphics().setDepth(25);
        const raveColors = [0xec4899, 0x38bdf8, 0xfacc15, 0x22c55e, 0xa855f7, 0xf97316];
        const totalBeats = 8; // 8 beats * 420ms = ~3.4 seconds of full street rave

        for (let beat = 0; beat < totalBeats; beat++) {
          this.time.delayedCall(beat * 420, () => {
            if (this.isGameOver) {
              raveGfx.clear();
              return;
            }
            if (beat % 2 === 0) {
              audioSystem.playUltimateAudio('angkot');
            }

            const cX = this.playerSprite.x;
            const cY = this.playerSprite.y;
            const beatColor = raveColors[beat % raveColors.length];
            const nextColor = raveColors[(beat + 2) % raveColors.length];

            // Draw Equalizer Spectrum Bars along Left & Right Road Borders + Disco Laser Cones
            raveGfx.clear();
            const barCount = 14;
            const barH = this.scale.height / barCount;
            for (let b = 0; b < barCount; b++) {
              const eqWidth = (18 + Math.random() * 58) * this.entityScale;
              const col = raveColors[(b + beat) % raveColors.length];
              raveGfx.fillStyle(col, 0.55);
              raveGfx.fillRect(this.roadLeft, b * barH + 2, eqWidth, barH - 4);
              raveGfx.fillRect(this.roadRight - eqWidth, b * barH + 2, eqWidth, barH - 4);
            }

            // Concentric Multi-Colored Subwoofer Bass Drop Wave Rings
            for (let ringIdx = 0; ringIdx < 2; ringIdx++) {
              const bassRing = this.add
                .circle(cX, cY, 26, beatColor, 0.22)
                .setStrokeStyle(7 - ringIdx * 2, ringIdx === 0 ? beatColor : nextColor, 1)
                .setDepth(26);

              this.tweens.add({
                targets: bassRing,
                radius: 460,
                alpha: 0,
                delay: ringIdx * 90,
                duration: 390,
                ease: 'Cubic.easeOut',
                onComplete: () => bassRing.destroy(),
              });
            }

            // Floating Musical Notes ("♪ JEDAG JEDUG ♫")
            const noteLabels = ['♪ BASS DROP! ♫', '♬ 10.000 WATT! ♪', '🔊 NGETEM DUGEM! ♫'];
            const noteTxt = this.add
              .text(
                cX + (Math.random() - 0.5) * 140,
                cY - 35,
                noteLabels[beat % noteLabels.length],
                {
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '16px',
                  fontStyle: '900 italic',
                  color: '#FACC15',
                  stroke: '#0F172A',
                  strokeThickness: 4,
                }
              )
              .setOrigin(0.5)
              .setDepth(29);

            this.tweens.add({
              targets: noteTxt,
              y: noteTxt.y - 90,
              alpha: 0,
              scale: 1.25,
              duration: 550,
              onComplete: () => noteTxt.destroy(),
            });

            // Force all enemies on screen to SPIN/DANCE uncontrollably, get knocked back & take bass damage
            for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
              const en = this.enemies[ei];
              en.sprite.y -= 38;
              en.slowTimer = Math.max(en.slowTimer, 4000);
              this.tweens.add({
                targets: en.sprite,
                angle: en.sprite.angle + (beat % 2 === 0 ? 35 : -35),
                yoyo: true,
                duration: 180,
              });
              this.damageEnemy(ei, baseDamage * 0.28, '#EC4899');
            }

            if (this.activeBoss) {
              this.damageBoss(baseDamage * 0.26, '#EC4899');
            }

            if (beat === totalBeats - 1) {
              this.time.delayedCall(380, () => raveGfx.destroy());
            }
          });
        }
        break;
      }

      case 'pickup-truck': {
        // =====================================================================
        // ULTIMATE 4: HUJAN TABUNG GAS MELON (16 Spinning 3kg LPG Canisters + Napalm!)
        // =====================================================================
        this.nitroTimer = 3400;
        this.invulnTimer = Math.max(this.invulnTimer, 3200);

        const canisterCount = 16;
        for (let c = 0; c < canisterCount; c++) {
          this.time.delayedCall(c * 135, () => {
            if (this.isGameOver) return;

            const startX = this.playerSprite.x + (Math.random() - 0.5) * 40;
            const startY = this.playerSprite.y - 10;

            // Pick target coordinates across all 4 lanes on screen
            const targetX =
              this.roadLeft + 42 + Math.random() * Math.max(80, this.roadWidth - 84);
            const targetY = 90 + Math.random() * (this.scale.height * 0.68);

            // Paint pulsing red target reticle on the road
            const reticle = this.add
              .circle(targetX, targetY, 44 * this.entityScale, 0xef4444, 0.18)
              .setStrokeStyle(2.5, 0xef4444, 0.9)
              .setDepth(12);

            // Launch spinning 3kg Gas Melon canister along high arc
            const melon = this.add
              .sprite(startX, startY, 'ult-gas-melon')
              .setDepth(27)
              .setScale(0.85 * this.entityScale);

            this.tweens.add({
              targets: melon,
              x: targetX,
              y: targetY,
              angle: 720,
              scale: { from: 1.45 * this.entityScale, to: 0.95 * this.entityScale },
              duration: 520,
              ease: 'Quad.easeIn',
              onComplete: () => {
                melon.destroy();
                reticle.destroy();
                if (this.isGameOver) return;

                // Detonate Gas Melon with big fiery explosion!
                this.spawnExplosion(targetX, targetY, true);
                if (c % 2 === 0) {
                  audioSystem.playExplosion(true);
                }

                // Leave persistent burning Napalm Fire Zone on the road
                const fireSprite = this.add
                  .sprite(targetX, targetY, 'ult-fire-zone')
                  .setDepth(6)
                  .setScale(1.15 * this.entityScale);

                this.oilTraps.push({
                  sprite: fireSprite,
                  radius: 56 * this.entityScale,
                  dps: baseDamage * 0.42,
                  slowRatio: 0.55,
                  lifeMs: 3600,
                  tickTimer: 0,
                  isBurning: true,
                });

                // Heavy AoE Blast Damage around impact
                const blastRadius = 145 * this.entityScale;
                for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
                  const en = this.enemies[ei];
                  if (
                    Phaser.Math.Distance.Between(targetX, targetY, en.sprite.x, en.sprite.y) <=
                    blastRadius
                  ) {
                    en.sprite.y -= 35;
                    this.damageEnemy(ei, baseDamage * 0.55, '#F97316');
                  }
                }
                if (
                  this.activeBoss &&
                  Phaser.Math.Distance.Between(
                    targetX,
                    targetY,
                    this.activeBoss.sprite.x,
                    this.activeBoss.sprite.y
                  ) <=
                    blastRadius + 70
                ) {
                  this.damageBoss(baseDamage * 0.32, '#F97316');
                }
              },
            });
          });
        }
        break;
      }

      case 'heavy-truck': {
        // =====================================================================
        // ULTIMATE 5: SERUDUK BAJA & BADAI SUTET (Armored V-Plow + 12 Lightning Pillars!)
        // =====================================================================
        this.nitroTimer = 4400;
        this.invulnTimer = Math.max(this.invulnTimer, 4400);
        this.healPlayer(35);

        // Attach Giant Golden V-Plow ("Bemper Baja Pantura") in front of Heavy Truck
        const plow = this.add
          .sprite(px, py - 56 * this.entityScale, 'ult-bumper-plow')
          .setDepth(25)
          .setScale(1.15 * this.entityScale);

        const plowEvent = this.time.addEvent({
          delay: 30,
          repeat: 135, // ~4.1 seconds
          callback: () => {
            if (this.isGameOver || !plow.active) return;
            plow.setPosition(
              this.playerSprite.x,
              this.playerSprite.y - 58 * this.entityScale
            );
            plow.setAngle(this.playerSprite.angle);

            // Instantly pulverize any obstacle or enemy in front of the V-Plow!
            for (let oi = this.obstacles.length - 1; oi >= 0; oi--) {
              const obs = this.obstacles[oi];
              if (Phaser.Math.Distance.Between(plow.x, plow.y, obs.sprite.x, obs.sprite.y) < 85) {
                this.spawnExplosion(obs.sprite.x, obs.sprite.y, false);
                obs.sprite.destroy();
                this.obstacles.splice(oi, 1);
              }
            }
            for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
              const en = this.enemies[ei];
              if (Phaser.Math.Distance.Between(plow.x, plow.y, en.sprite.x, en.sprite.y) < 92) {
                en.sprite.y -= 55;
                this.damageEnemy(ei, baseDamage * 0.35, '#FACC15');
              }
            }
          },
        });

        this.time.delayedCall(4150, () => {
          plowEvent.remove(false);
          if (plow.active) plow.destroy();
        });

        // Call down 12 High-Voltage SUTET Lightning Pillars across the highway!
        const strikeCount = 12;
        for (let s = 0; s < strikeCount; s++) {
          this.time.delayedCall(s * 230, () => {
            if (this.isGameOver) return;
            if (s % 2 === 0) audioSystem.playLightning();

            // Target an enemy, Boss, or random lane coordinate
            let tx = this.roadLeft + 45 + Math.random() * (this.roadWidth - 90);
            let ty = 120 + Math.random() * (this.scale.height * 0.55);
            if (this.enemies.length > 0) {
              const pick = this.enemies[s % this.enemies.length];
              if (pick && pick.sprite.active) {
                tx = pick.sprite.x;
                ty = pick.sprite.y;
              }
            } else if (this.activeBoss) {
              tx = this.activeBoss.sprite.x + (Math.random() - 0.5) * 90;
              ty = this.activeBoss.sprite.y;
            }

            // Draw Vertical Jagged SUTET Lightning Pillar from sky (y=0) to (tx, ty)
            const bolt = this.add.graphics().setDepth(28);
            // Outer Gold Aura
            bolt.lineStyle(14, 0xfacc15, 0.45);
            bolt.beginPath();
            bolt.moveTo(tx + (Math.random() - 0.5) * 30, 0);
            const steps = 6;
            const pts: Array<{ x: number; y: number }> = [];
            for (let k = 1; k < steps; k++) {
              const pyStep = (ty / steps) * k;
              const pxStep = tx + (Math.random() - 0.5) * 55;
              pts.push({ x: pxStep, y: pyStep });
              bolt.lineTo(pxStep, pyStep);
            }
            bolt.lineTo(tx, ty);
            bolt.strokePath();

            // Inner Cyan-White High Voltage Core
            bolt.lineStyle(5, 0xffffff, 1);
            bolt.beginPath();
            bolt.moveTo(tx, 0);
            pts.forEach((p) => bolt.lineTo(p.x, p.y));
            bolt.lineTo(tx, ty);
            bolt.strokePath();

            // Electric shockwave ring at impact point
            const shock = this.add
              .circle(tx, ty, 18, 0x38bdf8, 0.35)
              .setStrokeStyle(5, 0xfacc15, 1)
              .setDepth(27);

            this.tweens.add({
              targets: shock,
              radius: 135 * this.entityScale,
              alpha: 0,
              duration: 340,
              onComplete: () => shock.destroy(),
            });

            this.tweens.add({
              targets: bolt,
              alpha: 0,
              duration: 260,
              onComplete: () => bolt.destroy(),
            });

            // Damage enemies & Boss near lightning pillar
            for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
              const en = this.enemies[ei];
              if (Phaser.Math.Distance.Between(tx, ty, en.sprite.x, en.sprite.y) <= 145) {
                en.slowTimer = Math.max(en.slowTimer, 2000);
                this.damageEnemy(ei, baseDamage * 0.48, '#38BDF8');
              }
            }
            if (
              this.activeBoss &&
              Phaser.Math.Distance.Between(
                tx,
                ty,
                this.activeBoss.sprite.x,
                this.activeBoss.sprite.y
              ) <= 180
            ) {
              this.damageBoss(baseDamage * 0.35, '#FACC15');
            }
          });
        }
        break;
      }

      case 'bajaj': {
        // =====================================================================
        // ULTIMATE: PUTAR BALIK 360° & KNALPOT CEMPRENG (360 Drift + 2 Companion Bajaj!)
        // =====================================================================
        this.nitroTimer = 3600;
        this.invulnTimer = Math.max(this.invulnTimer, 3600);

        // Spin player sprite 720 degrees with dramatic smoke burst
        this.tweens.add({
          targets: this.playerSprite,
          angle: this.playerSprite.angle + 720,
          duration: 1200,
          ease: 'Cubic.easeInOut',
        });

        // 8 Radial Exhaust Fire Rings
        for (let ring = 0; ring < 8; ring++) {
          this.time.delayedCall(ring * 110, () => {
            if (this.isGameOver) return;
            const shock = this.add
              .circle(this.playerSprite.x, this.playerSprite.y, 22, 0xf97316, 0.35)
              .setStrokeStyle(4, 0xfde047, 0.95)
              .setDepth(23);

            this.tweens.add({
              targets: shock,
              radius: 160 * this.entityScale,
              alpha: 0,
              duration: 380,
              onComplete: () => shock.destroy(),
            });

            // Knock back and damage enemies around Bajaj
            for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
              const en = this.enemies[ei];
              if (
                Phaser.Math.Distance.Between(
                  this.playerSprite.x,
                  this.playerSprite.y,
                  en.sprite.x,
                  en.sprite.y
                ) < 170
              ) {
                en.sprite.y -= 45;
                this.damageEnemy(ei, baseDamage * 0.32, '#F97316');
              }
            }
          });
        }

        // Spawn 2 Wingman Bajaj (Kiri & Kanan) rushing up to flank the player
        const flanks = [-75, 75];
        flanks.forEach((offset, idx) => {
          const wStartX = Phaser.Math.Clamp(
            this.playerSprite.x + offset,
            this.roadLeft + 30,
            this.roadRight - 30
          );
          const wStartY = this.scale.height + 70;

          const wingBajaj = this.add
            .sprite(wStartX, wStartY, 'player-bajaj')
            .setDepth(22)
            .setDisplaySize(58 * this.entityScale, 86 * this.entityScale);

          const wAura = this.add
            .circle(wStartX, wStartY, 32 * this.entityScale, 0xf97316, 0.28)
            .setStrokeStyle(2.5, 0xfde047, 0.9)
            .setDepth(21);

          this.tweens.add({
            targets: [wingBajaj, wAura],
            y: '-=1100',
            duration: 2500,
            ease: 'Linear',
            onUpdate: () => {
              wAura.setPosition(wingBajaj.x, wingBajaj.y);

              // Clear obstacles
              for (let oi = this.obstacles.length - 1; oi >= 0; oi--) {
                const obs = this.obstacles[oi];
                if (
                  Phaser.Math.Distance.Between(wingBajaj.x, wingBajaj.y, obs.sprite.x, obs.sprite.y) <
                  52
                ) {
                  this.spawnExplosion(obs.sprite.x, obs.sprite.y, false);
                  obs.sprite.destroy();
                  this.obstacles.splice(oi, 1);
                }
              }

              // Ram enemies
              for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
                const en = this.enemies[ei];
                if (
                  Phaser.Math.Distance.Between(wingBajaj.x, wingBajaj.y, en.sprite.x, en.sprite.y) <
                  64
                ) {
                  en.sprite.y -= 30;
                  this.damageEnemy(ei, baseDamage * 0.35, '#F97316');
                }
              }
            },
            onComplete: () => {
              wingBajaj.destroy();
              wAura.destroy();
            },
          });

          // Companion bajaj horns
          for (let h = 1; h <= 6; h++) {
            this.time.delayedCall(h * 260 + idx * 60, () => {
              if (!wingBajaj.active || this.isGameOver) return;
              const hWave = this.add
                .circle(wingBajaj.x, wingBajaj.y - 28, 16, 0xfde047, 0.4)
                .setStrokeStyle(3, 0xf97316, 1)
                .setDepth(20);
              this.tweens.add({
                targets: hWave,
                radius: 65,
                y: wingBajaj.y - 90,
                alpha: 0,
                duration: 280,
                onComplete: () => hWave.destroy(),
              });
            });
          }
        });

        if (this.activeBoss) {
          this.damageBoss(baseDamage * 1.35, '#F97316');
        }
        break;
      }

      case 'crazy-rich': {
        // =====================================================================
        // ULTIMATE: HUJAN CUAN & LASER KRIPTO EMAS (Money Rain + 4 Gold Lasers!)
        // =====================================================================
        this.nitroTimer = 3800;
        this.invulnTimer = Math.max(this.invulnTimer, 3800);
        this.coinsEarned += 60;

        // Flash screen gold
        const goldFlash = this.add
          .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0xfacc15, 0.25)
          .setDepth(35);
        this.tweens.add({
          targets: goldFlash,
          alpha: 0,
          duration: 400,
          onComplete: () => goldFlash.destroy(),
        });

        // Hujan Cuan: 16 Cash bundles & Gold Ingots raining down from sky
        const dropCount = 16;
        for (let d = 0; d < dropCount; d++) {
          this.time.delayedCall(d * 120, () => {
            if (this.isGameOver) return;
            const targetX = this.roadLeft + 35 + Math.random() * (this.roadWidth - 70);
            const targetY = 100 + Math.random() * (this.scale.height * 0.7);

            // Gold Money Bag icon falling
            const bill = this.add
              .text(targetX, -40, Math.random() > 0.5 ? '💰' : '💵', {
                fontSize: `${Math.round(28 * this.entityScale)}px`,
              })
              .setOrigin(0.5)
              .setDepth(28);

            this.tweens.add({
              targets: bill,
              y: targetY,
              duration: 380,
              ease: 'Quad.easeIn',
              onComplete: () => {
                bill.destroy();
                audioSystem.playCoinCollect();

                // Golden Coin explosion at impact
                this.spawnExplosion(targetX, targetY, true);

                // Floating +$$ text
                const plusCash = this.add
                  .text(targetX, targetY, '+CUAN!', {
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontStyle: '900',
                    color: '#FDE047',
                    stroke: '#0F172A',
                    strokeThickness: 3,
                  })
                  .setOrigin(0.5)
                  .setDepth(30);

                this.tweens.add({
                  targets: plusCash,
                  y: targetY - 45,
                  alpha: 0,
                  duration: 420,
                  onComplete: () => plusCash.destroy(),
                });

                // Damage enemies in cuan impact zone
                for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
                  const en = this.enemies[ei];
                  if (Phaser.Math.Distance.Between(targetX, targetY, en.sprite.x, en.sprite.y) < 110) {
                    this.damageEnemy(ei, baseDamage * 0.42, '#EAB308');
                  }
                }
              },
            });
          });
        }

        // 4 Piercing Kripto Lasers fired forward in fan spread
        const laserAngles = [-0.15, -0.05, 0.05, 0.15];
        laserAngles.forEach((angle) => {
          const lSprite = this.add
            .sprite(this.playerSprite.x, this.playerSprite.y - 30, 'proj-laser-beam')
            .setDepth(24)
            .setTint(0xfacc15)
            .setScale(1.2 * this.entityScale);

          this.projectiles.push({
            sprite: lSprite,
            vx: Math.sin(angle) * 1100,
            vy: -Math.cos(angle) * 1100,
            damage: baseDamage * 0.45,
            isRocket: false,
            aoeRadius: 40,
            pierce: 99,
            lifeMs: 1500,
          });
        });

        // Magnetize all collectibles straight to player
        for (const item of this.collectibles) {
          this.tweens.add({
            targets: item.sprite,
            x: this.playerSprite.x,
            y: this.playerSprite.y,
            duration: 350,
          });
        }

        if (this.activeBoss) {
          this.damageBoss(baseDamage * 1.5, '#EAB308');
        }
        break;
      }

      case 'police-car': {
        // =====================================================================
        // ULTIMATE: RAZIA GABUNGAN & SIRENE STROBO (Freeze All + Water Cannon Truck!)
        // =====================================================================
        this.nitroTimer = 4000;
        this.invulnTimer = Math.max(this.invulnTimer, 4000);

        // Rapid Alternating Full-Screen Red & Blue Strobe Flash
        for (let s = 0; s < 6; s++) {
          this.time.delayedCall(s * 110, () => {
            if (this.isGameOver) return;
            const flashColor = s % 2 === 0 ? 0xef4444 : 0x38bdf8;
            const flash = this.add
              .rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, flashColor, 0.22)
              .setDepth(34);
            this.tweens.add({
              targets: flash,
              alpha: 0,
              duration: 95,
              onComplete: () => flash.destroy(),
            });
          });
        }

        // Freeze all enemies in place with handcuffs / warning icon
        for (const en of this.enemies) {
          en.slowTimer = 3500;
          en.vx = 0;

          const badge = this.add
            .text(en.sprite.x, en.sprite.y - 32, '🚨 RAZIA!', {
              fontFamily: 'Outfit, sans-serif',
              fontSize: '11px',
              fontStyle: '900',
              color: '#38BDF8',
              stroke: '#0F172A',
              strokeThickness: 3,
            })
            .setOrigin(0.5)
            .setDepth(29);

          this.tweens.add({
            targets: badge,
            y: badge.y - 35,
            alpha: 0,
            duration: 1100,
            onComplete: () => badge.destroy(),
          });
        }

        // Deploy Heavy Police Water Cannon Truck charging up the highway
        const truckX = (this.roadLeft + this.roadRight) / 2;
        const waterTruck = this.add
          .sprite(truckX, this.scale.height + 100, 'enemy-polisi-lalu-lintas')
          .setDepth(26)
          .setAngle(180) // Rotate to face UP
          .setDisplaySize(90 * this.entityScale, 140 * this.entityScale);

        const waterGfx = this.add.graphics().setDepth(27);

        this.tweens.add({
          targets: waterTruck,
          y: -180,
          duration: 2600,
          ease: 'Sine.easeInOut',
          onUpdate: () => {
            waterGfx.clear();
            // Draw dual high-pressure water jets spraying left and right
            waterGfx.lineStyle(16 * this.entityScale, 0x38bdf8, 0.6);
            waterGfx.beginPath();
            waterGfx.moveTo(waterTruck.x - 25, waterTruck.y - 40);
            waterGfx.lineTo(this.roadLeft + 20, waterTruck.y - 200);
            waterGfx.moveTo(waterTruck.x + 25, waterTruck.y - 40);
            waterGfx.lineTo(this.roadRight - 20, waterTruck.y - 200);
            waterGfx.strokePath();

            // Clear obstacles
            for (let oi = this.obstacles.length - 1; oi >= 0; oi--) {
              const obs = this.obstacles[oi];
              if (
                Math.abs(waterTruck.y - obs.sprite.y) < 70 &&
                Math.abs(waterTruck.x - obs.sprite.x) < this.roadWidth / 2
              ) {
                this.spawnExplosion(obs.sprite.x, obs.sprite.y, false);
                obs.sprite.destroy();
                this.obstacles.splice(oi, 1);
              }
            }

            // Flush enemies away with water jets
            for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
              const en = this.enemies[ei];
              if (
                Math.abs(waterTruck.y - en.sprite.y) < 80 &&
                Math.abs(waterTruck.x - en.sprite.x) < this.roadWidth / 2
              ) {
                en.sprite.y -= 70;
                this.damageEnemy(ei, baseDamage * 0.45, '#38BDF8');
              }
            }
          },
          onComplete: () => {
            waterGfx.destroy();
            waterTruck.destroy();
          },
        });

        if (this.activeBoss) {
          this.damageBoss(baseDamage * 1.45, '#1E40AF');
        }
        break;
      }
    }
  }

  private showUltimateCutInBanner(skillTitle: string, accentHex: string): void {
    const cx = this.scale.width / 2;
    const cy = Math.max(105, this.scale.height * 0.2);
    const accentColor = Phaser.Display.Color.HexStringToColor(accentHex).color;

    const container = this.add.container(cx, cy).setDepth(45);

    const bgBar = this.add.graphics();
    bgBar.fillStyle(0x090f1d, 0.92);
    bgBar.lineStyle(3, accentColor, 1);
    bgBar.fillRoundedRect(-210, -28, 420, 56, 12);
    bgBar.strokeRoundedRect(-210, -28, 420, 56, 12);

    const subTxt = this.add
      .text(0, -13, '⚡ ULTIMATE SKILL AKTIF ⚡', {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '11px',
        fontStyle: '900',
        color: '#FACC15',
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    const mainTxt = this.add
      .text(0, 8, skillTitle, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '18px',
        fontStyle: '900 italic',
        color: '#FFFFFF',
        stroke: '#0F172A',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    container.add([bgBar, subTxt, mainTxt]);
    container.setScale(0.4);
    container.setAlpha(0);

    this.tweens.add({
      targets: container,
      scale: 1,
      alpha: 1,
      duration: 220,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: container,
          y: cy - 30,
          alpha: 0,
          delay: 1150,
          duration: 320,
          ease: 'Cubic.easeIn',
          onComplete: () => container.destroy(),
        });
      },
    });
  }

  private isPositionClear(x: number, y: number, minXDist = 68, minYDist = 175): boolean {
    for (const e of this.enemies) {
      if (
        Math.abs(e.sprite.x - x) < minXDist * this.entityScale &&
        Math.abs(e.sprite.y - y) < minYDist * this.entityScale
      ) {
        return false;
      }
    }
    for (const obs of this.obstacles) {
      if (
        Math.abs(obs.sprite.x - x) < minXDist * this.entityScale &&
        Math.abs(obs.sprite.y - y) < minYDist * this.entityScale
      ) {
        return false;
      }
    }
    if (
      this.activeBoss &&
      Math.abs(this.activeBoss.sprite.x - x) < 130 * this.entityScale &&
      Math.abs(this.activeBoss.sprite.y - y) < 200 * this.entityScale
    ) {
      return false;
    }
    return true;
  }

  private pickClearLaneX(spawnY: number): number | null {
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    for (const idx of indices) {
      const laneX = this.laneCenters[idx];
      if (this.isPositionClear(laneX, spawnY, 64, 185)) {
        return laneX;
      }
    }
    return null;
  }

  private updateSpawners(deltaMs: number): void {
    // Scale spawn rate with survival time
    const spawnIntervalMs = Math.max(480, 1450 - this.survivalTimeSec * 4.0);
    this.enemySpawnTimer += deltaMs;

    if (this.enemySpawnTimer >= spawnIntervalMs && this.enemies.length < 16) {
      this.enemySpawnTimer = 0;
      this.spawnRandomEnemy();
    }

    // Spawn occasional road barriers / traffic cones in a clear lane
    this.obstacleSpawnTimer += deltaMs;
    if (this.obstacleSpawnTimer >= 3600 && this.obstacles.length < 5) {
      this.obstacleSpawnTimer = 0;
      const isBarrier = Math.random() < 0.45;
      const clearLaneX = this.pickClearLaneX(-60);
      if (clearLaneX !== null) {
        this.spawnObstacle(clearLaneX, -60, isBarrier ? 'barrier' : 'cone');
      }
    }
  }

  private spawnObstacle(x: number, y: number, kind: 'barrier' | 'cone'): void {
    if (!this.isPositionClear(x, y, 52, 95)) return;

    const dispW = Math.round((kind === 'barrier' ? 84 : 36) * this.entityScale);
    const dispH = Math.round((kind === 'barrier' ? 46 : 48) * this.entityScale);
    const sprite = this.add
      .sprite(x, y, kind === 'barrier' ? 'obstacle-barrier' : 'obstacle-cone')
      .setDepth(11)
      .setDisplaySize(dispW, dispH);

    if (kind === 'barrier') {
      sprite.setAngle((Math.random() - 0.5) * 14);
    }

    this.obstacles.push({
      sprite,
      hp: kind === 'barrier' ? 45 : 18,
      damage: kind === 'barrier' ? 16 : 8,
      width: dispW,
      height: dispH,
    });
  }

  private spawnRandomEnemy(
    forcedType?: EnemyArchetype,
    customX?: number,
    customY?: number
  ): void {
    const t = this.survivalTimeSec;
    let archetype: EnemyArchetype = 'angkot-chaos';

    if (forcedType) {
      archetype = forcedType;
    } else {
      const roll = Math.random();
      if (t < 20) {
        archetype = roll < 0.65 ? 'angkot-chaos' : 'lawan-arah';
      } else if (t < 45) {
        if (roll < 0.38) archetype = 'angkot-chaos';
        else if (roll < 0.68) archetype = 'lawan-arah';
        else archetype = 'proyek-jalan';
      } else {
        if (roll < 0.25) archetype = 'angkot-chaos';
        else if (roll < 0.48) archetype = 'lawan-arah';
        else if (roll < 0.68) archetype = 'proyek-jalan';
        else if (roll < 0.85) archetype = 'polisi-lalu-lintas';
        else archetype = 'truk-odol';
      }
    }

    const spawnY = customY ?? -100;
    let spawnX: number;
    if (customX !== undefined) {
      spawnX = customX;
    } else {
      const clearX = this.pickClearLaneX(spawnY);
      if (clearX === null) return; // Skip spawn if all lanes are busy at top
      spawnX = clearX + (Math.random() - 0.5) * 10 * this.entityScale;
    }

    const cfg = ENEMY_ARCHETYPES[archetype];
    const hpScale = 1 + this.survivalTimeSec * 0.015 + (this.waveNumber - 1) * 0.18;
    const maxHp = Math.round(cfg.baseHp * hpScale);

    const enemyDisplayDims: Record<EnemyArchetype, [number, number]> = {
      'angkot-chaos': [68, 102],
      'lawan-arah': [46, 86],
      'truk-odol': [84, 166],
      'proyek-jalan': [68, 102],
      'polisi-lalu-lintas': [68, 102],
    };
    const [baseEw, baseEh] = enemyDisplayDims[archetype];
    const ew = Math.round(baseEw * this.entityScale);
    const eh = Math.round(baseEh * this.entityScale);

    const sprite = this.add
      .sprite(spawnX, spawnY, `enemy-${archetype}`)
      .setDepth(15)
      .setDisplaySize(ew, eh);

    const halfH = eh / 2;
    const barY = spawnY - halfH - 10;

    const hpBarBg = this.add
      .rectangle(spawnX, barY, 44, 6, 0x0f172a, 0.85)
      .setStrokeStyle(1, 0x475569)
      .setDepth(23);

    const hpBarFill = this.add
      .rectangle(spawnX - 21, barY, 42, 4, 0xef4444, 1)
      .setOrigin(0, 0.5)
      .setDepth(24);

    let label: Phaser.GameObjects.Text | undefined;
    let labelBg: Phaser.GameObjects.Rectangle | undefined;
    let bracketGraphics: Phaser.GameObjects.Graphics | undefined;

    // Show callout bracket on at most 1 featured Angkot Chaos on screen at a time so labels never overlap
    const hasExistingCallout = this.enemies.some((existing) => Boolean(existing.label));
    if (
      archetype === 'angkot-chaos' &&
      !hasExistingCallout &&
      (forcedType === 'angkot-chaos' || Math.random() < 0.65)
    ) {
      labelBg = this.add
        .rectangle(spawnX, barY - 22, 68, 26, 0x0f172a, 0.82)
        .setStrokeStyle(1, 0xef4444, 0.85)
        .setDepth(23);

      label = this.add
        .text(spawnX, barY - 22, cfg.badgeText, {
          fontFamily: 'Outfit, sans-serif',
          fontSize: '10px',
          fontStyle: 'bold',
          color: '#FFFFFF',
          stroke: '#090D16',
          strokeThickness: 2,
          align: 'center',
        })
        .setOrigin(0.5)
        .setDepth(24);
      bracketGraphics = this.add.graphics().setDepth(16);
    }

    this.enemies.push({
      sprite,
      hpBarBg,
      hpBarFill,
      label,
      labelBg,
      bracketGraphics,
      archetype,
      hp: maxHp,
      maxHp,
      speed: cfg.baseSpeed * (1 + Math.min(0.45, this.survivalTimeSec * 0.002)),
      vx: 0,
      contactDamage: cfg.contactDamage,
      xpValue: cfg.xpValue,
      coinChance: cfg.coinChance,
      coinValue: cfg.coinValue,
      scoreValue: cfg.scoreValue,
      aiTimer: 0,
      aiState: 'cruise',
      slowTimer: 0,
      hitFlashTimer: 0,
    });
  }

  private updateObstacles(dt: number): void {
    const h = this.scale.height;
    const dy = this.scrollSpeed * dt;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.sprite.y += dy;

      // Check collision with player
      if (
        Math.abs(obs.sprite.x - this.playerSprite.x) < (obs.width + 32) / 2 &&
        Math.abs(obs.sprite.y - this.playerSprite.y) < (obs.height + 52) / 2
      ) {
        this.damagePlayer(obs.damage);
        this.spawnExplosion(obs.sprite.x, obs.sprite.y, false);
        obs.sprite.destroy();
        this.obstacles.splice(i, 1);
        continue;
      }

      if (obs.sprite.y > h + 80) {
        obs.sprite.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  private updateOilTraps(deltaMs: number): void {
    const dt = deltaMs / 1000;
    for (let i = this.oilTraps.length - 1; i >= 0; i--) {
      const trap = this.oilTraps[i];
      trap.lifeMs -= deltaMs;
      trap.tickTimer += deltaMs;
      trap.sprite.y += this.scrollSpeed * 0.45 * dt;

      if (trap.tickTimer >= 350) {
        trap.tickTimer = 0;
        for (let eIdx = this.enemies.length - 1; eIdx >= 0; eIdx--) {
          const enemy = this.enemies[eIdx];
          const d = Phaser.Math.Distance.Between(
            trap.sprite.x,
            trap.sprite.y,
            enemy.sprite.x,
            enemy.sprite.y
          );
          if (d <= trap.radius + 22) {
            enemy.slowTimer = 600;
            this.damageEnemy(eIdx, trap.dps * 0.35, trap.isBurning ? '#F97316' : '#FACC15');
          }
        }
      }

      if (trap.lifeMs <= 0 || trap.sprite.y > this.scale.height + 80) {
        trap.sprite.destroy();
        this.oilTraps.splice(i, 1);
      }
    }
  }

  private updateEnemies(dt: number, deltaMs: number): void {
    const h = this.scale.height;
    const px = this.playerSprite.x;
    const py = this.playerSprite.y;

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.aiTimer += deltaMs;

      if (e.hitFlashTimer > 0) {
        e.hitFlashTimer -= deltaMs;
        if (e.hitFlashTimer <= 0) e.sprite.clearTint();
      }

      let slowFactor = 1.0;
      if (e.slowTimer > 0) {
        e.slowTimer -= deltaMs;
        slowFactor = 0.5;
      }

      // Unique Archetype Behaviors
      switch (e.archetype) {
        case 'angkot-chaos': {
          // Suddenly swerves lanes or brakes unpredictably ("ngetem mendadak")
          if (e.aiTimer >= 1200) {
            e.aiTimer = 0;
            const r = Math.random();
            if (r < 0.3) {
              e.aiState = 'brake';
              e.vx = 0;
            } else if (r < 0.65) {
              e.aiState = 'swerve';
              e.vx = (Math.random() < 0.5 ? -1 : 1) * 115;
            } else {
              e.aiState = 'cruise';
              e.vx = 0;
            }
          }
          const vy = e.aiState === 'brake' ? e.speed * 0.35 : e.speed;
          e.sprite.y += vy * slowFactor * dt;
          e.sprite.x += e.vx * slowFactor * dt;
          e.sprite.angle = Phaser.Math.Clamp(e.vx * 0.07, -12, 12);
          break;
        }

        case 'lawan-arah': {
          // Charges straight down AGAINST traffic at high closing speed
          // Road scrolls down at this.scrollSpeed, and Lawan Arah drives south into traffic at e.speed,
          // so relative to camera its speed is (this.scrollSpeed + e.speed) * slowFactor!
          const steer = Phaser.Math.Clamp((px - e.sprite.x) * 0.55, -95, 95);
          e.sprite.x += (steer + e.vx) * slowFactor * dt;
          e.vx = Phaser.Math.Linear(e.vx, 0, 0.08);
          e.sprite.angle = Phaser.Math.Clamp((steer + e.vx) * 0.08, -14, 14);

          const vy = (this.scrollSpeed + e.speed) * slowFactor;
          e.sprite.y += vy * dt;
          break;
        }

        case 'truk-odol': {
          // Heavy truck moving steadily and dropping cargo hazards behind it
          e.sprite.y += e.speed * slowFactor * dt;
          if (e.aiTimer >= 3200) {
            e.aiTimer = 0;
            this.spawnObstacle(
              e.sprite.x,
              e.sprite.y - e.sprite.displayHeight / 2 - 36,
              'cone'
            );
          }
          break;
        }

        case 'proyek-jalan': {
          // Deploys striped road barriers behind it as it drives
          e.sprite.y += e.speed * slowFactor * dt;
          if (e.aiTimer >= 3400) {
            e.aiTimer = 0;
            this.spawnObstacle(
              e.sprite.x,
              e.sprite.y - e.sprite.displayHeight / 2 - 38,
              'barrier'
            );
          }
          break;
        }

        case 'polisi-lalu-lintas': {
          // Pursues player horizontally and fires slowing siren pulses
          const dx = px - e.sprite.x;
          e.vx = Phaser.Math.Clamp(dx * 1.2, -120, 120);
          e.sprite.x += e.vx * slowFactor * dt;
          e.sprite.y += e.speed * slowFactor * dt;
          if (e.aiTimer >= 2400 && e.sprite.y > 40 && e.sprite.y < py) {
            e.aiTimer = 0;
            this.fireEnemyOrb(e.sprite.x, e.sprite.y + 38, px, py, 270, 12);
          }
          break;
        }
      }

      // Anti-overlap separation against other enemies & obstacles on the road
      const halfW = e.sprite.displayWidth / 2;
      const halfH = e.sprite.displayHeight / 2;

      for (let j = 0; j < this.enemies.length; j++) {
        if (i === j) continue;
        const other = this.enemies[j];
        const minSepX = (e.sprite.displayWidth + other.sprite.displayWidth) * 0.52;
        const minSepY = (e.sprite.displayHeight + other.sprite.displayHeight) * 0.54;
        const dx = e.sprite.x - other.sprite.x;
        const dy = e.sprite.y - other.sprite.y;

        if (Math.abs(dx) < minSepX && Math.abs(dy) < minSepY) {
          // Separate horizontally first if side-by-side, or keep trailing vehicle behind
          if (Math.abs(dx) > 12) {
            const pushX = (dx > 0 ? 1 : -1) * (minSepX - Math.abs(dx)) * 0.5;
            e.sprite.x += pushX;
            other.sprite.x -= pushX;
          } else {
            if (e.sprite.y < other.sprite.y) {
              e.sprite.y = other.sprite.y - minSepY;
            } else {
              other.sprite.y = e.sprite.y - minSepY;
            }
          }
        }
      }

      for (const obs of this.obstacles) {
        const minSepX = halfW + obs.width * 0.55;
        const minSepY = halfH + obs.height * 0.55;
        const dx = e.sprite.x - obs.sprite.x;
        const dy = e.sprite.y - obs.sprite.y;
        if (Math.abs(dx) < minSepX && Math.abs(dy) < minSepY) {
          const pushDir =
            dx !== 0 ? Math.sign(dx) : e.sprite.x > (this.roadLeft + this.roadRight) / 2 ? -1 : 1;
          e.sprite.x = obs.sprite.x + pushDir * minSepX;
        }
      }

      // Clamp to road boundaries
      e.sprite.x = Phaser.Math.Clamp(
        e.sprite.x,
        this.roadLeft + halfW + 4,
        this.roadRight - halfW - 4
      );

      // Update enemy HP bar & target bracket positions outside actual sprite bounds
      const cfg = ENEMY_ARCHETYPES[e.archetype];
      const barY = e.sprite.y - halfH - 10;
      e.hpBarBg.setPosition(e.sprite.x, barY);
      e.hpBarFill.setPosition(e.sprite.x - 21, barY);
      e.hpBarFill.width = Math.max(0, 42 * (e.hp / e.maxHp));

      if (e.labelBg) {
        e.labelBg.setPosition(e.sprite.x, barY - 22);
      }
      if (e.label) {
        e.label.setPosition(e.sprite.x, barY - 22);
      }
      if (e.bracketGraphics) {
        e.bracketGraphics.clear();
        e.bracketGraphics.lineStyle(2.5, 0xef4444, 0.95);
        const bw = halfW + 6;
        const bh = halfH + 6;
        const ex = e.sprite.x;
        const ey = e.sprite.y;
        const cornerLen = 11;

        // 4 Red Target Corner Brackets framing outside the Angkot sprite
        e.bracketGraphics.beginPath();
        // Top-Left corner
        e.bracketGraphics.moveTo(ex - bw, ey - bh + cornerLen);
        e.bracketGraphics.lineTo(ex - bw, ey - bh);
        e.bracketGraphics.lineTo(ex - bw + cornerLen, ey - bh);
        // Top-Right corner
        e.bracketGraphics.moveTo(ex + bw - cornerLen, ey - bh);
        e.bracketGraphics.lineTo(ex + bw, ey - bh);
        e.bracketGraphics.lineTo(ex + bw, ey - bh + cornerLen);
        // Bottom-Left corner
        e.bracketGraphics.moveTo(ex - bw, ey + bh - cornerLen);
        e.bracketGraphics.lineTo(ex - bw, ey + bh);
        e.bracketGraphics.lineTo(ex - bw + cornerLen, ey + bh);
        // Bottom-Right corner
        e.bracketGraphics.moveTo(ex + bw - cornerLen, ey + bh);
        e.bracketGraphics.lineTo(ex + bw, ey + bh);
        e.bracketGraphics.lineTo(ex + bw, ey + bh - cornerLen);
        e.bracketGraphics.strokePath();
      }

      // Check collision with player
      const hitDist = (e.sprite.displayWidth + this.vehicleConfig.stats.hitboxRadius * 2) * 0.42;
      if (Phaser.Math.Distance.Between(px, py, e.sprite.x, e.sprite.y) < hitDist) {
        this.damagePlayer(e.contactDamage);
        this.damageEnemy(i, 35, '#FACC15');
        continue;
      }

      // Despawn if off bottom of screen
      if (e.sprite.y > h + 130) {
        this.destroyEnemyObjects(e);
        this.enemies.splice(i, 1);
      }
    }
  }

  private triggerBossEncounter(bossCfg: BossConfig): void {
    audioSystem.playBossWarning();
    useGameStore.getState().setWarningBanner(`PERINGATAN BOS: ${bossCfg.name}!`);

    this.time.delayedCall(2600, () => {
      useGameStore.getState().setWarningBanner(null);
    });

    const bossDims: Record<string, [number, number]> = {
      'raja-odol': [210, 256],
      'kontraktor-abadi': [215, 250],
      'raja-lawan-arah': [116, 210],
      'sultan-busway': [235, 290],
      'derek-siluman': [190, 245],
      'patwal-vip': [200, 240],
    };
    const [baseW, baseH] = bossDims[bossCfg.id] || [200, 240];
    const dispW = Math.round(baseW * this.entityScale);
    const dispH = Math.round(baseH * this.entityScale);

    const startX = (this.roadLeft + this.roadRight) / 2;
    const sprite = this.add
      .sprite(startX, -160, `boss-${bossCfg.id}`)
      .setDepth(17)
      .setDisplaySize(dispW, dispH);

    const scaledHp = Math.round(bossCfg.baseHp * (1 + (this.waveNumber - 1) * 0.15));

    this.activeBoss = {
      config: bossCfg,
      sprite,
      hp: scaledHp,
      maxHp: scaledHp,
      phase: 1,
      attackTimer: 0,
      moveAngle: 0,
      chargeState: 'idle',
      chargeTimer: 0,
      targetX: startX,
    };

    // Dramatic entrance tween into top of road arena
    this.tweens.add({
      targets: sprite,
      y: 165,
      duration: 1600,
      ease: 'Cubic.easeOut',
    });
  }

  private updateBoss(dt: number, deltaMs: number): void {
    if (!this.activeBoss) return;
    const boss = this.activeBoss;
    const px = this.playerSprite.x;
    const py = this.playerSprite.y;

    boss.phase = boss.hp < boss.maxHp * 0.5 ? 2 : 1;
    boss.attackTimer += deltaMs;
    boss.moveAngle += dt * (boss.phase === 2 ? 2.2 : 1.4);

    // Boss Movement & Charge State Machine
    if (boss.chargeState === 'idle') {
      const centerX = (this.roadLeft + this.roadRight) / 2;
      const swayAmp = this.roadWidth * 0.34;
      boss.sprite.x = Phaser.Math.Linear(
        boss.sprite.x,
        centerX + Math.sin(boss.moveAngle) * swayAmp,
        0.08
      );
      boss.sprite.y = Phaser.Math.Linear(boss.sprite.y, 165, 0.06);

      // Periodic Boss Signature Attacks
      const fireInterval = boss.phase === 2 ? 1500 : 2000;
      if (boss.attackTimer >= fireInterval && boss.sprite.y > 100) {
        boss.attackTimer = 0;
        const patternRoll = Math.random();

        if (patternRoll < 0.72) {
          this.executeBossUniqueAttack(boss, px, py);
        } else {
          // Initiate Lane Charge Telegraph
          boss.chargeState = 'telegraph';
          boss.chargeTimer = 950;
          boss.targetX = Phaser.Math.Clamp(
            px,
            this.roadLeft + 65,
            this.roadRight - 65
          );
        }
      }
    } else if (boss.chargeState === 'telegraph') {
      boss.chargeTimer -= deltaMs;
      boss.sprite.x = Phaser.Math.Linear(boss.sprite.x, boss.targetX, 0.14);

      // Draw danger telegraph lane zone
      this.fxGraphics.fillStyle(0xef4444, 0.22);
      this.fxGraphics.fillRect(
        boss.sprite.x - 58,
        boss.sprite.y,
        116,
        this.scale.height
      );
      this.fxGraphics.lineStyle(2, 0xef4444, 0.8);
      this.fxGraphics.strokeRect(
        boss.sprite.x - 58,
        boss.sprite.y,
        116,
        this.scale.height
      );

      if (boss.chargeTimer <= 0) {
        boss.chargeState = 'charging';
        boss.chargeTimer = 850;
        audioSystem.playKlakson();
      }
    } else if (boss.chargeState === 'charging') {
      boss.chargeTimer -= deltaMs;
      const chargeVy = this.scrollSpeed + (boss.config.id === 'raja-lawan-arah' ? 520 : 380);
      boss.sprite.y += chargeVy * dt;
      if (boss.chargeTimer <= 0 || boss.sprite.y > this.scale.height - 140) {
        boss.chargeState = 'recover';
        boss.chargeTimer = 1100;
        if (boss.config.id === 'kontraktor-abadi') {
          this.spawnObstacle(boss.sprite.x - 50, boss.sprite.y - 60, 'barrier');
          this.spawnObstacle(boss.sprite.x + 50, boss.sprite.y - 60, 'barrier');
        } else if (boss.config.id === 'raja-lawan-arah') {
          this.spawnRandomEnemy('lawan-arah', this.roadLeft + 60);
          this.spawnRandomEnemy('lawan-arah', this.roadRight - 60);
        } else if (boss.config.id === 'sultan-busway') {
          this.spawnObstacle((this.roadLeft + this.roadRight) / 2, boss.sprite.y - 50, 'barrier');
        } else if (boss.config.id === 'derek-siluman') {
          this.spawnObstacle(boss.sprite.x, boss.sprite.y - 50, 'cone');
        } else if (boss.config.id === 'patwal-vip') {
          this.spawnRandomEnemy('polisi-lalu-lintas', this.roadLeft + 70);
          this.spawnRandomEnemy('polisi-lalu-lintas', this.roadRight - 70);
        }
      }
    } else if (boss.chargeState === 'recover') {
      boss.chargeTimer -= deltaMs;
      boss.sprite.y = Phaser.Math.Linear(boss.sprite.y, 165, 0.08);
      if (boss.chargeTimer <= 0) {
        boss.chargeState = 'idle';
      }
    }

    // Check Boss Collision with Player
    if (
      Math.abs(px - boss.sprite.x) < (boss.config.width + 36) * 0.45 &&
      Math.abs(py - boss.sprite.y) < (boss.config.height + 54) * 0.45
    ) {
      this.damagePlayer(boss.config.contactDamage);
    }
  }

  private executeBossUniqueAttack(boss: ActiveBoss, px: number, py: number): void {
    const bx = boss.sprite.x;
    const by = boss.sprite.y + 65;
    const isPhase2 = boss.phase === 2;

    switch (boss.config.id) {
      case 'raja-odol': {
        // Tumpahkan Kargo Muatan Berat & Peluru Asap Diesel
        audioSystem.playExplosion(false);
        const crateLanes = [this.roadLeft + 80, (this.roadLeft + this.roadRight) / 2, this.roadRight - 80];
        crateLanes.forEach((laneX, i) => {
          this.time.delayedCall(i * 180, () => {
            if (!this.activeBoss) return;
            const sp = this.add.sprite(laneX, by, 'proj-boss-cargo-crate').setDepth(16);
            this.enemyProjectiles.push({
              sprite: sp,
              vx: (Math.random() - 0.5) * 40,
              vy: this.scrollSpeed + 180,
              damage: 22,
              lifeMs: 3800,
            });
          });
        });
        const rays = isPhase2 ? 7 : 5;
        for (let r = 0; r < rays; r++) {
          const angle = Math.PI * 0.25 + (r / (rays - 1)) * (Math.PI * 0.5);
          this.fireEnemyOrbAngle(bx, by, angle, 220, 16);
        }
        break;
      }

      case 'kontraktor-abadi': {
        // Mortir Aspal Panas Berapi & Barikade
        audioSystem.playShoot();
        const targets = [px - 70, px, px + 70];
        targets.forEach((tx, idx) => {
          this.time.delayedCall(idx * 200, () => {
            if (!this.activeBoss) return;
            const clampedX = Phaser.Math.Clamp(tx, this.roadLeft + 40, this.roadRight - 40);
            const sp = this.add.sprite(bx, by, 'proj-boss-hot-asphalt').setDepth(16);
            const angle = Phaser.Math.Angle.Between(bx, by, clampedX, py);
            this.enemyProjectiles.push({
              sprite: sp,
              vx: Math.cos(angle) * 310,
              vy: Math.sin(angle) * 310,
              damage: 24,
              lifeMs: 2500,
            });
          });
        });
        if (Math.random() < 0.6) {
          this.spawnObstacle(bx + (Math.random() - 0.5) * 80, by + 40, 'barrier');
        }
        break;
      }

      case 'raja-lawan-arah': {
        // Tembakan Spiral Shuriken Knalpot & Panggil Geng Motor
        audioSystem.playRocketLaunch();
        const spiralCount = isPhase2 ? 14 : 10;
        for (let s = 0; s < spiralCount; s++) {
          this.time.delayedCall(s * 85, () => {
            if (!this.activeBoss) return;
            const angle = Math.PI * 0.15 + ((s * 0.26) % (Math.PI * 0.7));
            this.fireEnemyOrbAngle(bx, by, angle, 320, 18);
          });
        }
        if (this.enemies.length < 5) {
          this.spawnRandomEnemy('lawan-arah', bx + (Math.random() < 0.5 ? -70 : 70));
        }
        break;
      }

      case 'sultan-busway': {
        // Klakson Telolet Basuri 130dB: Gelombang ultrasonik raksasa yang mendorong pemain
        audioSystem.playKlakson();
        useGameStore.getState().setWarningBanner('🔊 KLAKSON TELOLET BASURI 130dB! 🔊');
        this.time.delayedCall(1600, () => useGameStore.getState().setWarningBanner(null));

        const waveCount = isPhase2 ? 3 : 2;
        for (let w = 0; w < waveCount; w++) {
          this.time.delayedCall(w * 350, () => {
            if (!this.activeBoss) return;
            const waveSprite = this.add
              .sprite(bx, by + 20, 'proj-boss-busway-telolet')
              .setDepth(18)
              .setScale(1.4 * this.entityScale);

            this.enemyProjectiles.push({
              sprite: waveSprite,
              vx: 0,
              vy: 380,
              damage: 28,
              lifeMs: 2800,
            });
          });
        }
        const leftDividerX = (this.roadLeft + (this.roadLeft + this.roadRight) / 2) / 2;
        this.spawnObstacle(leftDividerX, by + 60, 'barrier');
        break;
      }

      case 'derek-siluman': {
        // Harpoon Winch Cable Hook penarik magnetik
        audioSystem.playRocketLaunch();
        const hookSprite = this.add
          .sprite(bx, by, 'proj-boss-derek-hook')
          .setDepth(17)
          .setScale(1.2 * this.entityScale);

        const hookAngle = Phaser.Math.Angle.Between(bx, by, px, py);
        this.enemyProjectiles.push({
          sprite: hookSprite,
          vx: Math.cos(hookAngle) * 440,
          vy: Math.sin(hookAngle) * 440,
          damage: 32,
          lifeMs: 2200,
        });

        // Dense diesel smoke puff
        for (let p = 0; p < 4; p++) {
          const puff = this.add
            .circle(bx + (p - 1.5) * 35, by + 40, 28, 0x0f172a, 0.75)
            .setDepth(15);
          this.tweens.add({
            targets: puff,
            scale: 2.2,
            alpha: 0,
            duration: 1800,
            onComplete: () => puff.destroy(),
          });
        }
        break;
      }

      case 'patwal-vip': {
        // Rotating Red & Blue Strobe VIP Lasers
        audioSystem.playShoot();
        const laserCount = isPhase2 ? 8 : 6;
        for (let l = 0; l < laserCount; l++) {
          this.time.delayedCall(l * 120, () => {
            if (!this.activeBoss) return;
            const angle = Math.PI * 0.2 + (l / (laserCount - 1)) * (Math.PI * 0.6);
            const lSprite = this.add
              .sprite(bx, by, 'proj-boss-patwal-laser')
              .setDepth(18)
              .setRotation(angle - Math.PI / 2);

            this.enemyProjectiles.push({
              sprite: lSprite,
              vx: Math.cos(angle) * 460,
              vy: Math.sin(angle) * 460,
              damage: 26,
              lifeMs: 2200,
            });
          });
        }
        break;
      }

      default: {
        const rays = 7;
        for (let r = 0; r < rays; r++) {
          const angle = Math.PI * 0.2 + (r / (rays - 1)) * (Math.PI * 0.6);
          this.fireEnemyOrbAngle(bx, by, angle, 250, 16);
        }
        break;
      }
    }
  }

  private fireEnemyOrb(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    speed: number,
    damage: number
  ): void {
    const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
    this.fireEnemyOrbAngle(startX, startY, angle, speed, damage);
  }

  private fireEnemyOrbAngle(
    startX: number,
    startY: number,
    angle: number,
    speed: number,
    damage: number
  ): void {
    const sprite = this.add
      .sprite(startX, startY, 'proj-boss-orb')
      .setDepth(21);

    this.enemyProjectiles.push({
      sprite,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      damage,
      lifeMs: 4500,
    });
  }

  private updateProjectiles(dt: number, deltaMs: number): void {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.lifeMs -= deltaMs;
      p.sprite.x += p.vx * dt;
      p.sprite.y += p.vy * dt;

      // Rocket vehicle-themed smoke/plasma trail
      if (p.isRocket && Math.random() < 0.45) {
        this.spawnRocketTrailParticle(p.sprite.x, p.sprite.y + 14, p.trailColor ?? 0xf97316);
      }

      let consumed = false;

      // Hit Boss
      if (this.activeBoss) {
        const b = this.activeBoss;
        if (
          Math.abs(p.sprite.x - b.sprite.x) < b.config.width * 0.5 &&
          Math.abs(p.sprite.y - b.sprite.y) < b.config.height * 0.5
        ) {
          if (p.isRocket) {
            this.triggerRocketAoE(p.sprite.x, p.sprite.y, p.aoeRadius, p.damage, p.blastHex);
          } else {
            this.damageBoss(p.damage, '#FACC15');
            this.spawnHitSpark(p.sprite.x, p.sprite.y);
          }
          p.pierce--;
          if (p.pierce <= 0) consumed = true;
        }
      }

      // Hit Regular Enemies
      if (!consumed) {
        for (let eIdx = this.enemies.length - 1; eIdx >= 0; eIdx--) {
          const e = this.enemies[eIdx];
          const cfg = ENEMY_ARCHETYPES[e.archetype];
          if (
            Math.abs(p.sprite.x - e.sprite.x) < cfg.width * 0.55 &&
            Math.abs(p.sprite.y - e.sprite.y) < cfg.height * 0.55
          ) {
            if (p.isRocket) {
              this.triggerRocketAoE(p.sprite.x, p.sprite.y, p.aoeRadius, p.damage, p.blastHex);
            } else {
              this.damageEnemy(eIdx, p.damage, '#FACC15');
              this.spawnHitSpark(p.sprite.x, p.sprite.y);
            }
            p.pierce--;
            if (p.pierce <= 0) {
              consumed = true;
              break;
            }
          }
        }
      }

      // Hit Obstacles
      if (!consumed) {
        for (let oIdx = this.obstacles.length - 1; oIdx >= 0; oIdx--) {
          const obs = this.obstacles[oIdx];
          if (
            Math.abs(p.sprite.x - obs.sprite.x) < obs.width * 0.55 &&
            Math.abs(p.sprite.y - obs.sprite.y) < obs.height * 0.55
          ) {
            obs.hp -= p.damage;
            this.spawnHitSpark(p.sprite.x, p.sprite.y);
            if (obs.hp <= 0) {
              this.spawnExplosion(obs.sprite.x, obs.sprite.y, false);
              this.spawnCollectible(obs.sprite.x, obs.sprite.y, 'xp', 10);
              obs.sprite.destroy();
              this.obstacles.splice(oIdx, 1);
            }
            consumed = true;
            break;
          }
        }
      }

      if (
        consumed ||
        p.lifeMs <= 0 ||
        p.sprite.y < -60 ||
        p.sprite.y > this.scale.height + 60 ||
        p.sprite.x < 0 ||
        p.sprite.x > this.scale.width
      ) {
        p.sprite.destroy();
        this.projectiles.splice(i, 1);
      }
    }
  }

  private triggerRocketAoE(
    x: number,
    y: number,
    radius: number,
    damage: number,
    blastHex = '#F97316'
  ): void {
    this.spawnExplosion(x, y, true);

    const blastColorInt = Phaser.Display.Color.HexStringToColor(blastHex).color;
    const blastCircle = this.add
      .circle(x, y, 16, blastColorInt, 0.45)
      .setStrokeStyle(3, 0xfef08a, 0.9)
      .setDepth(24);

    this.tweens.add({
      targets: blastCircle,
      radius,
      alpha: 0,
      duration: 260,
      onComplete: () => blastCircle.destroy(),
    });

    for (let eIdx = this.enemies.length - 1; eIdx >= 0; eIdx--) {
      const e = this.enemies[eIdx];
      if (Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y) <= radius) {
        if (e.archetype === 'lawan-arah') {
          // Lawan Arah swerves sideways from blast, not pushed backwards
          e.vx += (e.sprite.x > x ? 130 : -130);
          e.slowTimer = Math.max(e.slowTimer, 300);
        }
        this.damageEnemy(eIdx, damage, blastHex);
      }
    }

    if (
      this.activeBoss &&
      Phaser.Math.Distance.Between(
        x,
        y,
        this.activeBoss.sprite.x,
        this.activeBoss.sprite.y
      ) <= radius + 45
    ) {
      this.damageBoss(damage, blastHex);
    }
  }

  private spawnRocketTrailParticle(x: number, y: number, color = 0xf97316): void {
    const p = this.add
      .circle(x + (Math.random() - 0.5) * 6, y, 4, color, 0.8)
      .setDepth(18);
    this.tweens.add({
      targets: p,
      scale: 0.1,
      alpha: 0,
      duration: 200,
      onComplete: () => p.destroy(),
    });
  }

  private updateEnemyProjectiles(dt: number, deltaMs: number): void {
    const px = this.playerSprite.x;
    const py = this.playerSprite.y;

    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];
      ep.lifeMs -= deltaMs;
      ep.sprite.x += ep.vx * dt;
      ep.sprite.y += ep.vy * dt;

      if (
        Phaser.Math.Distance.Between(px, py, ep.sprite.x, ep.sprite.y) <
        this.vehicleConfig.stats.hitboxRadius + 8
      ) {
        this.damagePlayer(ep.damage);
        ep.sprite.destroy();
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (
        ep.lifeMs <= 0 ||
        ep.sprite.y > this.scale.height + 50 ||
        ep.sprite.y < -50 ||
        ep.sprite.x < 0 ||
        ep.sprite.x > this.scale.width
      ) {
        ep.sprite.destroy();
        this.enemyProjectiles.splice(i, 1);
      }
    }
  }

  private damageEnemy(index: number, amount: number, colorHex: string): void {
    const e = this.enemies[index];
    if (!e) return;

    e.hp -= amount;
    e.hitFlashTimer = 90;
    e.sprite.setTint(0xffffff);

    this.spawnDamageNumber(e.sprite.x, e.sprite.y - 20, Math.round(amount), colorHex);

    if (e.hp <= 0) {
      const ex = e.sprite.x;
      const ey = e.sprite.y;
      this.spawnExplosion(ex, ey, e.archetype === 'truk-odol');

      this.score += e.scoreValue;
      this.enemiesDestroyed++;

      // Drop XP Cube
      this.spawnCollectible(ex - 10, ey, 'xp', e.xpValue);

      // Drop Coin
      if (Math.random() < e.coinChance) {
        this.spawnCollectible(ex + 12, ey, 'coin', e.coinValue);
      }

      // Occasional Repair Kit
      if (Math.random() < 0.06) {
        this.spawnCollectible(ex, ey + 12, 'heal', 25);
      }

      this.destroyEnemyObjects(e);
      this.enemies.splice(index, 1);
    }
  }

  private destroyEnemyObjects(e: ActiveEnemy): void {
    e.sprite.destroy();
    e.hpBarBg.destroy();
    e.hpBarFill.destroy();
    e.label?.destroy();
    e.labelBg?.destroy();
    e.bracketGraphics?.destroy();
  }

  private damageBoss(amount: number, colorHex: string): void {
    if (!this.activeBoss) return;
    const b = this.activeBoss;
    b.hp -= amount;

    this.spawnDamageNumber(
      b.sprite.x + (Math.random() - 0.5) * 40,
      b.sprite.y + 20,
      Math.round(amount),
      colorHex
    );

    if (b.hp <= 0) {
      const bx = b.sprite.x;
      const by = b.sprite.y;
      const cfg = b.config;

      // Multi-explosion boss defeat spectacle
      for (let k = 0; k < 6; k++) {
        this.time.delayedCall(k * 110, () => {
          this.spawnExplosion(
            bx + (Math.random() - 0.5) * 90,
            by + (Math.random() - 0.5) * 90,
            true
          );
        });
      }

      this.score += cfg.scoreReward;
      this.bossesDefeated++;

      // Shower of XP and Coins
      for (let c = 0; c < 10; c++) {
        this.spawnCollectible(
          bx + (Math.random() - 0.5) * 90,
          by + (Math.random() - 0.5) * 80,
          'xp',
          Math.round(cfg.xpReward / 10)
        );
        this.spawnCollectible(
          bx + (Math.random() - 0.5) * 90,
          by + (Math.random() - 0.5) * 80,
          'coin',
          Math.round(cfg.coinReward / 10)
        );
      }
      this.spawnCollectible(bx, by, 'heal', 50);

      b.sprite.destroy();
      this.activeBoss = null;
      useGameStore.getState().setActiveBoss(null);
    }
  }

  private spawnCollectible(
    x: number,
    y: number,
    type: 'xp' | 'coin' | 'heal',
    value: number
  ): void {
    const tex =
      type === 'xp' ? 'item-xp' : type === 'coin' ? 'item-coin' : 'item-heal';
    const size = type === 'xp' ? 46 : type === 'coin' ? 28 : 30;
    const sprite = this.add
      .sprite(x, y, tex)
      .setDepth(13)
      .setDisplaySize(size, size);

    this.collectibles.push({
      sprite,
      type,
      value,
      vx: (Math.random() - 0.5) * 60,
      vy: 95,
    });
  }

  private updateCollectibles(dt: number): void {
    const px = this.playerSprite.x;
    const py = this.playerSprite.y;
    const passives = usePlayerStore.getState().passiveLevels;
    const workshop = useProgressionStore.getState().workshopLevels;

    const magnetRadius =
      135 * (1 + (passives['passive-magnet'] ?? 0) * 0.45 + workshop.magnet * 0.15);

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const item = this.collectibles[i];
      const dist = Phaser.Math.Distance.Between(px, py, item.sprite.x, item.sprite.y);

      if (dist <= magnetRadius) {
        const angle = Phaser.Math.Angle.Between(
          item.sprite.x,
          item.sprite.y,
          px,
          py
        );
        const pullSpeed = 480;
        item.sprite.x += Math.cos(angle) * pullSpeed * dt;
        item.sprite.y += Math.sin(angle) * pullSpeed * dt;
      } else {
        item.vx *= 0.92;
        item.sprite.x += item.vx * dt;
        item.sprite.y += item.vy * dt;
      }

      if (dist <= 34) {
        if (item.type === 'xp') {
          audioSystem.playXpCollect();
          this.gainXp(item.value);
        } else if (item.type === 'coin') {
          audioSystem.playCoinCollect();
          this.coinsEarned += item.value;
          this.score += item.value * 5;
        } else if (item.type === 'heal') {
          audioSystem.playCoinCollect();
          this.healPlayer(item.value);
        }

        item.sprite.destroy();
        this.collectibles.splice(i, 1);
        continue;
      }

      if (item.sprite.y > this.scale.height + 70) {
        item.sprite.destroy();
        this.collectibles.splice(i, 1);
      }
    }
  }

  private gainXp(amount: number): void {
    this.xp += amount;
    if (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = Math.round(this.xpToNextLevel * 1.28 + 25);

      const choices = this.generateUpgradeChoices();
      if (choices.length > 0) {
        audioSystem.playLevelUp();
        this.pauseGameplay();
        useGameStore.getState().triggerLevelUpModal(this.level, choices);
      }
    }
  }

  private generateUpgradeChoices(): UpgradeChoiceItem[] {
    const playerState = usePlayerStore.getState();
    const available: UpgradeChoiceItem[] = [];
    const vConfig = this.vehicleConfig;

    for (const rawDef of UPGRADE_DEFINITIONS) {
      const def: UpgradeDefinition =
        rawDef.id === 'weapon-double-shot'
          ? {
              ...rawDef,
              name: vConfig.basicWeaponName,
              description: vConfig.basicWeaponDescription,
              effectText: (lvl: number) => {
                const idx = Math.max(
                  0,
                  Math.min(vConfig.basicLevelDescriptions.length - 1, lvl - 1)
                );
                return `${vConfig.basicLevelDescriptions[idx]}`;
              },
            }
          : rawDef;

      const currentLevel = playerState.getUpgradeLevel(rawDef.id, rawDef.weaponId);
      if (currentLevel < def.maxLevel) {
        available.push({
          definition: def,
          currentLevel,
          nextLevel: currentLevel + 1,
        });
      }
    }

    // Shuffle and pick 3
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }

    return available.slice(0, 3);
  }

  private applyUpgrade(upgrade: UpgradeDefinition): void {
    const playerStore = usePlayerStore.getState();
    playerStore.applyUpgradeToStore(upgrade.id, upgrade.weaponId);

    if (upgrade.id === 'passive-armor') {
      const nextMaxHp = Math.round(this.playerMaxHp * 1.3);
      const healGain = nextMaxHp - this.playerMaxHp + 35;
      this.playerMaxHp = nextMaxHp;
      this.playerHp = Math.min(this.playerMaxHp, this.playerHp + healGain);
      playerStore.setHp(this.playerHp, this.playerMaxHp);
    }

    useGameStore.getState().setModal('NONE');
    this.resumeGameplay();
  }

  private healPlayer(amount: number): void {
    this.playerHp = Math.min(this.playerMaxHp, this.playerHp + amount);
    usePlayerStore.getState().setHp(this.playerHp, this.playerMaxHp);
    this.spawnDamageNumber(
      this.playerSprite.x,
      this.playerSprite.y - 30,
      Math.round(amount),
      '#4ADE80',
      '+'
    );
  }

  private damagePlayer(rawAmount: number): void {
    if (this.invulnTimer > 0 || this.nitroTimer > 0 || this.isGameOver) return;

    const passives = usePlayerStore.getState().passiveLevels;
    const armorBonus = Math.min(0.65, (passives['passive-armor'] ?? 0) * 0.08);
    const totalResist = Math.min(
      0.75,
      this.vehicleConfig.stats.collisionResistance + armorBonus
    );
    const finalDamage = Math.max(1, Math.round(rawAmount * (1 - totalResist)));

    this.playerHp = Math.max(0, this.playerHp - finalDamage);
    this.invulnTimer = 850;
    usePlayerStore.getState().setHp(this.playerHp, this.playerMaxHp);

    audioSystem.playPlayerHit();
    this.spawnDamageNumber(
      this.playerSprite.x,
      this.playerSprite.y - 25,
      finalDamage,
      '#EF4444',
      '-'
    );

    if (useSettingsStore.getState().screenShake) {
      this.cameras.main.shake(180, 0.009);
    }

    if (this.playerHp <= 0) {
      this.handlePlayerDeath();
    }
  }

  private handlePlayerDeath(): void {
    this.isGameOver = true;
    audioSystem.stopMusic();
    audioSystem.playExplosion(true);
    audioSystem.playGameOver();

    this.spawnExplosion(this.playerSprite.x, this.playerSprite.y, true);
    this.playerSprite.setVisible(false);
    this.playerBaseRing.setVisible(false);
    this.headlightCone.setVisible(false);

    // Record persistent stats & coins
    useProgressionStore.getState().recordRunResult({
      score: Math.floor(this.score),
      survivalTimeSec: this.survivalTimeSec,
      enemiesDefeated: this.enemiesDestroyed,
      bossesDefeated: this.bossesDefeated,
      coinsEarned: this.coinsEarned,
    });

    useGameStore.getState().updateTelemetry({
      score: Math.floor(this.score),
      survivalTimeSec: this.survivalTimeSec,
      enemiesDestroyed: this.enemiesDestroyed,
      bossesDefeated: this.bossesDefeated,
      coinsEarned: this.coinsEarned,
    });

    this.time.delayedCall(750, () => {
      useGameStore.getState().triggerGameOverModal();
    });
  }

  private spawnHitSpark(x: number, y: number): void {
    const spark = this.add.circle(x, y, 7, 0xfef08a, 0.9).setDepth(25);
    this.tweens.add({
      targets: spark,
      scale: 2.2,
      alpha: 0,
      duration: 120,
      onComplete: () => spark.destroy(),
    });
  }

  private spawnExplosion(x: number, y: number, isBig: boolean): void {
    audioSystem.playExplosion(isBig);

    if (isBig && useSettingsStore.getState().screenShake) {
      this.cameras.main.shake(210, 0.008);
    }

    const baseRadius = isBig ? 42 : 24;
    const core = this.add.circle(x, y, baseRadius * 0.6, 0xfef08a, 1).setDepth(26);
    const outer = this.add
      .circle(x, y, baseRadius, 0xf97316, 0.85)
      .setStrokeStyle(3, 0xef4444, 0.9)
      .setDepth(25);

    this.tweens.add({
      targets: [core, outer],
      scale: 2.1,
      alpha: 0,
      duration: isBig ? 360 : 240,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        core.destroy();
        outer.destroy();
      },
    });
  }

  private spawnDamageNumber(
    x: number,
    y: number,
    value: number,
    color: string,
    prefix = ''
  ): void {
    if (!useSettingsStore.getState().damageNumbers) return;

    const txt = this.add
      .text(x + (Math.random() - 0.5) * 16, y, `${prefix}${value}`, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color,
        stroke: '#090D16',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(30);

    this.tweens.add({
      targets: txt,
      y: y - 34,
      alpha: 0,
      duration: 520,
      ease: 'Cubic.easeOut',
      onComplete: () => txt.destroy(),
    });
  }
}
