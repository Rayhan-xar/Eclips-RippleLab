import { useSyncExternalStore } from "react";
import { RANKED, recomputeAnalysis } from "@/utils/graphAnalysis";
import {
  applyEcosystem,
  demoEcosystem,
  type EcoEdge,
  type EcoNode,
  type EcosystemSource,
} from "@/data/ecosystem";

interface AppState {
  /** package chosen for compromise simulation / comparison */
  targetId: string;
  /** last simulation that actually completed */
  lastSimulatedId: string | null;
  /** bumped whenever the live ecosystem is replaced */
  ecoVersion: number;
  sourceLabel: string;
}

let state: AppState = {
  targetId: RANKED[0]?.node.id ?? "found-lodash",
  lastSimulatedId: null,
  ecoVersion: 0,
  sourceLabel: "Demo ecosystem",
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

export function loadEcosystem(
  nodes: EcoNode[],
  edges: EcoEdge[],
  source: EcosystemSource,
) {
  applyEcosystem(nodes, edges, source);
  recomputeAnalysis();
  state = {
    ...state,
    targetId: RANKED[0]?.node.id ?? nodes[0]?.id ?? "",
    lastSimulatedId: null,
    ecoVersion: state.ecoVersion + 1,
    sourceLabel: source.label,
  };
  emit();
}

export function resetToDemo() {
  const demo = demoEcosystem();
  loadEcosystem(demo.nodes, demo.edges, {
    label: "Demo ecosystem",
    kind: "demo",
    roots: [],
  });
}
