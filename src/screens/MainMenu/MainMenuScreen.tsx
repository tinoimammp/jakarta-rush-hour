import { Play, Car, Settings, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { audioSystem } from '../../game/systems/AudioSystem';

export function MainMenuScreen() {
  const startNewRun = useGameStore((s) => s.startNewRun);
  const setScreen = useGameStore((s) => s.setScreen);

  const handlePlay = () => {
    audioSystem.playUiClick();
    startNewRun();
  };

  const handleNav = (target: 'GARAGE' | 'SETTINGS' | 'HOW_TO_PLAY') => {
    audioSystem.playUiClick();
    setScreen(target);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B101E] select-none flex flex-col items-center justify-center px-4 py-4 sm:py-6 safe-area-pad">
      {/* Full-Bleed Illustrated Jakarta Dusk Scene (Clean Background Without Baked-In Logo) */}
      <img
        src="/assets/extracted/bg_main_menu_nologo.png"
        alt="Jakarta Rush Hour Main Menu Background"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-[35%_bottom] sm:object-center pointer-events-none"
      />

      {/* Subtle Vignette & Bottom Gradient on Mobile so Centered Logo & Buttons Stand Out Crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080D1A]/30 via-transparent to-[#080D1A]/75 md:to-[#080D1A]/40 pointer-events-none" />

      {/* Centered Stack: Standalone Game Logo + 4 Skewed Arcade Navigation Buttons */}
      <div className="relative z-10 w-full max-w-[540px] flex flex-col items-center justify-center gap-3 sm:gap-4 my-auto">
        {/* Standalone Separated Game Logo Centered Across All Viewports */}
        <img
          src="/assets/extracted/logo_jrh.png"
          alt="Jakarta Rush Hour - Road Chaos"
          referrerPolicy="no-referrer"
          className="w-[min(86vw,360px)] sm:w-[min(75vw,450px)] lg:w-[min(44vw,520px)] max-h-[25vh] sm:max-h-[30vh] w-auto object-contain drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] pointer-events-none select-none"
        />

        {/* 4 Skewed Arcade Buttons Centered Directly Under the Logo */}
        <div className="w-full max-w-[260px] sm:max-w-[285px] lg:max-w-[305px] flex flex-col gap-2.5 sm:gap-3">
          <button
            onClick={handlePlay}
            className="btn-arcade-yellow w-full py-3 sm:py-3.5 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-3 whitespace-nowrap shrink-0"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#0F172A] text-[#0F172A]" />
            <span className="font-display font-black text-lg sm:text-xl tracking-wider text-[#0F172A] uppercase">
              MAIN
            </span>
          </button>

          <button
            onClick={() => handleNav('GARAGE')}
            className="btn-arcade-dark w-full py-2.5 sm:py-3 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-3 whitespace-nowrap shrink-0"
          >
            <Car className="w-5 h-5 text-white fill-white/15" />
            <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase">
              GARASI
            </span>
          </button>

          <button
            onClick={() => handleNav('SETTINGS')}
            className="btn-arcade-dark w-full py-2.5 sm:py-3 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-3 whitespace-nowrap shrink-0"
          >
            <Settings className="w-5 h-5 text-white" />
            <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase">
              PENGATURAN
            </span>
          </button>

          <button
            onClick={() => handleNav('HOW_TO_PLAY')}
            className="btn-arcade-dark w-full py-2.5 sm:py-3 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-3 whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-5 h-5 text-white" />
            <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase">
              CARA MAIN
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
