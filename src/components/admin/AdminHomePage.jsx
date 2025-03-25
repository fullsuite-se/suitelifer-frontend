import { useState } from "react";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const VideoPreview = ({ handlePreview }) => {
  const [videoFile, setVideoFile] = useState(
    "blob:http://localhost:5173/50af3f9f-0268-42ee-96c5-f9ecf0d644da"
  );

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
          <div className="min-w-[1000px] aspect-video border-3 rounded-3xl bg-gray-200 overflow-hidden">
            {videoFile ? (
              videoFile.includes("youtube.com") ||
              videoFile.includes("youtu.be") ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(
                    videoFile
                  )}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loop
                  muted
                  autoPlay
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
              <p className="text-gray-500">No video selected</p>
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
              onClick={() => document.getElementById("videoUpload").click()}
              className=" btn-light rounded-lg text-bold flex justify-end w-fit gap-1 p-1"
            >
              <ArrowPathIcon className="size-5" /> <span>Change Video</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPreview;
