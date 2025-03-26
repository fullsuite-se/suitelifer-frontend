import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import ArticleDetails from "../../components/news/ArticleDetails";
import NewsList from "../../components/news/NewsList";
import api from "../../utils/axios";

const NewsDetails = () => {
  const { id } = useParams();

  const location = useLocation();
  console.log(location.state?.id);

  const relatedNews = NewsList.filter(
    (news) => news.id.toString() !== id
  ).slice(0, 5);
  const [loading, setLoading] = useState(false);
  const [newsItem, setNewsItem] = useState({});


  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        const newsId = location.state?.id || id;
        if (!newsId) return;

        const response = await api.get(`/api/get-news/${newsId}`);
        console.log(response.data);

        setNewsItem(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [location.state, id]); // ✅ Depend on state or fallback id

  if (loading) {
    return (
      <section className="w-full h-full">
      </section>
    );
  }

  return (
    <>
      {newsItem && (
        <ArticleDetails
          id={newsItem.id}
          title={newsItem.title}
          content={newsItem.article}
          createdAt={newsItem.createdAt}
          createdBy={newsItem.createdBy}
          images={newsItem.imgUrls}
          relatedArticles={relatedNews}
          backPath="/news"
          type="News"
        />
      )}
    </>
  );
};

export default NewsDetails;
