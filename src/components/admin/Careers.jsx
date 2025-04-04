import React from "react";
import { useState, useRef, useEffect } from "react";
import ImageUploader from "./ImageUploader";

function Careers() {
  const [files, setFiles] = useState({
    getInTouchImage: null,
    heroImage: null,
    storyImage: null,
    careersMainImage: null,
    careersLeftImage: null,
    careersRightImage: null,
  });

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((f) => ({
          ...f,
          [key]: [file, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    }
    console.log(files[key]);
  };

  return (
    <div className="flex flex-row 2xl:flex-row justify-around gap-2">
      <ImageUploader
        image={files.careersLeftImage}
        onImageChange={(e) => handleFileChange(e, "careersLeftImage")}
        name="Left Image"
      />

      <ImageUploader
        image={files.careersMainImage}
        onImageChange={(e) => handleFileChange(e, "careersMainImage")}
        name="Main Image"
      />

      <ImageUploader
        image={files.careersRightImage}
        onImageChange={(e) => handleFileChange(e, "careersRightImage")}
        name="Right Image"
      />
    </div>
  );
}

export default Careers;
