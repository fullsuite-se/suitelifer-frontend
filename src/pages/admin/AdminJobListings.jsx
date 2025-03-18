import React, { useState, useEffect, useRef, useMemo } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { ToggleButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import api from "../../utils/axios";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import JobListingModal from "../../components/admin/JobListingModal";
import IndustryModal from "../../components/admin/IndustryModal";
import SetupModal from "../../components/admin/SetupModal";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminJobListing() {
  // JOB LISTINGS VARIABLES
  const defaultJobDetails = {
    job_id: null,
    title: "",
    industry_id: "",
    industry_name: "",
    setup_id: "",
    employment_type: "",
    description: "",
    salary_min: null,
    salary_max: null,
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
    setJobModalIsOpen((io) => true);
  };

  const handleAddEditJobListing = async (e) => {
    e.preventDefault();
    console.log("Job Details:", jobDetails);

    try {
      let response;
      if (jobDetails.job_id === null) {
        // ADD JOB LISTING
        response = await api.post("/api/add-job", {
          ...jobDetails,
          user_id: user.id,
        });
      } else {
        // EDIT JOB LISTING
        response = await api.post("/api/edit-job", {
          ...jobDetails,
          user_id: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (jobDetails.job_id === null) {
          setJobListings((jl) => [...jl, jobDetails]);
        } else {
          const updatedJobListings = jobListings.map((job) =>
            job.jobId === jobDetails.job_id ? { ...jobDetails } : job
          );
          setJobListings((jl) => updatedJobListings);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing the request.");
    }

    setJobDetails((jd) => defaultJobDetails);
    setJobModalIsOpen((io) => false);
    setDataUpdated((du) => !dataUpdated);
  };

  const handleJobDetailsChange = (e) => {
    setJobDetails((jd) => ({ ...jd, [e.target.name]: e.target.value }));
  };

  const handleJobListingModalClose = () => {
    setJobDetails((jd) => defaultJobDetails);
    setJobModalIsOpen((io) => false);
  };

  const handleEditJobClick = (job) => {
    setJobDetails((jd) => ({
      job_id: job.jobId,
      title: job.jobTitle,
      industry_id: job.industryId,
      industry_name: job.industryName,
      setup_id: job.setupId,
      employment_type: job.employmentType,
      description: job.description,
      salary_min: job.salaryMin,
      salary_max: job.salaryMax,
      responsibility: job.responsibility,
      requirement: job.requirement,
      preferred_qualification: job.preferredQualification,
      is_open: job.isOpen,
      is_shown: job.isShown,
    }));
    setJobModalIsOpen(true);
  };

  // INDUSTRY VARIABLES
  const defaultIndustryDetails = {
    job_ind_id: null,
    industry_name: "",
    assessment_url: "",
  };

  const [industries, setIndustries] = useState([]);
  const [industryDetails, setIndustryDetails] = useState(
    defaultIndustryDetails
  );
  const [industryModalIsOpen, setIndustryModalIsOpen] = useState(false);

  // INDUSTRY MGMT
  const [industryMgmtModalIsOpen, setIndustryMgmtModalIsOpen] = useState(false);

  // INDUSTRY FUNCTIONS
  const handleAddIndustryButtonClick = () => {
    setIndustryModalIsOpen((io) => true);
  };

  const handleAddEditIndustry = async (e) => {
    e.preventDefault();
    console.log("Industry Details:", industryDetails);

    try {
      let response;
      if (industryDetails.job_ind_id === null) {
        // ADD INDUSTRY
        response = await api.post("/api/add-industry", {
          ...industryDetails,
          user_id: user.id,
        });
      } else {
        // EDIT INDUSTRY
        response = await api.post("/api/edit-industry", {
          ...industryDetails,
          user_id: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (industryDetails.job_ind_id === null) {
          setIndustries((i) => [...i, industryDetails]);
        } else {
          const updatedIndustries = industries.map((industry) =>
            industry.industryId === industryDetails.job_ind_id
              ? { ...industryDetails }
              : industry
          );
          setIndustries((i) => updatedIndustries);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing the request.");
    }

    setIndustryDetails((id) => defaultIndustryDetails);
    setIndustryModalIsOpen((io) => false);
    setDataUpdated((du) => !dataUpdated);
  };

  const handleIndustryDetailsChange = (e) => {
    setIndustryDetails((id) => ({ ...id, [e.target.name]: e.target.value }));
  };

  const handleIndustryModalClose = () => {
    setIndustryDetails((id) => defaultIndustryDetails);
    setIndustryModalIsOpen((io) => false);
  };

  const handleEditIndustryClick = (industry) => {
    setIndustryDetails((id) => ({
      job_ind_id: industry.industryId,
      industry_name: industry.industryName,
      assessment_url: industry.assessmentUrl,
    }));
    setIndustryModalIsOpen((io) => true);
  };

  // SETUP VARIABLES
  const defaultSetupDetails = {
    setup_id: null,
    setup_name: "",
  };

  const [setups, setSetups] = useState([]);
  const [setupDetails, setSetupDetails] = useState(defaultSetupDetails);
  const [setupModalIsOpen, setSetupModalIsOpen] = useState(false);

  // SETUP FUNCTIONS
  const handleAddSetupButtonClick = () => {
    setSetupModalIsOpen((io) => true);
  };

  const handleAddEditSetup = async (e) => {
    e.preventDefault();
    console.log("Setup Details:", setupDetails);

    try {
      let response;
      if (setupDetails.setup_id === null) {
        // ADD SETUP
        response = await api.post("/api/add-setup", {
          ...setupDetails,
          user_id: user.id,
        });
      } else {
        // EDIT SETUP
        response = await api.post("/api/edit-setup", {
          ...setupDetails,
          user_id: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (setupDetails.setup_id === null) {
          setSetups((s) => [...s, setupDetails]);
        } else {
          const updatedSetups = setups.map((setup) =>
            setup.setupId === setupDetails.setup_id
              ? { ...setupDetails }
              : setup
          );
          setSetups((s) => updatedSetups);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing the request.");
    }

    setSetupDetails((id) => defaultSetupDetails);
    setSetupModalIsOpen((io) => false);
    setDataUpdated((du) => !dataUpdated);
  };

  const handleSetupDetailsChange = (e) => {
    setSetupDetails((sd) => ({ ...sd, [e.target.name]: e.target.value }));
  };

  const handleSetupModalClose = () => {
    setSetupDetails((ns) => defaultSetupDetails);
    setSetupModalIsOpen((io) => false);
  };

  const handleEditSetupClick = (setup) => {
    setSetupDetails((sd) => ({
      setup_id: setup.setupId,
      setup_name: setup.setupName,
    }));
    setSetupModalIsOpen((io) => true);
  };

  const [selectedOption, setSelectedOption] = useState("Manage Industry");

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
  const [rowJobData, setRowJobData] = useState([]);
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
        headerName: "Set-Up",
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

  const [rowIndustryData, setRowIndustryData] = useState([]);
  const colIndustry = useMemo(
    () => [
      {
        headerName: "Industry Name",
        field: "industryName",
        flex: 1,
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Assessment URL",
        field: "assessmentUrl",
        flex: 2,
        filter: "agTextColumnFilter",
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Created By",
        field: "createdBy",
        flex: 1,
        filter: "agTextColumnFilter",
        valueFormatter: (params) => (params.value === 1 ? "Open" : "Closed"),
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Date Created",
        field: "createdAt",
        flex: 2,
        filter: "agTextColumnFilter",
        headerClass: "text-primary font-bold bg-tertiary",
        valueGetter: (params) =>
          params.data?.createdAt
            ? new Date(params.data.createdAt).toLocaleString()
            : "N/A",
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
                handleEditIndustryClick(params.data);
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

  const [rowSetupData, setRowSetupData] = useState([]);
  const colSetup = useMemo(
    () => [
      {
        headerName: "Setup Name",
        field: "setupName",
        flex: 1,
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Created By",
        field: "createdBy",
        flex: 2,
        filter: "agTextColumnFilter",
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Date Created",
        field: "createdAt",
        flex: 1,
        filter: "agTextColumnFilter",
        valueFormatter: (params) => (params.value === 1 ? "Open" : "Closed"),
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
                handleEditSetupClick(params.data);
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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // API CALLS
  const fetchIndustries = async () => {
    const response = (await api.get("/api/get-all-industries-hr")).data;

    setIndustries((i) => response.data);
    setRowIndustryData(response.data);
  };

  const fetchSetups = async () => {
    const response = (await api.get("/api/get-all-setups")).data;

    setSetups((s) => response.data);
    setRowSetupData(response.data);
  };

  const fetchJobListings = async () => {
    const response = (await api.get("/api/all-jobs")).data;

    setJobListings((jl) => response.data);
    setRowJobData(response.data);
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

  const handleToggle = () => {
    setSelectedOption((prev) =>
      prev === "Manage Industry" ? "Manage Set-Up" : "Manage Industry"
    );
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
          <button
            variant="outlined"
            className="text-primary fontSixe"
            onClick={() => setIndustryMgmtModalIsOpen(true)}
          >
            <SettingsIcon fontSize="large" />
          </button>
        </div>
      </header>
      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-primary text-white px-4 py-2 rounded-2xl w-80 h-10 flex items-center justify-between">
          <span>{`Total Applications`}</span>
          <span className="text-2xl">{`${jobListings.length}`}</span>
        </div>
        <div className="border-2 text-dark px-4 py-2 rounded-2xl w-80 h-10 flex items-center justify-between">
          <span>{`Industries`}</span>
          <span className="text-2xl">{`${industries.length}`}</span>
        </div>

        <div className="border-2 text-dark px-4 py-2 rounded-2xl w-136 h-10 flex items-center justify-between">
          <span>{`Job Listings`}</span>
          <span className="text-2xl">{`${totalJobListings}`}</span>
          <div className="border-l-2 text-dark px-4 py-2 rounded-2xl w-80 h-10 flex items-center justify-between flex-end">
            <span className="">Open</span>
            <span className="text-2xl font-bold">{openJobListings}</span>
            <span className="">Closed</span>
            <span className="text-2xl font-bold">{closedJobListings}</span>
          </div>
        </div>
      </div>
      {/* Search and Filter */}

      <div
        className="ag-theme-quartz p-5"
        style={{ height: "65vh", width: "100%" }}
      >
        <AgGridReact
          rowData={rowJobData}
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
      <JobListingModal
        jobModalIsOpen={jobModalIsOpen}
        handleJobListingModalClose={handleJobListingModalClose}
        jobDetails={jobDetails}
        handleJobDetailsChange={handleJobDetailsChange}
        handleAddEditJobListing={handleAddEditJobListing}
        industries={industries}
        setups={setups}
      />

      {/* INDUSTRY ADD/EDIT MODAL */}
      <IndustryModal
        industryModalIsOpen={industryModalIsOpen}
        handleIndustryModalClose={handleIndustryModalClose}
        industryDetails={industryDetails}
        handleIndustryDetailsChange={handleIndustryDetailsChange}
        handleAddEditIndustry={handleAddEditIndustry}
      />

      {/* SETUP ADD/EDIT MODAL */}
      <SetupModal
        setupModalIsOpen={setupModalIsOpen}
        handleSetupModalClose={handleSetupModalClose}
        setupDetails={setupDetails}
        handleSetupDetailsChange={handleSetupDetailsChange}
        handleAddEditSetup={handleAddEditSetup}
      />

      {/* INDUSTRY/SETUP MANAGEMENT MODAL */}
      <Modal
        open={industryMgmtModalIsOpen}
        onClose={() => setIndustryMgmtModalIsOpen(false)}
      >
        <Box className="modal-container bg-white p-4 rounded-lg mx-auto mt-12 w-250 h-200">
          <div className="flex items-center gap-5 w-full justify-between p-2">
            <ToggleButton
              onClick={handleToggle}
              value={selectedOption}
              variant="contained"
              sx={{
                backgroundColor: "#0097b2",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "16px",
                width: "400px",
                "&:hover": {
                  backgroundColor: "#0088a3",
                  border: "none",
                },
                "&.Mui-selected": {
                  border: "none",
                },
                "&.MuiToggleButton-root": {
                  border: "none",
                },
              }}
            >
              {selectedOption}
            </ToggleButton>

            {selectedOption === "Manage Industry" ? (
              <button
                variant="outlined"
                className="btn-primary flex"
                onClick={() => setIndustryModalIsOpen((io) => true)}
              >
                ADD INDUSTRY
              </button>
            ) : (
              <button
                onClick={() => setSetupModalIsOpen((io) => true)}
                className="btn-primary"
              >
                ADD SET-UP
              </button>
            )}
          </div>

          {/* INDUSTRY OR SETUP MANAGEMENT */}
          {selectedOption === "Manage Industry" ? (
            <div
              className="ag-theme-quartz p-5"
              style={{ height: "65vh", width: "100%" }}
            >
              <AgGridReact
                rowData={rowIndustryData}
                ref={gridRef}
                columnDefs={colIndustry}
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={15}
                paginationPageSizeSelector={[15, 25, 50]}
                domLayout="autoHeight"
                className="h-full"
              />
            </div>
          ) : (
            <div
              className="ag-theme-quartz p-5"
              style={{ height: "65vh", width: "100%" }}
            >
              <AgGridReact
                rowData={rowSetupData}
                ref={gridRef}
                columnDefs={colSetup}
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={15}
                paginationPageSizeSelector={[15, 25, 50]}
                domLayout="autoHeight"
                className="h-full"
              />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
