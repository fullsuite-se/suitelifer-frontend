import { useState, useEffect } from "react";
import { EyeIcon, BookmarkSquareIcon } from "@heroicons/react/24/outline";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";
import ContentButtons from "./ContentButtons";

const ContactDetails = () => {
  const user = useStore((state) => state.user);

  const [contactDetails, setContactDetails] = useState({
    contactPhone: "",
    contactLandline: "",
    contactEmail: "",
    internshipEmail: "",
  });

  const [dataUpdated, setDataUpdated] = useState(false);

  const handleContactChange = (e) => {
    setContactDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));
  };

  const fetchContactDetails = async () => {
    try {
      const response = await api.get("/api/content/");
      setContactDetails({
        contactPhone: response.data.content.contactPhone,
        contactLandline: response.data.content.contactLandline,
        contactEmail: response.data.content.contactEmail,
        internshipEmail:response.data.content.internshipEmail
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch contact details.");
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, [dataUpdated]);

  const handlePublishChanges = async () => {
    try {
      const response = await api.post("/api/add-content", {
        ...contactDetails,
        user_id: user.id,
      });

      toast.success("Contact details updated!");
      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err);
      toast.error("Error updating contact details.");
    }
  };

  return (
    <div className="overflow-x-auto min-h-screen px-4 sm:px-6 lg:px-8">

      {[
        {
          label: "Email",
          name: "contactEmail",
          value: contactDetails.contactEmail,
        },
        {
          label: "Internship Email",
          name: "internshipEmail",
          value: contactDetails.internshipEmail,
        },
        {
          label: "Telephone Number",
          name: "contactLandline",
          value: contactDetails.contactLandline,
        },
        {
          label: "Cellphone Number",
          name: "contactPhone",
          value: contactDetails.contactPhone,
        },
      ].map(({ label, name, value }) => (
        <div key={name} className="mt-4">
          <div className="text-md font-bold font-avenir-black">{label}</div>
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleContactChange}
            className="w-full p-3 resize-none border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}

      <div className="flex justify-end gap-2 mt-6">
        <ContentButtons
          icon={<BookmarkSquareIcon className="size-5" />}
          text="Publish Changes"
          handleClick={handlePublishChanges}
        />
      </div>
    </div>
  );
};

export default ContactDetails;
