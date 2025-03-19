"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import DeleteIcon from "@mui/icons-material/Delete";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function JobCourse() {
  const [isExpanded, setIsExpanded] = useState(true);
  const courseData = [
    {
      id: "1",
      title: "React Free Course",
      relatedJob: "Junior Software Engineer",
      url: "http://sampleurl.com/react",
    },
    {
      id: "2",
      title: "Tailwind Free Course",
      relatedJob: "First Job Title",
      url: "http://sampleurl.com/tailwind",
    },
    {
      id: "3",
      title: "Node.JS Free Course",
      relatedJob: "Second Job Title",
      url: "http://sampleurl.com/nodejs",
    },
    {
      id: "4",
      title: "Sample Course Title",
      relatedJob: "Third Job Title",
      url: "http://sampleurl.com/sample",
    },
    {
      id: "5",
      title: "Another Sample Course",
      relatedJob: "Fourth Job Title",
      url: "http://sampleurl.com/another",
    },
  ];

  const [rowCourseData, setRowCourseData] = useState(courseData);
  console.log(rowCourseData);

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Job Courses
          </Typography>
        }
        action={
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />
      {isExpanded && (
        <CardContent>
          <div className="flex gap-4">
            <div className="w-full overflow-x-auto">
              <div
                className="ag-theme-quartz"
                style={{ height: "400px", width: "100%" }}
              >
                <AgGridReact
                  rowData={rowCourseData}
                  columnDefs={[
                    {
                      headerName: "Title",
                      field: "title",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-tertiary",
                    },

                    {
                      headerName: "Related Job",
                      field: "relatedJob",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-tertiary",
                    },
                    {
                      headerName: "URL",
                      field: "url",
                      flex: 2,
                      filter: "agTextColumnFilter",
                      headerClass: "text-primary font-bold bg-tertiary",
                    },
                    {
                      headerName: "Action",
                      field: "action",
                      flex: 1,
                      headerClass: "text-primary font-bold bg-tertiary",
                      cellRenderer: (params) => (
                        <div className="flex gap-2">
                          <button className="btn-update">
                            <EditIcon />
                          </button>
                          <button className="btn-delete">
                            <DeleteIcon />
                          </button>
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
                  domLayout="autoHeight"
                  rowHeight={50}
                  pagination
                  paginationPageSize={5}
                  paginationPageSizeSelector={[5, 10, 20, 50]}
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default JobCourse;
