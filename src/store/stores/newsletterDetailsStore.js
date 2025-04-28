import { create } from "zustand";
import api from "../../utils/axios";

const useNewsletterDetailsStore = create((set) => ({
  newsletterItem: {},
  isLoading: false,

  fetchNewsletterItem: async (newsletterId) => {
    if (!newsletterId) return;

    set({ isLoading: true });

    try {
      const { data } = await api.get(`/api/newsletter/${newsletterId}`);
      set({ newsletterItem: data.newsletter });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetNewsletterItem: () => {
    set({ newsletterItem: {}, isLoading: false });
  },
}));

export default useNewsletterDetailsStore;
