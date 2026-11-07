import { create } from 'zustand';
import { z } from 'zod';

export type WorkshopStatKey = 'chassis' | 'engine' | 'weapons' | 'exhaust' | 'magnet';

const ProgressionSchema = z.object({
  coins: z.number().min(0).default(1450),
  tokens: z.number().min(0).default(120),
  bestScore: z.number().min(0).default(0),
  bestSurvivalTimeSec: z.number().min(0).default(0),
  totalEnemiesDefeated: z.number().min(0).default(0),
  totalBossesDefeated: z.number().min(0).default(0),
  totalRuns: z.number().min(0).default(0),
  workshopLevels: z
    .object({
      chassis: z.number().min(0).max(5).default(0),
      engine: z.number().min(0).max(5).default(0),
      weapons: z.number().min(0).max(5).default(0),
      exhaust: z.number().min(0).max(5).default(0),
      magnet: z.number().min(0).max(5).default(0),
    })
    .default({
      chassis: 0,
      engine: 0,
      weapons: 0,
      exhaust: 0,
      magnet: 0,
    }),
});

export type ProgressionData = z.infer<typeof ProgressionSchema>;

interface ProgressionState extends ProgressionData {
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => boolean;
  exchangeTokensForCoins: (tokensToSpend: number, coinsToReceive: number) => boolean;
  recordRunResult: (stats: {
    score: number;
    survivalTimeSec: number;
    enemiesDefeated: number;
    bossesDefeated: number;
    coinsEarned: number;
  }) => void;
  upgradeWorkshopStat: (stat: WorkshopStatKey) => boolean;
  getWorkshopUpgradeCost: (stat: WorkshopStatKey) => number;
}

const STORAGE_KEY = 'jrh_progression_v1';

function loadProgression(): ProgressionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ProgressionSchema.parse({});
    return ProgressionSchema.parse(JSON.parse(raw));
  } catch {
    return ProgressionSchema.parse({});
  }
}

function saveProgression(data: ProgressionData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

const initialProgression = loadProgression();

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  ...initialProgression,

  addCoins: (amount) => {
    set((s) => {
      const next = { ...s, coins: s.coins + Math.max(0, Math.floor(amount)) };
      saveProgression(next);
      return next;
    });
  },

  spendCoins: (amount) => {
    const current = get().coins;
    if (current < amount) return false;
    set((s) => {
      const next = { ...s, coins: s.coins - amount };
      saveProgression(next);
      return next;
    });
    return true;
  },

  addTokens: (amount) => {
    set((s) => {
      const next = { ...s, tokens: s.tokens + Math.max(0, Math.floor(amount)) };
      saveProgression(next);
      return next;
    });
  },

  spendTokens: (amount) => {
    const current = get().tokens;
    if (current < amount) return false;
    set((s) => {
      const next = { ...s, tokens: s.tokens - amount };
      saveProgression(next);
      return next;
    });
    return true;
  },

  exchangeTokensForCoins: (tokensToSpend, coinsToReceive) => {
    const currentTokens = get().tokens;
    if (currentTokens < tokensToSpend || tokensToSpend <= 0) return false;
    set((s) => {
      const next = {
        ...s,
        tokens: s.tokens - tokensToSpend,
        coins: s.coins + coinsToReceive,
      };
      saveProgression(next);
      return next;
    });
    return true;
  },

  recordRunResult: ({ score, survivalTimeSec, enemiesDefeated, bossesDefeated, coinsEarned }) => {
    set((s) => {
      const next: ProgressionData = {
        coins: s.coins + Math.floor(coinsEarned),
        tokens: s.tokens + bossesDefeated * 15,
        bestScore: Math.max(s.bestScore, Math.floor(score)),
        bestSurvivalTimeSec: Math.max(s.bestSurvivalTimeSec, Math.floor(survivalTimeSec)),
        totalEnemiesDefeated: s.totalEnemiesDefeated + enemiesDefeated,
        totalBossesDefeated: s.totalBossesDefeated + bossesDefeated,
        totalRuns: s.totalRuns + 1,
        workshopLevels: s.workshopLevels,
      };
      saveProgression(next);
      return next;
    });
  },

  getWorkshopUpgradeCost: (stat) => {
    const lvl = get().workshopLevels[stat];
    return 350 + lvl * 450;
  },

  upgradeWorkshopStat: (stat) => {
    const state = get();
    const lvl = state.workshopLevels[stat];
    if (lvl >= 5) return false;
    const cost = state.getWorkshopUpgradeCost(stat);
    if (state.coins < cost) return false;

    set((s) => {
      const next: ProgressionData = {
        ...s,
        coins: s.coins - cost,
        workshopLevels: {
          ...s.workshopLevels,
          [stat]: lvl + 1,
        },
      };
      saveProgression(next);
      return next;
    });
    return true;
  },
}));
