import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const JobListingModal = ({
  jobModalIsOpen,
  handleJobListingModalClose,
  jobDetails,
  handleJobDetailsChange,
  industries,
  setups,
  handleAddEditJobListing,
}) => {
  return (
    <Modal open={jobModalIsOpen} onClose={handleJobListingModalClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <Box className="modal-container px-10 py-3 bg-white rounded-lg w-full sm:w-250 max-h-[80vh] overflow-hidden shadow-lg flex flex-col">
          <h2 className="mb-4 font-avenir-black text-lg text-center bg-white">
            {jobDetails.jobId === null
              ? "Add Job Listing"
              : "Edit Job Listing"}
          </h2>
          <form
            onSubmit={(e) => handleAddEditJobListing(e)}
            className="flex flex-col flex-1 overflow-auto"
          >
            <div className="flex-1 overflow-y-auto">
              {/* JOB TITLE + INDUSTRY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Job Title<span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={jobDetails.title}
                    onChange={(e) => handleJobDetailsChange(e)}
                    required
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Industry<span className="text-primary">*</span>
                  </label>
                  <select
                    name="industryId"
                    required
                    disabled={jobDetails.jobId !== null}
                    value={jobDetails.industryId}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    {industries.map((industry, index) => {
                      return (
                        <option key={index} value={industry.industryId}>
                          {industry.industryName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* DESCRIPTION */}
              <div className="grid grid-cols-1">
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Description<span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    value={jobDetails.description}
                    onChange={(e) => handleJobDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  ></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* MIN SALARY */}
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMin"
                    value={jobDetails.salaryMin}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {/* MAX SALARY */}
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    name="salaryMax"
                    value={jobDetails.salaryMax}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {/* EMPLOYMENT TYPE */}
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Employment Type<span className="text-primary">*</span>
                  </label>
                  <select
                    name="employmentType"
                    required
                    value={jobDetails.employmentType}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
                {/* SETUP */}
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Setup<span className="text-primary">*</span>
                  </label>
                  <select
                    name="setupId"
                    required
                    value={jobDetails.setupId}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    {setups.map((setup, index) => {
                      return (
                        <option key={index} value={setup.setupId}>
                          {setup.setupName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* RESPONSIBILITIES */}
              <div className="grid grid-cols-1">
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Responsibilities
                  </label>
                  <textarea
                    name="responsibility"
                    value={jobDetails.responsibility}
                    onChange={(e) => handleJobDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  ></textarea>
                </div>
              </div>
              {/* REQUIREMENTS */}
              <div className="grid grid-cols-1">
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Requirements
                  </label>
                  <textarea
                    name="requirement"
                    value={jobDetails.requirement}
                    onChange={(e) => handleJobDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  ></textarea>
                </div>
              </div>
              {/* PREFERRED QUALIFICATIONS */}
              <div className="grid grid-cols-1">
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Preferred Qualifications
                  </label>
                  <textarea
                    name="preferredQualification"
                    value={jobDetails.preferredQualification}
                    onChange={(e) => handleJobDetailsChange(e)}
                    rows={3}
                    className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  ></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Status<span className="text-primary">*</span>
                  </label>
                  <select
                    name="isOpen"
                    required
                    value={jobDetails.isOpen}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    <option value={1}>Open</option>
                    <option value={0}>Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-avenir-black">
                    Visibility<span className="text-primary">*</span>
                  </label>
                  <select
                    name="isShown"
                    required
                    value={jobDetails.isShown}
                    onChange={(e) => handleJobDetailsChange(e)}
                    className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                  >
                    <option value="" disabled>
                      -- Select an option --
                    </option>
                    <option value={1}>Shown</option>
                    <option value={0}>Hidden</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-x-3 mb-3">
              <button
                onClick={handleJobListingModalClose}
                className="btn-light"
              >
                Cancel
              </button>
              <button type="submit" variant="filled" className="btn-primary">
                {jobDetails.jobId === null
                  ? "ADD JOB LISTING"
                  : "SAVE CHANGES"}
              </button>
            </div>
          </form>
        </Box>
      </div>
    </Modal>
  );
};

export default JobListingModal;
