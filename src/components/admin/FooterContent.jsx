import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import ContentButtons from "./ContentButtons";
import {
  EyeIcon,
  BookmarkSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
function FooterContent() {
  const [certificationImages, setCertificationImages] = useState([]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...certificationImages];
        newImages[index] = [file, reader.result];
        setCertificationImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setCertificationImages([...certificationImages, null]);
  };

  const handlePublishChanges = async () => {
    try {
      Object.entries(files).forEach(([key, value]) => {
        console.log(key, value);
      });

      return;

      const response = await api.post("/api/add-content", {
        ...contentDetails,
        user_id: user.id,
      });

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err.response);
      toast.error(
        "Encountered an error while publishing changes. Try again in a few minutes..."
      );
    }
  };

  return (
    <>
      <button
        onClick={addImageField}
        className="btn-light w-full max-w-41 text-left"
      >
        <div className="flex gap-2">
        <span>Add</span>
        <span>Certification</span>
        </div>
      </button>
      <div className="grid grid-cols-2 gap-4 mb-20">
        {certificationImages.map((img, index) => (
          <div className="mb-8">
            <ImageUploader
              key={index}
              image={img}
              onImageChange={(e) => handleFileChange(e, index)}
              name={`Certification Image ${index + 1}`}
            />
          </div>
        ))}
      </div>
      
    </>
  );
}

export default FooterContent;
