import { Helmet } from "react-helmet-async";

const PageMeta = ({ title, description, isDefer }) => {
  /* TODO by Hernani: Use the original package of React Helmet when it supports React 19
      See:
      (Alternative) https://www.npmjs.com/package/@dr.pogodin/react-helmet
      (Original) https://www.npmjs.com/package/react-helmet-async
  */
  return (
    <Helmet defer={isDefer}>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default PageMeta;
