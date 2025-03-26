import { useState, useRef} from "react";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ArrowPathIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

const VideoPreview = ({ handlePreview }) => {
  const [videoFile, setVideoFile] = useState(
    "blob:http://localhost:5173/4ef3993a-efae-4c70-9dab-55dc833cd04b"
  );
  const [heroImage, setHeroImage] = useState();
  const [storyImage, setStoryImage] = useState();

  const heroRef = useRef(null);
  const storyRef = useRef(null);

  const handleImageChange = (file, setImage) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleDrop = (event, setImage) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImageChange(file, setImage);
  };

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
          <div className="max-w-[500px] aspect-video border-3 rounded-3xl bg-gray-200 overflow-hidden">
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

        <div className="p-4 space-y-4 flex-row flex gap-4">
          <div
            className="w-120 h-80 rounded border-2 flex items-center justify-center cursor-pointer"
            onClick={() => heroRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, setHeroImage)}
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt="Hero Preview"
                className="w-full h-full object-cover rounded"
                
              />
            ) : (
              <ArrowUpOnSquareIcon className="size-40"/>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={heroRef}
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files[0], setHeroImage)}
          />

          <div
            className="w-120 h-80 rounded border-2 flex items-center justify-center cursor-pointer"
            onClick={() => storyRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, setStoryImage)}
          >
            {storyImage ? (
              <img
                src={storyImage}
                alt="Story Preview"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <ArrowUpOnSquareIcon className="size-40"/>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={storyRef}
            className="hidden"
            onChange={(e) =>
              handleImageChange(e.target.files[0], setStoryImage)
            }
          />
        </div>
      </div>
    </>
  );
};

export default VideoPreview;
