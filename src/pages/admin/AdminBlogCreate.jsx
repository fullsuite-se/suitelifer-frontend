import React, { useEffect, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import ContentEditor from "../../components/ContentEditor";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/authStore";

const AdminBlogCreate = () => {
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

  const handleSubmit = () => {
    alert("hello");
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
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 mb-3">
            <img
              src="http://sa.kapamilya.com/absnews/abscbnnews/media/2020/tvpatrol/06/01/james-reid.jpg"
              alt="Hernani"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <p className="font-avenir-black text-center">
            {user.first_name} {user.last_name}
          </p>
        </div>
        <ContentEditor
          handleFileChange={handleFileChange}
          handleTitleChange={handleTitleChange}
          handleDescriptionChange={handleDescriptionChange}
          handleSubmit={handleSubmit}
        />
      </section>
    </section>
  );
};

export default AdminBlogCreate;
