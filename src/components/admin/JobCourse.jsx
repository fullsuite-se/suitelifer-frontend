"use client";

import { useState, useRef } from "react";
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

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function JobCourse() {
  const [jobs] = useState([
    { id: 1, title: "Software Engineer" },
    { id: 2, title: "Web Developer" },
    { id: 3, title: "Data Analyst" },
    { id: 4, title: "Data Scientist" },
    
  ]);
  const [rowCourseData, setRowCourseData] = useState([
    {
      id: "1",
      title: "React Free Course",
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
    id: "",
    title: "",
    description: "",
    relatedJob: "",
    jobTitle: "",
    url: "",
    createdAT: "",
    createdBy: "",
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
      prevData.filter((course) => course.id !== id)
    );
  };

  const handleAddNew = () => {
    setCurrentCourse({
      id: "",
      title: "",
      relatedJob: [],
      url: "",
      description: "",
      jobTitle: "",
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentCourse.id) {
      setRowCourseData((prevData) =>
        prevData.map((course) =>
          course.id === currentCourse.id ? currentCourse : course
        )
      );
    } else {
      setRowCourseData((prevData) => [
        ...prevData,
        { ...currentCourse, id: Date.now().toString() },
      ]);
    }
    setOpenDialog(false);
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
                              jobs.find((job) => job.id === jobId).title
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
                  <label key={job.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={job.id}
                      checked={currentCourse.relatedJob.includes(job.id)}
                      onChange={(e) => {
                        const updatedRelatedJob = e.target.checked
                          ? [...currentCourse.relatedJob, job.id]
                          : currentCourse.relatedJob.filter(
                              (item) => item !== job.id
                            );

                        handleInputChange("relatedJob")({
                          target: { value: updatedRelatedJob },
                        });
                      }}
                      className="accent-primary"
                    />
                    <span>{job.title}</span>
                  </label>
                ))}
              </div>
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
          </DialogContent>
          <DialogActions>
            <button className="btn-light" onClick={() => setOpenDialog(false)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              variant="contained"
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default JobCourse;
