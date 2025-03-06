import React, { useEffect, useRef, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import TextEditor from "../TextEditor";
import axios from "axios";
import config from "../../config";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");

  const refTitle = useRef();
  const refDesc = useRef();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleTitleChange = (content) => {
    setBlogTitle(content);
  };

  const handleDescriptionChange = (content) => {
    setBlogDescription(content);
  };

  useEffect(() => {
    if (refTitle.current) {
      refTitle.current.innerHTML = blogTitle;
      refDesc.current.innerHTML = blogDescription;
    }
  }, [blogTitle, blogDescription]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!blogTitle.trim() || !blogDescription.trim()) {
      alert("Please write something in the editor.");
      return;
    }

    console.log(blogTitle);
    console.log(blogDescription);

    // console.log("Title: ", blogTitle);
    // console.log("Desc: ", blogDescription);

    // return;

    // if (files.length === 0) {
    //   alert("Please select at least one file before submitting.");
    //   return;
    // }

    const imagesData = new FormData();
    files.forEach((file) => imagesData.append("images", file));

    const eBlogData = {
      title: blogTitle,
      description: blogDescription,
    };

    const uploadBlog = async () => {
      try {
        const responseBlog = await axios.post(
          `${config.apiBaseUrl}/api/add-employee-blog`,
          eBlogData,
          {
            withCredentials: true,
          }
        );

        const eblogId = responseBlog.data.eblog_id;
        const responseImg = await axios.post(
          `${config.apiBaseUrl}/api/upload-image/blogs/${eblogId}`,
          imagesData,
          {
            withCredentials: true,
          }
        );
        console.log("Blog uploaded successfully:", responseBlog.data);
        console.log("File uploaded successfully:", responseImg.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    uploadBlog();
  };

  return (
    <section className="p-2 xl:p-3">
      <div className="lg:flex items-center justify-between hidden">
        <div className="flex items-center gap-2">
          <h2 className="font-avenir-black">Create New Blog</h2>
          <InformationCircleIcon className="w-4 h-4 text-gray-500" />
        </div>
        <span
          onClick={() => navigate("/employee/my-blogs")}
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
          <p className="font-avenir-black text-center">Hernani Domingo</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full "
            multiple
          />
          <TextEditor
            titleChange={handleTitleChange}
            descChange={handleDescriptionChange}
          />

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Publish Blog
          </button>
        </form>
      </section>
    </section>
  );
};

export default BlogCreate;
