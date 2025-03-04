const BlogCard = ({image, title, author, dateTimePosted, content}) => {
  return (
    <div className="rounded-2xl md:max-w-[400px] aspect-[3/4] bg-white shadow-sm">
      <a href="" className="no-underline rounded-2xl">
      {/* Image */}
      <div>
        <img
        className="rounded-t-2xl h-full w-full aspect-video object-cover"
          src={image}
          alt="Blog post image"
        />
      </div>
      <div className="small-blog-card-content p-4">
        {/* Title */}
        <div>
          <p className="font-avenir-black text-[20px] md:text-[16px] sm:text-xl lg:text-[18px] line-clamp-2">
            {title}
          </p>
        </div>
        {/* Author and date/time posted */}
        <div className="text-sm sm:text-[18px] md:text-[12px] lg:text-sm py-1 sm:py-3 flex justify-between">
          <span className="text-primary">{author}</span>
          <span className="text-gray-400">{dateTimePosted}</span>
        </div>
        {/* Description */}
        <div className="">
          <p className="small-blog-card text-sm sm:text-[18px] md:text-[12px] lg:text-sm">
            {content}
          </p>
        </div>
      </div>
    </a>
    </div>
    
  );
};

export default BlogCard;
