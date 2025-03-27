import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const IndustryModal = ({
  industryModalIsOpen,
  handleIndustryModalClose,
  industryDetails,
  handleIndustryDetailsChange,
  handleAddEditIndustry,
}) => {
  return (
    <Modal open={industryModalIsOpen} onClose={handleIndustryModalClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <Box className="modal-container px-10 bg-white rounded-lg w-96 max-h-[80vh] overflow-y-auto shadow-lg">
          <h2 className="mb-4 font-avenir-black text-lg text-center bg-white">
            {industryDetails.jobIndId === null
              ? "Add Industry"
              : "Edit Industry"}
          </h2>
          <form
            onSubmit={(e) => {
              handleAddEditIndustry(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-avenir-black">
                Industry Name<span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="industryName"
                required
                value={industryDetails.industryName}
                onChange={(e) => handleIndustryDetailsChange(e)}
                className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-avenir-black">
                Assessment URL<span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="assessmentUrl"
                required
                value={industryDetails.assessmentUrl}
                onChange={(e) => handleIndustryDetailsChange(e)}
                className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-end gap-x-3 mb-5">
              <button onClick={handleIndustryModalClose} className="btn-light order-1 md:order-none">
                Cancel
              </button>
              <button type="submit" variant="filled" className="btn-primary">
                {industryDetails.jobIndId === null
                  ? "ADD INDUSTRY"
                  : "SAVE CHANGES"}
              </button>
            </div>
          </form>
        </Box>
      </div>
    </Modal>
  );
};

export default IndustryModal;
