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
import ContentButtons from "./ContentButtons";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function FAQs() {
  const [faqs, setFaqs] = useState([
    {
      faqId: "1",
      question: "What is your return policy?",
      answer: "30 days return policy.",
      createdAt: new Date().toISOString(),
      createdBy: "Melbraei Santiago",
    },
    {
      faqId: "2",
      question: "Do you offer customer support?",
      answer: "Yes, 24/7 support available.",
      createdAt: new Date().toISOString(),
      createdBy: "Melbraei Santiago",
    },
    {
      faqId: "3",
      question: "Benz likes Maricar?",
      answer: "Yes, He does.",
      createdAt: new Date().toISOString(),
      createdBy: "Benz",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState({
    faqId: "",
    question: "",
    answer: "",
    createdAt: "",
    createdBy: "",
  });

  const gridRef = useRef();

  const handleSave = () => {
    if (currentFAQ.faqId) {
      setFaqs((prev) =>
        prev.map((faq) => (faq.faqId === currentFAQ.faqId ? currentFAQ : faq))
      );
    } else {
      const newFaq = {
        ...currentFAQ,
        faqId: Date.now().toString(),
        createdAt: new Date().toISOString(),
        createdBy: "Melbraei Santiago",
      };
      setFaqs((prev) => [...prev, newFaq]);
    }

    setCurrentFAQ({ faqId: "", question: "", answer: "" });
    setOpenDialog(false);
  };

  const handleEdit = (faq) => {
    setCurrentFAQ(faq);
    setOpenDialog(true);
  };

  const handleDelete = (faqId) => {
    setFaqs((prev) => prev.filter((faq) => faq.faqId !== faqId));
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-2">
        <ContentButtons
          icon={<PlusCircleIcon className="size-5" />}
          text="Preview Changes"
          handleClick={setOpenDialog}
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
              headerName: "Date Created",
              field: "createdAt",
              flex: 2,
              headerClass: "text-primary font-bold bg-gray-100",
              valueGetter: (params) =>
                params.data?.createdAt
                  ? new Date(params.data.createdAt).toLocaleString()
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
                <div className="flex gap-2">
                  <IconButton onClick={() => handleEdit(params.data)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(params.data.faqId)}>
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
          paginationPageSize={10}
          paginationPageSizeSelector={[5, 10, 20, 50]}
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{currentFAQ.faqId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
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
