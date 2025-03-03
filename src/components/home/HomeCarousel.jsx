import { Carousel } from "@material-tailwind/react";
import BlogCard from "./BlogCard";
import CompanyBlogs from "./CompanyBlogsList";

export function CarouselCustomNavigation() {
  const companyBlogs = CompanyBlogs;

  return (
    <Carousel
      className="rounded-xl"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="carousel-index absolute sm:bottom-3 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-primary" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {companyBlogs.slice(0, 5).map((blog) => (
        <div
          key={blog.id}
          className="w-full h-full flex justify-center pb-10 items-center px-[18%] md:px-0"
        >
          <div className="rounded-2xl w-full max-w-[400px] aspect-[3/4] bg-white shadow-xl">
            <BlogCard
              image={blog.image}
              title={blog.title}
              author={blog.author}
              content={blog.content}
              dateTimePosted={blog.dateTimePosted}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}

export default CarouselCustomNavigation;