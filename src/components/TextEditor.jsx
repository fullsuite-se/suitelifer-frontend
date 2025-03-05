import React, { useRef, useEffect } from "react";
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

const TextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "<p>Hello, <strong> world! <strong/></p>",
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg bg-[--color-light] text-[--color-dark]">
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
             font-[Avenir-Roman] 
             [&_ul]:list-disc [&_ul]:pl-6 
             [&_ol]:list-decimal [&_ol]:pl-6"
      />
    </div>
  );
};

export default TextEditor;
