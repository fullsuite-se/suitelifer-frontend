import { useState } from "react";
import { Typography } from "@mui/material";
import { EyeIcon } from "lucide-react";
import { BookmarkSquareIcon } from "@heroicons/react/24/outline";

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
  const [visionSlogan, setVisionSlogan] = useState(
    "Goooooood vibes only."
  );
  const [podVideoUrl, setPodVideoUrl] = useState(
    "https://youtube/choDMzlBpvs?feature=shared"
  );

  const handleSave = () => {
    const data = {
      mission,
      missionSlogan,
      vision,
      visionSlogan,
      podVideoUrl,
    };
    console.log(data);
  };

  return (
    <div className="about-page p-1 flex flex-col">
      <div className="flex justify-end px-4 py-2">
        <button
          className="btn-primary flex items-center p-2 gap-2"
          onClick={handleSave}
        >
          <BookmarkSquareIcon className="size-5" /> <span>Publish Changes</span>
        </button>
      </div>

      <div className="text-md p-1 font-avenir-black">Mission</div>

      <textarea
        name="mission"
        required
        value={mission}
        onChange={(e) => setMission(e.target.value)}
        rows={3}
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
      ></textarea>
      <div className="text-md p-1 font-avenir-black">Mission Slogan</div>

      <textarea
        name="mission slogan"
        required
        value={missionSlogan}
        onChange={(e) => setMissionSlogan(e.target.value)}
        rows={2}
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
      ></textarea>

      <div className="text-md p-1 font-avenir-black">Vision</div>

      <textarea
        name="vision"
        required
        value={vision}
        onChange={(e) => setVision(e.target.value)}
        rows={3}
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
      ></textarea>
      <div className="text-md p-1 font-avenir-black">Vision Slogan</div>

      <textarea
        name="vision slogan"
        required
        value={visionSlogan}
        onChange={(e) => setVisionSlogan(e.target.value)}
        rows={2}
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
      ></textarea>

      <div className="text-md p-1 font-avenir-black">Day in the Pod Video</div>
      <input
        type="text"
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mb-2"
        value={podVideoUrl}
        onChange={(e) => setPodVideoUrl(e.target.value)}
      />

      <div className="about-and-prev flex w-full gap-1">
        <button
          type="button"
          onClick={handlePreview}
          className="ml-auto flex gap-2 p-1 text-sm items-center mt-5"
        >
          <EyeIcon className="size-5" />
          Preview Changes
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
