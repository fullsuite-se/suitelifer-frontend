import { useState } from "react";
import toast from "react-hot-toast";
import {
  EyeIcon,
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";


const AdminHomePage = ({ handlePreview }) => {


  const handleContentDetailsChange = (e) => {
    setContentDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));

    console.log(contentDetails);
    console.log(user.id);
  };
 
  const [contentDetails, setContentDetails] = useState({
  
    videoURL: "",
  
  });


  const handlePublishChanges = async () => {
    try {
      const response = await api.post("/api/nanidesuka", {
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
      <div className="video-preview w-full">
        <div className="flex justify-end px-4 py-2 gap-2">
          <button
            className="btn-primary flex items-center p-2 gap-2"
            onClick={handlePublishChanges}
          >
            <EyeIcon className="size-7 sm:size-5" />
            <span className="hidden sm:flex w-full items-centerjustify-center">Preview</span>
          </button>
          <button
            className="btn-primary flex items-center p-2 gap-2"
            onClick={handlePublishChanges}
          >
            <BookmarkSquareIcon className="size-7 sm:size-5" />
            <span className="hidden sm:flex">Publish Changes</span>
          </button>
        </div>
        <div className="text-md p-1 font-avenir-black">Home Page Video</div>

<input
        type="text"
        name="videoURL"
        value={contentDetails.videoURL}
        onChange={(e) => handleContentDetailsChange(e)}
        className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-30"
      />
      </div>
    </>
  );
};

export default AdminHomePage;
