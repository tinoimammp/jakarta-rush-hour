import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Settings,
  Crosshair,
  Bike,
  ArrowUp,
  Skull,
  Crown,
  Lightbulb,
  Zap,
  Smartphone,
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { audioSystem } from '../../game/systems/AudioSystem';

type GuideTab =
  | 'DASAR'
  | 'KENDARAAN'
  | 'SENJATA'
  | 'UPGRADE'
  | 'MUSUH'
  | 'BOSS'
  | 'TIPS';

const GUIDE_TABS: Array<{ id: GuideTab; label: string }> = [
  { id: 'DASAR', label: 'DASAR' },
  { id: 'KENDARAAN', label: 'KENDARAAN' },
  { id: 'SENJATA', label: 'SENJATA' },
  { id: 'UPGRADE', label: 'UPGRADE' },
  { id: 'MUSUH', label: 'MUSUH' },
  { id: 'BOSS', label: 'BOSS' },
  { id: 'TIPS', label: 'TIPS' },
];

function TabIcon({ id, active }: { id: GuideTab; active: boolean }) {
  const cls = `w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
    active ? 'text-[#0F172A] stroke-[2.5]' : 'text-white'
  }`;

  switch (id) {
    case 'DASAR':
      return <Crosshair className={cls} />;
    case 'KENDARAAN':
      return <Bike className={cls} />;
    case 'SENJATA':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M3 6h16l2 3v3h-5l-1 2h-4l-1.5 5H6l1.5-6H3V6zm13 2v1h3V8h-3z" />
        </svg>
      );
    case 'UPGRADE':
      return <ArrowUp className={cls} />;
    case 'MUSUH':
      return <Skull className={cls} />;
    case 'BOSS':
      return <Crown className={cls} />;
    case 'TIPS':
      return <Lightbulb className={cls} />;
  }
}

export function HowToPlayScreen() {
  const [activeTab, setActiveTab] = useState<GuideTab>('DASAR');
  const setScreen = useGameStore((s) => s.setScreen);

  const handleBack = () => {
    audioSystem.playUiClick();
    setScreen('MAIN_MENU');
  };

  // Dynamic Header Title & Icon matching the 5 Guide Panels in Reference Image
  const getHeaderMeta = () => {
    if (activeTab === 'KENDARAAN') {
      return {
        title: 'KENDARAAN',
        icon: <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2] shrink-0" />,
      };
    }
    if (activeTab === 'MUSUH' || activeTab === 'BOSS') {
      return {
        title: 'MUSUH & BOSS',
        icon: <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2] shrink-0" />,
      };
    }
    return {
      title: 'CARA MAIN',
      icon: (
        <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white/15 stroke-[2.2] shrink-0" />
      ),
    };
  };

  const headerMeta = getHeaderMeta();

  return (
    <div className="relative w-full h-full bg-[#0B1222] flex flex-col overflow-hidden select-none safe-area-pad">
      {/* Background Workshop Ambience */}
      <img
        src="/assets/extracted/bg_garage_clean.png"
        alt="Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-45 pointer-events-none"
      />

      <div className="relative z-10 w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden">
        {/* Top Header Bar matching Reference UI Guide */}
        <header className="relative flex items-center gap-3 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-[#0D1526]/90 shrink-0">
          <button
            onClick={handleBack}
            aria-label="Kembali ke Menu Utama"
            className="btn-arcade-dark px-3 sm:px-3.5 py-1.5 rounded-lg text-white flex items-center justify-center cursor-pointer min-h-[40px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {headerMeta.icon}
            <h1 className="font-display font-black italic text-xl sm:text-3xl tracking-wider text-white uppercase drop-shadow">
              {headerMeta.title}
            </h1>
          </div>

          {/* Glowing Golden Bottom Accent Line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(250,204,21,0.15) 0%, #FACC15 22%, rgba(250,204,21,0.35) 65%, rgba(56,189,248,0.2) 100%)',
              boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)',
            }}
          />
        </header>

        {/* Horizontal Scrollable Category Tabs on Mobile/Tablet (< lg) */}
        <nav className="lg:hidden flex items-center gap-2 px-3.5 pt-3 pb-1 overflow-x-auto snap-x no-scrollbar shrink-0">
          {GUIDE_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioSystem.playUiClick();
                  setActiveTab(tab.id);
                }}
                className={`snap-start py-2 px-3.5 rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 transition-all min-h-[42px] ${
                  isSelected ? 'btn-arcade-yellow' : 'btn-arcade-dark'
                }`}
              >
                <TabIcon id={tab.id} active={isSelected} />
                <span
                  className={`font-display font-black text-xs tracking-wider uppercase ${
                    isSelected ? 'text-[#0F172A]' : 'text-white'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Main 2-Zone Body: Left Sidebar (7 Tabs on lg+) + Right Content Panel */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 px-3.5 sm:px-6 py-3 sm:py-4 overflow-y-auto items-start">
          {/* Left Sidebar Navigation on Desktop (lg+) */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-2">
            {GUIDE_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audioSystem.playUiClick();
                    setActiveTab(tab.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0 transition-all ${
                    isSelected ? 'btn-arcade-yellow' : 'btn-arcade-dark'
                  }`}
                >
                  <TabIcon id={tab.id} active={isSelected} />
                  <span
                    className={`font-display font-black text-sm tracking-wider uppercase ${
                      isSelected ? 'text-[#0F172A]' : 'text-white'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-9 w-full pb-4">
            {activeTab === 'DASAR' && <DasarTabContent />}
            {activeTab === 'KENDARAAN' && <KendaraanTabContent />}
            {activeTab === 'SENJATA' && <SenjataTabContent />}
            {activeTab === 'UPGRADE' && <UpgradeTabContent />}
            {(activeTab === 'MUSUH' || activeTab === 'BOSS') && (
              <MusuhBossTabContent highlightBoss={activeTab === 'BOSS'} />
            )}
            {activeTab === 'TIPS' && <TipsTabContent />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. TAB DASAR (Top-Right Panel of UI Guide)
   ========================================================================== */
function DasarTabContent() {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4">
      {/* Top Card: // DASAR PERMAINAN + Right Ojol Action Art (Non-overlapping flex layout) */}
      <section className="relative bg-[#121B2E]/92 border border-slate-600/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md min-h-[145px] sm:min-h-[165px] flex flex-col sm:flex-row items-stretch justify-between">
        <div className="relative z-10 flex-1 p-4 sm:p-6 flex flex-col justify-center">
          <SectionTitle title="DASAR PERMAINAN" />
          <p className="text-xs sm:text-base text-slate-100 leading-relaxed mt-2.5 sm:mt-3 font-medium">
            Bertahan selama mungkin di jalanan Jakarta yang kacau, hancurkan kendaraan musuh,
            kumpulkan XP, dan pilih upgrade untuk menjadi lebih kuat!
          </p>
        </div>

        {/* Right Action Illustration */}
        <div className="relative w-full sm:w-[240px] md:w-[280px] h-36 sm:h-auto shrink-0 overflow-hidden">
          <img
            src="/assets/extracted/guide_dasar_ojol.png"
            alt="Motor Ojol Action"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center sm:object-right pointer-events-none"
          />
          <div
            className="hidden sm:block absolute inset-y-0 left-0 w-12 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(18,27,46,0.95) 0%, rgba(18,27,46,0) 100%)',
            }}
          />
        </div>
      </section>

      {/* Bottom Card: // KONTROL (Desktop Keyboard/Mouse + Mobile Virtual Touch) */}
      <section className="bg-[#121B2E]/92 border border-slate-600/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <SectionTitle title="KONTROL" />

        {/* Desktop / Keyboard Controls Row matching Reference Panel */}
        <div className="mt-4 sm:mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/70 items-center text-center">
          {/* 1. WASD Keycaps */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-0">
            <div className="flex flex-col items-center gap-1 mb-2">
              <Keycap label="W" />
              <div className="flex items-center gap-1">
                <Keycap label="A" />
                <Keycap label="S" />
                <Keycap label="D" />
              </div>
            </div>
            <div className="font-display font-extrabold text-xs sm:text-base text-white">
              Gerak
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">
              (Kiri / Kanan / Atas / Bawah)
            </div>
          </div>

          {/* 2. Mouse Bidik */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-0">
            <div className="h-14 sm:h-16 flex items-center justify-center mb-1.5">
              <MouseIcon highlight="aim" />
            </div>
            <div className="font-display font-extrabold text-xs sm:text-base text-white">
              Bidik
            </div>
          </div>

          {/* 3. Mouse Tembak */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-0">
            <div className="h-14 sm:h-16 flex items-center justify-center mb-1.5">
              <MouseIcon highlight="left" />
            </div>
            <div className="font-display font-extrabold text-xs sm:text-base text-white">
              Tembak
            </div>
          </div>

          {/* 4. SPACE Keycap */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-0">
            <div className="h-14 sm:h-16 flex items-center justify-center mb-1.5">
              <YellowKeycap label="SPACE" wide />
            </div>
            <div className="font-display font-extrabold text-xs sm:text-base text-white">
              Skill
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">(Ability)</div>
          </div>

          {/* 5. ESC Keycap */}
          <div className="flex flex-col items-center justify-center pt-2 sm:pt-0 col-span-2 sm:col-span-1">
            <div className="h-14 sm:h-16 flex items-center justify-center mb-1.5">
              <YellowKeycap label="ESC" />
            </div>
            <div className="font-display font-extrabold text-xs sm:text-base text-white">
              Pause
            </div>
          </div>
        </div>

        {/* Mobile Touch Controls Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-700/70 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
          <div className="flex items-center gap-2 font-display font-extrabold text-[#FACC15]">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>KONTROL LAYAR SENTUH (MOBILE & TABLET):</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-slate-300">
            <span>• <strong className="text-white">Sentuh & Geser Layar:</strong> Gerak 360°</span>
            <span>• <strong className="text-white">Auto-Fire:</strong> Aktif Otomatis</span>
            <span>• <strong className="text-white">Tombol SPACE:</strong> Skill & Nitro Dash</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   2. TAB KENDARAAN (Bottom-Left Panel of UI Guide)
   ========================================================================== */
function KendaraanTabContent() {
  const cards = [
    {
      name: 'Motor Ojek',
      desc: 'Seimbang, cepat, fleksibel.',
      ult: 'ULT: Konvoi 6 Ojol ★5',
      img: '/assets/extracted/thumb_ojol.png',
      border: 'border-[#22C55E]',
      shadow: '0 0 18px rgba(34,197,94,0.45), inset 0 0 14px rgba(34,197,94,0.2)',
    },
    {
      name: 'Bajaj Oranye',
      desc: 'Tiga roda lincah, ahli putar balik.',
      ult: 'ULT: Putar Balik & 2 Bajaj',
      img: '/assets/extracted/thumb_bajaj.svg',
      border: 'border-[#F97316]',
      shadow: '0 0 18px rgba(249,115,22,0.45), inset 0 0 14px rgba(249,115,22,0.2)',
    },
    {
      name: 'City Car',
      desc: 'Stabil dengan HP lebih tinggi.',
      ult: 'ULT: Laser Tol & Plasma',
      img: '/assets/extracted/podium_citycar.png',
      border: 'border-[#A855F7]',
      shadow: '0 0 18px rgba(168,85,247,0.45), inset 0 0 14px rgba(168,85,247,0.2)',
    },
    {
      name: 'Angkot',
      desc: 'Tangguh dan bisa menabrak lebih kuat.',
      ult: 'ULT: Dugem 10.000 Watt',
      img: '/assets/extracted/podium_angkot.png',
      border: 'border-[#EC4899]',
      shadow: '0 0 18px rgba(236,72,153,0.45), inset 0 0 14px rgba(236,72,153,0.2)',
    },
    {
      name: 'Pickup',
      desc: 'Damage lebih besar, cocok untuk agresif.',
      ult: 'ULT: Hujan Gas Melon',
      img: '/assets/extracted/podium_truck.png',
      border: 'border-[#38BDF8]',
      shadow: '0 0 18px rgba(56,189,248,0.45), inset 0 0 14px rgba(56,189,248,0.2)',
    },
    {
      name: 'Mobil Polisi',
      desc: 'Interceptor strobo kejut & water truck.',
      ult: 'ULT: Razia & Water Cannon',
      img: '/assets/extracted/thumb_police.svg',
      border: 'border-[#1E40AF]',
      shadow: '0 0 18px rgba(30,64,175,0.45), inset 0 0 14px rgba(30,64,175,0.2)',
    },
    {
      name: 'Truk Besar',
      desc: 'HP tertinggi, lambat tapi sangat kuat.',
      ult: 'ULT: Seruduk & SUTET',
      img: '/assets/extracted/podium_heavy.png',
      border: 'border-[#FACC15]',
      shadow: '0 0 18px rgba(250,204,21,0.45), inset 0 0 14px rgba(250,204,21,0.2)',
    },
    {
      name: 'Crazy Rich',
      desc: 'Hypercar emas titanium berkecepatan puncak.',
      ult: 'ULT: Hujan Cuan & Laser Kripto',
      img: '/assets/extracted/thumb_crazyrich.svg',
      border: 'border-[#EAB308]',
      shadow: '0 0 18px rgba(234,179,8,0.45), inset 0 0 14px rgba(234,179,8,0.2)',
    },
  ];

  return (
    <section className="bg-[#121B2E]/92 border border-slate-600/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      <SectionTitle title="KENDARAAN" />
      <p className="text-xs sm:text-sm text-slate-200 mt-2 mb-4 sm:mb-5">
        Setiap kendaraan punya statistik, gaya bermain, dan Skill Ultimate [SPACE] yang unik.
      </p>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
        {cards.map((c) => (
          <div
            key={c.name}
            style={{ boxShadow: c.shadow }}
            className={`bg-[#151E32]/95 border-2 ${c.border} rounded-2xl p-3 sm:p-3.5 flex xs:flex-col items-center text-left xs:text-center justify-between gap-3 xs:gap-0 xs:min-h-[225px] transition-transform hover:-translate-y-1`}
          >
            <div className="w-20 xs:w-full h-16 xs:h-24 flex items-center justify-center shrink-0 my-1">
              <img
                src={c.img}
                alt={c.name}
                referrerPolicy="no-referrer"
                className="max-h-16 xs:max-h-22 w-auto object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.75)]"
              />
            </div>

            <div className="flex-1 xs:w-full">
              <h3 className="font-display font-extrabold text-sm sm:text-base text-white mb-1">
                {c.name}
              </h3>
              <p className="text-xs text-slate-200 leading-snug">
                {c.desc}
              </p>
              <div className="mt-2 inline-block px-2 py-0.5 rounded bg-[#0B1222]/90 border border-[#FACC15]/60 text-[10px] font-display font-black text-[#FACC15] tracking-wide uppercase">
                {c.ult}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   3. TAB SENJATA (Middle-Left Panel of UI Guide)
   ========================================================================== */
function SenjataTabContent() {
  const topRow = [
    {
      name: 'Klakson Sonic',
      desc: 'Gelombang suara yang memberikan damage dan mendorong musuh.',
      img: '/assets/extracted/guide_wpn_klakson.png',
      border: 'border-[#C084FC]',
      shadow: '0 0 16px rgba(192,132,252,0.35)',
    },
    {
      name: 'Roket Knalpot',
      desc: 'Meluncurkan roket eksplosif dengan damage area.',
      img: '/assets/extracted/guide_wpn_roket.png',
      border: 'border-[#FBBF24]',
      shadow: '0 0 16px rgba(251,191,36,0.35)',
    },
    {
      name: 'Petir PLN',
      desc: 'Petir berantai yang menyerang beberapa musuh.',
      img: '/assets/extracted/guide_wpn_petir.png',
      border: 'border-[#38BDF8]',
      shadow: '0 0 16px rgba(56,189,248,0.35)',
    },
  ];

  const bottomRow = [
    {
      name: 'Oli Tumpah',
      desc: 'Menjatuhkan oli licin yang memperlambat musuh.',
      img: '/assets/extracted/guide_wpn_oli.png',
      border: 'border-[#FACC15]',
      shadow: '0 0 16px rgba(250,204,21,0.35)',
    },
    {
      name: 'Double Shot',
      desc: 'Menembakkan 2 proyektil sekaligus.',
      img: '/assets/extracted/guide_wpn_doubleshot.png',
      border: 'border-[#38BDF8]',
      shadow: '0 0 16px rgba(56,189,248,0.35)',
    },
  ];

  return (
    <section className="bg-[#121B2E]/92 border border-slate-600/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Left 8 Columns: Title + 3 Top Weapon Cards + 2 Bottom Weapon Cards */}
        <div className="md:col-span-8 flex flex-col justify-between gap-3.5">
          <div>
            <SectionTitle title="SENJATA & ABILITY" />
            <p className="text-xs sm:text-sm text-slate-200 mt-1.5">
              Berbagai senjata unik dengan efek khas. Buka dan upgrade untuk menciptakan
              kombinasi terbaik!
            </p>
          </div>

          {/* Top 3 Weapon Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topRow.map((w) => (
              <div
                key={w.name}
                style={{ boxShadow: w.shadow }}
                className={`bg-[#151F34]/95 border-2 ${w.border} rounded-xl p-3 flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-0`}
              >
                <img
                  src={w.img}
                  alt={w.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-11 sm:w-auto object-contain sm:mb-2 rounded shrink-0"
                />
                <div>
                  <h3 className="font-display font-extrabold text-sm text-white mb-0.5 sm:mb-1">
                    {w.name}
                  </h3>
                  <p className="text-xs sm:text-[11px] text-slate-200 leading-snug">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 2 Horizontal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bottomRow.map((w) => (
              <div
                key={w.name}
                style={{ boxShadow: w.shadow }}
                className={`bg-[#151F34]/95 border-2 ${w.border} rounded-xl p-3 flex items-center gap-3`}
              >
                <img
                  src={w.img}
                  alt={w.name}
                  referrerPolicy="no-referrer"
                  className="w-12 sm:w-14 h-11 sm:h-12 object-contain shrink-0 rounded"
                />
                <div>
                  <h3 className="font-display font-extrabold text-sm text-white">
                    {w.name}
                  </h3>
                  <p className="text-xs sm:text-[11px] text-slate-200 leading-snug mt-0.5">
                    {w.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Unique Vehicle Basic Weapons Explanation Banner */}
          <div className="bg-[#0B1322]/90 border border-amber-500/40 rounded-xl p-3 shadow-lg">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-xs font-display font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50">
                ✦ SENJATA DASAR UNIK TIAP KENDARAAN (BISA DI-UPGRADE KE LV. 5)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-200">
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-emerald-400 font-bold block">Motor Ojol</span>
                Panah Bintang Lima
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-orange-400 font-bold block">Bajaj BBG</span>
                Knalpot Api 2-Tak
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-sky-400 font-bold block">City Car</span>
                Plasma Tol Gateless
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-pink-400 font-bold block">Angkot Racing</span>
                Subwoofer 5000W
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-green-400 font-bold block">Pickup Tempur</span>
                Roket Melon 3kg
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-blue-400 font-bold block">Mobil Polisi</span>
                Strobo EMP Polisi
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-amber-400 font-bold block">Truk Tronton</span>
                Meriam Baja Pantura
              </div>
              <div className="p-1.5 rounded bg-slate-800/60 border border-slate-700/60">
                <span className="text-yellow-400 font-bold block">Crazy Rich PIK</span>
                Shuriken Berlian & Koin
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Framed Gameplay Action Screenshot matching Panel 3 of Guide */}
        <div className="md:col-span-4 flex items-center justify-center">
          <div className="w-full max-w-[240px] h-52 md:h-full md:min-h-[260px] rounded-2xl border-2 border-slate-300/80 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.8)]">
            <img
              src="/assets/extracted/guide_senjata_preview.png"
              alt="Gameplay Action Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. TAB UPGRADE (Middle-Right Panel of UI Guide)
   ========================================================================== */
function UpgradeTabContent() {
  const previewCards = [
    {
      name: 'Damage',
      val: '+20%',
      img: '/assets/extracted/guide_upg_damage.png',
      border: 'border-[#F87171]',
      bg: 'radial-gradient(circle at 50% 30%, rgba(239,68,68,0.35), rgba(69,10,10,0.9))',
      shadow: '0 0 18px rgba(248,113,113,0.55)',
    },
    {
      name: 'Kecepatan',
      val: '+10%',
      img: '/assets/extracted/guide_upg_speed.png',
      border: 'border-[#38BDF8]',
      bg: 'radial-gradient(circle at 50% 30%, rgba(56,189,248,0.35), rgba(12,74,110,0.9))',
      shadow: '0 0 18px rgba(56,189,248,0.55)',
    },
    {
      name: 'Max HP',
      val: '+30%',
      img: '/assets/extracted/guide_upg_hp.png',
      border: 'border-[#4ADE80]',
      bg: 'radial-gradient(circle at 50% 30%, rgba(74,222,128,0.35), rgba(20,83,45,0.9))',
      shadow: '0 0 18px rgba(74,222,128,0.55)',
    },
  ];

  const steps = [
    'Kalahkan musuh untuk dapatkan XP.',
    'Isi bar XP untuk naik level.',
    'Pilih 1 dari 3 upgrade.',
    'Ulangi dan kombinasikan upgrade terbaik!',
  ];

  return (
    <section className="bg-[#121B2E]/92 border border-slate-600/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      <SectionTitle title="SISTEM UPGRADE" />
      <p className="text-xs sm:text-sm text-slate-200 mt-1.5 mb-7">
        Setiap naik level, kamu bisa memilih 1 dari 3 upgrade acak untuk memperkuat
        kendaraan dan senjatamu.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-5 items-center">
        {/* Left 7 Columns: LEVEL UP! Showcase Box */}
        <div className="md:col-span-7 relative bg-[#15182C]/95 border border-slate-500/70 rounded-2xl p-3.5 sm:p-4 pt-7 sm:pt-8 mt-2 shadow-xl">
          {/* Top Centered LEVEL UP! Ribbon */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#2A2012] to-[#1A140B] border-2 border-[#FACC15] px-5 sm:px-6 py-0.5 rounded-lg shadow-[0_0_16px_rgba(250,204,21,0.6)] whitespace-nowrap">
            <span className="font-display font-black italic text-base sm:text-xl text-[#FACC15] tracking-wider uppercase">
              LEVEL UP!
            </span>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 sm:gap-3 mt-1">
            {previewCards.map((c) => (
              <div
                key={c.name}
                style={{ background: c.bg, boxShadow: c.shadow }}
                className={`border-2 ${c.border} rounded-xl p-2.5 sm:p-3 flex xs:flex-col items-center text-left xs:text-center justify-between gap-3 xs:gap-0 xs:min-h-[145px]`}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                  className="h-10 sm:h-12 w-12 sm:w-auto object-contain my-1 rounded shrink-0"
                />
                <div className="flex-1 xs:w-full">
                  <div className="font-display font-extrabold text-xs sm:text-sm text-white">
                    {c.name}
                  </div>
                  <div className="font-display font-black text-sm sm:text-base text-white mt-0.5">
                    {c.val}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: 4 Numbered Steps Box */}
        <div className="md:col-span-5 bg-[#151F34]/90 border border-slate-600/80 rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-3.5">
          {steps.map((text, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#FEF08A] to-[#FACC15] text-[#0F172A] font-display font-black text-sm flex items-center justify-center shrink-0 shadow">
                {idx + 1}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   5 & 6. TAB MUSUH & BOSS (Bottom-Right Panel of UI Guide)
   ========================================================================== */
function MusuhBossTabContent({ highlightBoss }: { highlightBoss: boolean }) {
  const topEnemies = [
    {
      name: 'Angkot Chaos',
      desc: 'Gerak tidak terduga, sering berubah arah.',
      img: '/assets/extracted/guide_enm_angkot.png',
    },
    {
      name: 'Lawan Arah',
      desc: 'Menyerang langsung dengan kecepatan tinggi.',
      img: '/assets/extracted/guide_enm_lawanarah.png',
    },
    {
      name: 'Truk ODOL',
      desc: 'HP tebal dan damage besar.',
      img: '/assets/extracted/guide_enm_trukodol.png',
    },
  ];

  const bottomEnemies = [
    {
      name: 'Proyek Jalan',
      desc: 'Memasang rintangan di jalan.',
      img: '/assets/extracted/guide_enm_proyek.png',
    },
    {
      name: 'Polisi Lalin',
      desc: 'Mengejar dan memperlambatmu.',
      img: '/assets/extracted/guide_enm_polisi.png',
    },
  ];

  const bosses = [
    {
      name: 'Raja ODOL',
      desc: 'Truk raksasa penumpah kargo dan serudukan jalur.',
      img: '/assets/extracted/guide_boss_rajaodol.png',
    },
    {
      name: 'Kontraktor Abadi',
      desc: 'Mortir aspal panas berapi dan barikade beton pembatas.',
      img: '/assets/extracted/guide_boss_kontraktor.png',
    },
    {
      name: 'Raja Lawan Arah',
      desc: 'Tembakan spiral shuriken dan konvoi geng motor.',
      img: '/assets/extracted/guide_boss_rajalawanarah.png',
    },
    {
      name: 'Sultan Busway',
      desc: 'Bus gandeng 2 lajur dengan Klakson Telolet Basuri 130dB.',
      img: '/assets/extracted/guide_boss_kontraktor.png',
    },
    {
      name: 'Derek Siluman',
      desc: 'Harpoon kabel baja penarik magnetik & asap cumi pekat.',
      img: '/assets/extracted/guide_boss_rajaodol.png',
    },
    {
      name: 'Konvoi Patwal VIP',
      desc: 'Barikade strobo laser 360° dan formasi moge pengawal.',
      img: '/assets/extracted/guide_boss_rajalawanarah.png',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Left 7 Columns: MUSUH UTAMA */}
      <section
        className={`lg:col-span-7 bg-[#121B2E]/92 rounded-2xl p-4 sm:p-5 border transition-all shadow-2xl backdrop-blur-md flex flex-col justify-between gap-3.5 ${
          !highlightBoss
            ? 'border-slate-500/90'
            : 'border-slate-700/70 opacity-95 order-2 lg:order-1'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2">
          <Zap className="w-5 h-5 text-[#FACC15] fill-[#FACC15] shrink-0" />
          <h2 className="font-display font-black italic text-base sm:text-lg text-[#FACC15] uppercase tracking-wider">
            MUSUH UTAMA
          </h2>
        </div>

        {/* Top 3 Enemy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {topEnemies.map((e) => (
            <div
              key={e.name}
              className="bg-[#162035]/95 border border-slate-600/80 rounded-xl p-3 flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-0"
            >
              <img
                src={e.img}
                alt={e.name}
                referrerPolicy="no-referrer"
                className="w-14 sm:w-auto h-12 object-contain sm:mb-2 rounded shrink-0"
              />
              <div>
                <h3 className="font-display font-extrabold text-xs sm:text-sm text-white mb-0.5 sm:mb-1">
                  {e.name}
                </h3>
                <p className="text-xs sm:text-[11px] text-slate-300 leading-snug">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 2 Enemy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {bottomEnemies.map((e) => (
            <div
              key={e.name}
              className="bg-[#162035]/95 border border-slate-600/80 rounded-xl p-3 flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-0"
            >
              <img
                src={e.img}
                alt={e.name}
                referrerPolicy="no-referrer"
                className="w-14 sm:w-auto h-11 object-contain sm:mb-1.5 rounded shrink-0"
              />
              <div>
                <h3 className="font-display font-extrabold text-xs sm:text-sm text-white mb-0.5">
                  {e.name}
                </h3>
                <p className="text-xs sm:text-[11px] text-slate-300 leading-snug">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Right 5 Columns: BOSS */}
      <section
        className={`lg:col-span-5 bg-[#121B2E]/92 rounded-2xl p-4 sm:p-5 border transition-all shadow-2xl backdrop-blur-md flex flex-col justify-between gap-3 ${
          highlightBoss
            ? 'border-[#FACC15] shadow-[0_0_24px_rgba(250,204,21,0.3)] order-1 lg:order-2'
            : 'border-slate-600/80'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2">
          <Crown className="w-5 h-5 text-[#FACC15] fill-[#FACC15] shrink-0" />
          <h2 className="font-display font-black italic text-base sm:text-lg text-[#FACC15] uppercase tracking-wider">
            BOSS
          </h2>
        </div>

        <div className="flex flex-col gap-2.5 flex-1 justify-between">
          {bosses.map((b) => (
            <div
              key={b.name}
              className="bg-[#162035]/95 border border-slate-600/80 rounded-xl p-2.5 flex items-center gap-3"
            >
              <img
                src={b.img}
                alt={b.name}
                referrerPolicy="no-referrer"
                className="w-20 sm:w-24 h-14 object-contain shrink-0 rounded"
              />
              <div>
                <h3 className="font-display font-extrabold text-sm text-[#FACC15]">
                  {b.name}
                </h3>
                <p className="text-xs sm:text-[11px] text-slate-200 leading-snug mt-0.5">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   7. TAB TIPS
   ========================================================================== */
function TipsTabContent() {
  const tips = [
    {
      title: 'Jaga Jarak dari Angkot Chaos',
      desc: 'Perhatikan bracket target merah pada Angkot Chaos karena mereka sering banting setir atau ngetem mendadak di tengah lajur.',
    },
    {
      title: 'Kombinasikan Klakson Sonic & Roket Knalpot',
      desc: 'Klakson Sonic mendorong mundur gerombolan Lawan Arah yang mendekat, sementara Roket Knalpot menghancurkan Truk ODOL dengan ledakan area.',
    },
    {
      title: 'Simpan Skill (SPACE) untuk Situasi Darurat',
      desc: 'Saat Raja ODOL menembakkan rentetan peluru merah (bullet-hell), aktifkan tombol SPACE untuk menghapus proyektil musuh di sekitar dan mendapat perisai sementara.',
    },
    {
      title: 'Upgrade Bengkel di Garasi',
      desc: 'Gunakan koin hasil permainan di menu Garasi → Upgrade untuk meningkatkan HP, Kecepatan, dan Fire Rate secara permanen.',
    },
  ];

  return (
    <section className="bg-[#121B2E]/92 border border-slate-600/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
      <SectionTitle title="TIPS BERTAHAN HIDUP" />
      <p className="text-xs sm:text-sm text-slate-200 mt-1.5 mb-4 sm:mb-5">
        Strategi jitu menaklukkan kemacetan ekstrem Jakarta Rush Hour dan mengalahkan semua Bos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-[#151F34]/95 border border-slate-600/80 rounded-xl p-3.5 sm:p-4 flex items-start gap-3.5"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#FEF08A] to-[#FACC15] text-[#0F172A] font-display font-black text-base flex items-center justify-center shrink-0 shadow">
              {idx + 1}
            </div>
            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#FACC15]">
                {tip.title}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed mt-1">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================================================
   SHARED UI HELPERS (// SECTION TITLE, KEYCAPS, MOUSE ICONS)
   ========================================================================== */
function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-700/80 pb-2">
      <span className="font-display font-black italic text-base sm:text-xl text-[#FACC15] tracking-tighter">
        //
      </span>
      <h2 className="font-display font-black italic text-base sm:text-xl text-[#FACC15] tracking-wider uppercase">
        {title}
      </h2>
    </div>
  );
}

function Keycap({ label }: { label: string }) {
  return (
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-gradient-to-b from-white to-slate-200 border-b-[3px] border-slate-400 text-[#0F172A] font-display font-black text-xs flex items-center justify-center shadow">
      {label}
    </div>
  );
}

function YellowKeycap({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div
      className={`${
        wide ? 'px-3.5 py-1.5 min-w-[70px] sm:min-w-[78px]' : 'px-3 py-1.5 min-w-[48px] sm:min-w-[52px]'
      } rounded-lg bg-gradient-to-b from-[#FEF08A] via-[#FACC15] to-[#CA8A04] border-b-[3px] border-[#854D0E] text-[#0F172A] font-display font-black text-xs sm:text-sm tracking-wider flex items-center justify-center shadow-[0_0_12px_rgba(250,204,21,0.4)]`}
    >
      {label}
    </div>
  );
}

function MouseIcon({ highlight }: { highlight: 'aim' | 'left' }) {
  return (
    <svg viewBox="0 0 44 60" className="w-9 h-13 sm:w-10 sm:h-14">
      <rect
        x="6"
        y="4"
        width="32"
        height="52"
        rx="16"
        fill="#E2E8F0"
        stroke="#0F172A"
        strokeWidth="3"
      />
      {highlight === 'left' && (
        <path
          d="M22 4 H22 C13.2 4 6 11.2 6 20 V28 H22 V4 Z"
          fill="#FACC15"
          stroke="#0F172A"
          strokeWidth="2"
        />
      )}
      <line x1="22" y1="4" x2="22" y2="28" stroke="#0F172A" strokeWidth="2.5" />
      <line x1="6" y1="28" x2="38" y2="28" stroke="#0F172A" strokeWidth="2.5" />
      <rect
        x="19"
        y="11"
        width="6"
        height="11"
        rx="3"
        fill={highlight === 'aim' ? '#22C55E' : '#475569'}
        stroke="#0F172A"
        strokeWidth="1.5"
      />
    </svg>
  );
}
