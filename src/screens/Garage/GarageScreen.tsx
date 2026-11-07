import { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Lock,
  Coins,
  Heart,
  Gauge,
  Shield,
  Sparkles,
  Wrench,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { VEHICLES, getVehicleById } from '../../game/config/vehicles';
import { useGameStore } from '../../stores/gameStore';
import { useGarageStore } from '../../stores/garageStore';
import { useProgressionStore, WorkshopStatKey } from '../../stores/progressionStore';
import { VehicleIllustration } from '../../components/GameIcon/VehicleIllustration';
import { audioSystem } from '../../game/systems/AudioSystem';

const WORKSHOP_ITEMS: Array<{
  key: WorkshopStatKey;
  name: string;
  desc: string;
  bonusPerLevel: string;
}> = [
  {
    key: 'chassis',
    name: 'Rangka Sasis Baja',
    desc: 'Meningkatkan Maksimum HP seluruh kendaraan secara permanen.',
    bonusPerLevel: '+10% Max HP / Lv',
  },
  {
    key: 'engine',
    name: 'Mesin Bore-Up Jakarta',
    desc: 'Meningkatkan kecepatan akselerasi dan kelincahan selap-selip.',
    bonusPerLevel: '+6% Kecepatan / Lv',
  },
  {
    key: 'weapons',
    name: 'Kalibrasi Senjata Tempur',
    desc: 'Meningkatkan damage dasar seluruh senjata dan roket.',
    bonusPerLevel: '+8% Damage / Lv',
  },
  {
    key: 'exhaust',
    name: 'Knalpot Racing Pro',
    desc: 'Meningkatkan kecepatan tembak (Fire Rate) semua senjata.',
    bonusPerLevel: '+7% Fire Rate / Lv',
  },
  {
    key: 'magnet',
    name: 'Kumparan Magnet Rezeki',
    desc: 'Memperluas jangkauan penarik XP Cube dan Koin di jalanan.',
    bonusPerLevel: '+15% Area Magnet / Lv',
  },
];

export function GarageScreen() {
  const [activeTab, setActiveTab] = useState<'KENDARAAN' | 'UPGRADE'>('KENDARAAN');
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const setScreen = useGameStore((s) => s.setScreen);

  const {
    selectedVehicle,
    equippedVehicle,
    unlockedVehicles,
    selectVehicle,
    equipVehicle,
    unlockVehicle,
  } = useGarageStore();

  const {
    coins,
    tokens,
    exchangeTokensForCoins,
    workshopLevels,
    upgradeWorkshopStat,
    getWorkshopUpgradeCost,
  } = useProgressionStore();

  const currentVehicle = getVehicleById(selectedVehicle);
  const isUnlocked = unlockedVehicles.includes(selectedVehicle);
  const isEquipped = equippedVehicle === selectedVehicle;
  const currentIndex = VEHICLES.findIndex((v) => v.id === selectedVehicle);

  const handlePrev = () => {
    audioSystem.playUiClick();
    const prevIdx = (currentIndex - 1 + VEHICLES.length) % VEHICLES.length;
    selectVehicle(VEHICLES[prevIdx].id);
  };

  const handleNext = () => {
    audioSystem.playUiClick();
    const nextIdx = (currentIndex + 1) % VEHICLES.length;
    selectVehicle(VEHICLES[nextIdx].id);
  };

  const handleEquipOrUnlock = () => {
    audioSystem.playUiClick();
    if (isUnlocked) {
      equipVehicle(selectedVehicle);
    } else {
      unlockVehicle(selectedVehicle);
    }
  };

  const handleExchange = (tokenCost: number, coinsGained: number) => {
    const success = exchangeTokensForCoins(tokenCost, coinsGained);
    if (success) {
      audioSystem.playCoinCollect();
    } else {
      audioSystem.playUiClick();
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0D1526] flex flex-col overflow-hidden select-none safe-area-pad">
      {/* Illustrated Garage Workshop Background */}
      <img
        src="/assets/extracted/bg_garage_clean.png"
        alt="Garage Workshop"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90"
      />

      {/* Responsive Top Navigation Bar */}
      <header className="relative z-20 flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#0E1628]/95 border-b border-slate-700/80 shadow-lg shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Back Button + GARASI Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={() => {
                audioSystem.playUiClick();
                setScreen('MAIN_MENU');
              }}
              aria-label="Kembali ke Menu Utama"
              className="btn-arcade-dark px-3 sm:px-3.5 py-1.5 rounded-lg text-white flex items-center justify-center cursor-pointer min-h-[40px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <span className="font-display font-black italic text-xl sm:text-3xl tracking-wider text-white uppercase drop-shadow">
              GARASI
            </span>
          </div>

          {/* Mobile Currency Pills (Clean, no infinite clicker bug) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Coins */}
            <div className="flex items-center gap-1 bg-[#141D30] border border-slate-600/80 rounded-lg px-2 py-1 shadow-inner">
              <div className="w-4 h-4 rounded-full bg-gradient-to-b from-[#FDE047] to-[#CA8A04] border border-[#FEF08A] flex items-center justify-center text-[9px] font-black text-[#0F172A]">
                $
              </div>
              <span className="text-xs font-extrabold text-white font-mono-tabular">
                {coins.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Diamonds with Tukar action */}
            <button
              onClick={() => {
                audioSystem.playUiClick();
                setShowExchangeModal(true);
              }}
              title="Tukar Diamond ke Koin"
              className="flex items-center gap-1 bg-[#141D30] hover:bg-[#1E293B] border border-sky-500/60 rounded-lg px-2 py-1 shadow-inner cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                <path
                  d="M6 3H18L22 9L12 21L2 9L6 3Z"
                  fill="#38BDF8"
                  stroke="#E0F2FE"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-xs font-extrabold text-sky-400 font-mono-tabular">
                {tokens.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-400/30">
                TUKAR
              </span>
            </button>
          </div>
        </div>

        {/* Center: Joined Skewed Parallelogram Tabs (KENDARAAN | UPGRADE) */}
        <div
          className="flex items-center justify-center bg-[#182235] p-1 rounded-lg border border-slate-600/80 shadow-inner self-center w-full max-w-[320px] md:w-auto"
          style={{ transform: 'skewX(-12deg)' }}
        >
          <button
            onClick={() => {
              audioSystem.playUiClick();
              setActiveTab('KENDARAAN');
            }}
            className={`flex-1 md:flex-initial px-4 sm:px-8 py-1.5 rounded-md font-display font-black text-xs sm:text-sm tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
              activeTab === 'KENDARAAN'
                ? 'bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#CA8A04] text-[#0F172A] shadow-[0_0_12px_rgba(250,204,21,0.5)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>
              KENDARAAN
            </span>
          </button>

          <button
            onClick={() => {
              audioSystem.playUiClick();
              setActiveTab('UPGRADE');
            }}
            className={`flex-1 md:flex-initial px-4 sm:px-8 py-1.5 rounded-md font-display font-black text-xs sm:text-sm tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
              activeTab === 'UPGRADE'
                ? 'bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#CA8A04] text-[#0F172A] shadow-[0_0_12px_rgba(250,204,21,0.5)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>
              UPGRADE
            </span>
          </button>
        </div>

        {/* Right: Desktop/Tablet Coins & Diamonds Badges */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 bg-[#141D30] border border-slate-600/80 rounded-lg px-3.5 py-1.5 shadow-inner">
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#FDE047] to-[#CA8A04] border border-[#FEF08A] flex items-center justify-center text-[10px] font-black text-[#0F172A]">
              $
            </div>
            <span className="text-sm sm:text-base font-extrabold text-white font-mono-tabular">
              {coins.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#141D30] border border-slate-600/80 rounded-lg pl-3 pr-2 py-1 shadow-inner">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path
                d="M6 3H18L22 9L12 21L2 9L6 3Z"
                fill="#38BDF8"
                stroke="#E0F2FE"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-sm sm:text-base font-extrabold text-sky-400 font-mono-tabular">
              {tokens.toLocaleString('id-ID')}
            </span>
            <button
              onClick={() => {
                audioSystem.playUiClick();
                setShowExchangeModal(true);
              }}
              title="Tukar Diamond ke Koin"
              className="ml-1 px-2 py-1 rounded bg-[#25324B] hover:bg-[#334466] border border-sky-400/40 text-[11px] font-black text-amber-400 cursor-pointer flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>TUKAR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === 'KENDARAAN' ? (
        <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5 px-3 sm:px-6 py-3 sm:py-4 overflow-y-auto pb-12 md:pb-6">
          {/* 1. Vehicle Selector:
              - Desktop/Tablet (md+): Left Column (md:col-span-3, vertical list, max-h-[500px])
              - Mobile (< md): Middle row between preview & stats (order-2), horizontal smooth scrollbar with label
          */}
          <div className="order-2 md:order-1 md:col-span-3 bg-[#0B1220]/92 border-2 border-slate-700/80 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 shadow-2xl">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Pilih Kendaraan
              </span>
              <span className="text-[10px] font-mono-tabular font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                {unlockedVehicles.length}/{VEHICLES.length} Terbuka
              </span>
            </div>

            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto snap-x snap-mandatory no-scrollbar md:max-h-[460px] py-1">
              {VEHICLES.map((v) => {
                const unlocked = unlockedVehicles.includes(v.id);
                const selected = selectedVehicle === v.id;

                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      audioSystem.playUiClick();
                      selectVehicle(v.id);
                    }}
                    className={`snap-center relative min-w-[110px] sm:min-w-[125px] md:min-w-0 md:w-full h-20 sm:h-22 rounded-xl p-2 flex flex-col items-center justify-center transition-all cursor-pointer shrink-0 ${
                      selected
                        ? 'bg-gradient-to-b from-[#3B3516] to-[#262312] border-2 border-[#FACC15] shadow-[0_0_16px_rgba(250,204,21,0.75),inset_0_0_12px_rgba(250,204,21,0.35)]'
                        : 'bg-[#151F32]/90 border border-slate-700/80 hover:border-slate-500'
                    }`}
                  >
                    <VehicleIllustration
                      vehicleId={v.id}
                      variant="thumb"
                      locked={!unlocked}
                      className="w-24 sm:w-28 h-14 sm:h-16"
                    />

                    {!unlocked && (
                      <div className="absolute bottom-1.5 right-2 text-slate-200 drop-shadow">
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-200 text-[#0F172A]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Center Podium Showcase: Order 1 on Mobile, Order 2 on Desktop (Center 5 Columns) */}
          <div className="order-1 md:order-2 md:col-span-5 flex flex-col items-center justify-start md:justify-center relative bg-[#0B1220]/60 md:bg-transparent rounded-2xl p-3 md:p-0 border border-slate-700/50 md:border-0 shadow-xl md:shadow-none">
            {/* Title & Code Badge */}
            <div className="text-center mb-1.5">
              <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white leading-tight drop-shadow">
                {currentVehicle.name}
              </h2>
              <div className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5">
                {currentVehicle.subtitle} · <span className="text-slate-300 font-mono-tabular">({currentVehicle.code})</span>
              </div>
            </div>

            {/* Turntable Showcase */}
            <div className="relative w-full max-w-[420px] h-[160px] sm:h-[220px] md:h-[270px] flex items-center justify-center my-1">
              {/* Left Chevron */}
              <button
                onClick={handlePrev}
                aria-label="Kendaraan Sebelumnya"
                className="absolute left-1 sm:left-2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#131C31]/90 hover:bg-[#1C2844] border border-slate-500/80 flex items-center justify-center text-white cursor-pointer transition-transform active:scale-90 shadow-lg"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Center Vehicle Render */}
              <div className="relative z-10 w-[200px] sm:w-[260px] md:w-[320px] h-[140px] sm:h-[190px] md:h-[240px] flex items-center justify-center pointer-events-none">
                <VehicleIllustration
                  vehicleId={currentVehicle.id}
                  variant="podium"
                  locked={!isUnlocked}
                  className="w-full h-full drop-shadow-[0_16px_18px_rgba(0,0,0,0.85)] transition-transform duration-300"
                />
              </div>

              {/* Right Chevron */}
              <button
                onClick={handleNext}
                aria-label="Kendaraan Berikutnya"
                className="absolute right-1 sm:right-2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#131C31]/90 hover:bg-[#1C2844] border border-slate-500/80 flex items-center justify-center text-white cursor-pointer transition-transform active:scale-90 shadow-lg"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>
            </div>

            {/* Action Button ("✔ DIGUNAKAN" / "GUNAKAN" / "BUKA") */}
            <div className="mt-2 z-20 w-full max-w-[280px] flex justify-center">
              {isEquipped ? (
                <button
                  onClick={handleEquipOrUnlock}
                  className="w-full px-7 py-2.5 rounded-xl bg-[#1A202C]/95 border-2 border-[#FACC15] shadow-[0_0_18px_rgba(250,204,21,0.35)] flex items-center justify-center gap-2.5 cursor-pointer min-h-[44px]"
                >
                  <Check className="w-5 h-5 text-[#FACC15] stroke-[3]" />
                  <span className="font-display font-black text-sm sm:text-base tracking-wider text-[#FACC15] uppercase">
                    DIGUNAKAN
                  </span>
                </button>
              ) : isUnlocked ? (
                <button
                  onClick={handleEquipOrUnlock}
                  className="btn-arcade-yellow w-full px-8 py-2.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer min-h-[44px]"
                >
                  <Check className="w-5 h-5 text-[#0F172A] stroke-[3]" />
                  <span className="font-display font-black text-sm sm:text-base tracking-wider text-[#0F172A] uppercase">
                    GUNAKAN
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleEquipOrUnlock}
                  disabled={coins < currentVehicle.unlockCost}
                  className={`w-full px-6 py-2.5 rounded-xl font-display font-black text-sm sm:text-base tracking-wider flex items-center justify-center gap-2.5 border-2 transition-all min-h-[44px] ${
                    coins >= currentVehicle.unlockCost
                      ? 'bg-gradient-to-b from-[#FDE047] to-[#CA8A04] text-[#0F172A] border-[#FEF08A] cursor-pointer shadow-lg active:scale-95'
                      : 'bg-[#151D2E]/95 text-slate-400 border-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-5 h-5 text-[#FACC15]" />
                  <span>
                    BUKA · {currentVehicle.unlockCost.toLocaleString('id-ID')}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Right Column: Vehicle Stats & Glowing Yellow Stat Bars (Order 3, Right 4 Columns) */}
          <div className="order-3 md:col-span-4 flex flex-col justify-start md:justify-center">
            {/* Desktop Description Header */}
            <div className="hidden md:block mb-3">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentVehicle.description}
              </p>
            </div>

            {/* Dark Translucent Stat Card */}
            <div className="bg-[#0E1626]/95 border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-2xl backdrop-blur-md">
              <p className="md:hidden text-xs text-slate-300 mb-3 text-center leading-relaxed">
                {currentVehicle.description}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* HP */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-white">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      <span>HP</span>
                    </span>
                    <span className="font-mono-tabular font-extrabold text-white">
                      {currentVehicle.stats.hp}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full stat-bar-glow rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (currentVehicle.stats.hp / 340) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Kecepatan */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-white">
                      <Gauge className="w-3.5 h-3.5 text-sky-400" />
                      <span>Kecepatan</span>
                    </span>
                    <span className="font-mono-tabular font-extrabold text-white">
                      {currentVehicle.stats.speed.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full stat-bar-glow rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (currentVehicle.stats.speed / 10) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Damage */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-white">
                      <Shield className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Damage</span>
                    </span>
                    <span className="font-mono-tabular font-extrabold text-white">
                      {currentVehicle.stats.damage}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full stat-bar-glow rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (currentVehicle.stats.damage / 35) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Fire Rate */}
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-white">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Fire Rate</span>
                    </span>
                    <span className="font-mono-tabular font-extrabold text-white">
                      {currentVehicle.stats.fireRate.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className="h-full stat-bar-glow rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (currentVehicle.stats.fireRate / 6.5) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Unique Vehicle Skill (SPACE) Info Box */}
              <div className="mt-3.5 pt-3 border-t border-slate-700/80">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-display font-black text-xs sm:text-sm text-[#FACC15] uppercase tracking-wider">
                    SKILL: {currentVehicle.specialName}
                  </span>
                  <span className="text-[11px] font-mono-tabular font-bold text-slate-300 bg-slate-800/90 border border-slate-600 px-2 py-0.5 rounded">
                    CD {currentVehicle.specialCooldown}s
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  {currentVehicle.specialDescription}
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* UPGRADE BENGKEL TAB */
        <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-3.5 sm:p-6 overflow-y-auto">
          <div className="mb-4 sm:mb-5">
            <h2 className="font-display font-black text-xl sm:text-2xl text-white flex items-center gap-2.5">
              <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-[#FACC15] shrink-0" />
              <span>UPGRADE BENGKEL PERMANEN</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Tingkatkan performa seluruh kendaraan di garasimu secara permanen menggunakan Koin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pb-4">
            {WORKSHOP_ITEMS.map((item) => {
              const lvl = workshopLevels[item.key];
              const isMax = lvl >= 5;
              const cost = getWorkshopUpgradeCost(item.key);
              const canAfford = coins >= cost && !isMax;

              return (
                <div
                  key={item.key}
                  className="bg-[#0E1626]/95 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                        {item.name}
                      </h3>
                      <span className="text-xs font-mono-tabular font-bold text-[#FACC15] shrink-0">
                        Lv. {lvl} / 5
                      </span>
                    </div>
                    <p className="text-xs text-[#38BDF8] font-semibold mt-0.5">
                      {item.bonusPerLevel}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2">{item.desc}</p>

                    <div className="flex items-center gap-1.5 mt-3.5">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div
                          key={step}
                          className={`h-2.5 flex-1 rounded-sm ${
                            step <= lvl
                              ? 'stat-bar-glow'
                              : 'bg-[#0B101E] border border-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      audioSystem.playUiClick();
                      upgradeWorkshopStat(item.key);
                    }}
                    disabled={!canAfford}
                    className={`w-full py-2.5 px-4 rounded-xl font-display font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 min-h-[44px] ${
                      isMax
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : canAfford
                        ? 'btn-arcade-yellow text-[#0B101E] cursor-pointer'
                        : 'bg-slate-800/90 text-slate-400 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {isMax ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>LEVEL MAKSIMUM</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 text-[#0B101E]" />
                        <span>UPGRADE · {cost.toLocaleString('id-ID')} KOIN</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Tukar Diamond (Token) Modal */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0E1628] border-2 border-sky-500/80 rounded-2xl p-4 sm:p-6 shadow-[0_0_30px_rgba(56,189,248,0.35)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path
                    d="M6 3H18L22 9L12 21L2 9L6 3Z"
                    fill="#38BDF8"
                    stroke="#E0F2FE"
                    strokeWidth="1.5"
                  />
                </svg>
                <h3 className="font-display font-black text-lg sm:text-xl text-white">
                  TUKAR DIAMOND KE KOIN
                </h3>
              </div>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Diamond didapat saat mengalahkan Boss di jalanan Jakarta. Tukarkan Diamond untuk membeli atau meng-upgrade kendaraan!
            </p>

            {/* Current Balance */}
            <div className="grid grid-cols-2 gap-2 bg-[#141D30] border border-slate-700 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#FDE047] to-[#CA8A04] flex items-center justify-center text-[10px] font-black text-[#0F172A]">
                  $
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Koin Saat Ini</div>
                  <div className="text-sm font-extrabold text-white font-mono-tabular">
                    {coins.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <path
                    d="M6 3H18L22 9L12 21L2 9L6 3Z"
                    fill="#38BDF8"
                    stroke="#E0F2FE"
                    strokeWidth="1.5"
                  />
                </svg>
                <div>
                  <div className="text-[10px] text-slate-400">Diamond Tersedia</div>
                  <div className="text-sm font-extrabold text-sky-400 font-mono-tabular">
                    {tokens.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Packages */}
            <div className="flex flex-col gap-2.5">
              {[
                { cost: 10, reward: 500, label: 'Paket Pemula' },
                { cost: 25, reward: 1500, label: 'Paket Populer (+20% Bonus)' },
                { cost: 50, reward: 3500, label: 'Paket Sultan (+40% Bonus)' },
              ].map((pkg) => {
                const canAfford = tokens >= pkg.cost;
                return (
                  <button
                    key={pkg.cost}
                    disabled={!canAfford}
                    onClick={() => handleExchange(pkg.cost, pkg.reward)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all min-h-[50px] ${
                      canAfford
                        ? 'bg-[#18233C] hover:bg-[#202E4E] border-sky-400/60 cursor-pointer active:scale-98'
                        : 'bg-[#121927]/60 border-slate-700/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-[11px] font-bold text-amber-400 uppercase">
                        {pkg.label}
                      </div>
                      <div className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                        <span>+{pkg.reward.toLocaleString('id-ID')} Koin</span>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-lg font-display font-extrabold text-xs flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-gradient-to-b from-[#FDE047] to-[#CA8A04] text-[#0F172A]'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                        <path
                          d="M6 3H18L22 9L12 21L2 9L6 3Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                      <span>{pkg.cost} Diamond</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowExchangeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-sm cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
