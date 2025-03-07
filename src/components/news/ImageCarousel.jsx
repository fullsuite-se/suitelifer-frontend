import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageCarousel = ({ images, imagesWithCaption }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const slides = imagesWithCaption || images;

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, slides.length]);

  return (
    <div className="relative w-full max-w-3xl lg:max-w-5xl mt-5 mx-auto overflow-hidden">
      <div className="relative w-full h-60 md:h-80 lg:h-[32rem] bg-transparent flex items-center justify-center rounded-2xl overflow-hidden">
        <div
          className="w-full h-full flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 h-full relative"
            >
              <img
                src={slide.image}
                alt="Slide"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(slide.image, "_blank")}
              />
              {imagesWithCaption && slide.caption && (
                <p className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 p-2 text-xs">
                  {slide.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-[45%] left-4 lg:left-5 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-[45%] right-4 lg:right-5 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-3 mb-5">
          {slides.map((_, index) => (
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

export default ImageCarousel;
