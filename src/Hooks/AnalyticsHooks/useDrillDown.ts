"use client";
import { create } from "zustand";

type DrillState = {
  type: "none" | "category" | "date" | "anomaly";
  value?: any;
  setDrill: (type: DrillState["type"], value?: any) => void;
  reset: () => void;
};

export const useDrilldown = create<DrillState>((set) => ({
  type: "none",
  value: null,
  setDrill: (type, value) => set({ type, value }),
  reset: () => set({ type: "none", value: null }),
}));