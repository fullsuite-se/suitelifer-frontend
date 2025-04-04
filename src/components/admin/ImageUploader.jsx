import React from "react";

const ImageUploader = ({ name, image, onImageChange }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <input
        type="file"
        id={`${name}-upload`}
        accept="image/*"
        className="hidden"
        onChange={(e) => onImageChange(e)}
      />
      <div className="flex gap-2">
        <h3 className="text-md font-avenir-black">{name}</h3>
        <label
          className="cursor-pointer flex items-center px-5 rounded-xl hover:bg-gray-100 hover:underline"
          htmlFor={`${name}-upload`}
        >
          {image === null ? "Upload" : "Change"}
        </label>
        {image && <label
          className="cursor-pointer flex items-center px-5 rounded-xl hover:bg-gray-100 hover:underline"
          htmlFor={`${name}-upload`}
        >
          View
        </label>}
      </div>
      <p>{image && image[0].name}</p>
    </div>
  );
};

export default ImageUploader;
