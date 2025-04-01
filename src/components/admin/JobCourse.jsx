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
import toast from "react-hot-toast";
import formatTimestamp from "../TimestampFormatter";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function JobCourse() {
  const user = useStore((state) => state.user);

  const [jobs, setJobs] = useState([]);

  // DATA UPDATES
  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("api/all-jobs");
      console.log(response.data.data);
      setJobs(response.data.data);
    } catch (e) {
      console.log("ERROR FETCHING JOBS");

      console.log(e);
    }
  };

  const [rowCourseData, setRowCourseData] = useState([
    {
      course_id: "1",
      title: "React Free Course",
      description: "This is a sample description",
      url: "http://sampleurl.com/react",
      created_at: "date",
      created_by: "1476564bhj23178378",
      first_name: "John Wick",
    },
  ]);

  const gridRef = useRef();

  const [openDialog, setOpenDialog] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    course_id: null,
    title: "",
    description: "",
    url: "",
  });

  const handleEdit = (course) => {
    setCurrentCourse({
      ...course,
    });
    console.log(course);

    setOpenDialog(true);
  };

  const handleDelete = async (course_id) => {
    console.log(`Delete: ${course_id}`);

    try {
      const response = await api.post("api/delete-course", { course_id });
      toast.success(response.data.message);
      console.log(response.data.message);
      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const showAddDialog = () => {
    setCurrentCourse({
      course_id: null,
      title: "",
      description: "",
      url: "",
    });
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log(
      currentCourse.course_id === null || currentCourse.course_id == ""
    );

    try {
      if (currentCourse.course_id === null || currentCourse.course_id == "") {
        const response = await api.post("/api/add-course", {
          ...currentCourse,
          userId: user.id,
        });
      } else {
        console.log("Edit course");
        await api.post("/api/update-course", {
          ...currentCourse,
          userId: user.id,
        });
      }
      setDataUpdated(!dataUpdated);
      setOpenDialog(false);
    } catch (error) {
      console.log("Error adding course (catch)");
      console.log(error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setCurrentCourse((prevCourse) => ({
      ...prevCourse,
      [field]: event.target.value,
    }));
  };

  const fetchJobCourses = async () => {
    try {
      const response = await api.get("api/all-courses");

      setRowCourseData(response.data.data);
    } catch (error) {
      console.log("Error Fetching Job Courses");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobCourses();
  }, [dataUpdated]);

  return (
    <>
      <div className="flex justify-end">
        <button
          variant="contained"
          onClick={showAddDialog}
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
      <div className="border-primary rounded-md w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div
            className="ag-theme-quartz min-w-[600px] lg:w-full overflow-x-auto"
            style={{ height: "400px" }}
          >
            <AgGridReact
              rowData={rowCourseData}
              columnDefs={[
                {
                  headerName: "Course Title",
                  field: "title",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "URL",
                  field: "url",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Description",
                  field: "description",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Date Created",
                  field: "created_at",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    formatTimestamp(params.data.created_at).fullDate,
                },
                {
                  headerName: "Created By",
                  field: "created_by",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    `${params.data.first_name} ${params.data.last_name}`,
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: (params) => (
                    <div className="flex gap-2">
                      <IconButton onClick={() => handleEdit(params.data)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(params.data.course_id)}
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
          <form onSubmit={(e) => handleSave(e)}>
            <DialogTitle className="flex w-full justify-center items-center">
              {currentCourse.course_id ? "Edit Course" : "Add Course"}
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
            </DialogContent>
            <DialogActions>
              <button
                type="button"
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
