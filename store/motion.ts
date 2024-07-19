import { AnimationControls, AnimationScope } from "framer-motion";
import { create } from "zustand";

//NOTE: quitar el estado de controls si no es nesesario
type MotionStore = {
  constraintsRef: { current: HTMLDivElement };
  setConstraintsRef: (ref: HTMLDivElement | null) => void;
  controls: AnimationControls;
  setControls: (controls: AnimationControls) => void;
  scope: AnimationScope<any>;
  setScope: (scope: AnimationScope<any>) => void;
};

export const useMotionStore = create<MotionStore>((set) => ({
  constraintsRef: { current: document.createElement("div") },
  setConstraintsRef: (ref: HTMLDivElement | null) =>
    set({ constraintsRef: { current: ref ?? document.createElement("div") } }),
  controls: {} as AnimationControls,
  setControls: (controls: AnimationControls) => set({ controls: controls }),
  scope: {} as AnimationScope<any>,
  setScope: (scope: AnimationScope<any>) => set({ scope: scope }),
}));
