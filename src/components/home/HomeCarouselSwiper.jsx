import { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import ompanyBlogs from "./CompanyBlogsList";

const HomeCarouselSwiper = () => {
  useEffect(() => {
    new Swiper(".centered-slide-carousel", {
        centeredSlides: true,
        paginationClickable: true,
        loop: false,
        spaceBetween: 30,
        slideToClickedSlide: true,
        pagination: {
          el: ".centered-slide-carousel .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          1920: {
            slidesPerView: 4,
            spaceBetween: 30,
            initialSlide: 2,
          },
          1028: {
            slidesPerView: 2,
            spaceBetween: 10,
            initialSlide: 2,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
            initialSlide: 2,
          }
        }
       });
  }, []);

  return (
    <div className="w-full relative hidden md:block">
      <link
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        rel="stylesheet"
      />
      <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
      <div className="swiper centered-slide-carousel relative">
        {/* Swiper Wrapper */}
        <div className="swiper-wrapper">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="swiper-slide">
              <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
                <span className="text-3xl font-semibold text-indigo-600">
                  Slide {i + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
};

export default HomeCarouselSwiper;
