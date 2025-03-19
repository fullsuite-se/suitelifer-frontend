import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";

import { toSlug } from "../../utils/slugUrl";
import ArticleDetails from "../../components/news/ArticleDetails";
import NewsList from "../../components/news/NewsList";
const NewsDetails = () => {
  const { id } = useParams();
  const newsItem = NewsList.find((news) => news.id.toString() === id);
  const relatedNews = NewsList.filter(
    (news) => news.id.toString() !== id
  ).slice(0, 5);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <ArticleDetails
        data={newsItem}
        relatedArticles={relatedNews}
        backPath="/news"
        type="News"
      />
    </>
  );
};

export default NewsDetails;
