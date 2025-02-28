import dotsLine from "../../assets/images/socials-dots-line.svg";
import socialTitleDesktop from "../../assets/images/social-title-desktop.svg";
import socialTitleMobile from "../../assets/images/social-title-mobile.svg";
import YouTubeEmbed from "../../components/home/YoutubeEmbed";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";

const videoId = ["1BsbVedEnwM",];

const spotifyId = [
  "2xwUR7I55qd8t8GOA2knvq",
  "54Dumwl83cHf0Mer6QMffn",
  "0ccRsDmuWXrvECqs8mL1Rc",
];

const HomeSocials = () => {
  return (
    <section>
      {/* HEADING */}
      <div className="pt-10 xl:pt-25 pb-[32%] sm:pb-[22%] sm:pt-20">
        <div className="">
          <img
            className="absolute -z-10 transform -translate-y-2/5 -translate-x-[15%] sm:hidden"
            src={socialTitleMobile}
            alt="Socials Heading Title"
          />
          <img
            className="absolute -z-10 transform -translate-y-2/5 -translate-x-[19%] w-[80%] hidden sm:block"
            src={socialTitleDesktop}
            alt="Socials Heading Title"
          />
        </div>
        <div className="flex justify-end">
          <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
        </div>
      </div>

      <section className="pt-5 md:pt-0 px-7 xl:px-17">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-">
          <div className="md:w-1/2 flex flex-col gap-4">
            {/* Yotube video */}
            <div className="video-container">
              <YouTubeEmbed videoId={videoId[0]} />
            </div>
            <SingleSpotifyEmbed spotifyId={spotifyId[0]}/>

          </div>
          <div className="md:w-1/2 grid place-content-center rounded-2xl bg-red-900">BANG!</div>
        </div>
      </section>
    </section>
  );
};

export default HomeSocials;
