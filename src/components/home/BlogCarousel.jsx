import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import companyBlogsDummy from "./CompanyBlogsList";
import GuestBlogCard from "../guest-blogs/GuestBlogCard";
import api from "../../utils/axios";
import { useState, useEffect } from "react";
import OnLoadLayoutAnimation from "../layout/OnLoadLayoutAnimation";
import LoadingBlogCard from "../guest-blogs/LoadingBlogCard";
import { removeHtmlTags } from "../../utils/removeHTMLTags";

const BlogCarousel = () => {
  const [companyBlogs, setCompanyBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyBlogs = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await api.get("/api/all-company-blogs");
      setCompanyBlogs(response.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCompanyBlogs();
  }, []);

  return (
    <div className="w-full max-w-[90%] mx-auto">
      {!isLoading && companyBlogs.length === 0 ? (
        <div className="text-center text-white text-2xl pt-[7%] pb-[12%]">
          No blogs available
        </div>
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
          {!isLoading ? (
            <>
              {companyBlogs?.slice(0, 5).map((blog) => (
                <SwiperSlide key={blog.cblogId}>
                  <div className="p-4 px-[10%]">
                    <GuestBlogCard
                      {...blog}
                      created_at={blog.createdAt}
                      id={blog.cblogId}
                      description={removeHtmlTags(blog.description)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </>
          ) : (
            <>
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="p-4 px-[10%]">
                    <LoadingBlogCard />
                  </div>
                </SwiperSlide>
              ))}
            </>
          )}
        </Swiper>
      )}
    </div>
  );
};

export default BlogCarousel;
