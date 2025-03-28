import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from "@headlessui/react";
import api from "../../utils/axios";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";

export const ModalResetPassword = ({ isOpen, handleClose }) => {
  const [email, setEmail] = useState("");

  const handleCancel = () => {
    handleClose();
  };

  const handleResetConfirmation = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/reset-password", { email });
      if (response?.data) {
        toast.success(response.data.message);
      } else {
        toast.error(
          response?.data?.message || "Something went wrong. Try again."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Try again."
      );
    }
    setEmail("");
    handleCancel();
  };

  return (
    <Transition appear show={isOpen} as={Fragment} className="z-40">
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <TransitionChild as={Fragment}>
          <div className="fixed inset-0 bg-black opacity-40" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <form onSubmit={handleResetConfirmation}>
                <DialogPanel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Reset Your Password
                  </DialogTitle>
                  <p className="mt-1 text-base text-gray-600">
                    Enter your email to receive a one-time password (OTP) for
                    verification and reset your password.
                  </p>
                  <div className="mt-4">
                    <input
                      type="text"
                      id="email"
                      value={email}
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
                    />
                  </div>
                  <div className="flex justify-end mt-6 space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary-dark transition cursor-pointer"
                    >
                      Send OTP
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </form>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
