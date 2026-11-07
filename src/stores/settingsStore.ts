import { create } from 'zustand';
import { z } from 'zod';

const SettingsSchema = z.object({
  masterVolume: z.number().min(0).max(1).default(1.0),
  musicVolume: z.number().min(0).max(1).default(0.7),
  sfxVolume: z.number().min(0).max(1).default(0.9),
  muted: z.boolean().default(false),
  screenShake: z.boolean().default(true),
  damageNumbers: z.boolean().default(true),
  autoFire: z.boolean().default(true),
  autoAim: z.boolean().default(true),
  graphicsQuality: z.enum(['low', 'medium', 'high']).default('medium'),
  fpsLimit: z.enum(['30', '60', '120']).default('60'),
  language: z.enum(['id', 'en']).default('id'),
  joystickMode: z.enum(['fixed', 'floating']).default('floating'),
  joystickSize: z.enum(['small', 'medium', 'large']).default('medium'),
  joystickSensitivity: z.number().min(0.5).max(2.0).default(1.0),
});

export type SettingsData = z.infer<typeof SettingsSchema>;

interface SettingsState extends SettingsData {
  setMasterVolume: (val: number) => void;
  setMusicVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  toggleMuted: () => void;
  toggleScreenShake: () => void;
  toggleDamageNumbers: () => void;
  toggleAutoFire: () => void;
  toggleAutoAim: () => void;
  setGraphicsQuality: (quality: 'low' | 'medium' | 'high') => void;
  setFpsLimit: (fps: '30' | '60' | '120') => void;
  setLanguage: (lang: 'id' | 'en') => void;
  setJoystickMode: (mode: 'fixed' | 'floating') => void;
  setJoystickSize: (size: 'small' | 'medium' | 'large') => void;
  setJoystickSensitivity: (val: number) => void;
  resetDefaults: () => void;
}

const STORAGE_KEY = 'jrh_settings_v3';

function loadSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SettingsSchema.parse({});
    return SettingsSchema.parse(JSON.parse(raw));
  } catch {
    return SettingsSchema.parse({});
  }
}

function saveSettings(data: SettingsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

const initialSettings = loadSettings();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...initialSettings,

  setMasterVolume: (val) => {
    set({ masterVolume: val });
    saveSettings(get());
  },
  setMusicVolume: (val) => {
    set({ musicVolume: val });
    saveSettings(get());
  },
  setSfxVolume: (val) => {
    set({ sfxVolume: val });
    saveSettings(get());
  },
  toggleMuted: () => {
    set((s) => ({ muted: !s.muted }));
    saveSettings(get());
  },
  toggleScreenShake: () => {
    set((s) => ({ screenShake: !s.screenShake }));
    saveSettings(get());
  },
  toggleDamageNumbers: () => {
    set((s) => ({ damageNumbers: !s.damageNumbers }));
    saveSettings(get());
  },
  toggleAutoFire: () => {
    set((s) => ({ autoFire: !s.autoFire }));
    saveSettings(get());
  },
  toggleAutoAim: () => {
    set((s) => ({ autoAim: !s.autoAim }));
    saveSettings(get());
  },
  setGraphicsQuality: (quality) => {
    set({ graphicsQuality: quality });
    saveSettings(get());
  },
  setFpsLimit: (fps) => {
    set({ fpsLimit: fps });
    saveSettings(get());
  },
  setLanguage: (lang) => {
    set({ language: lang });
    saveSettings(get());
  },
  setJoystickMode: (mode) => {
    set({ joystickMode: mode });
    saveSettings(get());
  },
  setJoystickSize: (size) => {
    set({ joystickSize: size });
    saveSettings(get());
  },
  setJoystickSensitivity: (val) => {
    set({ joystickSensitivity: val });
    saveSettings(get());
  },
  resetDefaults: () => {
    const defaults = SettingsSchema.parse({});
    set(defaults);
    saveSettings(defaults);
  },
}));
