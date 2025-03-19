"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardActions, Typography, IconButton, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";

function JobCourse() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [courses, setCourses] = useState([
    { id: "1", title: "React Free Course", relatedJob: "Junior Software Engineer", url: "http://sampleurl.com/react" },
    { id: "2", title: "Tailwind Free Course", relatedJob: "First Job Title", url: "http://sampleurl.com/tailwind" },
    { id: "3", title: "Node.JS Free Course", relatedJob: "Second Job Title", url: "http://sampleurl.com/nodejs" },
    { id: "4", title: "Sample Course Title", relatedJob: "Third Job Title", url: "http://sampleurl.com/sample" },
    { id: "5", title: "Another Sample Course", relatedJob: "Fourth Job Title", url: "http://sampleurl.com/another" },
  ]);

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "3fr 3fr 3fr 1fr", gap: "10px", padding: "10px", fontWeight: "bold", background: "#f5f5f5" }}>
            <div>Course Title</div>
            <div>Related Job</div>
            <div>URL</div>
            <div>Action</div>
          </div>
          {courses.map((course) => (
            <div key={course.id} style={{ display: "grid", gridTemplateColumns: "3fr 3fr 3fr 1fr", gap: "10px", padding: "10px", borderBottom: "1px solid #ddd" }}>
              <Typography variant="body2">{course.title}</Typography>
              <Typography variant="body2">{course.relatedJob}</Typography>
              <Typography variant="body2" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{course.url}</Typography>
              <CardActions>
                <IconButton color="primary">
                  <EditIcon />
                </IconButton>
              </CardActions>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

export default JobCourse;
