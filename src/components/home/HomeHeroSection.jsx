  import image_01 from "../../assets/images/image_01.svg";
  import image_02 from "../../assets/images/image_02.svg"
  import image_03 from "../../assets/images/image_03.svg"
  import image_04 from "../../assets/images/image_04.svg"
  import mo from "../../assets/images/mo.jpg";
  import ken from "../../assets/images/ken.jpg";
  import percy from "../../assets/images/percy.jpg";
  import engineers from "../../assets/images/engineers.jpg";
  import interns from "../../assets/images/interns.jpg"; 
  import windows from "../../assets/images/windows.jpeg"
import kb_startup from "../../assets/images/keyboard-startup.svg";
import banner_img from "../../assets/images/banner-img.svg";
import videoTemplate from "../../assets/videos/video-template.mp4";

  const HeroSection = () => {
    return (
      <section className="Hero lg:w-3/5">
          <div className=" grid grid-cols-12 grid-rows-12 md:grid-rows-10 lg:grid-cols-16 lg:grid-rows-16 lg:gap-4 gap-5 aspect-square ">
            {/* keyboard startup image (SHOWS ON DESKTOP ONLY)*/}
            <div className="kb-startup col-start-4 col-end-6 -z-10 lg:col-start-5 lg:col-end-8 lg:row-start-1 lg:row-end-3 lg:opacity-30">
              <img
                className="opacity-40 rounded-b-4xl w-full h-full object-cover"
                src={kb_startup}
                alt="A keyboard with a startup key"
              />
            </div>
            {/* blue thingy */}
            <div className="blue-thingy bg-primary col-start-1 col-end-2 row-start-1 row-end-3 sm:rounded-r-[150px] md:rounded-r-[150px] lg:row-start-15 lg:row-end-17 lg:col-start-15 lg:col-end-17"></div>
            {/* image 1 */}
            <div className="col-start-3 col-end-7 -z-10 row-start-1 row-end-5 lg:col-start-2 lg:col-end-8 lg:row-start-3 lg:row-end-7">
              <img
                className="opacity-40 rounded-4xl w-full h-full object-cover"
                src={image_01}
                alt="A girl having a call"
              />
            </div>
            {/* image 2 */}
            <div className="col-start-7 col-end-13 row-start-1 row-end-5 lg:row-end-7 lg:col-start-8 lg:col-end-17">
              <img
                className="rounded-l-4xl lg:rounded-l-none lg:rounded-bl-4xl w-full h-full object-cover"
                src={image_02}
                alt="Three developers"
              />
            </div>
            {/* image 3 */}
            <div className="col-start-2 col-end-12 row-start-5 row-end-13 md:row-end-11 lg:row-start-7 lg:row-end-14 lg:col-start-4 lg:col-end-13">
              {/* <img
                className="aspect-square rounded-4xl w-full h-full object-cover object-top"
                src={engineers}
                alt="Two entrepreneurs"
              /> */}
              <video className="w-full h-full rounded-4xl object-cover"  autoPlay loop muted controls>
                <source src={videoTemplate} type="video/mp4" />
              </video>
            </div>
            {/* image 4 */}
            <div className="col-start-12 col-end-13 row-start-5 row-end-9 md:row-end-8 lg:col-start-13 lg:col-end-17 lg:row-start-7 lg:row-end-11">
              <img
                className="rounded-l-4xl w-full h-full object-cover object-left"
                src={windows}
                alt="A company building"
              />
            </div>
            {/* image 5 (SHOWS ON DESKTOP ONLY) */}
            <div className="hero-image-05 row-start-11 row-end-15 col-start-13 col-end-17">
              <img
                className="opacity-70 -z-10 rounded-l-4xl object-cover h-full w-full"
                src={banner_img}
                alt="Banner image"
              />
            </div>

            {/* green thingy */}
            <div className="bg-secondary -z-10 opacity-70 col-start-12 col-end-13 row-start-9 row-end-13 rounded-l-4xl lg:rounded-r-4xl md:row-start-8 md:row-end-11 lg:row-start-14 lg:row-end-16 lg:col-start-8 lg:col-end-13"></div>
          </div>
        </section>
    );
  };

  export default HeroSection;
