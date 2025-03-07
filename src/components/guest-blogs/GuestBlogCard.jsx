import { Link } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";

const GuestBlogCard = ({
  id,
  title,
  author,
  readTime,
  article,
  created_at,
  images,
}) => {
  const { day, fullDate, time } = formatTimestamp(created_at);

  return (
    <Link  to={`${id}/${toSlug(title)}`} className="no-underline cursor-pointer group flex flex-col lg:flex-row-reverse lg:gap-10">
 
    <section 
  className="relative w-full h-80 lg:h-90 rounded-xl overflow-hidden 
  transform transition-all duration-300 ease-in-out group-hover:scale-105 
  group-hover:shadow-xl group-hover:shadow-secondary/50 active:scale-105 
  active:shadow-xl active:shadow-secondary/50"
>


  <div className="relative">
          <img
            className="w-full h-80 lg:h-90 object-cover rounded-xl"
            src={images[0].image}
            alt="Blog Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
        </div>

        <div className="absolute bottom-0 p-4 text-white">
          <h2 className="font-avenir-black !text-base sm:!text-lg md:!text-lg  group-hover:text-secondary transition duration-300 ease-in-out">
            {title}
          </h2>

          <p className="!text-[12px] sm:!text-[14px]  mt-1">
            <span className="text-secondary font-avenir-black">{author}</span> |{" "}
            {readTime}
          </p>

          <p className="mt-2 !text-[12px] sm:!text-[14px] text-gray-300 line-clamp-3">
            {article}
          </p>


          <p className="text-xs text-gray-400 mt-2">{fullDate}</p>
        </div>
      </section>
    </Link>
  );
};

export default GuestBlogCard;
