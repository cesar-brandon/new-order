import { AnimationControls, AnimationScope } from "framer-motion";
import { create } from "zustand";

type MotionStore = {
  currentElementId: string;
  setCurrentElementId: (id: string) => void;
  elementIds: string[];
  setElementId: (id: string) => void;
  constraintsRef: { current: HTMLDivElement };
  setConstraintsRef: (ref: HTMLDivElement | null) => void;
  controls: { [key: string]: AnimationControls };
  addControl: (id: string, control: AnimationControls) => void;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, scale: number) => void;
};

export const useMotionStore = create<MotionStore>((set, get) => ({
  currentElementId: "",
  setCurrentElementId: (id) => set({ currentElementId: id }),
  elementIds: [],
  setElementId: (id) =>
    set((state) => ({ elementIds: [...state.elementIds, id] })),
  constraintsRef: { current: document.createElement("div") },
  setConstraintsRef: (ref: HTMLDivElement | null) =>
    set({ constraintsRef: { current: ref ?? document.createElement("div") } }),
  controls: {},
  addControl: (id, control) =>
    set((state) => ({ controls: { ...state.controls, [id]: control } })),
  moveElement: (id, x, y) => {
    const controls = get().controls;
    const control = controls[id];
    if (control) {
      control.start({
        x,
        y,
        transition: { duration: 0.3 },
        zIndex: 1,
      });
    }
  },
  resizeElement: (id, scale) => {
    const controls = get().controls;
    const control = controls[id];
    if (control) {
      control.start({
        scale,
        transition: { duration: 0.3 },
        zIndex: 1,
      });
    }
  },
}));
