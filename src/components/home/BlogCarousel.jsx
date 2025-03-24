import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GuestBlogCard from "../guest-blogs/GuestBlogCard";
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import OnLoadLayoutAnimation from "../layout/OnLoadLayoutAnimation";

const BlogCarousel = () => {
  const [companyBlogs, setCompanyBlogs] = useState([]);

  const fetchCompanyBlogs = async () => {
    const response = await api.get("/api/all-company-blogs");

    console.log(response.data);

    setCompanyBlogs(response.data);
  };

  useEffect(() => {
    fetchCompanyBlogs();
  }, []);

  return (
    <div className="w-full max-w-[90%] mx-auto">
      {companyBlogs.length === 0 ? (
        <section className="grid place-conte`nt-center h-dvh">
          <OnLoadLayoutAnimation />
        </section>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          breakpoints={{
            1280: { slidesPerView: 4 },
            1024: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            0: { slidesPerView: 1, centeredSlides: true },
          }}
          navigation
          pagination={{ clickable: true, enabled: false }}
          autoplay={{ delay: 5000 }}
          loop
          className="py-6"
        >
          {companyBlogs.slice(0, 5).map((blog) => (
            <SwiperSlide key={blog.cblogId}>
              <div className="p-4 px-[10%]">
                <GuestBlogCard {...blog} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BlogCarousel;
