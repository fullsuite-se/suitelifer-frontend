import { useState } from "react";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ArrowPathIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

const AdminHomePage = ({ handlePreview }) => {
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
    const data = { videoFile };
    console.log(data);
  };

  return (
    <>
      <div className="video-preview w-full">
        <div className="flex justify-end px-4 py-2 gap-2">
          <button
            className="btn-primary flex items-center p-2 gap-2"
            onClick={handleSave}
          >
            <EyeIcon className="size-7 sm:size-5" />
            <span className="hidden sm:flex w-full items-centerjustify-center">Preview</span>
          </button>
          <button
            className="btn-primary flex items-center p-2 gap-2"
            onClick={handleSave}
          >
            <BookmarkSquareIcon className="size-7 sm:size-5" />
            <span className="hidden sm:flex">Publish Changes</span>
          </button>
        </div>
        <div className="text-md p-1 font-avenir-black">Home Page Video</div>
        <div className="flex flex-col items-center p-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
            id="videoUpload"
          />
          <div
            className="max-w-[70%] sm:w-[100%] sm:h-auto border-3 rounded-3xl bg-gray-200 overflow-hidden aspect-video cursor-pointer flex items-center justify-center"
            onClick={() =>
              !videoFile && document.getElementById("videoUpload").click()
            }
          >
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
              <div className="flex flex-col sm:flex-row items-center justify-center text-center w-full p-3 gap-2">
                <ArrowUpOnSquareIcon className="size-5 sm:size-20" />
                <span className="text-sm sm:text-xl">Upload Video</span>
              </div>
            )}
          </div>

          <div className="flex mt-6 gap-2">
            {videoFile && (
              <button
                type="button"
                onClick={() => document.getElementById("videoUpload").click()}
                className="flex gap-1 p-2 text-sm items-center btn-light"
              >
                <ArrowPathIcon className="size-5" />
                Change Video
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHomePage;
