import React from "react";

const ArticleImageCard = ({
  image = "https://images.unsplash.com/vector-1739647326735-37b8489a3c9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFuZHNjYXBlJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D",
  title,
  author,
  readTime,
  datePublished,
}) => {
  return (
    <div className="relative">
      <div className="absolute w-full h-full flex flex-col justify-end bg-black/50 rounded-lg p-[5%]">
        <p className={`font-avenir-black text-body md:line-clamp-1 xl:line-clamp-2 text-white`}>
          {title}
        </p>
        <p className="text-xss">
          <span className={`text-white`}>{author}</span>
          <span className={`text-white`}>&nbsp; |</span>
          <span className={`text-white`}>&nbsp;&nbsp;{readTime}</span>
          <span className={`text-white`}>&nbsp; |</span>
          <span className={`text-white`}>&nbsp;&nbsp;{datePublished}</span>
        </p>
      </div>
      <div className="w-full">
        <img
          className="w-full h-full aspect-video object-cover rounded-lg"
          src={image}
          alt=""
        />
      </div>
    </div>
  );
};

export default ArticleImageCard;
