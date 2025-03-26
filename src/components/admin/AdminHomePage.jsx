import { useState, useRef } from "react";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const VideoPreview = ({ handlePreview }) => {
  const [videoFile, setVideoFile] = useState("");

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoFile(videoURL);
    }
  };

  const extractYouTubeID = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  const handleSave = () => {
    const data = {
      videoFile,
    };
    console.log(data);
  };

  return (
    <>
    <div className="text-md p-1 font-avenir-black">Home Page Video</div>
      <div className="video-preview w-full">
        <div className="flex justify-end px-4 py-2">
          <button
            className="btn-primary flex items-center p-2 gap-2"
            onClick={handleSave}
          >
            <BookmarkSquareIcon className="size-5" />{" "}
            <span>Publish Changes</span>
          </button>
        </div>
        <div className="flex flex-col items-center p-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
            id="videoUpload"
          />
          <div className="max-w-[70%] sm:w-[100%] sm:h-auto border-3 rounded-3xl bg-gray-200 overflow-hidden aspect-video">
            {videoFile ? (
              videoFile.includes("youtube.com") ||
              videoFile.includes("youtu.be") ? (
                <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(
                    videoFile
                  )}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={videoFile}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                />
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                No video selected
              </div>
            )}
          </div>

          <div className="mt-4 flex w-full gap-1 items-center">
            <button
              type="button"
              onClick={handlePreview}
              className="ml-auto flex justify-end gap-1 p-1 text-sm items-center btn-light"
            >
              <EyeIcon className="size-5" />
              Preview Changes
            </button>
          
            <button
              type="button"
              onClick={() => document.getElementById("videoUpload").click()}
              className="ml-auto flex justify-end gap-1 p-1 text-sm items-center btn-light"
            >
              <ArrowPathIcon className="size-5" />
              Change Video
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default VideoPreview;
