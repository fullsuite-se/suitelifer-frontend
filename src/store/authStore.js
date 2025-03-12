import { create } from "zustand";
import { services } from "./stores/services";

export const useStore = create((...a) => ({
  ...services(...a),
}));
