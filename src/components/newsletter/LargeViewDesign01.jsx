import ArticlePreviewWithHyphenation from "./ArticlePreviewWithHyphenation";

const LargeViewDesign01 = ({
  image,
  title,
  author,
  readTime,
  datePublished,
  article,
}) => {
  return (
    <section className="">
         {image ? (
        <>
         <img
        className="mb-5 w-full h-full aspect-video object-cover rounded-lg"
        src={image}
        alt="Article Image"
      />
        </>
      ) : (
        <></>
      )}
     
      <p className="font-avenir-black text-h6 line-clamp-2">{title}</p>
      <p className="text-small pb-3 pt-1">
        <span className="text-primary">{author}</span>
        <span className="text-gray-400">&nbsp; |</span>
        <span className="text-gray-400">&nbsp;&nbsp;{readTime}</span>
        <span className="text-gray-400">&nbsp; |</span>
        <span className="text-gray-400">&nbsp;&nbsp;{datePublished}</span>
      </p>
      <div className="line-clamp-9 text-body text-justify md:hidden text-gray-500">
      <ArticlePreviewWithHyphenation content={article}/>
      </div>
      <div className="article-ds-1 text-body text-justify text-gray-500 line-clamp-7">
      <ArticlePreviewWithHyphenation content={article}/>
      </div>
    </section>
  );
};

export default LargeViewDesign01;
