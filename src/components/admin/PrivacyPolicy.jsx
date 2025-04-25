"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";
import ContentButtons from "../admin/ContentButtons";
import ActionButtons from "../buttons/ActionButtons";
import { ModalDeleteConfirmation } from "../modals/ModalDeleteConfirmation";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TextEditor from "./TextEditor";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function PrivacyPolicy() {
  const user = useStore((state) => state.user);
  const addLog = useAddAuditLog();
  const gridRef = useRef();
  const [policy, setPolicy] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState({
    policyId: null,
    title: "",
    description: "",
  });

  const handleAddEditPolicy = async () => {
    const newPolicy = {
      ...currentPolicy,
      userId: user.id,
    };

    try {
      if (!currentPolicy.policyId) {
        const response = await api.post("/api/add-policy", {
          ...newPolicy,
          userId: user.id,
        });

        if (response.data?.success) {
          setPolicy((prev) => [response.data.data, ...prev]);
          toast.success(response.data.message);
          addLog({
            action: "CREATE",
            description: `New Privacy Policy (${newPolicy.title}) added`,
          });
        } else {
          toast.error(
            response.data.message || "Failed to save Privacy Policy."
          );
        }
      } else {
        const response = await api.put("/api/edit-policy", {
          ...currentPolicy,
          userId: user.id,
        });

        if (response.data?.success) {
          setPolicy((prev) =>
            prev.map((policy) =>
              policy.policyId === currentPolicy.policyId
                ? currentPolicy
                : policy
            )
          );
          toast.success(response.data.message);
          addLog({
            action: "UPDATE",
            description: `Privacy Policy (${currentPolicy.title}) has been updated`,
          });
        } else {
          toast.error(
            response.data.message || "Failed to update Privacy Policy."
          );
        }
      }

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.error("Error in handleAddEditPolicy:", err.message);
      toast.error("An error occurred while saving the Privacy Policy.");
    } finally {
      setCurrentPolicy({ policyId: "", title: "", description: "" });
      setOpenDialog(false);
      setIsLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setCurrentPolicy(policy);
    setOpenDialog(true);
  };

  const handleDeleteClick = (policyId, title) => {
    setCurrentPolicy({ policyId, title });
    setDeleteModalOpen(true);
  };

  const handleDelete = async (policyId, title) => {
    try {
      setIsLoading(true);
      const response = await api.delete("/api/delete-policy", {
        data: { policyId },
      });
      if (response.data?.success) {
        setPolicy((prev) =>
          prev.filter((policy) => policy.policyId !== policyId)
        );
        toast.success(response.data.message);
        addLog({
          action: "DELETE",
          description: `Privacy Policy (${title}) has been deleted`,
        });
      } else {
        toast.error(
          response.data.message || "Failed to delete Privacy Policy."
        );
      }
    } catch (err) {
      console.error("Error in handleDelete:", err.message);
      toast.error("An error occurred while deleting the Privacy Policy.");
    } finally {
      setDeleteModalOpen(false);
      setCurrentPolicy({ policyId: "", title: "", description: "" });
      setIsLoading(false);
      setDataUpdated(!dataUpdated);
    }
  };

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await api.get("/api/get-all-policy");
        setPolicy(response.data.policy);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch Privacy policy");
      }
    };

    fetchPolicy();
  }, [dataUpdated]);

  return (
    <>
      <div className="flex justify-end mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Policy"
          handleClick={() => {
            setOpenDialog(true);
            setCurrentPolicy({
              policyId: "",
              title: "",
              description: "",
            });
          }}
        />
      </div>

      <div
        className="ag-theme-quartz min-w-[600px] lg:w-full"
        style={{ height: 500 }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={policy}
          enableBrowserTooltips
          columnDefs={[
            {
              headerName: "Title",
              field: "title",
              flex: 2,
              tooltipField: "title",
              headerClass: "text-primary font-bold bg-gray-100",
            },
            {
              headerName: "Description",
              field: "description",
              flex: 3,
              tooltipField: "description",
              headerClass: "text-primary font-bold bg-gray-100",
              cellRenderer: (params) => (
                <div
                  className="whitespace-pre-line [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 h-full"
                  dangerouslySetInnerHTML={{ __html: params.value || "" }}
                />
              ),
            },
            {
              headerName: "Date Created",
              field: "createdAt",
              flex: 2,
              valueGetter: (params) =>
                params.data?.createdAt
                  ? new Date(params.data.createdAt).toLocaleString()
                  : "N/A",
              headerClass: "text-primary font-bold bg-gray-100",
            },
            {
              headerName: "Created By",
              field: "createdBy",
              flex: 2,
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
                      handleDeleteClick(params.data.policyId, params.data.title)
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
            resizable: true,
            cellStyle: {
              display: "flex",
              alignItems: "center",
            },
          }}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20]}
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {currentPolicy.policyId ? "Edit Policy" : "Add Policy"}
        </DialogTitle>
        <DialogContent>
          <TextEditor
            title={currentPolicy.title}
            description={currentPolicy.description}
            handleTitleChange={(title) =>
              setCurrentPolicy((prev) => ({ ...prev, title }))
            }
            handleDescriptionChange={(description) =>
              setCurrentPolicy((prev) => ({ ...prev, description }))
            }
            handleSubmit={(e) => {
              e.preventDefault();
              handleAddEditPolicy();
            }}
          />
        </DialogContent>
        <DialogActions>
          <button className="btn-light" onClick={() => setOpenDialog(false)}>
            Cancel
          </button>
        </DialogActions>
      </Dialog>

      <ModalDeleteConfirmation
        isOpen={deleteModalOpen}
        handleClose={() => {
          setDeleteModalOpen(false);
          setCurrentPolicy({ policyId: "", title: "", description: "" });
        }}
        onConfirm={() =>
          handleDelete(currentPolicy.policyId, currentPolicy.title)
        }
        message="Are you sure you want to delete this Privacy Policy?"
      />
    </>
  );
}

export default PrivacyPolicy;
