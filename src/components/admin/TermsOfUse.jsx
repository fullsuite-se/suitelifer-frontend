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

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function TermsOfUse() {
  const user = useStore((state) => state.user);
  const addLog = useAddAuditLog();
  const gridRef = useRef();
  const [terms, setTerms] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTerm, setCurrentTerm] = useState({
    termsId: null,
    title: "",
    description: "",
  });

  const handleAddEditTerms = async () => {
    const newTerm = {
      ...currentTerm,
      user_id: user.id,
    };

    try {
      if (!currentTerm.termsId) {
        const response = await api.post("/api/add-terms", {
          ...newTerm,
          userId: user.id,
        });

        if (response.data?.success) {
          setTerms((prev) => [response.data.data, ...prev]);
          toast.success(response.data.message);
          addLog({
            action: "CREATE",
            description: `New Terms of Use (${newTerm.title}) added`,
          });
        } else {
          toast.error(response.data.message || "Failed to save Terms of Use.");
        }
      } else {
        const response = await api.put("/api/edit-terms", {
          ...currentTerm,
          userId: user.id,
        });

        if (response.data?.success) {
          setTerms((prev) =>
            prev.map((term) =>
              term.termsId === currentTerm.termsId ? currentTerm : term
            )
          );
          toast.success(response.data.message);
          addLog({
            action: "UPDATE",
            description: `Terms of Use (${currentTerm.title}) has been updated`,
          });
        } else {
          toast.error(
            response.data.message || "Failed to update Terms of Use."
          );
        }
      }

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.error("Error in handleAddEditTerms:", err.message);
      toast.error("An error occurred while saving the Terms of Use.");
    } finally {
      setCurrentTerm({ termsId: "", title: "", description: "" });
      setOpenDialog(false);
      setIsLoading(false);
    }
  };

  const handleEdit = (term) => {
    setCurrentTerm(term);
    setOpenDialog(true);
  };

  const handleDeleteClick = (termsId, title) => {
    setCurrentTerm({ termsId, title });
    setDeleteModalOpen(true);
  };

  const handleDelete = async (termsId, title) => {
    try {
      setIsLoading(true);
      const response = await api.delete("/api/delete-terms", {
        data: { termsId },
      });
      if (response.data?.success) {
        setTerms((prev) => prev.filter((term) => term.termsId !== termsId));
        toast.success(response.data.message);
        addLog({
          action: "DELETE",
          description: `Terms of Use (${title}) has been deleted`,
        });
      } else {
        toast.error(response.data.message || "Failed to delete Terms of Use.");
      }
    } catch (err) {
      console.error("Error in handleDelete:", err.message);
      toast.error("An error occurred while deleting the Terms of Use.");
    } finally {
      setDeleteModalOpen(false);
      setCurrentTerm({ termsId: "", title: "", description: "" });
      setIsLoading(false);
      setDataUpdated(!dataUpdated);
    }
  };

  const handleChange = (e) => {
    setCurrentTerm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await api.get("/api/get-all-terms");
        setTerms(response.data.terms);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch Terms of Use");
      }
    };

    fetchTerms();
  }, [dataUpdated]);

  return (
    <>
      <div className="flex justify-end mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add Terms"
          handleClick={() => {
            setOpenDialog(true);
            setCurrentTerm({
              termsId: "",
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
          rowData={terms}
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
              cellStyle: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
              },
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
                      handleDeleteClick(params.data.termsId, params.data.title)
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
          {currentTerm.termsId ? "Edit Terms" : "Add Terms"}
        </DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <label className="block text-gray-700 font-avenir-black">
              Title<span className="text-primary">*</span>
            </label>
            <input
              name="title"
              value={currentTerm.title}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-avenir-black">
              Description<span className="text-primary">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={currentTerm.description}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
              placeholder="Enter description"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button className="btn-light" onClick={() => setOpenDialog(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleAddEditTerms}>
            Save
          </button>
        </DialogActions>
      </Dialog>

      <ModalDeleteConfirmation
        isOpen={deleteModalOpen}
        handleClose={() => {
          setDeleteModalOpen(false);
          setCurrentTerm({ termsId: "", title: "", description: "" });
        }}
        onConfirm={() => handleDelete(currentTerm.termsId, currentTerm.title)}
        message="Are you sure you want to delete this Terms of Use?"
      />
    </>
  );
}

export default TermsOfUse;
