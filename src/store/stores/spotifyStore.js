import { create } from "zustand";
import { persist } from "zustand/middleware";

const spotifyStore = create( 
  persist(
    (set) => ({
      spotifyEpisodesContent: {},
      spotifyPlaylistsContent: {},
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

export default spotifyStore;
