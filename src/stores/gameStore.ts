import { create } from 'zustand';
import { UpgradeDefinition } from '../game/config/upgrades';

export type ScreenName = 'MAIN_MENU' | 'GARAGE' | 'SETTINGS' | 'HOW_TO_PLAY' | 'PLAYING';
export type ModalType = 'NONE' | 'PAUSED' | 'LEVEL_UP' | 'GAME_OVER' | 'SETTINGS_OVERLAY';

export interface ActiveBossHud {
  id: string;
  name: string;
  subtitle: string;
  hp: number;
  maxHp: number;
}

export interface UpgradeChoiceItem {
  definition: UpgradeDefinition;
  currentLevel: number;
  nextLevel: number;
}

interface GameStoreState {
  screen: ScreenName;
  modal: ModalType;
  runId: number;

  // Run telemetry
  score: number;
  survivalTimeSec: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  enemiesDestroyed: number;
  bossesDefeated: number;
  coinsEarned: number;
  waveNumber: number;

  // Boss & warnings
  activeBoss: ActiveBossHud | null;
  warningBanner: string | null;
  nextBossCountdownSec: number | null;
  nextBossName: string | null;

  // Pending level-up choices
  upgradeChoices: UpgradeChoiceItem[];

  // Actions
  setScreen: (screen: ScreenName) => void;
  setModal: (modal: ModalType) => void;
  startNewRun: () => void;
  updateTelemetry: (partial: Partial<{
    score: number;
    survivalTimeSec: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
    enemiesDestroyed: number;
    bossesDefeated: number;
    coinsEarned: number;
    waveNumber: number;
  }>) => void;
  setActiveBoss: (boss: ActiveBossHud | null) => void;
  setWarningBanner: (msg: string | null) => void;
  updateBossSchedule: (countdownSec: number | null, name: string | null) => void;
  triggerLevelUpModal: (nextLevel: number, choices: UpgradeChoiceItem[]) => void;
  triggerGameOverModal: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  screen: 'MAIN_MENU',
  modal: 'NONE',
  runId: 1,

  score: 0,
  survivalTimeSec: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 60,
  enemiesDestroyed: 0,
  bossesDefeated: 0,
  coinsEarned: 0,
  waveNumber: 1,

  activeBoss: null,
  warningBanner: null,
  nextBossCountdownSec: null,
  nextBossName: null,
  upgradeChoices: [],

  setScreen: (screen) => set({ screen, modal: 'NONE' }),
  setModal: (modal) => set({ modal }),

  startNewRun: () =>
    set((s) => ({
      screen: 'PLAYING',
      modal: 'NONE',
      runId: s.runId + 1,
      score: 0,
      survivalTimeSec: 0,
      level: 1,
      xp: 0,
      xpToNextLevel: 60,
      enemiesDestroyed: 0,
      bossesDefeated: 0,
      coinsEarned: 0,
      waveNumber: 1,
      activeBoss: null,
      warningBanner: null,
      nextBossCountdownSec: null,
      nextBossName: null,
      upgradeChoices: [],
    })),

  updateTelemetry: (partial) => set((s) => ({ ...s, ...partial })),

  setActiveBoss: (activeBoss) => set({ activeBoss }),

  setWarningBanner: (warningBanner) => set({ warningBanner }),

  updateBossSchedule: (nextBossCountdownSec, nextBossName) =>
    set({ nextBossCountdownSec, nextBossName }),

  triggerLevelUpModal: (nextLevel, choices) =>
    set({
      level: nextLevel,
      upgradeChoices: choices,
      modal: 'LEVEL_UP',
    }),

  triggerGameOverModal: () =>
    set({
      modal: 'GAME_OVER',
    }),
}));
