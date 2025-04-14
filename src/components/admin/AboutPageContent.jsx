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
import ImageUploader from "./ImageUploader";
import ContentButtons from "./ContentButtons";


const AboutPageContent = ({}) => {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // IMAGES
  const [files, setFiles] = useState({
    getInTouchImage: null,
    heroImage: null,
    storyImage: null,
    careersMainImage: null,
    careersLeftImage: null,
    careersRightImage: null,
  });

  // CONTENT DETAILS
  const [contentDetails, setContentDetails] = useState({
    getInTouchImage: "",
    homeVideo: "",
    textBanner: "",
    heroImage: "",
    storyImage: "",
    aboutVideo: "",
    teamPlayerVideo: "",
    understoodVideo: "",
    focusedVideo: "",
    upholdsVideo: "",
    harmonyVideo: "",
    missionSlogan: "",
    mission: "",
    missionVideo: "",
    visionSlogan: "",
    vision: "",
    visionVideo: "",
    dayInPodUrl: "",
    careersMainImage: "",
    careersLeftImage: "",
    careersRightImage: "",
    contactEmail: "",
    contactLandline: "",
    contactPhone: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const videoData = [
    { name: "teamPlayerVideo", key: "core1" },
    { name: "understoodVideo", key: "core2" },
    { name: "focusedVideo", key: "core3" },
    { name: "upholdsVideo", key: "core4" },
    { name: "harmonyVideo", key: "core5" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((f) => ({
          ...f,
          [key]: [file, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    }
    console.log(files[key]);
  };

  const handleContentDetailsChange = (e) => {
    setContentDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));

    console.log(contentDetails);
    console.log(user.id);
  };

  const fetchContent = async () => {
    const response = await api.get("/api/content/");

    setContentDetails(response.data.content);
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [dataUpdated]);

  const handlePublishChanges = async () => {
    try {
      Object.entries(files).forEach(([key, value]) => {
        console.log(key, value);
      });

      return;

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

  return (
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

      <div className="flex flex-col 2xl:flex-row justify-around gap-2">
        <ImageUploader
          image={files.heroImage}
          onImageChange={(e) => handleFileChange(e, "heroImage")}
          name="Hero Image"
        />

        <ImageUploader
          image={files.storyImage}
          onImageChange={(e) => handleFileChange(e, "storyImage")}
          name="Story Image"
        />
      </div>

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
                    : 7
                }
                className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          ))}
        </div>
        <div className="text-md font-bold pt-4 font-avenir-black">
          Mission Video
        </div>
        <input
          type="text"
          name="missionVideo"
          value={contentDetails.missionVideo}
          onChange={(e) => handleContentDetailsChange(e)}
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="text-md font-bold pt-4 font-avenir-black">
          Vision Video
        </div>
        <input
          type="text"
          name="visionVideo"
          value={contentDetails.visionVideo}
          onChange={(e) => handleContentDetailsChange(e)}
          className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        />
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

        <div className="flex justify-end gap-2 mb-30">
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
    </div>
  );
};

export default AboutPageContent;
