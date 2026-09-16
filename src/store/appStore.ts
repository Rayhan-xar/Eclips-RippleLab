import { useSyncExternalStore } from "react";
import { RANKED } from "@/utils/graphAnalysis";

interface AppState {
  /** package chosen for compromise simulation / comparison */
  targetId: string;
  /** last simulation that actually completed */
  lastSimulatedId: string | null;
}

let state: AppState = {
  targetId: RANKED[0]?.node.id ?? "found-lodash",
  lastSimulatedId: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.add;
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return state;
}

export function setTarget(id: string) {
  state = { ...state, targetId: id };
  emit();
}

export function markSimulated(id: string) {
  state = { ...state, targetId: id, lastSimulatedId: id };
  emit();
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
