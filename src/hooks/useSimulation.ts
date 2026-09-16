import { useCallback, useEffect, useRef, useState } from "react";
import { buildPropagationPlan, type SimSpeed } from "@/utils/simulation";
import type { BlastRadius } from "@/utils/graphAnalysis";

export interface SimulationState {
  running: boolean;
  done: boolean;
  revealedDepth: number;
  depthById: Map<string, number>;
  blast: BlastRadius | null;
}

const IDLE: SimulationState = {
  running: false,
  done: false,
  revealedDepth: -1,
  depthById: new Map(),
  blast: null,
};

export function useSimulation() {
  const [state, setState] = useState<SimulationState>(IDLE);
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  const reset = useCallback(() => {
    clear();
    setState(IDLE);
  }, [clear]);

  const run = useCallback(
    (targetId: string, speed: SimSpeed, onComplete?: () => void) => {
      clear();
      const plan = buildPropagationPlan(targetId, speed);
      setState({
        running: true,
        done: false,
        revealedDepth: 0,
        depthById: plan.blast.depthById,
        blast: plan.blast,
      });

      for (let d = 1; d <= plan.blast.maxDepth; d++) {
        const t = window.setTimeout(() => {
          setState((s) => ({ ...s, revealedDepth: d }));
        }, d * plan.stepMs);
        timers.current.push(t);
      }

      const end = window.setTimeout(
        () => {
          setState((s) => ({ ...s, running: false, done: true }));
          onComplete?.();
        },
        (plan.blast.maxDepth + 1) * plan.stepMs,
      );
      timers.current.push(end);
    },
    [clear],
  );

  return { state, run, reset };
}
