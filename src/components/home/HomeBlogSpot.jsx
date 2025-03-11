import desktopBgBlogSpot from "../../assets/images/bg-blog-spot.svg";
import mobileBgBlogSpot2 from "../../assets/images/bg-mobile-blog-spot-2.svg";
import BlogCarousel from "./BlogCarousel";
import { motion } from "framer-motion";

const HomeBlogSpot = () => {
  return (
<motion.section 
  initial={{ opacity: 0 }} 
  whileInView={{ opacity: 1 }} 
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.2 }}
  className="relative flex flex-col mb-5 overflow-hidden"
>
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} 
    whileInView={{ opacity: 1, scale: 1 }} 
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    viewport={{ once: true, amount: 0.2 }}
    className="w-full"
  >
    <img className="w-full -z-20 md:hidden" src={mobileBgBlogSpot2} alt="" />
    <img className="w-full -z-20 hidden md:block" src={desktopBgBlogSpot} alt="" />
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
    viewport={{ once: true, amount: 0.2 }}
    className="mt-[47%] sm:mt-[57%] md:mt-[8%] xl:mt-[10%] w-full absolute rounded-2xl"
  >
    <BlogCarousel />
  </motion.div>
</motion.section>

  );
};

export default HomeBlogSpot;
