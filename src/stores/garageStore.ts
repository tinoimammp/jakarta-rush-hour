import { create } from 'zustand';
import { z } from 'zod';
import { VehicleId, VEHICLES, getVehicleById } from '../game/config/vehicles';
import { useProgressionStore } from './progressionStore';

const GarageSchema = z.object({
  unlockedVehicles: z.array(z.string()).default(['motor-ojol']),
  equippedVehicle: z.string().default('motor-ojol'),
});

interface GarageState {
  unlockedVehicles: VehicleId[];
  equippedVehicle: VehicleId;
  selectedVehicle: VehicleId;
  selectVehicle: (id: VehicleId) => void;
  equipVehicle: (id: VehicleId) => void;
  unlockVehicle: (id: VehicleId) => boolean;
  isUnlocked: (id: VehicleId) => boolean;
}

const STORAGE_KEY = 'jrh_garage_v1';

function loadGarage(): { unlockedVehicles: VehicleId[]; equippedVehicle: VehicleId } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { unlockedVehicles: ['motor-ojol'], equippedVehicle: 'motor-ojol' };
    }
    const parsed = GarageSchema.parse(JSON.parse(raw));
    const validIds = VEHICLES.map((v) => v.id);
    const unlocked = parsed.unlockedVehicles.filter((id): id is VehicleId =>
      validIds.includes(id as VehicleId)
    );
    if (!unlocked.includes('motor-ojol')) unlocked.unshift('motor-ojol');
    const equipped = unlocked.includes(parsed.equippedVehicle as VehicleId)
      ? (parsed.equippedVehicle as VehicleId)
      : 'motor-ojol';
    return { unlockedVehicles: unlocked, equippedVehicle: equipped };
  } catch {
    return { unlockedVehicles: ['motor-ojol'], equippedVehicle: 'motor-ojol' };
  }
}

function saveGarage(unlockedVehicles: VehicleId[], equippedVehicle: VehicleId) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ unlockedVehicles, equippedVehicle })
    );
  } catch {
    // Ignore storage errors
  }
}

const initialGarage = loadGarage();

export const useGarageStore = create<GarageState>((set, get) => ({
  unlockedVehicles: initialGarage.unlockedVehicles,
  equippedVehicle: initialGarage.equippedVehicle,
  selectedVehicle: initialGarage.equippedVehicle,

  selectVehicle: (id) => set({ selectedVehicle: id }),

  equipVehicle: (id) => {
    if (!get().unlockedVehicles.includes(id)) return;
    set({ equippedVehicle: id, selectedVehicle: id });
    saveGarage(get().unlockedVehicles, id);
  },

  unlockVehicle: (id) => {
    const state = get();
    if (state.unlockedVehicles.includes(id)) return true;
    const config = getVehicleById(id);
    const spent = useProgressionStore.getState().spendCoins(config.unlockCost);
    if (!spent) return false;

    const nextUnlocked: VehicleId[] = [...state.unlockedVehicles, id];
    set({
      unlockedVehicles: nextUnlocked,
      equippedVehicle: id,
      selectedVehicle: id,
    });
    saveGarage(nextUnlocked, id);
    return true;
  },

  isUnlocked: (id) => get().unlockedVehicles.includes(id),
}));
