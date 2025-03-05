import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import TextEditor from "../TextEditor";
import axios from "axios";
import config from "../../config";

const BlogCreate = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file before submitting.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const uploadFile = async () => {
      try {
        const response = await axios.post(
          `${config.apiBaseUrl}/api/upload-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("File uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    uploadFile();
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextEditor />

        {/* File Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
          multiple
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Blog
        </button>
      </form>
    </section>
  );
};

export default BlogCreate;
