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
    "Information Technology",
    "Software Engineer",
    "Web Developer",
    "Data Analyst",
    "Data Scientist",
  ]);
  const [rowCourseData, setRowCourseData] = useState([
    {
      id: "1",
      title: "React Free Course",
      relatedJob: "Junior Software Engineer",
      url: "http://sampleurl.com/react",
      description: "This is a sample description",
      jobTitle: "Software Engineer",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
    // other course objects here...
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

  const handleInputChange = (field) => (event) => {
    setCurrentCourse((prevCourse) => ({
      ...prevCourse,
      [field]: event.target.value,
    }));
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRowCourseData(rowCourseData.filter((course) => course.id !== id));
  };

  const handleAddNew = () => {
    setCurrentCourse({
      id: "",
      title: "",
      relatedJob: "",
      url: "",
      description: "",
      jobTitle: "",
      createdAT: "",
      createdBy: "",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentCourse.id) {
      setRowCourseData(
        rowCourseData.map((course) =>
          course.id === currentCourse.id ? currentCourse : course
        )
      );
    } else {
      setRowCourseData([
        ...rowCourseData,
        { ...currentCourse, id: Date.now().toString() },
      ]);
    }
    setOpenDialog(false);
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
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {currentCourse.id ? "Edit Course" : "Add Course"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Course Title"
              fullWidth
              margin="dense"
              value={currentCourse.title}
              onChange={(e) =>
                setCurrentCourse({ ...currentCourse, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="dense"
              value={currentCourse.description}
              onChange={(e) =>
                setCurrentCourse({
                  ...currentCourse,
                  description: e.target.value,
                })
              }
            />
            <FormGroup>
              <label>Related Job</label>
              {jobs.map((job) => (
                <FormControlLabel
                  key={job}
                  control={
                    <Checkbox
                      checked={currentCourse.relatedJob.includes(job)}
                      onChange={(e) => {
                        const updatedRelatedJob = e.target.checked
                          ? [...currentCourse.relatedJob, job]
                          : currentCourse.relatedJob.filter(
                              (item) => item !== job
                            );
                        handleInputChange("relatedJob")({
                          target: { value: updatedRelatedJob },
                        });
                      }}
                    />
                  }
                  label={job}
                />
              ))}
            </FormGroup>

            <TextField
              label="URL"
              fullWidth
              margin="dense"
              value={currentCourse.url}
              onChange={(e) =>
                setCurrentCourse({ ...currentCourse, url: e.target.value })
              }
            />
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
