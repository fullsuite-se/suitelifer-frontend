import { useState, useEffect } from "react";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import ContentButtons from "./ContentButtons";
import Information from "./Information";

const AboutPageContent = ({}) => {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // IMAGES
  const [files, setFiles] = useState({
    aboutHeroImage: null,
    aboutBackgroundImage: null,
  });

  // CONTENT DETAILS
  const [aboutDetails, setAboutDetails] = useState({
    textBanner: "",
    aboutHeroImage: "",
    aboutBackgroundImage: "",
    // aboutVideo: "",
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
  });

  const [isOpen, setIsOpen] = useState(true);
  const videoData = [
    { name: "teamPlayerVideo", key: "Team Player" },
    { name: "understoodVideo", key: "Understood" },
    { name: "focusedVideo", key: "Focused" },
    { name: "upholdsVideo", key: "Upholds" },
    { name: "harmonyVideo", key: "Values Work/Life Harmony" },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((f) => ({
        ...f,
        [key]: file,
      }));
    }
    console.log(files);
  };

  const handleContentDetailsChange = (e) => {
    setAboutDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));

    console.log(aboutDetails);
  };

  const fetchAbout = async () => {
    const response = await api.get("/api/content/about");

    console.log(response.data.aboutContent);

    setAboutDetails(response.data.aboutContent);
  };

  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, [dataUpdated]);

  const handlePublishChanges = async () => {
    try {
      const uploadPromises = Object.entries(files).map(async ([key, value]) => {
        if (value !== null) {
          const formData = new FormData();

          formData.append("file", value);

          const uploadResponse = await api.post(
            "/api/upload-image/about",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageUrl = uploadResponse.data.imageUrl;

          console.log(key, imageUrl);

          aboutDetails[key] = imageUrl;
        }
      });

      await Promise.all(uploadPromises);

      setAboutDetails((ad) => ({ ...ad, changed: true }));
      console.log(aboutDetails);

      console.log("na-upload na lahat");

      const response = await api.patch("/api/content/about", {
        ...aboutDetails,
        userId: user.id,
      });

      console.log("na-update na yung database");

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.error(err);
      return toast.error(
        "Encountered an error while publishing changes. Try again in a few minutes..."
      );
    }
  };

  return (
    <>
      <div className="text-md font-bold pt-4 font-avenir-black">
        Text Banner
      </div>
      <input
        name="textBanner"
        value={aboutDetails.textBanner}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <div className="flex flex-col 2xl:flex-row justify-around gap-2 mt-5">
        {/* ABOUT HERO IMAGE */}
        <div className="w-full 2xl:w-[50%] mb-3">
          <label className="block font-avenir-black">Hero Image</label>
          <div className="mt-3">
            <input
              className="mb-2 block w-fit text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer"
              type="file"
              accept=".jpeg,.jpg,.png,.heic"
              onChange={(e) => handleFileChange(e, "aboutHeroImage")}
            />

            {/* REMINDERS */}
            <Information
              type={"warning"}
              text={"Make sure your image is a 4:3 ratio"}
            />
            <Information
              type={"info"}
              text={"Recommended: width >= 1600px; height >= 1200px"}
            />
            <Information
              type={"info"}
              text={"Accepted formats: .jpeg, .jpg, .png, .heic"}
            />
            {/* REMINDERS END */}

            {files["aboutHeroImage"] === null ? (
              aboutDetails.aboutHeroImage && (
                <div className={`preview mt-4`}>
                  <img
                    className="h-72 mt-2 mx-auto"
                    src={aboutDetails.aboutHeroImage}
                    alt="Preview"
                  />
                </div>
              )
            ) : (
              <img
                className="h-72 mt-2 mx-auto"
                src={URL.createObjectURL(files["aboutHeroImage"])}
              />
            )}
          </div>
        </div>
        {/* ABOUT HERO IMAGE END */}

        {/* ABOUT BACKGROUND IMAGE */}
        <div className="w-full 2xl:w-[50%] mb-3">
          <label className="block font-avenir-black">Background Image</label>
          <div className="mt-3">
            <input
              className="mb-2 block w-fit text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer"
              type="file"
              accept=".jpeg,.jpg,.png,.heic"
              onChange={(e) => handleFileChange(e, "aboutBackgroundImage")}
            />

            {/* REMINDERS */}
            <Information
              type={"warning"}
              text={"Make sure your image is a 16:9 ratio"}
            />
            <Information
              type={"info"}
              text={"Recommended: width >= 1920px; height >= 1080px"}
            />
            <Information
              type={"info"}
              text={"Accepted formats: .jpeg, .jpg, .png, .heic"}
            />
            {/* REMINDERS END */}

            {files["aboutBackgroundImage"] === null ? (
              aboutDetails.aboutBackgroundImage && (
                <div className={`preview mt-4`}>
                  <img
                    className="h-72 mt-2 mx-auto"
                    src={aboutDetails.aboutBackgroundImage}
                    alt="Preview"
                  />
                </div>
              )
            ) : (
              <img
                className="h-72 mt-2 mx-auto"
                src={URL.createObjectURL(files["aboutBackgroundImage"])}
              />
            )}
          </div>
        </div>
      </div>
      {/* ABOUT BACKGROUND IMAGE END */}

      <div
        className="cursor-pointer w-fit flex items-center text-md text-center mt-4 font-avenir-black gap-2"
        onClick={handleToggle}
      >
        <span>Core Values Videos</span>
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
            <div key={video.key} className="mt-2">
              <div className="flex flex-col gap-1 text-md">
                <span className="font-avenir-black">{video.key}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name={video.name}
                    value={aboutDetails[video.name]}
                    onChange={(e) => handleContentDetailsChange(e)}
                    className="flex-grow p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={aboutDetails[video.name].replace(
                      "embed/",
                      "watch?v="
                    )}
                  >
                    <ArrowUpRightIcon height={25} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-6 ">
        {[
          {
            label: "Mission Slogan",
            value: aboutDetails.missionSlogan,
            name: "missionSlogan",
          },
          {
            label: "Vision Slogan",
            value: aboutDetails.visionSlogan,
            name: "visionSlogan",
          },
          {
            label: "Mission",
            value: aboutDetails.mission,
            name: "mission",
          },
          {
            label: "Vision",
            value: aboutDetails.vision,
            name: "vision",
          },
          {
            label: "Mission Video",
            value: aboutDetails.missionVideo,
            name: "missionVideo",
          },
          {
            label: "Vision Video",
            value: aboutDetails.visionVideo,
            name: "visionVideo",
          },
        ].map(({ label, value, name }) => (
          <div key={label}>
            <div className="text-md font-bold font-avenir-black">{label}</div>
            {name.includes("Video") ? (
              <div key={name} className="mt-2">
                <input
                  type="text"
                  name={name}
                  value={aboutDetails[name]}
                  onChange={(e) => handleContentDetailsChange(e)}
                  className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ) : (
              <textarea
                name={name}
                value={value}
                onChange={(e) => handleContentDetailsChange(e)}
                rows={
                  label === "Mission Slogan" || label === "Vision Slogan"
                    ? 4
                    : 8
                }
                className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            )}
          </div>
        ))}
      </div>

      <div className="text-md font-bold pt-6 font-avenir-black">
        Day in Pod Video URL
      </div>
      <input
        type="text"
        name="dayInPodUrl"
        value={aboutDetails.dayInPodUrl}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
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
    </>
  );
};

export default AboutPageContent;
