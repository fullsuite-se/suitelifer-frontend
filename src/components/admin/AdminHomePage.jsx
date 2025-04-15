import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { EyeIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";
import ContentButtons from "./ContentButtons";
import api from "../../utils/axios";
import { useStore } from "../../store/authStore";

const AdminHomePage = () => {
  // USER DETAILS
  const user = useStore((state) => state.user);

  // HOME DETAILS
  const [homeDetails, setHomeDetails] = useState({
    contentId: null,
    // getInTouchImage: null,
    kickstartVideo: "",
  });

  const handleHomeDetailsChange = (e) => {
    setHomeDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));

    console.log(homeDetails);
  };

  const handlePublishChanges = async () => {
    try {
      const response = await api.patch("/api/content/home", {
        ...homeDetails,
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

  const fetchHomeContent = async () => {
    try {
      const response = await api.get("/api/content/home");

      console.log(response.data);

      setHomeDetails(response.data.homeContent);
    } catch (err) {
      console.log(err);
    }
  };

  // USE EFFECT TRIGGER
  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchHomeContent();
  }, [dataUpdated]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4">
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
