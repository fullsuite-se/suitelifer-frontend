import { useState } from "react";
import { PlayCircleIcon } from "@heroicons/react/24/solid"; 

const MissionVision = ({
  imgMission,
  imgVision,
  missionSlogan,
  visionSlogan,
  missionContent,
  visionContent,
  missionVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // Default Mission Video URL
  visionVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",  // Default Vision Video URL
}) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const openVideoModal = (url) => {
    setCurrentVideoUrl(url);
    setIsExpanded(true);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-16 p-10 relative">
        {/* Vision Section */}
        <div className="text-center max-w-md space-y-4">
          <img src={imgVision} alt="Vision Icon" className="mx-auto h-20 mb-4" />
          <p className="text-h6 font-avenir-black">
            OUR <span className="text-[#0097B2]">VISION</span>
          </p>
          <br />
          <p className="font-avenir-black text-body">{visionSlogan}</p>
          <p className="mt-4 text-gray-600 text-body leading-7 md:leading-10 ">
            {visionContent}
          </p>

          {/* Watch Video Button for Vision (centered and pointer cursor) */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => openVideoModal(visionVideoUrl)}
              className="z-10 flex items-center justify-center gap-2 text-primary hover:text-white hover:bg-primary transition-all duration-300 px-4 py-2 rounded-md border border-primary cursor-pointer"
            >
              <PlayCircleIcon className="w-6 h-6" />
              Watch Video
            </button>
          </div>
        </div>

        {/* Separator Line */}
        <div className="hidden lg:block w-px h-150 xl:mx-20 bg-gradient-to-b from-transparent via-[#0097B2] -mt-10 to-transparent"></div>

        {/* Mission Section */}
        <div className="text-center max-w-md space-y-4">
          <img src={imgMission} alt="Mission Icon" className="mx-auto h-20 mb-4" />
          <p className="text-h6 font-avenir-black">
            OUR <span className="text-[#0097B2]">MISSION</span>
          </p>
          <br />
          <p className="font-avenir-black text-body">{missionSlogan}</p>
          <p className="mt-4 text-gray-600 text-body leading-7 md:leading-10 ">
            {missionContent}
          </p>

          {/* Watch Video Button for Mission (centered and pointer cursor) */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => openVideoModal(missionVideoUrl)}
              className="flex items-center justify-center gap-2 text-primary hover:text-white hover:bg-primary transition-all duration-300 px-4 py-2 rounded-md border border-primary cursor-pointer"
            >
              <PlayCircleIcon className="w-6 h-6" />
              Watch Video
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsExpanded(false)}
        >
          <div className="w-[80vw] h-[45vw] max-w-4xl bg-black rounded-lg relative">
            <iframe
              className="w-full h-full rounded-lg"
              src={`${currentVideoUrl}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionVision;
