import { UpgradeDefinition } from '../config/upgrades';

type EventMap = {
  'react:select-upgrade': (upgrade: UpgradeDefinition) => void;
  'react:pause-game': () => void;
  'react:resume-game': () => void;
  'react:trigger-special': () => void;
  'react:trigger-dodge': () => void;
  'react:manual-fire': (firing: boolean) => void;
  'react:touch-move': (vec: { x: number; y: number }) => void;
  'react:spawn-boss-now': () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyListener = (...args: any[]) => void;

class TypedEventBus {
  private listeners: Partial<Record<keyof EventMap, Set<AnyListener>>> = {};

  on<K extends keyof EventMap>(event: K, fn: EventMap[K]): () => void {
    let set = this.listeners[event];
    if (!set) {
      set = new Set<AnyListener>();
      this.listeners[event] = set;
    }
    set.add(fn as AnyListener);
    return () => this.off(event, fn);
  }

  off<K extends keyof EventMap>(event: K, fn: EventMap[K]): void {
    this.listeners[event]?.delete(fn as AnyListener);
  }

  emit<K extends keyof EventMap>(event: K, ...args: Parameters<EventMap[K]>): void {
    const set = this.listeners[event];
    if (!set) return;
    set.forEach((fn) => {
      fn(...args);
    });
  }
}

export const gameEvents = new TypedEventBus();
