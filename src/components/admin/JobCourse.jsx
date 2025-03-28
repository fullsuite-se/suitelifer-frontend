"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function JobCourse() {
  const user = useStore(state => state.user);

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("api/all-jobs");
      console.log(response.data.data);
      setJobs(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const [rowCourseData, setRowCourseData] = useState([
    {
      jobId: "1",
      jobTitle: "React Free Course",
      relatedJob: [1],
      url: "http://sampleurl.com/react",
      description: "This is a sample description",
      jobTitle: "Software Engineer",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
  ]);

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

  const [openDialog, setOpenDialog] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    id: null,
    title: "",
    description: "",
    relatedJob: "",
    jobTitle: "",
    url: "",
  });

  const handleEdit = (course) => {
    setCurrentCourse({
      ...course,
      relatedJob: course.relatedJob || [],
    });
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRowCourseData((prevData) =>
      prevData.filter((course) => course.jobId !== id)
    );
  };

  const handleAddNew = () => {
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log(currentCourse.id === null);
    
    
    try {
      if (currentCourse.id === null) {

        const response = await api.post("/api/add-course", { ...currentCourse, userId: user.id });
        
        const courseId = response.data.courseId;

        const res = await api.post("/api/add-job-course", {courseId, relatedJobs: currentCourse.relatedJob, userId: user.id });
        
        console.log(res.data.message);
        
      } else {
        setRowCourseData((prevData) => [
          ...prevData,
          { ...currentCourse, jobId: Date.now().toString() },
        ]);
      }
      setOpenDialog(false);
    } catch (error) {
      console.log("Test error");
      console.log(error);
      
    }
  };

  const handleInputChange = (field) => (event) => {
    setCurrentCourse((prevCourse) => ({
      ...prevCourse,
      [field]: event.target.value,
    }));
  };

  const handleCheckboxChange = (jobId) => (event) => {
    setCurrentCourse((prevCourse) => {
      const updatedRelatedJob = event.target.checked
        ? [...prevCourse.relatedJob, jobId]
        : prevCourse.relatedJob.filter((id) => id !== jobId);

      return {
        ...prevCourse,
        relatedJob: updatedRelatedJob,
      };
    });
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          variant="contained"
          onClick={handleAddNew}
          sx={{ mb: 2 }}
          className="btn-primary mb-2 "
        >
          <div className="flex items-center justify-center w-full gap-1">
            <ControlPointIcon fontSize="small" />
            <span className="text-sm flex items-center justify-center">
              Course
            </span>
          </div>
        </button>
      </div>
      <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div
            className="ag-theme-quartz p-3 sm:p-5 min-w-[600px] lg:w-full overflow-x-auto"
            style={{ height: "400px" }}
          >
            <AgGridReact
              rowData={rowCourseData}
              columnDefs={[
                {
                  headerName: "Course Title",
                  field: "title",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Description",
                  field: "description",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-tertiary",
                },

                {
                  headerName: "URL",
                  field: "url",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Related Job",
                  field: "relatedJob",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-tertiary",
                  valueGetter: (params) =>
                    params.data?.relatedJob
                      ? params.data.relatedJob
                          .map(
                            (jobId) =>
                              jobs.find((job) => job.jobId === jobId)?.jobTitle
                          )
                          .join(", ")
                      : "N/A",
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 1,
                  filter: "agTextColumnFilter",
                  headerClass: "text-primary font-bold bg-tertiary",
                  valueGetter: (params) =>
                    params.data?.createdAt
                      ? new Date(params.data.createdAt).toLocaleString()
                      : "N/A",
                },
                {
                  headerName: "Created By",
                  field: "createdBy",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-tertiary",
                  cellRenderer: (params) => (
                    <div className="flex gap-2">
                      <IconButton onClick={() => handleEdit(params.data)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(params.data.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ),
                },
              ]}
              defaultColDef={{ sortable: true, filter: true }}
              rowHeight={50}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20, 50]}
              gridOptions={gridOptions}
              ref={gridRef}
            />
          </div>
        </div>

        {/* Dialog for Add/Edit */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "20px",
              width: "600px",
            },
          }}
        >
          <form onSubmit={e => handleSave(e)}>
            <DialogTitle className="flex w-full justify-center items-center">
              {currentCourse.id ? "Edit Course" : "Add Course"}
            </DialogTitle>
            <DialogContent>
              <div className="w-full">
                <label className="block text-gray-700 font-avenir-black mt-2">
                  Title<span className="text-primary">*</span>
                </label>

                <input
                  name="title"
                  required
                  value={currentCourse.title}
                  onChange={handleInputChange("title")}
                  rows={3}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary "
                />
              </div>
              <div>
                <label className="block text-gray-700 font-avenir-black mt-2">
                  URL<span className="text-primary">*</span>
                </label>
                <input
                  name="url"
                  required
                  value={currentCourse.url}
                  onChange={handleInputChange("url")}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-avenir-black mt-2">
                  Description<span className="text-primary">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={currentCourse.description}
                  onChange={handleInputChange("description")}
                  rows={3}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="w-full">
                <label className="block text-gray-700 font-avenir-black mt-2">
                  Related Job<span className="text-primary">*</span>
                </label>
                <div className="flex flex-col bg-primary/10 p-2 rounded-md max-h-50 overflow-auto">
                  {jobs.map((job) => (
                    <label
                      key={job.jobId}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={job.jobId}
                        checked={currentCourse.relatedJob.includes(job.jobId)}
                        onChange={(e) => {
                          const updatedRelatedJob = e.target.checked
                            ? [...currentCourse.relatedJob, job.jobId]
                            : currentCourse.relatedJob.filter(
                                (item) => item !== job.jobId
                              );

                          handleInputChange("relatedJob")({
                            target: { value: updatedRelatedJob },
                          });
                        }}
                        className="accent-primary"
                      />
                      <span>{job.jobTitle}</span>
                    </label>
                  ))}
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                className="btn-light"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" variant="contained">
                Save
              </button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

export default JobCourse;
