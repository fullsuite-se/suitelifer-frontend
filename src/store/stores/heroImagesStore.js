import { create } from "zustand";
import { persist } from "zustand/middleware";

const useHeroImagesStore = create(
  persist(
    (set) => ({
      heroImages: {
        careersLeftImage: "",
        careersMainImage: "",
        careersRightImage: "",
      },
      isHeroLoading: true,

      setHeroImages: (images) =>
        set({ heroImages: images, isHeroLoading: false }),

      setHeroLoading: (loading) =>
        set({ isHeroLoading: loading }),
    }),
    {
      name: "hero-images-storage", // localStorage key
    }
  )
);

export default useHeroImagesStore;  