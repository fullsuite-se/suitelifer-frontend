import React, { useEffect, useState } from "react";
import GuestBlogCard from "../guest-blogs/GuestBlogCard";
import NewsCardSmall from "../news/NewsCardSmall";
import nothingFoundIcon from "../../assets/gif/nothing-found-icon.gif";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";

const SearchingBlogOrNews = ({ type }) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const searchValue = useStore((state) => state.searchValue);

  useEffect(() => {
    const fetchSearchResult = async () => {
      if (type === "news") {
        try {
          const response = await api.get("/api/all-news", {
            params: searchValue ? { filter: searchValue } : {},
          });
          setFilteredResults(response.data);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      }
    };
    fetchSearchResult();
  }, [searchValue]);

  return (
    <div className="w-full">
      {filteredResults.length > 0 ? (
        <>
          <p className="text-sm md:text-lg text-primary  mb-3">
            Search Results ({filteredResults.length})
          </p>

          {type === "news" ? (
            <div className="layout-small-news-cards gap-4 sm:gap-5">
              {filteredResults.length > 0 &&
                filteredResults.map((news, index) => (
                  <NewsCardSmall
                    key={news.id || index}
                    id={news.id}
                    title={news.title}
                    createdByName={news.createdByName}
                    article={news.article}
                    createdAt={news.createdAt}
                    imgUrls={news.imgUrls}
                  />
                ))}
            </div>
          ) : (
            <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center items-center">
              {filteredResults.length > 0 &&
                filteredResults.map((blog, index) => (
                  <GuestBlogCard
                    key={blog.id || index}
                    id={blog.id}
                    title={blog.title}
                    author={blog.author}
                    article={blog.article}
                    readTime={blog.readTime}
                    created_at={blog.created_at}
                    images={blog.images}
                  />
                ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center text-gray-500 my-30 ">
          <img
            src={nothingFoundIcon}
            alt="No results"
            className="w-20 h-20 mb-3 opacity-70"
          />
          <p className="text-sm opacity-75 text-primary">No results found</p>
        </div>
      )}
    </div>
  );
};

export default SearchingBlogOrNews;
