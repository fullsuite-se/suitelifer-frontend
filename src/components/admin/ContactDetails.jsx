import { useState, useEffect } from "react";
import { BookmarkSquareIcon } from "@heroicons/react/24/outline";
import ContentButtons from "./ContentButtons";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useStore } from "../../store/authStore";

const ContactDetails = () => {
  const user = useStore((state) => state.user);

  const defaultContactDetails = {
    websiteEmail: "",
    websiteTel: "",
    websitePhone: "",
    careersEmail: "",
    internshipEmail: "",
    careersPhone: "",
  };

  const [contactDetails, setContactDetails] = useState(defaultContactDetails);

  const [dataUpdated, setDataUpdated] = useState(false);

  const handleContactChange = (e) => {
    setContactDetails((cd) => ({ ...cd, [e.target.name]: e.target.value }));
  };

  const fetchContactDetails = async () => {
    try {
      const response = await api.get("/api/contact");
      response.data.contact && setContactDetails(response.data.contact);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch contact details.");
    }
  };

  useEffect(() => {
    fetchContactDetails();
  }, [dataUpdated]);

  const handlePublishChanges = async () => {
    const hasEmptyFields = Object.values(contactDetails).some(
      (val) => val === "" || val === null
    );

    if (hasEmptyFields) {
      return toast.error("Please fill in all contact fields.");
    }

    try {
      const response = await api.post("/api/contact", {
        ...contactDetails,
        userId: user.id,
      });

      toast.success(response.data.message);
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
          label: "Suitelifer Email",
          name: "websiteEmail",
          value: contactDetails.websiteEmail,
        },
        {
          label: "Suitelifer Telephone",
          name: "websiteTel",
          value: contactDetails.websiteTel,
        },
        {
          label: "Suitelifer Phone",
          name: "websitePhone",
          value: contactDetails.websitePhone,
        },
        {
          label: "Careers Email",
          name: "careersEmail",
          value: contactDetails.careersEmail,
        },
        {
          label: "Internship Email",
          name: "internshipEmail",
          value: contactDetails.internshipEmail,
        },
        {
          label: "Careers Phone",
          name: "careersPhone",
          value: contactDetails.careersPhone,
        },
      ].map(({ label, name, value }, index) => (
        <div key={index} className="mt-4">
          <div className="text-md font-bold font-avenir-black">{label}</div>
          <input
            type="text"
            required
            name={name}
            value={value}
            onChange={handleContactChange}
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
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
