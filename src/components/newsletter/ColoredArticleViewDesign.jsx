import React from "react";

const ColoredArticleViewDesign = ({
  title,
  author,
  readTime,
  datePublished,
  article,
  lineclamp,
}) => {
  return (
    <div className="p-[5%] md:px-[10%] md:py-[5%] rounded-bl-2xl rounded-tr-2xl md:rounded-2xl bg-primary">
      <p className={`font-avenir-black text-h6 line-clamp-2 text-white`}>
        {title}
      </p>
      <p className="text-small pb-3 pt-1">
        <span className={`text-white`}>{author}</span>
        <span className={`text-white`}>&nbsp; |</span>
        <span className={`text-white`}>&nbsp;&nbsp;{readTime}</span>
        <span className={`text-white`}>&nbsp; |</span>
        <span className={`text-white`}>&nbsp;&nbsp;{datePublished}</span>
      </p>
      <div style={{
        
      }} className={`${lineclamp} mobile-clamper text-body text-justify text-white`}>
        <article>{article}</article>
      </div>
    </div>
  );
};

export default ColoredArticleViewDesign;
