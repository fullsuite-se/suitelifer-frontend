import desktopBgBlogSpot from "../../assets/images/bg-blog-spot.svg";
import mobileBgBlogSpot2 from "../../assets/images/bg-mobile-blog-spot-2.svg";
import MotionUp from "../MotionUp";
import BlogCarousel from "./BlogCarousel";
import { motion } from "framer-motion";

const HomeBlogSpot = () => {
  return (
<MotionUp className="relative flex flex-col mb-10 "
>
  <MotionUp
    initial={{ opacity: 0, scale: 0.95 }} 
    whileInView={{ opacity: 1, scale: 1 }} 
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    viewport={{ once: true, amount: 0.2 }}
    className="w-full"
  >
     <p className="ml-20 mt-10 text-4xl font-avenir-black text-primary">
         Blog Spot
          </p>
    {/* <img className="w-full -z-20 md:hidden" src={mobileBgBlogSpot2} alt="" />
    <img className="w-full -z-20 hidden md:block" src={desktopBgBlogSpot} alt="" /> */}
  </MotionUp>

  <MotionUp  className=" w-full  rounded-2xl"
  >
    <BlogCarousel />
  </MotionUp>
</MotionUp>

  );
};

export default HomeBlogSpot;
