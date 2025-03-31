import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
// import testimonials from "./TestimonialsList";
import bgQuotes from "../../assets/images/bg-quotes.svg";
import api from "../../utils/axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const Testimonials = () => {

  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/api/get-all-testimonials");
        const data = response.data?.testimonials || [];
        const filteredTestimonials = data.filter(testimonial => !!testimonial.isShown);
       
        
        setTestimonials(filteredTestimonials);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchTestimonials();
  }, []);
  



  return (
    <section className="py-15">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-small text-gray-500 font-medium block mb-2">
            TESTIMONIALS
          </span>
          <p className="text-h4 font-avenir-black text-primary">
            Stories of Excellence
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
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
   {isLoading
      ? 
        Array(5)
          .fill(null)
          .map((_, index) => (
            <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`p-10 mt-4 ease-out bg-white shadow-lg rounded-lg text-center transition-transform duration-300 ${
                  isActive
                    ? "scale-100 md:scale-105 bg-primary text-white"
                    : "scale-90 opacity-75 hover:scale-95 hover:-translate-y-2"
                }`}
              >
               
                <div className="size-30 mx-auto rounded-full mb-4 overflow-hidden">
                  <Skeleton circle width={120} height={120} />
                </div>
  
                <Skeleton width={"80%"} height={16} className="mx-auto mb-2" />
                <Skeleton width={"90%"} height={16} className="mx-auto mb-2" />
                <Skeleton width={"70%"} height={16} className="mx-auto mb-4" />
  
                <Skeleton width={"40%"} height={18} className="mx-auto mb-1" />
  
                <Skeleton width={"30%"} height={14} className="mx-auto text-gray-400" />
              </div>
            )}
          </SwiperSlide>
          ))
      : testimonials.length > 0 ? (
        testimonials.slice(0, 5).map((testimonial) => (
          <SwiperSlide key={testimonial.testimonialId}>
            {({ isActive }) => (
              <div
                className={`p-10 mt-4 ease-out bg-white shadow-lg rounded-lg text-center transition-transform duration-300 ${
                  isActive
                    ? "scale-100 md:scale-105 bg-primary text-white"
                    : "scale-90 opacity-75 hover:scale-95 hover:-translate-y-2"
                }`}
              >
                <img
                  src={bgQuotes}
                  alt="quote"
                  className="absolute translate-x-5 translate-y-22 -rotate-5 w-16 mb-4"
                />
                <img
                  src={testimonial.employeeImageUrl}
                  alt={testimonial.employeeName}
                  className="size-30 mx-auto rounded-full mb-4 object-cover"
                />
                <p className="mt-4 text-gray-700 text-body">
                  {testimonial.testimony}
                </p>
                <br />
                <p className="text-small font-avenir-black text-primary">
                  {testimonial.employeeName}
                </p>
                <p className="text-xss text-gray-400">{testimonial.position}</p>
              </div>
            )}
          </SwiperSlide>
        )
      )
        
         
        )
      
      : (
        <div className="text-center p-5 bg-white shadow-lg rounded-lg">
          <p className="text-body text-gray-600">
            No Testimonials Yet
          </p>
          <p className="text-gray-500 mt-2 text-small">
          Stay tuned! Employee testimonials will be available soon.
          </p>
        </div>
      )
      }

        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
