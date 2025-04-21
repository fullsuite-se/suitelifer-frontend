import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAboutContentStore = create(
  persist(
    (set) => ({
      aboutContent: {},
      setAboutContent: (content) =>
        set({ aboutContent: content, isLoading: false }),
    }),
    {
      name: "about-content-storage",
    }
  )
); 

export default useAboutContentStore;