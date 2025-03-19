import React, { useState } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import { Container, Box } from "@mui/material";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";
import SaveIcon from "@mui/icons-material/Save";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";

const AdminContents = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [isPreviewShown, setIsPreviewShown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePreview = () => {
    setIsPreviewShown((prev) => !prev);
    console.log(isPreviewShown);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {/* Header */}
      <header className="container flex h-16 items-center justify-between">
        <div className="hidden lg:flex md-flex gap-4 items-center ">
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div>
        <div className="flex">
          <button
            variant="outlined"
            className="btn-primary items-center justify-center p-2 gap-2"
          >
            <SaveIcon /> <span>PUBLISH CHANGES</span>
          </button>
        </div>
      </header>

      <div className="admincontent-container flex w-full justify-center gap-1 p-3">
        <div className="left-content flex flex-col p-2 gap-1">
          <div className="home-page w-full h-auto justify-center items-center">
            <div className="home-d-prev flex w-full gap-1">
              <span className="text-xl">home</span>{" "}
              <span
                className="text-xl"
                style={{ fontWeight: 600, fontFamily: "Avenir-Black" }}
              >
                page
              </span>
              <button
                type="button"
                onClick={handlePreview}
                className="cursor-pointer flex gap-2 max-w-fit ml-auto p-1 text-sm align-middle items-center justify-center"
              >
                <EyeIcon className="size-5" />
                Preview Changes
              </button>
            </div>
            <div className="video-frame w-full h-auto flex flex-col justify-center items-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleUpload}
                className="hidden"
                id="videoUpload"
              />
              <label htmlFor="videoUpload">
                <div className="cursor-pointer w-[600px] h-[350px] border-3 rounded-3xl flex items-center justify-center bg-gray-200 overflow-hidden">
                  {videoFile ? (
                    <video
                      src={videoFile}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <span>Click to upload a video</span>
                  )}
                </div>
              </label>
            </div>
          </div>
          <div className="about-page p-1">
            <div className="about-and-prev flex w-full gap-1">
              <span className="text-xl">about us </span>{" "}
              <span
                className="text-xl"
                style={{ fontWeight: 600, fontFamily: "Avenir-Black" }}
              >
                page
              </span>
              <button
                type="button"
                onClick={handlePreview}
                className="cursor-pointer flex gap-2 max-w-fit ml-auto p-1 text-sm align-middle items-center justify-center"
              >
                <EyeIcon className="size-5" />
                Preview Changes
              </button>
            </div>

            <div className="text-md p-1">Mission</div>
            <div className="mission justify-center ml-5 mr-10 p-1">
              <p className="bg-accent-1 rounded-2xl p-1 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="text-md p-1">Vision</div>
            <div className="vision justify-center ml-5 mr-10 p-1">
              <p className="bg-accent-1 rounded-2xl p-1 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="text-md p-1">Day in the Pod Video</div>
            <div className="pod-video justify-center ml-5 mr-10 p-1 text-sm">
              <label htmlFor="">
                https://youtu.be/choDMzlBpvs?feature=shared
              </label>
            </div>
          </div>
        </div>
        <div className="right-content flex-col w-full p-1">
          <div className="spotify-container w-full">
            <Card sx={{ mb: 2 }}>
              <CardHeader
                title={
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    Spotify Episodes
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
                  <SingleSpotifyEmbed />
                </CardContent>
              )}
            </Card>
          </div>
          <div className="jobcourse-container">
            <JobCourse />
          </div>
          <div className="personalitytest-container w-full h-auto">
            <PersonalityTest />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminContents;
