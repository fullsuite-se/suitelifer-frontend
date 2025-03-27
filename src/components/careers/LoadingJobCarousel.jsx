import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import { toSlug } from "../../utils/slugUrl";
import { NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const LoadingJobCarousel = () => {
  return (
    <section className="">
      <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true, enabled: true }}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          loop
          // navigation={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: true,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 28,
              centeredSlides: true,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 28,
              centeredSlides: true,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
              centeredSlides: true,
            },
          }}
          className="w-full"
        >
          {[...Array(5)].map((job, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div
                  className={`p-7 ease-out min-h-100 flex flex-col justify-center bg-white shadow-lg rounded-lg transition-transform duration-300 ${
                    isActive
                      ? "scale-90 md:scale-110 bg-primary md:hover:scale-115"
                      : "scale-90 opacity-75 hover:-translate-y-2"
                  }`}
                >
                  {/* Title */}
                  <Skeleton width={"80%"} />
                  {/* Operations */}
                  <Skeleton width={"40%"} height={8} /> 
                  <div className="h-2"></div>
                  {/* Type, Setup */}
                  <Skeleton width={"40%"} />
                  <br />
                  {/* Expected salary */}
                  <Skeleton width={"30%"} height={10} />
                  <Skeleton width={"30%"} height={12} />
                  <br />
                  {/* Desc */}
                  <Skeleton count={5} height={12}/>
                  <div className="h-3"></div>
                  {/* Button */}
                  <Skeleton height={30}/>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LoadingJobCarousel;
