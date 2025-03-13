import React, { useState, useEffect, useRef, useMemo } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import config from "../../config";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminJobListing() {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // JOB LISTINGS VARIABLES
  const defaultJobDetails = {
    job_id: null,
    title: "",
    industry_id: "",
    industry_name: "",
    employment_type: "",
    setup_id: "",
    description: "",
    salary_min: 0,
    salary_max: 0,
    responsibility: "",
    requirement: "",
    preferred_qualification: "",
    is_open: "",
    is_shown: "",
  };

  const [jobListings, setJobListings] = useState([]);
  const [jobDetails, setJobDetails] = useState(defaultJobDetails);
  const [jobModalIsOpen, setJobModalIsOpen] = useState(false);

  // JOB FUNCTIONS
  const handleAddJobListingButtonClick = () => {
    console.log(user);

    setJobDetails((jd) => ({
      ...jd,
    }));
    setJobModalIsOpen(true);
  };

  const handleJobDetailsChange = (e) => {
    setJobDetails((jd) => ({ ...jd, [e.target.name]: e.target.value }));
  };

  const handleAddEditJobListing = async (e) => {
    e.preventDefault();
    console.log("Job Details:", jobDetails);

    try {
      let response;
      if (jobDetails.job_id === null) {
        // ADD JOB LISTING
        response = await axios.post(`${config.apiBaseUrl}/api/add-job`, {
          ...jobDetails,
          user_id: user.id,
        });
      } else {
        // EDIT JOB LISTING
        response = await axios.post(`${config.apiBaseUrl}/api/edit-job`, {
          ...jobDetails,
          user_id: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (jobDetails.job_id === null) {
          setJobListings((j) => [...j, jobDetails]);
        } else {
          const updatedJobListings = jobListings.map((job) =>
            job.jobId === jobDetails.job_id ? { ...jobDetails } : job
          );
          setJobListings(updatedJobListings);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing the request.");
    }

    setJobDetails(defaultJobDetails);
    setJobModalIsOpen(false);
    setDataUpdated(true);
  };

  const handleJobListingModalClose = () => {
    console.log(jobDetails);
    setJobDetails((jd) => defaultJobDetails);
    setJobModalIsOpen(false);
  };

  const handleEditJobClick = (job) => {
    setJobDetails({
      job_id: job.jobId,
      title: job.jobTitle,
      industry_id: job.industryId,
      industry_name: job.industryName,
      setup_id: job.setupId,
      employment_type: job.employmentType,
      setup_id: job.setupId,
      description: job.description,
      salary_min: job.salaryMin,
      salary_max: job.salaryMax,
      responsibility: job.responsibility,
      requirement: job.requirement,
      preferred_qualification: job.preferredQualification,
      is_open: job.isOpen,
      is_shown: job.isShown,
    });
    setJobModalIsOpen(true);
  };

  // INDUSTRY VARIABLES
  const [industries, setIndustries] = useState([]);
  const [newIndustry, setNewIndustry] = useState({});
  const [industryModalIsOpen, setIndustryModalIsOpen] = useState(false);
  const [editIndustryDetails, setEditIndustryDetails] = useState(null);
  // INDUSTRY MGMT
  const [industryMgmtModalIsOpen, setIndustryMgmtModalIsOpen] = useState(false);

  // INDUSTRY FUNCTIONS
  const handleAddIndustryButtonClick = () => {
    setNewIndustry((ni) => ({
      ...ni,
      user_id: "81aba726-f897-11ef-a725-0af0d960a833",
    }));
    setIndustryModalIsOpen(true);
  };

  const handleAddEditIndustry = async (e) => {
    e.preventDefault();
    if (editIndustryDetails === null) {
      // ADD INDUSTRY
      if (
        newIndustry.industry_name != "" ||
        !industries.includes(newIndustry)
      ) {
        const response = (
          await axios.post(`${config.apiBaseUrl}/api/add-industry`, newIndustry)
        ).data;
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        setIndustries((i) => [...i, newIndustry]);
      }
    } else {
      // EDIT INDUSTRY
    }
    handleIndustryModalClose();
  };

  const handleIndustryChange = (e) => {
    setNewIndustry((ni) => ({ ...ni, [e.target.name]: e.target.value }));
  };

  const handleIndustryModalClose = () => {
    setNewIndustry((ni) => {});
    setIndustryModalIsOpen(false);
  };

  // SETUP VARIABLES
  const [setups, setSetups] = useState([]);
  const [newSetup, setNewSetUp] = useState({});
  const [setupModalIsOpen, setSetupModalIsOpen] = useState(false);
  const [editSetupDetails, setEditSetUp] = useState(null);

  // SETUP FUNCTIONS
  const handleAddSetupButtonClick = () => {
    setNewSetUp((ns) => ({
      ...ns,
      user_id: "81aba726-f897-11ef-a725-0af0d960a833",
    }));
    setSetupModalIsOpen(true);
  };

  const handleAddEditSetUp = async (e) => {
    e.preventDefault();
    if (!editSetupIsOpe) {
      // ADD SETUP
      if (newSetup.setup_name != "" && !setups.includes(newSetup)) {
        console.log(newSetup.user_id);
        const response = (
          await axios.post(`${config.apiBaseUrl}/api/add-setup`, newSetup)
        ).data;
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        setSetups((s) => [...s, newSetup]);
      }
    } else {
      // EDIT SETUP
      // const updatedSetups = setups.map((item, index) =>
      //   index === editSetupDetails ? newSetup : item
      // );
      // setSetups(updatedSetups);
      // setEditSetUp(null);
    }
    handleSetupModalClose();
  };

  const handleSetupNameChange = (e) => {
    setNewSetUp((ns) => ({ ...ns, setup_name: e.target.value }));
  };

  const handleSetupModalClose = () => {
    setNewSetUp((ns) => {});
    setSetupModalIsOpen(false);
  };

  const [selectedOption, setSelectedOption] = useState("Industry");

  // TABLE SETTINGS
  const gridOptions = {
    getRowStyle: (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { background: "#ECF1E3", color: "black" };
      } else {
        return { background: "white", color: "black" };
      }
    },
  };

  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Job Title",
        field: "jobTitle",
        flex: 3,
        filter: "agTextColumnFilter",
        headerClass: "text-primary bg-tertiary font-bold",
      },
      {
        headerName: "Industry",
        field: "industryName",
        flex: 1,
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Employment Type",
        field: "employmentType",
        flex: 1,
        filter: "agTextColumnFilter",
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Status",
        field: "isOpen",
        flex: 1,
        filter: "agTextColumnFilter",
        valueFormatter: (params) => (params.value === 1 ? "Open" : "Closed"),
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Setup",
        field: "setupName",
        flex: 1,
        filter: "agTextColumnFilter",
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Visibility",
        field: "isShown",
        flex: 1,
        filter: "agTextColumnFilter",
        valueFormatter: (params) => (params.value === 1 ? "Shown" : "Hidden"),
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Action",
        field: "action",
        filter: false,
        headerClass: "text-primary font-bold bg-tertiary",
        flex: 1,
        cellRenderer: (params) => {
          return (
            <button
              className="bg-transparent p-2 rounded w-8 h-8 flex justify-center items-center"
              onClick={() => {
                handleEditJobClick(params.data);
              }}
            >
              <EditIcon />
            </button>
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      filter: "agTextColumnFilter",
      floatingFilter: true,
      sortable: true,
    }),
    []
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // API CALLS

  const fetchIndustries = async () => {
    const response = (
      await axios.get(`${config.apiBaseUrl}/api/get-all-industries-hr`)
    ).data;

    setIndustries((i) => (i = response.data));
  };

  const fetchSetups = async () => {
    const response = (
      await axios.get(`${config.apiBaseUrl}/api/get-all-setups`)
    ).data;

    console.log(response.data);

    setSetups((s) => (s = response.data));
  };

  const fetchJobListings = async () => {
    const response = (await axios.get(`${config.apiBaseUrl}/api/all-jobs`))
      .data;

    setJobListings((jl) => (jl = response.data));
    setRowData(response.data);
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchIndustries();
    fetchSetups();
    fetchJobListings();
  }, [dataUpdated]);

  const totalJobListings = jobListings.length;
  const openJobListings = jobListings.filter(
    (value) => value.isOpen === 1
  ).length;
  const closedJobListings = jobListings.filter(
    (value) => value.isOpen === 0
  ).length;

  const handleEditIndustry = (industry) => {
    setEditIndustryDetails(industry);
    setIndustryModalIsOpen(true);
  };

  const handleDeleteIndustry = (index) => {
    const updatedIndustries = industries.filter((_, i) => i !== index);
    setIndustries(updatedIndustries);
  };

  const handleEditSetUp = (index) => {
    setEditSetUp(index);
    setSetupModalIsOpen(true);
  };

  const handleDeleteSetUp = (index) => {
    setSetups(setups.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col p-2 mx-auto space-y-6">
      {/* Header */}
      <header className="container flex h-16 items-center justify-between">
        <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        <div className="flex gap-2">
          <button
            variant="outlined"
            className="btn-primary"
            onClick={handleAddJobListingButtonClick}
          >
            <span className="mr-2">+</span> JOB LISTING
          </button>
          <button
            variant="outlined"
            className="btn-primary"
            onClick={handleAddIndustryButtonClick}
          >
            <span className="mr-2">+</span> INDUSTRY
          </button>
          <button
            variant="outlined"
            className="btn-primary"
            onClick={handleAddSetupButtonClick}
          >
            <span className="mr-2">+</span> SET-UP
          </button>
        </div>
      </header>
      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-primary text-white px-4 py-2 rounded-2xl w-100 h-10 flex items-center justify-between">
          <span>{`Total Applications`}</span>
          <span className="text-2xl">{`${jobListings.length}`}</span>
        </div>
        <div className="border-2 text-dark px-4 py-2 rounded-2xl w-100 h-10 flex items-center justify-between">
          <span>{`Industries`}</span>
          <span className="text-2xl">{`${industries.length}`}</span>
        </div>

        <div className="border-2 text-dark px-4 py-2 rounded-2xl w-198 h-10 flex items-center justify-between">
          <span>{`Job Listings`}</span>
          <span className="text-2xl">{`${totalJobListings}`}</span>
          <div className="border-l-2 text-dark px-4 py-2 rounded-2xl w-100 h-10 flex items-center justify-between flex-end">
            <span className="">Open</span>
            <span className="text-2xl font-bold">{openJobListings}</span>
            <span className="">Closed</span>
            <span className="text-2xl font-bold">{closedJobListings}</span>
          </div>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="text-right justify-center items-center w-50 h-10 text-2xl p-1">
          Industries
        </div>
        <button
          variant="outlined"
          className=""
          onClick={() => setIndustryMgmtModalIsOpen(true)}
        >
          <MoreVertIcon />
        </button>
      </div>

      <div
        className="ag-theme-quartz p-5"
        style={{ height: "65vh", width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          ref={gridRef}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={15}
          paginationPageSizeSelector={[15, 25, 50]}
          domLayout="autoHeight"
          className="h-full"
        />
      </div>

      {/* Job Modal */}
      <Modal open={jobModalIsOpen} onClose={() => setJobModalIsOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center">
          <Box className="modal-container px-10 py-3 bg-white rounded-lg w-full sm:w-250 max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="mb-4 font-avenir-black text-lg text-center bg-white">
              {jobDetails.job_id === null
                ? "Add Job Listing"
                : "Edit Job Listing"}
            </h2>
            <form
              onSubmit={(e) => handleAddEditJobListing(e)}
              className="space-y-4 mt-1"
            >
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
                    name="industry_id"
                    required
                    disabled={jobDetails.job_id !== null}
                    value={jobDetails.industry_id}
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
                    name="salary_min"
                    value={jobDetails.salary_min}
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
                    name="salary_max"
                    value={jobDetails.salary_max}
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
                    name="employment_type"
                    required
                    value={jobDetails.employment_type}
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
                    name="setup_id"
                    required
                    value={jobDetails.setup_id}
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
                    name="preferred_qualification"
                    value={jobDetails.preferred_qualification}
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
                    name="is_open"
                    required
                    value={jobDetails.is_open}
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
                    name="is_shown"
                    required
                    value={jobDetails.is_shown}
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
              <div className="mt-6 flex justify-end gap-x-3 mb-3">
                <button
                  onClick={handleJobListingModalClose}
                  className="btn-light"
                >
                  Cancel
                </button>
                <button type="submit" variant="filled" className="btn-primary">
                  {jobDetails.job_id === null
                    ? "ADD JOB LISTING"
                    : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </Box>
        </div>
      </Modal>

      {/* INDUSTRY ADD/EDIT MODAL */}
      <Modal open={industryModalIsOpen} onClose={handleIndustryModalClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          <Box className="modal-container px-10 bg-white rounded-lg w-full sm:w-96 max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="mb-4 font-avenir-black text-lg text-center bg-white">
              {jobDetails.job_id === null ? "Add Industry" : "Edit Industry"}
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
                  name="industry_name"
                  required
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-avenir-black">
                  Assessment URL<span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="assessment_url"
                  required
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mt-6 flex justify-end gap-x-3 mb-5">
                <button
                  onClick={() => setIndustryModalIsOpen(false)}
                  className="btn-light"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddEditIndustry}
                  type="submit"
                  variant="filled"
                  className="btn-primary"
                >
                  {editIndustryDetails ? "SAVE CHANGES" : "ADD INDUSTRY"}
                </button>
              </div>
            </form>
          </Box>
        </div>
      </Modal>

      {/* INDUSTRY/SETUP MANAGEMENT MODAL */}
      <Modal
        open={industryMgmtModalIsOpen}
        onClose={() => setIndustryMgmtModalIsOpen(false)}
      >
        <Box className="modal-container bg-white p-4 rounded-lg mx-auto mt-12 w-250 h-200">
          <h2>Manage Industry and Set-up</h2>
          <FormControl fullWidth className="mt-7">
            <Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              sx={{ bgcolor: "#fbe9e7" }}
            >
              <MenuItem value="Industry">Industry</MenuItem>
              <MenuItem value="Set-Up">Set-Up</MenuItem>
            </Select>
          </FormControl>

          <div className="flex justify-between w-full gap-3 mt-4 flex-end">
            {selectedOption === "Industry" ? (
              <button
                variant="outlined"
                className="btn-primary"
                onClick={() => setIndustryModalIsOpen(true)}
              >
                <span className="mr-2">+</span> INDUSTRY
              </button>
            ) : (
              <button
                onClick={() => setSetupModalIsOpen(true)}
                className="btn-primary"
              >
                <span className="mr-2">+</span> SET-UP
              </button>
            )}
          </div>

          {/* INDUSTRY OR SETUP MANAGEMENT */}
          {selectedOption === "Industry" ? (
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Industry Name</TableCell>
                  <TableCell>Assessment URL</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {industries.map((industry, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{industry.industryName}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {industry.assessmentUrl}
                    </TableCell>

                    <TableCell>Admin</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          className="bg-transparent p-2 rounded w-8 flex items-center justify-center"
                          onClick={() => handleEditIndustry(index)}
                        >
                          <EditIcon />
                        </button>

                        <button
                          onClick={() => handleDeleteIndustry(index)}
                          variant="filled"
                          sx={{
                            bgcolor: "#d32f2f",
                            color: "#ffffff",
                            "&:hover": {
                              bgcolor: "#b71c1c",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Setup Name</TableCell>
                  <TableCell>Created by</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {setups.map((setup, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{setup.setupName}</TableCell>
                    <TableCell>{setup.createdBy}</TableCell>
                    <TableCell>{setup.createdAt}</TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          className="bg-transparent p-2 rounded w-8 flex items-center justify-center"
                          onClick={() => handleEditSetUp(index)}
                        >
                          <EditIcon />
                        </button>

                        <button
                          className="bg-transparent p-2 rounded w-8 flex items-center justify-center"
                          onClick={() => handleDeleteSetUp(index)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Modal>

      {/* SETUP ADD/EDIT MODAL */}
      <Modal open={setupModalIsOpen} onClose={handleSetupModalClose}>
        <Box
          className={`modal-container p-6 bg-white rounded-lg mx-auto mt-12 ${
            isSmallScreen ? "w-full" : "sm:w-96"
          }`}
        >
          <h2 className="font-semibold mb-4 text-lg text-center bg-white">
            {editSetupDetails !== null ? "Edit Set-Up" : "Add Set-Up"}
          </h2>
          <form onSubmit={(e) => handleAddEditSetUp(e)} className="space-y-4">
            <TextField
              label="Setup Name"
              variant="outlined"
              fullWidth
              // value={newSetup.setup_name}
              sx={{ bgcolor: "#fbe9e7" }}
              onChange={(e) => handleSetupNameChange(e)}
              placeholder="Enter setup name"
            />

            <div className="mt-6 flex justify-end gap-x-3">
              <button
                onClick={handleSetupModalClose}
                variant="filled"
                className="btn-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                variant="contained"
                color="primary"
                className="btn-primary"
              >
                {editSetupDetails !== null ? "Edit Set-Up" : "Add Set-Up"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
