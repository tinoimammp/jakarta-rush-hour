import { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Gamepad2,
  Volume2,
  Monitor,
  MoreHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useGameStore } from '../../stores/gameStore';
import { audioSystem } from '../../game/systems/AudioSystem';

interface SettingsScreenProps {
  isOverlay?: boolean;
  onCloseOverlay?: () => void;
}

type SettingsTab = 'UMUM' | 'KONTROL' | 'AUDIO' | 'GRAFIS' | 'LAINNYA';

const SIDEBAR_TABS: Array<{ id: SettingsTab; label: string; icon: typeof Settings }> = [
  { id: 'UMUM', label: 'UMUM', icon: Settings },
  { id: 'KONTROL', label: 'KONTROL', icon: Gamepad2 },
  { id: 'AUDIO', label: 'AUDIO', icon: Volume2 },
  { id: 'GRAFIS', label: 'GRAFIS', icon: Monitor },
  { id: 'LAINNYA', label: 'LAINNYA', icon: MoreHorizontal },
];

export function SettingsScreen({ isOverlay = false, onCloseOverlay }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('UMUM');
  const setScreen = useGameStore((s) => s.setScreen);

  const {
    masterVolume,
    musicVolume,
    sfxVolume,
    screenShake,
    damageNumbers,
    autoFire,
    autoAim,
    graphicsQuality,
    fpsLimit,
    language,
    joystickMode,
    joystickSize,
    joystickSensitivity,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    toggleScreenShake,
    toggleDamageNumbers,
    toggleAutoFire,
    toggleAutoAim,
    setGraphicsQuality,
    setFpsLimit,
    setLanguage,
    setJoystickMode,
    setJoystickSize,
    setJoystickSensitivity,
    resetDefaults,
  } = useSettingsStore();

  const handleBack = () => {
    audioSystem.playUiClick();
    if (isOverlay && onCloseOverlay) {
      onCloseOverlay();
    } else {
      setScreen('MAIN_MENU');
    }
  };

  // On mobile (< lg), show focused sections based on the selected tab so 320px screens stay clean & concise.
  // On desktop (lg+), all main sections remain visible in the 3-column reference layout.
  const showGameplayMobile = activeTab === 'UMUM' || activeTab === 'KONTROL';
  const showTouchControlsMobile = activeTab === 'KONTROL';
  const showBahasaMobile = activeTab === 'UMUM' || activeTab === 'LAINNYA';
  const showVolumeMobile = activeTab === 'AUDIO' || activeTab === 'UMUM';
  const showGrafisMobile = activeTab === 'GRAFIS' || activeTab === 'LAINNYA';

  return (
    <div
      className={`${
        isOverlay
          ? 'fixed inset-0 z-50 bg-[#070B14]/88 backdrop-blur-md flex items-center justify-center p-2 sm:p-6'
          : 'relative w-full h-full bg-[#0B1222] flex flex-col overflow-hidden'
      } select-none safe-area-pad`}
    >
      {/* Background Workshop Ambience */}
      {!isOverlay && (
        <img
          src="/assets/extracted/bg_garage_clean.png"
          alt="Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 pointer-events-none"
        />
      )}

      <div
        className={`relative z-10 flex flex-col ${
          isOverlay
            ? 'w-full max-w-5xl bg-[#0D1526]/95 border-2 border-slate-600/80 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden max-h-[94dvh]'
            : 'w-full h-full max-w-6xl mx-auto'
        }`}
      >
        {/* Top Header matching Top-Left Panel of Reference UI Guide */}
        <header className="relative flex items-center gap-3 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-[#0D1526]/90 shrink-0">
          <button
            onClick={handleBack}
            aria-label="Kembali"
            className="btn-arcade-dark px-3 sm:px-3.5 py-1.5 rounded-lg text-white flex items-center justify-center cursor-pointer min-h-[40px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2] shrink-0" />
            <h1 className="font-display font-black italic text-xl sm:text-3xl tracking-wider text-white uppercase drop-shadow">
              PENGATURAN
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
          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
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
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? 'text-[#0F172A] stroke-[2.5]' : 'text-white'
                  }`}
                />
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

        {/* Main 3-Column Body matching Top-Left Panel of Reference UI Guide */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 px-3.5 sm:px-6 py-3 sm:py-5 overflow-y-auto items-start">
          {/* Left Column (Desktop lg+): 5 Skewed Sidebar Tabs */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-2.5">
            {SIDEBAR_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audioSystem.playUiClick();
                    setActiveTab(tab.id);
                  }}
                  className={`w-full py-3 px-5 rounded-xl flex items-center gap-3 cursor-pointer whitespace-nowrap shrink-0 transition-all ${
                    isSelected ? 'btn-arcade-yellow' : 'btn-arcade-dark'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isSelected ? 'text-[#0F172A] stroke-[2.5]' : 'text-white'
                    }`}
                  />
                  <span
                    className={`font-display font-black text-base tracking-wider uppercase ${
                      isSelected ? 'text-[#0F172A]' : 'text-white'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Middle Column: Gameplay Card + Touch Controls Card + Bahasa Card */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
            {/* Gameplay Card */}
            <section
              className={`${
                showGameplayMobile ? 'block' : 'hidden lg:block'
              } bg-[#121B2E]/92 rounded-2xl p-3.5 sm:p-5 border transition-all shadow-xl backdrop-blur-md ${
                activeTab === 'KONTROL'
                  ? 'border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                  : 'border-slate-600/80'
              }`}
            >
              <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-700/80">
                <Settings className="w-5 h-5 text-[#FACC15] shrink-0" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#FACC15]">
                  Gameplay
                </h2>
              </div>

              <div className="divide-y divide-slate-700/60">
                <SettingToggleRow
                  title="Auto Fire (Tembak Otomatis)"
                  subtitle="Menembak otomatis saat ada musuh"
                  checked={autoFire}
                  onChange={() => {
                    audioSystem.playUiClick();
                    toggleAutoFire();
                  }}
                />

                <SettingToggleRow
                  title="Auto Aim (Bidik Otomatis)"
                  subtitle="Membantu mengarahkan tembakan ke musuh terdekat"
                  checked={autoAim}
                  onChange={() => {
                    audioSystem.playUiClick();
                    toggleAutoAim();
                  }}
                />

                <SettingToggleRow
                  title="Tampilkan Damage Number"
                  checked={damageNumbers}
                  onChange={() => {
                    audioSystem.playUiClick();
                    toggleDamageNumbers();
                  }}
                />

                <SettingToggleRow
                  title="Screen Shake (Efek Guncangan)"
                  checked={screenShake}
                  onChange={() => {
                    audioSystem.playUiClick();
                    toggleScreenShake();
                  }}
                />
              </div>
            </section>

            {/* Mobile & Touch Virtual Joystick Card (Shown when KONTROL tab is active) */}
            {showTouchControlsMobile && (
              <section className="bg-[#121B2E]/92 rounded-2xl p-3.5 sm:p-5 border border-[#FACC15]/80 shadow-[0_0_18px_rgba(250,204,21,0.2)] backdrop-blur-md">
                <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-700/80">
                  <Gamepad2 className="w-5 h-5 text-[#FACC15] shrink-0" />
                  <h2 className="font-display font-extrabold text-base sm:text-lg text-[#FACC15]">
                    Kontrol Sentuh (Virtual Joystick)
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Joystick Mode */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-200">
                      Mode Joystick
                    </span>
                    <div className="flex items-center bg-[#192338] border border-slate-600/80 rounded-lg p-0.5">
                      {(
                        [
                          { id: 'floating', label: 'Mengambang' },
                          { id: 'fixed', label: 'Tetap' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            audioSystem.playUiClick();
                            setJoystickMode(opt.id);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-all cursor-pointer min-h-[32px] ${
                            joystickMode === opt.id
                              ? 'bg-gradient-to-b from-[#FEF08A] to-[#FACC15] text-[#0F172A]'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Joystick Size */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-200">
                      Ukuran Joystick
                    </span>
                    <div className="flex items-center bg-[#192338] border border-slate-600/80 rounded-lg p-0.5">
                      {(
                        [
                          { id: 'small', label: 'Kecil' },
                          { id: 'medium', label: 'Sedang' },
                          { id: 'large', label: 'Besar' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            audioSystem.playUiClick();
                            setJoystickSize(opt.id);
                          }}
                          className={`px-2.5 py-1 rounded-md text-xs font-extrabold transition-all cursor-pointer min-h-[32px] ${
                            joystickSize === opt.id
                              ? 'bg-gradient-to-b from-[#FEF08A] to-[#FACC15] text-[#0F172A]'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Joystick Sensitivity Slider */}
                  <VolumeSliderRow
                    label="Sensitivitas Joystick"
                    value={(joystickSensitivity - 0.5) / 1.5}
                    displayText={`${Math.round(joystickSensitivity * 100)}%`}
                    onChange={(norm) =>
                      setJoystickSensitivity(Number((0.5 + norm * 1.5).toFixed(2)))
                    }
                  />
                </div>
              </section>
            )}

            {/* Bahasa Card */}
            <section
              className={`${
                showBahasaMobile ? 'block' : 'hidden lg:block'
              } bg-[#121B2E]/92 rounded-2xl p-3.5 sm:p-5 border transition-all shadow-xl backdrop-blur-md ${
                activeTab === 'LAINNYA'
                  ? 'border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                  : 'border-slate-600/80'
              }`}
            >
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-700/80">
                <Settings className="w-5 h-5 text-[#FACC15] shrink-0" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#FACC15]">
                  Bahasa
                </h2>
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    audioSystem.playUiClick();
                    setLanguage(language === 'id' ? 'en' : 'id');
                  }}
                  className="w-full bg-[#192338] hover:bg-[#202C46] border border-slate-600/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-white cursor-pointer transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    {language === 'id' ? (
                      <span className="w-6 h-4 rounded-[3px] overflow-hidden border border-white/30 flex flex-col shrink-0 shadow-sm">
                        <span className="w-full h-1/2 bg-[#EF4444]" />
                        <span className="w-full h-1/2 bg-white" />
                      </span>
                    ) : (
                      <span className="w-6 h-4 rounded-[3px] bg-blue-700 border border-white/30 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                        EN
                      </span>
                    )}
                    <span className="font-sans font-bold text-xs sm:text-sm text-white">
                      {language === 'id' ? 'Bahasa Indonesia' : 'English (Archipelago)'}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Volume Card + Grafis Card + RESET / SIMPAN Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 sm:gap-4">
            {/* Volume Card */}
            <section
              className={`${
                showVolumeMobile ? 'block' : 'hidden lg:block'
              } bg-[#121B2E]/92 rounded-2xl p-3.5 sm:p-5 border transition-all shadow-xl backdrop-blur-md ${
                activeTab === 'AUDIO'
                  ? 'border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                  : 'border-slate-600/80'
              }`}
            >
              <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-700/80">
                <Volume2 className="w-5 h-5 text-[#FACC15] shrink-0" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#FACC15]">
                  Volume
                </h2>
              </div>

              <div className="space-y-4">
                <VolumeSliderRow
                  label="Master Volume"
                  value={masterVolume}
                  onChange={(v) => setMasterVolume(v)}
                />
                <VolumeSliderRow
                  label="Musik"
                  value={musicVolume}
                  onChange={(v) => setMusicVolume(v)}
                />
                <VolumeSliderRow
                  label="Efek Suara"
                  value={sfxVolume}
                  onChange={(v) => {
                    setSfxVolume(v);
                    audioSystem.playUiClick();
                  }}
                />
              </div>
            </section>

            {/* Grafis Card */}
            <section
              className={`${
                showGrafisMobile ? 'block' : 'hidden lg:block'
              } bg-[#121B2E]/92 rounded-2xl p-3.5 sm:p-5 border transition-all shadow-xl backdrop-blur-md ${
                activeTab === 'GRAFIS'
                  ? 'border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                  : 'border-slate-600/80'
              }`}
            >
              <div className="flex items-center gap-2 pb-2.5 mb-3.5 border-b border-slate-700/80">
                <Monitor className="w-5 h-5 text-[#FACC15] shrink-0" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#FACC15]">
                  Grafis
                </h2>
              </div>

              <div className="space-y-3.5">
                {/* Kualitas Grafis Segmented Buttons: Rendah | Sedang | Tinggi */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    Kualitas Grafis
                  </span>

                  <div className="flex items-center bg-[#192338] border border-slate-600/80 rounded-lg p-0.5">
                    {(
                      [
                        { id: 'low', label: 'Rendah' },
                        { id: 'medium', label: 'Sedang' },
                        { id: 'high', label: 'Tinggi' },
                      ] as const
                    ).map((opt) => {
                      const active = graphicsQuality === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            audioSystem.playUiClick();
                            setGraphicsQuality(opt.id);
                          }}
                          className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-extrabold transition-all cursor-pointer min-h-[32px] ${
                            active
                              ? 'bg-gradient-to-b from-[#FEF08A] to-[#FACC15] text-[#0F172A] shadow-sm'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FPS Limit Dropdown */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-200">
                    FPS Limit
                  </span>

                  <button
                    onClick={() => {
                      audioSystem.playUiClick();
                      const next =
                        fpsLimit === '60' ? '120' : fpsLimit === '120' ? '30' : '60';
                      setFpsLimit(next);
                    }}
                    className="w-32 sm:w-36 bg-[#192338] hover:bg-[#202C46] border border-slate-600/80 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-extrabold text-white cursor-pointer min-h-[36px]"
                  >
                    <span>{fpsLimit} FPS</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                </div>
              </div>
            </section>

            {/* Bottom Action Buttons: RESET & SIMPAN (Always Accessible) */}
            <div className="grid grid-cols-2 gap-3 pt-1 pb-2">
              <button
                onClick={() => {
                  audioSystem.playUiClick();
                  resetDefaults();
                }}
                className="btn-arcade-dark py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[46px]"
              >
                <RotateCcw className="w-4 h-4 text-white stroke-[2.5]" />
                <span className="font-display font-extrabold text-xs sm:text-base tracking-wider text-white uppercase">
                  RESET
                </span>
              </button>

              <button
                onClick={handleBack}
                className="btn-arcade-yellow py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[46px]"
              >
                <Check className="w-5 h-5 text-[#0F172A] stroke-[3]" />
                <span className="font-display font-black text-xs sm:text-base tracking-wider text-[#0F172A] uppercase">
                  SIMPAN
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 cursor-pointer min-h-[44px]"
    >
      <div className="flex items-start gap-2.5">
        <Settings className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
        <div>
          <div className="text-xs sm:text-sm font-extrabold text-white leading-snug">
            {title}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Glowing Yellow Pill Switch matching Reference Design */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onChange();
        }}
        className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 border ${
          checked
            ? 'bg-gradient-to-r from-[#EAB308] to-[#FACC15] border-[#FEF08A] shadow-[0_0_10px_rgba(250,204,21,0.5)]'
            : 'bg-[#1E293B] border-slate-600'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-md transition-transform ${
            checked ? 'right-0.5' : 'left-0.5 bg-slate-300'
          }`}
        />
      </button>
    </div>
  );
}

function VolumeSliderRow({
  label,
  value,
  displayText,
  onChange,
}: {
  label: string;
  value: number;
  displayText?: string;
  onChange: (val: number) => void;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div>
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1.5">
        <span className="text-slate-100">{label}</span>
        <span className="font-mono-tabular font-extrabold text-white">
          {displayText ?? `${pct}%`}
        </span>
      </div>
      <div className="relative flex items-center h-6">
        {/* Track Background */}
        <div className="w-full h-2.5 bg-[#1E293B] rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-[#EAB308] via-[#FACC15] to-[#FEF08A] shadow-[0_0_8px_rgba(250,204,21,0.8)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* White Circular Thumb */}
        <div
          className="pointer-events-none absolute w-5 h-5 rounded-full bg-white border-2 border-[#FEF08A] shadow-[0_0_8px_rgba(255,255,255,0.9)] -ml-2.5"
          style={{ left: `${pct}%` }}
        />
        {/* Native Range Input Overlay for Dragging */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
