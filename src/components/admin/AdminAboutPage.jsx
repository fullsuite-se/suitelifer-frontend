import { useState, useRef, useEffect } from "react";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import FileUploaderProvider from "./FileUploader";
import ContentButtons from "./ContentButtons";

const AboutPage = ({ handlePreview }) => {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // CONTENT DETAILS
  const [contentDetails, setContentDetails] = useState({
    textBanner: "",
    heroImage: "",
    storyImage: "",
    aboutVideo: "",
    missionSlogan: "",
    mission: "",
    visionSlogan: "",
    vision: "",
    dayInPodUrl: "",
    teamPlayer: "",
    understood: "",
    athlete: "",
    upholds: "",
    harmony: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const videoData = [
    { name: "Team Player Video", key: "teamPlayer" },
    { name: "Understood Video", key: "understood" },
    { name: "Athlete Video", key: "athlete" },
    { name: "Upholds Video", key: "upholds" },
    { name: "Life/Work Harmony Video", key: "harmony" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleContentDetailsChange = (e) => {
    setContentDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));

    console.log(contentDetails);
    console.log(user.id);
  };

  const fetchContent = async () => {
    const response = await api.get("/api/get-content");

    setContentDetails(response.data.data);
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [dataUpdated]);

  const handlePublishChanges = async () => {
    try {
      const response = await api.post("/api/add-content", {
        ...contentDetails,
        user_id: user.id,
      });

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err.response);
      toast.error(
        "Encountered an error while publishing changes. Try again in a few minutes..."
      );
    }
  };

  const handleImageChange = (file, setImage) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <>
      <div className="overflow-x-auto min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-md font-bold pt-4 font-avenir-black">
          Text Banner
        </div>
        <textarea
          name="textBanner"
          value={contentDetails.textBanner}
          onChange={(e) => handleContentDetailsChange(e)}
          rows={2}
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        ></textarea>

        <FileUploaderProvider />

        <div className="text-md font-bold pt-4 font-avenir-black">
          About Page Video
        </div>
        <input
          type="text"
          name="aboutVideo"
          value={contentDetails.aboutVideo}
          onChange={(e) => handleContentDetailsChange(e)}
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="cursor-pointer" onClick={handleToggle}>
          <div className="flex items-center text-md text-center mt-4   font-avenir-black gap-2">
            <span className="">Core Values Videos</span>
            {isOpen ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="w-full flex flex-col p-1">
            {videoData.map((video) => (
              <div key={video.key} className="p-3">
                <div className="flex items-center text-md font-bold font-avenir-black">
                  <span className="flex-grow">{video.name}</span>
                </div>
                <input
                  type="text"
                  name={video.key}
                  value={contentDetails[video.key]}
                  onChange={(e) => handleContentDetailsChange(e)}
                  className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 ">
          {[
            {
              label: "Mission Slogan",
              value: contentDetails.missionSlogan,
              name: "missionSlogan",
            },
            {
              label: "Vision Slogan",
              value: contentDetails.visionSlogan,
              name: "visionSlogan",
            },
            {
              label: "Mission",
              value: contentDetails.mission,
              name: "mission",
            },
            {
              label: "Vision",
              value: contentDetails.vision,
              name: "vision",
            },
          ].map(({ label, value, name }) => (
            <div key={label}>
              <div className="text-md font-bold font-avenir-black">{label}</div>
              <textarea
                name={name}
                value={value}
                onChange={(e) => handleContentDetailsChange(e)}
                rows={
                  label === "Mission Slogan" || label === "Vision Slogan"
                    ? 1
                    : 3
                }
                className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          ))}
        </div>
        <div className="text-md font-bold pt-4 font-avenir-black">
          Day in Pod Video URL
        </div>
        <input
          type="text"
          name="dayInPodUrl"
          value={contentDetails.dayInPodUrl}
          onChange={(e) => handleContentDetailsChange(e)}
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />

        <div className="flex justify-end gap-2">
          <ContentButtons
            icon={<EyeIcon className="size-5" />}
            text="Preview Changes"
            handleClick={null}
          />

          <ContentButtons
            icon={<BookmarkSquareIcon className="size-5" />}
            text="Publish Changes"
            handleClick={handlePublishChanges}
          />
        </div>
      </div>
    </>
  );
};

export default AboutPage;
