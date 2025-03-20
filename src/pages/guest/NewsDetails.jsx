import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import React from "react";
import Footer from "../../components/Footer";
import MobileNav from "../../components/home/MobileNav";
import TabletNav from "../../components/home/TabletNav";
import DesktopNav from "../../components/home/DesktopNav";
import bgBlogs from "../../assets/images/blogs-text-bg.svg";

import { toSlug } from "../../utils/slugUrl";
import ArticleDetails from "../../components/news/ArticleDetails";
import OnLoadLayoutAnimation from "../../components/layout/OnLoadLayoutAnimation";
import NewsList from "../../components/news/NewsList";
import api from "../../utils/axios";

const NewsDetails = () => {
  const { id } = useParams();

  // const newsItem = NewsList.find((news) => news.id.toString() === id);
  const relatedNews = NewsList.filter(
    (news) => news.id.toString() !== id
  ).slice(0, 5);
  const [loading, setLoading] = useState(false);
  const [newsItem, setNewsItem] = useState({});

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/get-news/${id}`);
        console.log(response.data);

        setNewsItem(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="w-full h-full">
        {/* <OnLoadLayoutAnimation /> */}
      </section>
    );
  }

  return (
    <>
      {newsItem && (
        <ArticleDetails
          data={newsItem}
          relatedArticles={relatedNews}
          backPath="/news"
          type="News"
        />
      )}
    </>
  );
};

export default NewsDetails;
