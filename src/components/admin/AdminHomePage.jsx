import { useState } from "react";
import toast from "react-hot-toast";
import { EyeIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";
import ContentButtons from "./ContentButtons";

const AdminHomePage = () => {
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
      const response = await api.post("/api/nani/desu/ka", {
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
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex flex-col md:w-full">
          <div className="text-md p-1 font-avenir-black">Home Page Video</div>

          <input
            type="text"
            name="videoURL"
            value={contentDetails.videoURL}
            onChange={(e) => handleContentDetailsChange(e)}
            className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mb-4">
        <ContentButtons
          icon={<EyeIcon className="size-5" />}
          text="Preview Changes"
          handleClick={null}
        />
        <ContentButtons
          icon={<BookmarkSquareIcon className="size-5" />}
          text="Publish Changes"
          handleClick={handlePublishChanges}
        />
      </div>
    </>
  );
};

export default AdminHomePage;
