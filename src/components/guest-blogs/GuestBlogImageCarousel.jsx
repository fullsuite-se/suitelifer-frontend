import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BlogImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if ( images.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, images.length]);

  return (
    <div
  className="relative w-full max-w-3xl lg:max-w-5xl mt-5 mx-auto overflow-hidden"
>
  <div className="w-full h-60 md:h-80 lg:h-[32rem] bg-transparent flex items-center justify-center rounded-lg overflow-hidden relative group-hover:scale-105 
  group-hover:shadow-xl group-hover:shadow-secondary/50">
    {images.map((img, index) =>
      index === currentIndex ? (
        <img
          key={index}
          src={img.image}
          alt="Blog Cover"
          className="absolute rounded-2xl max-h-full w-auto object-contain transition-all duration-700 ease-in-out cursor-pointer opacity-100 scale-100 "
          onClick={() => {
            window.open(img.image, "_blank");
          }}
        
     
        />
      ) : null
    )}
  </div>
  {images.length > 1 && (
    <>
      <button
        onClick={prevSlide}
        className="absolute top-[45%] left-4 lg:left-0 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-[45%] right-4 lg:right-0 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full"
      >
        <ChevronRight size={24} className="text-white" />
      </button>
    </>
  )}

  {images.length > 1 && (
    <div className="flex justify-center gap-2 mt-3 mb-5">
      {images.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentIndex === index ? "bg-primary scale-110" : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div>
  )}
</div>

  );
};

export default BlogImageCarousel;
