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
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }} // Ensures animation triggers when 20% is in view
        className="pt-10 xl:pt-25 pb-[32%] sm:pb-[22%] sm:pt-20"
      >
        <div className="relative">
          {/* Animated Background Title */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="absolute -z-10 transform -translate-y-2/5 -translate-x-[15%] sm:hidden"
            src={socialTitleMobile}
            alt="Socials Heading Title"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="absolute -z-10 transform -translate-y-2/5 -translate-x-[19%] w-[80%] hidden sm:block"
            src={socialTitleDesktop}
            alt="Socials Heading Title"
          />
        </div>

        {/* Animated Dots Line */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-end"
        >
          <img className="dots-line" src={dotsLine} alt="3 dots and a line" />
        </motion.div>
      </motion.div>

      <section className="pt-5 md:pt-0 px-7 xl:px-17">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col md:flex-row gap-4 w-full"
        >
          <motion.div className="md:w-2/5 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <YouTubeEmbed videoId={videoId[0]} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <SingleSpotifyEmbed spotifyId={spotifyId[0]} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            className="md:w-3/5 rounded-2xl flex flex-col md:flex-row gap-4 pb-2 md:pb-0"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              viewport={{ once: true, amount: 0.2 }}
              className="h-full md:w-full"
            >
              <FacebookPostEmbed postId={facebookId[0]} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
              viewport={{ once: true, amount: 0.2 }}
              className="h-full md:w-full"
            >
              <InstagramEmbed postId={instagramId[0]} />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut", staggerChildren: 0.2 }}
  viewport={{ once: true, amount: 0.2 }}
  className="flex flex-col md:flex-row md:justify-evenly md:pt-15 md:pb-5 pt-5 gap-2"
>
  {[
    {
      href: "https://open.spotify.com/",
      icon: SpotifyIcon,
      text: "the Suite Spot",
      delay: 0.2,
    },
    {
      href: "https://www.youtube.com/",
      icon: YoutubeIcon,
      text: "the Suite Tube",
      delay: 0.4,
    },
    {
      href: "https://www.facebook.com/thefullsuitepod",
      icon: FacebookIcon,
      text: "the Suite FB",
      delay: 0.6,
    },
    {
      href: "https://www.instagram.com/thefullsuitepod/",
      icon: InstagramIcon,
      text: "the Suite IG",
      delay: 0.8,
    },
  ].map(({ href, icon: Icon, text, delay }) => (
    <SocialButton key={href} href={href}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex items-center gap-2"
      >
        <Icon color="group-hover:fill-white fill-primary" height="40" width="40" />
        <span className="text-sm sm:text-base">{text}</span>
      </motion.div>
    </SocialButton>
  ))}
</motion.section>


      </section>

    </section>
  );
};

export default HomeSocials;
