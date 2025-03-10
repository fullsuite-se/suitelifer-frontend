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
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
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

const initialSetup = ["Remote", "Hybrid", "On-Site", "In-Office"];

export default function JobListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [jobListings, setJobListings] = useState([]);
  const [filteredJobListings, setFilteredJobListings] = useState([]);

  const [industries, setIndustries] = useState([]);
  const [openJobModal, setOpenJobModal] = useState(false);
  const [openSetUpModal, setOpenSetUpModal] = useState(false);
  const [openIndustryModal, setOpenIndustryModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [isEditModal, setEditIndustry] = useState(false);
  const [newIndustry, setNewIndustry] = useState({
    user_id: "81aba726-f897-11ef-a725-0af0d960a833",
  });
  const [industryName, setIndustryName] = useState();
  const [assessmentUrl, setAssessmentUrl] = useState();
  const [openManageIndustryModal, setOpenManageIndustryModal] = useState(false);
  const [setup, setSetup] = useState(initialSetup);
  const [newSetUp, setNewSetUp] = useState("");
  const [selectedOption, setSelectedOption] = useState("Industry");
  const [editSetUp, setEditSetUp] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "Full-time",
      status: 1,
      visibility: 1,
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
    const fetchIndustries = async () => {
      const response = (
        await axios.get(`${config.apiBaseUrl}/api/get-all-industries-hr`)
      ).data;

      setIndustries((i) => (i = response.data));
    };

    const fetchJobListings = async () => {
      const response = (await axios.get(`${config.apiBaseUrl}/api/all-jobs`))
        .data;

      console.log(response.data);
      setJobListings(response.data);
    };

    fetchIndustries();
    fetchJobListings();

    const filtered = jobListings.filter((job) => {
      const matchesSearchQuery = job.jobTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesIndustry =
        selectedIndustry === "all" || job.industryName === selectedIndustry;
      return matchesSearchQuery && matchesIndustry;
    });
    setFilteredJobListings(filtered);
  }, [setIndustries]);

  const totalJobListings = filteredJobListings.length;
  const openJobListings = filteredJobListings.filter(
    (job) => job.status === 1
  ).length;
  const closedJobListings = filteredJobListings.filter(
    (job) => job.status === 0
  ).length;

  const handleAddJob = async (data) => {
    if (editJob !== null) {
      const updatedJobListings = jobListings.map((job, index) =>
        index === editJob ? data : job
      );
      setJobListings(updatedJobListings);
    } else {
      await axios.post(`${config.apiBaseUrl}/api/add-job`, data);
    }
    setEditJob(null);
    setOpenJobModal(false);
    reset();
  };

  const handleAddIndustry = async () => {
    if (isEditModal) {
      const updatedIndustries = industries.map((industry, index) =>
        index === isEditModal
          ? { name: industryName, assessmentUrl }
          : industry
      );

      setIndustries(updatedIndustries);
      setEditIndustry(null);
    } else {
      await axios.post(`${config.apiBaseUrl}/api/add-industry`, newIndustry);
      setIndustries([...industries, { newIndustry }]);
    }
    setOpenIndustryModal(false);
  };

  const handleAddSetUp = () => {
    if (editSetUp !== null) {
      const updatedSetups = setup.map((item, index) =>
        index === editSetUp ? newSetUp : item
      );
      setSetup(updatedSetups);
      setEditSetUp(null);
    } else {
      if (newSetUp && !setup.includes(newSetUp)) {
        setSetup([...setup, newSetUp]);
      }
    }
    setNewSetUp("");
    setOpenSetUpModal(false);
  };

  const handleEditJob = (index) => {
    setEditJob(index);
    reset(jobListings[index]);
    setOpenJobModal(true);
  };

  const handleIndustryNameChange = (e) => {
    setNewIndustry((n) => (n = { ...n, industry_name: e.target.value }));
    console.log(newIndustry);
  };

  const handleAssessmentUrlChange = (e) => {
    setNewIndustry((n) => (n = { ...n, assessment_url: e.target.value }));
    console.log(newIndustry);
  };

  const handleEditIndustry = (index) => {
    setEditIndustry(index);
    reset({
      name: industries[index].name,
      assessmentUrl: industries[index].assessmentUrl,
    });
    setOpenIndustryModal(true);
  };

  const handleDeleteIndustry = (index) => {
    const updatedIndustries = industries.filter((_, i) => i !== index);
    setIndustries(updatedIndustries);
  };

  const handleEditSetUp = (index) => {
    setEditSetUp(index);
    reset({ name: setup[index] });
    setOpenSetUpModal(true);
  };

  const handleDeleteSetUp = (index) => {
    setSetup(setup.filter((_, i) => i !== index));
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
          <button
            variant="outlined"
            className="btn-primary"
            onClick={() => setOpenSetUpModal(true)}
          >
            <span className="mr-2">+</span> SET-UP
          </button>
        </div>
      </header>
      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-primary text-white px-4 py-2 rounded-md w-80">
          <div className="text-lg text-center">Total Applications</div>
          <div className="text-2xl font-bold text-center">917</div>
        </div>
        <div className="border px-4 py-2 rounded-md w-50 bg-gray-200">
          <div className="text-lg text-center ">Industries</div>
          <div className="text-2xl font-bold text-center">
            {industries.length}
          </div>
        </div>
        <div className="border px-4 py-2 rounded-md w-50 bg-gray-200">
          <div className="text-lg text-center">Job Listings</div>
          <div className="text-2xl font-bold text-center">
            {jobListings.length}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="border px-4 py-2 rounded-md w-25">
            <div className="text-lg text-center">Open</div>
            <div className="text-2xl font-bold text-center">
              {jobListings.filter((value, index) => {
                return value.isOpen === 1;
              }).length}
            </div>
          </div>
          <div className="border px-4 py-2 rounded-md w-25">
            <div className="text-lg text-center">Closed</div>
            <div className="text-2xl font-bold text-center">
            {jobListings.filter((value, index) => {
                return value.isOpen === 0;
              }).length}
            </div>
          </div>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Job"
            className="bg-gray-200 text-black px-4 py-2 rounded-xl w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-right justify-center items-center w-50 h-10 text-2xl p-1">
          Industries
        </div>
        <div className="relative w-full sm:w-[350px]">
          <select
            className="bg-gray-200 h-10 px-4 py-2 rounded-xl w-full"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="all">All Industries</option>
            {industries.map((industry, index) => (
              <option key={index} value={industry.industryId}>
                {industry.industryName}
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
      <div className="border-primary border-2 rounded-2xl overflow-clip">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left py-2 px-5">Job Title</th>
              <th className="text-left p-2">Description</th>
              <th className="text-left p-2">Employment Type</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Set-Up</th>
              <th className="text-left p-2">Visibility</th>
              <th className="text-center p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobListings.map((job, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-tertiary" : "bg-white"}
              >
                <td className="py-2 px-5 font-medium">{job.jobTitle}</td>
                <td className="p-2 line-clamp-1">
                  <Tooltip title={job.description} arrow>
                    <span>
                      {job.description.length > 100
                        ? `${job.description.slice(0, 100)}...`
                        : job.description}
                    </span>
                  </Tooltip>
                </td>
                <td className="p-2">{job.employmentType}</td>
                <td className="p-2">{job.isOpen === 1 ? "Open" : "Closed"}</td>
                <td className="p-2">{job.setupName}</td>
                <td className="p-2">
                  {job.visibility === 1 ? "Shown" : "Hidden"}
                </td>
                <td className="p-2 text-center">
                  <button
                    className="bg-transparent p-2 rounded w-8 items-center"
                    onClick={() => handleEditJob(index)}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Industry</InputLabel>
                  <Select
                    label="Industry"
                    sx={{ bgcolor: "#fbe9e7" }}
                    {...register("industry_id")}
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
                  defaultValue={0}
                  sx={{ bgcolor: "#fbe9e7" }}
                />
                <TextField
                  label="Salary Range End"
                  fullWidth
                  type="number"
                  {...register("salaryRangeEnd", { valueAsNumber: true })}
                  className="mt-2"
                  margin="normal"
                  defaultValue={0}
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
                    {setup.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
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
                    <MenuItem value={1}>Open</MenuItem>
                    <MenuItem value={0}>Closed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth className="mt-2" margin="normal">
                  <InputLabel>Visibility</InputLabel>
                  <Select
                    label="Visibility"
                    sx={{ bgcolor: "#fbe9e7" }}
                    {...register("visibility")}
                  >
                    <MenuItem value={1}>Shown</MenuItem>
                    <MenuItem value={0}>Hidden</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="mt-6 flex justify-end gap-x-3">
                <button
                  onClick={() => setOpenJobModal(false)}
                  variant="filled"
                  className="btn-light"
                >
                  Cancel
                </button>
                <button type="submit" variant="filled" className="btn-primary">
                  {editJob !== null ? "SAVE CHANGES" : "ADD JOB"}
                </button>
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
            {isEditModal ? "Edit Industry" : "Add Industry"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddIndustry();
            }}
            className="space-y-4"
          >
            <div className="">
              <TextField
                label="Industry Name"
                fullWidth
                value={industryName}
                onChange={(e) => handleIndustryNameChange(e)}
                className="mt-2"
                sx={{ bgcolor: "#fbe9e7" }}
              />
            </div>
            <TextField
              label="Assessment URL"
              fullWidth
              value={assessmentUrl}
              onChange={(e) => handleAssessmentUrlChange(e)}
              className="mt-2"
              sx={{ bgcolor: "#fbe9e7" }}
            />

            <div className="mt-6 flex justify-end gap-x-3">
              <button
                onClick={() => setOpenIndustryModal(false)}
                className="btn-light"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddIndustry}
                type="submit"
                variant="filled"
                className="btn-primary"
              >
                {isEditModal ? "SAVE CHANGES" : "ADD INDUSTRY"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      <Modal
        open={openManageIndustryModal}
        onClose={() => setOpenManageIndustryModal(false)}
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
                onClick={() => setOpenIndustryModal(true)}
              >
                <span className="mr-2">+</span> INDUSTRY
              </button>
            ) : (
              <button
                onClick={() => setOpenSetUpModal(true)}
                className="btn-primary"
              >
                <span className="mr-2">+</span> SET-UP
              </button>
            )}
          </div>

          {/* Industry or SetUp */}

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
                    <TableCell>{industry.name}</TableCell>
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
                  <TableCell>Created By</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {setup.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item}</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
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

      {/* SetUp Modal */}
      <Modal open={openSetUpModal} onClose={() => setOpenSetUpModal(false)}>
        <Box
          className={`modal-container p-6 bg-white rounded-lg mx-auto mt-12 ${
            isSmallScreen ? "w-full" : "sm:w-96"
          }`}
        >
          <h2 className="font-semibold mb-4 text-lg text-center bg-white">
            {editSetUp !== null ? "Edit Set-Up" : "Add Set-Up"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddSetUp();
              setOpenSetUpModal(false);
            }}
            className="space-y-4"
          >
            <TextField
              label="Setup Name"
              variant="outlined"
              fullWidth
              value={newSetUp}
              sx={{ bgcolor: "#fbe9e7" }}
              onChange={(e) => setNewSetUp(e.target.value)}
              placeholder="Enter setup name"
            />

            <div className="mt-6 flex justify-end gap-x-3">
              <button
                onClick={() => setOpenSetUpModal(false)}
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
                onClick={() => setOpenSetUpModal(true)}
              >
                {editSetUp !== null ? "Edit Set-Up" : "Add Set-Up"}
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
