export type WeaponId =
  | 'double-shot'
  | 'klakson-sonic'
  | 'roket-knalpot'
  | 'petir-pln'
  | 'oli-tumpah';

export interface WeaponConfig {
  id: WeaponId;
  name: string;
  description: string;
  color: string;
  baseDamage: number;
  baseCooldownMs: number;
  baseRange: number;
  maxLevel: number;
  levelDescriptions: string[];
}

export const WEAPONS: Record<WeaponId, WeaponConfig> = {
  'double-shot': {
    id: 'double-shot',
    name: 'Double Shot',
    description: 'Menembakkan proyektil kembar berkecepatan tinggi ke arah bidikan.',
    color: '#38BDF8',
    baseDamage: 14,
    baseCooldownMs: 220,
    baseRange: 650,
    maxLevel: 5,
    levelDescriptions: [
      'Menembakkan 2 proyektil energi ke depan.',
      'Damage +25% dan kecepatan proyektil meningkat.',
      'Menembakkan 3 proyektil sekaligus dalam formasi menyebar.',
      'Cooldown tembakan lebih cepat 20% & damage +30%.',
      'Menembakkan 4 proyektil plasma berdaya tembus tinggi.',
    ],
  },
  'klakson-sonic': {
    id: 'klakson-sonic',
    name: 'Klakson Sonic',
    description: 'Melepaskan gelombang suara yang memberi damage dan mendorong musuh di sekitar.',
    color: '#A855F7',
    baseDamage: 22,
    baseCooldownMs: 1900,
    baseRange: 175,
    maxLevel: 5,
    levelDescriptions: [
      'Memancarkan gelombang suara 360° yang mendorong musuh.',
      'Radius gelombang +25% dan damage +30%.',
      'Cooldown berkurang 25% dan dorongan lebih kuat.',
      'Memancarkan gelombang kejut ganda setiap aktivasi.',
      'Gelombang supersonik raksasa yang menghancurkan proyektil musuh.',
    ],
  },
  'roket-knalpot': {
    id: 'roket-knalpot',
    name: 'Roket Knalpot',
    description: 'Meluncurkan roket berdaya ledak area (AoE) yang menghancurkan gerombolan macet.',
    color: '#F97316',
    baseDamage: 42,
    baseCooldownMs: 1650,
    baseRange: 580,
    maxLevel: 5,
    levelDescriptions: [
      'Meluncurkan 1 roket peledak ke target terdekat.',
      'Radius ledakan +30% dan damage +25%.',
      'Meluncurkan 2 roket knalpot sekaligus.',
      'Cooldown berkurang 25% dan kecepatan roket meningkat.',
      'Meluncurkan 3 roket hulu ledak tinggi dengan efek bakar area.',
    ],
  },
  'petir-pln': {
    id: 'petir-pln',
    name: 'Petir PLN',
    description: 'Menciptakan sambaran petir berantai yang melompat antar kendaraan musuh.',
    color: '#06B6D4',
    baseDamage: 26,
    baseCooldownMs: 1450,
    baseRange: 340,
    maxLevel: 5,
    levelDescriptions: [
      'Menyambar hingga 3 musuh terdekat secara berantai.',
      'Jumlah lompatan petir +1 (total 4 target) & damage +25%.',
      'Cooldown lebih cepat 20% dan jangkauan lompatan meningkat.',
      'Jumlah lompatan petir +2 (total 6 target) & efek kejut singkat.',
      'Badai petir berantai menyambar 8 target dengan damage kritis.',
    ],
  },
  'oli-tumpah': {
    id: 'oli-tumpah',
    name: 'Oli Tumpah',
    description: 'Menjatuhkan jebakan oli licin di aspal yang memperlambat dan merusak musuh.',
    color: '#FACC15',
    baseDamage: 12,
    baseCooldownMs: 2200,
    baseRange: 110,
    maxLevel: 5,
    levelDescriptions: [
      'Menjatuhkan kubangan oli yang memperlambat musuh 40%.',
      'Ukuran kubangan oli +30% dan damage per detik meningkat.',
      'Menjatuhkan 2 kubangan oli sekaligus di jalur belakang.',
      'Durasi oli lebih lama dan memperlambat musuh hingga 60%.',
      'Oli terbakar otomatis, memberikan damage api besar secara berkala.',
    ],
  },
};

export const WEAPON_LIST: WeaponConfig[] = Object.values(WEAPONS);
