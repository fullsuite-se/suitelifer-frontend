import homeIntroImg from "../../assets/images/home-intro-img.webp";

import MotionUp from "../MotionUp";
const HomeGoalsOperations = () => {
  return (<>
    <section className="relative mb-[5%] flex flex-col lg:flex-row lg:gap-5 lg:items-center lg:justify-center">
      <div className="flex items-center justify-end lg:hidden">
        <div className="size-[1.3vh] bg-primary rounded-full"></div>
        <div className="w-[45%] h-[0.25vh] bg-primary"></div>
      </div>
      <MotionUp className="p-10 md:px-40 md:py-20 lg:!p-0">
        <div className="relative">
          {" "}
          <img
            src={homeIntroImg}
            alt="cutout background"
            className="w-full rounded-xl lg:rounded-r-2xl lg:rounded-l-none  lg:w-[110%]"

          />
          <div className="absolute -z-1 -bottom-5 -right-5 w-[60%] h-[60%] bg-[#FFA91F] rounded-2xl lg:rounded-3xl lg:-bottom-8 lg:-right-8"></div>
        </div>
      </MotionUp>

      <MotionUp className="">
          <div className=" items-center justify-end right-0 hidden lg:flex mb-20">
        <div className="size-[1.3vh] bg-primary rounded-full"></div>
        <div className="w-[90%] h-[0.25vh] bg-primary"></div>
      </div>
        <section className="min-h-[230px] text-center lg:text-end  w-full px-5 md:px-35 lg:px-20">
          
          <article className=" text-body md:text-lg lg:text-xl xl:text-2xl xl:leading-10">
            <p>
              We are a <b>dynamic</b> and <b>inclusive</b> organization that
              serves as a{" "}
              <b className="text-primary font-avenir-black">launchpad</b> for
              individuals to climb the corporate ladder and achieve their full
              potential professionally. We provide <b>training</b>,{" "}
              <b>career exposure</b>, and <b>experience</b>, especially for
              fresh grads and those new to the work industry.
            </p>{" "}
            <br />
            <p className="text-small xl:text-xl">
              Join our community of achievers.
              <br /> Contact us to learn how we can help you shine.
            </p>{" "}
            <br />
          </article>
          <a href="contact" className="no-underline">
            <button className=" z-10 btn-primary text-sm xl:text-lg">
              Get in Touch
            </button>
          </a>
        </section>
      </MotionUp>

      <div className="flex items-center justify-start mt-20 lg:hidden">
        <div className="w-[45%] h-[0.25vh] bg-primary"></div>
        <div className="size-[1.3vh] bg-primary rounded-full"></div>
      </div>
    </section>
    <div className="lg:py-15"></div></>
  );
};

export default HomeGoalsOperations;
