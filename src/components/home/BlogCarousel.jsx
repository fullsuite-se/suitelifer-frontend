import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BlogCard from "./BlogCard";
import companyBlogs from "./CompanyBlogsList";

const BlogCarousel = () => {
  return (
    <div className="w-full max-w-[90%] mx-auto py-[20%] px-[10%] sm:px-[10%] xl:px-[0%]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          1280: {slidesPerView: 4},
          768: {slidesPerView: 3},
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true, enabled: false }}
        autoplay={{ delay: 3000 }}
        loop
        className="py-6"
      >
        {companyBlogs.slice(0, 5).map((blog) => (
          <SwiperSlide key={blog.id}>
              <BlogCard {...blog} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogCarousel;
