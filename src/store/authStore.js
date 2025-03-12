import { create } from "zustand";
import { services } from "./stores/services";
import { user } from "./stores/user";

export const useStore = create((...a) => ({
  ...services(...a),
  ...user(...a),
}));
