import { Helmet } from "react-helmet-async";

const PageMeta = ({ title, description, imageUrl, url, isDefer }) => {
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
          imageUrl ||
          "https://www.suitelifer.com/images/suitelifer-link-preview.webp"
        }
      />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="article" />

      {/* For Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          imageUrl ||
          "https://www.suitelifer.com/images/suitelifer-link-preview.webp"
        }
      />
    </Helmet>
  );
};

export default PageMeta;
