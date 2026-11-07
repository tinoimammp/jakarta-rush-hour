import {
  RotateCcw,
  Home,
  Clock,
  Trophy,
  Crosshair,
  Coins,
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { audioSystem } from '../../game/systems/AudioSystem';

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function GameOverModal() {
  const {
    survivalTimeSec,
    score,
    enemiesDestroyed,
    level,
    coinsEarned,
    startNewRun,
    setScreen,
  } = useGameStore();

  const totalXpEarned = level * 120 + enemiesDestroyed * 18;

  const handleRetry = () => {
    audioSystem.playUiClick();
    startNewRun();
  };

  const handleMainMenu = () => {
    audioSystem.playUiClick();
    setScreen('MAIN_MENU');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#140A14] overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 md:px-10 lg:px-14 select-none safe-area-pad">
      {/* Full-Bleed Illustrated Crimson Jakarta Dusk & Crashed Ojol Scene (Clean Background Without Baked-In Logo) */}
      <img
        src="/assets/extracted/bg_gameover_nologo.png"
        alt="Game Over Scene"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[28%_bottom] md:object-left-bottom pointer-events-none"
      />

      {/* Subtle Bottom Scrim on Mobile Portrait so Stats Card is Crisp & Readable */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#140A14]/92 via-[#140A14]/40 to-transparent pointer-events-none" />

      {/* Responsive Container: Centered GAME OVER Logo on Top + Stats Card on Right (Desktop) or Centered (Mobile) */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center justify-between gap-3 sm:gap-4 my-auto">
        {/* Standalone Separated GAME OVER Logo Centered at Top */}
        <img
          src="/assets/extracted/logo_gameover.png"
          alt="GAME OVER"
          referrerPolicy="no-referrer"
          className="w-[min(82vw,340px)] sm:w-[min(68vw,430px)] lg:w-[min(42vw,490px)] max-h-[18vh] sm:max-h-[22vh] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] pointer-events-none select-none md:self-center lg:mr-[14vw]"
        />

        {/* Stats Table & Skewed Action Buttons */}
        <div className="w-full max-w-[430px] flex flex-col gap-3.5 sm:gap-5 md:self-end">
        {/* Dark Translucent Stats Box */}
        <div className="bg-[#161224]/92 border border-slate-600/70 rounded-2xl p-4 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-md space-y-2 sm:space-y-3">
          <StatRow
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 shrink-0" />}
            label="Waktu Bertahan"
            value={formatTime(survivalTimeSec)}
          />
          <StatRow
            icon={<Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#FACC15] fill-[#FACC15] shrink-0" />}
            label="Skor Total"
            value={score.toLocaleString('id-ID')}
          />
          <StatRow
            icon={<Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200 shrink-0" />}
            label="Musuh Dikalahkan"
            value={enemiesDestroyed.toLocaleString('id-ID')}
          />
          <StatRow
            icon={
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-slate-800 border border-slate-400 flex items-center justify-center text-[8px] sm:text-[9px] font-black text-white shrink-0">
                XP
              </div>
            }
            label="XP Didapat"
            value={totalXpEarned.toLocaleString('id-ID')}
          />
          <StatRow
            icon={<Coins className="w-4 h-4 sm:w-5 sm:h-5 text-[#FACC15] shrink-0" />}
            label="Koin"
            value={coinsEarned.toLocaleString('id-ID')}
          />
        </div>

        {/* Action Buttons: COBA LAGI & MENU UTAMA */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 px-1">
          <button
            onClick={handleRetry}
            className="btn-arcade-yellow py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[46px]"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F172A] stroke-[2.5]" />
            <span className="font-display font-black text-sm sm:text-lg tracking-wider text-[#0F172A] uppercase">
              COBA LAGI
            </span>
          </button>

          <button
            onClick={handleMainMenu}
            className="btn-arcade-dark py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 min-h-[46px]"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="font-display font-extrabold text-xs sm:text-base tracking-wider text-white uppercase">
              MENU UTAMA
            </span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 sm:py-2 border-b border-white/10 last:border-none gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-base font-semibold text-slate-200">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-display font-black text-lg sm:text-2xl text-white tabular-nums">
        {value}
      </div>
    </div>
  );
}
