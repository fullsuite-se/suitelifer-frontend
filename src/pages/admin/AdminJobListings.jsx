import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
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
import atsAPI from "../../utils/atsAPI";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminJobListing() {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // NUMBER OF APPLICATIONS
  const [totalApplications, setTotalApplications] = useState(0);
  const [openJobs, setOpenJobs] = useState(0);
  const [closedJobs, setClosedJobs] = useState(0);

  const fetchTotalApplications = async () => {
    try {
      const response = await atsAPI.get("/analytic/metrics/fs-applicant-count");

      setTotalApplications(response.data.fs_count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOpenJobs = async () => {
    try {
      const response = await api.get("api/get-open-jobs-count");

      setOpenJobs((oj) => response.data.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchClosedJobs = async () => {
    try {
      const response = await api.get("api/get-closed-jobs-count");

      setClosedJobs((cj) => response.data.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTotalApplications();
  }, []);

  // JOB LISTINGS VARIABLES
  const defaultJobDetails = {
    jobId: null,
    title: "",
    industryId: "",
    industryName: "",
    setupId: "",
    employmentType: "",
    description: "",
    salaryMin: null,
    salaryMax: null,
    responsibility: "",
    requirement: "",
    preferredQualification: "",
    isOpen: "",
    isShown: "",
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
      if (jobDetails.jobId === null) {
        // ADD JOB LISTING
        response = await api.post("/api/add-job", {
          ...jobDetails,
          userId: user.id,
        });
      } else {
        // EDIT JOB LISTING
        response = await api.post("/api/edit-job", {
          ...jobDetails,
          userId: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (jobDetails.jobId === null) {
          setJobListings((jl) => [...jl, jobDetails]);
        } else {
          const updatedJobListings = jobListings.map((job) =>
            job.jobId === jobDetails.jobId ? { ...jobDetails } : job
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
      jobId: job.jobId,
      title: job.jobTitle,
      industryId: job.industryId,
      industryName: job.industryName,
      setupId: job.setupId,
      employmentType: job.employmentType,
      description: job.description,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      responsibility: job.responsibility,
      requirement: job.requirement,
      preferredQualification: job.preferredQualification,
      isOpen: job.isOpen,
      isShown: job.isShown,
    }));
    setJobModalIsOpen(true);
  };

  const [statusFilter, setStatusFilter] = useState(null);

  const fetchJobListingsByStatus = async (status) => {
    console.log("Clicked");

    try {
      const response = await api.get(
        `/api/get-jobs-filtered-by-status/${status}`
      );

      setJobListings(response.data.data);
      setRowJobData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // INDUSTRY VARIABLES
  const defaultIndustryDetails = {
    jobIndId: null,
    industryName: "",
    assessmentUrl: "",
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
      if (industryDetails.jobIndId === null) {
        // ADD INDUSTRY
        response = await api.post("/api/add-industry", {
          ...industryDetails,
          userId: user.id,
        });
      } else {
        // EDIT INDUSTRY
        response = await api.post("/api/edit-industry", {
          ...industryDetails,
          userId: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (industryDetails.jobIndId === null) {
          setIndustries((i) => [...i, industryDetails]);
        } else {
          const updatedIndustries = industries.map((industry) =>
            industry.industryId === industryDetails.jobIndId
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
      jobIndId: industry.industryId,
      industryName: industry.industryName,
      assessmentUrl: industry.assessmentUrl,
    }));
    setIndustryModalIsOpen((io) => true);
  };

  // SETUP VARIABLES
  const defaultSetupDetails = {
    setupId: null,
    setupName: "",
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
      if (setupDetails.setupId === null) {
        // ADD SETUP
        response = await api.post("/api/add-setup", {
          ...setupDetails,
          userId: user.id,
        });
      } else {
        // EDIT SETUP
        response = await api.post("/api/edit-setup", {
          ...setupDetails,
          userId: user.id,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        if (setupDetails.setupId === null) {
          setSetups((s) => [...s, setupDetails]);
        } else {
          const updatedSetups = setups.map((setup) =>
            setup.setupId === setupDetails.setupId
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
      setupId: setup.setupId,
      setupName: setup.setupName,
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
        flex: 2,
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
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
      },
    }),

    []
  );

  const [rowIndustryData, setRowIndustryData] = useState([]);
  const colIndustry = useMemo(
    () => [
      {
        headerName: "Industry Name",
        field: "industryName",
        flex: 3,
        headerClass: "text-primary font-bold bg-tertiary",
      },
      {
        headerName: "Assessment URL",
        field: "assessmentUrl",
        flex: 3,
        filter: "agTextColumnFilter",
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
        flex: 2,
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
        valueGetter: (params) =>
          params.data?.createdAt
            ? new Date(params.data.createdAt).toLocaleString()
            : "N/A",
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
    setStatusFilter(null);
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchIndustries();
    fetchSetups();
    fetchJobListings();
    fetchOpenJobs();
    fetchClosedJobs();
  }, [dataUpdated]);

  const totalJobListings = jobListings.length;

  const handleToggle = () => {
    setSelectedOption((prev) =>
      prev === "Manage Industry" ? "Manage Set-Up" : "Manage Industry"
    );
  };

  return (
    <div className="flex flex-col p-2 mx-auto space-y-6">
      {/* Header */}
      <header className="container flex h-10 items-center justify-between">
        <div className="flex ms-auto gap-1">
          {/* Desktop & Tablet Buttons */}
          <button
            variant="outlined"
            className="btn-primary hidden sm:flex"
            onClick={handleAddJobListingButtonClick}
          >
            <span className="mr-2">+</span> JOB LISTING
          </button>
          <button
            variant="outlined"
            className="btn-primary hidden sm:flex"
            onClick={handleAddIndustryButtonClick}
          >
            <span className="mr-2">+</span> INDUSTRY
          </button>
          <button
            variant="outlined"
            className="btn-primary hidden sm:flex"
            onClick={handleAddSetupButtonClick}
          >
            <span className="mr-2">+</span> SET-UP
          </button>

          {/* Mobile Buttons (Icons Only) */}
          <button
            className="btn-primary flex sm:hidden p-2 gap-2"
            onClick={handleAddJobListingButtonClick}
          >
            <span>+</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
              />
            </svg>
          </button>
          <button
            className="btn-primary flex sm:hidden p-2 gap-2"
            onClick={handleAddIndustryButtonClick}
          >
            <span>+</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
              />
            </svg>
          </button>
          <button
            className="btn-primary flex sm:hidden p-2 gap-2"
            onClick={handleAddSetupButtonClick}
          >
            <span>+</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>

          {/* Settings Button (Always Visible) */}
          <button
            variant="outlined"
            className="text-primary"
            onClick={() => setIndustryMgmtModalIsOpen(true)}
          >
            <SettingsIcon fontSize="large" />
          </button>
        </div>
      </header>
      {/* Stats */}
      <section className="mb-4 grid grid-cols-4 grid-rows-[7rem] [&>*]:border [&>*]:border-gray-200 gap-4">
        <div className="rounded-md grid place-content-center bg-gray-100">
          <span className="text-3xl text-center">{totalApplications}</span>
          <div className="text-sm text-gray-500 text-center">Applications</div>
        </div>
        <div
          className="rounded-md grid place-content-center cursor-pointer bg-gray-100"
          onClick={() => setIndustryMgmtModalIsOpen(true)}
        >
          <span className="text-3xl text-center">{industries.length}</span>
          <div className="text-sm text-gray-500 text-center">Industries</div>
        </div>
        <div
          className={`rounded-md grid place-content-center cursor-pointer ${
            statusFilter === 1 ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => {
            statusFilter === 1
              ? fetchJobListings()
              : fetchJobListingsByStatus(1);
            setStatusFilter(1);
          }}
        >
          <span className="text-2xl text-center">{openJobs}</span>
          <div className="text-sm text-gray-500 text-center">Open Jobs</div>
        </div>
        <div
          className={`rounded-md grid place-content-center cursor-pointer ${
            statusFilter === 0 ? "bg-gray-300" : "bg-gray-100"
          }`}
          onClick={() => {
            statusFilter === 0
              ? fetchJobListings()
              : fetchJobListingsByStatus(0);
            setStatusFilter(0);
          }}
        >
          <span className="text-2xl text-center">{closedJobs}</span>
          <div className="text-sm text-gray-500 text-center">Closed Jobs</div>
        </div>
      </section>
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
        <Box className="modal-container bg-white p-4 rounded-lg mx-auto mt-12 w-[75dvw] h-[85dvh] overflow-y-scroll">
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
            <div className="w-full overflow-x-auto">
              <div
                className="ag-theme-quartz p-5 min-w-[800px] sm:w-full"
                style={{ height: window.innerWidth < 640 ? "50vh" : "65vh" }}
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
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div
                className="ag-theme-quartz p-5 min-w-[800px] sm:w-full"
                style={{ height: window.innerWidth < 640 ? "50vh" : "65vh" }}
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
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
