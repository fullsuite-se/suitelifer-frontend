import { toast } from "react-hot-toast";

export const showConfirmationToast = ({ message, onConfirm, onCancel }) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <p className="text-md">{message || "Are you sure?"}</p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            onClick={() => {
              toast.dismiss(t.id);
              if (onConfirm) onConfirm();
              toast.success("Action confirmed.");
            }}
          >
            Confirm
          </button>
          <button
            className="px-3 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
            onClick={() => {
              toast.dismiss(t.id);
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { duration: 5000 }
  );
};
