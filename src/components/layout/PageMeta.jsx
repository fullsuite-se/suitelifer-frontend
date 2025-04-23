import { Helmet } from "react-helmet-async";

const PageMeta = ({ title, description, url, isDefer }) => {
  const fullUrl = `https://www.suitelifer.com${url}`;
  return (
    <Helmet defer={isDefer}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={
          "https://www.suitelifer.com/images/suitelifer-link-preview.webp"
        }
      />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="article" />
    </Helmet>
  );
};

export default PageMeta;
