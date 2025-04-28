import { create } from "zustand";
import { persist } from "zustand/middleware";

const newsletterStore = create( 
  persist(
    (set) => ({
      newsletterContent: {},
      isLoading: true,
      setNewsletterContent: (content) =>
        set({ newsletterContent: content, isLoading: false }),
      setIsLoading: (value) => set({ isLoading: value }),
    }),
    {
      name: "newsletter-content-storage",
    }
  )
);

export default newsletterStore;
