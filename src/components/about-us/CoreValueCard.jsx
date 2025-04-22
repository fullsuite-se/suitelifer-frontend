import { useEffect, useState } from "react";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

const CoreValueCard = ({ icon, text, className, youtubeUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleClick = () => {
    if (isTouchDevice) {
      setIsExpanded(true); // direct open for mobile
    }
  };

  return (
    <>
      <div
        onMouseEnter={!isTouchDevice ? () => setIsHovered(true) : undefined}
        onMouseLeave={!isTouchDevice ? () => setIsHovered(false) : undefined}
        onClick={handleClick}
        className={`${className} shadow-md bg-white hover:scale-110 hover:bg-primary group transition-all duration-300 aspect-square min-w-30 w-[40%] sm:w-[25%] lg:w-[15vw] rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer relative`}
      >
        {isHovered && !isTouchDevice ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white rounded-2xl bg-primary bg-opacity-90"
          >
            <PlayCircleIcon className="w-12 h-12 text-white mb-2" />
            <p className="text-body font-avenir">Watch Video</p>
          </div>
        ) : (
          <>
            {icon}
            <article className="text-center text-body text-primary group-hover:text-white">
              {text}
            </article>
          </>
        )}
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsExpanded(false)}
        >
          <div className="w-[80vw] h-[45vw] max-w-4xl bg-black rounded-lg relative">
            <iframe
              className="w-full h-full rounded-lg"
              src={
                youtubeUrl
                  ? `${youtubeUrl}?autoplay=1`
                  : "https://youtu.be/6bq0XVkpG9U?autoplay=1"
              }
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default CoreValueCard;
