import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BlogCard from "./BlogCard";
// import companyBlogs from "./CompanyBlogsList";
import GuestBlogsList from "../guest-blogs/GuestBlogsList";
import GuestBlogCard from "../guest-blogs/GuestBlogCard";

const BlogCarousel = () => {
  return (
    <div className="w-full max-w-[90%] mx-auto py-[10px] px-[10%] sm:px-[10%] xl:px-[0%]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          1280: {slidesPerView: 5},
          768: {slidesPerView: 3},
          1024: { slidesPerView: 3 },
        }}
        pagination={{ clickable: true, }}
        autoplay={{ delay: 5000 }}
        loop
        className="py-6"
      >
        {GuestBlogsList.slice(0, 5).map((blog) => (
          <SwiperSlide key={blog.id}>
            <div className="p-4">
              <GuestBlogCard {...blog}/>
            </div>
            
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogCarousel;
