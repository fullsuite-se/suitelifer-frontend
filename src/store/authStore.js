import { create } from "zustand";
import { services } from "./stores/services";
import { user } from "./stores/user";
import { searchValue } from "./stores/searchValue";

export const useStore = create((...a) => ({
  ...services(...a),
  ...user(...a),
  ...searchValue(...a),
}));
