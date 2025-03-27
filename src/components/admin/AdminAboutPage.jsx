import { useState, useRef } from "react";
import { EyeIcon } from "lucide-react";
import {
  BookmarkSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const AboutPage = ({ handlePreview }) => {
  const [mission, setMission] = useState(
    "Love is the most powerful force in the universe. It is the heartbeat of the moral cosmos. SABI NI MAMA."
  );
  const [missionSlogan, setMissionSlogan] = useState(
    "Great things are done by a series of small things brought together."
  );
  const [vision, setVision] = useState(
    "Goal is to create a world where everyone has a sense of belonging."
  );
  const [textBanner, setTextBanner] = useState(
    "Go Suited. Go Lifer. Go SuiteLifer."
  );
  const [visionSlogan, setVisionSlogan] = useState("Goooooood vibes only.");
  const [podVideoUrl, setPodVideoUrl] = useState(
    "https://youtube/choDMzlBpvs?feature=shared"
  );
  const [videoFile, setVideoFile] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [storyImage, setStoryImage] = useState("");

  const heroRef = useRef(null);
  const storyRef = useRef(null);

  const extractYouTubeID = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match ? match[1] : null;
  };

  const handleSave = () => {
    const data = {
      mission,
      missionSlogan,
      vision,
      visionSlogan,
      podVideoUrl,
      textBanner,
      heroImage,
      storyImage,
      videoFile,
    };
    console.log(data);
  };

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

  return (
    <div className="overflow-x-auto min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="flex justify-end py-2 gap-2">
        <button
          onClick={handlePreview}
          className="btn-primary flex items-center p-2 gap-2"
        >
          <EyeIcon className="size-5" />
          Preview Changes
        </button>
        <button
          className="btn-primary flex items-center p-2 gap-2"
          onClick={handleSave}
        >
          <BookmarkSquareIcon className="size-5" /> <span>Publish Changes</span>
        </button>
      </div>

      <div className="text-md font-bold pb-2 font-avenir-black">
        About Page Video
      </div>
      <div className="video-preview w-full">
        
        <div className="flex flex-col items-center p-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
            id="videoUpload"
          />
          <div
            className="max-w-[70%] sm:w-[100%] sm:h-auto border-1 rounded-3xl bg-gray-200 overflow-hidden aspect-video cursor-pointer flex items-center justify-center"
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
              <div className=" flex items-center justify-center text-center w-full p-3">
                <ArrowUpOnSquareIcon className="size-20 " />
                <span className="text-center text-xl">Upload Video</span>
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

      <div className="text-md font-bold pt-4 font-avenir-black">
        Text Banner
      </div>
      <textarea
        value={textBanner}
        onChange={(e) => setTextBanner(e.target.value)}
        rows={2}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
      ></textarea>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Hero Image",
            ref: heroRef,
            image: heroImage,
            setImage: setHeroImage,
          },
          {
            label: "Story Image",
            ref: storyRef,
            image: storyImage,
            setImage: setStoryImage,
          },
        ].map((item, index) => (
          <div key={index} className="flex flex-col gap-2 items-center">
            <label className="block text-md font-avenir-black">
              {item.label}
            </label>
            <div
              className="border rounded-xl flex items-center justify-center cursor-pointer aspect-square w-full max-w-xs mx-auto relative group"
              onClick={() => item.ref.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, item.setImage)}
            >
              {item.image ? (
                <>
                  <img
                    src={item.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-semibold">
                      Edit Image
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col text-center items-center">
                  <ArrowUpOnSquareIcon className="size-12 text-gray-500" />
                  <span className="mt-2 text-lg">{"Upload " + item.label}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <input
          type="file"
          accept="image/*"
          ref={heroRef}
          className="hidden"
          onChange={(e) => handleImageChange(e.target.files[0], setHeroImage)}
        />

        <input
          type="file"
          accept="image/*"
          ref={storyRef}
          className="hidden"
          onChange={(e) => handleImageChange(e.target.files[0], setStoryImage)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 ">
        {[
          {
            label: "Mission Slogan",
            value: missionSlogan,
            setValue: setMissionSlogan,
          },
          {
            label: "Vision Slogan",
            value: visionSlogan,
            setValue: setVisionSlogan,
          },
          { label: "Mission", value: mission, setValue: setMission },
          { label: "Vision", value: vision, setValue: setVision },
        ].map(({ label, value, setValue }) => (
          <div key={label}>
            <div className="text-md font-bold font-avenir-black">{label}</div>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
        ))}
      </div>
      <div className="text-md font-bold pt-4 font-avenir-black">
        Pod Video Url
      </div>
      <textarea
        value={podVideoUrl}
        onChange={(e) => setPodVideoUrl(e.target.value)}
        rows={3}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-20"
      />
    </div>
  );
};

export default AboutPage;
