import React from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import { Container, Box } from "@mui/material";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";
import SaveIcon from "@mui/icons-material/Save";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";

const AdminContents = () => {
  return (
    <>
      {/* Header */}
      <header className="container flex h-16 items-center justify-between">
        <div className="hidden lg:flex md-flex gap-4 items-center ">
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div>

        {/* Desktop & Tablet Buttons */}
        <div className="flex">
          <button
            variant="outlined"
            className="btn-primary items-center justify-center p-2 gap-2"
          >
            <SaveIcon /> <span>PUBLISH CHANGES</span>
          </button>
        </div>
      </header>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <SingleSpotifyEmbed/>
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
    </>
  );
};

export default AdminContents;
