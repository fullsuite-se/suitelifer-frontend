import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { toSlug } from "../../utils/slugUrl";
import BlogList from "../../components/guest-blogs/GuestBlogsList";
import ArticleDetails from "../../components/news/ArticleDetails";
import api from "../../utils/axios";
import LoadingArticleDetails from "../../components/news/LoadingArticleDetails";

const BlogDetails = () => {
  const location = useLocation();
  const cblog_id = location.state.cblog_id;
  const relatedBlogs = BlogList;

  const [blogDetails, setBlogDetails] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogDetails = async () => {
    try {
      const response = await api.get(`/api/get-company-blog/${cblog_id}`);

      setBlogDetails(response.data.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingArticleDetails />
      ) : (
        <ArticleDetails
          id={blogDetails.cblogId}
          title={blogDetails.title}
          content={blogDetails.description}
          createdAt={blogDetails.createdAt}
          createdBy={blogDetails.createdBy}
          images={blogDetails.images}
          relatedArticles={relatedBlogs}
          backPath="/blogs"
          type="Blog"
        />
      )}
    </>
  );
};

export default BlogDetails;
