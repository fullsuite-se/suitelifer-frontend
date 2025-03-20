import React, { useEffect, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import ContentEditor from "../../components/ContentEditor";
import BlogTags from "../../components/blog/BlogTags";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";

const AdminBlogCreate = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [files, setFiles] = useState([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [tag, setTag] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleTitleChange = (content) => {
    setBlogTitle(content);
  };

  const handleDescriptionChange = (content) => {
    setBlogDescription(content);
  };

  const handleTagChange = (value) => {
    setTag(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tag.length === 0) {
      toast.error("Please select at least 1 tag.");
      return;
    }

    if (!blogTitle.trim() || !blogDescription.trim()) {
      toast.error("Blog title and description cannot be empty.");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least 1 image.");
      return;
    }

    try {
      const data = {
        title: blogTitle.trim(),
        description: blogDescription.trim(),
        userId: user.id,
        tags: tag,
      };

      const blogResponse = await api.post("/api/add-company-blog", data);

      if (!blogResponse.data?.id) {
        toast.error("Failed to create news. Please try again.");
        return;
      }

      const blogId = blogResponse.data.id;
      console.log(blogId);

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        await api.post(
          `/api/upload-save-image/cBlog/blogs/${blogId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (blogResponse.data.isSuccess) {
        toast.success(blogResponse.data.message || "Blog added successfully!");
      } else {
        toast.error(blogResponse.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="p-2 xl:p-3">
      <div className="lg:flex items-center justify-between hidden">
        <div className="flex items-center gap-2">
          <h2 className="font-avenir-black">Create Company Blog</h2>
          <InformationCircleIcon className="w-4 h-4 text-gray-500" />
        </div>
        <span
          onClick={() => navigate("/app/news")}
          className="font-avenir-black text-red-400 text-sm cursor-pointer"
        >
          Discard Blog
        </span>
      </div>

      <section
        className="p-5 rounded-lg"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
        }}
      >
        <section className="my-3">
          <BlogTags onChange={handleTagChange} />
        </section>
        <ContentEditor
          handleFileChange={handleFileChange}
          handleTitleChange={handleTitleChange}
          handleDescriptionChange={handleDescriptionChange}
          handleSubmit={handleSubmit}
          type={"cblog"}
        />
      </section>
    </section>
  );
};

export default AdminBlogCreate;
