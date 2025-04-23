"use client";

import React, { useState, useRef, useEffect } from "react";
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
import ContentButtons from "./ContentButtons";
import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../../utils/axios";

import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";
import ActionButtons from "../buttons/ActionButtons";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function FAQs() {
  const user = useStore((state) => state.user);

  //Audit Log
  const addLog = useAddAuditLog();

  const [faqs, setFaqs] = useState([]);

  const fetchFaqs = async () => {
    try {
      const response = await api.get("/api/get-all-faqs");
      const fetchedFaqs = response.data.faqs;
      setFaqs(fetchedFaqs);
    } catch (err) {
      console.log(err);
    }
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, [dataUpdated]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState({
    faq_id: "",
    question: "",
    answer: "",
    createdAt: "",
    createdBy: "",
  });

  const gridRef = useRef();

  const handleSave = async () => {
    if (currentFAQ.faq_id) {
      setFaqs((prev) =>
        prev.map((faq) => (faq.faq_id === currentFAQ.faq_id ? currentFAQ : faq))
      );
      try {
        const response = await api.post("/api/edit-faq", {
          ...currentFAQ,
          user_id: user.id,
        });

        //Log
        addLog({
          action: "UPDATE",
          description: `FAQ (${currentFAQ.question}) has been updated`,
        });

        if (response.data?.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Failed to update faq.");
        }

        setDataUpdated(!dataUpdated);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      const newFaq = {
        ...currentFAQ,
        user_id: user.id,
      };
      setFaqs((prev) => [newFaq, ...prev]);
      try {
        const response = await api.post("/api/add-faq", newFaq);

        if (response.data?.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Failed to save faq.");
        }
        //Log
        addLog({
          action: "CREATE",
          description: `A new FAQ (${newFaq.question}) has been added`,
        });
        setDataUpdated(!dataUpdated);
      } catch (err) {
        console.error(err.message);
      }
    }

    setCurrentFAQ({ faq_id: "", question: "", answer: "" });
    setOpenDialog(false);
  };

  const handleEdit = (faq) => {
    setCurrentFAQ(faq);
    setOpenDialog(true);
  };

  const handleDelete = async (faq_id, q) => {
    try {
      await api.post("/api/delete-faq", { faq_id });
      setFaqs((prev) => prev.filter((faq) => faq.faq_id !== faq_id));

      //Log
      addLog({
        action: "DELETE",
        description: `FAQ (${q}) has been deleted`,
      });
      toast.success("FAQ deleted successfully");
      setDataUpdated((prev) => !prev);
    } catch (err) {
      console.error(err.message);
      toast.error("Failed to delete FAQ");
    }
  };

  const handleFaqDetailsChange = (e) => {
    setCurrentFAQ((td) => ({ ...td, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Add FAQ"
          handleClick={() => {
            setOpenDialog(true);
            setCurrentFAQ({ faq_id: "", question: "", answer: "" });
          }}
        />
      </div>
 
      <div
        className="ag-theme-quartz min-w-[600px] lg:w-full "
        style={{ height: "500px", width: "100%" }}
      >
        <AgGridReact
          enableBrowserTooltips={true}
          ref={gridRef}
          rowData={faqs}
          columnDefs={[
            {
              headerName: "Question",
              field: "question",
              flex: 3,
              tooltipField: "question",
              headerClass: "text-primary font-bold bg-gray-100",
            },
            {
              headerName: "Answer",
              field: "answer",
              flex: 3,
              headerClass: "text-primary font-bold bg-gray-100",
              tooltipField: "answer",
              cellStyle: {
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                whiteSpace: "normal",
              },
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
              field: "createdAt",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
              valueGetter: (params) =>
                params.data?.created_at
                  ? new Date(params.data.created_at).toLocaleString()
                  : "N/A",
            },
            {
              headerName: "Created By",
              field: "createdBy",
              flex: 2,
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
                    icon={<PencilIcon className="size-5 cursor-pointer" />}
                    handleClick={() => handleEdit(params.data)}
                  />
                  <ActionButtons
                    icon={<TrashIcon className="size-5 cursor-pointer" />}
                    handleClick={() => handleDelete(params.data.faq_id, params.data.question)}
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
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{currentFAQ.faq_id ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <label className="block text-gray-700 font-avenir-black">
              Question<span className="text-primary">*</span>
            </label>
            <input
              value={currentFAQ.question}
              onChange={(e) =>
                setCurrentFAQ({ ...currentFAQ, question: e.target.value })
              }
              className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
              placeholder="Enter the question"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-avenir-black">
              Answer<span className="text-primary">*</span>
            </label>
            <textarea
              value={currentFAQ.answer}
              onChange={(e) =>
                setCurrentFAQ({ ...currentFAQ, answer: e.target.value })
              }
              className="w-full p-3 mt-2 border rounded bg-primary/10 focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Enter the answer"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-avenir-black">
              Visibility<span className="text-primary">*</span>
            </label>
            <select
              name="is_shown"
              required
              value={
                currentFAQ.is_shown !== undefined ? currentFAQ.is_shown : ""
              }
              onChange={(e) => handleFaqDetailsChange(e)}
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
            >
              <option value="" disabled>
                -- Select an option --
              </option>
              <option value={1}>Shown</option>
              <option value={0}>Hidden</option>
            </select>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="btn-light" onClick={() => setOpenDialog(false)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FAQs;
