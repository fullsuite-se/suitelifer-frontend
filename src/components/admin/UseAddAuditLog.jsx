import useAuditLogStore from "../../store/stores/useAuditLogStore";
import { useStore } from "../../store/authStore";

export function useAddAuditLog() {
  const { addAuditLog, error } = useAuditLogStore();
  const user = useStore((state) => state.user);

  const handleAddLog = ({ action, description }) => {
    if (!user?.id) {
      console.warn("User not found. Cannot add audit log.");
      return;
    }

    addAuditLog({
      action,
      userId: user.id,
      description: `${description} by ${user.first_name} ${user.last_name}`,
    });

    console.log("Unable to record the action", error);
  };

  return handleAddLog;
}
