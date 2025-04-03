import React, { useState } from "react";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";
import Testimonials from "../../components/admin/Testimonials";
import SpotifyEpisode from "../../components/admin/SpotifyEpisodes";
import AdminHomePage from "../../components/admin/AdminHomePage";
import AdminAboutPage from "../../components/admin/AdminAboutPage";
import {
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";

const AdminContents = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (event, newValue) => {
    if (unsavedChanges) {
      setPendingTab(newValue);
      setDialogOpen(true); 
    } else {
      setActiveTab(newValue); 
    }
  };

  const handleSave = () => {
    
    console.log("Changes saved!");
    setUnsavedChanges(false);
    setDialogOpen(false);
    setActiveTab(pendingTab);
    setPendingTab(null);
  };

  const handleDiscard = () => {
    setUnsavedChanges(false);
    setDialogOpen(false);
    setActiveTab(pendingTab); 
    setPendingTab(null);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full border-b border-gray-300">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#0097b2" },
            "& .MuiTab-root": {
              color: "black",
              fontWeight: 500,
              textTransform: "none",
              fontSize: 14,
              minWidth: "80px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#0097b2",
              fontWeight: 900,
            },
          }}
          className="w-full"
        >
          <Tab label="Home" value={0} />
          <Tab label="About" value={1} />
          <Tab label="Spotify" value={2} />
          <Tab label="Courses" value={3} />
          <Tab label="Personality Test" value={4} />
          <Tab label="Testimonials" value={5} />
        </Tabs>
      </div>

      <div className="p-4">
        {activeTab === 0 && (
          <AdminHomePage setUnsavedChanges={setUnsavedChanges} />
        )}
        {activeTab === 1 && (
          <AdminAboutPage setUnsavedChanges={setUnsavedChanges} />
        )}
        {activeTab === 2 && (
          <SpotifyEpisode setUnsavedChanges={setUnsavedChanges} />
        )}
        {activeTab === 3 && <JobCourse setUnsavedChanges={setUnsavedChanges} />}
        {activeTab === 4 && (
          <PersonalityTest setUnsavedChanges={setUnsavedChanges} />
        )}
        {activeTab === 5 && (
          <Testimonials setUnsavedChanges={setUnsavedChanges} />
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          You have unsaved changes. What do you want to do?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDiscard} color="error">
            Discard
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminContents;
