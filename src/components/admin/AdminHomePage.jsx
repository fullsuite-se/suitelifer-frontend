import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

const VideoPreview = ({ handlePreview }) => {
  const [videoFile, setVideoFile] = useState(
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoFile(videoURL);
    }
  };

  return (
    <div className="video-preview w-full">
      <div className="header flex w-full gap-1 items-center">
        <button
          type="button"
          onClick={handlePreview}
          className="ml-auto flex gap-2 p-1 text-sm items-center"
        >
          <EyeIcon className="size-5" />
          Preview Changes
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
        <div className=" max-w-[1000px] aspect-video border-3 rounded-3xl bg-gray-200 overflow-hidden">
          {videoFile ? (
            <video
              src={videoFile}
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              muted
            />
          ) : (
            <p className="text-gray-500">No video selected</p>
          )}
        </div>
        <button
          onClick={() => document.getElementById("videoUpload").click()}
          className="mt-4 px-4 py-2 btn-light rounded-lg"
        >
          Change Video
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;
