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
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p></p>",
    onUpdate: ({ editor }) => {
      handleDescriptionChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }
  const handleTitleOnChange = (e) => {
    const value = e.target.value;
    const text = ` <h3><strong>${value}</strong></h3>`;
    handleTitleChange(text);
  };

  const handleFileOnChange = (e) => {
    handleFileChange(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <EditorContent
        editor={editor}
        className="border p-2 rounded bg-[--color-accent-1] text-[--color-dark] 
             font-[Avenir-Roman] 
             [&_ul]:list-disc [&_ul]:pl-6 
             [&_ol]:list-decimal [&_ol]:pl-6"
      />
      <section className="flex justify-center">
        <button className="bg-primary p-3 rounded-md cursor-pointer w-[80%] mx-auto text-white font-avenir-black">
          Submit
        </button>
      </section>
    </form>
  );
};

export default ContentEditor;
