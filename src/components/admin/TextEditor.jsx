import React, { useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const TextEditor = ({
  title = "",
  description = "",
  handleTitleChange,
  handleDescriptionChange,
  handleSubmit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "text-primary no-underline hover:text-light-primary",
        },
      }),
    ],
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

  const handleLinkClick = () => {
    const previousUrl = editor.getAttributes("link").href;
    setCurrentUrl(previousUrl || ""); // Set the current URL for the modal
    setIsModalOpen(true); // Open the modal
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    const url = currentUrl.trim();

    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
    setIsModalOpen(false); // Close the modal after submission
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
        <LinkIcon className="size-5 cursor-pointer" onClick={handleLinkClick} />
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
           [&_em_strong]:font-inherit      
           [&_a]:text-primary [&_a]:no-underline hover:[&_a]:text-light-primary"
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Enter URL</h2>
            <form onSubmit={handleLinkSubmit}>
              <input
                type="url"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="https://example.com"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  onClick={handleLinkSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="flex justify-center">
        <button className="bg-primary p-3 rounded-md cursor-pointer w-full mx-auto text-white font-avenir-black">
          Publish
        </button>
      </section>
    </form>
  );
};

export default TextEditor;
