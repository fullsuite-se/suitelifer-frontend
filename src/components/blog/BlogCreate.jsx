import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import TextEditor from "../TextEditor";

const BlogCreate = () => {
  const navigate = useNavigate();

  return (
    <section className="p-2 xl:p-3">
      <div className="lg:flex items-center justify-between hidden">
        <div className="flex items-center gap-2">
          <h2 className="font-avenir-black">Create New Blog</h2>
          <InformationCircleIcon className="w-4 h-4 text-gray-500" />
        </div>
        <span
          onClick={() => {
            navigate("/employee/my-blogs");
          }}
          className="font-avenir-black text-red-400 text-sm cursor-pointer"
        >
          Discard Blog
        </span>
      </div>

      <section>
        <TextEditor />
      </section>
    </section>
  );
};

export default BlogCreate;
