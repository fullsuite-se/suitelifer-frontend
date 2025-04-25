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

const TextEditor = ({
  title = "",
  description = "",
  handleTitleChange,
  handleDescriptionChange,
  handleSubmit,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: `<h2>${title}</h2><p>${description}</p>`,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const titleContent = content.match(/<h2>(.*?)<\/h2>/)?.[1] || "";
      const descriptionContent = content.replace(/<h2>.*?<\/h2>/, "");

      handleTitleChange(titleContent);
      handleDescriptionChange(descriptionContent);
    },
  });

  if (!editor) return null;

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
  );
};

export default TextEditor;
