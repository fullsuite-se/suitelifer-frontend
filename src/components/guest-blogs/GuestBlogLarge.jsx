import formatTimestamp from "../TimestampFormatter";

const GuestBlogLarge = ({
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
    <a
      href=""
      className="no-underline cursor-pointer group flex flex-col lg:flex-row-reverse lg:gap-10"
    >
      <section
        className="relative w-full rounded-3xl overflow-hidden  transform transition-all duration-300 ease-in-out group-hover:scale-105 
  group-hover:shadow-xl group-hover:shadow-secondary/50 active:scale-105 
  active:shadow-xl active:shadow-secondary/50"
      >
        <div className="relative">
          <img
            className="w-full h-130 object-cover rounded-3xl"
            src={images[0].image}
            alt="Blog Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80"></div>
        </div>

        <div className="absolute bottom-0 p-7 text-white lg:p-15">
          <h2
            className="font-avenir-black text-lg  lg:text-2xl  group-hover:text-secondary transition duration-300 ease-in-out
          "
          >
            {title}
          </h2>
          <p className="text-sm mt-1">
            <span className="text-secondary font-avenir-black"> {author}</span>{" "}
            | {readTime}
          </p>
          <p className="mt-2 text-sm text-gray-300 line-clamp-3">{article}</p>
        </div>
      </section>
    </a>
  );
};

export default GuestBlogLarge;
