import { useState } from "react";
import toast from "react-hot-toast";
import { EyeIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";

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
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex flex-col md:w-full">
        <div className="flex justify-end gap-2 mb-4">
          <button
            className="btn-primary flex items-center p-2 gap-2"
            // onClick={handlePublishChanges}
          >
            <EyeIcon className="size-7 sm:size-5" />
            <span className="hidden sm:flex w-full items-centerjustify-center">
              Preview
            </span>
          </button>
          <button
            className="btn-primary flex items-center p-2 gap-2"
            onClick={handlePublishChanges}
          >
            <BookmarkSquareIcon className="w-7 sm:w-5" />
            <span className="hidden sm:flex">Publish Changes</span>
          </button>
        </div>
        <div className="text-md p-1 font-avenir-black">Home Page Video</div>
        <div className="flex flex-col items-center p-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
            id="videoUpload"
          />
          <div
            className="max-w-[70%] sm:w-[100%] sm:h-auto border rounded-3xl bg-gray-200 overflow-hidden aspect-video cursor-pointer flex items-center justify-center"
            onClick={() =>
              !videoFile && document.getElementById("videoUpload").click()
            }
          >
            {videoFile ? (
              videoFile.includes("youtube.com") ||
              videoFile.includes("youtu.be") ? (
                <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(
                    videoFile
                  )}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={videoFile}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                />
              )
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center text-center w-full p-3 gap-2">
                <ArrowUpOnSquareIcon className="size-5 sm:size-20" />
                <span className="text-sm sm:text-xl">Upload Video</span>
              </div>
            )}
          </div>

          <div className="flex mt-6 gap-2">
            {videoFile && (
              <button
                type="button"
                onClick={() => document.getElementById("videoUpload").click()}
                className="flex gap-1 p-2 text-sm items-center btn-light"
              >
                <ArrowPathIcon className="size-5" />
                Change Video
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
