"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardActions, Typography, IconButton, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";

function PersonalityTest() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tests, setTests] = useState([
    { id: "1", title: "Horoscope", url: "http://sampleurl.com/horoscope" },
    { id: "2", title: "MBTI", url: "http://sampleurl.com/mbti" },
    { id: "3", title: "Sample Test Title", url: "http://sampleurl.com/sample-test" },
    { id: "4", title: "Another Sample Test Title", url: "http://sampleurl.com/another-test" },
    { id: "5", title: "What is this test title?", url: "http://sampleurl.com/what-test" },
  ]);

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
            Personality Tests
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
          <div style={{ display: "grid", gridTemplateColumns: "4fr 4fr 1fr", gap: "10px", padding: "10px", fontWeight: "bold", background: "#f5f5f5" }}>
            <div>Test Title</div>
            <div>URL</div>
            <div>Action</div>
          </div>
          {tests.map((test) => (
            <div key={test.id} style={{ display: "grid", gridTemplateColumns: "4fr 4fr 1fr", gap: "10px", padding: "10px", borderBottom: "1px solid #ddd" }}>
              <Typography variant="body2">{test.title}</Typography>
              <Typography variant="body2" sx={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{test.url}</Typography>
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

export default PersonalityTest;
