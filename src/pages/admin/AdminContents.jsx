import React, { useState, useRef } from "react";
import logofsfull from "../../assets/logos/logo-fs-full.svg";
import JobCourse from "../../components/admin/JobCourse";
import PersonalityTest from "../../components/admin/PersonalityTest";
import SaveIcon from "@mui/icons-material/Save";
import { EyeIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import Testimonials from "../../components/admin/Testimonials";
import SpotifyEpisode from "../../components/admin/SpotifyEpisodes";
import { Typography } from "@mui/material";

const AdminContents = () => {
  const [videoFile, setVideoFile] = useState(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const [isPreviewShown, setIsPreviewShown] = useState(false);
  const [leftWidth, setLeftWidth] = useState(60);
  const isResizing = useRef(false);

  const handlePreview = () => {
    setIsPreviewShown((prev) => !prev);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoFile(videoURL);
    }
  };

  const startResize = (event) => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };

  const handleResize = (event) => {
    if (!isResizing.current) return;
    const newWidth = (event.clientX / window.innerWidth) * 100;
    setLeftWidth(Math.max(30, Math.min(70, newWidth)));
  };

  return (
    <>
      {/* Header */}
      <header className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:flex gap-4 items-center">
          <img src={logofsfull} alt="Fullsuite Logo" className="h-8" />
        </div>
        <button className="btn-primary flex items-center p-2 gap-2">
          <SaveIcon /> <span>PUBLISH CHANGES</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="admincontent-container flex flex-col xl:flex-row w-full justify-center gap-2 p-3 transition-all duration-300 ease-in-out">
        {/* Left Content */}
        <div
          className="left-content flex flex-col p-2 gap-2 w-full xl:w-[60%]"
          style={{ width: `${leftWidth}%` }}
        >
          {/* Home Page */}
          <div className="home-page w-full">
            <div className="home-d-prev flex w-full gap-1 items-center">
              <Typography sx={{ fontSize: "18px", fontWeight: 400 }}>
                home
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 900 }}>
                page
              </Typography>

              <button
                type="button"
                onClick={handlePreview}
                className="ml-auto flex gap-2 p-1 text-sm items-center"
              >
                <EyeIcon className="size-5" />
                Preview Changes
              </button>
            </div>
            <div className="video-frame w-full flex flex-col items-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleUpload}
                className="hidden"
                id="videoUpload"
              />

              <div className="w-full min-w-xs sm:max-w-md md:max-w-lg aspect-video border-3 rounded-3xl flex items-center justify-center bg-gray-200 overflow-hidden">
                <video
                  src={videoFile}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                />
              </div>

              <button
                onClick={() => document.getElementById("videoUpload").click()}
                className="mt-4 px-4 py-2 btn-primary rounded-lg"
              >
                Change Video
              </button>
            </div>
          </div>

          {/* About Page */}
          <div className="about-page p-1">
            <div className="about-and-prev flex w-full gap-1">
              <Typography sx={{ fontSize: "18px", fontWeight: 400 }}>
                about us
              </Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: 900 }}>
                page
              </Typography>
              <button
                type="button"
                onClick={handlePreview}
                className="ml-auto flex gap-2 p-1 text-sm items-center"
              >
                <EyeIcon className="size-5" />
                Preview Changes
              </button>
            </div>

            <div className="text-md p-1">Mission</div>
            <div className="mission p-1">
              <p className="bg-accent-1 rounded-2xl p-2 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
            <div className="text-md p-1">Vision</div>
            <div className="vision p-1">
              <p className="bg-accent-1 rounded-2xl p-2 text-sm">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
            <div className="text-md p-1">Day in the Pod Video</div>
            <div className="pod-video p-1 ml-2 text-sm">
              <label>https://youtube/choDMzlBpvs?feature=shared</label>
            </div>
          </div>
        </div>

        <div
          className="resize-bar w-1 bg-primary cursor-ew-resize"
          onMouseDown={startResize}
        ></div>

        {/* Right Content */}
        <div
          className="right-content flex flex-col w-full xl:w-[40%] p-2 gap-y-2 
    overflow-y-auto overflow-x-auto min-h-0 min-w-[50%] md:min-w-[30%] whitespace-nowrap max-h-[900px]"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="spotify-container">
            <SpotifyEpisode />
          </div>
          <div className="jobcourse-container">
            <JobCourse />
          </div>
          <div className="personalitytest-container w-full h-auto">
            <PersonalityTest />
          </div>
          <div className="testimonial-container w-full h-auto">
            <Testimonials />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminContents;
