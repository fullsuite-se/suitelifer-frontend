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

function Testimonials() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rowTestimonialData, setRowTestimonialData] = useState([
    {
      id: "1",
      name: "John Doe",
      feedback: "Great service!",
      company: "Tech Corp",
    },
    {
      id: "2",
      name: "Jane Smith",
      feedback: "Highly recommend!",
      company: "Startup Inc.",
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
  const [currentTestimonial, setCurrentTestimonial] = useState({
    id: "",
    name: "",
    feedback: "",
    company: "",
  });

  const handleEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRowTestimonialData(
      rowTestimonialData.filter((testimonial) => testimonial.id !== id)
    );
  };

  const handleAddNew = () => {
    setCurrentTestimonial({ id: "", name: "", feedback: "", company: "" });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentTestimonial.id) {
      setRowTestimonialData(
        rowTestimonialData.map((testimonial) =>
          testimonial.id === currentTestimonial.id
            ? currentTestimonial
            : testimonial
        )
      );
    } else {
      setRowTestimonialData([
        ...rowTestimonialData,
        { ...currentTestimonial, id: Date.now().toString() },
      ]);
    }
    setOpenDialog(false);
  };

  return (
    <div className="border-primary border-2 rounded-3xl w-full overflow-hidden">
      <Card sx={{ boxShadow: "none" }}>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "16px",
          }}
          className="hover:bg-gray-100 rounded-xl"
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Testimonials
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
              className="btn-primary mb-2"
            >
              <div className="flex items-center justify-center w-full gap-1">
                <ControlPointIcon fontSize="small" />
                <span className="text-sm flex items-center justify-center">
                  Add Testimonial
                </span>
              </div>
            </button>

            <div
              className="ag-theme-quartz"
              style={{ height: "400px", width: "100%" }}
            >
              <AgGridReact
                rowData={rowTestimonialData}
                columnDefs={[
                  { headerName: "Name", field: "name", flex: 1 },
                  { headerName: "Feedback", field: "feedback", flex: 1 },
                  { headerName: "Company", field: "company", flex: 1 },
                  {
                    headerName: "Action",
                    field: "action",
                    flex: 1,
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {currentTestimonial.id ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="dense"
              value={currentTestimonial.name}
              onChange={(e) =>
                setCurrentTestimonial({
                  ...currentTestimonial,
                  name: e.target.value,
                })
              }
            />
            <TextField
              label="Feedback"
              fullWidth
              margin="dense"
              value={currentTestimonial.feedback}
              onChange={(e) =>
                setCurrentTestimonial({
                  ...currentTestimonial,
                  feedback: e.target.value,
                })
              }
            />
            <TextField
              label="Company"
              fullWidth
              margin="dense"
              value={currentTestimonial.company}
              onChange={(e) =>
                setCurrentTestimonial({
                  ...currentTestimonial,
                  company: e.target.value,
                })
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

export default Testimonials;
