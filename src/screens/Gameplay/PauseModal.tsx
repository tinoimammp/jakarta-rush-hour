import { Play, RotateCcw, Settings, Home, Pause } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { gameEvents } from '../../game/systems/GameEvents';
import { audioSystem } from '../../game/systems/AudioSystem';

export function PauseModal() {
  const { setModal, startNewRun, setScreen } = useGameStore();

  const handleResume = () => {
    audioSystem.playUiClick();
    setModal('NONE');
    gameEvents.emit('react:resume-game');
  };

  const handleRestart = () => {
    audioSystem.playUiClick();
    startNewRun();
  };

  const handleSettings = () => {
    audioSystem.playUiClick();
    setModal('SETTINGS_OVERLAY');
  };

  const handleMainMenu = () => {
    audioSystem.playUiClick();
    audioSystem.stopMusic();
    setScreen('MAIN_MENU');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080C16]/75 backdrop-blur-md flex items-center justify-center p-4 select-none safe-area-pad">
      {/* Sleek Dark Metallic Pause Panel matching Panel 5 of Reference Image */}
      <div className="w-full max-w-[340px] max-h-[92dvh] overflow-y-auto bg-gradient-to-b from-[#162033]/95 to-[#0E1525]/98 border-2 border-slate-500/70 rounded-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Header: || PAUSE */}
        <div className="flex items-center justify-center gap-2.5 pb-3.5 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-600/80">
          <Pause className="w-6 h-6 text-white fill-white" />
          <h2 className="font-display font-black italic text-2xl sm:text-3xl tracking-wider text-white uppercase drop-shadow">
            PAUSE
          </h2>
        </div>

        {/* 4 Skewed Arcade Buttons matching Panel 5 */}
        <div className="space-y-3 sm:space-y-3.5 px-1 sm:px-2">
          <button
            onClick={handleResume}
            className="btn-arcade-yellow w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap shrink-0 min-h-[48px]"
          >
            <Play className="w-5 h-5 fill-[#0F172A] text-[#0F172A]" />
            <span className="font-display font-black text-base tracking-wider text-[#0F172A] uppercase">
              LANJUTKAN
            </span>
          </button>

          <button
            onClick={handleRestart}
            className="btn-arcade-dark w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4 text-white stroke-[2.5]" />
            <span className="font-display font-extrabold text-sm tracking-wider text-white uppercase">
              RESTART
            </span>
          </button>

          <button
            onClick={handleSettings}
            className="btn-arcade-dark w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <Settings className="w-4 h-4 text-white" />
            <span className="font-display font-extrabold text-sm tracking-wider text-white uppercase">
              PENGATURAN
            </span>
          </button>

          <button
            onClick={handleMainMenu}
            className="btn-arcade-dark w-full py-2.5 px-6 rounded-xl flex items-center justify-center gap-3 cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <Home className="w-4 h-4 text-white" />
            <span className="font-display font-extrabold text-sm tracking-wider text-white uppercase">
              MENU UTAMA
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
