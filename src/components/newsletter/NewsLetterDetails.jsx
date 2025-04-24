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
import formatTimestamp from "../../utils/formatTimestamp";
import { readingTime } from "reading-time-estimator";
import { removeHtmlTags } from "../../utils/removeHTMLTags";
import Carousel from "../cms/Carousel";

import PageMeta from "../layout/PageMeta";

const NewsletterDetails = () => {
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

        const response = await api.get(`/api/newsletter/` + newsletterId);
        console.log(newsletterId);
        console.log(response.data.newsletter);

        setNewsletterItem(response.data.newsletter);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [location.state, id]); 

  if (loading) {
    return <LoadingArticleDetails />;
  }

  return (
    <>
      <Helmet>
        <title>{newsletterItem.title || "Suitelifer"}</title>
        <meta
          name="description"
          // content={
          //   content
          //     ? content.substring(0, 150) + "..."
          //     : "Read the latest newsletters on Suitelifer."
          // }
        />
        <meta
          name="keywords"
          content={`${newsletterItem.title}, Suitelifer Newsletter, news, newsletter`}
        />
        {/* 
              TODO :
              <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={data?.title} />
             <meta name="twitter:description" content={data?.snippet || data?.article?.substring(0, 150)} />
            <meta name="twitter:image" content={data?.images?.[0] || "https://yourwebsite.com/default-image.jpg"} /> */}
      </Helmet>
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
          <div className="py-3"></div>

          <BackButton backPath={handleBack} />
          <section className="mt-4">
            <Carousel
              images={
                Array.isArray(newsletterItem.images)
                  ? newsletterItem.images
                  : []
              }
              isButtonOutside={false}
            />
            <div className="py-2"></div>
            <p className="text-h4 font-avenir-black">{newsletterItem.title}</p>
            <p className="text-small pb-3 pt-1">
              <span className={`text-primary`}>{newsletterItem.pseudonym}</span>
              <span className={`text-gray-400`}>&nbsp; |</span>
              <span className={`text-primary`}>
                &nbsp;&nbsp;
                {
                  readingTime(
                    removeHtmlTags(newsletterItem.article ?? "article"),
                    238
                  ).text
                }
              </span>
              <span className={`text-gray-400`}>&nbsp; |</span>
              <span className={`text-primary`}>
                &nbsp;&nbsp;{formatTimestamp(newsletterItem.createdAt).fullDate}
              </span>
            </p>{" "}
            <div className="py-3"></div>
            <div className={`text-body text-justify text-gray-500`}>
              <article
                dangerouslySetInnerHTML={{ __html: newsletterItem.article }}
              />
            </div>
          </section>
        </main>
        <Footer />
      </section>
    </>
  );
};

export default NewsletterDetails;
