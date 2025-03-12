import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import testimonials from "./TestimonialsList";
import bgQuotes from "../../assets/images/bg-quotes.svg";

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm text-gray-500 font-medium block mb-2">
            TESTIMONIALS
          </span>
          <p className="text-4xl font-bold font-avenir-black text-primary">
            Stories of Excellence
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          loop
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
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
          {testimonials.slice(0, 5).map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              {({ isActive }) => (
                <div
                  className={`p-6 mt-4 ease-out bg-white shadow-lg rounded-lg text-center transition-transform duration-300 ${
                    isActive
                      ? "scale-90 md:scale-110 bg-primary text-white hover:scale-115"
                      : "scale-90 opacity-75 hover:-translate-y-2"
                  }`}
                >
                  <img
                    src={bgQuotes}
                    alt="quote"
                    className="absolute translate-x-7 translate-y-22 -rotate-15 w-16 mx-auto mb-4"
                  />
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="size-30 mx-auto rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className={`text-sm text-gray-500`}>
                    {testimonial.position}
                  </p>
                  <p className={`mt-4 text-gray-700`}>
                    {testimonial.testimony}
                  </p>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
