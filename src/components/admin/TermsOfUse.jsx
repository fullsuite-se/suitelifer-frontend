import React, { useRef, useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { showConfirmationToast } from "../toasts/confirm";
import { ModalDeleteConfirmation } from "../modals/ModalDeleteConfirmation";
import ContentButtons from "./ContentButtons";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const defaultTerms = {
  termsId: null,
  title: "",
  content: "",
  createdAt: "",
  createdBy: "",
};

function TermsOfUse() {
  const gridRef = useRef();
  const [terms, setTerms] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [termsDetails, setTermsDetails] = useState(defaultTerms);

  const handleAdd = () => {
    setTermsDetails(defaultTerms);
    setAddEditModalOpen(true);
  };

  const handleEdit = (data) => {
    setTermsDetails(data);
    setAddEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setTermsDetails((t) => ({ ...t, termsId: id }));
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    const filtered = terms.filter(
      (item) => item.termsId !== termsDetails.termsId
    );
    setTerms(filtered);
    showConfirmationToast.success("Terms of Use deleted");
    setDeleteModalOpen(false);
    setTermsDetails(defaultTerms);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!termsDetails.title || !termsDetails.content) {
      showConfirmationToast.error("Title and content are required.");
      return;
    }

    let updatedTerms = [...terms];

    if (termsDetails.termsId) {
      updatedTerms = updatedTerms.map((item) =>
        item.termsId === termsDetails.termsId ? termsDetails : item
      );
    } else {
      updatedTerms.push({
        ...termsDetails,
        termsId: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: "Melbraei Santiago",
      });
    }

    setTerms(updatedTerms);
    setTermsDetails(defaultTerms);
    setAddEditModalOpen(false);
    setDataUpdated(!dataUpdated);
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Terms of Use"
          handleClick={handleAdd}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <div
          className="ag-theme-quartz min-w-[600px] lg:w-full"
          style={{ height: "600px" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={terms}
            columnDefs={[
              {
                headerName: "Title",
                field: "title",
                flex: 1,
                headerClass: "text-primary font-bold bg-gray-100",
              },
              {
                headerName: "Content",
                field: "content",
                flex: 2,
                headerClass: "text-primary font-bold bg-gray-100",
              },
              {
                headerName: "Date Created",
                field: "createdAt",
                flex: 1,
                valueGetter: (params) =>
                  new Date(params.data.createdAt).toLocaleString(),
                headerClass: "text-primary font-bold bg-gray-100",
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
                      onClick={() => handleDeleteClick(params.data.termsId)}
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
              },
            }}
            domLayout="autoHeight"
            rowHeight={window.innerWidth < 640 ? 60 : 80}
            pagination={true}
            paginationPageSize={5}
            paginationPageSizeSelector={[5, 10]}
          />
        </div>
      </div>

      <Dialog
        open={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            padding: "20px",
            width: "600px",
          },
        }}
      >
        <form onSubmit={handleSave}>
          <DialogTitle>
            {termsDetails.termsId ? "Edit Terms of Use" : "Add Terms of Use"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={termsDetails.title}
              onChange={(e) =>
                setTermsDetails((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              margin="normal"
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              minRows={4}
              value={termsDetails.content}
              onChange={(e) =>
                setTermsDetails((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="btn-light"
              onClick={() => {
                setAddEditModalOpen(false);
                setTermsDetails(defaultTerms);
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
          setTermsDetails(defaultTerms);
        }}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this Terms of Use?"
      />
    </>
  );
}

export default TermsOfUse;
