"use client";

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
import FileUploaderProvider from "../../components/admin/FileUploader";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import ContentButtons from "./ContentButtons";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Testimonials() {
  const user = useStore((state) => state.user);
  //TODO: Fetch data from the API
  const [rowTestimonialData, setRowTestimonialData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/get-all-testimonials");
        const data = response.data?.testimonials || [];

        setRowTestimonialData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    testimonial_id: null,
    employee_image_url: "",
    employee_name: "",
    position: "",
    testimony: "",
    is_shown: 1,
    useImageUrl: false,
    employeeImageFile: null,
  });

  const gridOptions = {
    getRowStyle: (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { background: "#ECF1E3", color: "black" };
      } else {
        return { background: "white", color: "black" };
      }
    },
  };

  const handlePositionChange = (e) => {
    setCurrentTestimonial({
      ...currentTestimonial,
      position: e.target.value,
    });
  };

  const validatePosition = () => {
    const isValid = positionOptions.some(
      (option) => option.value === currentTestimonial.position
    );

    if (!isValid) {
      setCurrentTestimonial({ ...currentTestimonial, position: "" });
    }
  };

  const gridRef = useRef();

  const handleAddEditTestimonial = async (e) => {
    e.preventDefault();

    if (
      !currentTestimonial.employee_name ||
      !currentTestimonial.testimony ||
      !currentTestimonial.position
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (
      !currentTestimonial.useImageUrl &&
      !currentTestimonial.employeeImageFile
    ) {
      toast.error("Please upload an image.");
      return;
    }

    if (
      currentTestimonial.useImageUrl &&
      !currentTestimonial.employee_image_url
    ) {
      toast.error("Please provide a valid image URL.");
      return;
    }

    try {
      const testimonialData = {
        employee_name: currentTestimonial.employee_name,
        employee_image_url: currentTestimonial.useImageUrl
          ? currentTestimonial.employee_image_url
          : currentTestimonial.employeeImageFile ||
            "https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
        position: currentTestimonial.position,
        testimony: currentTestimonial.testimony,
        is_shown:
          currentTestimonial.is_shown === undefined
            ? 0
            : currentTestimonial.is_shown, // Default to 0 (Hidden) if undefined
        user_id: user.id,
      };

      let response;

      // Check if there's an existing testimonial_id (i.e., update) or not (i.e., add new)
      if (currentTestimonial.testimonial_id) {
        response = await api.post("/api/edit-testimonial", {
          ...testimonialData,
          testimonial_id: currentTestimonial.testimonial_id, // Add testimonial_id for update
        });
      } else {
        response = await api.post("/api/add-testimonial", testimonialData); // No testimonial_id for add
      }

      // Handle response after submitting
      if (response.data?.success) {
        toast.success(
          response.data.message || "Testimonial saved successfully!"
        );
        if (currentTestimonial.testimonial_id) {
          // If updating, update the local state accordingly
          const updatedTestimonials = rowTestimonialData.map((testimonial) =>
            testimonial.id === currentTestimonial.testimonial_id
              ? { ...testimonialData, id: currentTestimonial.testimonial_id }
              : testimonial
          );
          setRowTestimonialData(updatedTestimonials);
        } else {
          // If adding new, add to state
          setRowTestimonialData((prevData) => [
            ...prevData,
            { ...testimonialData, id: response.data.id },
          ]);
        }
      } else {
        toast.error(response.data.message || "Failed to save testimonial.");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("Something went wrong. Please try again.");
    }

    // Clear form and close dialog
    setCurrentTestimonial({});
    setOpenDialog(false);
  };

  const handleAdd = () => {
    setCurrentTestimonial({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (testimonial_id) => {
    try {
      console.log("Deleting testimonial with ID:", testimonial_id);

      const response = await api.post("/api/delete-testimonial", {
        testimonial_id: testimonial_id,
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setRowTestimonialData((prevData) =>
          prevData.filter((t) => t.testimonial_id !== testimonial_id)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("An error occurred while deleting the testimonial");
    }
  };

  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

  const handleUpload = (fileUrl) => {
    setCurrentTestimonial({
      ...currentTestimonial,
      employee_image_url: fileUrl,
    });
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Preview Changes"
          handleClick={handleAdd}
        />
      </div>

      <div className="border-primary rounded-md w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div
            className="ag-theme-quartz min-w-[600px] lg:w-full "
            style={{ height: "600px", width: "100%" }}
          >
            <AgGridReact
              rowData={rowTestimonialData}
              columnDefs={[
                {
                  headerName: "Image",
                  field: "employee_image_url",
                  flex: 1,
                  filter: "agTextColumnFilter",
                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: (params) =>
                    params.value ? (
                      <img
                        src={params.value}
                        alt="Employee"
                        className="w-[80px] h-[80px] sm:w-[80px] sm:h-[80px] rounded-md object-cover mx-auto "
                      />
                    ) : (
                      <span>No Image</span>
                    ),
                },

                {
                  headerName: "Employee Name",
                  field: "employee_name",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },

                {
                  headerName: "Testimony",
                  field: "testimony",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Position",
                  field: "position",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Visibility",
                  field: "is_shown",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueFormatter: (params) =>
                    params.value === 1 ? "Shown" : "Hidden",
                },
                {
                  headerName: "Date Created",
                  field: "created_at",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    params.data?.created_at
                      ? new Date(params.data.created_at).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )
                      : "N/A",
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
                  headerClass: "text-primary font-bold bg-gray-100",
                  flex: 1,
                  cellRenderer: (params) => (
                    <div className="flex gap-2">
                      <IconButton onClick={() => handleEdit(params.data)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(params.data.testimonial_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
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
              domLayout="autoHeight"
              rowHeight={
                window.innerWidth < 640 ? 60 : window.innerWidth < 768 ? 70 : 80
              }
              pagination
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20, 50]}
              ref={gridRef}
            />
          </div>
        </div>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: "600px",
              height: "auto",
              maxHeight: "90vh",
            },
          }}
        >
          <DialogTitle className="w-full text-center justify-center">
            {currentTestimonial.testimonial_id
              ? "Edit Testimonial"
              : "Add Testimonial"}
          </DialogTitle>
          <DialogContent>
            <form
              onSubmit={(e) => handleAddEditTestimonial(e)}
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div className="w-full mb-3">
                <label className="block text-gray-700 font-avenir-black">
                  Employee Name<span className="text-primary">*</span>
                </label>
                <input
                  name="name"
                  required
                  value={currentTestimonial.employee_name || ""}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      employee_name: e.target.value,
                    })
                  }
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>

              <div className="w-full mb-3">
                <label className="block text-gray-700 font-avenir-black">
                  Testimony<span className="text-primary">*</span>
                </label>
                <textarea
                  name="testimony"
                  required
                  value={currentTestimonial.testimony || ""}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      testimony: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>

              <div className="w-full mb-3">
                <label className="block text-gray-700 font-avenir-black">
                  Position<span className="text-primary">*</span>
                </label>
                <input
                  name="position"
                  required
                  // list="position-options"
                  value={currentTestimonial.position || ""}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      position: e.target.value,
                    })
                  }
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-avenir-black">
                  Visibility<span className="text-primary">*</span>
                </label>
                <select
                  name="visibility"
                  required
                  value={
                    currentTestimonial.is_shown !== undefined
                      ? currentTestimonial.is_shown
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      is_shown: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                >
                  <option value="" disabled>
                    -- Select an option --
                  </option>
                  <option value={1}>Shown</option>
                  <option value={0}>Hidden</option>
                </select>
              </div>

              <div className="w-full mb-3">
                <label className="block text-gray-700 font-avenir-black">
                  Employee Image<span className="text-primary">*</span>
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageOption"
                      value="upload"
                      checked={!currentTestimonial.useImageUrl}
                      onChange={() =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          useImageUrl: false,
                          employee_image_url: "",
                        })
                      }
                    />
                    Upload File
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageOption"
                      value="url"
                      checked={currentTestimonial.useImageUrl}
                      onChange={() =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          useImageUrl: true,
                          employeeImageFile: null,
                        })
                      }
                    />
                    Use URL
                  </label>
                </div>

                {!currentTestimonial.useImageUrl ? (
                  <div className="mt-3">
                    <FileUploaderProvider
                      onUpload={(fileUrl) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          employeeImageFile: fileUrl,
                        })
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <input
                      type="url"
                      name="employee_image_url"
                      placeholder="Enter image URL"
                      value={currentTestimonial.employee_image_url || ""}
                      onChange={(e) =>
                        setCurrentTestimonial({
                          ...currentTestimonial,
                          employee_image_url: e.target.value,
                        })
                      }
                      className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
              </div>

              <DialogActions>
                <button
                  type="button"
                  className="btn-light"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Testimonials;
