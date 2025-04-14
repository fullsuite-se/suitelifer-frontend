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
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import ContentButtons from "./ContentButtons";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Testimonials() {
  // USER DETAILS
  const user = useStore((state) => state.user);

  const [imageFile, setImageFile] = useState(null);

  const defaultTestimonialDetails = {
    testimonialId: null,
    employeeImageUrl: "",
    employeeName: "",
    position: "",
    testimony: "",
    isShown: 1,
  };

  const [testimonialDetails, setTestimonialDetails] = useState(
    defaultTestimonialDetails
  );

  const handleTestimonialDetailsChange = (e) => {
    setTestimonialDetails((td) => ({ ...td, [e.target.name]: e.target.value }));
    console.log(testimonialDetails);
    console.log(imageFile);
  };

  const handleAddEditTestimonial = async (e) => {
    e.preventDefault();

    if (
      !testimonialDetails.employeeName ||
      !testimonialDetails.testimony ||
      !testimonialDetails.position
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let response;

    try {
      if (!testimonialDetails.testimonialId) {
        // VALIDATE EMPLOYEE IMAGE
        if (imageFile === null) {
          toast.error("Please upload an image.");
          return;
        }

        const formData = new FormData();

        formData.append("file", imageFile);

        console.log("mag-uupload na dapat");

        // UPLOAD EMPLOYEE IMAGE
        const uploadResponse = await api.post(
          "/api/upload-image/testimonials",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // SET CLOUDINARY IMAGE URL TO TESTIMONIAL DETAILS
        testimonialDetails.employeeImageUrl = uploadResponse.data.imageUrl;

        console.log("mag-add ng testimonial sa database");

        // ADD TESTIMONIAL
        response = await api.post("/api/testimonials", {
          ...testimonialDetails,
          userId: user.id,
        });
      } else {
        response = await api.put("/api/testimonials", {
          ...testimonialDetails,
          userId: user.id,
        });
      }

      if (response.data?.success) {
        // SUCCESS
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to save testimonial.");
      }

      setDataUpdated(!dataUpdated);
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast.error("Something went wrong. Please try again.");
    }

    // Clear form and close dialog
    setTestimonialDetails(defaultTestimonialDetails);
    setImageFile(null);
    setModalIsOpen(false);
  };

  const handleAddClick = () => {
    setTestimonialDetails({});
    setModalIsOpen(true);
  };

  const handleEditClick = (testimonial) => {
    setTestimonialDetails(testimonial);
    setModalIsOpen(true);
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

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [rowTestimonialData, setRowTestimonialData] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await api.get("/api/testimonials");
      const data = response.data.testimonials;

      setRowTestimonialData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchData();
  }, [dataUpdated]);

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Testimonial"
          handleClick={handleAddClick}
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
                  field: "employeeImageUrl",
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
                  field: "employeeName",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Position",
                  field: "position",
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
                  field: "isShown",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueFormatter: (params) =>
                    params.value === 1 ? "Shown" : "Hidden",
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  valueGetter: (params) =>
                    params.data?.createdAt
                      ? new Date(params.data.createdAt).toLocaleString()
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
                      <IconButton onClick={() => handleEditClick(params.data)}>
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
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: "600px",
              height: "auto",
              maxHeight: "90vh",
            },
          }}
        >
          <DialogTitle className="w-full text-center justify-center">
            {testimonialDetails.testimonialId
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
                  name="employeeName"
                  required
                  value={testimonialDetails.employeeName || ""}
                  onChange={(e) => handleTestimonialDetailsChange(e)}
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
                  value={testimonialDetails.position || ""}
                  onChange={(e) => handleTestimonialDetailsChange(e)}
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>

              <div className="w-full mb-3">
                <label className="block text-gray-700 font-avenir-black">
                  Testimony<span className="text-primary">*</span>
                </label>
                <textarea
                  name="testimony"
                  required
                  value={testimonialDetails.testimony || ""}
                  onChange={(e) => handleTestimonialDetailsChange(e)}
                  rows={7}
                  className="w-full p-3 resize-none border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-avenir-black">
                  Visibility<span className="text-primary">*</span>
                </label>
                <select
                  name="isShown"
                  required
                  value={
                    testimonialDetails.isShown !== undefined
                      ? testimonialDetails.isShown
                      : ""
                  }
                  onChange={(e) => handleTestimonialDetailsChange(e)}
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

                <div className="mt-3">
                  <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
              </div>

              <DialogActions>
                <button
                  type="button"
                  className="btn-light"
                  onClick={() => setModalIsOpen(false)}
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
