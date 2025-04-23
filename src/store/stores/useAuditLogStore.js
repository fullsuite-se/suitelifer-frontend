import { create } from "zustand";
import api from "../../utils/axios";

const useAuditLogStore = create((set) => ({
  error: null,
  addAuditLog: async (log) => {
    set({ error: null });
    try {
      await api.post("api/audit-logs", log);
      console.log("Audit log added.");
    } catch (error) {
        console.log("Error adding audit log: ", error);
        set({error: error.response?.data?.message || 'Failed to add audit log'});
    }
  },
}));

export default useAuditLogStore;