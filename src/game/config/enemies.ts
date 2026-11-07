export type EnemyArchetype =
  | 'angkot-chaos'
  | 'lawan-arah'
  | 'truk-odol'
  | 'proyek-jalan'
  | 'polisi-lalu-lintas';

export type BossArchetype =
  | 'raja-odol'
  | 'kontraktor-abadi'
  | 'raja-lawan-arah'
  | 'sultan-busway'
  | 'derek-siluman'
  | 'patwal-vip';

export interface EnemyArchetypeConfig {
  id: EnemyArchetype;
  name: string;
  badgeText: string;
  description: string;
  baseHp: number;
  baseSpeed: number;
  contactDamage: number;
  xpValue: number;
  coinChance: number;
  coinValue: number;
  scoreValue: number;
  width: number;
  height: number;
  color: string;
}

export interface BossConfig {
  id: BossArchetype;
  name: string;
  subtitle: string;
  description: string;
  spawnTimeSec: number;
  baseHp: number;
  contactDamage: number;
  xpReward: number;
  coinReward: number;
  scoreReward: number;
  width: number;
  height: number;
  color: string;
}

export const ENEMY_ARCHETYPES: Record<EnemyArchetype, EnemyArchetypeConfig> = {
  'angkot-chaos': {
    id: 'angkot-chaos',
    name: 'Angkot Chaos',
    badgeText: 'ANGKOT CHAOS',
    description: 'Mikrolet ugal-ugalan yang sering pindah jalur dan berhenti mendadak tanpa lampu sein.',
    baseHp: 42,
    baseSpeed: 135,
    contactDamage: 14,
    xpValue: 18,
    coinChance: 0.45,
    coinValue: 10,
    scoreValue: 120,
    width: 46,
    height: 82,
    color: '#F97316',
  },
  'lawan-arah': {
    id: 'lawan-arah',
    name: 'Lawan Arah',
    badgeText: 'LAWAN ARAH!',
    description: 'Pengendara nekat yang melaju kencang melawan arus langsung ke arah kendaraanmu.',
    baseHp: 24,
    baseSpeed: 290,
    contactDamage: 18,
    xpValue: 22,
    coinChance: 0.5,
    coinValue: 12,
    scoreValue: 150,
    width: 30,
    height: 58,
    color: '#EF4444',
  },
  'truk-odol': {
    id: 'truk-odol',
    name: 'Truk ODOL',
    badgeText: 'TRUK ODOL',
    description: 'Truk Over Dimension Over Loading ber-HP tebal yang menjatuhkan muatan kargo berbahaya.',
    baseHp: 135,
    baseSpeed: 85,
    contactDamage: 26,
    xpValue: 45,
    coinChance: 0.85,
    coinValue: 25,
    scoreValue: 320,
    width: 60,
    height: 124,
    color: '#3B82F6',
  },
  'proyek-jalan': {
    id: 'proyek-jalan',
    name: 'Proyek Jalan Dadakan',
    badgeText: 'PROYEK DADAKAN',
    description: 'Unit konstruksi yang memasang barikade beton dan cone lalu lintas di tengah jalan.',
    baseHp: 68,
    baseSpeed: 105,
    contactDamage: 16,
    xpValue: 30,
    coinChance: 0.6,
    coinValue: 16,
    scoreValue: 210,
    width: 50,
    height: 88,
    color: '#FACC15',
  },
  'polisi-lalu-lintas': {
    id: 'polisi-lalu-lintas',
    name: 'Patroli Sirene',
    badgeText: 'PATROLI RAZIA',
    description: 'Kendaraan patroli cepat yang mengejar pemain dan memancarkan gelombang sirene pelambat.',
    baseHp: 56,
    baseSpeed: 205,
    contactDamage: 16,
    xpValue: 34,
    coinChance: 0.65,
    coinValue: 20,
    scoreValue: 250,
    width: 44,
    height: 80,
    color: '#38BDF8',
  },
};

export const BOSS_ARCHETYPES: BossConfig[] = [
  {
    id: 'raja-odol',
    name: 'RAJA ODOL',
    subtitle: 'Penguasa Muatan Berlebih',
    description: 'Truk tambang raksasa bermuatan penuh yang menumpahkan kargo berbahaya, peluru asap diesel, dan serudukan steamroller.',
    spawnTimeSec: 60,
    baseHp: 1800,
    contactDamage: 35,
    xpReward: 350,
    coinReward: 350,
    scoreReward: 5000,
    width: 116,
    height: 185,
    color: '#F59E0B',
  },
  {
    id: 'kontraktor-abadi',
    name: 'KONTRAKTOR ABADI',
    subtitle: 'Arsitek Galian Tanpa Akhir',
    description: 'Mesin konstruksi lapis baja yang menyebar mortir aspal panas berapi dan barikade beton pembatas jalan.',
    spawnTimeSec: 135,
    baseHp: 3200,
    contactDamage: 40,
    xpReward: 600,
    coinReward: 600,
    scoreReward: 8500,
    width: 124,
    height: 170,
    color: '#FACC15',
  },
  {
    id: 'raja-lawan-arah',
    name: 'RAJA LAWAN ARAH',
    subtitle: 'Komandan Konvoi Nekat',
    description: 'Kendaraan tempur modifikasi super cepat yang memanggil konvoi geng motor lawan arah dan tembakan spiral shuriken knalpot.',
    spawnTimeSec: 210,
    baseHp: 4800,
    contactDamage: 45,
    xpReward: 1000,
    coinReward: 1000,
    scoreReward: 15000,
    width: 100,
    height: 160,
    color: '#EF4444',
  },
  {
    id: 'sultan-busway',
    name: 'SULTAN BUSWAY GANDENG',
    subtitle: 'Benteng Merah TransJakarta',
    description: 'Bus gandeng raksasa 2 lajur dengan Klakson Telolet Basuri 130dB yang menghempaskan pemain dan barikade divider beton laser.',
    spawnTimeSec: 285,
    baseHp: 6400,
    contactDamage: 50,
    xpReward: 1400,
    coinReward: 1400,
    scoreReward: 22000,
    width: 136,
    height: 230,
    color: '#DC2626',
  },
  {
    id: 'derek-siluman',
    name: 'MOBIL DEREK SILUMAN',
    subtitle: 'Pemburu Pelanggar Jalur',
    description: 'Mobil derek taktis hitam-kuning dengan harpoon kabel baja penarik magnetik, ranjau roda bergerigi, dan asap cumi hitam pekat.',
    spawnTimeSec: 360,
    baseHp: 8200,
    contactDamage: 55,
    xpReward: 1900,
    coinReward: 1900,
    scoreReward: 30000,
    width: 115,
    height: 190,
    color: '#EAB308',
  },
  {
    id: 'patwal-vip',
    name: 'KONVOI PATWAL VIP',
    subtitle: 'Pengawal VVIP Ibu Kota',
    description: 'Konvoi kepresidenan lapis baja dengan barikade strobo laser 360°, rentetan stun taser kejut, dan formasi kawal moge serbu.',
    spawnTimeSec: 435,
    baseHp: 10500,
    contactDamage: 60,
    xpReward: 2500,
    coinReward: 2500,
    scoreReward: 42000,
    width: 128,
    height: 200,
    color: '#3B82F6',
  },
];
