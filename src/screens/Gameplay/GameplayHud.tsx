import { useRef, useState } from 'react';
import { Pause, Skull } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { WEAPONS, WeaponId } from '../../game/config/weapons';
import { VehicleId, getVehicleById } from '../../game/config/vehicles';
import { gameEvents } from '../../game/systems/GameEvents';
import { audioSystem } from '../../game/systems/AudioSystem';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function WeaponSlotGraphic({
  id,
  vehicleId,
  className = 'w-7 h-7 sm:w-9 sm:h-9',
}: {
  id: WeaponId;
  vehicleId?: VehicleId;
  className?: string;
}) {
  switch (id) {
    case 'double-shot':
      if (vehicleId === 'motor-ojol') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <path d="M24 6L28 17L39 19L31 27L33 39L24 33L15 39L17 27L9 19L20 17L24 6Z" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
            <polygon points="24,11 26,18 33,19 28,24 29,31 24,27 19,31 20,24 15,19 22,18" fill="#34D399" />
          </svg>
        );
      }
      if (vehicleId === 'bajaj') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <path d="M24 7C24 7 34 16 34 26C34 33 29 39 24 39C19 39 14 33 14 26C14 16 24 7 24 7Z" fill="#F97316" />
            <path d="M24 16C24 16 30 22 30 28C30 32 27 36 24 36C21 36 18 32 18 28C18 22 24 16 24 16Z" fill="#FACC15" />
          </svg>
        );
      }
      if (vehicleId === 'city-car') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <line x1="16" y1="40" x2="16" y2="8" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <polygon points="16,5 12,13 20,13" fill="#E0F2FE" />
            <line x1="32" y1="40" x2="32" y2="8" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            <polygon points="32,5 28,13 36,13" fill="#E0F2FE" />
          </svg>
        );
      }
      if (vehicleId === 'angkot') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <circle cx="24" cy="24" r="18" fill="#1C1917" stroke="#FB7185" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="10" fill="#E11D48" />
            <circle cx="24" cy="24" r="5" fill="#FFE4E6" />
          </svg>
        );
      }
      if (vehicleId === 'pickup-truck') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <rect x="15" y="16" width="18" height="22" rx="7" fill="#22C55E" stroke="#86EFAC" strokeWidth="1.5" />
            <path d="M19 16V10H29V16" stroke="#15803D" strokeWidth="2" fill="none" />
            <circle cx="24" cy="27" r="3" fill="#FACC15" />
          </svg>
        );
      }
      if (vehicleId === 'police-car') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <rect x="10" y="18" width="13" height="12" rx="2" fill="#EF4444" stroke="#FCA5A5" strokeWidth="1.5" />
            <rect x="25" y="18" width="13" height="12" rx="2" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1.5" />
          </svg>
        );
      }
      if (vehicleId === 'heavy-truck') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <polygon points="24,6 31,16 31,38 17,38 17,16" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />
            <rect x="20" y="20" width="8" height="18" fill="#78350F" />
          </svg>
        );
      }
      if (vehicleId === 'crazy-rich') {
        return (
          <svg viewBox="0 0 48 48" className={className} fill="none">
            <polygon points="24,7 39,24 24,41 9,24" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="2" />
            <polygon points="24,14 34,24 24,34 14,24" fill="#FACC15" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <g transform="rotate(-35 24 24)">
            <rect x="13" y="12" width="8" height="22" rx="3" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="1.5" />
            <path d="M13 14L17 6L21 14H13Z" fill="#FFFFFF" />
            <rect x="27" y="12" width="8" height="22" rx="3" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
            <path d="M27 14L31 6L35 14H27Z" fill="#FFFFFF" />
          </g>
        </svg>
      );
    case 'roket-knalpot':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <g transform="rotate(35 24 24)">
            <path d="M24 6L31 16H17L24 6Z" fill="#EF4444" stroke="#FCA5A5" strokeWidth="1.5" />
            <rect x="17" y="16" width="14" height="18" rx="3" fill="#FACC15" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="24" cy="38" r="5" fill="#F97316" />
          </g>
        </svg>
      );
    case 'klakson-sonic':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M10 22L28 12V36L10 26V22Z"
            fill="#C084FC"
            stroke="#F3E8FF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M33 17C36 20 36 28 33 31" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 13C42 18 42 30 38 35" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'petir-pln':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <path
            d="M27 6L12 26H23L19 42L36 20H25L27 6Z"
            fill="#FACC15"
            stroke="#FEF08A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'oli-tumpah':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none">
          <ellipse cx="24" cy="28" rx="16" ry="10" fill="#EAB308" stroke="#FEF08A" strokeWidth="2" />
          <circle cx="16" cy="16" r="4" fill="#FACC15" />
          <circle cx="31" cy="14" r="3" fill="#FACC15" />
        </svg>
      );
  }
}

export function GameplayHud() {
  const {
    score,
    survivalTimeSec,
    level,
    xp,
    xpToNextLevel,
    activeBoss,
    warningBanner,
    nextBossCountdownSec,
    nextBossName,
    setModal,
  } = useGameStore();

  const {
    hp,
    maxHp,
    weapons,
    specialCooldownRatio,
    specialActive,
    dodgeCooldownRatio,
  } = usePlayerStore();

  const {
    joystickSize,
    joystickSensitivity,
  } = useSettingsStore();

  // Virtual Joystick & Touch Steering Handling
  const activePointerIdRef = useRef<number | null>(null);
  const joyOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [joyState, setJoyState] = useState({
    active: false,
    originX: 0,
    originY: 0,
    knobX: 0,
    knobY: 0,
  });

  const ringPx =
    joystickSize === 'small' ? 96 : joystickSize === 'large' ? 128 : 112;
  const maxRadius = ringPx * 0.42;

  const handlePause = () => {
    audioSystem.playUiClick();
    gameEvents.emit('react:pause-game');
    setModal('PAUSED');
  };

  const handleSpecial = () => {
    gameEvents.emit('react:trigger-special');
  };

  const handleDodge = () => {
    audioSystem.playUiClick();
    gameEvents.emit('react:trigger-dodge');
  };

  const handleTouchZoneDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (activePointerIdRef.current !== null) return;
    activePointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);

    joyOriginRef.current = { x: e.clientX, y: e.clientY };
    setJoyState({
      active: true,
      originX: e.clientX,
      originY: e.clientY,
      knobX: 0,
      knobY: 0,
    });
    gameEvents.emit('react:touch-move', { x: 0, y: 0 });
  };

  const handleTouchZoneMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    let dx = e.clientX - joyOriginRef.current.x;
    let dy = e.clientY - joyOriginRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }

    setJoyState((prev) => ({
      ...prev,
      knobX: dx,
      knobY: dy,
    }));

    const normX = Math.max(-1, Math.min(1, (dx / maxRadius) * joystickSensitivity));
    const normY = Math.max(-1, Math.min(1, (dy / maxRadius) * joystickSensitivity));
    gameEvents.emit('react:touch-move', { x: normX, y: normY });
  };

  const handleTouchZoneEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    setJoyState({
      active: false,
      originX: 0,
      originY: 0,
      knobX: 0,
      knobY: 0,
    });
    gameEvents.emit('react:touch-move', { x: 0, y: 0 });
  };

  const vehicleId = usePlayerStore((s) => s.vehicleId);
  const vehicleCfg = getVehicleById(vehicleId);
  const hpPercent = Math.max(0, Math.min(100, (hp / Math.max(1, maxHp)) * 100));
  const xpPercent = Math.max(8, Math.min(100, (xp / Math.max(1, xpToNextLevel)) * 100));
  const isSpecialReady = specialCooldownRatio <= 0.01;
  const isDodgeReady = (dodgeCooldownRatio ?? 0) <= 0.01;

  const displaySlots: Array<{ id: WeaponId; level: number; unlocked: boolean }> = [
    weapons[0]
      ? { id: weapons[0].id, level: weapons[0].level, unlocked: true }
      : { id: 'double-shot', level: 1, unlocked: true },
    weapons[1]
      ? { id: weapons[1].id, level: weapons[1].level, unlocked: true }
      : { id: 'roket-knalpot', level: 1, unlocked: false },
    weapons[2]
      ? { id: weapons[2].id, level: weapons[2].level, unlocked: true }
      : { id: 'klakson-sonic', level: 1, unlocked: false },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-2 sm:p-4 select-none safe-area-pad">
      {/* =========================================================================
          1. TOP HUD ROW
          - Mobile (< md): Top-Left (HP, Lv & Mini Weapons) + Top-Right (Timer, Score & Pause in safe cluster)
          - Center is 100% UNOBSTRUCTED on mobile so road is visible!
          - Desktop (md+): Left (Avatar + connected bars) + Center (Timer + Boss) + Right (Score + Pause)
      ========================================================================= */}
      <div className="relative z-20 flex flex-col gap-1.5">
        {/* Mobile Top Bar (< md) */}
        <div className="flex md:hidden items-start justify-between gap-1.5 w-full">
          {/* Top-Left: Compact Avatar + HP/Lv Bar + Mini Weapon Row */}
          <div className="pointer-events-auto flex flex-col gap-1 shrink-0 max-w-[55%]">
            <div className="flex items-center">
              <div className="relative z-10 w-9 h-9 rounded-full border-2 border-slate-300 bg-[#0F172A] shadow-lg overflow-hidden shrink-0">
                <img
                  src="/assets/extracted/avatar_ojol.png"
                  alt="Ojol Rider"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-110"
                />
              </div>

              <div className="-ml-2.5 pl-3.5 pr-2 py-0.5 bg-[#0F172A]/92 border border-slate-600/80 rounded-r-xl shadow-lg backdrop-blur-md w-28 xs:w-36">
                <div className="flex items-baseline justify-between mb-0.5 leading-none">
                  <span className="font-display font-black text-[10px] text-white">
                    HP
                  </span>
                  <span className="font-mono-tabular font-extrabold text-[9px] text-slate-200">
                    {hp}/{maxHp}
                  </span>
                </div>

                {/* HP Green Bar */}
                <div
                  className="w-full h-2 bg-[#1E293B] rounded-sm overflow-hidden border border-slate-700"
                  style={{ transform: 'skewX(-10deg)' }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#86EFAC] shadow-[0_0_8px_rgba(74,222,128,0.65)] transition-all duration-150"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>

                {/* Level Purple Bar */}
                <div
                  className="mt-0.5 relative w-full h-2 bg-[#1E293B] rounded-sm overflow-hidden border border-slate-700"
                  style={{ transform: 'skewX(-10deg)' }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#7E22CE] via-[#A855F7] to-[#C084FC] transition-all duration-150"
                    style={{ width: `${xpPercent}%` }}
                  />
                  <span
                    className="absolute inset-0 flex items-center pl-1 font-display font-black text-[8px] text-white drop-shadow"
                    style={{ transform: 'skewX(10deg)' }}
                  >
                    Lv.{level}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Compact Weapon Badges (Row 2, pointer-events-none) */}
            <div className="flex items-center gap-1 pl-1">
              {displaySlots.map((slot, idx) => (
                <div
                  key={`mob-wpn-${slot.id}-${idx}`}
                  title={
                    slot.id === 'double-shot'
                      ? `${vehicleCfg.basicWeaponName} (Lv. ${slot.level})`
                      : `${WEAPONS[slot.id].name} (Lv. ${slot.level})`
                  }
                  className="relative w-6 h-6 rounded-md bg-[#131B2E]/90 border border-slate-500/80 flex items-center justify-center shadow"
                >
                  <WeaponSlotGraphic id={slot.id} vehicleId={vehicleId} className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sky-500 text-[8px] font-black text-white flex items-center justify-center border border-white/60">
                    {slot.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top-Right: Consolidated Timer, Score & Pause Button */}
          <div className="pointer-events-auto flex items-center gap-1.5 shrink-0">
            <div className="bg-[#0F172A]/92 border border-slate-600/80 rounded-xl px-2.5 py-1 shadow-lg backdrop-blur-md flex flex-col items-end">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-black text-xs text-white tabular-nums drop-shadow">
                  {formatTime(survivalTimeSec)}
                </span>
                {!activeBoss && (
                  <button
                    onClick={() => {
                      audioSystem.playUiClick();
                      gameEvents.emit('react:spawn-boss-now');
                    }}
                    title="Panggil Boss"
                    className="px-1 py-0.2 rounded bg-red-600/90 hover:bg-red-500 text-[8px] font-black text-white uppercase cursor-pointer"
                  >
                    BOS
                  </button>
                )}
              </div>
              <div className="font-display font-black text-xs text-[#FACC15] tabular-nums leading-tight drop-shadow mt-0.5">
                {score.toLocaleString('id-ID')}
              </div>
            </div>

            {/* Circular Pause Button */}
            <button
              onClick={handlePause}
              aria-label="Pause Game"
              className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2B364B] to-[#161E2E] hover:brightness-110 border-2 border-slate-400/80 flex items-center justify-center text-white shadow-lg cursor-pointer active:scale-95 shrink-0"
            >
              <Pause className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* Desktop Top Bar (md+) */}
        <div className="hidden md:flex items-start justify-between gap-2">
          {/* Top-Left: Circular Ojol Avatar + Connected Skewed HP & Lv Bars */}
          <div className="pointer-events-auto flex items-center min-w-0 shrink-0">
            <div className="relative z-10 w-15 h-15 rounded-full border-[3px] border-slate-300 bg-[#0F172A] shadow-[0_4px_14px_rgba(0,0,0,0.85)] overflow-hidden shrink-0">
              <img
                src="/assets/extracted/avatar_ojol.png"
                alt="Ojol Rider"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-110"
              />
            </div>

            <div className="-ml-3.5 pl-5 pr-3.5 py-1.5 bg-[#0F172A]/85 border border-slate-600/80 rounded-r-2xl shadow-xl backdrop-blur-sm w-60">
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="font-display font-black text-base tracking-wide text-white leading-none drop-shadow">
                  HP
                </span>
                <span className="font-mono-tabular font-extrabold text-xs text-white leading-none drop-shadow">
                  {hp} / {maxHp}
                </span>
              </div>

              {/* Skewed Bright Green HP Bar */}
              <div
                className="w-full h-3 bg-[#1E293B] rounded-sm overflow-hidden border border-slate-700 p-[1px]"
                style={{ transform: 'skewX(-12deg)' }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#86EFAC] shadow-[0_0_8px_rgba(74,222,128,0.65)] transition-all duration-150"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>

              {/* Skewed Purple Level Bar */}
              <div
                className="mt-1 relative w-3/4 h-3.5 bg-[#1E293B] rounded-sm overflow-hidden border border-slate-700"
                style={{ transform: 'skewX(-12deg)' }}
              >
                <div
                  className="h-full bg-gradient-to-r from-[#7E22CE] via-[#A855F7] to-[#C084FC] transition-all duration-150"
                  style={{ width: `${xpPercent}%` }}
                />
                <span
                  className="absolute inset-0 flex items-center pl-2 font-display font-bold text-[11px] text-white drop-shadow"
                  style={{ transform: 'skewX(12deg)' }}
                >
                  Lv. {level}
                </span>
              </div>
            </div>
          </div>

          {/* Top-Center: Boss HP Bar + Survival Timer Pill */}
          <div className="flex items-start justify-center gap-3 min-w-0">
            {activeBoss && (
              <div className="flex w-64 lg:w-88 xl:w-96 flex-col items-center">
                <div className="flex items-center justify-center gap-1.5 mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  <Skull className="w-5 h-5 text-white fill-white shrink-0" />
                  <span className="font-display font-black text-base lg:text-lg tracking-wider text-white uppercase truncate">
                    {activeBoss.name}
                  </span>
                </div>
                <div
                  className="w-full h-3.5 lg:h-4 bg-[#182235]/95 rounded-md overflow-hidden border-2 border-slate-400/80 shadow-[0_0_20px_rgba(239,68,68,0.5)] p-[1px]"
                  style={{ transform: 'skewX(-10deg)' }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#F87171] transition-all duration-100"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, (activeBoss.hp / Math.max(1, activeBoss.maxHp)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Center Timer Pill ("03:12" / "06:47") */}
            <div className="pointer-events-auto bg-[#0F172A]/85 border border-slate-600/80 rounded-xl px-4 py-1.5 shadow-xl backdrop-blur-sm flex items-center gap-2.5 shrink-0">
              <span className="font-display font-black text-2xl text-white tracking-wider tabular-nums drop-shadow">
                {formatTime(survivalTimeSec)}
              </span>

              {!activeBoss && nextBossCountdownSec !== null && (
                <div
                  className={`px-2 py-0.5 rounded-md border flex items-center gap-1.5 transition-colors ${
                    nextBossCountdownSec <= 10
                      ? 'bg-red-950/80 border-red-500 animate-pulse text-red-200'
                      : 'bg-slate-800/80 border-slate-600 text-amber-300'
                  }`}
                  title={nextBossName ? `Bos Berikutnya: ${nextBossName}` : 'Waktu menuju Bos berikutnya'}
                >
                  <Skull className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[11px] font-display font-black tracking-wide">
                    {nextBossCountdownSec}s
                  </span>
                </div>
              )}

              {!activeBoss && (
                <button
                  onClick={() => {
                    audioSystem.playUiClick();
                    gameEvents.emit('react:spawn-boss-now');
                  }}
                  title="Panggil Bos Sekarang"
                  className="px-2 py-0.5 rounded bg-red-600/85 hover:bg-red-500 text-[10px] font-display font-extrabold text-white uppercase cursor-pointer transition-colors"
                >
                  PANGGIL
                </button>
              )}
            </div>
          </div>

          {/* Top-Right: SCORE + Circular Metallic Pause Button */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-[#0F172A]/85 border border-slate-600/80 rounded-2xl pl-4 pr-2 py-1.5 shadow-xl backdrop-blur-sm shrink-0">
            <div className="text-right">
              <div className="font-display font-extrabold text-[10px] tracking-widest text-slate-200 uppercase leading-none">
                SCORE
              </div>
              <div className="font-display font-black text-2xl text-white leading-tight tabular-nums drop-shadow">
                {score.toLocaleString('id-ID')}
              </div>
            </div>

            <button
              onClick={handlePause}
              aria-label="Pause Game"
              className="w-11 h-11 rounded-full bg-gradient-to-b from-[#2B364B] to-[#161E2E] hover:brightness-110 border-2 border-slate-400/80 flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform active:scale-95 shrink-0"
            >
              <Pause className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>

        {/* Mobile Portrait Boss Health Bar Row (< md) */}
        {activeBoss && (
          <div className="md:hidden w-full max-w-xs mx-auto px-2 flex flex-col items-center mt-1">
            <div className="flex items-center justify-center gap-1.5 mb-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <Skull className="w-3.5 h-3.5 text-white fill-white" />
              <span className="font-display font-black text-[11px] tracking-wider text-white uppercase">
                {activeBoss.name}
              </span>
            </div>
            <div
              className="w-full h-2.5 bg-[#182235]/95 rounded-md overflow-hidden border border-slate-400/80 shadow-[0_0_16px_rgba(239,68,68,0.5)] p-[1px]"
              style={{ transform: 'skewX(-10deg)' }}
            >
              <div
                className="h-full bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#F87171] transition-all duration-100"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, (activeBoss.hp / Math.max(1, activeBoss.maxHp)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Center Warning Banner when Boss Spawns */}
      {warningBanner && (
        <div className="relative z-20 self-center hazard-stripes p-1 rounded-xl shadow-2xl animate-bounce max-w-[92vw]">
          <div className="bg-[#0B101E] px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg flex items-center gap-2">
            <Skull className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF4444] shrink-0" />
            <span className="font-display font-black text-xs sm:text-base tracking-wider text-[#FACC15] uppercase text-center">
              {warningBanner}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. BOTTOM CONTROLS & VIRTUAL JOYSTICK
          - Mobile (< md):
            * Left-Half: Dedicated Virtual Joystick Touch Area + Glowing Analog Thumbstick
            * Right-Half: Action Buttons (Special Ultimate & Nitro/Dodge)
            * ZERO overlap with weapon slots (weapons cleanly in top-left!)
          - Desktop (md+):
            * Bottom-Left: 3 Metallic Weapon Slots with hotkeys [1], [2], [3]
            * Bottom-Right: Special Ability with [SPACE] keycap
      ========================================================================= */}

      {/* Mobile Virtual Joystick Touch-Capture Zone (Entire Left Half from top-28 to bottom-0) */}
      <div
        onPointerDown={handleTouchZoneDown}
        onPointerMove={handleTouchZoneMove}
        onPointerUp={handleTouchZoneEnd}
        onPointerCancel={handleTouchZoneEnd}
        className="pointer-events-auto md:hidden fixed left-0 bottom-0 w-[55vw] h-[55vh] z-20 touch-none"
      />

      {/* Mobile Visible Virtual Joystick Base & Knob */}
      <div className="pointer-events-none md:hidden fixed left-4 bottom-5 z-25 flex items-center justify-center">
        <div
          style={{ width: ringPx, height: ringPx }}
          className={`relative rounded-full border-2 transition-colors flex items-center justify-center backdrop-blur-sm ${
            joyState.active
              ? 'bg-[#0B101E]/85 border-[#FACC15] shadow-[0_0_24px_rgba(250,204,21,0.55)]'
              : 'bg-[#0F172A]/50 border-slate-500/50 shadow-lg'
          }`}
        >
          {/* Subtle Directional Compass Indicators */}
          <span className="absolute top-1 text-[9px] font-black text-slate-400 select-none">▲</span>
          <span className="absolute bottom-1 text-[9px] font-black text-slate-400 select-none">▼</span>
          <span className="absolute left-1.5 text-[9px] font-black text-slate-400 select-none">◄</span>
          <span className="absolute right-1.5 text-[9px] font-black text-slate-400 select-none">►</span>

          {/* Center Movable Thumb Knob */}
          <div
            style={{
              transform: `translate(${joyState.knobX}px, ${joyState.knobY}px)`,
              transition: joyState.active ? 'none' : 'transform 160ms cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
            className={`w-11 h-11 rounded-full border-2 border-white flex items-center justify-center shadow-md ${
              joyState.active
                ? 'bg-gradient-to-b from-[#FEF08A] to-[#FACC15] shadow-[0_0_16px_rgba(250,204,21,0.9)]'
                : 'bg-gradient-to-b from-slate-400 to-slate-600 opacity-80'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="relative z-30 mobile-controls flex items-end justify-between gap-2 sm:gap-4 w-full">
        {/* Desktop Bottom-Left Weapon Slots (md+) */}
        <div className="hidden md:flex pointer-events-auto items-center gap-2.5">
          {displaySlots.map((slot, idx) => {
            const cfg = WEAPONS[slot.id];
            const isHighlighted = idx === 1 || slot.level > 1;
            return (
              <div
                key={`${slot.id}-${idx}`}
                title={
                  slot.id === 'double-shot'
                    ? `${vehicleCfg.basicWeaponName} (Lv. ${slot.level}) - ${vehicleCfg.basicWeaponSubtitle}`
                    : `${cfg.name} (Lv. ${slot.level})`
                }
                className="relative flex flex-col items-center"
              >
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] flex items-center justify-center shadow-xl border-2 ${
                    isHighlighted
                      ? 'border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.45)]'
                      : 'border-slate-400/80'
                  } ${slot.unlocked ? 'opacity-100' : 'opacity-60'}`}
                >
                  <WeaponSlotGraphic id={slot.id} vehicleId={vehicleId} className="w-9 h-9" />

                  {/* Top-Right Small Blue Level Orb */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-b from-[#38BDF8] to-[#0284C7] border border-white text-[9px] font-extrabold text-white flex items-center justify-center shadow">
                    {slot.level}
                  </div>
                </div>

                {/* Bottom Keycap Number Badge (1, 2, 3) */}
                <div className="-mt-1.5 z-10 bg-[#1A2438] border border-slate-500 text-xs font-display font-black text-white px-2 py-0.2 rounded-md shadow-md leading-tight">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty placeholder on mobile bottom-left so spacing remains clean */}
        <div className="md:hidden pointer-events-none w-28 h-20" />

        {/* Action Buttons: Desktop & Mobile */}
        <div className="pointer-events-auto flex items-end gap-2 sm:gap-3.5">
          {/* Nitro/Dodge Boost Button (Visible on both Desktop & Mobile!) */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleDodge}
              disabled={!isDodgeReady}
              title="Nitro Boost [SHIFT]"
              aria-label="Nitro Boost Dodge"
              className={`relative w-12 h-12 sm:w-15 sm:h-15 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isDodgeReady
                  ? 'bg-gradient-to-b from-[#0284C7] via-[#0369A1] to-[#075985] border-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.8)] hover:scale-105'
                  : 'bg-slate-800/90 border-slate-600 opacity-60 cursor-not-allowed'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FACC15" />
              </svg>

              {!isDodgeReady && (
                <div className="absolute inset-0 rounded-full bg-black/75 flex items-center justify-center">
                  <span className="font-mono-tabular font-black text-[10px] sm:text-xs text-white">
                    {Math.ceil((dodgeCooldownRatio ?? 0) * 3)}s
                  </span>
                </div>
              )}
            </button>

            {/* Hotkey Badge: NITRO on Mobile, SHIFT on Desktop */}
            <div className="-mt-1.5 z-10 bg-[#1A2438] border border-slate-500 text-[9px] sm:text-[11px] font-display font-black tracking-wider text-sky-300 px-1.5 sm:px-2.5 py-0.2 rounded-md shadow-lg uppercase">
              <span className="md:hidden">NITRO</span>
              <span className="hidden md:inline">SHIFT</span>
            </div>
          </div>

          {/* Special Ability / Ultimate Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleSpecial}
              disabled={!isSpecialReady}
              aria-label={vehicleCfg.specialName}
              title={`${vehicleCfg.name} - ${vehicleCfg.specialName}: ${vehicleCfg.specialDescription}`}
              className={`relative w-15 h-15 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all cursor-pointer touch-none ${
                specialActive
                  ? 'scale-105 drop-shadow-[0_0_24px_rgba(56,189,248,0.9)]'
                  : isSpecialReady
                  ? 'hover:scale-105 active:scale-95 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                  : 'opacity-70 cursor-not-allowed'
              }`}
            >
              <img
                src={
                  activeBoss
                    ? '/assets/extracted/special_rocket.png'
                    : '/assets/extracted/special_horn.png'
                }
                alt={vehicleCfg.specialName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-full select-none pointer-events-none"
              />

              {!isSpecialReady && (
                <div className="absolute inset-0 rounded-full bg-[#0B101E]/75 flex items-center justify-center">
                  <span className="font-mono-tabular font-extrabold text-xs sm:text-sm text-white">
                    {Math.ceil(specialCooldownRatio * 8)}s
                  </span>
                </div>
              )}
            </button>

            {/* Desktop Keycap Badge (SPACE) / Mobile Badge (ULTIMATE) with vehicle ultimate name */}
            <div className="-mt-2 z-10 bg-[#1A2438] border border-amber-400/60 text-[9px] sm:text-[11px] font-display font-black tracking-wider text-amber-300 px-2 sm:px-3 py-0.5 rounded-md shadow-lg uppercase text-center max-w-[130px] truncate">
              <span className="md:hidden">ULT: {vehicleCfg.specialName.split(' ')[0]}</span>
              <span className="hidden md:inline">SPACE: {vehicleCfg.specialName.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
