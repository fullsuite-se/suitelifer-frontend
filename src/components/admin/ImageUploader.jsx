import React, { forwardRef } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const ImageUploader = forwardRef(({ name, image, onImageChange }, ref) => {
  return (
    <label
      htmlFor={`${name}-upload`}
      className="flex w-full h-full min-h-[120px] rounded-lg cursor-pointer flex-col justify-center items-center bg-primary/5 hover:bg-primary/10 transition"
    >
      <input
        type="file"
        ref={ref}
        id={`${name}-upload`}
        accept=".jpeg,.jpg,.png,.heic"
        className="hidden"
        onChange={(e) => onImageChange(e)}
      />

      <div className="flex flex-col items-center">
        <PlusCircleIcon className="w-10 h-10 text-primary" />
        <h4 className="mt-2 font-avenir-black text-gray-700 text-center">
          {image ? "Change Image" : `Upload ${name} Image`}
        </h4>
      </div>
      <p className="text-xss -mt-4 text-gray-500">Max: 10MB</p>
    </label>
  );
});

export default ImageUploader;
