import React from "react";
import { useNavigate } from "react-router-dom";

const TopBarBlogs = () => {
  const navigate = useNavigate();

  return (
    <span
      onClick={() => {
        navigate("/app/my-blogs/new-blog");
      }}
      className="font-avenir-black text-primary text-sm cursor-pointer"
    >
      + Create new blog
    </span>
  );
};

export default TopBarBlogs;
