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
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import LoadingAnimation from "../../components/loader/Loading";
import ConfirmationDialog from "./ConfirmationDialog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function Testimonials() {
  // USER DETAILS
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

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
      setIsLoading(true);
      if (!testimonialDetails.testimonialId) {
        // VALIDATE EMPLOYEE IMAGE
        if (imageFile === null) {
          toast.error("Please upload an image.");
          return;
        }

        const formData = new FormData();

        formData.append("file", imageFile);

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

        // ADD TESTIMONIAL
        response = await api.post("/api/testimonials", {
          ...testimonialDetails,
          userId: user.id,
        });
      } else {
        if (imageFile !== null) {
          const formData = new FormData();

          formData.append("file", imageFile);

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
        }

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
    } finally {
      setIsLoading(false);
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

  const handleDeleteClick = (testimonial_id) => {
    setTestimonialId(testimonial_id);
    setDeleteModalIsOpen(true);
  };
  const [testimonialId, setTestimonialId] = useState(null);
  const handleDelete = async () => {
    setIsDeleting(true);
    let testimonial_id = testimonialId;
    try {
      const response = await api.delete("/api/testimonials", {
        data: {
          testimonialId: testimonial_id,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setDataUpdated(!dataUpdated);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("An error occurred while deleting the testimonial");
    } finally {
      setIsDeleting(false);
      setDeleteModalIsOpen(false);
    }
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

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
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/147/147142.png"
                        alt="Employee"
                        className="w-[80px] h-[80px] sm:w-[80px] sm:h-[80px] rounded-md object-cover mx-auto "
                      />
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
                        onClick={() =>
                          handleDeleteClick(params.data.testimonialId)
                        }
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
        {isDeleting ? (
          <LoadingAnimation />
        ) : (
          <ConfirmationDialog
            open={deleteModalIsOpen}
            onClose={() => setDeleteModalIsOpen(false)}
            onConfirm={handleDelete}
            title="Delete Testimonial"
            description="Are you sure you want to delete this testimonial? This action cannot be undone."
            confirmLabel="Delete"
            cancelBtnClass="p-2 px-4 cursor-pointer rounded-lg hover:bg-gray-200 duration-500 text-gray-700"
            confirmBtnClass="p-2 px-4 cursor-pointer rounded-lg bg-red-500 hover:bg-red-600 duration-500 text-white"
          />
        )}
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <Dialog
            open={modalIsOpen}
            onClose={(event, reason) => {
              if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                setModalIsOpen(false);
              }
            }}
            disableEscapeKeyDown={true}
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
                    Name<span className="text-primary">*</span>
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
                  <div className="p-2 bg-primary/10 rounded-md cursor-pointer">
                    <select
                      name="isShown"
                      required
                      value={
                        testimonialDetails.isShown !== undefined
                          ? testimonialDetails.isShown
                          : ""
                      }
                      onChange={(e) => handleTestimonialDetailsChange(e)}
                      className="w-full cursor-pointer border-none focus:outline-none"
                    >
                      <option value="" disabled>
                        -- Select an option --
                      </option>
                      <option value={1}>Shown</option>
                      <option value={0}>Hidden</option>
                    </select>
                  </div>
                </div>

                <div className="w-full mb-3">
                  <label className="block text-gray-700 font-avenir-black">
                    Image<span className="text-primary">*</span>
                  </label>

                  <div className="mt-3">
                    <input
                      className="mb-2 block w-fit text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer"
                      type="file"
                      accept=".jpeg,.jpg,.png,.heic"
                      onChange={handleImageFileChange}
                    />
                    <span className="mb-1 flex text-sm text-gray-400">
                      {" "}
                      <InformationCircleIcon className="size-5  text-primary/70" />
                      &nbsp;Accepted formats: .jpeg, .jpg, .png, .heic (rec.
                      1080×1080px)
                    </span>
                    <span className="flex text-sm text-gray-400">
                      {" "}
                      <ExclamationTriangleIcon className="size-5  text-orange-500/70" />
                      &nbsp;Make sure your image is a perfect square (1:1 ratio)
                    </span>
                    {imageFile === null ? (
                      testimonialDetails.testimonialId && (
                        <div className={`preview mt-4`}>
                          <img
                            className=""
                            src={testimonialDetails.employeeImageUrl}
                            alt="Preview"
                          />
                        </div>
                      )
                    ) : (
                      <img
                        className="mb-20"
                        src={URL.createObjectURL(imageFile)}
                      />
                    )}
                  </div>
                </div>

                <DialogActions>
                  <button
                    type="button"
                    className="btn-light"
                    onClick={() => {
                      setModalIsOpen(false);
                      setImageFile(null);
                    }}
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
        )}
      </div>
    </>
  );
}

export default Testimonials;
