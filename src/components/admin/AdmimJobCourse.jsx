import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
import formatTimestamp from "../../utils/formatTimestamp";
import { ModalDeleteConfirmation } from "../modals/ModalDeleteConfirmation";
import ContentButtons from "./ContentButtons";
import ComingSoon from "../../pages/admin/ComingSoon";
import {
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import LoadingAnimation from "../loader/Loading";
import ConfirmationDialog from "./ConfirmationDialog";
import ActionButtons from "../buttons/ActionButtons";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// TODO: AdmimJobCourse
function AdmimJobCourse() {
  const [isComingSoon, setComingSoon] = useState(false);

  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const response = await api.delete("api/course", {
        data: { courseId: courseDetails.courseId },
      });

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
      setCourseDetails(defaultCourseDetails);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setDeleteModalIsOpen(false);
    }
  };

  const showAddDialog = () => {
    setAddEditModalIsOpen(true);
  };

  const handleAddEditCourse = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
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
      console.log(error);
    } finally {
      setIsLoading(false);
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
      setRowCourseData(response.data.courses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobCourses();
  }, [dataUpdated]);

  if (isComingSoon) {
    return <ComingSoon />;
  }

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Course"
          handleClick={showAddDialog}
        />
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
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: (params) => (
                    <div className="flex">
                      <ActionButtons
                        icon={<PencilIcon className="size-5" />}
                        handleClick={() => handleEdit(params.data)}
                      />
                      <ActionButtons
                        icon={<TrashIcon className="size-5" />}
                        handleClick={() =>
                          handleDeleteClick(params.data.courseId)
                        }
                      />
                    </div>
                  ),
                },
              ]}
              defaultColDef={{
                filter: "agTextColumnFilter",
                floatingFilter: true,
                sortable: true,
                cellStyle: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                },
              }}
              rowHeight={50}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20, 50]}
              ref={gridRef}
            />
          </div>
        </div>

        {/* Dialog for Add/Edit */}
        {isLoading ? (
          <LoadingAnimation />
        ) : (
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
                    className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
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
                    className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
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
                    className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
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
                <button
                  type="submit"
                  className="btn-primary"
                  variant="contained"
                >
                  Save
                </button>
              </DialogActions>
            </form>
          </Dialog>
        )}
      </div>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <ConfirmationDialog
          open={deleteModalIsOpen}
          onClose={() => {
            setDeleteModalIsOpen(false);
            setCourseDetails(defaultCourseDetails);
          }}
          onConfirm={handleDelete}
          title="Delete Course"
          description="Are you sure you want to delete this course? This action cannot be undone."
          confirmLabel="Delete"
          cancelBtnClass="p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-200 duration-500 text-gray-700"
          confirmBtnClass="p-2 px-4 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 duration-500 text-white"
        />
      )}
    </>
  );
}

export default AdmimJobCourse;
