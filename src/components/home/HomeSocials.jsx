import dotsLine from "../../assets/images/socials-dots-line.svg";
import socialTitleDesktop from "../../assets/images/social-title-desktop.svg";
import socialTitleMobile from "../../assets/images/social-title-mobile.svg";
import YouTubeEmbed from "../../components/home/YoutubeEmbed";
import SingleSpotifyEmbed from "../../components/home/SingleSpotifyEmbed";
import FacebookPostEmbed from "./FacebookEmbed";
import InstagramEmbed from "./InstagramEmbed";
import FacebookIcon from "../../assets/logos/Facebook";
import InstagramIcon from "../../assets/logos/Instagram";
import YoutubeIcon from "../../assets/logos/Youtube";
import SpotifyIcon from "../../assets/logos/Spotify";
import SocialButton from "./SocialButton";

const videoId = ["1BsbVedEnwM"];

const spotifyId = [
  "2xwUR7I55qd8t8GOA2knvq",
  "54Dumwl83cHf0Mer6QMffn",
  "0ccRsDmuWXrvECqs8mL1Rc",
];

const facebookId = [
  "pfbid02vZtgYPLkXDKbVmWL9FcPLahi4dWGYSevS77we5KETiVa4nup94u35Ayo5eWRCJGYl",
  "pfbid025Lp3t3Jg9ofs6puEjFMRNXj4momadqtXEzzuiLJeXtYoDqUqWDvyc32jADz4D2nal",
];

const instagramId = ["DGJvd8pPZGn"];

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
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="md:w-2/5 flex flex-col gap-4">
            {/* Yotube video */}
            <YouTubeEmbed videoId={videoId[0]} />
            <SingleSpotifyEmbed spotifyId={spotifyId[0]} />
          </div>
          <div className="md:w-3/5 rounded-2xl flex flex-col md:flex-row gap-4 pb-2 md:pb-0">
            <div className="h-full md:w-full">
              <FacebookPostEmbed postId={facebookId[0]} />
            </div>
            <div className="h-full md:w-full">
              <InstagramEmbed postId={instagramId[0]} />
            </div>
          </div>
        </div>
        <section className="flex flex-col lg:flex-row lg:justify-evenly lg:pt-15 lg:pb-5 pt-5 gap-2">
          <SocialButton
            href={"https://open.spotify.com/"}
            children={
              <>
                <span>
                  <SpotifyIcon
                    color="group-hover:fill-white fill-primary"
                    height="40"
                    width="40"
                  />
                </span>
                the Suite Spot
              </>
            }
          />

          <SocialButton
            href={"https://www.youtube.com/"}
            children={
              <>
                <span>
                  <YoutubeIcon
                    color="group-hover:fill-white fill-primary"
                    height="40"
                    width="40"
                  />
                </span>
                the Suite Tube
              </>
            }
          />

          <SocialButton
            href={"https://www.facebook.com/thefullsuitepod"}
            children={
              <>
                <span>
                  <FacebookIcon
                    color="group-hover:fill-white fill-primary"
                    height="40"
                    width="40"
                  />
                </span>
                the Suite Book
              </>
            }
          />

          <SocialButton
            href={"https://www.instagram.com/thefullsuitepod/"}
            children={
              <>
                <span>
                  <InstagramIcon
                    color="group-hover:fill-white fill-primary"
                    height="40"
                    width="40"
                  />
                </span>
                the Suite IG
              </>
            }
          />
        </section>
      </section>

      {/* Socials Button Links */}
    </section>
  );
};

export default HomeSocials;
