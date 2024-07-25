import { create } from "zustand";

type RecognitionStore = {
  isRecording: boolean;
  setIsRecording: (recognition: boolean) => void;
  order: string;
  setOrder: (order: string) => void;
};

export const useRecognitionStore = create<RecognitionStore>((set, get) => ({
  isRecording: false,
  setIsRecording: (recognition: boolean) => set({ isRecording: recognition }),
  order: "",
  setOrder: (order: string) => set({ order }),
}));
