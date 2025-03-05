import React, { useState, useEffect } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const initialJobListings = [
  {
    title: "Financial Management Associate",
    description: "Lorem ipsum dolor sit",
    type: "Full-time",
    status: "Open",
    visibility: "Shown",
    salaryRangeStart: "",
    salaryRangeEnd: "",
    responsibilities: "",
    requirements: "",
    preferredQualifications: "",
    industry: "Business Operations",
  },
  {
    title: "Business Operation Manager",
    description: "Business operation",
    type: "Full-time",
    status: "Open",
    visibility: "Shown",
    salaryRangeStart: "",
    salaryRangeEnd: "",
    responsibilities: "",
    requirements: "",
    preferredQualifications: "",
    industry: "Business Operations",
  },
  {
    title: "Associate Manager Business Operations",
    description: "Lorem Ipsum is simply.",
    type: "Full-time",
    status: "Closed",
    visibility: "Hidden",
    salaryRangeStart: "",
    salaryRangeEnd: "",
    responsibilities: "",
    requirements: "",
    preferredQualifications: "",
    industry: "Business Operations",
  },
  {
    title: "Business Operation Associate",
    description: "We are looking for a",
    type: "Full-time",
    status: "Open",
    visibility: "Shown",
    salaryRangeStart: "",
    salaryRangeEnd: "",
    responsibilities: "",
    requirements: "",
    preferredQualifications: "",
    industry: "Business Operations",
  },
];

const initialIndustries = ["Business Operations", "Technology", "Marketing"];

export default function JobListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [jobListings, setJobListings] = useState(initialJobListings);
  const [filteredJobListings, setFilteredJobListings] =
    useState(initialJobListings);
  const [industries, setIndustries] = useState(initialIndustries);
  const [openJobModal, setOpenJobModal] = useState(false);
  const [openIndustryModal, setOpenIndustryModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [newIndustry, setNewIndustry] = useState("");
  const [newSetUp, setNewSetUp] = useState("");
  const [openManageIndustryModal, setOpenManageIndustryModal] = useState(false);
  const [setup, setSetup] = useState(setupData);
  const [openSetUpModal, setOpenSetUpModal] = useState(false);

  const setupData = [
    {
      setup: "",
      createdBy: accountName,
      dateCreated: Date.now(),
      updatedBy: accountName,
      lastUpdated: Date.now(),
    },
  ];

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "Full-time",
      status: "Open",
      visibility: "Shown",
      salaryRangeStart: "",
      salaryRangeEnd: "",
      responsibilities: "",
      requirements: "",
      preferredQualifications: "",
      industry: "",
      setup: "Hybrid",
    },
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const filtered = jobListings.filter((job) => {
      const matchesSearchQuery = job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesIndustry =
        selectedIndustry === "all" || job.industry === selectedIndustry;
      return matchesSearchQuery && matchesIndustry;
    });
    setFilteredJobListings(filtered);
  }, [searchQuery, selectedIndustry, jobListings]);

  const totalJobListings = filteredJobListings.length;
  const openJobListings = filteredJobListings.filter(
    (job) => job.status === "Open"
  ).length;
  const closedJobListings = filteredJobListings.filter(
    (job) => job.status === "Closed"
  ).length;

  const handleTabChange = (event) => {
    const selectedTab = event.target.value;
    setActiveTab(selectedTab);

    if (selectedTab === "MANAGE INDUSTRIES") {
      setIndustries();
    } else {
      setSetUp(setupData);
    }
  };

  const handleAddJob = (data) => {
    if (editJob !== null) {
      const updatedJobListings = jobListings.map((job, index) =>
        index === editJob ? data : job
      );
      setJobListings(updatedJobListings);
    } else {
      setJobListings([...jobListings, data]);
    }
    setEditJob(null);
    setOpenJobModal(false);
    reset();
  };

  const handleAddIndustry = () => {
    if (newIndustry && !industries.includes(newIndustry)) {
      setIndustries([...industries, newIndustry]);
      setNewIndustry("");
      setOpenIndustryModal(false);
    }
  };

  const handleEditJob = (index) => {
    setEditJob(index);
    reset(jobListings[index]);
    setOpenJobModal(true);
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
            onClick={() => setOpenJobModal(true)}
          >
            <span className="mr-2">+</span> JOB LISTING
          </button>
          <button
            variant="outlined"
            className="btn-primary"
            onClick={() => setOpenIndustryModal(true)}
          >
            <span className="mr-2">+</span> INDUSTRY
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-primary text-white px-4 py-2 rounded-md">
          <div className="text-sm">Total Applications</div>
          <div className="text-2xl font-bold">917</div>
        </div>
        <div className="border px-4 py-2 rounded-md">
          <div className="text-sm">Industries</div>
          <div className="text-2xl font-bold">{industries.length}</div>
        </div>
        <div className="border px-4 py-2 rounded-md">
          <div className="text-sm">Job Listings</div>
          <div className="text-2xl font-bold">{totalJobListings}</div>
        </div>
        <div className="flex gap-2">
          <div className="border px-4 py-2 rounded-md">
            <div className="text-sm">Open</div>
            <div className="text-2xl font-bold">{openJobListings}</div>
          </div>
          <div className="border px-4 py-2 rounded-md">
            <div className="text-sm">Closed</div>
            <div className="text-2xl font-bold">{closedJobListings}</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Job"
            className="bg-gray-200 text-black px-4 py-2 rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-right justify-center items-center w-50 h-10 text-2xl p-1">
          Industries
        </div>
        <div className="relative w-full sm:w-[300px]">
          <select
            className="bg-gray-200 h-10 px-4 py-2 rounded w-full"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="all">All Industries</option>
            {industries.map((industry, index) => (
              <option key={index} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        <button
          variant="outlined"
          className=""
          onClick={() => setOpenManageIndustryModal(true)}
        >
          <MoreVertIcon />
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-white border-2">
        <thead>
          <tr className="bg-secondary">
            <th className="py-2 text-left p-2">Job Title</th>
            <th className="py-2 text-left p-2">Description</th>
            <th className="py-2 text-left p-2">Employment Type</th>
            <th className="py-2 text-left p-2">Status</th>
            <th className="py-2 text-left p-2">Set-Up</th>
            <th className="py-2 text-left p-2">Visibility</th>
            <th className="py-2 text-center p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobListings.map((job, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-tertiary" : "bg-white"}
            >
              <td className="py-2 p-2 font-medium">{job.title}</td>
              <td className="py-2 p-2 line-clamp-3">
                <Tooltip title={job.description} arrow>
                  <span>{job.description}</span>
                </Tooltip>
              </td>
              <td className="py-2 p-2">{job.type}</td>
              <td className="py-2 p-2">{job.status}</td>
              <td className="py-2 p-2">{job.setup}</td>
              <td className="py-2 p-2">{job.visibility}</td>
              <td className="py-2 p-2">
                <button
                  className="bg-transparent p-2 rounded w-8 items-center"
                  onClick={() => handleEditJob(index)}
                >
                  <button onClick={openJobModal}>
                    <EditIcon />
                  </button>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Job Modal */}
      <Modal open={openJobModal} onClose={() => setOpenJobModal(false)}>
        <div className="space-y-10 overflow-hidden ">
          <Box className="modal-container p-2 bg-white rounded-lg w-full sm:w-250 mx-auto mt-24h-screen overflow-y-auto">
            <h2 className="mb-4 text-lg text-center bg-white ">
              {editJob !== null ? "Edit Job Listing" : "Add Job Listing"}
            </h2>
            <form
              onSubmit={handleSubmit(handleAddJob)}
              className="space-y-4 mt-1"
            >
              <div className="flex justify-between gap-4">
                <TextField
                  label="Job Title"
                  fullWidth
                  {...register("title")}
                  className="gap-x-3"
                  margin="normal"
                  sx={{ bgcolor: "#fbe9e7" }}
                />
                <TextField
                  label="Industry"
                  fullWidth
                  {...register("industry")}
                  className="gap-x-3"
                  margin="normal"
                  sx={{ bgcolor: "#fbe9e7" }}
                />
              </div>

              <TextField
                label="Description"
                fullWidth
                multiline
                {...register("description")}
                className="mt-2"
                margin="normal"
                variant="filled"
                sx={{ bgcolor: "#fbe9e7" }}
              />
              <div className="flex gap-4">
                <TextField
                  label="Salary Range Start"
                  fullWidth
                  type="number"
                  {...register("salaryRangeStart", { valueAsNumber: true })}
                  className="mt-2"
                  margin="normal"
                  sx={{ bgcolor: "#fbe9e7" }}
                />
                <TextField
                  label="Salary Range End"
                  fullWidth
                  type="number"
                  {...register("salaryRangeEnd", { valueAsNumber: true })}
                  className="mt-2"
                  margin="normal"
                  sx={{ bgcolor: "#fbe9e7" }}
                />

                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    label="Employment Type"
                    sx={{ bgcolor: "#fbe9e7" }}
                    {...register("type")}
                  >
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Set-Up</InputLabel>
                  <Select
                    label="Setup"
                    sx={{ bgcolor: "#fbe9e7" }}
                    {...register("setup")}
                  >
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                    <MenuItem value="On-Site">On-Site</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="In-Office">In-Office</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <TextField
                label="Responsibilities"
                placeholder="Responsibilities"
                multiline
                fullWidth
                {...register("responsibilities")}
                variant="filled"
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />

              <TextField
                label="Requirements"
                placeholder="Requirements"
                multiline
                fullWidth
                {...register("requirements")}
                variant="filled"
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />

              <TextField
                id="filled-textarea"
                label="Preferred Qualifications"
                placeholder="Preferred Qualifications"
                multiline
                fullWidth
                {...register("preferredQualifications")}
                variant="filled"
                margin="normal"
                sx={{ bgcolor: "#fbe9e7" }}
              />
              <div className="flex gap-4">
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    sx={{ bgcolor: "#fbe9e7" }}
                    {...register("status")}
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    label="Visibility"
                    sx={{ bgcolor: "#fbe9e7" }}
                    {...register("visibility")}
                  >
                    <MenuItem value="Shown">Shown</MenuItem>
                    <MenuItem value="Hidden">Hidden</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="mt-6 flex justify-end gap-x-3">
                <Button
                  onClick={() => setOpenJobModal(false)}
                  variant="filled"
                  sx={{
                    bgcolor: "#bf360c",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#e64a19",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="filled"
                  sx={{
                    bgcolor: "#0097b2",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#007a99",
                    },
                  }}
                >
                  {editJob !== null ? "Save Changes" : "Add Job"}
                </Button>
              </div>
            </form>
          </Box>
        </div>
      </Modal>

      {/* Industry Modal */}
      <Modal
        open={openIndustryModal}
        onClose={() => setOpenIndustryModal(false)}
      >
        <Box
          className={`modal-container p-6 bg-white rounded-lg mx-auto mt-12 ${
            isSmallScreen ? "w-full" : "sm:w-96"
          }`}
        >
          <h2 className="font-semibold mb-4 text-lg text-center bg-white">
            Add Industry
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddIndustry();
            }}
            className="space-y-4"
          >
            <TextField
              label="Industry Name"
              fullWidth
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              className="mt-2"
              sx={{ bgcolor: "#fbe9e7" }}
            />
            <div className="mt-6 flex justify-end gap-x-3">
              <Button
                onClick={() => setOpenIndustryModal(false)}
                className="btn-light"
                sx={{
                  bgcolor: "#bf360c",
                  color: "#ffffff",
                  "&:hover": {
                    bgcolor: "#e64a19",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="btn-primary"
                sx={{
                  bgcolor: "#0097b2",
                  color: "#ffffff",
                  "&:hover": {
                    bgcolor: "#007a99",
                  },
                }}
              >
                Add Industry
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {/* Manage Industry and Table Industry Modal */}
      <Modal
        open={openManageIndustryModal}
        onClose={() => setOpenManageIndustryModal(false)}
      >
        <Box className="modal-container p-2 bg-white rounded-lg w-full sm:w-250 mx-auto mt-24h-screen overflow-y-auto">
          <button
            variant="outlined"
            className="btn-primary"
            onClick={() => setOpenIndustryModal(true)}
          >
            Add Industry
          </button>
          <button
            variant="outlined"
            className="btn-primary"
            onClick={() => setOpenSetUpModal(true)}
          >
            Add SetUp
          </button>

          <FormControl fullWidth className="mt-2" margin="normal">
            <InputLabel>Manage Industries</InputLabel>
            <select
              className="bg-gray-200 h-10 px-4 py-2 rounded w-full"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="all">All Industries</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <button onClick={setOpenIndustryModal}>Add Industry</button>
            <button onClick={setOpenSetUpModal}>Add Set-Up</button>
          </FormControl>
        </Box>
      </Modal>

      {/* SetUp Modal */}
      <Modal open={openSetUpModal} onClose={() => setOpenSetUpModal(false)}>
        <Box
          className={`modal-container p-6 bg-white rounded-lg mx-auto mt-12 ${
            isSmallScreen ? "w-full" : "sm:w-96"
          }`}
        >
          <TextField
            label="Set-Up"
            fullWidth
            value={newSetUp}
            onChange={(e) => setNewSetUp(e.target.value)}
            className="mt-2"
            sx={{ bgcolor: "#fbe9e7" }}
          />
        </Box>
      </Modal>
    </div>
  );
}
