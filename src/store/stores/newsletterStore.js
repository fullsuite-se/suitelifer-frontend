import { create } from "zustand";
import { persist } from "zustand/middleware";

const newsletterStore = create(
  persist(
    (set) => ({
      newsletterContent: {
        articles: [],
        currentIssue: null,
      },
      currentPubIssue: {},
      isLoading: true,
      setCurrentPubIssue: (issue) => set({ currentPubIssue: issue }),
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
