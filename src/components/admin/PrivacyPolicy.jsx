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
import {
  PlusCircleIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import ActionButtons from "./ActionButtons";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const defaultPolicy = {
  policyId: null,
  title: "",
  content: "",
  createdAt: "",
  createdBy: "",
};

function PrivacyPolicy() {
  const gridRef = useRef();
  const [policies, setPolicies] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);

  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [policyDetails, setPolicyDetails] = useState(defaultPolicy);

  const handleAdd = () => {
    setPolicyDetails(defaultPolicy);
    setAddEditModalOpen(true);
  };

  const handleEdit = (data) => {
    setPolicyDetails(data);
    setAddEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setPolicyDetails((p) => ({ ...p, policyId: id }));
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    const filtered = policies.filter(
      (item) => item.policyId !== policyDetails.policyId
    );
    setPolicies(filtered);
    showConfirmationToast.success("Policy deleted");
    setDeleteModalOpen(false);
    setPolicyDetails(defaultPolicy);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!policyDetails.title || !policyDetails.content) {
      showConfirmationToast.error("Title and content are required.");
      return;
    }

    let updatedPolicies = [...policies];

    if (policyDetails.policyId) {
      updatedPolicies = updatedPolicies.map((item) =>
        item.policyId === policyDetails.policyId ? policyDetails : item
      );
    } else {
      updatedPolicies.push({
        ...policyDetails,
        policyId: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: "Melbraei Santiago",
      });
    }

    setPolicies(updatedPolicies);
    setPolicyDetails(defaultPolicy);
    setAddEditModalOpen(false);
    setDataUpdated(!dataUpdated);
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Policy"
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
            rowData={policies}
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
                headerClass: "text-primary font-bold bg-gray-100",
                cellRenderer: (params) => (
                  <div className="flex">
                    <ActionButtons
                      icon={<PencilIcon className="size-5 cursor-pointer" />}
                      handleClick={() => handleEdit(params.data)}
                    />
                    <ActionButtons
                      icon={<TrashIcon className="size-5 cursor-pointer" />}
                      handleClick={() =>
                        handleDeleteClick(params.data.policyId)
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
            {policyDetails.policyId ? "Edit Policy" : "Add Policy"}
          </DialogTitle>
          <DialogContent>
            <div className="text-md font-bold pt-4 font-avenir-black">
              Title<span className="text-primary">*</span>
            </div>
            <input
              name="itle"
              value={policyDetails.title}
              onChange={(e) =>
                setPolicyDetails((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full p-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <div className="text-md font-bold pt-4 font-avenir-black">
              Content<span className="text-primary">*</span>
            </div>
            <textarea
              name="content"
              value={policyDetails.content}
              onChange={(e) =>
                setPolicyDetails((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              rows={8}
              className="w-full p-3 resize-y border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className="btn-light"
              onClick={() => {
                setAddEditModalOpen(false);
                setPolicyDetails(defaultPolicy);
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
          setPolicyDetails(defaultPolicy);
        }}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this privacy policy?"
      />
    </>
  );
}

export default PrivacyPolicy;
