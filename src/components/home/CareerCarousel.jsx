import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import MotionUp from "../MotionUp.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BusinessOperations from "../../assets/images/careers-industry-images/Business-Operations.webp";
import FinanceOperations from "../../assets/images/careers-industry-images/Finance-Operations.webp";
import SoftwareDevelopment from "../../assets/images/careers-industry-images/Software-Engineering-A.webp";
import Compliance from "../../assets/images/careers-industry-images/Compliance.webp";
import atsAPI from "../../utils/atsAPI.js";

const careerIndustries = [
  {
    industryId: 1,
    imageUrl: BusinessOperations,
    name: "Business Operations",
  },
  {
    industryId: 2,
    imageUrl: FinanceOperations,
    name: "Finance Operations",
  },
  {
    industryId: 3,
    imageUrl: SoftwareDevelopment,
    name: "Software Development",
  },
  {
    industryId: 4,
    imageUrl: Compliance,
    name: "Compliance",
  },
];

const CareerCarousel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [industries, setIndustries] = useState([]);

  const fetchIndustries = async () => {
    try {
      setIsLoading(true);
      const response = await atsAPI.get("/industries/pr");

      setIndustries(response.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

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
          {isLoading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`p-5 mt-4 ease-out cursor-grab bg-white shadow-lg rounded-2xl text-center transition-transform duration-300 scale-90
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
              {industries.slice(0, 5).map((career, index) => (
                <SwiperSlide key={career.industryId}>
                  <div
                    className={`p-5 mt-4 ease-out cursor-grab bg-white shadow-lg rounded-2xl text-center transition-transform duration-300 scale-90
                    `}
                  >
                    {career.imageUrl ? (
                      <>
                        <img
                          src={career.imageUrl}
                          alt={career.industryName}
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
                      {career.industryName || <Skeleton width={"50%"} />}
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
