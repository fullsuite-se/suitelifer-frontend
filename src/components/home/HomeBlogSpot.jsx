import bgBlogSpot from "../../assets/images/bg-blog-spot.svg";
import HomeCarousel from "./HomeCarousel";


const HomeBlogSpot = () => {
  return (
    <section>
      <div className="">
        <img className="w-full" src={bgBlogSpot} alt="" />
      </div>
      <div className="bg-red-700">
        {/* <HomeCarousel/> */}
      </div>
    </section>
  );
};

export default HomeBlogSpot;
