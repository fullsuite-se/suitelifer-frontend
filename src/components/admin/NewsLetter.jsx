import { useState } from "react";
import toast from "react-hot-toast";
import { EyeIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";
import { useStore } from "../../store/authStore";
import ImageUploader from "./ImageUploader";
import ContentButtons from "./ContentButtons";
import api from "../../utils/axios";

const NewsLetter = () => {
  const user = useStore((state) => state.user);

  const [files, setFiles] = useState({
    imageUrl: null,
  });

  const [newsletterDetails, setNewsletterDetails] = useState({
    imageUrl: "",
    article: "",
    title: "",
    textPhrase: "",
  });

  const [dataUpdated, setDataUpdated] = useState(false);

  const handleInputChange = (e) => {
    setNewsletterDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((prev) => ({
          ...prev,
          [key]: [file, reader.result],
        }));

        setNewsletterDetails((prev) => ({
          ...prev,
          [key]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishChanges = async () => {
    console.log("user", newsletterDetails);
    try {
      const response = await api.post("/api/add-news", {
        ...newsletterDetails,
        user_id: user.id,
      });

      toast.success(response.data.message);
      setDataUpdated((prev) => !prev);
    } catch (err) {
      console.error(err.response);
      toast.error("Failed to publish newsletter changes. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div>
          <div className="text-md p-1 font-avenir-black">Text Phrase</div>
          <input
            type="text"
            name="textPhrase"
            value={newsletterDetails.textPhrase}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <div className="text-md p-1 font-avenir-black">Title</div>
          <input
            type="text"
            name="title"
            value={newsletterDetails.title}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <ImageUploader
          image={files.imageUrl}
          onImageChange={(e) => handleFileChange(e, "imageUrl")}
          name="Newsletter Image"
        />

        <div>
          <div className="text-md p-1 font-avenir-black">Article</div>
          <textarea
            name="article"
            value={newsletterDetails.article}
            onChange={handleInputChange}
            rows={6}
            className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4 px-4">
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

export default NewsLetter;
