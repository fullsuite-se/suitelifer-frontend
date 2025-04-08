import React, { useState } from "react";
import ContentButtons from "./ContentButtons";
import {
  EyeIcon,
  BookmarkSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

function FAQs() {
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const handleFAQChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const addFAQField = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const deleteFAQ = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const handlePublishChanges = async () => {
    try {
      console.log("Publishing FAQs:", faqs);

      const response = await api.post("/api/jau/salsalcedo", {
        faqs,
        user_id: user.id,
      });

      toast.success(response.data.message);
      setDataUpdated(!dataUpdated);
    } catch (err) {
      console.log(err);
      toast.error("Failed to publish FAQs. Try again.");
    }
  };

  return (
    <>
      <button
        onClick={addFAQField}
        className="btn-light w-full max-w-28 text-left mb-4"
      >
        <div className="flex gap-2 items-center">
          <span>Add FAQ</span>
        </div>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        {faqs.map((faq, index) => (
          <div key={index} className="relative mb-8 p-4 rounded-md ">
            <button
              onClick={() => deleteFAQ(index)}
              className="absolute top-2 right-2 text-black hover:text-red-500"
              title="Delete FAQ"
            >
              <XCircleIcon className="size-5" />
            </button>

            <input
              type="text"
              placeholder={`Question ${index + 1}`}
              value={faq.question}
              onChange={(e) =>
                handleFAQChange(index, "question", e.target.value)
              }
              className="input w-full mb-2 p-2 border rounded-md"
            />
            <textarea
              placeholder={`Answer ${index + 1}`}
              value={faq.answer}
              onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
              className="textarea w-full border rounded-md p-2"
              rows={3}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end mb-30">
        <div className="flex flex-row gap-2 w-fit">
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
      </div>
    </>
  );
}

export default FAQs;
