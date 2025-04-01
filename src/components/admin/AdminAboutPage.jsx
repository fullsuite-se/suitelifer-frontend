import { useState, useRef, useEffect } from "react";
import { EyeIcon } from "lucide-react";
import {
  BookmarkSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";

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
    teamPlayer:"",
    understood: "",
    athlete: "",
    upholds: "",
    harmony: "",
  });

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

  const [heroImage, setHeroImage] = useState("");
  const [storyImage, setStoryImage] = useState("");

  const heroRef = useRef(null);
  const storyRef = useRef(null);

  

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

  const handleDrop = (event, setImage) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImageChange(file, setImage);
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
          onClick={handlePublishChanges}
        >
          <BookmarkSquareIcon className="size-5" /> <span>Publish Changes</span>
        </button>
      </div>

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



<div className="text-md font-bold pt-4 font-avenir-black">
        Team Player Video
      </div>
      <input
        type="text"
        name="teamPlayer"
        value={contentDetails.teamPlayer}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="text-md font-bold pt-4 font-avenir-black">
        Understood Video
      </div>
      <input
        type="text"
        name="understood"
        value={contentDetails.understood}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      />

<div className="text-md font-bold pt-4 font-avenir-black">
        Athlete Video
      </div>
      <input
        type="text"
        name="athlete"
        value={contentDetails.athlete}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="text-md font-bold pt-4 font-avenir-black">
        Upholds Video
      </div>
      <input
        type="text"
        name="upholds"
        value={contentDetails.upholds}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="text-md font-bold pt-4 font-avenir-black">
        Life/Work Harmony Video
      </div>
      <input
        type="text"
        name="harmony"
        value={contentDetails.harmony}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      

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
                label === "Mission Slogan" || label === "Vision Slogan" ? 1 : 3
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
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-30"
      />
      
    </div>
  );
};

export default AboutPage;
