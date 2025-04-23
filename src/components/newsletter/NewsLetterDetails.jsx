import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import Footer from "../footer/Footer";
import BackToTop from "../buttons/BackToTop";
import BackButton from "../buttons/BackButton";

import React from "react";
import api from "../../utils/axios";
import LoadingArticleDetails from "../loader/LoadingArticleDetails";

// DUMMY DATA
import NewsletterArticles from "./NewsletterArticles";
import PageMeta from "../layout/PageMeta";

const NewsletterDetails = ({
  // id,
  title,
  image,
  author,
  readTime,
  datePublished,
  // article,
}) => {
  // Dummy data
  const article = NewsletterArticles[0];
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [newsletterItem, setNewsletterItem] = useState({});

  const previousPage = location.state?.from;
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/newsletter");
  };

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoading(true);

        const newsletterId = location.state?.id || id;
        if (!newsletterId) return;

        // const response = await api.get(`/api/get-news/${newsId}`);
        // console.log(response.data);

        // setNewsletterItem(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [location.state, id]); // ✅ Depend on state or fallback id

  if (loading) {
    return <LoadingArticleDetails />;
  }

  return (
    <>
      <PageMeta
        isDefer={true}
        title={
          article?.title
            ? `${article.title} | Suitelifer`
            : "Newsletter | Suitelifer"
        }
        description={article?.article}
        url={`${location.pathname}${location.search}`}
      />
      <section
        className="gap-4 h-dvh"
        style={{ maxWidth: "2000px", margin: "0 auto" }}
      >
        {/* MOBILE NAV */}
        <div className="sm:hidden">
          <MobileNav />
        </div>
        {/* TABLET NAV */}
        <div className="tablet-nav">
          <TabletNav />
        </div>
        {/* DESKTOP NAV */}
        <div className="desktop-nav">
          <DesktopNav />
        </div>

        <main className="px-[5%] md:px-[10%] lg:px-[15%] xl:px-[25%] lg:my-20 mb-20">
          <BackButton backPath={handleBack} />
          {/* Main Article */}
          <section className="mt-4">
            {article.image ? (
              <>
                <img
                  className="mb-5 w-full h-full aspect-video object-cover rounded-lg"
                  src={article.image}
                  alt="Article Image"
                />
              </>
            ) : (
              <></>
            )}
            {/* Title */}
            <p className="text-h4 font-avenir-black">{article.title}</p>

            <p className="text-small pb-3 pt-1">
              <span className={`text-primary`}>{article.author}</span>
              <span className={`text-gray-400`}>&nbsp; |</span>
              <span className={`text-primary`}>
                &nbsp;&nbsp;{article.readTime}
              </span>
              <span className={`text-gray-400`}>&nbsp; |</span>
              <span className={`text-primary`}>
                &nbsp;&nbsp;{article.datePublished}
              </span>
            </p>
            <div className={`text-body text-justify text-gray-500`}>
              <article>{article.article}</article>
            </div>
          </section>
        </main>
        <Footer />
      </section>
    </>
  );
};

export default NewsletterDetails;
