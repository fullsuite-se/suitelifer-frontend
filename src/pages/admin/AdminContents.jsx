import React, { useState } from "react";

import {
  Tabs,
  Tab,
} from "@mui/material";
import Careers from "../../components/admin/Careers";
import SpotifyEpisodes from "../../components/admin/SpotifyEpisodes";
import PageToggle from "../../components/admin/AdminPageToggle";
import FooterPageToggle from "../../components/admin/FooterPageToggle";
import AdminHomePage from "../../components/admin/AdminHomePage";
import AdminContactsToggle from "../../components/admin/AdminContactsToggle";
import AdminNewsLetterToggle from "../../components/admin/AdminNewsLetterToggle";

const AdminContents = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleChange = (event, newValue) => {
    if (unsavedChanges) {
      setPendingTab(newValue);
      setDialogOpen(true);
    } else {
      setActiveTab(newValue);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="min-w-full overflow-x-scroll border-b border-gray-300 sticky top-0 z-3 bg-white">
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
              minWidth: "40px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#0097b2",
              fontWeight: 900,
            },
            "@media (min-width: 1024px)": {
              "& .MuiTab-root": {
                fontSize: 14,
                minWidth: "70px",
              },
            },
          }}
          className="w-fit"
        >
          <Tab label="Home" value={0} />
          <Tab label="About" value={1} />
          <Tab label="Careers" value={2} />
          <Tab label="Newsletter" value={3} />
          <Tab label="Podcast" value={4} />
          <Tab label="Contact" value={5} />
          <Tab label="Footer" value={6} />
        </Tabs>
      </div>

      <div className="p-4">
        {activeTab === 0 && <AdminHomePage />}
        {activeTab === 1 && <PageToggle />}
        {activeTab === 2 && <Careers />}
        {activeTab === 3 && <AdminNewsLetterToggle />}
        {activeTab === 4 && <SpotifyEpisodes />}
        {activeTab === 5 && <AdminContactsToggle />}
        {activeTab === 6 && <FooterPageToggle />}
      </div>
    </div>
  );
};

export default AdminContents;
