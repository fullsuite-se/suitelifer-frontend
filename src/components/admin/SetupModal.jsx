import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const SetupModal = ({
  setupModalIsOpen,
  handleSetupModalClose,
  setupDetails,
  handleSetupDetailsChange,
  handleAddEditSetup,
}) => {
  return (
    <Modal open={setupModalIsOpen} onClose={handleSetupModalClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <Box className="modal-container px-10 bg-white rounded-lg w-full sm:w-96 max-h-[80vh] overflow-y-auto shadow-lg">
          <h2 className="mb-4 font-avenir-black text-lg text-center bg-white">
            {setupDetails.setup_id === null ? "Add Setup" : "Edit Setup"}
          </h2>
          <form
            onSubmit={(e) => {
              handleAddEditSetup(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-avenir-black">
                Setup Name<span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="setup_name"
                required
                value={setupDetails.setup_name}
                onChange={(e) => handleSetupDetailsChange(e)}
                className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mt-6 flex justify-end gap-x-3 mb-5">
              <button onClick={handleSetupModalClose} className="btn-light">
                Cancel
              </button>
              <button type="submit" variant="filled" className="btn-primary">
                {setupDetails.setupId === null ? "ADD SETUP" : "SAVE CHANGES"}
              </button>
            </div>
          </form>
        </Box>
      </div>
    </Modal>
  );
};

export default SetupModal;
