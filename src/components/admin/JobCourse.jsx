import { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { ModalDeleteConfirmation } from "../modals/ModalDeleteConfirmation";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function JobCourse() {
  const user = useStore((state) => state.user);

  // DATA UPDATES
  const [dataUpdated, setDataUpdated] = useState(false);

  const [rowCourseData, setRowCourseData] = useState([]);

  const gridRef = useRef();

  // ADD EDIT MODAL
  const [addEditModalIsOpen, setAddEditModalIsOpen] = useState(false);

  // DELETE MODAL
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const defaultCourseDetails = {
    courseId: null,
    title: "",
    description: "",
    url: "",
  };

  const [courseDetails, setCourseDetails] = useState(defaultCourseDetails);

  const handleEdit = (course) => {
    setCourseDetails({
      ...course,
    });
    setAddEditModalIsOpen(true);
  };

  const handleDeleteClick = (courseId) => {
    setCourseDetails((cd) => ({ ...cd, courseId }));
    setDeleteModalIsOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete("api/course", {
        data: { courseId: courseDetails.courseId },
      });

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
      setCourseDetails(defaultCourseDetails);
    } catch (err) {
      console.log(err);
    }
  };

  const showAddDialog = () => {
    setAddEditModalIsOpen(true);
  };

  const handleAddEditCourse = async (e) => {
    e.preventDefault();

    try {
      if (courseDetails.courseId === null || courseDetails.courseId === "") {
        // ADD COURSE
        const response = await api.post("/api/course", {
          ...courseDetails,
          userId: user.id,
        });

        toast.success(response.data.message);
      } else {
        // EDIT COURSE
        const response = await api.put("/api/course", {
          ...courseDetails,
          userId: user.id,
        });

        toast.success(response.data.message);
      }

      setDataUpdated(!dataUpdated);
      setCourseDetails(defaultCourseDetails);
      setAddEditModalIsOpen(false);
    } catch (error) {
      console.log("Error adding course");
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setCourseDetails((c) => ({
      ...c,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchJobCourses = async () => {
    try {
      const response = await api.get("api/course");

      console.log(response.data.courses);

      setRowCourseData(response.data.courses);
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
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "URL",
                  field: "url",
                  flex: 3,
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
                  field: "createdAt",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    formatTimestamp(params.data.createdAt).fullDate,
                },
                {
                  headerName: "Created By",
                  field: "createdBy",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  // valueGetter: (params) =>
                  //   `${params.data.first_name} ${params.data.last_name}`,
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
                        onClick={() => handleDeleteClick(params.data.courseId)}
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
          open={addEditModalIsOpen}
          onClose={() => setAddEditModalIsOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              padding: "20px",
              width: "600px",
            },
          }}
        >
          <form onSubmit={(e) => handleAddEditCourse(e)}>
            <DialogTitle className="flex w-full justify-center items-center">
              {courseDetails.courseId ? "Edit Course" : "Add Course"}
            </DialogTitle>
            <DialogContent>
              <div className="w-full">
                <label className="block text-gray-700 font-avenir-black mt-2">
                  Title<span className="text-primary">*</span>
                </label>

                <input
                  name="title"
                  required
                  value={courseDetails.title}
                  onChange={(e) => handleInputChange(e)}
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
                  value={courseDetails.url}
                  onChange={(e) => handleInputChange(e)}
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
                  value={courseDetails.description}
                  onChange={(e) => handleInputChange(e)}
                  rows={3}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>
            </DialogContent>
            <DialogActions>
              <button
                type="button"
                className="btn-light"
                onClick={() => {
                  setAddEditModalIsOpen(false);
                  setCourseDetails(defaultCourseDetails);
                }}
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
      <ModalDeleteConfirmation
        isOpen={deleteModalIsOpen}
        handleClose={() => {
          setDeleteModalIsOpen(false);
          setCourseDetails(defaultCourseDetails);
        }}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this course? This action cannot be undone."
      />
    </>
  );
}

export default JobCourse;
