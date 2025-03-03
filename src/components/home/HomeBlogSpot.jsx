import desktopBgBlogSpot from "../../assets/images/bg-blog-spot.svg";
import mobileBgBlogSpot from "../../assets/images/bg-mobile-blog-spot.svg";
import HomeCarousel from "./HomeCarousel";
import HomeCarouselSwiper from "./HomeCarouselSwiper";

const HomeBlogSpot = () => {
  return (
    <section className="flex flex-col mb-[50%]">
      <div className="absolute w-full">
        <img className="w-full -z-10 md:hidden" src={mobileBgBlogSpot} alt="" />
        <img className="w-full -z-10 hidden md:block" src={desktopBgBlogSpot} alt="" />
      </div>
      <div className="carousel-container flex flex-col items-start">
      <HomeCarousel/>

        {/* <div className="hidden md:block"> */}
          {/* <HomeCarouselSwiper /> */}
        {/* </div> */}
      </div>
      
    </section>
  );
};

export default HomeBlogSpot;
