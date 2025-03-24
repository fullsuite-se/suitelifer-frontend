import React, { useState, useRef } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";
import SaveIcon from "@mui/icons-material/Save";
import { EyeIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import Testimonials from "../../components/admin/Testimonials";
import SpotifyEpisode from "../../components/admin/SpotifyEpisodes";
import AdminHomePage from "../../components/admin/AdminHomePage";
import AdminAboutPage from "../../components/admin/AdminAboutPage";
import { Tabs, Tab } from "@mui/material";
const AdminContents = () => {
  const [videoFile, setVideoFile] = useState(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );

  const handlePreview = () => {
    setIsPreviewShown((prev) => !prev);
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      {/* Header */}
      {/* <header className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:flex gap-4 items-center">
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div>
        <button className="btn-primary flex items-center p-2 gap-2">
          <SaveIcon /> <span>PUBLISH CHANGES</span>
        </button>
      </header> */}

      {/* Main Content */}

      <div className="">
        <div className=" w-full flex justify-between items-center p-2">
          <Tabs
            value={activeTab}
            onChange={handleChange}
            variant="Scrollable"
            scrollButtons="auto"
            sx={{
              // "& .MuiTabs-indicator": {
              //   backgroundColor: "white", // Change active tab indicator color
              // },
              "& .MuiTab-root": {
                color: "black", // Default text color
                fontWeight: 500,
                textTransform: "none",
                fontSize: 16,
                display: "flex",
                width: "full",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#0097b2",
                fontWeight: 900 ,
              },
            }}
          >
            <Tab label="Home" value={0} />
            <Tab label="About" value={1} />
            <Tab label="Spotify" value={2} />
            <Tab label="Job Course" value={3} />
            <Tab label="Personality Test" value={4} />
            <Tab label="Testimonials" value={5} />
          </Tabs>
        </div>
        <div className="tab-content p-4">
          {activeTab === 0 && <AdminHomePage />}
          {activeTab === 1 && <AdminAboutPage />}
          {activeTab === 2 && <SpotifyEpisode />}
          {activeTab === 3 && <JobCourse />}
          {activeTab === 4 && <PersonalityTest />}
          {activeTab === 5 && <Testimonials />}
        </div>
      </div>
    </>
  );
};

export default AdminContents;
