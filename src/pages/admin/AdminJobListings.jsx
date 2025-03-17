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
    setIndustryDetails((id) => ({
      ...id,
      user_id: "81aba726-f897-11ef-a725-0af0d960a833",
    }));
    setIndustryModalIsOpen((io) => true);
  };

  const handleAddEditIndustry = async (e) => {
    e.preventDefault();
    console.log("Industry Details:", industryDetails);

    try {
      let response;
      if (industryDetails.job_ind_id === null) {
        // ADD JOB LISTING
        response = await api.post("/api/add-industry", {
          ...industryDetails,
          user_id: user.id,
        });
      } else {
        // EDIT JOB LISTING
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
    setIndustryDetails((ni) => ({ ...ni, [e.target.name]: e.target.value }));
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

  const handleAddEditSetup = async (e) => {
    e.preventDefault();
    if (!editSetupIsOpe) {
      // ADD SETUP
      if (newSetup.setup_name != "" && !setups.includes(newSetup)) {
        console.log(newSetup.user_id);
        const response = (await api.post("/api/add-setup", newSetup)).data;
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
        flex: 1,
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
        flex: 1,
        filter: "agTextColumnFilter",
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
              onClick={() => handleEditSetUp(params.data)}
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

    setIndustries((i) => (i = response.data));
    setRowIndustryData(response.data);
  };

  const fetchSetups = async () => {
    const response = (await api.get("/api/get-all-setups")).data;

    console.log(response.data);

    setSetups((s) => (s = response.data));
    setRowSetupData(response.data);
  };

  const fetchJobListings = async () => {
    const response = (await api.get("/api/all-jobs")).data;

    setJobListings((jl) => (jl = response.data));
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
                onClick={() => setIndustryModalIsOpen(true)}
              >
                ADD INDUSTRY
              </button>
            ) : (
              <button
                onClick={() => setSetupModalIsOpen(true)}
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
          <form onSubmit={(e) => handleAddEditSetup(e)} className="space-y-4">
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
