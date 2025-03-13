import { Link } from "react-router-dom";
import formatTimestamp from "../TimestampFormatter";
import { toSlug } from "../../utils/slugUrl";

const GuestBlogCardSmall = ({
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
    <Link 
    to={`/blogs/${id}/${toSlug(title)}`}
    className="no-underline cursor-pointer group flex flex-col lg:flex-row-reverse lg:gap-10">
 
    <section 
  className="relative w-full h-30 rounded-xl overflow-hidden 
  transform transition-all duration-300 ease-in-out group-hover:scale-105 
  group-hover:shadow-xl group-hover:shadow-secondary/50 active:scale-105 
  active:shadow-xl active:shadow-secondary/50"
>


  <div className="relative">
          <img
            className="w-full h-30 object-cover rounded-xl"
            src={images[0].image}
            alt="Blog Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
        </div>

        <div className="absolute bottom-0 p-4 text-white">
          <h2 className="font-avenir-black !text-[14px] lg:!text-[16px] group-hover:text-secondary   transition duration-300 ease-in-out line-clamp-2">
            {title}
          </h2>

          <p className="!text-[12px] ">
            <span className="text-secondary font-avenir-black !text-[12px]">{author}</span> |{" "}
            {readTime}
          </p>

        </div>
      </section>
    </Link>
  );
};

export default GuestBlogCardSmall;
