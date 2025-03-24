"use client";

import { useState, useRef } from "react";
import {
  IconButton,
  TextField,
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

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function PersonalityTest() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rowTestData, setRowTestData] = useState([
    {
      id: "1",
      title: "Horoscope",
      url: "http://sampleurl.com/horoscope",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
    {
      id: "2",
      title: "MBTI",
      url: "http://sampleurl.com/mbti",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
    {
      id: "3",
      title: "Sample Title",
      url: "http://sampleurl.com/sample-test",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
    {
      id: "4",
      title: "Another Sample Test Title",
      url: "http://sampleurl.com/another-test",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
    {
      id: "5",
      title: "What is this test title?",
      url: "http://sampleurl.com/what-test",
      createdAt: "2022-10-10",
      createdBy: "John Doe",
    },
  ]);
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

  const [openDialog, setOpenDialog] = useState(false);
  const [currentTest, setCurrentTest] = useState({
    title: "",
    url: "",
  });

  const handleEdit = (test) => {
    setCurrentTest(test);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRowTestData(rowTestData.filter((test) => test.id !== id));
  };

  const handleAddNew = () => {
    setCurrentTest({ id: "", title: "", url: "" });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentTest.id) {
      setCurrentTest(
        rowTestData.map((test) =>
          test.id === currentTest.id ? currentTest : test
        )
      );
    } else {
      setRowTestData([
        ...rowTestData,
        { ...currentTest, id: Date.now().toString() },
      ]);
    }
    setOpenDialog(false);
  };

  return (
    <>
      <div className="w-full flex justify-end items-end">
        <button
          variant="contained"
          onClick={handleAddNew}
          sx={{ mb: 2 }}
          className="btn-primary mb-2 "
        >
          <div className="flex items-center justify-center w-full gap-1">
            <ControlPointIcon fontSize="small" />
            <span className="text-sm flex items-center justify-center">
              Test
            </span>
          </div>
        </button>
      </div>
      <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <div
            className="ag-theme-quartz p-3 sm:p-5 min-w-[600px] lg:w-full"
            style={{ height: "400px" }}
          >
            <AgGridReact
              rowData={rowTestData}
              columnDefs={[
                {
                  headerName: "Title",
                  field: "title",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "URL",
                  field: "url",
                  flex: 2,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Date Created",
                  field: "createdAt",
                  flex: 1,
                  filter: "agTextColumnFilter",
                  headerClass: "text-primary font-bold bg-tertiary",
                  valueGetter: (params) =>
                    params.data?.createdAt
                      ? new Date(params.data.createdAt).toLocaleString()
                      : "N/A",
                },
                {
                  headerName: "Created By",
                  field: "createdBy",
                  flex: 1,
                  headerClass: "text-primary font-bold bg-tertiary",
                },
                {
                  headerName: "Action",
                  field: "action",
                  flex: 1,

                  headerClass: "text-primary font-bold bg-tertiary",
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
              defaultColDef={{ sortable: true, filter: true }}
              rowHeight={50}
              pagination={true}
              paginationPageSize={5}
              paginationPageSizeSelector={[5, 10, 20, 50]}
              gridOptions={gridOptions}
              ref={gridRef}
            />
          </div>
        </div>

        {/* Dialog for Add/Edit */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{currentTest.id ? "Edit Test" : "Add Test"}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              margin="dense"
              value={currentTest.title}
              onChange={(e) =>
                setCurrentTest({ ...currentTest, title: e.target.value })
              }
            />
            <TextField
              label="URL"
              fullWidth
              margin="dense"
              value={currentTest.url}
              onChange={(e) =>
                setCurrentTest({ ...currentTest, url: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <button className="btn-light" onClick={() => setOpenDialog(false)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              variant="contained"
            >
              Save
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default PersonalityTest;
