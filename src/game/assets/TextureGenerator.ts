import Phaser from 'phaser';

export function preloadExtractedSprites(scene: Phaser.Scene): void {
  scene.load.image('road-environment', '/assets/extracted/bg_road_seamless.png');

  // Base extracted top-down sprites
  scene.load.image('player-motor-ojol', '/assets/extracted/td_player_ojol.png');
  scene.load.image('player-city-car', '/assets/extracted/td_city_car.png');
  scene.load.image('raw-td-red-car', '/assets/extracted/td_red_car.png');

  // Downward-facing oncoming enemy & boss sprites
  scene.load.image('enemy-angkot-chaos', '/assets/extracted/td_angkot_chaos.png');
  scene.load.image('enemy-lawan-arah', '/assets/extracted/td_lawan_arah.png');
  scene.load.image('enemy-truk-odol', '/assets/extracted/td_truk_odol.png');
  scene.load.image('boss-raja-odol', '/assets/extracted/td_boss_raja_odol.png');
  scene.load.image('boss-raja-lawan-arah', '/assets/extracted/td_lawan_arah.png');

  // Obstacles & XP Cube
  scene.load.image('obstacle-barrier', '/assets/extracted/td_barrier.png');
  scene.load.image('obstacle-cone', '/assets/extracted/td_cone.png');
  scene.load.image('item-xp', '/assets/extracted/td_xp_cube.png');
}

export function generateAllGameTextures(scene: Phaser.Scene): void {
  if (scene.textures.exists('proj-bullet')) return;

  const cityCarImg = scene.textures.get('player-city-car').getSourceImage() as HTMLImageElement;
  const redCarImg = scene.textures.get('raw-td-red-car').getSourceImage() as HTMLImageElement;
  const angkotDownImg = scene.textures.get('enemy-angkot-chaos').getSourceImage() as HTMLImageElement;
  const bossOdolImg = scene.textures.get('boss-raja-odol').getSourceImage() as HTMLImageElement;

  // ============================================================================
  // 1. UPWARD-FACING PLAYER VEHICLES (Front at TOP, Taillights at BOTTOM)
  // ============================================================================

  // Player Angkot (Upward-facing custom Angkot with roof rack & headlights at TOP)
  createCanvasTex(scene, 'player-angkot', 180, 270, (ctx) => {
    if (redCarImg && redCarImg.width > 0) {
      ctx.drawImage(redCarImg, 4, 2, 172, 266);
    }
    // Roof luggage rack (top-down view, facing UP)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(44, 88, 92, 112, 10);
    ctx.fill();
    ctx.stroke();

    // Luggage boxes on roof rack
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.roundRect(54, 98, 40, 44, 5);
    ctx.fill();
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(96, 102, 30, 38, 5);
    ctx.fill();
    ctx.fillStyle = '#A855F7';
    ctx.beginPath();
    ctx.roundRect(58, 148, 66, 40, 6);
    ctx.fill();

    // Forward yellow headlight beams at TOP
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.ellipse(48, 14, 14, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(132, 14, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player Pickup Truck (Upward-facing with front hood/windshield at TOP & open cargo bed at BOTTOM)
  createCanvasTex(scene, 'player-pickup-truck', 180, 276, (ctx) => {
    if (cityCarImg && cityCarImg.width > 0) {
      ctx.drawImage(cityCarImg, 0, 0, 180, 268);
    }
    // Open Rear Pickup Cargo Bed at bottom half (facing UP)
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(34, 136, 112, 106, 8);
    ctx.fill();
    ctx.stroke();

    // Bed liner ribs
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    for (let y = 152; y <= 224; y += 18) {
      ctx.beginPath();
      ctx.moveTo(42, y);
      ctx.lineTo(138, y);
      ctx.stroke();
    }

    // Forward cyan-white headlights at TOP
    ctx.fillStyle = '#E0F2FE';
    ctx.beginPath();
    ctx.ellipse(46, 14, 14, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(134, 14, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player Heavy Truck (Upward-facing armored yellow truck with cab at TOP & dump bed at BOTTOM)
  createCanvasTex(scene, 'player-heavy-truck', 196, 300, (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(14, 10, 168, 282, 22);
    ctx.fill();

    // Front Armored Cab at TOP (facing UP)
    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(24, 14, 148, 96, 18);
    ctx.fill();
    ctx.stroke();

    // Front Windshield at TOP
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(36, 34, 124, 38, 8);
    ctx.fill();
    ctx.stroke();

    // Front Headlights at TOP
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.roundRect(34, 12, 26, 10, 4);
    ctx.roundRect(136, 12, 26, 10, 4);
    ctx.fill();

    // Rear Heavy Dump Cargo Bed at BOTTOM
    ctx.fillStyle = '#D97706';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(18, 102, 160, 182, 12);
    ctx.fill();
    ctx.stroke();

    // Inner Cargo Tarp
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.roundRect(32, 116, 132, 152, 8);
    ctx.fill();

    // Rear Red Taillights at BOTTOM
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(30, 276, 30, 10, 3);
    ctx.roundRect(136, 276, 30, 10, 3);
    ctx.fill();
  });

  // Player Bajaj BBG (Upward-facing 3-Wheeler with single front wheel at TOP & dual rear wheels at BOTTOM)
  createCanvasTex(scene, 'player-bajaj', 160, 240, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(80, 125, 68, 105, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dual Rear Wheels at bottom sides
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(12, 160, 24, 62, 7);
    ctx.roundRect(124, 160, 24, 62, 7);
    ctx.fill();

    // Front Single Wheel at top center
    ctx.beginPath();
    ctx.roundRect(69, 10, 22, 54, 7);
    ctx.fill();

    // Main Orange Bajaj Body (Tapered 3-wheel hull)
    ctx.fillStyle = '#EA580C';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(56, 44);
    ctx.lineTo(80, 26);
    ctx.lineTo(104, 44);
    ctx.lineTo(138, 95);
    ctx.lineTo(142, 218);
    ctx.arcTo(142, 230, 130, 230, 12);
    ctx.lineTo(30, 230);
    ctx.arcTo(18, 230, 18, 218, 12);
    ctx.lineTo(22, 95);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Black Canvas Canopy Roof (Jakarta signature)
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(32, 80, 96, 135, 12);
    ctx.fill();
    ctx.stroke();

    // Canvas roof ribs
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    for (let ry = 105; ry <= 195; ry += 22) {
      ctx.beginPath();
      ctx.moveTo(38, ry);
      ctx.lineTo(122, ry);
      ctx.stroke();
    }

    // Front Curved Windshield at TOP
    ctx.fillStyle = '#0284C7';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(42, 76);
    ctx.quadraticCurveTo(80, 52, 118, 76);
    ctx.lineTo(112, 88);
    ctx.quadraticCurveTo(80, 68, 48, 88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Big Center Chrome Headlight at TOP
    ctx.fillStyle = '#FEF08A';
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(80, 32, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rear Taillights at BOTTOM
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(26, 222, 22, 7, 2);
    ctx.roundRect(112, 222, 22, 7, 2);
    ctx.fill();
  });

  // Player Supercar Crazy Rich (Upward-facing gold titanium hypercar with aerodynamic canopy & rear wing)
  createCanvasTex(scene, 'player-crazy-rich', 180, 280, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(14, 12, 152, 260, 26);
    ctx.fill();

    // 4 Wide Ultra-Performance Wheels
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(10, 48, 22, 54);
    ctx.fillRect(148, 48, 22, 54);
    ctx.fillRect(8, 185, 24, 62);
    ctx.fillRect(148, 185, 24, 62);

    // Aerodynamic Gold Titanium Hull (Facing UP)
    ctx.fillStyle = '#EAB308';
    ctx.strokeStyle = '#713F12';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(68, 16);
    ctx.lineTo(112, 16);
    ctx.lineTo(152, 52);
    ctx.lineTo(164, 102);
    ctx.lineTo(148, 158);
    ctx.lineTo(168, 218);
    ctx.lineTo(162, 264);
    ctx.lineTo(18, 264);
    ctx.lineTo(12, 218);
    ctx.lineTo(32, 158);
    ctx.lineTo(16, 102);
    ctx.lineTo(28, 52);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Obsidian Black Racing Stripes & Carbon Splitter
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(76, 16);
    ctx.lineTo(104, 16);
    ctx.lineTo(108, 92);
    ctx.lineTo(72, 92);
    ctx.closePath();
    ctx.fill();

    // Sleek Teardrop Cockpit Canopy at center
    ctx.fillStyle = '#0369A1';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(90, 126, 36, 52, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glass reflection highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(84, 118, 22, Math.PI * 0.9, Math.PI * 1.6);
    ctx.stroke();

    // Carbon Fiber GT Rear Wing with Endplates at BOTTOM
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(14, 250, 152, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Dual Laser Headlight Clusters at TOP
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(40, 26, 22, 10, 4);
    ctx.roundRect(118, 26, 22, 10, 4);
    ctx.fill();

    // Neon Cyan Exhaust Flame ports at BOTTOM
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.arc(76, 272, 5, 0, Math.PI * 2);
    ctx.arc(90, 272, 5, 0, Math.PI * 2);
    ctx.arc(104, 272, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Player Police Car (Upward-facing interceptor sedan with push bumper & red/blue strobe lightbar)
  createCanvasTex(scene, 'player-police-car', 180, 280, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.44)';
    ctx.beginPath();
    ctx.roundRect(18, 12, 144, 262, 22);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(12, 48, 20, 50);
    ctx.fillRect(148, 48, 20, 50);
    ctx.fillRect(12, 185, 20, 56);
    ctx.fillRect(148, 185, 20, 56);

    // Crisp White Body Hull (Facing UP)
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(24, 16, 132, 250, 20);
    ctx.fill();
    ctx.stroke();

    // High-Contrast Deep Navy Blue Police Flank Panels
    ctx.fillStyle = '#1E3A8A';
    ctx.fillRect(26, 75, 22, 128);
    ctx.fillRect(132, 75, 22, 128);

    // Front Black Heavy Steel Push Bumper (Bullbar) at TOP
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(40, 10, 100, 14, 4);
    ctx.fill();
    ctx.stroke();

    // Windshield at TOP
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(38, 70);
    ctx.lineTo(142, 70);
    ctx.lineTo(134, 108);
    ctx.lineTo(46, 108);
    ctx.closePath();
    ctx.fill();

    // Roof Police Decal "POLISI"
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.roundRect(48, 114, 84, 52, 6);
    ctx.fill();

    // Red & Blue High-Intensity Strobe Lightbar on Roof
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(42, 134, 96, 22, 6);
    ctx.fill();

    // Blue Left Flasher
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(46, 138, 42, 14, 4);
    ctx.fill();

    // Red Right Flasher
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(92, 138, 42, 14, 4);
    ctx.fill();

    // Rear Windshield
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(46, 180);
    ctx.lineTo(134, 180);
    ctx.lineTo(140, 214);
    ctx.lineTo(40, 214);
    ctx.closePath();
    ctx.fill();

    // Forward Xenon Headlights at TOP
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.roundRect(32, 18, 22, 10, 3);
    ctx.roundRect(126, 18, 22, 10, 3);
    ctx.fill();

    // Rear LED Taillights at BOTTOM
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(32, 258, 26, 8, 2);
    ctx.roundRect(122, 258, 26, 8, 2);
    ctx.fill();
  });

  // ============================================================================
  // 2. DOWNWARD-FACING ONCOMING ENEMIES & BOSSES (Headlights at BOTTOM)
  // ============================================================================

  // Enemy Proyek Jalan (Downward-facing Utility Vehicle with Hazard Stripes & Amber Beacons)
  createCanvasTex(scene, 'enemy-proyek-jalan', 199, 294, (ctx) => {
    if (angkotDownImg && angkotDownImg.width > 0) {
      ctx.drawImage(angkotDownImg, 0, 0, 199, 294);
    }
    // Hazard yellow-and-black construction panel on roof
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(42, 46, 115, 110, 10);
    ctx.clip();
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(42, 46, 115, 110);
    ctx.fillStyle = '#0F172A';
    for (let i = -120; i < 220; i += 28) {
      ctx.beginPath();
      ctx.moveTo(42 + i, 46);
      ctx.lineTo(42 + i + 14, 46);
      ctx.lineTo(42 + i - 30, 156);
      ctx.lineTo(42 + i - 44, 156);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(42, 46, 115, 110, 10);
    ctx.stroke();

    // Dual Amber Construction Beacons above front windshield (facing DOWN)
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.arc(68, 172, 10, 0, Math.PI * 2);
    ctx.arc(131, 172, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Enemy Polisi Lalu Lintas (Downward-facing Police Patrol Car with Red/Blue Siren Bar & Headlights at BOTTOM)
  createCanvasTex(scene, 'enemy-polisi-lalu-lintas', 199, 294, (ctx) => {
    if (angkotDownImg && angkotDownImg.width > 0) {
      ctx.drawImage(angkotDownImg, 0, 0, 199, 294);
    }
    // White & Navy Police Roof Livery
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(40, 42, 119, 118, 14);
    ctx.fill();
    ctx.stroke();

    // Red & Blue Police Lightbar (facing DOWN toward player)
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(46, 142, 107, 22, 6);
    ctx.fill();

    // Glowing Blue Siren (Left)
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.roundRect(50, 145, 46, 16, 4);
    ctx.fill();

    // Glowing Red Siren (Right)
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(103, 145, 46, 16, 4);
    ctx.fill();
  });

  // Boss Kontraktor Abadi (Downward-facing Armored Construction Boss)
  createCanvasTex(scene, 'boss-kontraktor-abadi', 367, 447, (ctx) => {
    if (bossOdolImg && bossOdolImg.width > 0) {
      ctx.drawImage(bossOdolImg, 0, 0, 367, 447);
    }
    // Hazard Bar Across Front Bumper (at bottom)
    ctx.fillStyle = '#FACC15';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(34, 396, 230, 34, 6);
    ctx.fill();
    ctx.stroke();
  });

  // Boss 4: Sultan Busway Gandeng (TransJakarta Red-Yellow Double Articulated Bus facing DOWN)
  createCanvasTex(scene, 'boss-sultan-busway', 320, 480, (ctx) => {
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(30, 20, 260, 440, 24);
    ctx.fill();

    // Rear Bus Cabin (Top half: y=20 to y=200)
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.roundRect(40, 24, 240, 180, 18);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 6;
    ctx.stroke();

    // White Roof AC units on rear cabin
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(80, 40, 160, 36);
    ctx.fillRect(80, 100, 160, 36);

    // Accordion Bellows Joint in Middle (y=195 to y=255)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(52, 195, 216, 60);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    for (let by = 202; by <= 248; by += 8) {
      ctx.beginPath();
      ctx.moveTo(52, by);
      ctx.lineTo(268, by);
      ctx.stroke();
    }

    // Front Bus Cabin (Bottom half: y=250 to y=450)
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.roundRect(38, 250, 244, 200, 20);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Yellow TransJakarta Accent Stripe
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(40, 320, 240, 22);

    // Front Windshield (at bottom, facing DOWN)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(56, 365, 208, 55, 10);
    ctx.fill();

    // Destination LED Matrix Board "BLOK M - KOTA"
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(72, 372, 176, 16);
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TJ-01 BLOK M - KOTA', 160, 380);

    // Front Xenon Headlights (at bottom)
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.roundRect(52, 428, 44, 16, 4);
    ctx.roundRect(224, 428, 44, 16, 4);
    ctx.fill();

    // Heavy Steel Bumper
    ctx.fillStyle = '#334155';
    ctx.fillRect(48, 440, 224, 12);
  });

  // Boss 5: Mobil Derek Siluman (Tactical Black-Yellow Rogue Recovery Tow-Truck facing DOWN)
  createCanvasTex(scene, 'boss-derek-siluman', 280, 420, (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
    ctx.beginPath();
    ctx.roundRect(24, 20, 232, 380, 20);
    ctx.fill();

    // Heavy Tow Truck Body
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(36, 26, 208, 368, 16);
    ctx.fill();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Rear Hydraulic Crane Bed (Top half)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(52, 38, 176, 170);

    // Yellow Hydraulic Crane Arm
    ctx.fillStyle = '#EAB308';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(115, 45, 50, 150, 8);
    ctx.fill();
    ctx.stroke();

    // Steel Winch Cable Spool
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(140, 110, 22, 0, Math.PI * 2);
    ctx.fill();

    // Black & Yellow Hazard Chevrons on Front Hood
    ctx.save();
    ctx.beginPath();
    ctx.rect(48, 270, 184, 70);
    ctx.clip();
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(48, 270, 184, 70);
    ctx.fillStyle = '#0F172A';
    for (let x = -80; x < 260; x += 32) {
      ctx.beginPath();
      ctx.moveTo(48 + x, 270);
      ctx.lineTo(48 + x + 16, 270);
      ctx.lineTo(48 + x - 20, 340);
      ctx.lineTo(48 + x - 36, 340);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Front Windshield (Bottom half)
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.roundRect(58, 218, 164, 44, 8);
    ctx.fill();

    // Rotating Amber Warning Lightbar on Roof
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.roundRect(88, 206, 104, 14, 6);
    ctx.fill();

    // Heavy Spiked Bumper with Towing Hooks at BOTTOM
    ctx.fillStyle = '#475569';
    ctx.fillRect(42, 375, 196, 20);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(80, 398, 9, 0, Math.PI * 2);
    ctx.arc(200, 398, 9, 0, Math.PI * 2);
    ctx.fill();
  });

  // Boss 6: Konvoi Patwal VIP (Presidential Armored Black Convoy with Escort Outriders facing DOWN)
  createCanvasTex(scene, 'boss-patwal-vip', 300, 420, (ctx) => {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
    ctx.beginPath();
    ctx.roundRect(20, 16, 260, 388, 22);
    ctx.fill();

    // Twin Escort Heavy Police Motorbikes on Flanks
    const drawEscortBike = (bx: number) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(bx, 110, 42, 170, 12);
      ctx.fill();
      ctx.strokeStyle = '#1E3A8A';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Blue strobe on bike
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(bx + 6, 250, 14, 8);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(bx + 22, 250, 14, 8);
    };
    drawEscortBike(14);
    drawEscortBike(244);

    // Central VIP Armored SUV Body (facing DOWN)
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.roundRect(66, 30, 168, 350, 22);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Tinted Bulletproof Glass (Rear at top, Front at bottom)
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(84, 80, 132, 50, 6); // Rear window
    ctx.roundRect(84, 250, 132, 60, 8); // Front windshield
    ctx.fill();

    // High-Intensity Red & Blue VIP Strobe Lightbar on Roof
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(80, 230, 140, 16);
    ctx.fillStyle = '#EF4444'; // Red Left
    ctx.fillRect(84, 232, 64, 12);
    ctx.fillStyle = '#3B82F6'; // Blue Right
    ctx.fillRect(152, 232, 64, 12);

    // Front Grille Strobes at BOTTOM
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(90, 362, 38, 10);
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(172, 362, 38, 10);

    // Xenon Headlights at BOTTOM
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.roundRect(72, 345, 26, 14, 4);
    ctx.roundRect(202, 345, 26, 14, 4);
    ctx.fill();
  });

  // ============================================================================
  // UNIQUE BOSS PROJECTILES & HAZARD ASSETS
  // ============================================================================

  // Busway Ultrasonic Telolet Basuri Wave (Wide arc wave in cyan/violet)
  createCanvasTex(scene, 'proj-boss-busway-telolet', 140, 36, (ctx) => {
    const waveGrad = ctx.createLinearGradient(0, 0, 140, 0);
    waveGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    waveGrad.addColorStop(0.2, '#38BDF8');
    waveGrad.addColorStop(0.5, '#FACC15');
    waveGrad.addColorStop(0.8, '#F43F5E');
    waveGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');

    ctx.strokeStyle = waveGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(70, 60, 56, Math.PI * 1.15, Math.PI * 1.85, false);
    ctx.stroke();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(70, 60, 54, Math.PI * 1.2, Math.PI * 1.8, false);
    ctx.stroke();
  });

  // Tow-Truck Harpoon Winch Cable Hook
  createCanvasTex(scene, 'proj-boss-derek-hook', 32, 54, (ctx) => {
    // Steel cable line at top
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(16, 24);
    ctx.stroke();

    // Heavy red steel towing hook at bottom
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(10, 24, 12, 14, 3);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(16, 42, 9, Math.PI * 0.7, Math.PI * 1.9, false);
    ctx.stroke();
  });

  // VIP Strobe Laser Beam
  createCanvasTex(scene, 'proj-boss-patwal-laser', 20, 64, (ctx) => {
    const lGrad = ctx.createLinearGradient(10, 0, 10, 64);
    lGrad.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    lGrad.addColorStop(0.3, '#3B82F6');
    lGrad.addColorStop(0.5, '#FFFFFF');
    lGrad.addColorStop(0.7, '#EF4444');
    lGrad.addColorStop(1, 'rgba(239, 68, 68, 0.1)');

    ctx.fillStyle = lGrad;
    ctx.fillRect(4, 2, 12, 60);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 6, 4, 52);
  });

  // Burning Asphalt Mortar Shell (Kontraktor Abadi)
  createCanvasTex(scene, 'proj-boss-hot-asphalt', 36, 36, (ctx) => {
    const aGrad = ctx.createRadialGradient(18, 18, 3, 18, 18, 16);
    aGrad.addColorStop(0, '#FFFFFF');
    aGrad.addColorStop(0.3, '#FACC15');
    aGrad.addColorStop(0.7, '#EA580C');
    aGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');

    ctx.fillStyle = aGrad;
    ctx.beginPath();
    ctx.arc(18, 18, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(18, 18, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Cargo Crate Hazard (Raja ODOL)
  createCanvasTex(scene, 'proj-boss-cargo-crate', 44, 44, (ctx) => {
    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.roundRect(4, 4, 36, 36, 5);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Steel bands
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(10, 4, 8, 36);
    ctx.strokeRect(26, 4, 8, 36);

    // Hazard warning symbol
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.moveTo(22, 12);
    ctx.lineTo(31, 28);
    ctx.lineTo(13, 28);
    ctx.closePath();
    ctx.fill();
  });

  // ============================================================================
  // 3. VEHICLE UNIQUE BASIC SKILL PROJECTILES (EXTRAORDINARY VISUAL EFFECTS)
  // ============================================================================

  // 1. Motor Ojol: Emerald Starlight Dart
  createCanvasTex(scene, 'proj-basic-dart', 24, 48, (ctx) => {
    const grad = ctx.createLinearGradient(12, 0, 12, 48);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.25, '#86EFAC');
    grad.addColorStop(0.65, '#22C55E');
    grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(20, 20);
    ctx.lineTo(15, 46);
    ctx.lineTo(12, 40);
    ctx.lineTo(9, 46);
    ctx.lineTo(4, 20);
    ctx.closePath();
    ctx.fill();

    // Golden 5-Star core
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(12, 16, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Bajaj: 2-Stroke Exhaust Flame Burst
  createCanvasTex(scene, 'proj-basic-flame', 28, 48, (ctx) => {
    const grad = ctx.createRadialGradient(14, 14, 2, 14, 26, 20);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#FEF08A');
    grad.addColorStop(0.6, '#F97316');
    grad.addColorStop(0.85, '#DC2626');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(14, 14, 10, Math.PI, 0, false);
    ctx.quadraticCurveTo(26, 32, 14, 46);
    ctx.quadraticCurveTo(2, 32, 4, 14);
    ctx.closePath();
    ctx.fill();
  });

  // 3. City Car: High-Tech Cyan Ion Plasma Bolt
  createCanvasTex(scene, 'proj-basic-plasma', 26, 52, (ctx) => {
    const grad = ctx.createLinearGradient(13, 0, 13, 52);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#38BDF8');
    grad.addColorStop(0.7, '#0284C7');
    grad.addColorStop(1, 'rgba(2, 132, 199, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(8, 4, 10, 44, 5);
    ctx.fill();

    // Holographic wings
    ctx.fillStyle = '#67E8F9';
    ctx.beginPath();
    ctx.moveTo(8, 18); ctx.lineTo(1, 32); ctx.lineTo(8, 30); ctx.closePath();
    ctx.moveTo(18, 18); ctx.lineTo(25, 32); ctx.lineTo(18, 30); ctx.closePath();
    ctx.fill();

    // White core line
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(11, 8, 4, 32);
  });

  // 4. Angkot: Acoustic Shockwave Ring (Magenta/Violet)
  createCanvasTex(scene, 'proj-basic-bass', 36, 48, (ctx) => {
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(18, 18, 14, Math.PI, 0, false);
    ctx.stroke();

    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(18, 26, 12, Math.PI, 0, false);
    ctx.stroke();

    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(18, 14, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Pickup: Mini Gas Melon Canister
  createCanvasTex(scene, 'proj-basic-melon', 26, 46, (ctx) => {
    // Green mini body
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.roundRect(5, 10, 16, 26, 6);
    ctx.fill();
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Red band
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(5, 20, 16, 5);

    // Rocket flame at bottom
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(13, 38, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 6. Police: Alternating Stun EMP Laser
  createCanvasTex(scene, 'proj-basic-taser', 22, 52, (ctx) => {
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(4, 4, 6, 44);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(12, 4, 6, 44);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 8, 6, 36);
  });

  // 7. Heavy Truck: Armor-Piercing Tungsten Sabot
  createCanvasTex(scene, 'proj-basic-cannon', 28, 54, (ctx) => {
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.roundRect(8, 12, 12, 34, 4);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Heavy Tungsten Warhead
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.moveTo(14, 2);
    ctx.lineTo(21, 14);
    ctx.lineTo(7, 14);
    ctx.closePath();
    ctx.fill();
  });

  // 8. Crazy Rich: Spinning Cyan Diamond Shuriken
  createCanvasTex(scene, 'proj-basic-diamond', 32, 48, (ctx) => {
    // Golden aura
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.beginPath();
    ctx.arc(16, 20, 15, 0, Math.PI * 2);
    ctx.fill();

    // Faceted Diamond Prism
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(16, 6);
    ctx.lineTo(26, 20);
    ctx.lineTo(16, 34);
    ctx.lineTo(6, 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golden Coin Core
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(16, 20, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // ============================================================================
  // 4. PROJECTILES & COLLECTIBLES (Properly Oriented Upward / Downward)
  // ============================================================================

  // Player Teardrop Flame Projectile (Rounded bright head at TOP y=8, tapered tail at BOTTOM y=42)
  createCanvasTex(scene, 'proj-bullet', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.25, '#FEF08A');
    grad.addColorStop(0.65, '#FACC15');
    grad.addColorStop(0.9, '#F97316');
    grad.addColorStop(1, 'rgba(249, 115, 22, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();

    // Bright white hot core at top head
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(11, 12, 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // ============================================================================
  // REALISTIC VOLUMETRIC VEHICLE HEADLIGHT BEAM (Soft Gradient & Dual Core)
  // ============================================================================
  createCanvasTex(scene, 'fx-headlight-beam', 260, 360, (ctx) => {
    // Twin headlights projecting forward (from y=350 up to y=20)
    // Left beam origin: (108, 350), Right beam origin: (152, 350)
    // We create a soft, feathered trapezoidal volumetric light cone with additive radial highlights

    // 1. Overall forward light cone gradient
    const coneGrad = ctx.createLinearGradient(130, 350, 130, 10);
    coneGrad.addColorStop(0, 'rgba(255, 255, 240, 0.45)');
    coneGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.30)');
    coneGrad.addColorStop(0.6, 'rgba(250, 204, 21, 0.14)');
    coneGrad.addColorStop(0.85, 'rgba(234, 179, 8, 0.05)');
    coneGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(102, 350);
    ctx.lineTo(12, 30);
    ctx.quadraticCurveTo(130, 0, 248, 30);
    ctx.lineTo(158, 350);
    ctx.closePath();
    ctx.fillStyle = coneGrad;
    ctx.fill();

    // 2. Dual Intense Xenon Bulb Hotspots at Vehicle Bumper
    const leftBulbGrad = ctx.createRadialGradient(108, 348, 2, 108, 348, 48);
    leftBulbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    leftBulbGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.70)');
    leftBulbGrad.addColorStop(0.55, 'rgba(250, 204, 21, 0.25)');
    leftBulbGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = leftBulbGrad;
    ctx.beginPath();
    ctx.arc(108, 348, 48, 0, Math.PI * 2);
    ctx.fill();

    const rightBulbGrad = ctx.createRadialGradient(152, 348, 2, 152, 348, 48);
    rightBulbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    rightBulbGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.70)');
    rightBulbGrad.addColorStop(0.55, 'rgba(250, 204, 21, 0.25)');
    rightBulbGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = rightBulbGrad;
    ctx.beginPath();
    ctx.arc(152, 348, 48, 0, Math.PI * 2);
    ctx.fill();

    // 3. Central Convergence Hotspot on Road Asphalt (where both beams intersect)
    const roadHotspot = ctx.createRadialGradient(130, 210, 10, 130, 210, 95);
    roadHotspot.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    roadHotspot.addColorStop(0.45, 'rgba(250, 204, 21, 0.16)');
    roadHotspot.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = roadHotspot;
    ctx.beginPath();
    ctx.ellipse(130, 210, 65, 95, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Subtle Volumetric Dust & Atmospheric Haze Streamers
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(108, 345);
    ctx.lineTo(60, 80);
    ctx.moveTo(152, 345);
    ctx.lineTo(200, 80);
    ctx.stroke();

    ctx.restore();
  });

  // ============================================================================
  // 3. VEHICLE-SPECIFIC UNIQUE MISSILES & PROJECTILES (Distinct for each vehicle)
  // ============================================================================

  // 1. Motor Ojol: Rudal Bintang Lima Ojol (Aerodynamic emerald racing missile with GPS tip)
  createCanvasTex(scene, 'proj-rocket-motor-ojol', 26, 52, (ctx) => {
    // Emerald flame exhaust
    const flmGrad = ctx.createRadialGradient(13, 44, 2, 13, 44, 8);
    flmGrad.addColorStop(0, '#FFFFFF');
    flmGrad.addColorStop(0.3, '#4ADE80');
    flmGrad.addColorStop(0.7, '#16A34A');
    flmGrad.addColorStop(1, 'rgba(22, 163, 74, 0)');
    ctx.fillStyle = flmGrad;
    ctx.beginPath();
    ctx.arc(13, 44, 8, 0, Math.PI * 2);
    ctx.fill();

    // Green streamlined missile body
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.roundRect(7, 12, 12, 28, 5);
    ctx.fill();
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golden speed stripes
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(8, 22, 10, 4);

    // Ojol GPS Sensor Nosecone at TOP
    ctx.fillStyle = '#86EFAC';
    ctx.beginPath();
    ctx.moveTo(13, 2);
    ctx.lineTo(19, 13);
    ctx.lineTo(7, 13);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Gold stabilizer winglets
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.moveTo(7, 30);
    ctx.lineTo(1, 40);
    ctx.lineTo(7, 40);
    ctx.closePath();
    ctx.moveTo(19, 30);
    ctx.lineTo(25, 40);
    ctx.lineTo(19, 40);
    ctx.closePath();
    ctx.fill();
  });

  // 2. Bajaj: Rudal Tabung Gas BBG Oranye (High-pressure CNG tank with dual 2-stroke exhaust)
  createCanvasTex(scene, 'proj-rocket-bajaj', 28, 52, (ctx) => {
    // Twin 2-stroke sputter fire exhaust
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.arc(9, 44, 5, 0, Math.PI * 2);
    ctx.arc(19, 44, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(9, 43, 2.5, 0, Math.PI * 2);
    ctx.arc(19, 43, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Rounded orange CNG canister body
    const bodyGrad = ctx.createLinearGradient(5, 0, 23, 0);
    bodyGrad.addColorStop(0, '#C2410C');
    bodyGrad.addColorStop(0.4, '#FB923C');
    bodyGrad.addColorStop(1, '#9A3412');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(5, 12, 18, 28, 7);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Brass safety pressure regulator valve at top
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(11, 4, 6, 8);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(10, 2, 8, 3);

    // Hazard warning rings
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(5, 24, 18, 3);
  });

  // 3. City Car: Rudal Plasma Tol Elektronik (Electric cyan homing missile with swept wings)
  createCanvasTex(scene, 'proj-rocket-city-car', 28, 52, (ctx) => {
    // Cyan ion thrust
    const ionGrad = ctx.createRadialGradient(14, 44, 2, 14, 44, 9);
    ionGrad.addColorStop(0, '#FFFFFF');
    ionGrad.addColorStop(0.35, '#38BDF8');
    ionGrad.addColorStop(0.7, '#0284C7');
    ionGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = ionGrad;
    ctx.beginPath();
    ctx.arc(14, 44, 9, 0, Math.PI * 2);
    ctx.fill();

    // Sleek titanium fuselage
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(8, 11, 12, 29, 4);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Swept delta wings
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.moveTo(8, 22);
    ctx.lineTo(1, 38);
    ctx.lineTo(8, 36);
    ctx.closePath();
    ctx.moveTo(20, 22);
    ctx.lineTo(27, 38);
    ctx.lineTo(20, 36);
    ctx.closePath();
    ctx.fill();

    // Digital LED status line
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(12, 16, 4, 18);

    // Sharp aerodynamic nose cone
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(14, 2);
    ctx.lineTo(20, 11);
    ctx.lineTo(8, 11);
    ctx.closePath();
    ctx.fill();
  });

  // 4. Angkot: Rudal Subwoofer Tabung Dugem (Neon magenta speaker rocket with acoustic shockwaves)
  createCanvasTex(scene, 'proj-rocket-angkot', 30, 54, (ctx) => {
    // Violet acoustic thrust cone
    ctx.fillStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.beginPath();
    ctx.arc(15, 46, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(15, 45, 5, 0, Math.PI * 2);
    ctx.fill();

    // Bass tube body
    ctx.fillStyle = '#581C87';
    ctx.beginPath();
    ctx.roundRect(6, 12, 18, 30, 6);
    ctx.fill();
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Equalizer LED frequency bars
    const eqColors = ['#F43F5E', '#FBBF24', '#34D399', '#38BDF8'];
    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = eqColors[b];
      ctx.fillRect(9, 18 + b * 5, 12, 3);
    }

    // Subwoofer speaker dust cap at nose cone
    ctx.fillStyle = '#A855F7';
    ctx.beginPath();
    ctx.arc(15, 12, 7, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F472B6';
    ctx.beginPath();
    ctx.arc(15, 10, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Chrome bass port brackets
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(3, 30, 3, 10);
    ctx.fillRect(24, 30, 3, 10);
  });

  // 5. Pickup Truck: Rudal Tabung Gas Melon 3KG (Iconic green LPG canister rocket)
  createCanvasTex(scene, 'proj-rocket-pickup-truck', 30, 54, (ctx) => {
    // Fiery orange/yellow napalm rocket flame
    const napalmGrad = ctx.createRadialGradient(15, 46, 2, 15, 46, 9);
    napalmGrad.addColorStop(0, '#FFFFFF');
    napalmGrad.addColorStop(0.4, '#FACC15');
    napalmGrad.addColorStop(0.8, '#EA580C');
    napalmGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = napalmGrad;
    ctx.beginPath();
    ctx.arc(15, 46, 9, 0, Math.PI * 2);
    ctx.fill();

    // Handle collar at top
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(9, 2, 12, 8, 2);
    ctx.stroke();

    // Brass valve
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(13, 6, 4, 5);

    // Lime green 3KG rounded cylinder body
    const melonGrad = ctx.createLinearGradient(4, 0, 26, 0);
    melonGrad.addColorStop(0, '#15803D');
    melonGrad.addColorStop(0.35, '#22C55E');
    melonGrad.addColorStop(0.7, '#4ADE80');
    melonGrad.addColorStop(1, '#14532D');
    ctx.fillStyle = melonGrad;
    ctx.beginPath();
    ctx.roundRect(5, 12, 20, 28, 8);
    ctx.fill();
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Red safety stripe with bold "3KG"
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(5, 23, 20, 7);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3KG', 15, 26.5);
  });

  // 6. Police Car: Rudal Sirene Strobo Presisi (White/Navy tactical missile with red/blue strobe LEDs)
  createCanvasTex(scene, 'proj-rocket-police-car', 28, 54, (ctx) => {
    // High-thrust blue afterburner flame
    const aftGrad = ctx.createRadialGradient(14, 46, 2, 14, 46, 8);
    aftGrad.addColorStop(0, '#FFFFFF');
    aftGrad.addColorStop(0.3, '#60A5FA');
    aftGrad.addColorStop(0.7, '#1E40AF');
    aftGrad.addColorStop(1, 'rgba(30, 64, 175, 0)');
    ctx.fillStyle = aftGrad;
    ctx.beginPath();
    ctx.arc(14, 46, 8, 0, Math.PI * 2);
    ctx.fill();

    // Tactical navy & white body
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.roundRect(8, 12, 12, 30, 4);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // White patrol stripes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(10, 18, 8, 12);

    // Rotating Red & Blue Strobe Wingtips
    ctx.fillStyle = '#EF4444'; // Red Left flasher
    ctx.beginPath();
    ctx.arc(4, 34, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3B82F6'; // Blue Right flasher
    ctx.beginPath();
    ctx.arc(24, 34, 4, 0, Math.PI * 2);
    ctx.fill();

    // Radar radome nose cone at TOP
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(14, 2);
    ctx.lineTo(20, 12);
    ctx.lineTo(8, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // 7. Heavy Truck: Rudal Logistik Baja Kontainer (Armored yellow steel warhead with hazard chevrons)
  createCanvasTex(scene, 'proj-rocket-heavy-truck', 32, 56, (ctx) => {
    // Heavy dual industrial fire plume
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(11, 48, 6, 0, Math.PI * 2);
    ctx.arc(21, 48, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(11, 46, 3, 0, Math.PI * 2);
    ctx.arc(21, 46, 3, 0, Math.PI * 2);
    ctx.fill();

    // Armored yellow steel fuselage
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.roundRect(6, 12, 20, 32, 4);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Black hazard chevrons
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(6, 20); ctx.lineTo(16, 26); ctx.lineTo(16, 22); ctx.lineTo(6, 16); ctx.closePath();
    ctx.moveTo(26, 20); ctx.lineTo(16, 26); ctx.lineTo(16, 22); ctx.lineTo(26, 16); ctx.closePath();
    ctx.moveTo(6, 30); ctx.lineTo(16, 36); ctx.lineTo(16, 32); ctx.lineTo(6, 26); ctx.closePath();
    ctx.moveTo(26, 30); ctx.lineTo(16, 36); ctx.lineTo(16, 32); ctx.lineTo(26, 26); ctx.closePath();
    ctx.fill();

    // Heavy reinforced steel nose cone
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(26, 12);
    ctx.lineTo(6, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 8. Crazy Rich: Rudal Kripto Emas Berlian (24K solid gold hyper-missile with cyan diamond warhead)
  createCanvasTex(scene, 'proj-rocket-crazy-rich', 30, 54, (ctx) => {
    // Platinum & gold starlight aura
    const auraGrad = ctx.createRadialGradient(15, 46, 2, 15, 46, 10);
    auraGrad.addColorStop(0, '#FFFFFF');
    auraGrad.addColorStop(0.35, '#FEF08A');
    auraGrad.addColorStop(0.7, '#F59E0B');
    auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(15, 46, 10, 0, Math.PI * 2);
    ctx.fill();

    // 24K Polished Gold fuselage
    const goldGrad = ctx.createLinearGradient(6, 0, 24, 0);
    goldGrad.addColorStop(0, '#B45309');
    goldGrad.addColorStop(0.3, '#FDE047');
    goldGrad.addColorStop(0.65, '#F59E0B');
    goldGrad.addColorStop(1, '#78350F');
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.roundRect(7, 12, 16, 30, 5);
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gold coin stabilizer fins
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.arc(4, 36, 4, 0, Math.PI * 2);
    ctx.arc(26, 36, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Faceted Diamond Warhead at TOP
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(15, 2);
    ctx.lineTo(23, 12);
    ctx.lineTo(7, 12);
    ctx.closePath();
    ctx.fill();
    // Inner diamond refraction
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(15, 2);
    ctx.lineTo(19, 12);
    ctx.lineTo(15, 9);
    ctx.closePath();
    ctx.fill();
  });

  // Base fallback Exhaust Rocket Projectile
  createCanvasTex(scene, 'proj-rocket', 24, 46, (ctx) => {
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(12, 36, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(6, 10, 12, 24, 4);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(12, 1);
    ctx.lineTo(18, 11);
    ctx.lineTo(6, 11);
    ctx.closePath();
    ctx.fill();
  });

  // Unique Vehicle-Themed Bullets for Double Shot
  createCanvasTex(scene, 'proj-bullet-motor-ojol', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#86EFAC');
    grad.addColorStop(0.7, '#22C55E');
    grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-bajaj', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#FED7AA');
    grad.addColorStop(0.7, '#F97316');
    grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-city-car', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#BAE6FD');
    grad.addColorStop(0.7, '#0284C7');
    grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-angkot', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#F472B6');
    grad.addColorStop(0.7, '#A855F7');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-pickup-truck', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#FCA5A5');
    grad.addColorStop(0.7, '#DC2626');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-police-car', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#93C5FD');
    grad.addColorStop(0.7, '#1E3A8A');
    grad.addColorStop(1, 'rgba(30, 58, 138, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-heavy-truck', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#FDE047');
    grad.addColorStop(0.7, '#B45309');
    grad.addColorStop(1, 'rgba(180, 83, 9, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  createCanvasTex(scene, 'proj-bullet-crazy-rich', 22, 46, (ctx) => {
    const grad = ctx.createLinearGradient(11, 2, 11, 44);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.25, '#67E8F9');
    grad.addColorStop(0.65, '#FACC15');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(11, 11, 7, Math.PI, 0, false);
    ctx.quadraticCurveTo(18, 26, 11, 44);
    ctx.quadraticCurveTo(4, 26, 4, 11);
    ctx.closePath();
    ctx.fill();
  });

  // Boss Red Energy Orb (matching the glowing red-white orbs in Panel 6)
  createCanvasTex(scene, 'proj-boss-orb', 28, 28, (ctx) => {
    const grad = ctx.createRadialGradient(14, 14, 3, 14, 14, 13);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.35, '#FFFFFF');
    grad.addColorStop(0.55, '#F87171');
    grad.addColorStop(0.8, '#EF4444');
    grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(14, 14, 13, 0, Math.PI * 2);
    ctx.fill();
  });

  // Red Laser Tracer
  createCanvasTex(scene, 'proj-enemy-laser', 16, 38, (ctx) => {
    const grad = ctx.createLinearGradient(8, 0, 8, 38);
    grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
    grad.addColorStop(0.3, '#EF4444');
    grad.addColorStop(0.75, '#FCA5A5');
    grad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(4, 2, 8, 34, 4);
    ctx.fill();
  });

  // Oil Slick Puddle
  createCanvasTex(scene, 'trap-oil', 72, 72, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.ellipse(36, 36, 32, 26, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });

  // Golden Coin Collectible
  createCanvasTex(scene, 'item-coin', 28, 28, (ctx) => {
    ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.beginPath();
    ctx.arc(14, 14, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.arc(14, 14, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', 14, 14.5);
  });

  // Health Repair Pickup
  createCanvasTex(scene, 'item-heal', 30, 30, (ctx) => {
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.roundRect(4, 4, 22, 22, 5);
    ctx.fill();
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(13, 8, 4, 14);
    ctx.fillRect(8, 13, 14, 4);
  });

  // =========================================================================
  // 5. ULTIMATE SKILL CUSTOM TEXTURES
  // =========================================================================

  // Iconic Indonesian 3kg Green LPG Canister ("Tabung Gas Melon")
  createCanvasTex(scene, 'ult-gas-melon', 44, 52, (ctx) => {
    // Outer fiery aura glow
    const glow = ctx.createRadialGradient(22, 28, 6, 22, 28, 22);
    glow.addColorStop(0, 'rgba(250, 204, 21, 0.7)');
    glow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(22, 28, 22, 0, Math.PI * 2);
    ctx.fill();

    // Top handle collar ring (green steel)
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(14, 4, 16, 10, 3);
    ctx.stroke();

    // Brass / Red Valve Center
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(19, 8, 6, 6);

    // Round "Melon" Tank Body (Bright Lime-Green with 3D shading)
    const bodyGrad = ctx.createRadialGradient(17, 24, 4, 22, 29, 17);
    bodyGrad.addColorStop(0, '#86EFAC');
    bodyGrad.addColorStop(0.45, '#22C55E');
    bodyGrad.addColorStop(1, '#14532D');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(22, 29, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#052E16';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Red Safety Stripe & "3KG" markings
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(9, 26, 26, 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('3 KG', 22, 28.5);

    // Base stand ring
    ctx.fillStyle = '#14532D';
    ctx.fillRect(14, 43, 16, 4);
  });

  // Heavy Truck Armored V-Plow ("Bemper Baja Pantura")
  createCanvasTex(scene, 'ult-bumper-plow', 150, 64, (ctx) => {
    // Golden electric aura
    const grad = ctx.createLinearGradient(0, 0, 0, 64);
    grad.addColorStop(0, '#FEF08A');
    grad.addColorStop(0.5, '#FACC15');
    grad.addColorStop(1, '#B45309');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(75, 4);
    ctx.lineTo(144, 34);
    ctx.lineTo(136, 58);
    ctx.lineTo(75, 38);
    ctx.lineTo(14, 58);
    ctx.lineTo(6, 34);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Black hazard chevrons on plow wings
    ctx.fillStyle = '#0F172A';
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      const cx = 75 + i * 22;
      ctx.beginPath();
      ctx.moveTo(cx - 6, 24);
      ctx.lineTo(cx + 4, 24);
      ctx.lineTo(cx + 8, 44);
      ctx.lineTo(cx - 2, 44);
      ctx.closePath();
      ctx.fill();
    }

    // Glowing cyan plasma leading edge
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 32);
    ctx.lineTo(75, 4);
    ctx.lineTo(142, 32);
    ctx.stroke();
  });

  // Cyber Plasma Orb (for City Car Plasma Drift Hurricane)
  createCanvasTex(scene, 'ult-plasma-orb', 32, 32, (ctx) => {
    const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 15);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.35, '#38BDF8');
    grad.addColorStop(0.7, '#A855F7');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();
  });

  // Napalm Fire Crater Zone (for Pickup Gas Melon Bombardment)
  createCanvasTex(scene, 'ult-fire-zone', 96, 96, (ctx) => {
    const grad = ctx.createRadialGradient(48, 48, 6, 48, 48, 46);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    grad.addColorStop(0.35, 'rgba(249, 115, 22, 0.85)');
    grad.addColorStop(0.7, 'rgba(220, 38, 38, 0.55)');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(48, 48, 46, 0, Math.PI * 2);
    ctx.fill();
  });
}

function createCanvasTex(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): void {
  const canvasTex = scene.textures.createCanvas(key, width, height);
  if (!canvasTex) return;
  const ctx = canvasTex.getContext();
  ctx.clearRect(0, 0, width, height);
  drawFn(ctx, width, height);
  canvasTex.refresh();
}
