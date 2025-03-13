import React, { useState, useEffect, useRef, useMemo } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { ToggleButton} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import config from "../../config";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function AdminJobListing() {
  // JOB LISTINGS VARIABLES
  const [jobListings, setJobListings] = useState([]);
  const [newJobListing, setNewJobListing] = useState({});
  const [jobModalIsOpen, setJobModalIsOpen] = useState(false);
  const [editJobDetails, setEditJobDetails] = useState(null);

  // JOB FUNCTIONS
  const handleAddJobListingButtonClick = () => {
    setNewJobListing((nj) => ({
      ...nj,
      user_id: "81aba726-f897-11ef-a725-0af0d960a833",
    }));
    setJobModalIsOpen(true);
  };

  const handleNewJobListingChange = (e) => {
    setNewJobListing((ni) => ({ ...ni, [e.target.name]: e.target.value }));
  };

  const handleAddEditJobListing = async (e) => {
    e.preventDefault();
    if (editJobDetails === null) {
      // ADD JOB LISTING
      const response = (
        await axios.post(`${config.apiBaseUrl}/api/add-job`, newJobListing)
      ).data;
      alert(response.message);
      setJobListings((j) => [...j, newJobListing]);
    } else {
      const updatedJobListings = jobListings.map((job, index) =>
        index === editJobDetails ? data : job
      );
      console.log(updatedJobListings);

      setJobListings(updatedJobListings);
    }
    setEditJobDetails(null);
    setJobModalIsOpen(false);
  };

  const handleJobListingModalClose = () => {
    setNewJobListing((nj) => {});
    setJobModalIsOpen(false);
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
        setIndustries((i) => [...i, newIndustry]);
        const response = (
          await axios.post(`${config.apiBaseUrl}/api/add-industry`, newIndustry)
        ).data;
        alert(response.message);
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
        setSetups([...setups, newSetup]);
        const response = (
          await axios.post(`${config.apiBaseUrl}/api/add-setup`, newSetup)
        ).data;
        alert(response.message);
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
              onClick={() => handleEditJob(params.data)}
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
              onClick={() => handleEditIndustry(params.data)}
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

  useEffect(() => {
    const fetchIndustries = async () => {
      const response = (
        await axios.get(`${config.apiBaseUrl}/api/get-all-industries-hr`)
      ).data;
      console.log(response.data);
      setIndustries((i) => (i = response.data));
      setRowIndustryData(response.data);
    };

    const fetchSetups = async () => {
      const response = (
        await axios.get(`${config.apiBaseUrl}/api/get-all-setups`)
      ).data;

      console.log(response.data);

      setSetups((s) => (s = response.data));
      setRowSetupData(response.data);
    };

    const fetchJobListings = async () => {
      const response = (await axios.get(`${config.apiBaseUrl}/api/all-jobs`))
        .data;

      setJobListings((jl) => (jl = response.data));
      setRowJobData(response.data);
    };

    fetchIndustries();
    fetchSetups();
    fetchJobListings();
  }, [setIndustries, setSetups, setJobListings]);

  const totalJobListings = jobListings.length;
  const openJobListings = jobListings.filter(
    (value) => value.isOpen === 1
  ).length;
  const closedJobListings = jobListings.filter(
    (value) => value.isOpen === 0
  ).length;

  const handleEditJob = (index) => {
    setEditJobDetails(index);
    setJobModalIsOpen(true);
  };

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
      <Modal open={jobModalIsOpen} onClose={() => setJobModalIsOpen(false)}>
        <div className="space-y-10 overflow-hidden ">
          <Box className="modal-container p-2 bg-white rounded-lg w-full sm:w-250 mx-auto mt-24h-screen overflow-y-auto">
            <h2 className="mb-4 text-lg text-center bg-white ">
              {editJobDetails === null ? "Add Job Listing" : "Edit Job Listing"}
            </h2>
            <form
              onSubmit={(e) => handleAddEditJobListing(e)}
              className="space-y-4 mt-1"
            >
              <div className="flex justify-between gap-4">
                <TextField
                  label="Job Title"
                  variant="outlined"
                  required
                  name="title"
                  onChange={(e) => handleNewJobListingChange(e)}
                  fullWidth
                  className="gap-x-3"
                  margin="normal"
                  sx={{ bgcolor: "#fbe9e7" }}
                />
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Industry</InputLabel>
                  <Select
                    label="Industry"
                    name="industry_id"
                    required
                    onChange={(e) => handleNewJobListingChange(e)}
                    sx={{ bgcolor: "#fbe9e7" }}
                  >
                    {industries.map((option, index) => (
                      <MenuItem key={index} value={option.industryId}>
                        {option.industryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <TextField
                label="Description"
                variant="outlined"
                required
                name="description"
                onChange={(e) => handleNewJobListingChange(e)}
                fullWidth
                multiline
                className="mt-2"
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />
              <div className="flex gap-4">
                <TextField
                  label="Minimum Salary"
                  variant="outlined"
                  name="salary_min"
                  onChange={(e) => handleNewJobListingChange(e)}
                  fullWidth
                  type="number"
                  className="mt-2"
                  margin="normal"
                  defaultValue={0}
                  sx={{ bgcolor: "#fbe9e7" }}
                />
                <TextField
                  label="Max Salary"
                  variant="outlined"
                  name="salary_max"
                  onChange={(e) => handleNewJobListingChange(e)}
                  fullWidth
                  type="number"
                  className="mt-2"
                  margin="normal"
                  defaultValue={0}
                  sx={{ bgcolor: "#fbe9e7" }}
                />
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    label="Employment Type"
                    name="employment_type"
                    required
                    onChange={(e) => handleNewJobListingChange(e)}
                    sx={{ bgcolor: "#fbe9e7" }}
                  >
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Set-Up</InputLabel>
                  <Select
                    label="Setup"
                    required
                    name="setup_id"
                    onChange={(e) => handleNewJobListingChange(e)}
                    sx={{ bgcolor: "#fbe9e7" }}
                  >
                    {setups.map((setup, index) => (
                      <MenuItem key={setup.setupId} value={setup.setupId}>
                        {setup.setupName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <TextField
                label="Responsibilities"
                variant="outlined"
                name="responsibility"
                onChange={(e) => handleNewJobListingChange(e)}
                multiline
                fullWidth
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />

              <TextField
                label="Requirements"
                variant="outlined"
                name="requirement"
                onChange={(e) => handleNewJobListingChange(e)}
                multiline
                fullWidth
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />

              <TextField
                id="filled-textarea"
                label="Preferred Qualifications"
                variant="outlined"
                name="preferred_qualification"
                onChange={(e) => handleNewJobListingChange(e)}
                multiline
                fullWidth
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />
              <div className="flex gap-4">
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    required
                    name="is_open"
                    onChange={(e) => handleNewJobListingChange(e)}
                    sx={{ bgcolor: "#fbe9e7" }}
                  >
                    <MenuItem value={1}>Open</MenuItem>
                    <MenuItem value={0}>Closed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    label="Visibility"
                    required
                    name="is_shown"
                    onChange={(e) => handleNewJobListingChange(e)}
                    sx={{ bgcolor: "#fbe9e7" }}
                  >
                    <MenuItem value={1}>Shown</MenuItem>
                    <MenuItem value={0}>Hidden</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="mt-6 flex justify-end gap-x-3">
                <button
                  onClick={handleJobListingModalClose}
                  variant="filled"
                  className="btn-light"
                >
                  Cancel
                </button>
                <button type="submit" variant="filled" className="btn-primary">
                  {editJobDetails === null ? "ADD JOB LISTING" : "SAVE CHANGES"}
                </button>
              </div>
            </form>
          </Box>
        </div>
      </Modal>

      {/* INDUSTRY ADD/EDIT MODAL */}
      <Modal open={industryModalIsOpen} onClose={handleIndustryModalClose}>
        <Box
          className={`modal-container p-6 bg-white rounded-lg mx-auto mt-12 ${
            isSmallScreen ? "w-full" : "sm:w-96"
          }`}
        >
          <h2 className="font-semibold mb-4 text-lg text-center bg-white">
            {editIndustryDetails ? "Edit Industry" : "Add Industry"}
          </h2>
          <form
            onSubmit={(e) => {
              handleAddEditIndustry(e);
            }}
            className="space-y-4"
          >
            <div className="">
              <TextField
                label="Industry Name"
                fullWidth
                onChange={(e) => handleIndustryChange(e)}
                className="mt-2"
                sx={{ bgcolor: "#fbe9e7" }}
              />
            </div>
            <TextField
              label="Assessment URL"
              fullWidth
              onChange={(e) => handleIndustryChange(e)}
              className="mt-2"
              sx={{ bgcolor: "#fbe9e7" }}
            />

            <div className="mt-6 flex justify-end gap-x-3">
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
      </Modal>

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
                  borderRadius:"20px",
                  fontSize:"16px",
                  width:"400px",
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
