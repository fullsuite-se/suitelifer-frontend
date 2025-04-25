import React from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
} from "@heroicons/react/24/outline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const ContentEditor = ({
  handleFileChange,
  handleTitleChange,
  handleDescriptionChange,
  handleSubmit,
  type,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    onUpdate: ({ editor }) => {
      handleDescriptionChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }
  const handleTitleOnChange = (e) => {
    const value = e.target.value;
    const text = `${value}`;
    handleTitleChange(text);
  };

  const handleFileOnChange = (e) => {
    handleFileChange(e);
  };

  return (
    <div className="h-[100vh] overflow-auto">
      {type === "newsletter" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {" "}
          <label className="block mb-4">
            <span className="text-primary text-sm ">Section</span>
            <select
              className="border border-gray-400 focus:border-primary outline-none p-2 font-avenir-black w-full rounded-md mt-1"
              onChange={handleTitleOnChange}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Select a section
              </option>
              {[...Array(7)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  Section {index + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-primary text-sm">Title</span>
            <input
              type="text"
              className="border border-gray-400 focus:border-primary outline-none p-2 font-avenir-black w-full rounded-md mb-4"
              onChange={handleTitleOnChange}
              style={{}}
              placeholder="Write the title here"
            />
          </label>
          <label className="">
            <span className="text-primary text-sm">Author</span>
            <input
              type="text"
              className="border border-gray-400 focus:border-primary outline-none p-2 font-avenir-roman w-full rounded-md mb-4"
              onChange={handleTitleOnChange}
              placeholder="Write the pen name (pseudonym) here"
            />
          </label>
          <label>
            <span className="text-primary text-sm ">
              Photos{" "}
              <span className=" text-xs text-gray-400 font-avenir-roman-oblique ">
                Optional — but required for the main article (Section 1)
              </span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileOnChange}
              className="border border-gray-400 focus:border-primary mb-4 outline-none p-2 rounded w-full "
              multiple
            />
          </label>
          <div className="py-1"></div>
          <label className="text-sm text-primary ">
            Write the article below
          </label>
          <div className="flex gap-3 mb-2 mt-3 place-items-center">
            <BoldIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ItalicIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <UnderlineIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ListBulletIcon
              className="size-6 cursor-pointer"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <NumberedListIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </div>
          <div className="border border-gray-400 focus-within:border-primary outline-none p-2 min-h-50 rounded  bg-[--color-accent-1] text-[--color-dark]">
            <EditorContent
              editor={editor}
              className="font-avenir   w-full 
      [&_ul]:list-disc [&_ul]:pl-6 
      [&_ol]:list-decimal [&_ol]:pl-6
      [&_em]:font-inherit
      [&_strong]:font-avenir-black
      [&_strong_em]:font-inherit
      [&_em_strong]:font-inherit"
            />
          </div>
          <section className="flex justify-center">
            <button className="bg-primary p-3 mt-10 rounded-md cursor-pointer w-full mx-auto text-white font-avenir-black">
              Save
            </button>
          </section>
          <section className="flex justify-center">
            <button className=" rounded-md cursor-pointer mx-auto text-primary font-avenir-black">
              Cancel
            </button>
          </section>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileOnChange}
            className="border p-2 rounded w-full "
            multiple
          />

          <input
            type="text"
            className="border p-2 font-avenir-black w-full rounded-md"
            onChange={handleTitleOnChange}
            style={{
              fontSize: "1.17em",
              margin: "0.75em 0",
            }}
            placeholder="Write your title here"
          />
          <div className="flex gap-3 mb-2 place-items-center">
            <BoldIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ItalicIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <UnderlineIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ListBulletIcon
              className="size-6 cursor-pointer"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <NumberedListIcon
              className="size-5 cursor-pointer"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </div>
          <EditorContent
            editor={editor}
            className="border p-2 rounded bg-[--color-accent-1] text-[--color-dark] 
             font-avenir
             [&_ul]:list-disc [&_ul]:pl-6 
             [&_ol]:list-decimal [&_ol]:pl-6
             [&_em]:font-inherit
             [&_strong]:font-avenir-black
             [&_strong_em]:font-inherit
             [&_em_strong]:font-inherit"
          />

          <section className="flex justify-center">
            <button className="bg-primary p-3 rounded-md cursor-pointer w-full mx-auto text-white font-avenir-black">
              Publish
            </button>
          </section>
        </form>
      )}
    </div>
  );
};

export default ContentEditor;
