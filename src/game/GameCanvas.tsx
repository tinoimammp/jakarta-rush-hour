import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainGameScene } from './scenes/MainGameScene';
import { useGameStore } from '../stores/gameStore';
import { useSettingsStore } from '../stores/settingsStore';
import { gameEvents } from './systems/GameEvents';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);
  const runId = useGameStore((s) => s.runId);
  const fpsLimit = useSettingsStore((s) => s.fpsLimit);

  useEffect(() => {
    if (!containerRef.current) return;

    if (gameInstanceRef.current) {
      gameInstanceRef.current.destroy(true);
      gameInstanceRef.current = null;
    }

    const targetFps = Number(fpsLimit) || 60;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth || window.innerWidth,
      height: containerRef.current.clientHeight || window.innerHeight,
      backgroundColor: '#0B101E',
      fps: {
        target: targetFps,
        limit: targetFps,
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      render: {
        antialias: true,
        pixelArt: false,
        powerPreference: 'high-performance',
      },
      scene: [MainGameScene],
    };

    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    // Handle window & orientation resize explicitly for instant viewport adaptation
    const handleWindowResize = () => {
      if (!gameInstanceRef.current || !containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      gameInstanceRef.current.scale.resize(w, h);
    };

    // Pause gameplay automatically when browser tab becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const state = useGameStore.getState();
        if (state.screen === 'PLAYING' && state.modal === 'NONE') {
          gameEvents.emit('react:pause-game');
          state.setModal('PAUSED');
        }
      }
    };

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleWindowResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [runId, fpsLimit]);

  return (
    <div
      ref={containerRef}
      id="game-container"
      className="game-container relative w-full h-full overflow-hidden bg-[#0B101E]"
    />
  );
}
