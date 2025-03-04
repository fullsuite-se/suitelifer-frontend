const NewsLarge = ({ title, author, readTime, content }) => {
  return (
    <section>
      {/* Title */}
      <p className="line-clamp-2 font-avenir-black">{title}</p>

      {/* Author | Read Time */}
      <div className="">
        <p className="">
          <span className="text-primary">{author} &nbsp; |</span>
          &nbsp; <span className="text-gray-400">{readTime}</span>
        </p>
      </div>
    </section>
  );
};

export default NewsLarge;
