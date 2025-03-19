import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; // Import Autoplay
import "swiper/css";
import "swiper/css/pagination";

const careerIndustries = [
  {
    image:
      "https://www.anzac.co.in/wp-content/uploads/2024/03/business-process-outsourcing.jpg",
    name: "Data Operations",
  },
  {
    image:
      "https://i1.wp.com/ebcallcenter.com/wp-content/uploads/BPO-1.jpg?fit=750%2C437&ssl=1",
    name: "Business Operations",
  },
  {
    image:
      "https://media.istockphoto.com/id/1645012505/photo/analytics-chart-business-analysis-chart-kpi-showing-icon-on-virtual-screen-monitor-laptop-by.jpg?s=612x612&w=0&k=20&c=t82vo8fipJUrwEpHGU2y-rUQN_i7BrXYoxvLgMcDe18=",
    name: "Finance Operations",
  },
  {
    image:
      "https://media.istockphoto.com/id/1021137062/photo/software-developers-doing-some-research.jpg?s=612x612&w=0&k=20&c=K3YdSFPGGCUSwSWkeZ_nuhWszRxpjNJe5sRBYJkFMpQ=",
    name: "Software Development",
  },
  {
    image:
      "https://beta.tourism.gov.ph/wp-content/uploads/2024/06/FBSE_PHOTO_11-scaled.jpg",
    name: "Culinary",
  },
  {
    image:
      "https://www.georginalittlephotography.co.uk/wp-content/uploads/2024/09/Alex-Chell-2-1080x675.jpg",
    name: "Branding",
  },
];

const CareerCarousel = () => {
  return (
    <section className="w-[80%]! mx-auto px-6">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={40}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
          1440: { slidesPerView: 5 },
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="pb-10"
      >
        {careerIndustries.map((career, index) => (
          <SwiperSlide key={index} className="my-5 flex justify-center">
            <div className="rounded-2xl shadow-lg overflow-hidden w-64 bg-white p-3 transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105">
              <img
                src={career.image}
                alt={career.name}
                className="w-full aspect-[3/4] object-cover rounded-lg"
              />
              <p className="text-center mt-3 font-medium text-lg sm:text-xl">
                {career.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CareerCarousel;
