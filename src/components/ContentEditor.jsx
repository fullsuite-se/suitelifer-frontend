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
    const text = `${value}`;
    handleTitleChange(text);
  };

  const handleFileOnChange = (e) => {
    handleFileChange(e);
  };

  return (
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
        className="border p-2 font-serif font-bold w-full rounded-md"
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
             font-serif
             [&_ul]:list-disc [&_ul]:pl-6 
             [&_ol]:list-decimal [&_ol]:pl-6
             [&_em]:font-inherit
             [&_strong]:font-bold
             [&_strong_em]:font-inherit
             [&_em_strong]:font-inherit"
      />

      <section className="flex justify-center">
        <button className="bg-primary p-3 rounded-md cursor-pointer w-full mx-auto text-white font-avenir-black">
          Publish
        </button>
      </section>
    </form>
  );
};

export default ContentEditor;
