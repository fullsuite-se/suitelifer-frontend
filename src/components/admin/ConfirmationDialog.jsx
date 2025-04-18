import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon = <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />,
  confirmBtnClass = "btn-primary",
  cancelBtnClass = "btn-light",
}) => {
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          width: "400px",
          height: "auto",
        },
      }}
    >
      <DialogTitle className="w-full text-center font-avenir-black">
        {title}
      </DialogTitle>

      <DialogContent className="text-center">
        <div className="flex flex-col items-center space-y-3">
          {icon}
          <p className="text-gray-700">{description}</p>
        </div>
      </DialogContent>

      <DialogActions className="">
        <div className="flex mr-1 mb-1 gap-2">
          <button type="button" className={cancelBtnClass} onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className={confirmBtnClass} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
