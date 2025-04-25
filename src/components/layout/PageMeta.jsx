import { Helmet } from "react-helmet-async";

const PageMeta = ({ title, description, imageUrl, url, isDefer }) => {
  return (
    <Helmet defer={isDefer}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
    </Helmet>
  );
};

export default PageMeta;
