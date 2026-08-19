import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskbarThresholdsState {
  amberThreshold: number;
  redThreshold: number;
  setAmberThreshold: (value: number) => void;
  setRedThreshold: (value: number) => void;
}

// Current-hour token volume (input + output + cache) at which the taskbar
// icon switches from green -> amber -> red. Defaults are estimates, not
// measured team baselines - configurable in Tools & Config since "normal"
// usage varies a lot by team and tool mix.
export const useTaskbarThresholds = create<TaskbarThresholdsState>()(
  persist(
    (set) => ({
      amberThreshold: 30_000,
      redThreshold: 150_000,
      setAmberThreshold: (value) => set({ amberThreshold: value }),
      setRedThreshold: (value) => set({ redThreshold: value }),
    }),
    { name: "tokenomics-taskbar-thresholds" }
  )
);
