import React, { use } from "react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store/authStore";
import api from "../../utils/axios";
import ImageUploader from "./ImageUploader";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import LoadingAnimation from "../loader/Loading";
function Careers() {
  const user = useStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [dataUpdated, setIsDataUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [files, setFiles] = useState({
    careersMainImage: null,
    careersLeftImage: null,
    careersRightImage: null,
  });

  const defaultCareerImages = {
    careersLeftImage: "",
    careersMainImage: "",
    careersRightImage: "",
  };

  const [careerImages, setCareerImages] = useState(defaultCareerImages);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((f) => ({
        ...f,
        [key]: file,
      }));
    }
    console.log(files[key]);
  };

  const handleUpdateCareerImages = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    let responseOfLeftImage;
    try {
      if (files.careersLeftImage !== null) {
        const formData = new FormData();
        formData.append("file", files.careersLeftImage);
        console.log("Uploading left image");
        const uploadResponse = await api.post(
          "/api/upload-image/careers",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Set cloudinary image url to career image
        careerImages.careersLeftImage = uploadResponse.data.imageUrl;
        console.log(uploadResponse.data.imageUrl);

        //update db
        responseOfLeftImage = await api.patch("/api/content/careers", {
          ...careerImages,
          userId: user.id,
        });
        console.log(responseOfLeftImage);
      }
    } catch (e) {
      console.log("Error updating images.", e);
      toast.error("Something went wrong. Please try again later");
    } finally {
      setIsLoading(false);
      handleCancelBtn();
    }
  };

  const handleCancelBtn = () => {
    setIsEditing(false);
    setFiles({
      careersMainImage: null,
      careersLeftImage: null,
      careersRightImage: null,
    });
  };

  const fetchData = async () => {
    try {
      const response = await api.get("/api/content/careers");
      const data = response.data.careersContent;
      console.log(data);

      setCareerImages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataUpdated]);

  return (
    <section className={`mb-20`}>
      {isLoading ? <LoadingAnimation /> : ""}
      <div
        className={`${
          isEditing ? "" : "hidden"
        } flex flex-row 2xl:flex-row justify-around gap-2 overflow-y-scroll`}
      >
        <ImageUploader
          image={files.careersLeftImage}
          onImageChange={(e) => handleFileChange(e, "careersLeftImage")}
          name="Left"
        />

        <ImageUploader
          image={files.careersMainImage}
          onImageChange={(e) => handleFileChange(e, "careersMainImage")}
          name="Main"
        />

        <ImageUploader
          image={files.careersRightImage}
          onImageChange={(e) => handleFileChange(e, "careersRightImage")}
          name="Right"
        />
      </div>

      <section className="px-[5%] flex gap-10 justify-center m-10">
        <div className="text-center aspect-3/4 flex justify-center items-center size-[18%] bg-primary/5 border text-primary border-dashed rounded-2xl">
          {files.careersLeftImage === null ? (
            <div className="relative group w-full h-full aspect-3/4 rounded-2xl overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={careerImages.careersLeftImage}
                alt="Left Preview"
              />
            </div>
          ) : (
            <div className="relative group w-full h-full aspect-3/4 rounded-2xl overflow-hidden cursor-pointer">
              <img
                className="w-full h-full object-cover"
                src={URL.createObjectURL(files.careersLeftImage)}
                alt="Left Preview"
                onClick={() => {
                  setFiles((f) => ({
                    ...f,
                    careersLeftImage: null,
                  }));
                  setIsDataUpdated(!dataUpdated);
                }}
              />

              <div className="pointer-events-none absolute inset-0 bg-black/60 text-white text-center items-center justify-center hidden group-hover:flex transition duration-300 rounded-2xl">
                <div className="flex flex-col gap-2 justify-center px-4">
                  <div className="flex justify-center">
                    <XMarkIcon className="size-5" />
                  </div>
                  <span className="">Remove this image?</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center aspect-3/4 flex justify-center items-center size-[35%] bg-primary/5 border text-primary border-dashed rounded-2xl">
          {files.careersMainImage !== null ? (
            <div className="relative group w-full h-full aspect-3/4 rounded-2xl overflow-hidden cursor-pointer">
              <img
                className="w-full h-full object-cover"
                src={URL.createObjectURL(files.careersMainImage)}
                alt="Left Preview"
                onClick={() => {
                  setFiles((f) => ({
                    ...f,
                    careersMainImage: null,
                  }));
                  setIsDataUpdated(!dataUpdated);
                }}
              />

              <div className="pointer-events-none absolute inset-0 bg-black/60 text-white text-center items-center justify-center hidden group-hover:flex transition duration-300 rounded-2xl">
                <div className="flex flex-col gap-2 justify-center px-4">
                  <div className="flex justify-center">
                    <XMarkIcon className="size-5" />
                  </div>
                  <span className="">Remove this image?</span>
                </div>
              </div>
            </div>
          ) : (
            "Main Image Preview"
          )}
        </div>

        <div className="text-center aspect-3/4 flex justify-center items-center self-end size-[18%] bg-primary/5 border text-primary border-dashed rounded-2xl">
          {files.careersRightImage !== null ? (
            <div className="relative group w-full h-full aspect-3/4 rounded-2xl overflow-hidden cursor-pointer">
              <img
                className="w-full h-full object-cover"
                src={URL.createObjectURL(files.careersRightImage)}
                alt="Left Preview"
                onClick={() => {
                  setFiles((f) => ({
                    ...f,
                    careersRightImage: null,
                  }));
                  setIsDataUpdated(!dataUpdated);
                }}
              />

              <div className="pointer-events-none absolute inset-0 bg-black/60 text-white text-center items-center justify-center hidden group-hover:flex transition duration-300 rounded-2xl">
                <div className="flex flex-col gap-2 justify-center px-4">
                  <div className="flex justify-center">
                    <XMarkIcon className="size-5" />
                  </div>
                  <span className="">Remove this image?</span>
                </div>
              </div>
            </div>
          ) : (
            "Right Image Preview"
          )}
        </div>
      </section>
      <div className="flex justify-between">
        <div>
          <span className="mb-1 flex text-sm text-gray-400">
            {" "}
            <InformationCircleIcon className="size-5  text-primary/70" />
            &nbsp;Accepted formats: .jpeg, .jpg, .png, .heic
          </span>
          <span className="flex text-sm text-gray-400">
            {" "}
            <ExclamationTriangleIcon className="size-5  text-orange-500/70" />
            &nbsp;Make sure all images are in 3:4 ratio
          </span>
        </div>
        <div className={`${isEditing ? "" : "hidden"} flex gap-2`}>
          <button
            className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 focus:border-primary duration-500 ease-in-out cursor-pointer px-4 rounded-lg text-black"
            onClick={handleCancelBtn}
          >
            Cancel
          </button>
          <button
            className="flex gap-2 items-center justify-center bg-primary hover:bg-primary-hovered duration-500 ease-in-out cursor-pointer px-4 rounded-lg text-white"
            onClick={(e) => handleUpdateCareerImages(e)}
          >
            <CheckIcon className="size-5" /> Publish Changes
          </button>
        </div>
        <div className={`${isEditing ? "hidden" : ""} flex gap-2`}>
          <button
            className={` flex gap-2 items-center justify-center bg-primary hover:bg-primary-hovered duration-500 ease-in-out cursor-pointer px-4 rounded-lg text-white`}
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon className="size-4" /> Edit Images
          </button>
        </div>
      </div>
    </section>
  );
}

export default Careers;
