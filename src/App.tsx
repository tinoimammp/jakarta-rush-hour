/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameStore } from './stores/gameStore';
import { MainMenuScreen } from './screens/MainMenu/MainMenuScreen';
import { GarageScreen } from './screens/Garage/GarageScreen';
import { SettingsScreen } from './screens/Settings/SettingsScreen';
import { HowToPlayScreen } from './screens/HowToPlay/HowToPlayScreen';
import { GameCanvas } from './game/GameCanvas';
import { GameplayHud } from './screens/Gameplay/GameplayHud';
import { UpgradeModal } from './screens/Gameplay/UpgradeModal';
import { PauseModal } from './screens/Gameplay/PauseModal';
import { GameOverModal } from './screens/GameOver/GameOverModal';

export default function App() {
  const screen = useGameStore((s) => s.screen);
  const modal = useGameStore((s) => s.modal);
  const setModal = useGameStore((s) => s.setModal);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0B101E] text-[#F8FAFC]">
      {screen === 'MAIN_MENU' && <MainMenuScreen />}
      {screen === 'GARAGE' && <GarageScreen />}
      {screen === 'SETTINGS' && <SettingsScreen />}
      {screen === 'HOW_TO_PLAY' && <HowToPlayScreen />}

      {screen === 'PLAYING' && (
        <div className="game-container relative w-full h-[100dvh]">
          <GameCanvas />
          <GameplayHud />

          {modal === 'LEVEL_UP' && <UpgradeModal />}
          {modal === 'PAUSED' && <PauseModal />}
          {modal === 'SETTINGS_OVERLAY' && (
            <SettingsScreen
              isOverlay
              onCloseOverlay={() => setModal('PAUSED')}
            />
          )}
          {modal === 'GAME_OVER' && <GameOverModal />}
        </div>
      )}
    </div>
  );
}
