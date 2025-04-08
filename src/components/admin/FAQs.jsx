"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function FAQs() {
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      question: "What is your return policy?",
      answer: "30 days return policy.",
    },
    {
      id: "2",
      question: "Do you offer customer support?",
      answer: "Yes, 24/7 support available.",
    },
    {
      id: "3",
      question: "Do you love me?",
      answer: "Yes Daddy!!!",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState({
    id: "",
    question: "",
    answer: "",
    created_at: "",
    created_by: "Melbraei Santiago",
  });

  const gridRef = useRef();

  const handleSave = () => {
    if (currentFAQ.id) {
      setFaqs((prev) =>
        prev.map((faq) => (faq.id === currentFAQ.id ? currentFAQ : faq))
      );
    } else {
      const newFaq = {
        ...currentFAQ,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setFaqs((prev) => [...prev, newFaq]);
    }

    setCurrentFAQ({ id: "", question: "", answer: "" });
    setOpenDialog(false);
  };

  const handleEdit = (faq) => {
    setCurrentFAQ(faq);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setOpenDialog(true)}
          className="btn-primary mb-2"
        >
          <div className="flex items-center justify-center w-full gap-1">
            <ControlPointIcon fontSize="small" />
            <span className="text-sm">Add FAQ</span>
          </div>
        </button>
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
              headerName: "Date Created",
              field: "created_at",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
              valueGetter: (params) =>
                params.data?.created_at
                  ? new Date(params.data.created_at).toLocaleString()
                  : "N/A",
            },
            {
              headerName: "Created By",
              field: "created_by",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
            },
            {
              headerName: "Action",
              field: "action",
              flex: 1,
              headerClass: "text-primary font-bold bg-gray-100",
              cellRenderer: (params) => (
                <div className="flex gap-2">
                  <IconButton onClick={() => handleEdit(params.data)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(params.data.id)}>
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
          pagination
          paginationPageSize={5}
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{currentFAQ.id ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">Question</label>
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
            <label className="block text-gray-700 font-bold">Answer</label>
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
