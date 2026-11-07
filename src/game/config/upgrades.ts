import { WeaponId } from './weapons';

export type UpgradeCategory = 'weapon' | 'combat' | 'vehicle' | 'special';
export type UpgradeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface UpgradeDefinition {
  id: string;
  name: string;
  category: UpgradeCategory;
  rarity: UpgradeRarity;
  maxLevel: number;
  weaponId?: WeaponId;
  iconType:
    | 'klakson'
    | 'double-shot'
    | 'roket'
    | 'petir'
    | 'oli'
    | 'armor'
    | 'damage'
    | 'firerate'
    | 'speed'
    | 'magnet'
    | 'cooldown'
    | 'regen';
  description: string;
  effectText: (nextLevel: number) => string;
}

export const UPGRADE_DEFINITIONS: UpgradeDefinition[] = [
  // Weapons
  {
    id: 'weapon-klakson-sonic',
    name: 'Klakson Sonic',
    category: 'weapon',
    rarity: 'epic',
    maxLevel: 5,
    weaponId: 'klakson-sonic',
    iconType: 'klakson',
    description: 'Lepaskan gelombang suara yang memberi damage dan mendorong musuh.',
    effectText: (lvl) =>
      lvl === 1
        ? 'Senjata Baru: Gelombang kejut 360°'
        : `Radius & Damage Klakson meningkat (Lv. ${lvl})`,
  },
  {
    id: 'weapon-double-shot',
    name: 'Double Shot',
    category: 'weapon',
    rarity: 'rare',
    maxLevel: 5,
    weaponId: 'double-shot',
    iconType: 'double-shot',
    description: 'Menembakkan proyektil kembar berkecepatan tinggi sekaligus.',
    effectText: (lvl) =>
      lvl === 1
        ? 'Senjata Utama: 2 proyektil sekaligus'
        : `Tambah jumlah & daya hancur proyektil (Lv. ${lvl})`,
  },
  {
    id: 'weapon-roket-knalpot',
    name: 'Roket Knalpot',
    category: 'weapon',
    rarity: 'legendary',
    maxLevel: 5,
    weaponId: 'roket-knalpot',
    iconType: 'roket',
    description: 'Meluncurkan roket knalpot eksplosif dengan ledakan area luas.',
    effectText: (lvl) =>
      lvl === 1
        ? 'Senjata Baru: Roket peledak area'
        : `Ledakan & jumlah roket meningkat (Lv. ${lvl})`,
  },
  {
    id: 'weapon-petir-pln',
    name: 'Petir PLN',
    category: 'weapon',
    rarity: 'epic',
    maxLevel: 5,
    weaponId: 'petir-pln',
    iconType: 'petir',
    description: 'Menyambar musuh terdekat dengan petir berantai tegangan tinggi.',
    effectText: (lvl) =>
      lvl === 1
        ? 'Senjata Baru: Petir berantai 3 target'
        : `Tambah target lompatan & damage petir (Lv. ${lvl})`,
  },
  {
    id: 'weapon-oli-tumpah',
    name: 'Oli Tumpah',
    category: 'weapon',
    rarity: 'rare',
    maxLevel: 5,
    weaponId: 'oli-tumpah',
    iconType: 'oli',
    description: 'Menjatuhkan jebakan oli licin yang memperlambat dan menguras HP musuh.',
    effectText: (lvl) =>
      lvl === 1
        ? 'Senjata Baru: Jebakan oli pelambat'
        : `Luas & efek bakar oli meningkat (Lv. ${lvl})`,
  },

  // Vehicle & Combat Passives
  {
    id: 'passive-armor',
    name: 'Armor Baja',
    category: 'vehicle',
    rarity: 'legendary',
    maxLevel: 5,
    iconType: 'armor',
    description: 'Menambah maksimum HP +30% dan memulihkan 35 HP seketika.',
    effectText: (lvl) => `Max HP +${lvl * 30}% & tahan benturan`,
  },
  {
    id: 'passive-damage',
    name: 'Bensin Oktan Tinggi',
    category: 'combat',
    rarity: 'epic',
    maxLevel: 5,
    iconType: 'damage',
    description: 'Meningkatkan damage seluruh senjata dan serangan sebesar +20%.',
    effectText: (lvl) => `Total Damage +${lvl * 20}%`,
  },
  {
    id: 'passive-firerate',
    name: 'Busi Racing',
    category: 'combat',
    rarity: 'rare',
    maxLevel: 5,
    iconType: 'firerate',
    description: 'Meningkatkan kecepatan tembak dan mengurangi cooldown senjata +15%.',
    effectText: (lvl) => `Fire Rate +${lvl * 15}%`,
  },
  {
    id: 'passive-speed',
    name: 'Ban Slick Balap',
    category: 'vehicle',
    rarity: 'common',
    maxLevel: 5,
    iconType: 'speed',
    description: 'Meningkatkan kecepatan manuver kendaraan sebesar +12%.',
    effectText: (lvl) => `Kecepatan Gerak +${lvl * 12}%`,
  },
  {
    id: 'passive-magnet',
    name: 'Magnet Rezeki',
    category: 'special',
    rarity: 'common',
    maxLevel: 5,
    iconType: 'magnet',
    description: 'Memperluas radius penarik XP dan Koin sebesar +45%.',
    effectText: (lvl) => `Radius Ambil XP +${lvl * 45}%`,
  },
  {
    id: 'passive-cooldown',
    name: 'Kapasitor Turbo',
    category: 'special',
    rarity: 'rare',
    maxLevel: 5,
    iconType: 'cooldown',
    description: 'Mengurangi waktu tunggu skill spesial (SPACE) sebesar 15% & tambah damage skill.',
    effectText: (lvl) => `Cooldown Skill -${lvl * 15}%`,
  },
  {
    id: 'passive-regen',
    name: 'Montir Darurat',
    category: 'vehicle',
    rarity: 'rare',
    maxLevel: 5,
    iconType: 'regen',
    description: 'Memperbaiki kendaraan secara otomatis setiap detik selama berkendara.',
    effectText: (lvl) => `ulihkan +${lvl * 2.5} HP / detik`,
  },
];
