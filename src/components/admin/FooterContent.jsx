import React, { useRef, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { showConfirmationToast } from "../toasts/confirm";
import { ModalDeleteConfirmation } from "../modals/ModalDeleteConfirmation";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const defaultCert = {
  CertId: null,
  imageUrl: null,
  createdAt: "",
  createdBy: "",
};

function FooterContent() {
  const gridRef = useRef();

  const [certImages, setCertImages] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [certDetails, setCertDetails] = useState(defaultCert);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCertDetails((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    setCertDetails(defaultCert);
    setAddEditModalOpen(true);
  };

  const handleEdit = (data) => {
    setCertDetails(data);
    setAddEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setCertDetails((c) => ({ ...c, CertId: id }));
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    const filtered = certImages.filter(
      (item) => item.CertId !== certDetails.CertId
    );
    setCertImages(filtered);
    showConfirmationToast.success("Certification image deleted");
    setDeleteModalOpen(false);
    setCertDetails(defaultCert);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!certDetails.imageUrl) {
      showConfirmationToast.error("Image is required.");
      return;
    }

    let updatedImages = [...certImages];

    if (certDetails.CertId) {
      updatedImages = updatedImages.map((item) =>
        item.CertId === certDetails.CertId ? certDetails : item
      );
    } else {
      updatedImages.push({
        ...certDetails,
        CertId: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: "Melbraei Santiago",
      });
    }

    setCertImages(updatedImages);
    setCertDetails(defaultCert);
    setAddEditModalOpen(false);
    setDataUpdated(!dataUpdated);
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <button onClick={handleAdd} className="btn-primary">
          <div className="flex items-center gap-1">
            <ControlPointIcon fontSize="small" />
            <span>Add Certification</span>
          </div>
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <div
          className="ag-theme-quartz min-w-[600px] lg:w-full "
          style={{ height: "600px", width: "100%" }}
        >
          <div className="ag-theme-quartz" style={{ height: 400 }}>
            <AgGridReact
              ref={gridRef}
              rowData={certImages}
              columnDefs={[
                {
                  headerName: "Image",
                  field: "imageUrl",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                  cellRenderer: (params) =>
                    params.value ? (
                      <img
                        src={params.value}
                        alt="Certificate"
                        className="w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] rounded-2xl object-cover mx-auto p-2"
                      />
                    ) : (
                      <span>No Image</span>
                    ),
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100 text-left",
                  cellClass: "flex items-center justify-center w-full ",

                  valueGetter: (params) =>
                    new Date(params.data.createdAt).toLocaleString(),
                },
                
                {
                  headerName: "Created By",
                  field: "createdBy",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-gray-100",
                },
                {
                  headerName: "Actions",
                  field: "actions",
                  flex: 1,
                  cellRenderer: (params) => (
                    <div className="flex gap-2">
                      <IconButton onClick={() => handleEdit(params.data)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(params.data.CertId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ),
                },
              ]}
              defaultColDef={{ sortable: true, filter: true }}
              rowHeight={100}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10]}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            padding: "20px",
            width: "500px",
          },
        }}
      >
        <form onSubmit={handleSave}>
          <DialogTitle>
            {certDetails.CertId ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
          <DialogContent>
            <label className="block font-bold text-sm mt-4">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {certDetails.imageUrl && (
              <img
                src={certDetails.imageUrl}
                alt="preview"
                className="w-32 h-20 mt-2 object-cover rounded"
              />
            )}
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="btn-light"
              onClick={() => {
                setAddEditModalOpen(false);
                setCertDetails(defaultCert);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </DialogActions>
        </form>
      </Dialog>

      <ModalDeleteConfirmation
        isOpen={deleteModalOpen}
        handleClose={() => {
          setDeleteModalOpen(false);
          setCertDetails(defaultCert);
        }}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this certification image?"
      />
    </>
  );
}

export default FooterContent;
