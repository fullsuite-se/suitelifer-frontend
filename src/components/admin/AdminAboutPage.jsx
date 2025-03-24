import { useState } from "react";
import { Typography } from "@mui/material";
import { EyeIcon } from "lucide-react";

const AboutPage = ({ handlePreview }) => {
  const [mission, setMission] = useState(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  );
  const [vision, setVision] = useState(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  );
  const [podVideoUrl, setPodVideoUrl] = useState(
    "https://youtube/choDMzlBpvs?feature=shared"
  );

  return (
    <div className="about-page p-1">
      <div className="about-and-prev flex w-full gap-1">
        <button
          type="button"
          onClick={handlePreview}
          className="ml-auto flex gap-2 p-1 text-sm items-center"
        >
          <EyeIcon className="size-5" />
          Preview Changes
        </button>
      </div>

      <div className="text-md p-1">Mission</div>

      <textarea
        name="description"
        required
        value={mission}
        onChange={(e) => setMission(e.target.value)}
        rows={3}
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
      ></textarea>
      <div className="text-md p-1">Vision</div>

      <textarea
        name="description"
        required
        value={vision}
        onChange={(e) => setVision(e.target.value)}
        rows={3}
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
      ></textarea>

      <div className="text-md p-1">Day in the Pod Video</div>
      <input
        type="text"
        className="w-full p-3 resize-none border-1 border-primary rounded-md bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary mt-2"
        value={podVideoUrl}
        onChange={(e) => setPodVideoUrl(e.target.value)}
      />
    </div>
  );
};

export default AboutPage;
