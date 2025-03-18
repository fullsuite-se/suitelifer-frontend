import { useParams } from "react-router-dom";
import React from "react";
import { toSlug } from "../../utils/slugUrl";
import BlogList from "../../components/guest-blogs/GuestBlogsList";
import ArticleDetails from "../../components/news/ArticleDetails";


const BlogDetails = () => {
  window.scroll(0, 0);

  const { id } = useParams();
  const blogItem = BlogList.find((blog) => blog.id.toString() === id);
  const relatedBlogs = BlogList.filter(
    (blog) => blog.id.toString() !== id
  ).slice(0, 5);


  return (
    <>
      <ArticleDetails
        data={blogItem}
        relatedArticles={relatedBlogs}
        backPath="/blogs"
        type="Blog"
      />
    </>
  );
};

export default BlogDetails;
