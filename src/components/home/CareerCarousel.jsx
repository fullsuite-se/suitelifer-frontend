// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules"; // Import Autoplay
// import "swiper/css";
// import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import testimonials from "../about-us/TestimonialsList.jsx";
import bgQuotes from "../../assets/images/bg-quotes.svg";
import MotionUp from "../MotionUp.jsx";

const careerIndustries = [
  {
    id:1,
    image:
      "https://www.anzac.co.in/wp-content/uploads/2024/03/business-process-outsourcing.jpg",
    name: "Data Operations",
  },
  {
    id:2,
    image:
      "https://i1.wp.com/ebcallcenter.com/wp-content/uploads/BPO-1.jpg?fit=750%2C437&ssl=1",
    name: "Business Operations",
  },
  {
    id:3,
    image:
      "https://media.istockphoto.com/id/1645012505/photo/analytics-chart-business-analysis-chart-kpi-showing-icon-on-virtual-screen-monitor-laptop-by.jpg?s=612x612&w=0&k=20&c=t82vo8fipJUrwEpHGU2y-rUQN_i7BrXYoxvLgMcDe18=",
    name: "Finance Operations",
  },
  {
    id:4,
    image:
      "https://media.istockphoto.com/id/1021137062/photo/software-developers-doing-some-research.jpg?s=612x612&w=0&k=20&c=K3YdSFPGGCUSwSWkeZ_nuhWszRxpjNJe5sRBYJkFMpQ=",
    name: "Software Development",
  },
  {
    id:5,
    image:
      "https://beta.tourism.gov.ph/wp-content/uploads/2024/06/FBSE_PHOTO_11-scaled.jpg",
    name: "Culinary",
  },
  {
    id:6,
    image:
      "https://www.georginalittlephotography.co.uk/wp-content/uploads/2024/09/Alex-Chell-2-1080x675.jpg",
    name: "Branding",
  },
];

const CareerCarousel = () => {
  return (
   
      <MotionUp  >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8 mb-15">
             
        
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            pagination={{ clickable: true }}
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
            {careerIndustries.slice(0, 5).map((career, index) => (
              <SwiperSlide key={career.id}>
        
                  <div
                    className={`p-5 mt-4 ease-out bg-white shadow-lg rounded-2xl text-center transition-transform duration-300 scale-90
                    `}
                  >
                     <img
                  src={career.image}
                  alt={career.name}
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                <p className="text-center mt-3 font-avenir-black text-lg sm:text-xl">
                  {career.name}
                </p>
                  </div>
        
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
      </MotionUp>
   
  );
};

export default CareerCarousel;
