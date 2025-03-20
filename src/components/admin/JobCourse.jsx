"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [rowCourseData, setRowCourseData] = useState([
    {
      id: "1",
      title: "React Free Course",
      relatedJob: "Junior Software Engineer",
      url: "http://sampleurl.com/react",
    },
    {
      id: "2",
      title: "Tailwind Free Course",
      relatedJob: "First Job Title",
      url: "http://sampleurl.com/tailwind",
    },
    {
      id: "3",
      title: "Node.JS Free Course",
      relatedJob: "Second Job Title",
      url: "http://sampleurl.com/nodejs",
    },
    {
      id: "4",
      title: "Sample Course Title",
      relatedJob: "Third Job Title",
      url: "http://sampleurl.com/sample",
    },
    {
      id: "5",
      title: "Another Sample Course",
      relatedJob: "Fourth Job Title",
      url: "http://sampleurl.com/another",
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
    relatedJob: "",
    url: "",
  });

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRowCourseData(rowCourseData.filter((course) => course.id !== id));
  };

  const handleAddNew = () => {
    setCurrentCourse({ id: "", title: "", relatedJob: "", url: "" });
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
    <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
      <Card sx={{ boxShadow: "none" }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-gray-100 rounded flex items-center p-4 cursor-pointer"
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Job Courses
          </Typography>
          <IconButton>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        {isExpanded && (
          <CardContent>
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

            <div className="w-full overflow-x-auto">
              <div
                className="ag-theme-quartz p-3 sm:p-5 min-w-[600px] lg:w-full overflow-x-auto"
                style={{ height: "400px" }}
              >
                <AgGridReact
                  rowData={rowCourseData}
                  columnDefs={[
                    {
                      headerName: "Title",
                      field: "title",
                      flex: 2,
                      headerClass: "text-primary font-bold bg-tertiary",
                    },
                    {
                      headerName: "Related Job",
                      field: "relatedJob",
                      flex: 2,
                      headerClass: "text-primary font-bold bg-tertiary",
                    },
                    {
                      headerName: "URL",
                      field: "url",
                      flex: 2,
                      headerClass: "text-primary font-bold bg-tertiary",
                    },
                    {
                      headerName: "Action",
                      field: "action",
                      flex: 2,
                      headerClass: "text-primary font-bold bg-tertiary",
                      cellRenderer: (params) => (
                        <div className="flex gap-2">
                          <IconButton onClick={() => handleEdit(params.data)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(params.data.id)}
                          >
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
          </CardContent>
        )}

        {/* Dialog for Add/Edit */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {currentCourse.id ? "Edit Course" : "Add Course"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              value={currentCourse.title}
              onChange={(e) =>
                setCurrentCourse({ ...currentCourse, title: e.target.value })
              }
            />
            <TextField
              label="Related Job"
              fullWidth
              margin="dense"
              value={currentCourse.relatedJob}
              onChange={(e) =>
                setCurrentCourse({
                  ...currentCourse,
                  relatedJob: e.target.value,
                })
              }
            />
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
      </Card>
    </div>
  );
}

export default JobCourse;
