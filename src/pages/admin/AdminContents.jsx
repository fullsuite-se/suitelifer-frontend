import React from "react";

import { Container, Box } from "@mui/material";
import SpotifyEpisode from "../../components/admin/SpotifyEpisode";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";

const AdminContents = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={3}>
        <SpotifyEpisode/>
        <div className="flex flex-col w-100%">
        <div className="">
          <JobCourse />
        </div>
        <div className="">
          <PersonalityTest />
        </div>
        </div>
        
      </Box>
    </Container>
  );
};

export default AdminContents;
