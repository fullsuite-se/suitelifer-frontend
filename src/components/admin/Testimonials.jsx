"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Switch,
  Button,
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
      testimonial_id: "1",
      employee_image_url: "https://via.placeholder.com/50",
      employee_name: "John Doe",
      position: "Software Engineer",
      testimony: "Great service!",
      is_shown: true,
      created_at: new Date().toISOString(),
      created_by: "Admin",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState({
    testimonial_id: "",
    employee_image_url: "",
    employee_name: "",
    position: "",
    testimony: "",
    is_shown: true,
    created_at: "",
    created_by: "",
  });

  const handleEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setRowTestimonialData(
      rowTestimonialData.filter(
        (testimonial) => testimonial.testimonial_id !== id
      )
    );
  };

  const handleChange = (e) => {
    setCurrentTestimonial({
      ...currentTestimonial,
      [e.target.name]: e.target.value,
    });
  };

  const handleToggle = () => {
    setCurrentTestimonial({
      ...currentTestimonial,
      is_shown: !currentTestimonial.is_shown,
    });
  };

  const handleAddNew = () => {
    setCurrentTestimonial({
      testimonial_id: "",
      employee_image_url: "",
      employee_name: "",
      position: "",
      testimony: "",
      is_shown: true,
      created_at: new Date().toISOString(),
      created_by: "Admin",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentTestimonial.testimonial_id) {
      setRowTestimonialData(
        rowTestimonialData.map((testimonial) =>
          testimonial.testimonial_id === currentTestimonial.testimonial_id
            ? currentTestimonial
            : testimonial
        )
      );
    } else {
      setRowTestimonialData([
        ...rowTestimonialData,
        { ...currentTestimonial, testimonial_id: Date.now().toString() },
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
              className="btn-primary mb-2"
            >
              <div className="flex items-center justify-center w-full gap-1">
                <ControlPointIcon fontSize="small" />
                <span className="text-sm">Add Testimonial</span>
              </div>
            </button>

            <div className="w-full overflow-x-auto">
              <div
                className="ag-theme-quartz p-3 sm:p-5 min-w-[600px] lg:w-full"
                style={{ height: "400px" }}
              >
                <AgGridReact
                  rowData={rowTestimonialData}
                  columnDefs={[
                    {
                      headerName: "Employee Image",
                      field: "employee_image_url",
                      flex: 1,
                      cellRenderer: (params) => (
                        <Avatar src={params.data.employee_image_url} />
                      ),
                    },
                    {
                      headerName: "Employee Name",
                      field: "employee_name",
                      flex: 1,
                    },
                    { headerName: "Position", field: "position", flex: 1 },
                    { headerName: "Testimony", field: "testimony", flex: 2 },
                    {
                      headerName: "Shown",
                      field: "is_shown",
                      flex: 1,
                      cellRenderer: (params) => (
                        <Switch checked={params.data.is_shown} />
                      ),
                    },
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
                            onClick={() =>
                              handleDelete(params.data.testimonial_id)
                            }
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
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Dialog open={openDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Testimonial</DialogTitle>
        <DialogContent>
          <TextField
            label="Employee Image URL"
            name="employee_image_url"
            fullWidth
            margin="dense"
            value={currentTestimonial.employee_image_url}
            onChange={handleChange}
          />
          <TextField
            label="Employee Name"
            name="employee_name"
            fullWidth
            margin="dense"
            value={currentTestimonial.employee_name}
            onChange={handleChange}
          />
          <TextField
            label="Position"
            name="position"
            fullWidth
            margin="dense"
            value={currentTestimonial.position}
            onChange={handleChange}
          />
          <TextField
            label="Testimony"
            name="testimony"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={currentTestimonial.testimony}
            onChange={handleChange}
          />
          <div className="flex items-center mt-3">
            <Switch checked={currentTestimonial.is_shown} onChange={handleToggle} />
            <span>{currentTestimonial.is_shown ? "Visible" : "Hidden"}</span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={openDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(currentTestimonial)}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Testimonials;
