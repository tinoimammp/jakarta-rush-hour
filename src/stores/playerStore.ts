import { create } from 'zustand';
import { VehicleId, getVehicleById } from '../game/config/vehicles';
import { WeaponId } from '../game/config/weapons';
import { useProgressionStore } from './progressionStore';

export interface EquippedWeaponState {
  id: WeaponId;
  level: number;
}

interface PlayerState {
  vehicleId: VehicleId;
  hp: number;
  maxHp: number;
  weapons: EquippedWeaponState[];
  passiveLevels: Record<string, number>;
  specialCooldownRatio: number; // 0 = ready, 1 = on full cooldown
  specialActive: boolean;
  dodgeCooldownRatio: number; // 0 = ready, 1 = on full cooldown

  initForRun: (vehicleId: VehicleId) => void;
  setHp: (hp: number, maxHp?: number) => void;
  setSpecialState: (cooldownRatio: number, active: boolean, dodgeRatio?: number) => void;
  applyUpgradeToStore: (upgradeId: string, weaponId?: WeaponId) => void;
  getUpgradeLevel: (upgradeId: string, weaponId?: WeaponId) => number;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  vehicleId: 'motor-ojol',
  hp: 120,
  maxHp: 120,
  weapons: [{ id: 'double-shot', level: 1 }],
  passiveLevels: {},
  specialCooldownRatio: 0,
  specialActive: false,
  dodgeCooldownRatio: 0,

  initForRun: (vehicleId) => {
    const vConfig = getVehicleById(vehicleId);
    const workshop = useProgressionStore.getState().workshopLevels;
    const maxHp = Math.round(vConfig.stats.hp * (1 + workshop.chassis * 0.1));

    const initialWeapons: EquippedWeaponState[] = [{ id: vConfig.startingWeapon, level: 1 }];
    if (vConfig.startingWeapon !== 'double-shot') {
      initialWeapons.unshift({ id: 'double-shot', level: 1 });
    }

    set({
      vehicleId,
      hp: maxHp,
      maxHp,
      weapons: initialWeapons,
      passiveLevels: {},
      specialCooldownRatio: 0,
      specialActive: false,
      dodgeCooldownRatio: 0,
    });
  },

  setHp: (hp, maxHp) =>
    set((s) => ({
      hp: Math.max(0, Math.round(hp)),
      maxHp: maxHp !== undefined ? Math.round(maxHp) : s.maxHp,
    })),

  setSpecialState: (cooldownRatio, active, dodgeRatio = 0) =>
    set({
      specialCooldownRatio: Math.max(0, Math.min(1, cooldownRatio)),
      specialActive: active,
      dodgeCooldownRatio: Math.max(0, Math.min(1, dodgeRatio)),
    }),

  getUpgradeLevel: (upgradeId, weaponId) => {
    const state = get();
    if (weaponId) {
      const found = state.weapons.find((w) => w.id === weaponId);
      return found ? found.level : 0;
    }
    return state.passiveLevels[upgradeId] ?? 0;
  },

  applyUpgradeToStore: (upgradeId, weaponId) => {
    set((state) => {
      if (weaponId) {
        const existing = state.weapons.find((w) => w.id === weaponId);
        const nextWeapons = existing
          ? state.weapons.map((w) =>
              w.id === weaponId ? { ...w, level: Math.min(5, w.level + 1) } : w
            )
          : [...state.weapons, { id: weaponId, level: 1 }];
        return { weapons: nextWeapons };
      } else {
        const currentLvl = state.passiveLevels[upgradeId] ?? 0;
        return {
          passiveLevels: {
            ...state.passiveLevels,
            [upgradeId]: Math.min(5, currentLvl + 1),
          },
        };
      }
    });
  },
}));
