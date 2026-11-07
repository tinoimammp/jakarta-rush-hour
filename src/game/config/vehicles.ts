export type VehicleId =
  | 'motor-ojol'
  | 'bajaj'
  | 'city-car'
  | 'angkot'
  | 'pickup-truck'
  | 'police-car'
  | 'heavy-truck'
  | 'crazy-rich';

export interface VehicleStats {
  hp: number;
  speed: number; // display scale 1-10
  moveSpeedPx: number; // actual Phaser speed in px/sec
  damage: number;
  fireRate: number; // shots per second display
  collisionResistance: number; // 0 to 0.6 reduction
  hitboxRadius: number;
}

export interface VehicleConfig {
  id: VehicleId;
  name: string;
  code: string;
  subtitle: string;
  description: string;
  unlockCost: number;
  startingWeapon: 'double-shot' | 'klakson-sonic' | 'roket-knalpot' | 'petir-pln' | 'oli-tumpah';
  basicWeaponName: string;
  basicWeaponSubtitle: string;
  basicWeaponDescription: string;
  basicLevelDescriptions: string[];
  specialName: string;
  specialDescription: string;
  specialCooldown: number; // seconds
  primaryColor: string;
  accentColor: string;
  stats: VehicleStats;
}

export const VEHICLES: VehicleConfig[] = [
  {
    id: 'motor-ojol',
    name: 'Motor Ojol',
    code: 'C1-110',
    subtitle: 'Andalan Pejuang Rupiah',
    description: 'Lincah, cepat, dan andalan menembus macet Jakarta. Ukuran ramping memudahkan selap-selip di sela barikade.',
    unlockCost: 0,
    startingWeapon: 'double-shot',
    basicWeaponName: 'Panah Bintang Lima',
    basicWeaponSubtitle: 'Dart Starlight Kecepatan Tinggi',
    basicWeaponDescription: 'Menembakkan panah dart bintang zamrud neon beruntun kilat dengan jejak stardust emas.',
    basicLevelDescriptions: [
      'Menembakkan 2 dart bintang zamrud ke depan.',
      'Damage +30% & kecepatan dart bintang meningkat.',
      'Menembakkan 3 dart bintang sekaligus dalam formasi menyebar.',
      'Kecepatan tembak +25% & sebaran stardust emas lebih luas.',
      'Menembakkan 4 dart bintang tajam dengan daya tembus (piercing).',
    ],
    specialName: 'Konvoi Solidaritas Ojol',
    specialDescription: 'Memanggil 6 pasukan Motor Ojol bintang lima yang menyapu seluruh lajur jalanan, menghujani peluru beruntun, menggilas rintangan, dan menyedot semua XP & Koin!',
    specialCooldown: 8,
    primaryColor: '#22C55E',
    accentColor: '#FACC15',
    stats: {
      hp: 120,
      speed: 8.5,
      moveSpeedPx: 330,
      damage: 12,
      fireRate: 5.0,
      collisionResistance: 0.1,
      hitboxRadius: 18,
    },
  },
  {
    id: 'bajaj',
    name: 'Bajaj Oranye BBG',
    code: 'BJ-200X',
    subtitle: 'Raja Putar Balik Tiga Roda',
    description: 'Roda tiga legendaris Jakarta bertenaga gas BBG ramah lingkungan. Dikenal punya manuver belok dan putar balik 360° yang tak terduga.',
    unlockCost: 800,
    startingWeapon: 'klakson-sonic',
    basicWeaponName: 'Knalpot Api 2-Tak',
    basicWeaponSubtitle: 'Semburan Lidah Api Knalpot Cempreng',
    basicWeaponDescription: 'Semburan api oranye-kuning kerucut bertekanan tinggi dari knalpot legendaris yang menembus musuh.',
    basicLevelDescriptions: [
      'Menyemburkan lidah api 2-tak yang menembus barisan lawan.',
      'Jangkauan semburan api +30% & damage bakar meningkat.',
      'Sudut semburan api lebih lebar (cone blast) menyapu 2 lajur.',
      'Frekuensi semburan api knalpot meningkat 25%.',
      'Semburan api biru super panas bersuhu tinggi membakar habis rintangan.',
    ],
    specialName: 'Putar Balik 360° & Knalpot Cempreng',
    specialDescription: 'Melakukan aksi putar balik 360° berkecepatan tinggi sambil menyemburkan api knalpot 2-tak melingkar, melumpuhkan lawan, dan memanggil 2 Bajaj kawan untuk mengawal!',
    specialCooldown: 8.5,
    primaryColor: '#F97316',
    accentColor: '#FDE047',
    stats: {
      hp: 145,
      speed: 8.2,
      moveSpeedPx: 315,
      damage: 16,
      fireRate: 5.2,
      collisionResistance: 0.16,
      hitboxRadius: 20,
    },
  },
  {
    id: 'city-car',
    name: 'City Car Turbo',
    code: 'HB-1200',
    subtitle: 'Raja Tol Dalam Kota',
    description: 'Mobil hatchback modifikasi dengan sasis ringan, handling responsif, dan sistem tembakan plasma terkalibrasi.',
    unlockCost: 1500,
    startingWeapon: 'double-shot',
    basicWeaponName: 'Plasma Tol Gateless',
    basicWeaponSubtitle: 'Meriam Ion Plasma Multi-Lajur',
    basicWeaponDescription: 'Baut plasma cyan elektrik berkecepatan sonik dengan jejak akselerasi magnetik.',
    basicLevelDescriptions: [
      'Menembakkan 2 baut energi plasma cyan berkecepatan tinggi.',
      'Damage ion plasma +30% dan kecepatan laju meningkat.',
      'Menembakkan 3 baut plasma dalam formasi paralel sapuan jalan.',
      'Cooldown tembakan berkurang 20% & efek kilatan ionik.',
      '4 baut plasma elektromagnetik raksasa berdaya hancur tinggi.',
    ],
    specialName: 'Laser Tol & Plasma Drift',
    specialDescription: 'Menembakkan meriam Twin-Laser Plasma raksasa yang menyapu jalanan kiri-kanan sekaligus memicu badai peluru spiral 360° dan bayangan klon kecepatannya!',
    specialCooldown: 10,
    primaryColor: '#E2E8F0',
    accentColor: '#06B6D4',
    stats: {
      hp: 160,
      speed: 7.8,
      moveSpeedPx: 305,
      damage: 15,
      fireRate: 5.5,
      collisionResistance: 0.2,
      hitboxRadius: 24,
    },
  },
  {
    id: 'angkot',
    name: 'Angkot Racing',
    code: 'M-44X',
    subtitle: 'Penguasa Jalur Trayek',
    description: 'Mikrolet legendaris yang dimodifikasi dengan bodi baja dan speaker audio bass berdaya hancur tinggi.',
    unlockCost: 2800,
    startingWeapon: 'klakson-sonic',
    basicWeaponName: 'Dentuman Subwoofer 5000W',
    basicWeaponSubtitle: 'Gelombang Kejut Akustik Bass Rendah',
    basicWeaponDescription: 'Piringan gelombang sonik magenta raksasa yang meluas dan menghantam gerombolan musuh sekaligus.',
    basicLevelDescriptions: [
      'Memancarkan gelombang sonik bass akustik menembus musuh.',
      'Diameter piringan sonik +35% & damage bass meningkat.',
      'Gelombang sonik memancarkan 2 cincin kejut berurutan.',
      'Getaran subwoofer memperlambat kendaraan lawan di sekitarnya.',
      'Badai bass 5000W dahsyat berfrekuensi resonansi mematikan.',
    ],
    specialName: 'Dugem Ngetem 10.000 Watt',
    specialDescription: 'Menggelar pesta lampu disko & equalizer jalanan selama 4 detik! 6 dentuman Bass Drop raksasa membuat semua musuh berputar-putar pusing dan terkena damage beruntun!',
    specialCooldown: 9,
    primaryColor: '#F97316',
    accentColor: '#38BDF8',
    stats: {
      hp: 200,
      speed: 7.0,
      moveSpeedPx: 280,
      damage: 18,
      fireRate: 4.5,
      collisionResistance: 0.3,
      hitboxRadius: 26,
    },
  },
  {
    id: 'pickup-truck',
    name: 'Pickup Tempur',
    code: 'L-300GT',
    subtitle: 'Kargo Lintas Provinsi',
    description: 'Pickup pengangkut logistik tempur dengan peluncur roket knalpot ganda dan sasis tahan banting.',
    unlockCost: 4500,
    startingWeapon: 'roket-knalpot',
    basicWeaponName: 'Roket Tabung Melon (LPG 3kg)',
    basicWeaponSubtitle: 'Lontaran Tabung Gas Berdaya Ledak Kawah',
    basicWeaponDescription: 'Melontarkan tabung gas melon 3kg berputar dengan ledakan kawah api area saat mengenai sasaran.',
    basicLevelDescriptions: [
      'Melontarkan 1 tabung gas melon yang meledak saat benturan.',
      'Radius ledakan kawah api +35% & damage ledakan bertambah.',
      'Melontarkan 2 tabung gas melon sekaligus ke dua titik lajur.',
      'Kecepatan lontaran meningkat 25% dan sisa api membakar jalan.',
      'Hujan 3 tabung gas melon berhulu ledak masif meledakkan seisi jalan.',
    ],
    specialName: 'Hujan Tabung Gas Melon',
    specialDescription: 'Melontarkan 16 Tabung Gas Melon 3 Kg & roket knalpot ke udara yang membombardir seluruh jalanan dengan ledakan berantai dan kobaran api napalm!',
    specialCooldown: 11,
    primaryColor: '#38BDF8',
    accentColor: '#FACC15',
    stats: {
      hp: 250,
      speed: 6.4,
      moveSpeedPx: 260,
      damage: 24,
      fireRate: 4.0,
      collisionResistance: 0.4,
      hitboxRadius: 28,
    },
  },
  {
    id: 'police-car',
    name: 'Patroli Presisi',
    code: 'POL-911',
    subtitle: 'Pengaman Tol & Penegak Hukum',
    description: 'Sedan kepolisian interceptor berdaya pacu tinggi dengan sistem strobo frekuensi kejut dan radio panggil satuan cepat.',
    unlockCost: 6500,
    startingWeapon: 'petir-pln',
    basicWeaponName: 'Strobo EMP Polisi',
    basicWeaponSubtitle: 'Berkas Laser Kembar Merah & Biru',
    basicWeaponDescription: 'Tembakan laser kembar merah-biru berkedip cepat dengan kilatan listrik yang memperlambat musuh.',
    basicLevelDescriptions: [
      'Menembakkan sepasang berkas laser strobo merah dan biru.',
      'Tegangan laser meningkat, memperpanjang durasi slow lawan.',
      'Menembakkan 4 berkas laser strobo menyapu lajur depan.',
      'Damage sengatan listrik bertambah 35% & frekuensi tembakan naik.',
      'Sinar laser EMP tegangan tinggi melumpuhkan total sistem elektronik lawan.',
    ],
    specialName: 'Razia Gabungan & Sirene Strobo',
    specialDescription: 'Menyalakan strobo menyilaukan yang membekukan seluruh musuh di layar selama 3.5 detik, lalu mengerahkan Truk Water Cannon barikade yang menyapu bersih seluruh lajur jalan!',
    specialCooldown: 11.5,
    primaryColor: '#1E40AF',
    accentColor: '#EF4444',
    stats: {
      hp: 270,
      speed: 8.0,
      moveSpeedPx: 312,
      damage: 22,
      fireRate: 4.8,
      collisionResistance: 0.45,
      hitboxRadius: 26,
    },
  },
  {
    id: 'heavy-truck',
    name: 'Truk Kepala Kuning',
    code: 'HD-800',
    subtitle: 'Raksasa Pantura',
    description: 'Benteng berjalan berlapis baja tebal yang sanggup menahan gempuran bos dan melindas rintangan jalan.',
    unlockCost: 8500,
    startingWeapon: 'petir-pln',
    basicWeaponName: 'Meriam Baja Pantura',
    basicWeaponSubtitle: 'Proyektil Sabot Kinetik Tungsten Penembus Lapis Baja',
    basicWeaponDescription: 'Peluru sabot kinetik tungsten berat yang menembus garis lurus hingga 4 musuh tanpa melambat.',
    basicLevelDescriptions: [
      'Menembakkan peluru baja tungsten yang menembus 2 kendaraan lawan.',
      'Daya tembus meningkat hingga menembus 3 target berturut-turut.',
      'Bobot proyektil bertambah, memberi damage kinetik masif.',
      'Menembakkan 2 peluru baja paralel yang meratakan barikade jalan.',
      'Peluru sabot lapis baja super berat menembus 5 target sekaligus.',
    ],
    specialName: 'Seruduk Baja & Badai SUTET',
    specialDescription: 'Memasang Bemper Baja Pantura raksasa di depan truk, memulihkan +35 HP, serta menurunkan 12 pilar petir SUTET bertegangan tinggi yang menyambar seluruh musuh & Bos!',
    specialCooldown: 12,
    primaryColor: '#FACC15',
    accentColor: '#EF4444',
    stats: {
      hp: 340,
      speed: 5.5,
      moveSpeedPx: 235,
      damage: 32,
      fireRate: 3.6,
      collisionResistance: 0.55,
      hitboxRadius: 32,
    },
  },
  {
    id: 'crazy-rich',
    name: 'Supercar Sultan PIK',
    code: 'B-1-BOS',
    subtitle: 'Kemewahan Tanpa Batas',
    description: 'Hypercar emas titanium milik Crazy Rich Jakarta. Kecepatan maksimal dengan sistem laser kuantum dan magnet penarik cuan otomatis.',
    unlockCost: 12500,
    startingWeapon: 'double-shot',
    basicWeaponName: 'Shuriken Berlian & Koin Kripto',
    basicWeaponSubtitle: 'Bilah Berlian Berputar & Hamburan Emas Murni',
    basicWeaponDescription: 'Bilah shuriken kristal berlian berputar prismatik dengan hamburan koin emas dan peluang critical strike.',
    basicLevelDescriptions: [
      'Melempar 2 shuriken berlian berputar dengan percikan koin emas.',
      'Peluang critical damage bertambah 25% & damage shuriken naik.',
      'Melempar 3 shuriken berlian dalam sudut sebaran kipas mewah.',
      'Hamburan koin emas menghasilkan ledakan kilau berkilauan.',
      'Badai 4 shuriken berlian tajam berputar dengan 100% critical damage!',
    ],
    specialName: 'Hujan Cuan & Laser Kripto Emas',
    specialDescription: 'Menghujani jalanan dengan ribuan koin emas dan gepokan uang berpeledak, melipatgandakan koin yang didapat, serta menembakkan 4 pilar laser kuantum emas yang membakar bos!',
    specialCooldown: 10.5,
    primaryColor: '#EAB308',
    accentColor: '#06B6D4',
    stats: {
      hp: 230,
      speed: 9.6,
      moveSpeedPx: 365,
      damage: 30,
      fireRate: 6.2,
      collisionResistance: 0.35,
      hitboxRadius: 25,
    },
  },
];

export function getVehicleById(id: VehicleId): VehicleConfig {
  return VEHICLES.find((v) => v.id === id) ?? VEHICLES[0];
}
