import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import MotionUp from "../MotionUp.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const careerIndustries = [
  {
    industryId: 1,
    imageUrl:
      "https://www.anzac.co.in/wp-content/uploads/2024/03/business-process-outsourcing.jpg",
    name: "Data Operations",
  },
  {
    industryId: 2,
    imageUrl:
      "https://i1.wp.com/ebcallcenter.com/wp-content/uploads/BPO-1.jpg?fit=750%2C437&ssl=1",
    name: "Business Operations",
  },
  {
    industryId: 3,
    imageUrl:
      "https://media.istockphoto.com/id/1645012505/photo/analytics-chart-business-analysis-chart-kpi-showing-icon-on-virtual-screen-monitor-laptop-by.jpg?s=612x612&w=0&k=20&c=t82vo8fipJUrwEpHGU2y-rUQN_i7BrXYoxvLgMcDe18=",
    name: "Finance Operations",
  },
  {
    industryId: 4,
    imageUrl:
      "https://media.istockphoto.com/id/1021137062/photo/software-developers-doing-some-research.jpg?s=612x612&w=0&k=20&c=K3YdSFPGGCUSwSWkeZ_nuhWszRxpjNJe5sRBYJkFMpQ=",
    name: "Software Development",
  },
  {
    industryId: 5,
    imageUrl:
      "https://www.georginalittlephotography.co.uk/wp-content/uploads/2024/09/Alex-Chell-2-1080x675.jpg",
    name: "Branding",
  },
];

const CareerCarousel = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <MotionUp>
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8 mb-15">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: false,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 28,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
              centeredSlides: false,
            },
          }}
          className="w-full"
        >
          {careerIndustries.length == 0 ? (
            <>
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`p-5 mt-4 ease-out bg-white shadow-lg rounded-2xl text-center transition-transform duration-300 scale-90
                    `}
                  >
                    <div className="w-full aspect-[100/101] rounded-xl overflow-hidden">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <p className="text-center mt-3 py-5 font-avenir-black text-lg sm:text-xl">
                      <Skeleton width={"50%"} />
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </>
          ) : (
            <>
              {careerIndustries.slice(0, 5).map((career, index) => (
                <SwiperSlide key={career.industryId}>
                  <div
                    className={`p-5 mt-4 ease-out bg-white shadow-lg rounded-2xl text-center transition-transform duration-300 scale-90
                    `}
                  >
                    {career.imageUrl ? (
                      <>
                        <img
                          src={career.imageUrl}
                          alt={career.name}
                          className="w-full aspect-[100/101] object-cover rounded-xl"
                        />
                      </>
                    ) : (
                      <>
                        <div className="w-full aspect-[100/101] rounded-xl overflow-hidden">
                          <Skeleton className="w-full h-full" />
                        </div>
                      </>
                    )}
                    <p className="text-center mt-3 py-5 font-avenir-black text-body">
                      {career.name || <Skeleton width={"50%"} />}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </>
          )}
        </Swiper>
      </div>
    </MotionUp>
  );
};

export default CareerCarousel;
