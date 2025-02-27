import dotsLine from "../../assets/images/socials-dots-line.svg";
import socialTitleDesktop from "../../assets/images/social-title-desktop.svg";
import socialTitleMobile from "../../assets/images/social-title-mobile.svg";

const HomeSocials = () => {
  return (
    <section>
      {/* HEADING */}
      <div className="pt-10 pb-[32%] sm:pb-[22%] sm:pt-20">
        
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
    </section>
  );
};

export default HomeSocials;
