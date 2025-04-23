import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {BookmarkSquareIcon } from "@heroicons/react/24/outline";
import ContentButtons from "./ContentButtons";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";
import atsAPI from "../../utils/atsAPI";
import Information from "./Information";
import { useAddAuditLog } from "../../components/admin/UseAddAuditLog";


const AdminHomePage = () => {
  // USER DETAILS
  const user = useStore((state) => state.user);

  //AUDIT LOG
  const addLog = useAddAuditLog();

  // HOME DETAILS
  const [homeDetails, setHomeDetails] = useState({
    contentId: null,
    getInTouchImage: "",
    kickstartVideo: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleHomeDetailsChange = (e) => {
    setHomeDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));
  };

  const handlePublishChanges = async () => {
    try {
      if (imageFile !== null) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await api.post(
          "/api/upload-image/home",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        homeDetails.getInTouchImage = uploadResponse.data.imageUrl;
      }

      const response = await api.patch("/api/content/home", {
        ...homeDetails,
        user_id: user.id,
      });

      addLog({
        action: "UPDATE",
        description: "Home page content has been updated",
      });

      toast.success(response.data.message);

      setDataUpdated(!dataUpdated);
    } catch (err) {
      toast.error(
        "Encountered an error while publishing changes. Try again in a few minutes..."
      );
    }
  };

  const fetchHomeContent = async () => {
    try {
      const response = await api.get("/api/content/home");

      setHomeDetails(response.data.homeContent);
    } catch (err) {
      console.log(err);
    }
  };

  // USE EFFECT TRIGGER
  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchIndustries();
    fetchHomeContent();
  }, [dataUpdated]);

  const [industries, setIndustries] = useState([]);

  const fetchIndustries = async () => {
    const response = await atsAPI.get("/industries/pr");

    setIndustries(response.data.data);
  };

  const [industryImages, setIndustryImages] = useState({});

  const convertToCamelCase = (name) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  };

  const handleImageUpload = async () => {
    const uploadPromises = industries.map(
      async ({ industryName, industryId }) => {
        const variableName = convertToCamelCase(industryName);

        if (industryImages[variableName]) {
          try {
            const formData = new FormData();
            formData.append("file", industryImages[variableName]);

            const uploadResponse = await api.post(
              "/api/upload-image/home",
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );

            const imageUrl = uploadResponse.data.imageUrl;

            const response = await atsAPI.patch("/industries/pr", {
              industryId,
              imageUrl,
            });

            if (response.data.success) {
              toast.success(`${industryName} Photo Uploaded Successfully`);
            }
          } catch (err) {
            console.log(err);
            toast.error(`Error uploading ${industryName} photo`);
          }
        }
      }
    );

    await Promise.all(uploadPromises);

    handlePublishChanges();
  };

  return (
    <>
      {/* ABOUT HERO IMAGE */}
      <div className="w-full 2xl:w-[50%] mb-3">
        <label className="block font-avenir-black">Get In Touch Image</label>
        <div className="mt-3">
          <input
            className="mb-2 block w-fit text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer"
            type="file"
            name="getInTouchImage"
            accept=".jpeg,.jpg,.png,.heic"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          {/* REMINDERS */}
          <Information
            type={"warning"}
            text={"Make sure your image is a 1:1 ratio"}
          />
          <Information
            type={"info"}
            text={"Recommended: width >= 1080px; height >= 1080px"}
          />
          <Information
            type={"info"}
            text={"Accepted formats: .jpeg, .jpg, .png, .heic"}
          />
          {/* REMINDERS END */}

          {imageFile === null ? (
            homeDetails.getInTouchImage && (
              <div className={`preview mt-4`}>
                <img
                  className="h-72 mt-2 mx-auto"
                  src={homeDetails.getInTouchImage}
                  alt="Preview"
                />
              </div>
            )
          ) : (
            <img
              className="h-72 mt-2 mx-auto"
              src={URL.createObjectURL(imageFile)}
            />
          )}
        </div>
      </div>
      {/* ABOUT HERO IMAGE END */}

      <div className="flex flex-col md:flex-row gap-4 p-2">
        <div className="flex flex-col md:w-full">
          <div className="text-md p-1 font-avenir-black">Home Page Video</div>

          <input
            type="text"
            name="kickstartVideo"
            value={homeDetails.kickstartVideo}
            onChange={(e) => handleHomeDetailsChange(e)}
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="text-md p-2 font-avenir-black">Industry Images</div>

      <div className="p-2">
        <Information
          type={"warning"}
          text={"Make sure your image is a 1:1 ratio"}
        />
        <Information
          type={"info"}
          text={"Recommended: width >= 1080px; height >= 1080px"}
        />
        <Information
          type={"info"}
          text={"Accepted formats: .jpeg, .jpg, .png, .heic"}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
          {industries.map(({ industryName, industryId, imageUrl }, index) => {
            const nameVariable = convertToCamelCase(industryName);

            return (
              <div className="flex flex-col gap-2 py-3" key={index}>
                <label
                  htmlFor={nameVariable}
                  className="text-sm font-medium text-gray-700"
                >
                  {industryName}
                </label>

                <div className={`flex gap-2 ${imageUrl && "flex-col"}`}>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      className="w-[50%] min-h-50"
                      alt={industryName}
                    />
                  )}
                  <input
                    type="file"
                    name={nameVariable}
                    id={industryId}
                    onChange={(e) =>
                      setIndustryImages((ii) => ({
                        ...ii,
                        [e.target.name]: e.target.files[0],
                      }))
                    }
                    className="block w-fit text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer file:cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-20">
        <ContentButtons
          icon={<BookmarkSquareIcon className="size-5" />}
          text="Publish Changes"
          handleClick={handleImageUpload}
        />
      </div>
    </>
  );
};

export default AdminHomePage;
