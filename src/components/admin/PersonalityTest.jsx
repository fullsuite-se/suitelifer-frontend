"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
    { id: "1", title: "Horoscope", url: "http://sampleurl.com/horoscope" },
    { id: "2", title: "MBTI", url: "http://sampleurl.com/mbti" },
    {
      id: "3",
      title: "Sample Title",
      url: "http://sampleurl.com/sample-test",
    },
    {
      id: "4",
      title: "Another Sample Test Title",
      url: "http://sampleurl.com/another-test",
    },
    {
      id: "5",
      title: "What is this test title?",
      url: "http://sampleurl.com/what-test",
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
    <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
      <Card sx={{ boxShadow: "none" }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-gray-100 rounded flex items-center p-4 cursor-pointer"
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Personality Tests
          </Typography>
          <IconButton>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
        {isExpanded && (
          <CardContent>
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

            <div
              className="ag-theme-quartz"
              style={{ height: "400px", width: "100%" }}
            >
              <AgGridReact
                rowData={rowTestData}
                columnDefs={[
                  {
                    headerName: "Title",
                    field: "title",
                    flex: 1,
                    headerClass: "text-primary font-bold bg-tertiary",
                  },
                  {
                    headerName: "URL",
                    field: "url",
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
                        <IconButton
                          onClick={() => handleDelete(params.data.id)}
                        >
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
          </CardContent>
        )}

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
      </Card>
    </div>
  );
}

export default PersonalityTest;
