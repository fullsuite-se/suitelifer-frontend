import desktopBgBlogSpot from "../../assets/images/bg-blog-spot.svg";
import mobileBgBlogSpot2 from "../../assets/images/bg-mobile-blog-spot-2.svg";
import BlogCarousel from "./BlogCarousel";

const HomeBlogSpot = () => {
  return (
    <section className="relative flex flex-col mb-5">
      <div className="w-full">
        <img
          className="w-full -z-20 md:hidden"
          src={mobileBgBlogSpot2}
          alt=""
        />
        <img
          className="w-full -z-20 hidden md:block"
          src={desktopBgBlogSpot}
          alt=""
        />
      </div>
      <div className=" mt-[47%] sm:mt-[57%] md:mt-[8%] xl:mt-[10%] w-full absolute rounded-2xl">
        <BlogCarousel />
      </div>
    </section>
  );
};

export default HomeBlogSpot;
