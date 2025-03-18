import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import testimonials from "../about-us/TestimonialsList";
import { toSlug } from "../../utils/slugUrl";
import { NavLink } from "react-router-dom";

const JobCarouselVersion2 = ({ jobs }) => {
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
          {jobs
            .filter((_, index) => index < 4) 
            .map((job, index) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <div
                    className={`p-7 ease-out min-h- min-h-100 flex flex-col justify-center bg-white shadow-lg rounded-lg transition-transform duration-300 ${
                      isActive
                        ? "scale-90 md:scale-110 bg-primary md:hover:scale-115"
                        : "scale-90 opacity-75 hover:-translate-y-2"
                    }`}
                  >
                    <p className="text-lg font-avenir-black font-semibold text-gray-900">
                      {job.jobTitle}
                    </p>
                    <div className="flex flex-col mb-4">
                      <span className="text-sm font-avenir-roman mb-3 text-gray-500">
                        <span className="text-secondary">|</span>{" "}
                        {job.setupName}
                      </span>
                      <span className={`text-primary `}>
                        {job.employmentType}
                      </span>
                    </div>
                    {isActive && job.salaryMin != null && job.salaryMin > 0 && (
                      <>
                        <p className="text-[0.75em] text-gray-400">
                          Expected Salary
                        </p>
                        <p className="text-[18px] font-avenir-black mb-3 text-primary">
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "PHP",
                            maximumFractionDigits: 0,
                          }).format(job.salaryMin)}
                          <span className="text-xs font-avenir-roman">
                            {" "}
                            min
                          </span>
                        </p>
                      </>
                    )}
                    {isActive && (
                      <p
                        className={`mb-3 text-gray-700 ${
                          job.salaryMin ? "line-clamp-5" : "line-clamp-7"
                        }`}
                      >
                        {job.description}
                      </p>
                    )}
                    {isActive && (
                      <NavLink
                        to={`/careers/${toSlug(job.jobTitle)}`}
                        state={{ jobId: job.jobId }}
                      >
                        <button className="bg-primary cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#007a8e] text-white p-2 rounded-xl w-full mt-auto">
                          View Full Details
                        </button>
                      </NavLink>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default JobCarouselVersion2;
