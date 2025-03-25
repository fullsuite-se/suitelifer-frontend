import bgCutoutMobile from "../../assets/images/bg-mobile-cutout-home.png";
import bgCutoutTablet from "../../assets/images/bg-desktop-cutout-home.png";
import bgCutoutDesktop from "../../assets/images/bg-desktop-cutout-home3.png";

import MotionUp from "../MotionUp";
const HomeGoalsOperations = () => {


  return (
   
    <section className="relative mb-[5%] flex flex-col">
      <div className="block">
        <MotionUp className="cutout-maggie mb-6">
          <img
            src={bgCutoutMobile}
            alt="cutout background"
            className="block -z-10 w-[100%] sm:hidden"
          />
          <img
            src={bgCutoutTablet}
            alt="cutout background"
            className="-z-10 w-[100%] hidden md:block xl:hidden"
          />
          <img
            src={bgCutoutDesktop}
            alt="cutout background"
            className="-z-10 w-[100%] hidden xl:block"
          />
        </MotionUp>


      </div>

      <MotionUp className="text-goal-container absolute pt-[30%] md:pt-[5%] lg:pt-[10%] sm:pt-[14%] pl-[40%] sm:pl-[41%] pr-[5%] w-full z-10">
        <section className="text-goal min-h-[230px] text-end">
          <article className="text-white text-body md:text-lg lg:text-xl xl:text-3xl xl:leading-15">
            <p className="indent-8">
              We are a <b>dynamic</b> and <b>inclusive</b> organization that
              serves as a <b className="text-secondary font-avenir-black">launchpad</b> for
              individuals to climb the corporate ladder and achieve their full
              potential professionally. We provide <b>training</b>,{" "}
              <b>career exposure</b>, and <b>experience</b>, especially for
              fresh grads and those new to the work industry.
            </p>{" "}
            <br />
            <p className="text-small xl:text-2xl">
              Join our community of achievers.
              <br /> Contact us to learn how we can help you shine.
            </p>{" "}
            <br />
          </article>
          <a href="contact" className="no-underline">
            <button className=" z-10 btn-light text-sm xl:text-lg">Get in Touch</button>
          </a>
        </section>
      </MotionUp>
    </section>
  );
};

export default HomeGoalsOperations;
