import MotionUp from "../animated/MotionUp";
import BlogCarousel from "./BlogCarousel";

const HomeBlogSpot = () => {
  return (
    <MotionUp className="relative flex flex-col ">
      <MotionUp
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
        className="w-full"
      >
        <div className="ml-[6%] mt-5 mb-[2%] text-white p-5">
          <p className="text-h4 font-avenir-black">
            <span className="text-secondary">New</span> Blog Posts
          </p>
          <p className="text-small">
            Insights, tips, and stories—read the latest from our team!
          </p>
        </div>
      </MotionUp>

      <MotionUp className="w-full rounded-2xl">
        <BlogCarousel />
      </MotionUp>
    </MotionUp>
  );
};

export default HomeBlogSpot;
