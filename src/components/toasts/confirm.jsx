import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export const showConfirmationToast = ({ message, onConfirm, onCancel }) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm">{message || "Are you sure?"}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              toast.dismiss(t.id);
              if (onConfirm) onConfirm();
              toast.success("Action confirmed.");
            }}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              toast.dismiss(t.id);
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};