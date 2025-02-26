import dotsLine from "../../assets/images/socials-dots-line.svg";
import socialTitleDesktop from "../../assets/images/social-title-desktop.svg";
import socialTitleMobile from "../../assets/images/social-title-mobile.svg";

const HomeSocials = () => {
  return (
    <section>
    {/* HEADING */}
      <div className="mt-10">
        <div className="flex justify-end">
          <img className="w-[140px]" src={dotsLine} alt="3 dots and a line" />
        </div>
        <div>
            <img className="hidden absolute -z-10 transform -translate-y-2/5 -translate-x-[40px]" src={socialTitleMobile} alt="Socials Heading Title" />
        </div>
      </div>
    </section>
  );
};

export default HomeSocials;
