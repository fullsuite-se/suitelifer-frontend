import { create } from "zustand";
import { user } from "./stores/user";
import { searchValue } from "./stores/searchValue";

export const useStore = create((...a) => ({
  ...user(...a),
  ...searchValue(...a),
}));
