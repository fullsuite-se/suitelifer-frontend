import React, { useRef, useEffect } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

const TextEditor = () => {
  const refTitle = useRef(null);
  const refDescription = useRef(null);

  const title = `<h1 style="font-family: avenir-black;">Hello!</h1>`;
  const description = "<p>Hellooo This is the descirption<p>";

  useEffect(() => {
    if (refTitle.current && refDescription.current) {
      refTitle.current.innerHTML = title;
      refDescription.current.innerHTML = description;
    }
  }, []);

  const handleBtnClick = () => {
    console.log(refTitle.current.innerHTML);
    console.log(refDescription.current.innerHTML);
  };

  const handleBoldBtn = () => {
    const content = refDescription.current.firstChild;
    content.style.fontFamily = "avenir-black";
  };

  const handleItalicBtn = () => {
    const content = refDescription.current.firstChild;
    content.style.fontFamily = "avenir-romanoblique";
    content.style.textDecoration = "underline";
  };

  const handleUnderlineBtn = () => {
    const content = refDescription.current.firstChild;
    content.style.textDecoration = "underline";
  };

  return (
    <section>
      <div
        ref={refTitle}
        contentEditable={true}
        className="border focus:border-primary"
      ></div>
      <div
        ref={refDescription}
        contentEditable={true}
        className="border focus:border-primary"
      ></div>
      <section>
        <div className="flex items-center gap-3">
          <BoldIcon className="size-5 cursor-pointer" onClick={handleBoldBtn} />
          <ItalicIcon
            className="size-5 cursor-pointer"
            onClick={handleItalicBtn}
          />
          <UnderlineIcon
            className="size-5 cursor-pointer"
            onClick={handleUnderlineBtn}
          />
          <ListBulletIcon className="size-6 cursor-pointer" />
        </div>
      </section>
    </section>
  );
};

export default TextEditor;
