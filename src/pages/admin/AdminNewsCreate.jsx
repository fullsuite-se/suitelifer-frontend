import React, { useEffect, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import ContentEditor from "../../components/cms/ContentEditor";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/authStore";
import toast from "react-hot-toast";

const AdminNewsCreate = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [files, setFiles] = useState([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleTitleChange = (content) => {
    setBlogTitle(content);
  };

  const handleDescriptionChange = (content) => {
    setBlogDescription(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        title: blogTitle.trim(),
        article: blogDescription.trim(),
        created_by: user.id,
      };

      const newsResponse = await api.post("/api/add-news", data);

      if (!newsResponse.data?.id) {
        toast.error("Failed to create news. Please try again.");
        return;
      }

      const newsId = newsResponse.data.id;

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        await api.post(
          `/api/upload-save-image/cNews/news/${newsId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (newsResponse.data.isSuccess) {
        toast.success(newsResponse.data.message || "Bite added successfully!");
      } else {
        toast.error(newsResponse.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding Bite:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="p-2 xl:p-3">
      <div className="lg:flex items-center justify-between hidden">
        <div className="flex items-center gap-2">
          <h2 className="font-avenir-black">Create Bite</h2>
          <InformationCircleIcon className="w-4 h-4 text-gray-500" />
        </div>
        <span
          onClick={() => navigate("/app/suitebite")}
          className="font-avenir-black text-red-400 text-sm cursor-pointer"
        >
          Discard Bite
        </span>
      </div>

      <section
        className="p-5 rounded-lg"
        style={{
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
        }}
      >
        <ContentEditor
          handleFileChange={handleFileChange}
          handleTitleChange={handleTitleChange}
          handleDescriptionChange={handleDescriptionChange}
          handleSubmit={handleSubmit}
          type={"news"}
        />
      </section>
    </section>
  );
};

export default AdminNewsCreate;
