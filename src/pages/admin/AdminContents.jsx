import React, { useState } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";
import SaveIcon from "@mui/icons-material/Save";
import Testimonials from "../../components/admin/Testimonials";
import SpotifyEpisode from "../../components/admin/SpotifyEpisodes";
import AdminHomePage from "../../components/admin/AdminHomePage";
import AdminAboutPage from "../../components/admin/AdminAboutPage";
import { Tabs, Tab } from "@mui/material";

const AdminContents = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      {/* <header className="container flex flex-col sm:flex-row sm:justify-between items-center px-4 md:px-6 py-2">
        <img src={logofsfull} alt="Fullsuite Logo" className="h-8 mb-2 sm:mb-0" />
        <button className="btn-primary flex items-center p-2 gap-2">
          <SaveIcon /> <span>PUBLISH CHANGES</span>
        </button>
      </header> */}

      {/* Tabs Navigation */}
      <div className="w-full border-b border-gray-300">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#0097b2",
            },
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
          <Tab label="Job Course" value={3} />
          <Tab label="Personality Test" value={4} />
          <Tab label="Testimonials" value={5} />
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 0 && <AdminHomePage />}
        {activeTab === 1 && <AdminAboutPage />}
        {activeTab === 2 && <SpotifyEpisode />}
        {activeTab === 3 && <JobCourse />}
        {activeTab === 4 && <PersonalityTest />}
        {activeTab === 5 && <Testimonials />}
      </div>
    </div>
  );
};

export default AdminContents;
